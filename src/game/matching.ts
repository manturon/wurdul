import Phoneme from "./phonemes";
import { Transcript } from "./transcript";

/**
 * A type of match of a single guess to an answer.
 */
export enum MatchType {
  /**
   * The guessed phoneme is in the answer and at that position.
   */
  MATCH = "match",
  /**
   * The guessed phoneme is in the answer but not at that position.
   */
  SOME_MATCH = "some-match",
  /**
   * The guessed phoneme is not in the answer or it is, but it was already
   * matched previously, and there are no others in the answer.
   */
  NO_MATCH = "no-match",
  UNKNOWN = "unknown",
}

/**
 * The outcome of matching a single guessed phoneme to the phoneme at that
 * position.
 */
export interface SingleMatch {
  readonly phoneme: Phoneme;
  readonly type: MatchType;
}

/**
 * The outcome of matches from a whole row.
 */
export type Match = readonly SingleMatch[];

export class Matches {
  public static isAllMatch(match: Match) {
    return match.every((match) => match.type === MatchType.MATCH);
  }

  #phonemeInfo = new Map<Phoneme, { count: number; matchPos: Set<number> }>();

  public readonly expected: Transcript;

  public constructor(expected: Transcript) {
    this.expected = expected;

    for (const [index, phoneme] of expected.entries()) {
      const info = this.#phonemeInfo.get(phoneme) ?? {
        count: 0,
        matchPos: new Set(),
      };
      info.count += 1;
      info.matchPos.add(index);
      this.#phonemeInfo.set(phoneme, info);
    }
  }

  public match(guess: Transcript): SingleMatch[] {
    const length = this.expected.length;
    if (guess.length > length) {
      guess = guess.slice(0, length);
    }

    const matches: SingleMatch[] = [];
    const phonemeCount = new Map(
      Array.from(this.#phonemeInfo, ([phoneme, { count: amount }]) => [
        phoneme,
        amount,
      ]),
    );

    for (const [index, phoneme] of guess.entries()) {
      const info = this.#phonemeInfo.get(phoneme);
      if (info) {
        const count = phonemeCount.get(phoneme);
        if (info.matchPos.has(index)) {
          matches.push({ phoneme, type: MatchType.MATCH });
          phonemeCount.set(phoneme, count! - 1);
        } else if (count) {
          matches.push({ phoneme, type: MatchType.SOME_MATCH });
          phonemeCount.set(phoneme, count - 1);
        } else {
          matches.push({ phoneme, type: MatchType.NO_MATCH });
        }
      } else {
        matches.push({ phoneme, type: MatchType.NO_MATCH });
      }
    }

    return matches;
  }
}
