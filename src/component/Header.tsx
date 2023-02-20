import React from "react";
import { Answer, AnswerType } from "../game/game";
import strings from "../strings";
import { capitalize } from "../util";

interface Props {
  answer?: Answer,
}

export const Header = ({answer}: Props) => {
  let answerInfo = undefined;
  if (answer) {
    let text = "";
    if (answer.type === AnswerType.DAILY) {
      text = strings.gameType[AnswerType.DAILY] + " #" + answer.index;
    } else {
      text = strings.gameType[answer.type];
    }
    answerInfo = <div className="game-info">{capitalize(text)}</div>;
  }

  return <header className="game-header">
    <h1>Wurdul 🐛</h1>
    {answerInfo}
  </header>;
};

export default Header;
