import React, { useEffect, useState } from "react";
import {
  DEFAULT_COLUMNS,
  DEFAULT_ROWS,
  getAnswerByDate,
  getAnswerForWord,
} from "./game";
import { Wurdul } from "./Wurdul";

export const App = () => {
  let columns = DEFAULT_COLUMNS;
  let rows = DEFAULT_ROWS;
  let [answer, setAnswer] = useState(getAnswerByDate(columns, Date.now()));
  console.log(
    `Answer: ${answer[0].map((sound) => sound.name).join("-")} (${answer[1]})`
  );

  useEffect(() => {
    window["setAnswer"] = (word: string) => {
      let answer = getAnswerForWord(word);
      if (answer) {
        setAnswer(answer);
      }
    };
  }, [answer]);

  return (
    <React.StrictMode>
      <Wurdul answer={answer} columns={columns} rows={rows} />
    </React.StrictMode>
  );
};
