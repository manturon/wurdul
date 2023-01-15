import { getTranscript, Transcript } from "./transcript";

interface RawDict {
  version: DictVersion;
  entries: Record<string, string[]>;
}

interface RawAnswers {
  version: DictVersion;
  entries: [string, string[]][];
}

interface DictVersion {
  date: Date;
  seq: number;
}
type RawDictMap = Map<string, string[]>;

export class Dictionary {
  public static CACHE_NAME = "wurml-dict";

  public static async loadFresh() {
    const rawDict = (await fetch("dictionary.json").then((res) =>
      res.json(),
    )) as unknown as RawDict;
    const rawAnswers = (await fetch("answers.json").then((res) =>
      res.json(),
    )) as unknown as RawDict;

    console.debug("Loading dictionary");
    const dictionary = Dictionary.fromObjects(rawDict, rawAnswers);
    if (dictionary) {
      console.debug("Saving dictionary in cache");
      const cacheName = `${Dictionary.CACHE_NAME}-${dictionary.version.seq}`;
      const storage = await window.caches.open(cacheName);
      storage.add("dictionary.json");
      storage.add("answers.json");
    }
    return dictionary;
  }

  public static async attemptFromCache() {
    const { seq } = await fetch("./dictionary_version.json").then((res) =>
      res.json(),
    );
    const cacheName = `${Dictionary.CACHE_NAME}-${seq}`;

    const hasCache = await window.caches.has(cacheName);
    if (hasCache) {
      const storage = await window.caches.open(cacheName);
      const cached = await Promise.all([
        storage.match("dictionary.json"),
        storage.match("answers.json"),
      ]);
      if (cached.every(Boolean)) {
        const [rawDict, rawAnswers] = cached;
        const dictionary = Dictionary.fromObjects(
          await rawDict!.json(),
          await rawAnswers!.json(),
        );
        if (dictionary) {
          console.debug("Loaded dictionary from cache");
          return dictionary;
        }
      }
    }
    console.debug("Dictionary not in cache, loading fresh");
    return this.loadFresh();
  }

  public static fromObjects(rawDict: object, rawAnswers: object) {
    if (
      "version" in rawDict &&
      "entries" in rawDict &&
      "version" in rawAnswers &&
      "entries" in rawAnswers
    ) {
      if (
        JSON.stringify(rawDict.version) != JSON.stringify(rawAnswers.version)
      ) {
        throw new Error("The version for answers and dictionary don't match");
      }
      // Doesn't check that the entries have the right format
      return new Dictionary(rawDict as RawDict, rawAnswers as RawAnswers);
    }
    throw new Error("Invalid object for dictionary format");
  }

  public readonly dict: RawDictMap;
  public readonly answers: RawDictMap;
  public readonly version: DictVersion;

  public constructor(rawDict: RawDict, rawAnswers: RawAnswers) {
    const { date, seq } = rawDict.version;
    this.version = { date: new Date(date), seq };
    this.dict = new Map(Object.entries(rawDict.entries));
    this.answers = structuredClone(rawAnswers.entries);
  }

  public wordTranscripts(word: string): Transcript[] {
    return this.dict.get(word)?.map(getTranscript) ?? [];
  }
}
