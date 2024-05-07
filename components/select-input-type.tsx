"use client";

import { type Dispatch, type SetStateAction } from "react";

import { Button } from "@/components/ui/button";

interface SelectInputTypeProps {
  inputType: "hex" | "file";
  setInputType: Dispatch<SetStateAction<"hex" | "file">>;
}

export const SelectInputType = ({
  inputType,
  setInputType,
}: SelectInputTypeProps) => {
  return (
    <div className="flex items-center justify-center gap-x-4">
      <Button
        variant={inputType === "hex" ? "secondary" : "outline"}
        onClick={() => setInputType("hex")}
      >
        Hex
      </Button>
      <Button
        variant={inputType === "file" ? "secondary" : "outline"}
        onClick={() => setInputType("file")}
      >
        File
      </Button>
    </div>
  );
};
