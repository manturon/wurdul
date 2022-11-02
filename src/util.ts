const CODE_A = "a".codePointAt(0)!;
const CODE_Z = "z".codePointAt(0)!;

export const isAlphaCi = (char: string) => {
  let code = char[0].codePointAt(0)!;
  return char.length === 1 && code >= CODE_A && code <= CODE_Z;
};

export const rangeMap = <T>(n: number, map: (index: number) => T): T[] => {
  let array = new Array(n).fill(null);
  return array.map((_e, index) => map.call(this, index));
};
