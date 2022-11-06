import React, { Fragment } from "react";
import { createRoot } from "react-dom/client";
import { Match } from "../src/game";
import Block, { BlockProps, BlockSize, BlockType } from "../src/Block";

let testPropsRows: ([{ className: string }, BlockProps[]] | JSX.Element)[] = [
  <div className="flex flex-col gap-1">
    {[
      ["l", "r", "m", "n", "ng", "w", "y"],
      ["p", "t", "k", "v", "z", "dh", "zh", "j"],
      ["b", "d", "g", "f", "h", "s", "th", "sh", "ch"],
      ["ey", "ee", "eye", "oh", "ue", "er", "ao", "ear", "or", "ire", "our"],
      ["aa", "eh", "i", "awe", "u", "uh", "oi", "err", "are", "oor", "oir"],
    ].map((row, index) => {
      return (
        <div key={index} className="flex flex-row gap-1 align-center justify-center">
          {row.map((key, index) => {
            return typeof key === "string" ? (
              <Block
                size={BlockSize.NORMAL}
                key={index}
                type={BlockType.KEY}
                match={Match.UNKNOWN}
                value={key}

              />
            ) : (
              <Block
                key={index}
                type={BlockType.KEY}
                size={
                  key === 3
                    ? BlockSize.BIG
                    : key === 1
                    ? BlockSize.SMALL
                    : BlockSize.NORMAL
                }
              />
            );
          })}
        </div>
      );
    })}
  </div>,
  [
    { className: "flex flex-row gap-1" },
    [
      { type: BlockType.INFO, value: "th", tag: "θ", match: Match.MATCH },
      { type: BlockType.INFO, value: "r", tag: "r", match: Match.SOME_MATCH },
      { type: BlockType.INFO, value: "i", tag: "ɪ", match: Match.NO_MATCH },
      { type: BlockType.INFO, value: "oo", tag: "u", match: Match.UNKNOWN },
      { type: BlockType.EMPTY },
    ],
  ],
  [
    { className: "flex flex-row gap-1" },
    [
      {
        type: BlockType.INFO,
        value: "th",
        match: Match.MATCH,
        size: BlockSize.SMALL,
      },
      {
        type: BlockType.INFO,
        value: "r",
        match: Match.SOME_MATCH,
        size: BlockSize.SMALL,
      },
      {
        type: BlockType.INFO,
        value: "i",
        match: Match.NO_MATCH,
        size: BlockSize.SMALL,
      },
      {
        type: BlockType.INFO,
        value: "oo",
        match: Match.UNKNOWN,
        size: BlockSize.SMALL,
      },
      { type: BlockType.EMPTY, size: BlockSize.SMALL },
    ],
  ],
  [
    { className: "flex flex-row gap-1" },
    [
      {
        type: BlockType.INFO,
        value: "th",
        tag: "θ",
        match: Match.MATCH,
        size: BlockSize.BIG,
      },
      {
        type: BlockType.INFO,
        value: "r",
        tag: "r",
        match: Match.SOME_MATCH,
        size: BlockSize.BIG,
      },
      {
        type: BlockType.INFO,
        value: "i",
        tag: "ɪ",
        match: Match.NO_MATCH,
        size: BlockSize.BIG,
      },
      {
        type: BlockType.INFO,
        value: "oo",
        tag: "u",
        match: Match.UNKNOWN,
        size: BlockSize.BIG,
      },
      { type: BlockType.EMPTY, size: BlockSize.BIG },
    ],
  ],
  [
    { className: "flex flex-row gap-1" },
    [
      { type: BlockType.EMPTY },
      { type: BlockType.EMPTY },
      { type: BlockType.EMPTY },
      {},
    ],
  ],
  [
    { className: "flex flex-row gap-1" },
    [
      { type: BlockType.INPUT, value: "th" },
      { type: BlockType.INPUT, value: "r" },
      { type: BlockType.INPUT, value: "i" },
      { type: BlockType.EMPTY },
      { type: BlockType.EMPTY },
    ],
  ],
  [
    { className: "flex flex-row gap-1" },
    [
      { type: BlockType.INPUT, value: "th", size: BlockSize.SMALL },
      { type: BlockType.INPUT, value: "r", size: BlockSize.SMALL },
      { type: BlockType.INPUT, value: "i", size: BlockSize.SMALL },
      { type: BlockType.EMPTY, size: BlockSize.SMALL },
      { size: BlockSize.SMALL },
    ],
  ],
];

const container = document.getElementById("app")!;
const root = createRoot(container);
root.render(
  <div className="p-2">
    {testPropsRows.map((el, index, { length }) => (
      <Fragment key={index}>
        <div>
          {Array.isArray(el) ? (
            <>
              <div className={el[0].className + " border p-2"}>
                {el[1].map((testProp, index) =>
                  React.createElement(Block, { ...testProp, key: index })
                )}
              </div>
              <details>
                <pre className="text-xs p-1 mt-2 bg-gray-100">
                  {JSON.stringify(el[1], undefined, 1).toString()}
                </pre>
              </details>
            </>
          ) : (
            el
          )}
        </div>
        {index + 1 !== length ? <hr className="my-3" /> : null}
      </Fragment>
    ))}
  </div>
);
