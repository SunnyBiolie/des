import {
  P_Index,
  S1DecimalSelector,
  S2DecimalSelector,
  S3DecimalSelector,
  S4DecimalSelector,
  S5DecimalSelector,
  S6DecimalSelector,
  S7DecimalSelector,
  S8DecimalSelector,
  eBitSelector_Index,
} from "./constants";
import { getXOR_Binary, splitIntoNCharArray } from "./utils";

/**
 *
 * @param {String} Rn_Binary n start from 0, 32 bit
 * @param {String} Knpp_Binary n + 1
 *
 * @example feistel(R0, K1) {}
 */
export default function feistel(Rn_Binary: string, Knpp_Binary: string) {
  // Mở rộng nửa phải
  const getExpandHalfRight = (Rn_Binary: string) => {
    let E_Rn: string = "";

    eBitSelector_Index.forEach((row) => {
      row.forEach((indexPlus) => {
        E_Rn += Rn_Binary[indexPlus - 1];
      });
    });

    return E_Rn;
  };

  const E_Rn_Binary = getExpandHalfRight(Rn_Binary);

  // XOR khóa (K n+1 và Expand Right n)
  const XOR_Result = getXOR_Binary(Knpp_Binary, E_Rn_Binary);
  const array_XOR_Result_inSixbit = splitIntoNCharArray(XOR_Result, 6);

  // Thế S-box
  const getSBox_npp = (sixBitBinary: string, indexPlus: number) => {
    const selectRow = sixBitBinary[0] + sixBitBinary[5];
    let x: number = 0;
    if (selectRow === "00") x = 0;
    else if (selectRow === "01") x = 1;
    else if (selectRow === "10") x = 2;
    else if (selectRow === "11") x = 3;

    const selectColumn = sixBitBinary.slice(1, 5);
    const y = parseInt(selectColumn, 2);

    let decimalResult: number;
    switch (indexPlus) {
      case 1:
        decimalResult = S1DecimalSelector[x][y];
        break;
      case 2:
        decimalResult = S2DecimalSelector[x][y];
        break;
      case 3:
        decimalResult = S3DecimalSelector[x][y];
        break;
      case 4:
        decimalResult = S4DecimalSelector[x][y];
        break;
      case 5:
        decimalResult = S5DecimalSelector[x][y];
        break;
      case 6:
        decimalResult = S6DecimalSelector[x][y];
        break;
      case 7:
        decimalResult = S7DecimalSelector[x][y];
        break;
      case 8:
        decimalResult = S8DecimalSelector[x][y];
        break;
    }

    return decimalResult!.toString(2).padStart(4, "0");
  };

  let sBox_Binary = "";
  array_XOR_Result_inSixbit.forEach((sixBitBinary, index) => {
    sBox_Binary += getSBox_npp(sixBitBinary, index + 1);
  });

  // Hoán vị P
  const permutateP = (sBox_Binary: string) => {
    let P: string = "";

    P_Index.forEach((row) => {
      row.forEach((indexPlus) => {
        P += sBox_Binary[indexPlus - 1];
      });
    });

    return P;
  };

  const P_Binary = permutateP(sBox_Binary);

  return { E_Rn_Binary, XOR_Result, sBox_Binary, P_Binary };
}
