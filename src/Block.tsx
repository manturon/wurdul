import React, { ReactNode, useContext } from "react";
import { GameEvent, Match } from "./game";
import { GameContext } from "./Wurdul";

export enum BlockSize {
  NORMAL = "normal",
  BIG = "big",
  SMALL = "small",
}

const BASE_STYLE =
  "flex flex-row items-center overflow-hidden relative select-none";
const HEAD_BASE_STYLE = "block mx-auto text-center uppercase";

const NORMAL_SIZE_STYLE = "w-14 border-2 text-xl font-bold tracking-tight";
const BIG_SIZE_STYLE = "w-20 border-4 text-3xl font-black tracking-wider";
const SMALL_SIZE_STYLE = "w-10 border text-sm font-medium";

const KEY_BASE_STYLE = "text-sm font-medium";
const KEY_NORMAL_SIZE_STYLE = "h-5 w-12";
const KEY_BIG_SIZE_STYLE = "h-8 w-32";
const KEY_SMALL_SIZE_STYLE = "h-8 w-8";
const KEY_HEAD_BASE_STYLE = "block mx-auto text-center uppercase";
const KEY_INPUT_STYLE =
  "bg-white text-gray-700 font-medium border border-slate-100";

const MATCH_STYLE = "border-transparent bg-emerald-500 text-white";
const SOME_MATCH_STYLE = "border-transparent bg-yellow-500 text-white";
const NO_MATCH_STYLE = "border-transparent bg-gray-500 text-white";
const UNKNOWN_STYLE = "border-gray-100 bg-slate-100 text-gray-700";

const INPUT_STYLE = "border-gray-300 bg-white text-gray-700";

const EMPTY_STYLE = "border-gray-100 bg-white text-black";

// Map size to a block style
const SIZE_STYLE_MAP = new Map([
  [BlockSize.NORMAL, NORMAL_SIZE_STYLE],
  [BlockSize.BIG, BIG_SIZE_STYLE],
  [BlockSize.SMALL, SMALL_SIZE_STYLE],
]);

// Map size to a block style
const KEY_SIZE_STYLE_MAP = new Map([
  [BlockSize.NORMAL, KEY_NORMAL_SIZE_STYLE],
  [BlockSize.BIG, KEY_BIG_SIZE_STYLE],
  [BlockSize.SMALL, KEY_SMALL_SIZE_STYLE],
]);

// Map match type to a block style
const MATCH_STYLE_MAP = new Map([
  [Match.MATCH, MATCH_STYLE],
  [Match.SOME_MATCH, SOME_MATCH_STYLE],
  [Match.NO_MATCH, NO_MATCH_STYLE],
  [Match.UNKNOWN, UNKNOWN_STYLE],
]);

export enum BlockType {
  EMPTY = "empty",
  INPUT = "input",
  INFO = "info",
  KEY = "key",
}

export type BlockProps = { size?: BlockSize; title?: () => ReactNode } & (
  | { type: BlockType.INFO; value: string; tag?: string; match: Match }
  | { type: BlockType.INPUT; value: string }
  | { type: BlockType.KEY; value?: string; match?: Match }
  | { type?: BlockType.EMPTY }
);

/**
 * A block that contains a guess outcome, current player input or nothing.
 */
export const Block = (props: BlockProps) => {
  let [gameState, dispatchGameAction] = useContext(GameContext);
  let { size } = props;
  size ??= BlockSize.NORMAL;
  if (props.type === BlockType.INFO) {
    let { value, tag, match, title } = props;
    let style = `aspect-square ${BASE_STYLE} ${MATCH_STYLE_MAP.get(
      match
    )} ${SIZE_STYLE_MAP.get(size)}`;
    return (
      <div
        className={style}
        onMouseOver={
          title
            ? () => {
                dispatchGameAction({ type: GameEvent.INFO, message: title!() });
              }
            : () => {}
        }
        onMouseLeave={() =>
          dispatchGameAction({ type: GameEvent.INFO, message: undefined })
        }
      >
        <span className={HEAD_BASE_STYLE}>{value}</span>
        {tag ? (
          <small className="absolute bottom-0 left-1 font-sans font-medium text-xs opacity-50">
            {tag}
          </small>
        ) : null}
      </div>
    );
  } else if (props.type === BlockType.INPUT) {
    let { value } = props;
    let style = `aspect-square ${BASE_STYLE} ${INPUT_STYLE} ${SIZE_STYLE_MAP.get(
      size
    )}`;
    return (
      <div className={style}>
        <span className={HEAD_BASE_STYLE}>{value}</span>
      </div>
    );
  } else if (props.type === BlockType.KEY) {
    let { value, match } = props;
    let style = `${BASE_STYLE} ${KEY_BASE_STYLE} ${KEY_SIZE_STYLE_MAP.get(
      size
    )} ${match ? MATCH_STYLE_MAP.get(match) : KEY_INPUT_STYLE}`;
    return (
      <div className={style}>
        <span className={KEY_HEAD_BASE_STYLE}>{value}</span>
      </div>
    );
  } else {
    // Empty block
    let style = `aspect-square ${BASE_STYLE} ${EMPTY_STYLE} ${SIZE_STYLE_MAP.get(
      size
    )}`;
    return <div className={style}></div>;
  }
};

export default Block;
