import React from "react";
import Block, { BlockProps, EmptyBlock } from "./Block";
import { rangeMap } from "./util";
import { GuessHistory, Input } from "./game";

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

const makeRow = (index: number, props?: BlockProps[], padTo?: number) => {
  let rows: JSX.Element[];
  if (props) {
    rows = rangeMap(props.length, (index) => (
      <Block key={index} {...props[index]} />
    ));

    if (padTo) {
      let start = props.length ?? 0;
      let n = padTo - start;
      let fill = rangeMap(n, (index) => <EmptyBlock key={start + index} />);
      rows.push(...fill);
    }
  } else {
    rows = rangeMap(padTo ?? 0, (index) => <EmptyBlock key={index} />);
  }
  return (
    <div key={index} className="flex flex-row gap-1">
      {rows}
    </div>
  );
};

/**
 * A board with rows that contain blocks with guesses, input or nothing.
 */
export const Board = ({ rows, columns, history, input }: BoardProps) => {
  // Rows from previous guesses
  let playedRows = history.map((row, index) =>
    makeRow(
      index,
      row.map(([sound, match]) => ({
        guessMatch: match,
        head: sound.name,
        info: sound.ipa[0],
      })),
      columns
    )
  );
  // Current player input row
  let inputRow = makeRow(
    playedRows.length,
    (input ?? []).map((sound) => ({ input: true, head: sound.name })).slice(0, columns),
    columns
  );
  // Empty rows
  let padding = rangeMap(rows - playedRows.length - 1, (index) => {
    return makeRow(playedRows.length + index + 1, undefined, columns);
  });
  let blockRows = [...playedRows, inputRow, ...padding];
  return <div className="mx-auto flex flex-col gap-1">{blockRows}</div>;
};

export default Board;
