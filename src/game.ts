import { Dictionary, englishDictionary } from "./dictionary";
import Sound, { WordSounds } from "./sound";

export const DEFAULT_ROWS = 6;
export const DEFAULT_COLUMNS = 5;

export type GuessMatch = [Sound, Match];
export type GuessResult = GuessMatch[];
export type GuessHistory = GuessResult[];
export type Answer = [sound: WordSounds, english: string];

export enum Match {
  NO_MATCH,
  SOME_MATCH,
  MATCH,
  INVALID,
}

export enum GameEvent {
  Commit,
  Input,
  Reset,
}

export type GameAction =
  | { type: GameEvent.Commit }
  | { type: GameEvent.Reset; config: GameConfig }
  | {
      type: GameEvent.Input;
      input: WordSounds;
    };

export interface GameState {
  answer: Answer;
  input: WordSounds;
  history: GuessHistory;
  rows: number;
  columns: number;
  gameOver: boolean;
}

export const gameStateReducer: React.Reducer<GameState, GameAction> = (
  state,
  action
) => {
  let { columns, input, answer, history } = state;
  switch (action.type) {
    case GameEvent.Reset:
      console.log("Reset!");
      return { ...initialGameState, ...action.config };
    case GameEvent.Input:
      return { ...state, input: action.input || [] };
    case GameEvent.Commit: {
      if (state.gameOver) {
        return {
          ...state,
          input: [],
        };
      }
      let guess = input;
      if (guess.length === columns) {
        let matchResult = matchGuess(answer, guess);
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
  answer: undefined!,
  rows: DEFAULT_ROWS,
  columns: DEFAULT_COLUMNS,
  input: [],
  history: [],
  gameOver: false,
};

const answersMap = new Map();

const preparePool = (columns: number, dictionary: Dictionary) => {
  let pool: Answer[] = [];
  for (let [head, sounds] of dictionary.transcriptions.entries()) {
    sounds = sounds.filter((wordSound) => wordSound.length === columns);
    if (sounds.length) {
      for (let wordSound of sounds) {
        pool.push([wordSound.map(Sound.from) as WordSounds, head]);
      }
    }
  }
  return pool;
};

export const getAnswerByDate = (columns: number, timestamp: number): Answer => {
  let pool: Answer[];
  if (!answersMap.has(columns)) {
    pool = preparePool(columns, englishDictionary);
    answersMap.set(columns, pool);
  } else {
    pool = answersMap.get(columns);
  }
  timestamp |= 0; // Force it to be an integer
  let answer = pool[timestamp % pool.length];
  return answer;
};

export const matchGuess = (answer: Answer, guess: WordSounds): GuessResult => {
  let wordSoundAnswer = answer[0];
  let soundCount = wordSoundAnswer.reduce(
    (previous, current) => ({
      ...previous,
      [current.name]: (previous[current.name] ?? 0) + 1,
    }),
    {}
  );
  return guess.map((guessedSound, index) => {
    if (wordSoundAnswer.length < index) {
      return [guessedSound, Match.NO_MATCH];
    }
    let expectedSound = wordSoundAnswer[index];
    if (guessedSound.is(expectedSound)) {
      soundCount[guessedSound.name] -= 1;
      return [guessedSound, Match.MATCH];
    } else if (soundCount[guessedSound.name]) {
      soundCount[guessedSound.name] -= 1;
      return [guessedSound, Match.SOME_MATCH];
    } else {
      return [guessedSound, Match.NO_MATCH];
    }
  });
};

export const getAnswerForWord = (word: string): Answer | null => {
  let wordSound = englishDictionary.wordSounds(word);
  if (wordSound.length) {
    return [wordSound[0], word];
  } else {
    return null;
  }
};

export interface GameConfig {
  answer: Answer;
  rows: number;
  columns: number;
}
