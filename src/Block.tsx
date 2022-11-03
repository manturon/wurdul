import React from "react";
import { Match } from "./game";

const BASE_STYLE = "w-14 h-14 overflow-hidden border-2 relative select-none";
const SMALL_STYLE = "w-7 h-7 overflow-hidden border relative select-none";
const INPUT_STYLE = "border-gray-400 text-gray-700";
const EMPTY_STYLE = "border-gray-100";
const NO_MATCH_STYLE = "border-0 bg-gray-500 text-white";
const SOME_MATCH_STYLE = "border-0 bg-yellow-500 text-white";
const MATCH_STYLE = "border-0 bg-emerald-500 text-white";
const INVALID_STYLE = "border-red-400";
const HEAD_BASE_STYLE = "font-bold text-2xl";
const HEAD_SMALL_STYLE = "font-medium text-xs";

// Map match type to a block style
const styleMap = {
  [Match.MATCH]: MATCH_STYLE,
  [Match.SOME_MATCH]: SOME_MATCH_STYLE,
  [Match.INVALID]: INVALID_STYLE,
  [Match.NO_MATCH]: NO_MATCH_STYLE,
};

export interface BlockProps {
  /**
   * Is the block representing the player input?
   */
  input?: boolean;
  /**
   * Main text of the block. None for an empty block.
   */
  head?: string;
  /**
   * Little extra characters to display on the corner.
   */
  info?: string | string[];
  /**
   * Outcome in case it is a guess.
   */
  guessMatch?: Match;
  small?: boolean;
}

/**
 * A block that contains a guess outcome, current player input or nothing.
 */
export const Block = ({
  head,
  info,
  input = false,
  guessMatch,
  small,
}: BlockProps) => {
  if (head) {
    let style = input ? INPUT_STYLE : styleMap[guessMatch ?? Match.NO_MATCH];
    return (
      <div className={`${small ? SMALL_STYLE : BASE_STYLE} ${style}`}>
        <div className="h-full h-full flex flex-row justify-center items-center">
          <b
            className={`block mx-auto text-center uppercase ${
              small ? HEAD_SMALL_STYLE : HEAD_BASE_STYLE
            }`}
          >
            {head}
          </b>
        </div>
        {small ? null : (
          <div className="h-4 w-full absolute text-left pl-1 bottom-0 left-0 leading-none">
            {info ? (
              <small className={`opacity-50 font-sans font-medium text-xs`}>
                {Array.isArray(info) ? info[0] : info}
              </small>
            ) : null}
          </div>
        )}
      </div>
    );
  } else {
    // Empty element
    return <EmptyBlock />;
  }
};

export const EmptyBlock = (props?: object) => (
  <div {...props} className={`${BASE_STYLE} ${EMPTY_STYLE}`}></div>
);

export default Block;
