"use client";

import {
  ElementRef,
  useRef,
  useState,
  type Dispatch,
  type SetStateAction,
} from "react";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

import { generateKeys } from "@/cipher/generateKeys";
import { binToHex, hexToText, textToHex } from "@/cipher/utils";
import { encryptDES, type EncryptResultType } from "@/cipher/encrypt";
import { decryptDES } from "@/cipher/decrypt";
import { LoaderCircle } from "lucide-react";

const formFileSchema = z.object({
  key: z.string().length(16, { message: "Key là 16 ký tự hexadecimal" }),
});

interface FormHexProps {
  setKeys: Dispatch<SetStateAction<string[] | null>>;
  setResult?: Dispatch<SetStateAction<EncryptResultType | null>>;
}

export const FormFile = ({ setKeys, setResult }: FormHexProps) => {
  const inputFileRef = useRef<ElementRef<"input">>(null);

  const [base64, setBase64] = useState<string | null>(null);
  const [action, setAction] = useState<"encrypt" | "decrypt">("encrypt");

  const form = useForm<z.infer<typeof formFileSchema>>({
    resolver: zodResolver(formFileSchema),
    defaultValues: {
      key: "",
    },
  });

  function onSubmit(values: z.infer<typeof formFileSchema>) {
    if (base64) {
      const { array_Kn } = generateKeys(values.key);
      setKeys(array_Kn);
      const prefix = base64.split("base64,")[0] + "base64,";
      let resOfBase64 = base64.split("base64,")[1];

      if (action === "encrypt") {
        const base64Length = resOfBase64.length;

        const step = 64;
        const startIndex = 1000;
        const loopTime =
          Math.floor(base64Length / 2 / (step + 16)) < 2000
            ? Math.floor(base64Length / 2 / (step + 16))
            : 2000;

        console.log("Encrypt", "\nSố lần chạy:", loopTime, "\nProcessing...");

        const encrypt = (index: number) => {
          let message = "";
          for (let i = index; i < index + 8; i++) {
            message += resOfBase64[i];
          }
          message = textToHex(message);
          const result = encryptDES(message, array_Kn);
          // setResult(result);

          resOfBase64 =
            resOfBase64.substring(0, index) +
            binToHex(result.result) +
            resOfBase64.substring(index + 8);
        };

        for (let i = startIndex; i <= startIndex + step * loopTime; i += step) {
          encrypt(i);
        }

        resOfBase64 =
          resOfBase64.substring(0, 500) +
          loopTime.toString().padStart(4, "0") +
          resOfBase64.substring(500);

        downloadPDF(prefix, resOfBase64, "encrypted");
      } else if (action === "decrypt") {
        const loopTime = +resOfBase64.slice(500, 504);

        console.log("Decrypt", "\nSố lần chạy:", loopTime, "\nProcessing...");

        resOfBase64 =
          resOfBase64.substring(0, 500) + resOfBase64.substring(504);

        const decrypt = (index: number) => {
          let message = "";
          for (let i = index; i < index + 16; i++) {
            message += resOfBase64[i];
          }

          const result = decryptDES(message, array_Kn);

          const text = hexToText(binToHex(result.result));

          resOfBase64 =
            resOfBase64.substring(0, index) +
            text +
            resOfBase64.substring(index + 16);
        };

        const step = 64 - 8;
        const startIndex = 1000;
        for (let i = startIndex; i <= startIndex + step * loopTime; i += step) {
          decrypt(i);
        }

        downloadPDF(prefix, resOfBase64, "decrypted");
      }
    }
    console.log("Done");
  }

  function downloadPDF(prefix: string, resOfBase64: string, filename: string) {
    const linkSource = prefix + resOfBase64;
    const downloadLink = document.createElement("a");
    const fileName = `${filename}.pdf`;
    downloadLink.href = linkSource;
    downloadLink.download = fileName;
    downloadLink.click();
  }

  const onFileChange = () => {
    if (inputFileRef.current) {
      const selectedFile = inputFileRef.current.files!;
      if (selectedFile.length > 0) {
        const fileToLoad = selectedFile[0];
        const fileName = fileToLoad.name;
        if (fileName.split(".").pop() !== "pdf") {
          inputFileRef.current.value = "";
          return;
        }
        const fileReader = new FileReader();
        let base64: string;
        fileReader.onload = function (fileLoadedEvent) {
          base64 = fileLoadedEvent.target!.result as string;
          setBase64(base64);

          console.log(base64);
          console.log(base64.length);
        };
        // Convert data to base64
        fileReader.readAsDataURL(fileToLoad);
      }
    }
  };

  return (
    <div className="w-[300px] p-6 rounded-md bg-slate-900">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <div className="space-y-4">
            <FormItem>
              <FormLabel>Chọn file cần mã hóa</FormLabel>
              <FormControl>
                <Input
                  ref={inputFileRef}
                  type="file"
                  accept=".pdf"
                  onChange={onFileChange}
                  className="file:text-sm file:font-semibold file:text-violet-600 hover:cursor-pointer"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
            <FormField
              control={form.control}
              name="key"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nhập khóa K</FormLabel>
                  <FormControl>
                    <Input placeholder="Key" maxLength={16} {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <RadioGroup
            defaultValue="encrypt"
            className="flex items-center gap-x-4"
          >
            <div className="flex items-center space-x-2">
              <RadioGroupItem
                value="encrypt"
                onClick={() => setAction("encrypt")}
              />
              <Label>Encrypt</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem
                value="decrypt"
                onClick={() => setAction("decrypt")}
              />
              <Label>Decrypt</Label>
            </div>
          </RadioGroup>
          <Button type="submit" disabled={base64 ? false : true}>
            Submit
          </Button>
        </form>
      </Form>
      {/* <div className="fixed top-0 left-0 size-full flex flex-col items-center justify-center bg-slate-950/50 z-50">
          <LoaderCircle className="size-8 animate-spin" />
        </div> */}
    </div>
  );
};
