import Sound, { WordSounds } from "./sound";

export const DEFAULT_ROWS = 6;
export const DEFAULT_COLUMNS = 5;

export type Input = WordSounds;
export type GuessMatch = [Sound, Match];
export type GuessResult = GuessMatch[];
export type GuessHistory = GuessResult[];

export enum InputMode {
  SOUNDS,
  ENGLISH,
}
export enum Match {
  NO_MATCH,
  SOME_MATCH,
  MATCH,
  INVALID,
}
