import { choose } from "../util";
import { Dictionary } from "./dictionary";
import { Match } from "./matching";
import { getTranscript, RawTranscript, Transcript, Word } from "./transcript";

/**
 * All the row matches in order of commit.
 */
export type MatchHistory = [match: Match, text: string][];

export enum AnswerType {
  DAILY,
  RANDOM,
  CUSTOM,
}

/**
 * The target transcription and the word where it comes from.
 */
export interface Answer {
  readonly transcript: Transcript;
  readonly words: Word[];
  readonly type: AnswerType;
  readonly index?: number;
}

export enum InvalidInputReason {
  EMPTY,
  TOO_SHORT,
  TOO_LONG,
  NOT_IN_WORD_LIST,
}

export function randomAnswer(dictionary: Dictionary): Answer {
  const n = (Math.random() * dictionary.answers.length) | 0;
  const [transcript, words] = dictionary.answerByNumber(n);
  return {
    index: undefined,
    transcript,
    type: AnswerType.RANDOM,
    words,
  };
}

export const WURDUL_EPOCH = new Date(2022, 10, 12).getTime();

export const getWurdulDayForDate = (date: number) =>
  Math.floor((date - WURDUL_EPOCH) / 1000 / 60 / 60 / 24);

export function answerForDate(
  dictionary: Dictionary,
  date: number,
): Answer {
  const n = getWurdulDayForDate(date);
  const [transcript, words] = dictionary.answerByNumber(n);
  return {
    index: n,
    transcript,
    type: AnswerType.DAILY,
    words,
  };
}

export function checkValidity(dictionary: Dictionary, expected: Answer, word?: string, transcript?: Transcript) {
  if (!word || !transcript) {
    return InvalidInputReason.EMPTY;
  }
  if (!dictionary.hasWord(word)) {
    return InvalidInputReason.NOT_IN_WORD_LIST;
  }
  if (transcript.length < expected.transcript.length) {
    return InvalidInputReason.TOO_SHORT;
  }
  if (transcript.length > expected.transcript.length) {
    return InvalidInputReason.TOO_LONG;
  }
  return true;
}
