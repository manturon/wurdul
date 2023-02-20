import React, { useEffect, useState } from "react";
import Game from "./Game";
import "../style.css";
import { Dictionary } from "../game/dictionary";
import { Answer, randomAnswer } from "../game/game";
import Header from "./Header";

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

  return (
    <DictionaryContext.Provider value={dictionary}>
      <div className="game-wrapper">
        <Header answer={answer} />
        <Game maxTries={MAX_TRIES} answer={answer} />
      </div>
    </DictionaryContext.Provider>
  );
}
