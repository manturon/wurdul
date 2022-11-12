import React, { Fragment, useContext } from "react";
import Block, { BlockSize, BlockType } from "./Block";
import { GuessResult } from "./game";
import { WordSound } from "./sound";
import { rangeMap } from "./util";
import { GameContext } from "./Wurdul";

const makeBlockInfo = (asin: string[]) => (
  <Fragment>
    Like in:{" "}
    {asin.map((ex: string, index: number, { length }) => {
      let { 1: left, 2: mark, 3: right } = /(\w*)\[(\w+)\](\w*)/.exec(ex)!;
      return (
        <Fragment key={index}>
          {left}
          <b>{mark}</b>
          {right}
          {length !== index + 1 ? ", " : null}
        </Fragment>
      );
    })}
  </Fragment>
);

const makeRow = (cols: number, guess?: GuessResult | WordSound) => {
  let blocks: JSX.Element[];
  let size =
    cols > 5 ? BlockSize.SMALL : cols < 4 ? BlockSize.BIG : BlockSize.NORMAL;
  if (typeof guess === "object") {
    if (guess.length > cols) {
      guess = guess.slice(0, cols);
    }

    if (Array.isArray(guess[0])) {
      // It's a previous guess
      blocks = (guess as GuessResult).map(([sound, match], index) => (
        <Block
          key={index}
          type={BlockType.INFO}
          value={sound.name}
          tag={sound.ipa}
          match={match}
          size={size}
          title={() => makeBlockInfo(sound.asin)}
        />
      ));
    } else {
      // It's the current user input
      blocks = (guess as WordSound).map((sound, index) => (
        <Block
          key={index}
          type={BlockType.INPUT}
          value={sound.name}
          size={size}
        />
      ));
    }

    if (cols) {
      let start = guess.length;
      let n = cols - start;
      let fill = rangeMap(n, index => (
        <Block key={start + index} size={size} />
      ));
      blocks.push(...fill);
    }
  } else {
    blocks = rangeMap(cols ?? 0, index => <Block key={index} size={size} />);
  }
  return blocks;
};

/**
 * A board with rows of blocks that contain the guesses, the current input or nothing.
 */
export const Board = () => {
  let [gameState, dispatchGameAction] = useContext(GameContext);
  let { history, input, rows, answer, gameOver } = gameState;

  // Rows from previous guesses
  let playedRows = history.map(guess => makeRow(answer.sound.length, guess));
  // Current player input row
  let blockRows = [...playedRows];

  if (!gameOver && blockRows.length !== rows) {
    let inputRow = makeRow(answer.sound.length, input);
    blockRows = [...blockRows, inputRow];
  }

  // Empty rows
  let paddingRows = rows - blockRows.length;
  if (paddingRows > 0) {
    let padding = rangeMap(rows - playedRows.length - 1, () =>
      makeRow(answer.sound.length)
    );
    blockRows = [...blockRows, ...padding];
  }

  return (
    <div className="w-72 mx-auto flex flex-col gap-1 relative items-center">
      {
        // Not the best way to do this
        gameState.info ? (
          <div className="absolute -top-7 font-medium text-red-400 text-sm bg-white w-full">
            {gameState.info}
          </div>
        ) : null
      }
      {blockRows.map((blocks, key) => (
        <div
          key={key}
          className="flex flex-row gap-1 max-w-full w-full place-content-evenly"
        >
          {blocks}
        </div>
      ))}
    </div>
  );
};

export default Board;
