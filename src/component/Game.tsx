import React, { useContext, useEffect, useState } from "react";
import {
  Answer,
  AnswerType,
  checkValidity,
  InvalidInputReason,
} from "../game/game";
import { Match, Matcher } from "../game/matching";
import Phoneme, { getPhonemeDescriptor } from "../game/phonemes";
import { CONSONANTS_LAYOUT, Layout, VOWELS_LAYOUT } from "../game/summary";
import { Transcript } from "../game/transcript";
import strings from "../strings";
import { capitalize, clamp, repeatWithProvider, translate } from "../util";
import { DictionaryContext, GameCacheContext } from "./App";
import Block from "./Block";

interface Props {
  maxTries: number;
  answer: Answer;
}

export interface HistoryEntry {
  transcript: Transcript;
  word: string;
}
export type History = HistoryEntry[];

export default function Game({ maxTries, answer }: Props) {
  const colCount = answer.transcript.length;
  const dictionary = useContext(DictionaryContext);
  const cache = useContext(GameCacheContext);

  const [history, setHistory] = useState<History>(cache?.history ?? []);
  const [wordInput, setWordInput] = useState<string>("");
  const [selectedTranscriptIndex, setSelectedTranscriptIndex] = useState(0);

  const transcriptsForInput = dictionary.wordTranscripts(wordInput.trim());
  const noTranscript = transcriptsForInput.length === 0;
  const singleTranscript = transcriptsForInput.length === 1;
  const wonGame =
    history.at(-1)?.transcript.toString() === answer.transcript.toString();
  const gameOver = wonGame || history.length === maxTries;
  if (transcriptsForInput.length) {
    transcriptsForInput.sort((transcript) =>
      transcript.length === colCount ? -1 : 0,
    );
  }

  useEffect(() => {
    setHistory(cache?.history ?? []);
    setWordInput("");
    setSelectedTranscriptIndex(0);
  }, [answer, maxTries]);

  const phonemeInput = transcriptsForInput[selectedTranscriptIndex] ?? [];
  const validity = checkValidity(dictionary, answer, wordInput, phonemeInput);

  const matcher = new Matcher(
    answer.transcript,
    history.map((entry) => entry.transcript),
  );

  const handleOnInput: React.FormEventHandler<HTMLInputElement> = ({
    currentTarget,
  }) => {
    let value = currentTarget.value;
    setWordInput(value);
    setSelectedTranscriptIndex(0);
  };

  const clearInput = () => {
    setWordInput("");
    setSelectedTranscriptIndex(0);
  };

  const handleOnClick: React.MouseEventHandler<HTMLButtonElement> = () => {
    commitInput();
  };

  const handleOnKeyUp: React.KeyboardEventHandler = ({ key }) => {
    if (!gameOver) {
      if (key === "Enter") {
        commitInput();
      } else if (key === "ArrowUp" || key === "PageUp") {
        offsetChoice(-1);
      } else if (key === "ArrowDown" || key === "PageDown") {
        offsetChoice(1);
      }
    }
  };

  const offsetChoice = (offset: number) => {
    if (gameOver) {
      return;
    }
    setSelectedTranscriptIndex((selectedTranscriptIndex) =>
      clamp(
        selectedTranscriptIndex + offset,
        0,
        transcriptsForInput.length - 1,
      ),
    );
  };

  const handleOnClickPrevChoice = () => {
    offsetChoice(-1);
  };

  const handleOnClickNextChoice = () => {
    offsetChoice(1);
  };

  const commitInput = () => {
    if (gameOver || !phonemeInput?.length || phonemeInput.length != colCount) {
      return;
    }
    setHistory((history) => {
      const newHistory = [
        ...history,
        { transcript: phonemeInput, word: wordInput },
      ];
      cache?.update(newHistory);
      return newHistory;
    });
    clearInput();
  };

  const makeSummaryBoard = (layout: Layout) =>
    layout.map((row, index) => (
      <div className="summary-row" key={index}>
        {row.map(getPhonemeDescriptor).map((pd, index) => {
          const match = matcher.bestForPhoneme(pd.key as Phoneme);
          return (
            <Block key={index} match={match}>
              {pd.key}
            </Block>
          );
        })}
      </div>
    ));

  const makeBoard = () => {
    let i = 0;
    const matches = matcher.allMatches;
    const historyBlocks = history.flatMap((entry, j) => {
      const rowMatches = matches[j];
      const transcript = entry.transcript;
      return transcript.map(getPhonemeDescriptor).map((pd, k) => (
        <Block key={i++} match={rowMatches[k]}>
          {pd.key}
        </Block>
      ));
    });
    const emptyBlocks = repeatWithProvider(
      colCount * (maxTries + (gameOver ? 0 : -1) - history.length),
      () => <Block key={i++}></Block>,
    );
    if (gameOver) {
      return [...historyBlocks, ...emptyBlocks];
    } else {
      const inputBlocks = phonemeInput
        .slice(0, colCount)
        .map((phoneme) => {
          const pd = getPhonemeDescriptor(phoneme);
          return (
            <Block input={true} key={i++}>
              {pd.key}
            </Block>
          );
        })
        .concat(
          // appends the empty elements at the end of an unfinished input
          repeatWithProvider(
            Math.max(0, colCount - phonemeInput.length),
            () => <Block input={true} key={i++}></Block>,
          ),
        );
      return [...historyBlocks, ...inputBlocks, ...emptyBlocks];
    }
  };

  const makeWordPreview = () => {
    const matches = matcher.bestMatches;
    const blocks = phonemeInput.map(getPhonemeDescriptor).map((pd, index) => {
      if (index >= colCount) {
        return (
          <Block key={index} invalid={true}>
            {pd.key}
          </Block>
        );
      }
      let match = matches.get(pd.key as Phoneme)?.get(index) ?? Match.UNKNOWN;
      return (
        <Block key={index} match={match}>
          {pd.key}
        </Block>
      );
    });
    const emptyBlocks = repeatWithProvider(
      colCount - blocks.length,
      (index) => (
        <Block invalid={index >= colCount} key={blocks.length + index}></Block>
      ),
    );
    return blocks.concat(emptyBlocks);
  };

  const makeInput = () => (
    <div className={`game-input ${noTranscript ? "no-transcript" : ""}`}>
      <input
        className="word-input"
        type="text"
        onInput={handleOnInput}
        onKeyUp={handleOnKeyUp}
        value={wordInput}
        placeholder={capitalize(strings.input.placeholder)}
      />
      <button
        className="submit-guess-button"
        type="button"
        disabled={validity !== true}
        onClick={handleOnClick}
        title={capitalize(strings.input.submitAlt)}>
        {capitalize(strings.input.submit)}
      </button>
      <div className="word-preview">{makeWordPreview()}</div>
      <div className="transcript-chooser">
        <button
          className="prev-choice"
          type="button"
          onClick={handleOnClickPrevChoice}
          disabled={
            noTranscript || singleTranscript || selectedTranscriptIndex == 0
          }
          title={capitalize(strings.input.previousAlt)}>
          {/*strings.input.previous*/}
          &uarr;
        </button>
        <div
          className="choice-count"
          title={capitalize(
            translate(
              strings.input.currentAlt,
              selectedTranscriptIndex + 1,
              transcriptsForInput.length,
            ),
          )}>
          {capitalize(
            noTranscript
              ? strings.input.currentEmpty
              : singleTranscript
              ? strings.input.currentSingle
              : translate(
                  strings.input.current,
                  selectedTranscriptIndex + 1,
                  transcriptsForInput.length,
                ),
          )}
        </div>
        <button
          className="next-choice"
          type="button"
          onClick={handleOnClickNextChoice}
          disabled={
            noTranscript ||
            singleTranscript ||
            selectedTranscriptIndex == transcriptsForInput.length - 1
          }
          title={capitalize(strings.input.nextAlt)}>
          {/*strings.input.next*/}
          &darr;
        </button>
      </div>
    </div>
  );

  const copyShare = () => {
    const history = matcher.allMatches
      .map((row) =>
        row.map((matchType) => {
          switch (matchType) {
            case Match.MATCH:
              return "🟩";
            case Match.SOME_MATCH:
              return "🟨";
            default:
              return "⬛️";
          }
        }).join(''),
      )
      .join("\n");
    const title =
      answer.type === AnswerType.DAILY
        ? "Daily Wurdul #" + answer.index
        : "Wurdul";
    const url = "https://manturon.github.io/wurdul/";
    const text = `${title}\n\n${history}\n\n${url}`;

    navigator.clipboard.writeText(text);
  };

  const makeGameOverScreen = () => {
    if (wonGame) {
      return (
        <div className="game-over-screen won">
          <div className="explanation">
            <h2>Good job!</h2>
            <p>You correctly guessed the word.</p>
            {answer.type === AnswerType.DAILY ? (
              <p>
                <a className="share" onClick={copyShare}>Copy to clipboard</a>
              </p>
            ) : (
              ""
            )}
          </div>
        </div>
      );
    } else if (gameOver) {
      return (
        <div className="game-over-screen lost">
          <div className="explanation">
            <h2>Too bad!</h2>
            <p>
              You didn't guess the word in the expected amount of tries.
              <br />
              The word was{" "}
              {answer.words.map((word) => <b>{word.toUpperCase()}</b>).at(0)}.
            </p>
            {answer.type === AnswerType.DAILY ? (
              <p>
                <a className="share" onClick={copyShare}>Copy to clipboard</a>
              </p>
            ) : (
              ""
            )}
          </div>
          <div className="word-preview">
            {answer.transcript.map((phoneme, index) => (
              <Block key={index}>{phoneme}</Block>
            ))}
          </div>
        </div>
      );
    } else return null;
  };

  return (
    <div className={"game " + (gameOver ? "game-over" : "")}>
      <div
        className="game-board"
        style={
          { "--rows": maxTries, "--cols": colCount } as React.CSSProperties
        }>
        {makeBoard()}
      </div>
      {gameOver ? makeGameOverScreen() : null}
      {!gameOver ? makeInput() : null}
      <div className="game-summary">
        <div className="summary-board">
          {makeSummaryBoard(CONSONANTS_LAYOUT)}
        </div>
        <div className="summary-board">{makeSummaryBoard(VOWELS_LAYOUT)}</div>
      </div>
    </div>
  );
}
