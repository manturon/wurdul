import { count, countWithIndex } from "../util";
import Phoneme from "./phonemes";
import { Transcript } from "./transcript";

/**
 * A type of match of a single guess to an answer.
 */
export enum Match {
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

export class Matcher {
  // Phoneme and the number of times it is in the transcript
  private _phonemeCount: Map<Phoneme, Set<number>>;
  private _matches: Match[][];

  constructor(
    public readonly expected: Transcript,
    public readonly guesses: Transcript[],
  ) {
    this._phonemeCount = countWithIndex(expected);
    this._matches = guesses.map((guess) => this.matchRowWithKnowledge(guess));
  }

  private matchRowWithKnowledge(guess: Transcript): Match[] {
    const length = this.expected.length;
    if (guess.length > length) {
      guess = guess.slice(0, length);
    }

    const matchRow: Match[] = new Array(length).fill(Match.NO_MATCH);
    const guessPhonemeCount = new Map(guess.map((guess) => [guess, 0]));

    for (let i = 0; i < guess.length; ++i) {
      const guessed = guess[i];
      const expected = this.expected[i];
      if (guessed == expected) {
        matchRow[i] = Match.MATCH;
        guessPhonemeCount.set(guessed, guessPhonemeCount.get(guessed)! + 1);
      }
    }
    for (let i = 0; i < guess.length; ++i) {
      const guessed = guess[i];
      const expected = this.expected[i];
      const expectedCount = this._phonemeCount.get(guessed)?.size ?? 0;
      const guessedCount = guessPhonemeCount.get(guessed)!;
      if (
        guessed != expected &&
        expectedCount != 0 &&
        expectedCount > guessedCount
      ) {
        matchRow[i] = Match.SOME_MATCH;
        guessPhonemeCount.set(guessed, guessedCount + 1);
      }
    }

    return matchRow;
  }

  public get allMatches() {
    return this._matches;
  }

  public get bestMatches() {
    return new Set;
  }

  public bestForPhoneme(phoneme: Phoneme): Match {
    let best = Match.UNKNOWN;
    for (const [i, row] of this._matches.entries()) {
      for (const [j, match] of row.entries()) {
        if (this.guesses[i][j] !== phoneme) {
          continue;
        }
        if (match === Match.MATCH) {
          return Match.MATCH;
        } else if (match === Match.SOME_MATCH) {
          best = Match.SOME_MATCH;
        } else if (best !== Match.SOME_MATCH) {
          best = Match.NO_MATCH;
        }
      }
    }
    return best;
  }
}
