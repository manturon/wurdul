import React, { useContext } from "react";
import { WEBSITE } from "./App";
import Block, { BlockSize, BlockType } from "./Block";
import { makeBlockInfo } from "./Board";
import { Answer, getWurdulDayForDate, GuessHistory, Match } from "../game/game";
import Sound from "../game/sound";
import { GameContext } from "./Wurdul";

export const makeRow = (sounds: Sound[]) => {
  let size =
    sounds.length > 5
      ? BlockSize.SMALL
      : sounds.length < 4
      ? BlockSize.BIG
      : BlockSize.NORMAL;
  return sounds.map((sound, index) => (
    <Block
      key={index}
      type={BlockType.INFO}
      value={sound.name}
      tag={sound.ipa}
      match={Match.MATCH}
      size={size}
      title={() => makeBlockInfo(sound.asin)}
    />
  ));
};

const historyToEmoji = function (answer: Answer, history: GuessHistory) {
  let emojis = history.map(row =>
    row
      .map(([_sound, match]) =>
        match === Match.MATCH ? "🟩" : match === Match.SOME_MATCH ? "🟨" : "⬛️"
      )
      .join("")
  );
  console.log(answer);
  return (
    (answer.day !== undefined
      ? `Daily Wurdul #${answer.day + 1}`
      : "Random Wurdul") /* TODO */ +
    "\n" +
    emojis.join("\n") +
    "\n\n" +
    WEBSITE
  );
};

export const TheAnswer = function () {
  let state = useContext(GameContext)?.[0];
  if (!state) {
    return <div></div>;
  }
  let { history, answer, won } = state;

  const handleOnClick: React.MouseEventHandler = function (event) {
    navigator.clipboard.writeText(historyToEmoji(answer, history));
  };

  let common = "w-full py-2 text-white text-center";
  return (
    <div className="w-72 mx-auto flex flex-col gap-1">
      {won ? (
        <div className={`${common} bg-emerald-500`}>
          Good job! The answer was <b>{answer.word.toUpperCase()}</b>.
        </div>
      ) : (
        <div className={`${common} bg-red-500`}>
          Game over! The answer was <b>{answer.word.toUpperCase()}</b>
        </div>
      )}
      <div className="flex flex-row gap-1">{makeRow(answer.sound)}</div>
      <button
        className={`${common} bg-yellow-500 text-lg font-bold`}
        onClick={handleOnClick}
      >
        Copy to clipboard
      </button>
    </div>
  );
};

export default TheAnswer;
