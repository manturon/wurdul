const CODE_A = "a".codePointAt(0)!;
const CODE_Z = "z".codePointAt(0)!;

export const isAlphaCharCi = (char: string) => {
  const code = char[0].codePointAt(0)!;
  return char.length === 1 && code >= CODE_A && code <= CODE_Z;
};

export const rangeMap = <T>(n: number, map: (_index: number) => T): T[] => {
  const array = new Array(n).fill(null);
  return array.map((_e, index) => map.call(this, index));
};

export const keyGoesUp = (key: string) => {
  return key === "ArrowUp" || key === "PageUp";
};

export const keyGoesDown = (key: string) => {
  return key === "ArrowDown" || key === "PageDown";
};
