import React, { useContext, useState } from "react";
import { Answer, checkValidity, InvalidInputReason } from "../game/game";
import { Match, Matcher } from "../game/matching";
import Phoneme, { getPhonemeDescriptor } from "../game/phonemes";
import { CONSONANTS_LAYOUT, Layout, VOWELS_LAYOUT } from "../game/summary";
import { Transcript } from "../game/transcript";
import strings from "../strings";
import { capitalize, clamp, repeatWithProvider, translate } from "../util";
import { DictionaryContext } from "./App";
import Block from "./Block";

interface Props {
  maxTries: number;
  answer: Answer;
}

interface HistoryEntry {
  transcript: Transcript;
  word: string;
}
type History = HistoryEntry[];

export default function Game({ maxTries, answer }: Props) {
  const colCount = answer.transcript.length;
  const dictionary = useContext(DictionaryContext);

  const [history, setHistory] = useState<History>([]);
  const [wordInput, setWordInput] = useState<string>("");
  const transcriptsForInput = dictionary.wordTranscripts(wordInput.trim());
  const [selectedTranscriptIndex, setSelectedTranscriptIndex] = useState(0);
  const noTranscript = transcriptsForInput.length === 0;
  const singleTranscript = transcriptsForInput.length === 1;
  const gameOver = history.length == maxTries;

  if (transcriptsForInput.length) {
    transcriptsForInput.sort((transcript) =>
      transcript.length === colCount ? -1 : 0,
    );
  }

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
    if (key === "Enter") {
      commitInput();
    } else if (key === "ArrowUp" || key === "PageUp") {
      offsetChoice(-1);
    } else if (key === "ArrowDown" || key === "PageDown") {
      offsetChoice(1);
    }
  };

  const offsetChoice = (offset: number) => {
    setSelectedTranscriptIndex((selectedTranscriptIndex) =>
      clamp(selectedTranscriptIndex + offset, 0, transcriptsForInput.length - 1),
    );
  }

  const handleOnClickPrevChoice = () => {
    offsetChoice(-1);
  };

  const handleOnClickNextChoice = () => {
    offsetChoice(1);
  };

  const commitInput = () => {
    if (!phonemeInput?.length || phonemeInput.length != colCount) {
      // todo: check if input is valid & so on
      return;
    }
    setHistory((history) => [
      ...history,
      { transcript: phonemeInput, word: wordInput },
    ]);
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
        repeatWithProvider(Math.max(0, colCount - phonemeInput.length), () => (
          <Block input={true} key={i++}></Block>
        )),
      );
    const emptyBlocks = repeatWithProvider(
      colCount * (maxTries - (inputBlocks.length ? 1 : 0) - history.length),
      () => <Block key={i++}></Block>,
    );
    return [...historyBlocks, ...inputBlocks, ...emptyBlocks];
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

  return (
    <div className="game">
      <div
        className="game-board"
        style={
          { "--rows": maxTries, "--cols": colCount } as React.CSSProperties
        }>
        {makeBoard()}
      </div>
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
      <div className="game-summary">
        <div className="summary-board">
          {makeSummaryBoard(CONSONANTS_LAYOUT)}
        </div>
        <div className="summary-board">{makeSummaryBoard(VOWELS_LAYOUT)}</div>
      </div>
    </div>
  );
}
