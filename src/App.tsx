import React, { useEffect, useState } from "react";
import {
  Answer,
  DEFAULT_ROWS,
  getAnswerForDate,
  getAnswerForWord,
} from "./game";
import { Wurdul } from "./Wurdul";

export const WEBSITE = 'http://manturon.github.io/wurdul';

export const App = () => {
  let rows = DEFAULT_ROWS;
  let [answer, setAnswer] = useState<Answer | null>(null);

  useEffect(() => {
    let now = new Date();
    getAnswerForDate(now).then(answer => {
      setAnswer(answer);
      if (process.env.NODE_ENV !== 'production') {
        console.log(
          `Answer: ${answer.sound.map(sound => sound.name).join("-")} (${
            answer.word
          })`
        );
      }
    });
  }, []);

  useEffect(() => {
    if (process.env.NODE_ENV !== 'production') {
      window["setAnswer"] = (word: string) => {
        getAnswerForWord(word).then(answer =>
          answer ? setAnswer(answer) : void 0
        );
      };
    }
  }, []);

  if (answer) {
    return (
      <React.StrictMode>
        <Wurdul answer={answer} rows={rows} />
      </React.StrictMode>
    );
  } else {
    return <div className="w-72 mx-auto text-right">Loading dictionary...</div>;
  }
};
