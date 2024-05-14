import { IP_Index, IP_Inverse_Index } from "./constants";
import feistel from "./feistel";
import { getXOR_Binary, hexToBin, permutateByConstants } from "./utils";

export type EncryptResultType = {
  array_Ln: string[];
  array_Rn: string[];
  result: string;
};

/**
 * @param {String} messHex Hexadecimal message
 * @param {String[]} array_Kn Array of 16 keys
 */
export const encryptDES = (
  messHex: string,
  array_Kn: string[]
): EncryptResultType => {
  const M_Bin = hexToBin(messHex);
  // Hoán vị IP
  const IP = permutateByConstants(M_Bin, IP_Index);

  const L0 = IP.slice(0, 32);
  const R0 = IP.slice(32);

  const array_Ln: string[] = [L0];
  const array_Rn: string[] = [R0];

  let Ln: string = L0,
    Rn: string = R0;
  // Lập 16 vòng
  array_Kn.forEach((key, index) => {
    const tempRn = Rn;
    const { E_Rn_Binary, XOR_Result, sBox_Binary, P_Binary } = feistel(Rn, key);
    Rn = getXOR_Binary(Ln, P_Binary);
    Ln = tempRn;

    array_Ln.push(Ln);
    array_Rn.push(Rn);
  });

  // Hoán vị IP-1 --- Lấy R16+L16 để tính
  const result = permutateByConstants(Rn + Ln, IP_Inverse_Index);

  return { array_Ln, array_Rn, result };
};
