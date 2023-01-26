import React, { useEffect, useState } from "react";
import Game from "./Game";
import "../style.css";
import { Dictionary } from "../game/dictionary";
import { Answer, randomAnswer } from "../game/game";

const MAX_TRIES = 6;

export const DictionaryContext = React.createContext<Dictionary>(null!);

export default function App() {
  const [dictionary, setDictionary] = useState<Dictionary | null>(null);
  useEffect(() => {
    Dictionary.attemptFromCache().then((dictionary) => {
      setDictionary(dictionary);
    });
  }, []);

  if (!dictionary) {
    return "Loading...";
  }

  const answer: Answer = randomAnswer(dictionary);
  console.log("answer", answer);
  console.log("answer transcript", answer.transcript);

  return (
    <DictionaryContext.Provider value={dictionary}>
      <div>
        <h1>Wurdul</h1>
        <Game maxTries={MAX_TRIES} answer={answer} />
      </div>
    </DictionaryContext.Provider>
  );
}
