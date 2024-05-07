"use client";

import { useState } from "react";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { ScrollArea } from "@/components/ui/scroll-area";

import FormHex from "@/components/form/hex";
import { binToHex } from "@/cipher/utils";
import { type EncryptResultType } from "@/cipher/encrypt";
import { SelectInputType } from "@/components/select-input-type";
import { FormFile } from "@/components/form/file";
import { DecryptResultType } from "@/cipher/decrypt";

const HomePage = () => {
  const [inputType, setInputType] = useState<"hex" | "file">("hex");

  const [keys, setKeys] = useState<string[] | null>(null);
  const [result, setResult] = useState<
    EncryptResultType | DecryptResultType | null
  >(null);

  return (
    <div className="h-full w-full flex items-center justify-center px-8 py-4 gap-x-8">
      <div className="flex flex-col items-center justify-center gap-y-8">
        <SelectInputType inputType={inputType} setInputType={setInputType} />
        {inputType === "hex" ? (
          <>
            <FormHex setKeys={setKeys} setResult={setResult} />
          </>
        ) : (
          inputType === "file" && (
            <FormFile setKeys={setKeys} setResult={setResult} />
          )
        )}
        {result && (
          <div className="bg-slate-100 text-slate-900 font-medium p-4 rounded-md">
            {binToHex(result.result)}
          </div>
        )}
      </div>
      <div className="h-full">
        <ScrollArea className="w-fit h-full">
          {keys && result && (
            <div className="flex gap-x-12 p-6 h-full rounded-md bg-slate-900 overflow-auto">
              {keys && (
                <div>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="w-[80px] text-center">
                          i
                        </TableHead>
                        <TableHead className="w-[200px]">
                          K<sub>i</sub>
                        </TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {keys.map((key, index) => (
                        <TableRow key={index}>
                          <TableCell className="font-medium text-center">
                            {index + 1}
                          </TableCell>
                          <TableCell>{binToHex(key)}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              )}
              {result && (
                <div>
                  <Table>
                    <TableHeader>
                      <TableRow className="font-medium">
                        <TableHead className="w-[80px] text-center">
                          i
                        </TableHead>
                        <TableHead className="w-[150px]">
                          L<sub>i</sub>
                        </TableHead>
                        <TableHead className="w-[150px]">
                          R<sub>i</sub>
                        </TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {result.array_Ln.map((Ln, index) => (
                        <TableRow key={index}>
                          <TableCell className="font-medium text-center">
                            {index}
                          </TableCell>
                          <TableCell>{binToHex(Ln)}</TableCell>
                          <TableCell>
                            {binToHex(result.array_Rn[index])}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              )}
            </div>
          )}
        </ScrollArea>
      </div>
    </div>
  );
};

export default HomePage;
