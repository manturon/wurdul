import { ReactNode } from "react";
import { englishDictionary } from "./dictionary";
import Sound, { SoundKey, WordSound } from "./sound";

export const DICTIONARY = englishDictionary;

export const DEFAULT_ROWS = 6;
export const DEFAULT_COLUMNS = 5;

export type GuessMatch = [Sound, Match];
export type GuessResult = GuessMatch[];
export type GuessHistory = GuessResult[];
export type SoundMatchStatus = Map<Sound, Match>;
export type Answer = [sound: WordSound, english: string];

export enum Match {
  UNKNOWN = "unknown",
  NO_MATCH = "no",
  SOME_MATCH = "some",
  MATCH = "match",
}

export enum GameEvent {
  INFO = "info",
  COMMIT = "commit",
  INPUT = "input",
  RESET = "reset",
}

export type GameAction =
  | { type: GameEvent.COMMIT }
  | { type: GameEvent.RESET; config: GameConfig }
  | { type: GameEvent.INFO; message: ReactNode }
  | {
      type: GameEvent.INPUT;
      input: WordSound;
    };

export interface GameState {
  answer: Answer | null;
  input: WordSound;
  history: GuessHistory;
  rows: number;
  columns: number;
  gameOver: boolean;
  info?: ReactNode;
}

export const gameStateReducer: React.Reducer<GameState, GameAction> = (
  state,
  action
) => {
  let { columns, input, answer, history } = state;
  switch (action.type) {
    case GameEvent.INFO:
      return { ...state, info: action.message || undefined };
    case GameEvent.RESET:
      console.log("Reset!");
      return { ...initialGameState, ...action.config };
    case GameEvent.INPUT:
      return { ...state, input: action.input || [] };
    case GameEvent.COMMIT: {
      if (state.gameOver) {
        return {
          ...state,
          input: [],
        };
      }
      let guess = input;
      if (guess.length === columns) {
        let matchResult = matchGuess(answer!, guess);
        let newHistory = [...history, matchResult];
        let gameOver = history.length === columns;
        return {
          ...state,
          input: [],
          history: newHistory,
          gameOver,
        };
      }
      return state;
    }
    default:
      throw new Error("Unknown action dispatched: " + action);
  }
};

export const initialGameState: GameState = {
  answer: null,
  rows: DEFAULT_ROWS,
  columns: DEFAULT_COLUMNS,
  input: [],
  history: [],
  gameOver: false,
};

const answersMap = new Map();

export const getAnswerByDate = async (
  columns: number,
  timestamp: number
): Promise<Answer> => {
  let pool: Map<string, WordSound[]>;
  if (!answersMap.has(columns)) {
    pool = await DICTIONARY.filterByLength(columns);
    answersMap.set(columns, pool);
  } else {
    pool = answersMap.get(columns);
  }
  timestamp |= 0; // Force it to be an integer
  let [word, wordSounds] = [...pool.entries()][timestamp % pool.size];
  let wordSound = wordSounds[timestamp % wordSounds.length];
  return [wordSound, word];
};

export const matchGuess = (answer: Answer, guess: WordSound): GuessResult => {
  let wordSoundAnswer = answer[0];
  let soundCount = wordSoundAnswer.reduce(
    (previous, current) => ({
      ...previous,
      [current.name]: (previous[current.name] ?? 0) + 1,
    }),
    {}
  );
  return guess
    .map((guessedSound, index): GuessMatch => {
      if (wordSoundAnswer.length < index) {
        return [guessedSound, Match.NO_MATCH];
      }
      let expectedSound = wordSoundAnswer[index];
      if (guessedSound.is(expectedSound)) {
        soundCount[guessedSound.name] -= 1;
        return [guessedSound, Match.MATCH];
      } else {
        return [guessedSound, Match.NO_MATCH];
      }
    })
    .map(([guessedSound, match]): GuessMatch => {
      if (match === Match.MATCH) {
        return [guessedSound, match];
      } else if (soundCount[guessedSound.name]) {
        soundCount[guessedSound.name] -= 1;
        return [guessedSound, Match.SOME_MATCH];
      } else {
        return [guessedSound, Match.NO_MATCH];
      }
    });
};

export const getAnswerForWord = async (
  word: string
): Promise<Answer | null> => {
  let wordSound = await DICTIONARY.wordSounds(word);
  if (wordSound.length) {
    return [wordSound[0], word];
  } else {
    return null;
  }
};

const ALL_UNKNOWN_MATCH = new Map(
  Array.from(Sound.all, sound => [sound, Match.UNKNOWN])
);

export const getSoundMatchStatus = (
  history: GuessHistory
): SoundMatchStatus => {
  if (!history.length) {
    return ALL_UNKNOWN_MATCH;
  }
  let matchMap = new Map(ALL_UNKNOWN_MATCH);
  for (let entry of history) {
    for (let [sound, match] of entry) {
      let currentMatch = matchMap.get(sound);
      if (currentMatch === Match.MATCH || currentMatch === Match.NO_MATCH) {
        continue;
      }
      matchMap.set(sound, match);
    }
  }
  return matchMap;
};

export interface GameConfig {
  answer: Answer | null;
  rows: number;
  columns: number;
}
