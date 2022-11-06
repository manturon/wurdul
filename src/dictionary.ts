import Sound, { SoundKey, WordSound } from "./sound";

const DICT = import("./dict.json");

type RawTranscription = string;
export type Transcription = SoundKey[];

export class Dictionary {
  private readonly rawTranscriptionsMap: Promise<
    Map<string, RawTranscription[]>
  >;
  private cache = new Map();
  public readonly words: Promise<Set<string>>;

  constructor(json: Promise<object>) {
    this.rawTranscriptionsMap = json
      .then(dict => Object.entries(dict))
      .then(entries => new Map(entries));
    this.words = this.rawTranscriptionsMap.then(rt => new Set(rt.keys()));
  }

  private transcriptionToWordSound(transcription: string): WordSound {
    return transcription.split(" ").map(key => Sound.from(key as SoundKey)!);
  }

  public async wordSounds(english: string): Promise<WordSound[]> {
    if (this.cache.has(english)) {
      return this.cache.get(english);
    } else {
      let sounds =
        (await this.rawTranscriptionsMap)
          .get(english)
          ?.map(this.transcriptionToWordSound) ?? [];
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
        .map(this.transcriptionToWordSound)
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

export const englishDictionary = new Dictionary(DICT);
