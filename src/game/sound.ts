import KEYS from "../static/keys.json";

export type SoundType =
  | "vowel"
  | "rhotic"
  | "consonant"
  | "approximant"
  | "liquid"
  | "glide"
  | "voiced"
  | "unvoiced"
  | "plosive"
  | "affricate"
  | "fricative"
  | "nasal";
export type WordSound = Sound[];
export type SoundKey = keyof typeof KEYS;

export class Sound {
  public static SOUND_MAP = new Map<SoundKey, Sound>(
    Object.entries(KEYS).map(([soundKey, sound]) => [
      soundKey,
      Object.assign(new Sound(), sound),
    ]) as any
  );

  public static get all() {
    return Sound.SOUND_MAP.values();
  }

  public static from(key: SoundKey) {
    return Sound.SOUND_MAP.get(key) || null;
  }

  public is(other: Sound) {
    return this === other || other.name === this.name;
  }

  public get ipa() {
    return this.ipas[0];
  }

  public readonly name: SoundKey;
  public readonly type: SoundType[];
  private readonly ipas: string[];
  public readonly asin: string[];
}

export default Sound;
