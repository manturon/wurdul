import React, { useCallback, useEffect, useState } from "react";
import Game, { History } from "./Game";
import "../style.css";
import { Dictionary } from "../game/dictionary";
import { Answer, answerForDate, AnswerType, randomAnswer } from "../game/game";
import Header from "./Header";

const MAX_TRIES = 6;

class GameCache {
  answer: Answer;
  history: History;
  date: number;

  static fromCache(answer: Answer) {
    const source = window.localStorage.getItem("wurdul-daily");
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
      console.debug("Cache doesn't match today's answer, removing...");
    }
    if (AnswerType.DAILY) {
      const cache = new GameCache(answer);
      cache.save();
      return cache;
    } else {
      return null;
    }
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
    console.log("saving", this);
    window.localStorage.setItem(
      "wurdul-daily",
      window.btoa(JSON.stringify(this)),
    );
  }
}

export const DictionaryContext = React.createContext<Dictionary>(null!);
export const GameCacheContext = React.createContext<GameCache | null>(null!);

export default function App() {
  const [dictionary, setDictionary] = useState<Dictionary | null>(null);
  const [mode, setMode] = useState<AnswerType>(AnswerType.DAILY);
  const [answer, setAnswer] = useState<Answer | null>(null);
  useEffect(() => {
    Dictionary.attemptFromCache().then((dictionary) => {
      setDictionary(dictionary);
    });
  }, []);

  const grabAnswer = useCallback(() => {
    setAnswer(
      mode === AnswerType.DAILY
        ? answerForDate(dictionary!, Date.now())
        : randomAnswer(dictionary!),
    );
  }, [dictionary, mode]);
  useEffect(() => {
    if (dictionary) {
      grabAnswer();
    } else {
      setAnswer(null);
    }
  }, [mode, dictionary, grabAnswer]);

  if (!dictionary || !answer) {
    return "Loading...";
  }

  return (
    <DictionaryContext.Provider value={dictionary}>
      <GameCacheContext.Provider
        value={mode === AnswerType.DAILY ? GameCache.fromCache(answer) : null}>
        <div className="game-wrapper">
          <Header
            answer={answer!}
            changeMode={(mode: AnswerType) => setMode(mode)}
            rollAnswer={() => grabAnswer()}
          />
          <Game answer={answer} maxTries={MAX_TRIES} />
        </div>
      </GameCacheContext.Provider>
    </DictionaryContext.Provider>
  );
}
