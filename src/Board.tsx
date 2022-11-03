import React from "react";
import Block, { BlockProps, EmptyBlock } from "./Block";
import { rangeMap } from "./util";
import { GuessHistory, GuessResult, Input } from "./game";
import { WordSounds } from "./sound";

export interface BoardProps {
  rows: number;
  /**
   * Number of blocks per row.
   */
  columns: number;
  /**
   * The previous player guess results.
   */
  history: GuessHistory;
  /**
   * The current player input.
   */
  input: Input | undefined;
}

const makeRow = (cols: number, guess?: GuessResult | WordSounds) => {
  let blocks: JSX.Element[];
  if (typeof guess === "object") {
    if (guess.length > cols) {
      guess = guess.slice(0, cols);
    }

    if (Array.isArray(guess[0])) {
      // It's a previous guess
      blocks = (guess as GuessResult).map(([sound, match], index) => (
        <Block
          key={index}
          head={sound.name}
          guessMatch={match}
          info={sound.ipa}
        />
      ));
    } else {
      // It's the current user input
      blocks = (guess as WordSounds).map((sound, index) => (
        <Block key={index} head={sound.name} input={true} info={sound.ipa} />
      ));
    }

    if (cols) {
      let start = guess.length;
      let n = cols - start;
      let fill = rangeMap(n, (index) => <EmptyBlock key={start + index} />);
      blocks.push(...fill);
    }
  } else {
    blocks = rangeMap(cols ?? 0, (index) => <EmptyBlock key={index} />);
  }
  return blocks;
};

/**
 * A board with rows that contain blocks with guesses, input or nothing.
 */
export const Board = ({ rows, columns, history, input = [] }: BoardProps) => {
  // Rows from previous guesses
  let playedRows = history.map((guess) => makeRow(columns, guess));
  // Current player input row
  let inputRow = makeRow(columns, input);
  // Empty rows
  let padding = rangeMap(rows - playedRows.length - 1, () => makeRow(columns));
  let blockRows = [...playedRows, inputRow, ...padding];
  return (
    <div className="w-72 mx-auto flex flex-col gap-1">
      {blockRows.map((blocks, key) => (
        <div key={key} className="flex flex-row gap-1">
          {blocks}
        </div>
      ))}
    </div>
  );
};

export default Board;
