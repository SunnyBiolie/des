import { PC1_Index, PC2_Index } from "./constants";
import { hexToBin, leftShift, permutateByConstants } from "./utils";

export interface GenKeyReturnProps {
  PC1: string;
  C0: string;
  D0: string;
  array_Cn: string[];
  array_Dn: string[];
  array_Kn: string[];
}

export const generateKeys = (hexKey: string): GenKeyReturnProps => {
  const binaryKey = hexToBin(hexKey);

  // Tính hoán vị PC1
  const PC1 = permutateByConstants(binaryKey, PC1_Index);

  const C0 = PC1.slice(0, 28);
  const D0 = PC1.slice(28);

  const array_Cn = leftShift(C0);
  const array_Dn = leftShift(D0);

  const array_Kn: string[] = [];

  for (let i = 0; i < array_Cn.length; i++) {
    // Ghép CD
    const CDn = array_Cn[i] + array_Dn[i];
    // Tính hoán vị PC2
    const PC2 = permutateByConstants(CDn, PC2_Index);
    // Gán khóa con K(i)
    array_Kn.push(PC2);
  }

  return { PC1, C0, D0, array_Cn, array_Dn, array_Kn };
};
