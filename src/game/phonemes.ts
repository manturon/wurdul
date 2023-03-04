import { choose } from "../util";

/**
 * String representation of a phoneme (sound).
 */
export enum Phoneme {
  AWE = "awe",
  ARE = "are",
  AA = "aa",
  EYE = "eye",
  IRE = "ire",
  AO = "ao",
  OUR = "our",
  EH = "eh",
  EY = "ey",
  ERR = "err",
  I = "i",
  EE = "ee",
  EAR = "ear",
  OH = "oh",
  OR = "or",
  OY = "oy",
  OO = "oo",
  U = "u",
  OOR = "oor",
  UH = "uh",
  ER = "er",
  B = "b",
  CH = "ch",
  D = "d",
  DH = "dh",
  F = "f",
  G = "g",
  H = "h",
  J = "j",
  K = "k",
  L = "l",
  M = "m",
  N = "n",
  NG = "ng",
  P = "p",
  R = "r",
  S = "s",
  SH = "sh",
  T = "t",
  TH = "th",
  V = "v",
  W = "w",
  Y = "y",
  Z = "z",
  ZH = "zh",
}

/**
 * Description of a phoneme.
 */
interface PhonemeDescriptor {
  readonly key: string;
  readonly ipa: string;
  readonly examples: readonly string[];
  readonly categories: readonly string[];
}

/**
 * Map with the definitions of all phonemes.
 */
export const PHONEME_DEFINITIONS = new Map<Phoneme, PhonemeDescriptor>([
  [
    Phoneme.AWE,
    {
      key: "awe",
      categories: ["vowel"],
      ipa: "ɑ",
      examples: ["c[al]m", "l[o]ng", "c[augh]t", "c[o]t", "[awe]", "th[ough]t"],
    },
  ],
  [
    Phoneme.ARE,
    {
      key: "are",
      categories: ["vowel", "rhotic"],
      ipa: "ɑr",
      examples: ["[ar]t", "h[ear]t"],
    },
  ],
  [
    Phoneme.AA,
    {
      key: "aa",
      categories: ["vowel"],
      ipa: "æ",
      examples: ["b[a]t", "b[a]n", "m[a]nage"],
    },
  ],
  [
    Phoneme.EYE,
    {
      key: "eye",
      categories: ["vowel"],
      ipa: "aɪ",
      examples: ["[i]tem", "b[i]t[e]", "d[ie]", "s[igh]", "s[ig]n", "b[y]"],
    },
  ],
  [
    Phoneme.IRE,
    {
      key: "ire",
      categories: ["vowel", "rhotic"],
      ipa: "aɪr",
      examples: ["h[ire]", "sp[ir]al"],
    },
  ],
  [
    Phoneme.AO,
    {
      key: "ao",
      categories: ["vowel"],
      ipa: "aʊ",
      examples: ["c[ow]", "ab[ou]t"],
    },
  ],
  [
    Phoneme.OUR,
    {
      key: "our",
      categories: ["vowel", "rhotic"],
      ipa: "aʊr",
      examples: ["fl[our]", "fl[ower]"],
    },
  ],
  [
    Phoneme.EH,
    {
      key: "eh",
      categories: ["vowel"],
      ipa: "ɛ",
      examples: ["b[e]t", "h[ea]lth"],
    },
  ],
  [
    Phoneme.EY,
    {
      key: "ey",
      categories: ["vowel"],
      ipa: "eɪ",
      examples: [
        "b[ai]t",
        "sl[ay]",
        "th[ey]",
        "f[a]c[e]",
        "w[eigh]t",
        "br[ea]k",
      ],
    },
  ],
  [
    Phoneme.ERR,
    {
      key: "err",
      categories: ["vowel", "rhotic"],
      ipa: "ɛr",
      examples: ["[air]", "squ[ear]", "b[ear]", "M[ar]y", "m[arr]y", "m[err]y"],
    },
  ],
  [
    Phoneme.I,
    {
      key: "i",
      categories: ["vowel"],
      ipa: "ɪ",
      examples: ["b[i]t", "cr[y]stal"],
    },
  ],
  [
    Phoneme.EE,
    {
      key: "ee",
      categories: ["vowel"],
      ipa: "iː",
      examples: ["b[ea]t", "g[ee]k", "br[ie]f", "l[e]gal"],
    },
  ],
  [
    Phoneme.EAR,
    {
      key: "ear",
      categories: ["vowel", "rhotic"],
      ipa: "ɪr",
      examples: ["b[eer]", "n[ear]", "m[irr]or"],
    },
  ],
  [
    Phoneme.OH,
    {
      key: "oh",
      categories: ["vowel"],
      ipa: "oʊ",
      examples: ["b[oa]t", "al[o]n[e]", "J[oe]", "d[ough]", "l[ow]", "n[o]"],
    },
  ],
  [
    Phoneme.OR,
    {
      key: "or",
      categories: ["vowel", "rhotic"],
      ipa: "ɔr",
      examples: ["h[or]s[e]", "h[oar]s[e]", "p[our]"],
    },
  ],
  [
    Phoneme.OY,
    {
      key: "oy",
      categories: ["vowel"],
      ipa: "ɔɪ",
      examples: ["ch[oi]c[e]", "b[oy]", "s[oi]l"],
    },
  ],
  [
    Phoneme.OO,
    {
      key: "oo",
      categories: ["vowel"],
      ipa: "uː",
      examples: ["y[ou]", "b[oo]t", "g[oo]s[e]"],
    },
  ],
  [
    Phoneme.U,
    {
      key: "u",
      categories: ["vowel"],
      ipa: "ʊ",
      examples: ["b[oo]k", "p[u]ll"],
    },
  ],
  [
    Phoneme.OOR,
    {
      key: "oor",
      categories: ["vowel", "rhotic"],
      ipa: "ʊr",
      examples: ["p[oor]", "t[our]ist", "c[our]ier"],
    },
  ],
  [
    Phoneme.UH,
    {
      key: "uh",
      categories: ["vowel"],
      ipa: "ə",
      examples: ["b[u]t", "ov[e]n", "[a]bout", "s[o]n", "fl[oo]d", "d[oe]s"],
    },
  ],
  [
    Phoneme.ER,
    {
      key: "er",
      categories: ["vowel", "rhotic"],
      ipa: "ɜr",
      examples: ["n[ur]s[e]", "h[urr]y", "f[er]n", "bett[er]", "b[ir]d"],
    },
  ],
  [
    Phoneme.B,
    {
      key: "b",
      categories: ["consonant", "voiced", "plosive"],
      ipa: "b",
      examples: ["[b]it", "e[bb]"],
    },
  ],
  [
    Phoneme.CH,
    {
      key: "ch",
      categories: ["consonant", "voiceless", "affricate"],
      ipa: "tʃ",
      examples: ["[ch]urch", "ba[tch]", "na[t]ure", "[c]ello"],
    },
  ],
  [
    Phoneme.D,
    {
      key: "d",
      categories: ["consonant", "voiced", "plosive"],
      ipa: "d",
      examples: ["[d]ye", "la[dd]er", "o[dd]", "rubb[ed]"],
    },
  ],
  [
    Phoneme.DH,
    {
      key: "dh",
      categories: ["consonant", "voiced", "fricative"],
      ipa: "ð",
      examples: ["[th]is", "fa[th]er"],
    },
  ],
  [
    Phoneme.F,
    {
      key: "f",
      categories: ["consonant", "voiceless", "fricative"],
      ipa: "f",
      examples: ["[f]ight", "cha[ff]", "[ph]one", "lau[gh]"],
    },
  ],
  [
    Phoneme.G,
    {
      key: "g",
      categories: ["consonant", "voiced", "plosive"],
      ipa: "ɡ",
      examples: ["[g]i[g]", "ba[g]", "[gh]ost", "[gu]ess"],
    },
  ],
  [
    Phoneme.H,
    {
      key: "h",
      categories: ["consonant", "fricative"],
      ipa: "h",
      examples: ["[h]igh", "a[h]ead", "[wh]o"],
    },
  ],
  [
    Phoneme.J,
    {
      key: "j",
      categories: ["consonant", "voiced", "affricate"],
      ipa: "dʒ",
      examples: ["ma[g]ic", "[j]ump", "gra[d]uate", "ba[dg]er", "a[dj]ust"],
    },
  ],
  [
    Phoneme.K,
    {
      key: "k",
      categories: ["consonant", "voiceless", "plosive"],
      ipa: "k",
      examples: ["[c]at", "[k]ite", "lo[ck]", "[ch]ord"],
    },
  ],
  [
    Phoneme.L,
    {
      key: "l",
      categories: ["consonant", "liquid", "approximant"],
      ipa: "l",
      examples: ["[l]ie", "do[ll]ar", "ba[ll]"],
    },
  ],
  [
    Phoneme.M,
    {
      key: "m",
      categories: ["consonant", "nasal"],
      ipa: "m",
      examples: ["[m]y", "ca[m]", "ha[mm]er", "cli[mb]"],
    },
  ],
  [
    Phoneme.N,
    {
      key: "n",
      categories: ["consonant", "nasal"],
      ipa: "n",
      examples: ["[n]igh", "i[nn]", "[kn]ee", "[gn]ome", "ha[nd]some"],
    },
  ],
  [
    Phoneme.NG,
    {
      key: "ng",
      categories: ["consonant", "nasal"],
      ipa: "ŋ",
      examples: ["ri[ng]", "li[n]k"],
    },
  ],
  [
    Phoneme.P,
    {
      key: "p",
      categories: ["consonant", "voiceless", "plosive"],
      ipa: "p",
      examples: ["[p]ie", "a[pp]"],
    },
  ],
  [
    Phoneme.R,
    {
      key: "r",
      categories: ["consonant", "liquid", "approximant"],
      ipa: "r",
      examples: ["[r]ye", "[wr]ong", "[rh]yme"],
    },
  ],
  [
    Phoneme.S,
    {
      key: "s",
      categories: ["consonant", "voiceless", "fricative"],
      ipa: "s",
      examples: ["[s]igh", "me[ss]", "i[c]e", "fla[cc]id", "[sc]ene"],
    },
  ],
  [
    Phoneme.SH,
    {
      key: "sh",
      categories: ["consonant", "voiceless", "fricative"],
      ipa: "ʃ",
      examples: ["[sh]y", "ca[sh]", "emo[ti]on", "o[ce]an"],
    },
  ],
  [
    Phoneme.T,
    {
      key: "t",
      categories: ["consonant", "voiceless", "plosive"],
      ipa: "t",
      examples: [
        "[t]en",
        "wa[t]er",
        "se[tt]",
        "dou[bt]",
        "dress[ed]",
        "[th]yme",
      ],
    },
  ],
  [
    Phoneme.TH,
    {
      key: "th",
      categories: ["consonant", "voiceless", "fricative"],
      ipa: "θ",
      examples: ["[th]igh", "pa[th]"],
    },
  ],
  [
    Phoneme.V,
    {
      key: "v",
      categories: ["consonant", "voiced", "fricative"],
      ipa: "v",
      examples: ["[v]ine", "sa[vv]y", "o[f]", "ha[lve]"],
    },
  ],
  [
    Phoneme.W,
    {
      key: "w",
      categories: ["consonant", "glide", "approximant"],
      ipa: "w",
      examples: ["[w]ine", "s[w]ine", "[wh]at"],
    },
  ],
  [
    Phoneme.Y,
    {
      key: "y",
      categories: ["consonant", "glide", "approximant"],
      ipa: "j",
      examples: ["[y]es", "hallelu[j]ah", "h[|]uman"],
    },
  ],
  [
    Phoneme.Z,
    {
      key: "z",
      categories: ["consonant", "voiced", "fricative"],
      ipa: "z",
      examples: ["[z]oo", "ha[s]", "ro[s]e", "de[ss]ert", "e[|x]am"],
    },
  ],
  [
    Phoneme.ZH,
    {
      key: "zh",
      categories: ["consonant", "voiced", "fricative"],
      ipa: "ʒ",
      examples: ["plea[s]ure", "[g]enre", "bei[ge]", "divi[si]on"],
    },
  ],
]);

export function randomPhonemes(length: number): Phoneme[] {
  return new Array(length)
    .fill(undefined)
    .map((_) => choose(Object.values(Phoneme))!);
}

export function getPhonemeDescriptor(phoneme: Phoneme): PhonemeDescriptor {
  return PHONEME_DEFINITIONS.get(phoneme)!;
}

export default Phoneme;
