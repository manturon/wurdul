import { ReactNode } from "react";
import { englishDictionary } from "./dictionary";
import Sound, { WordSound } from "./sound";

export const DICTIONARY = englishDictionary;

export const DEFAULT_ROWS = 6;

export type GuessMatch = [Sound, Match];
export type GuessResult = GuessMatch[];
export type GuessHistory = GuessResult[];
export type SoundMatchStatus = Map<Sound, Match>;
export type Answer = { sound: WordSound; word: string, day?: number };

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
  answer: Answer;
  input: WordSound;
  history: GuessHistory;
  rows: number;
  gameOver: boolean;
  won: boolean;
  info?: ReactNode;
}

export const gameStateReducer: React.Reducer<GameState, GameAction> = (
  state,
  action
) => {
  let { input, answer, history, rows } = state;
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
      if (answer) {
        if (guess.length === answer.sound.length) {
          let matchResult = matchGuess(answer!, guess);
          let newHistory = [...history, matchResult];

          let gameOver = false;
          let won = false;
          if (isAllMatch(matchResult)) {
            won = true;
            gameOver = true;
          } else {
            gameOver = newHistory.length === rows;
          }

          return {
            ...state,
            won,
            input: [],
            history: newHistory,
            gameOver,
          };
        }
      }
      return state;
    }
    default:
      throw new Error("Unknown action dispatched: " + action);
  }
};

export const initialGameState: Omit<GameState, "answer"> = {
  rows: DEFAULT_ROWS,
  input: [],
  history: [],
  gameOver: false,
  won: false,
};

export const WURDUL_EPOCH = new Date(2022, 10, 12);

export const getWurdulDayForDate = (date: Date) =>
  Math.floor((date.getTime() - WURDUL_EPOCH.getTime()) / 1000 / 60 / 60 / 24);

export const getAnswerForDate = async (date: Date): Promise<Answer> => {
  // Get number of days since the Wurdul Epoch
  let index = getWurdulDayForDate(date);
  let subindex = index;
  let answer = await DICTIONARY.getAnswer(index, subindex);
  if (!answer) {
    throw new Error("Could not get answer for date: " + date);
  }
  let [word, rawTranscription] = answer;
  return {
    sound: DICTIONARY.rawTranscriptionToWordSound(rawTranscription),
    word,
    day: index
  };
};

export const getAnswerForWord = async (
  word: string
): Promise<Answer | null> => {
  let wordSound = await DICTIONARY.wordSounds(word);
  if (wordSound.length) {
    return { sound: wordSound[0], word };
  } else {
    return null;
  }
};

export const matchGuess = (answer: Answer, guess: WordSound): GuessResult => {
  let { sound } = answer;
  let soundCount = sound.reduce(
    (previous, current) => ({
      ...previous,
      [current.name]: (previous[current.name] ?? 0) + 1,
    }),
    {}
  );
  return guess
    .map((guessedSound, index): GuessMatch => {
      if (sound.length < index) {
        return [guessedSound, Match.NO_MATCH];
      }
      let expectedSound = sound[index];
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

export const isAllMatch = function (matchMap: GuessResult) {
  return matchMap.every(match => match[1] === Match.MATCH);
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
  answer: Answer;
  rows: number;
}
