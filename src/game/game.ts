import { choose } from "../util";
import { Dictionary } from "./dictionary";
import { Match } from "./matching";
import { getTranscript, RawTranscript, Transcript, Word } from "./transcript";

/**
 * All the row matches in order of commit.
 */
export type MatchHistory = [match: Match, text: string][];

type RawAnswer = [word: string, rawTranscripts: RawTranscript[]];

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
  readonly word: Word[];
  readonly type: AnswerType;
  readonly index?: number;
}

export enum InvalidInputReason {
  EMPTY,
  TOO_SHORT,
  TOO_LONG,
  GAME_OVER,
  NOT_IN_WORD_LIST,
}

async function getAnswers(dictionary: Dictionary): Promise<RawAnswer[]> {
  const seq = dictionary.version.seq;
  const cacheName = `${Dictionary.CACHE_NAME}-${seq}-answers`;
  if (await window.caches.has(cacheName)) {
    const answers = await (await window.caches.open(cacheName))
      .match("./answers.json")
      .then((res) => res?.json());
    if (answers) {
      if (!("entries" in answers)) {
        throw new Error("Could not get fresh answer pool");
      }
      console.debug("Loading answer pool from cache");
      return answers.entries;
    }
  }
  console.debug("Answer pool not found in cache, loading fresh");
  const answers = await fetch("./answers.json").then((res) => res.json());
  if (!answers || !("entries" in answers)) {
    throw new Error("Could not get fresh answer pool");
  }
  return answers.entries;
}

export async function randomAnswer(dictionary: Dictionary): Promise<Answer> {
  const answers = await getAnswers(dictionary);
  const [word, rawTranscripts] = choose(answers)!;
  return {
    index: undefined,
    transcript: getTranscript(choose(rawTranscripts)!),
    type: AnswerType.RANDOM,
    word: [word], // TODO: Add all words that match this sound
  };
}

export const WURDUL_EPOCH = new Date(2022, 10, 12).getTime();

export const getWurdulDayForDate = (date: number) =>
  Math.floor((date - WURDUL_EPOCH) / 1000 / 60 / 60 / 24);

export async function answerForDate(
  dictionary: Dictionary,
  date: number,
): Promise<Answer> {
  const answers = await getAnswers(dictionary);
  // Get number of days since the Wurdul Epoch
  const index = getWurdulDayForDate(date);
  const subindex = index;
  const rawAnswer = answers.at(index % answers.length);
  if (!rawAnswer) {
    throw new Error("Could not get answer for date: " + date);
  }
  const transcript = rawAnswer[1].at(subindex % rawAnswer[1].length)!;
  return {
    index: index,
    type: AnswerType.DAILY,
    transcript: getTranscript(transcript),
    word: [rawAnswer[0]], // TODO: Add all words that match this sound
  };
}
