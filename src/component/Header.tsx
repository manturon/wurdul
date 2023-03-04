import React from "react";
import { Answer, AnswerType } from "../game/game";
import strings from "../strings";
import { capitalize } from "../util";

interface Props {
  answer?: Answer;
  changeMode: (mode: AnswerType) => void;
  rollAnswer: () => void;
}

export const Header = ({ answer, changeMode, rollAnswer }: Props) => {
  let answerInfo = undefined;
  let changeModeButton = undefined;
  let rollButton = undefined;
  if (answer) {
    let text = "";
    let mode = answer.type;
    if (mode === AnswerType.DAILY) {
      text = strings.gameType[AnswerType.DAILY] + " #" + answer.index;
    } else {
      text = strings.gameType[mode];
    }
    answerInfo = <div className="game-info">{capitalize(text)}</div>;
    const otherMode =
      mode === AnswerType.DAILY ? AnswerType.RANDOM : AnswerType.DAILY;
    changeModeButton = (
      <button type="button" onClick={() => changeMode(otherMode)}>
        {strings.gameType[otherMode]}
      </button>
    );
    rollButton = (
      <button type="button" onClick={() => rollAnswer()}>
        roll new word
      </button>
    );
  }

  return (
    <header className="game-header">
      <div className="title">
        <h1>Wurdul 🐛</h1>
        {answer?.words[0]}
        {answerInfo}
      </div>
      <div className="change-mode">
        {changeModeButton}
        {rollButton}
      </div>
    </header>
  );
};

export default Header;
