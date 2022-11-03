import Sound, { WordSounds } from "./sound";

export const DEFAULT_ROWS = 6;
export const DEFAULT_COLUMNS = 5;

export type Input = WordSounds;
export type GuessMatch = [Sound, Match];
export type GuessResult = GuessMatch[];
export type GuessHistory = GuessResult[];

export enum Match {
  NO_MATCH,
  SOME_MATCH,
  MATCH,
  INVALID,
}

export enum GameEvent {
  Input,
  Reset,
}

export interface GameAction {
  type: GameEvent;
  payload?: any;
}

export interface GameState {
  answer: WordSounds;
  input: WordSounds;
  history: GuessHistory;
  rows: number;
  columns: number;
}
