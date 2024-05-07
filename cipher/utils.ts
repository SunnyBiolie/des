import { numberOfLeftShifts } from "./constants";

export const textToHex = (text: string) => {
  let result: string = "";

  for (var i = 0; i < text.length; i++) {
    result += text.charCodeAt(i).toString(16);
  }

  return result;
};

export const hexToText = (hex: string) => {
  let result: string = "";

  for (var i = 0; i < hex.length; i += 2) {
    result += String.fromCharCode(parseInt(hex.substring(i, i + 2), 16));
  }

  return result;
};

export const hexToBin = (hexText: string) => {
  let result: string = "";
  hexText.split("").forEach((char) => {
    result += parseInt(char, 16).toString(2).padStart(4, "0");
  });
  return result;
};

export const binToHex = (binText: string) => {
  const array = splitIntoNCharArray(binText, 4);

  let result: string = "";
  array.forEach((item) => {
    result += parseInt(item, 2).toString(16).toUpperCase();
  });
  return result;
};

export const splitIntoNCharArray = (text: string, itemLength: number) => {
  const array: string[] = [];
  let index: number = 0;
  let count: number = 1;
  text.split("").forEach((char) => {
    if (count > itemLength) {
      index++;
      count = 1;
    }

    if (count === 1) {
      array[index] = char;
    } else array[index] += char;

    count++;
  });

  return array;
};

export const getXOR_Binary = (binary_1: string, binary_2: string) => {
  let result = "";
  for (let i = 0; i < binary_1.length; i++) {
    if (binary_1[i] === binary_2[i]) {
      result += "0";
    } else result += "1";
  }

  return result;
};

export const permutateByConstants = (
  binaryMessage: string,
  constantIndex: number[][]
) => {
  let result: string = "";

  constantIndex.forEach((row) => {
    row.forEach((indexPlus) => {
      result += binaryMessage[indexPlus - 1];
    });
  });

  return result;
};

export const displayWithSpace = (str: string, length: number) => {
  let result = "",
    count = 0;

  for (let i = 0; i < str.length; i++) {
    if (count === length) {
      result += " ";
      count = 0;
    }
    result += str[i];
    count++;
  }

  return result;
};

/**
 * Dịch vòng trái một chuỗi 28 ký tự nhị phân theo bảng dịch vòng cho trước (16 lần dịch vòng),
 * kết quả của vòng trước là bắt đầu của vòng sau.
 *
 * Kết quả trả về là một mảng gồm 16 phần tử là kết quả của những lần dịch vòng.
 *
 * @param {String} binText
 */
export const leftShift = (binText: string) => {
  const array: string[] = [];
  let init = binText;
  numberOfLeftShifts.forEach((value) => {
    const result = init.substring(value) + init.slice(0, value);
    array.push(result);
    init = result;
  });

  return array;
};
