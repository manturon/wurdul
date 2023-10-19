/**
 * String representation of a phoneme (sound).
 */
export enum PhonemeKey {
  IH = "i", // limb, beer
  U = "u", // foot, poor
  EH = "e", // bet, air
  UH = "0", // but, fern
  AA = "a", // cat
  AH = "o", // caught, are
  EE = "1", // fee
  OO = "2", // do
  AY = "3", // lay
  OY = "4", // boy
  OH = "5", // oh, or
  EYE = "6", // eye, ire
  AO = "7", // now
  // ER = "8", // fern
  B = "b",
  CH = "c",
  D = "d",
  DH = "D",
  F = "f",
  G = "g",
  H = "h",
  J = "j",
  K = "k",
  L = "l",
  M = "m",
  N = "n",
  NG = "N",
  P = "p",
  R = "r",
  S = "s",
  SH = "S",
  T = "t",
  TH = "T",
  V = "v",
  W = "w",
  Y = "y",
  Z = "z",
  ZH = "Z",
}

/**
 * Description of a phoneme.
 */
interface PhonemeDescriptor {
  readonly key: string;
  readonly ipa: string;
  readonly examples: readonly string[];
}

/**
 * Map with the definitions of all phonemes.
 */
export const phonemes: Record<PhonemeKey, PhonemeDescriptor> = {
  [PhonemeKey.IH]: {
    key: "ih",
    ipa: "i",
    examples: ["k[i]t", "b[i]t", "b[ee]r", "m[i]rror"],
  },
  [PhonemeKey.U]: {
    key: "u",
    ipa: "u",
    examples: ["f[oo]t", "p[u]ll", "p[oo]r"],
  },
  [PhonemeKey.EH]: {
    key: "eh",
    ipa: "e",
    examples: ["dr[e]ss", "b[e]t", "b[ea]r", "m[a]rry"],
  },
  [PhonemeKey.UH]: {
    key: "uh",
    ipa: "ə",
    examples: ["str[u]t", "b[u]t", "comm[a]", "s[o]n", "n[u]rse", "b[i]rd"],
  },
  [PhonemeKey.AA]: {
    key: "aa",
    ipa: "æ",
    examples: ["tr[a]p", "b[a]n"],
  },
  [PhonemeKey.AH]: {
    key: "ah",
    ipa: "ɑ",
    examples: ["l[o]t", "th[ough]t", "p[al]m", "[a]re"],
  },
  [PhonemeKey.EE]: {
    key: "ee",
    ipa: "ij",
    examples: ["fl[ee]ce", "b[ee]n", "br[ie]f"],
  },
  [PhonemeKey.OO]: {
    key: "oo",
    ipa: "uw",
    examples: ["g[oo]se", "b[oo]t", "p[oo]l"],
  },
  [PhonemeKey.AY]: {
    key: "ay",
    ipa: "ej",
    examples: ["f[a]ce", "b[a]ne", "sl[ay]"],
  },
  [PhonemeKey.OY]: {
    key: "oy",
    ipa: "oj",
    examples: ["ch[oi]ce", "b[oy]", "s[oi]l"],
  },
  [PhonemeKey.OH]: {
    key: "oh",
    ipa: "ow",
    examples: ["g[oa]t", "d[ough]", "h[o]rse"],
  },
  [PhonemeKey.EYE]: {
    key: "eye",
    ipa: "aj",
    examples: ["pr[i]ce", "ab[i]de", "v[i]le", "[i]re"],
  },
  [PhonemeKey.AO]: {
    key: "ao",
    ipa: "aw",
    examples: ["m[ou]th", "ab[ou]t", "[ou]r"],
  },
  // [Phoneme.ER]: {
  //   key: "er",
  //   ipa: "ər",
  //   examples: ["n[u]rse", "b[i]rd", "h[u]rry"],
  // },
  [PhonemeKey.B]: {
    key: "b",
    ipa: "b",
    examples: ["[b]ad"],
  },
  [PhonemeKey.CH]: {
    key: "ch",
    ipa: "tʃ",
    examples: ["[ch]urch"],
  },
  [PhonemeKey.D]: {
    key: "d",
    ipa: "d",
    examples: ["[d]ye", "rubb[ed]"],
  },
  [PhonemeKey.DH]: {
    key: "dh",
    ipa: "ð",
    examples: ["[th]at"],
  },
  [PhonemeKey.F]: {
    key: "f",
    ipa: "f",
    examples: ["[f]ight", "lau[gh]"],
  },
  [PhonemeKey.G]: {
    key: "g",
    ipa: "g",
    examples: ["[g]ood"],
  },
  [PhonemeKey.H]: {
    key: "h",
    ipa: "h",
    examples: ["[h]and", "[wh]o"],
  },
  [PhonemeKey.J]: {
    key: "j",
    ipa: "dʒ",
    examples: ["[j]ust", "gra[d]uate", "ba[dg]er"],
  },
  [PhonemeKey.K]: {
    key: "k",
    ipa: "k",
    examples: ["[c]at", "thin[k]"],
  },
  [PhonemeKey.L]: {
    key: "l",
    ipa: "l",
    examples: ["[l]ie", "ba[ll]"],
  },
  [PhonemeKey.M]: {
    key: "m",
    ipa: "m",
    examples: ["[m]oon"],
  },
  [PhonemeKey.N]: {
    key: "n",
    ipa: "n",
    examples: ["[n]ose", "i[nn]"],
  },
  [PhonemeKey.NG]: {
    key: "ng",
    ipa: "ŋ",
    examples: ["ri[ng]", "li[n]k"],
  },
  [PhonemeKey.P]: {
    key: "p",
    ipa: "p",
    examples: ["[p]ie", "a[pp]"],
  },
  [PhonemeKey.R]: {
    key: "r",
    ipa: "r",
    examples: ["[r]ye", "[wr]ong"],
  },
  [PhonemeKey.S]: {
    key: "s",
    ipa: "s",
    examples: ["[s]it", "i[c]e"],
  },
  [PhonemeKey.SH]: {
    key: "sh",
    ipa: "ʃ",
    examples: ["[sh]y", "o[ce]an"],
  },
  [PhonemeKey.T]: {
    key: "t",
    ipa: "t",
    examples: ["[t]ip", "wa[t]er", "[th]yme"],
  },
  [PhonemeKey.TH]: {
    key: "th",
    ipa: "θ",
    examples: ["[th]ing"],
  },
  [PhonemeKey.V]: {
    key: "v",
    ipa: "v",
    examples: ["[v]ine", "o[f]"],
  },
  [PhonemeKey.W]: {
    key: "w",
    ipa: "w",
    examples: ["[w]ine", "[wh]at"],
  },
  [PhonemeKey.Y]: {
    key: "y",
    ipa: "j",
    examples: ["[y]es", "[hu]man"],
  },
  [PhonemeKey.Z]: {
    key: "z",
    ipa: "z",
    examples: ["[z]oo", "ro[s]e"],
  },
  [PhonemeKey.ZH]: {
    key: "zh",
    ipa: "ʒ",
    examples: ["[g]enre", "plea[s]ure"],
  },
};
