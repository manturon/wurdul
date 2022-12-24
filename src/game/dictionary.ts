import Sound, { SoundKey, WordSound } from "./sound";

const DICT = import("../static/dict.json") as object as Promise<
  Record<string, string[]>
>;
const ANSWERS = import("../static/answers.json") as object as Promise<
  [string, string[]][]
>;

type RawTranscription = string;
export type Transcription = SoundKey[];

export class Dictionary {
  private readonly rawTranscriptionsMap: Promise<
    Map<string, RawTranscription[]>
  >;
  private readonly answers: Promise<[string, RawTranscription[]][]>;
  private cache = new Map();
  public readonly words: Promise<Set<string>>;

  constructor(
    dict: Promise<Record<string, string[]>>,
    answers: Promise<[string, string[]][]>
  ) {
    this.rawTranscriptionsMap = dict
      .then(dict => Object.entries(dict))
      .then(entries => new Map(entries));
    this.answers = Promise.all([this.rawTranscriptionsMap, answers]).then(
      ([dict, rawAnswers]) => {
        let answers: Map<string, RawTranscription[]> = new Map(rawAnswers);
        // Overwrite the entries in common from dict with the ones in answers
        // Hopefully temporary...
        for (let [key, value] of answers) {
          dict.set(key, value);
        }
        return rawAnswers;
      }
    );
    this.words = this.rawTranscriptionsMap.then(rt => new Set(rt.keys()));
  }

  public rawTranscriptionToWordSound(transcription: string): WordSound {
    return transcription.split(" ").map(key => Sound.from(key as SoundKey)!);
  }

  public async getAnswer(
    index: number,
    subindex: number
  ): Promise<[string, RawTranscription] | undefined> {
    let answers = await this.answers;
    let [word, wordSounds] = answers.at(index % answers.length) ?? [];
    let wordSound = wordSounds?.at(subindex % wordSounds.length);
    return word && wordSound ? [word, wordSound] : undefined;
  }

  public async wordSounds(english: string): Promise<WordSound[]> {
    if (this.cache.has(english)) {
      return this.cache.get(english);
    } else {
      let sounds =
        (await this.rawTranscriptionsMap)
          .get(english)
          ?.map(this.rawTranscriptionToWordSound) ?? [];
      this.cache.set(english, sounds);
      return sounds;
    }
  }

  public async filterByLength(length: number) {
    let pool = new Map();
    for (let [word, rawTranscriptions] of (
      await this.rawTranscriptionsMap
    ).entries()) {
      let wordSounds = rawTranscriptions
        .map(this.rawTranscriptionToWordSound)
        .filter(ws => ws.length === length);
      if (wordSounds.length) {
        for (let wordSound of wordSounds) {
          pool.set(word, [...(pool.get(word) || []), wordSound]);
        }
      }
    }
    return pool;
  }
}

export const englishDictionary = new Dictionary(DICT, ANSWERS);
