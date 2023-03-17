import React from "react";

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

export function translateElement(
  string: string,
  ...args: (string | React.ReactElement)[]
): (string | React.ReactElement)[] {
  const replacements: [[number, number], string | React.ReactElement][] = [];
  for (const [index, replacement] of args.entries()) {
    const indexPair = Array.from(
      string.matchAll(new RegExp(":" + index, "g")),
      (match): [number, number] => [
        match.index!,
        match.index! + match[0].length,
      ],
    );
    for (const pair of indexPair) {
      replacements.push([pair, replacement]);
    }
  }
  replacements.sort(([a], [b]) => a[0] - b[0]);
  const elems = [];
  let index = 0;
  for (const [indices, replacement] of replacements) {
    elems.push(string.slice(index, indices[0]));
    elems.push(replacement);
    index = indices[1];
  }
  elems.push(string.slice(index));
  return elems;
}

/**
 * Count the number of times a value appears in `iterable`.
 * @returns A `Map` where the keys are values in `iterable`,
 *  and the values are the number of times each appears in it.
 */
export function count<T>(iterable: Iterable<T>): Map<T, number> {
  const map = new Map<T, number>();
  for (const value of iterable) {
    map.set(value, (map.get(value) ?? 0) + 1);
  }
  return map;
}

/**
 * Gather the indices where a value appears in `iterable`.
 * @returns A `Map` where the keys are values in `iterable`,
 *  and the values are a `Set` with the indices where the value appears in it.
 */
export function countWithIndex<T>(iterable: Iterable<T>): Map<T, Set<number>> {
  const map = new Map<T, Set<number>>();
  let i = 0;
  for (const value of iterable) {
    let set = map.get(value);
    if (!set) {
      set = new Set();
      map.set(value, set);
    }
    set.add(i);
    i += 1;
  }
  return map;
}

export function getUTCTime(date: Date) {
  return new Date(
    date.getUTCFullYear(),
    date.getUTCMonth(),
    date.getUTCDate(),
    date.getUTCHours(),
    date.getUTCMinutes(),
    date.getUTCSeconds(),
    date.getUTCMilliseconds(),
  ).getTime();
}
