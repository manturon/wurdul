/**
 * Choose and return a random element from `array`.
 */
export function choose<T>(array: readonly T[]): T | undefined {
  return array[Math.floor(Math.random() * array.length)];
}

/**
 * Make an array with a `value` repeated `times` times.
 */
export function repeat<T>(times: number, value: T): T[] {
  return times > 0 ? new Array(times).fill(value) : [];
}

type Provider<T> = (index: number) => T;

export function repeatWithProvider<T>(
  times: number,
  provider: Provider<T>,
): T[] {
  return times > 0
    ? new Array(times).fill(undefined).map((_v, index) => provider(index))
    : [];
}

/**
 * Return a new array from `array` with length `length`, slicing the extra contents
 * in array or padding with `padding` if necessary.
 */
export function adaptArray<T, P = T>(
  array: readonly T[],
  length: number,
  padding: P,
): (T | P)[] {
  if (array.length < length) {
    return extendArray(array, length, padding);
  } else {
    return array.slice(0, length);
  }
}

/**
 * Return a new array from `array` with length `length`.
 */
export function extendArray<T, P = T>(
  array: readonly T[],
  length: number,
  padding: P,
): (T | P)[] {
  return [
    ...array,
    ...(length > array.length ? repeat(length - array.length, padding) : []),
  ];
}

/**
 * Return `string` with the first character upper-cased.
 */
export function capitalize(string: string) {
  return (string[0]?.toUpperCase() ?? "") + string.slice(1);
}

/**
 * Force value into a range by not allowing it to go over a maximum or below a minimum.
 */
export function clamp<T>(value: T, min: T, max: T): T {
  return value < min ? min : value > max ? max : value;
}

/**
 * Force value into a range by wrapping around if it goes over a maximum or below a minimum.
 */
export function wrapAround<T>(value: T, min: T, max: T): T {
  return value < min ? max : value > max ? min : value;
}

export function translate(string: string, ...args: any[]) {
  return args.reduce(
    (string, arg, index) => string.replaceAll(":" + index, arg),
    string,
  );
}
