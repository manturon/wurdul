import React, { useEffect, useState } from "react";
import Game from "./Game";
import "../style.css";
import { Dictionary } from "../game/dictionary";

declare global {
  interface Window {
    setAnswer(word: string): void;
  }
}

const MAX_TRIES = 6;

export const DictionaryContext = React.createContext<Dictionary>(null!);

export default function App() {
  const [dictionary, setDictionary] = useState<Dictionary | null>(null);
  useEffect(() => {
    Dictionary.attemptFromCache().then((dictionary) => {
      setDictionary(dictionary);
      window['dictionary'] = dictionary;
    });
  }, []);

  if (!dictionary) {
    return "Loading...";
  }

  return (
    <DictionaryContext.Provider value={dictionary}>
      <div>
        <h1>Wurdul</h1>
        <Game maxTries={MAX_TRIES} />
      </div>
    </DictionaryContext.Provider>
  );
}
