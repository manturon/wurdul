import KEYS from "./keys.json";

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

export type Sound = {
  name: string;
  type: SoundType[];
  ipa: string[];
  asin: string[];
  alias?: string[];
  rhotic?: string[];
  unrhotic?: string[];
  voiced?: string[];
  voiceless?: string[];
};

export const SOUNDS = new Map<string, Sound>(
  Object.entries(KEYS.sound as Record<string, Sound>)
);