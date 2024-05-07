"use client";

import { useState, type Dispatch, type SetStateAction } from "react";

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
import { encryptDES, type EncryptResultType } from "@/cipher/encrypt";
import { decryptDES } from "@/cipher/decrypt";

const formHexSchema = z.object({
  message: z
    .string()
    .length(16, { message: "Message là 16 ký tự hexadecimal" }),
  key: z.string().length(16, { message: "Key là 16 ký tự hexadecimal" }),
});

interface FormHexProps {
  setKeys: Dispatch<SetStateAction<string[] | null>>;
  setResult: Dispatch<SetStateAction<EncryptResultType | null>>;
}

const FormHex = ({ setKeys, setResult }: FormHexProps) => {
  const [action, setAction] = useState<"encrypt" | "decrypt">("encrypt");

  const form = useForm<z.infer<typeof formHexSchema>>({
    resolver: zodResolver(formHexSchema),
    defaultValues: {
      message: "",
      key: "",
    },
  });

  function onSubmit(values: z.infer<typeof formHexSchema>) {
    const { PC1, C0, D0, array_Cn, array_Dn, array_Kn } = generateKeys(
      values.key
    );
    setKeys(array_Kn);
    if (action === "encrypt") {
      const result = encryptDES(values.message, array_Kn);
      setResult(result);
    } else if (action === "decrypt") {
      const result = decryptDES(values.message, array_Kn);
      setResult(result);
    }
  }

  return (
    <div className="w-[300px] p-6 rounded-md bg-slate-900">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <div className="space-y-4">
            <FormField
              control={form.control}
              name="message"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nhập bản rõ M</FormLabel>
                  <FormControl>
                    <Input placeholder="Message" maxLength={16} {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
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
          <Button type="submit">Submit</Button>
        </form>
      </Form>
    </div>
  );
};

export default FormHex;
