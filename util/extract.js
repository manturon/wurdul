import fs from "node:fs";
import http from "node:http";
import { inspect } from "node:util";

const downloadIfNotPresent = !!process.argv.find((arg) => arg === "-d");
const showSkipped = !!process.argv.find((arg) => arg === "-s");

// Same as the ones in source
// Single character representations are convenient for saving space
const PHONEMES = {
  "i": "i",
  "u": "u",
  "e": "e",
  "uh": "0",
  "a": "a",
  "awe": "o",
  "ee": "1",
  "oo": "2",
  "ey": "3",
  "oy": "4",
  "oh": "5",
  "eye": "6",
  "ao": "7",
  // "er": "9"
  "b": "b",
  "ch": "c",
  "d": "d",
  "dh": "D",
  "f": "f",
  "g": "g",
  "h": "h",
  "j": "j",
  "k": "k",
  "l": "l",
  "m": "m",
  "n": "n",
  "ng": "N",
  "p": "p",
  "r": "r",
  "s": "s",
  "sh": "S",
  "t": "t",
  "th": "T",
  "v": "v",
  "w": "w",
  "y": "y",
  "z": "z",
  "zh": "Z",
};

// Read CMU dictionary and download if necessary
let contents;
let downloaded = false;

while (true) {
  try {
    contents = fs.readFileSync(new URL("./cmudict-0.7b.txt", import.meta.url), {
      encoding: "latin1",
    });
    break;
  } catch (err) {
    if (downloaded || !err || err.code !== "ENOENT") {
      throw err;
    }
  }
  if (!downloadIfNotPresent) {
    console.error(
      "CMU dictionary source not found, to force download run with `-d'",
    );
    process.exit(1);
  }
  console.error("Downloading and saving CMU dictionary...");
  const gotten = await new Promise((resolve, reject) => {
    let buffer = [];
    http
      .get(
        "http://svn.code.sf.net/p/cmusphinx/code/trunk/cmudict/cmudict-0.7b",
        (res) => {
          if (res.statusCode !== 200) {
            reject(
              new Error("Request failed with status code: " + res.statusCode),
            );
          }
          res.on("data", (chunk) => buffer.push(chunk));
          res.on("end", () =>
            resolve(Buffer.concat(buffer).toString("latin1")),
          );
          res.on("error", (err) => reject(err));
        },
      )
      .on("error", (err) => reject(err))
      .on("timeout", (err) => reject(err));
  });
  fs.writeFileSync(new URL("./cmudict-0.7b.txt", import.meta.url), gotten, {
    encoding: "latin1",
  });
  downloaded = true;
}

// word -> (list of list of phonemes) map
let dictionary = Object.create(null);
let skipped = [];

console.error("Parsing CMU dictionary");
// For each line in CMU dictionary
lines: for (const [i, line] of contents.split("\n").entries()) {
  const first = line[0];
  // Ignore comments
  if (first === ";") {
    continue;
  }
  // Ignore initial punctuation marks
  if (!/[A-Z]/.test(first)) {
    continue;
  }

  // This is the format of lines in CMU 0.7b
  const match =
    /^(?<head>[0-9A-ZÉÀ\.'_-]+?)(?<n>\(\d+\))?\s\s(?<pron>.*)\n?$/.exec(line);
  if (!match) {
    console.error(`Line ${i} did not satisfy expected pattern: ${line}`);
    continue;
  }
  // n only shows up when there's more than one entry with the same head
  let { head, n, pron: pron_ } = match.groups;

  // _ stands for a word separation
  head = head.toLowerCase().replace("_", " ");

  // Ignore digits, periods and whitespace
  if (/[\.\s0-9]/.test(head)) {
    skipped.push(head);
    continue;
  }

  // Get array of source phonemes
  const pron = pron_.split(" ");
  let targetPhonemes = [];

  for (let j = 0; j < pron.length; ++j) {
    const p0 = pron[j];
    // Look ahead one phoneme
    const p1 = pron[j + 1];
    let t;
    switch (p0) {
      case "AE":
      case "AE0":
      case "AE1":
      case "AE2":
        if (p1 === "R") {
          t = ["e", "r"];
          j += 1;
        } else {
          t = "a";
        }
        break;
      case "AA":
      case "AA0":
      case "AA1":
      case "AA2":
        if (p1 === "R") {
          t = ["awe", "r"];
          j += 1;
        } else {
          t = "awe";
        }
      case "AO":
      case "AO0":
      case "AO1":
      case "AO2":
        if (p1 === "R") {
          t = ["oh", "r"];
          j += 1;
        } else {
          t = "awe";
        }
        break;
      case "AH":
      case "AH0":
      case "AH1":
      case "AH2":
        t = "uh";
        break;
      case "AW":
      case "AW0":
      case "AW1":
      case "AW2":
        t = "ao";
        break;
      case "AY":
      case "AY0":
      case "AY1":
      case "AY2":
        t = "eye";
        break;
      case "EH":
      case "EH0":
      case "EH1":
      case "EH2":
        t = "e";
        break;
      case "IH":
      case "IH0":
      case "IH1":
      case "IH2":
        t = "i";
        break;
      case "IY":
      case "IY0":
      case "IY1":
      case "IY2":
        if (p1 === "R") {
          t = ["i", "r"];
          j += 1;
        } else {
          t = "ee";
        }
        break;
      case "EY":
      case "EY0":
      case "EY1":
      case "EY2":
        if (p1 === "R") {
          t = ["e", "r"];
          j += 1;
        } else {
          t = "ey";
        }
        break;
      case "OW":
      case "OW0":
      case "OW1":
      case "OW2":
        t = "oh";
        break;
      case "OY":
      case "OY0":
      case "OY1":
      case "OY2":
        t = "oy";
        break;
      case "UW":
      case "UW0":
      case "UW1":
      case "UW2":
        if (p1 === "R") {
          t = ["u", "r"];
          j += 1;
        } else {
          t = "oo";
        }
        break;
      case "UH":
      case "UH0":
      case "UH1":
      case "UH2":
        t = "u";
        break;
      case "ER":
      case "ER0":
      case "ER1":
      case "ER2":
        t = ["uh", "r"];
        break;
      case "HH":
        t = "h";
        break;
      case "JH":
        t = "j";
        break;
      case "B":
      case "CH":
      case "D":
      case "DH":
      case "F":
      case "G":
      case "K":
      case "L":
      case "M":
      case "N":
      case "NG":
      case "P":
      case "R":
      case "S":
      case "SH":
      case "T":
      case "TH":
      case "V":
      case "W":
      case "Y":
      case "Z":
      case "ZH":
        t = p0.toLowerCase();
        break;
      default:
        console.error(`Unexpected phoneme pattern in line {i}`);
        continue lines;
    }

    targetPhonemes.push(t);
  }
  // ['t', ['ay', 'r']] => ['t', 'ay', 'r']
  targetPhonemes = targetPhonemes.flat();

  let prons = dictionary[head] ?? [];
  if (!dictionary[head]) {
    dictionary[head] = prons;
  }
  prons.push(targetPhonemes);
}

for (const [head, chains] of Object.entries(dictionary)) {
  // Join array of phonemes into strings of one character representing each phoneme
  // ['l', 'oo', 'k', 'ey', 'd', 'ee', 'uh'] => "l7k4d50"
  for (let i = 0; i < chains.length; ++i) {
    chains[i] = chains[i].map((p) => PHONEMES[p]).join("");
  }
  // Remove duplicate pronunciations
  if (chains.length > 1) {
    dictionary[head] = Array.from(new Set(chains));
  }
}

if (showSkipped) {
  console.error(
    "Skipped:",
    inspect(skipped, { maxArrayLength: skipped.length }),
  );
}

fs.writeFileSync(
  new URL("./all.json", import.meta.url),
  JSON.stringify(dictionary, undefined, 0),
  {
    encoding: "utf8",
  },
);
console.error("Saved into `all.json'");
