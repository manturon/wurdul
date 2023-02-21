import React, { useEffect, useState } from "react";
import Game, { History } from "./Game";
import "../style.css";
import { Dictionary } from "../game/dictionary";
import {
  Answer,
  answerForDate,
  AnswerType,
  MatchHistory,
  randomAnswer,
} from "../game/game";
import Header from "./Header";

const MAX_TRIES = 6;

class GameCache {
  answer: Answer;
  history: History;
  date: number;

  static fromCache(answer: Answer) {
    const source = window.localStorage.getItem("wurdul");
    let object = null;
    if (source) {
      try {
        object = window.atob(source);
        object = JSON.parse(object);
      } catch (err) {
        object = null;
      }
    }
    if (
      object &&
      typeof object === "object" &&
      "answer" in object &&
      "history" in object &&
      "date" in object
    ) {
      const cache = new GameCache(object["answer"]);
      if (
        answer.type === AnswerType.DAILY &&
        cache.answer.type === AnswerType.DAILY &&
        answer.index === cache.answer.index
      ) {
        cache.history = object["history"];
        cache.date = object["date"];
        return cache;
      }
    }
    const cache = new GameCache(answer);
    cache.save();
    return cache;
  }

  constructor(answer: Answer) {
    this.answer = answer;
    this.history = [];
    this.date = Date.now();
  }

  update(history: History) {
    this.history = history;
    this.save();
  }

  save() {
    window.localStorage.setItem("wurdul", window.btoa(JSON.stringify(this)));
  }
}

export const DictionaryContext = React.createContext<Dictionary>(null!);
export const GameCacheContext = React.createContext<GameCache | null>(null!);

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

  // const answer: Answer = randomAnswer(dictionary);
  const answer: Answer = answerForDate(dictionary, Date.now());

  return (
    <DictionaryContext.Provider value={dictionary}>
      <GameCacheContext.Provider value={GameCache.fromCache(answer)}>
        <div className="game-wrapper">
          <Header answer={answer} />
          <Game maxTries={MAX_TRIES} answer={answer} />
        </div>
      </GameCacheContext.Provider>
    </DictionaryContext.Provider>
  );
}
