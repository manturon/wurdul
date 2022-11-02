import React from "react";
import { SoundKey, SOUNDS } from "./sound";

const BASE_STYLES =
  "rounded-md w-14 h-14 overflow-hidden border-2 relative select-none";
const MUTED_BG = "border-gray-100";
const SOME_MATCH_BG = "border-yellow-400";
const MATCH_BG = "border-green-400";
const INVALID_BORDER = "border-red-400";

export enum BlockState {
  NoMatch,
  SomeMatch,
  Match,
}

export interface BlockProps {
  value: SoundKey | null | undefined;
  state?: BlockState;
  invalid?: boolean;
}

export const Block = ({
  value,
  state = BlockState.NoMatch,
  invalid = false,
}: BlockProps) => {
  if (value) {
    let bg =
      state === BlockState.Match
        ? MATCH_BG
        : state === BlockState.SomeMatch
        ? SOME_MATCH_BG
        : MUTED_BG;
    let sub = SOUNDS.get(value)?.ipa[0];
    return (
      <div className={`${BASE_STYLES} ${invalid ? INVALID_BORDER : bg}`}>
        <div className="h-full h-full flex flex-row justify-center items-center">
          <b
            className="block font-bold capitalize text-xl mx-auto text-center text-blue-900"
            style={{ fontVariant: "small-caps" }}
          >
            {value}
          </b>
        </div>
        <div className="h-4 w-full absolute text-left pl-1 bottom-0 left-0 leading-none">
          {sub ? (
            <small className="font-medium text-blue-800 opacity-50 text-xs font-sans">
              {sub}
            </small>
          ) : null}
        </div>
      </div>
    );
  } else {
    return <div className={`${BASE_STYLES} ${MUTED_BG}`}></div>;
  }
};

export default Block;
