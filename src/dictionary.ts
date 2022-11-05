import DICT from "./dict.json";
import Sound, { SoundKey, WordSound } from "./sound";

type RawTranscription = string;
export type Transcription = SoundKey[];

export class Dictionary {
  private readonly rawTranscriptionsMap: Map<string, RawTranscription[]>;
  private cache = new Map();
  public readonly words: Set<string>;

  constructor(wordTranscriptions: Iterable<[string, RawTranscription[]]>) {
    this.rawTranscriptionsMap = new Map(wordTranscriptions);
    this.words = new Set(this.rawTranscriptionsMap.keys());
  }

  private transcriptionToWordSound(transcription: string): WordSound {
    return transcription.split(" ").map(key => Sound.from(key as SoundKey)!);
  }

  public wordSounds(english: string): WordSound[] {
    if (this.cache.has(english)) {
      return this.cache.get(english);
    } else {
      let sounds =
        this.rawTranscriptionsMap
          .get(english)
          ?.map(this.transcriptionToWordSound) ?? [];
      this.cache.set(english, sounds);
      return sounds;
    }
  }

  public filterByLength(length: number) {
    let pool = new Map();
    for (let [word, rawTranscriptions] of this.rawTranscriptionsMap.entries()) {
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

export const englishDictionary = new Dictionary(Object.entries(DICT) as any);
