import React, { useEffect, useState } from "react";
import {
  Answer,
  DEFAULT_COLUMNS,
  DEFAULT_ROWS,
  getAnswerByDate,
  getAnswerForWord,
} from "./game";
import { Wurdul } from "./Wurdul";

export const App = () => {
  let columns = DEFAULT_COLUMNS;
  let rows = DEFAULT_ROWS;
  let [answer, setAnswer] = useState<Answer | null>(null);

  useEffect(() => {
    getAnswerByDate(columns, Date.now()).then(answer => {
      setAnswer(answer);
      console.log(
        `Answer: ${answer[0].map(sound => sound.name).join("-")} (${answer[1]})`
      );
    });
  }, []);

  useEffect(() => {
    window["setAnswer"] = (word: string) => {
      getAnswerForWord(word).then(answer =>
        answer ? setAnswer(answer) : void 0
      );
    };
  }, []);

  return (
    <React.StrictMode>
      <Wurdul answer={answer} columns={columns} rows={rows} />
    </React.StrictMode>
  );
};
