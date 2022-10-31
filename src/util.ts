export const rangeMap = <T>(n: number, map: (index: number) => T): T[] => {
  let array = new Array(n).fill(null);
  return array.map((_e, index) => map.call(this, index));
};
