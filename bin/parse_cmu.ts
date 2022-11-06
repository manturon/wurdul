import http from "node:http";
import fs from "node:fs";
import readline from "node:readline";
import argparse from "argparse";

const panic = (cause?: any): never => {
  if (cause instanceof Error) {
    console.error("error: " + cause.message);
  } else if (cause) {
    console.error("error: " + cause);
  }
  process.exit(1);
};

const CMU_DICTIONARY_URL =
  "http://svn.code.sf.net/p/cmusphinx/code/trunk/cmudict/cmudict-0.7b";

const CMU_KEY_TO_WIKTIONARY_KEY_MAP = new Map([
  ["aa", "awe"],
  ["ao", "aw"], // Temporal
  ["ae", "aa"],
  ["ay", "eye"],
  ["aw", "ao"],
  ["eh", "eh"],
  ["ey", "ey"],
  ["ih", "i"],
  ["iy", "ee"],
  ["ow", "oh"],
  ["oy", "oy"],
  ["uw", "oo"],
  ["uh", "u"],
  ["ah", "uh"],
  ["er", "er"],
  ["b", "b"],
  ["ch", "ch"],
  ["d", "d"],
  ["dh", "dh"],
  ["f", "f"],
  ["g", "g"],
  ["hh", "h"],
  ["jh", "j"],
  ["k", "k"],
  ["l", "l"],
  ["m", "m"],
  ["n", "n"],
  ["ng", "ng"],
  ["p", "p"],
  ["r", "r"],
  ["s", "s"],
  ["sh", "sh"],
  ["t", "t"],
  ["th", "th"],
  ["v", "v"],
  ["w", "w"],
  ["y", "y"],
  ["z", "z"],
  ["zh", "zh"],
]);

const RHOTIC_VOWEL_MAP = new Map([
  ["awe", ["are"]],
  ["oh", ["or"]],
  ["aw", ["or"]],
  ["eye", ["ire"]],
  ["ao", ["our"]],
  ["ey", ["err"]],
  ["e", ["err"]],
  ["aa", ["err"]],
  ["ee", ["ear"]],
  ["i", ["ear"]],
  ["oy", ["oy", "er"]],
  ["u", ["oor"]],
  ["oo", ["oor"]],
  ["uh", ["er"]],
]);

const VOWELS = new Set([
  "ah",
  "aw",
  "a",
  "eye",
  "ow",
  "e",
  "ay",
  "i",
  "ee",
  "oh",
  "oy",
  "oo",
  "uu",
  "uh",
]);

const main = () => {
  const args = ARG_PARSER.parse_args();

  const getSource = async (): Promise<NodeJS.ReadableStream> => {
    if (args.source) {
      let path = args.source;
      if (!path) {
        throw new Error("No path was specified for the source CMU dictionary");
      }
      console.log("Opening CMU dictionary...");
      return fs.createReadStream(path, "utf-8");
    } else {
      console.log("Downloading CMU dictionary...");
      return new Promise((resolve, reject) =>
        http
          .get(new URL(CMU_DICTIONARY_URL))
          .on("response", resolve)
          .on("error", reject)
      );
    }
  };

  const getFilter = async (): Promise<Set<string> | null> => {
    if (args.filter) {
      console.log("Loading filter file...");
      let path = args.filter;
      let stream = fs.createReadStream(path, "utf-8");
      let set = new Set<string>();
      return new Promise((resolve, reject) =>
        readline
          .createInterface(stream)
          .on("line", line => set.add(line.trim().toLowerCase()))
          .on("error", reject)
          .on("close", () => resolve(set))
      );
    }
    return null;
  };

  const normalizeKeys = (keys: string[]) => {
    let i = 0;
    while (i < keys.length) {
      let current = keys[i];
      let next = keys[i + 1];
      let afterNext = keys[i + 2];
      if (
        next &&
        next === "r" &&
        VOWELS.has(current) &&
        current !== "uh" &&
        (!afterNext || !VOWELS.has(afterNext))
      ) {
        // Convert vowel + r (except uh + r) to their rhotic version
        // if it's last syllable or the next syllable doesn't immediately
        // start after the r
        let rhotic = RHOTIC_VOWEL_MAP.get(current);
        keys.splice(i, 2, ...rhotic!);
        i += rhotic!.length - 1;
      } else if (current === "aw") {
        // Cot-caught merger
        keys[i] = "awe";
      }
      i += 1;
    }
  };

  const parseLine = (line: string, filter: Set<string> | null) => {
    line = line.trim().toLowerCase();
    if (line === "" || line.startsWith(";") || /^[^A-z]/.test(line)) {
      // Skip if line is empty, is a comment or
      // starts with something that is not a letter
      return;
    }

    let match = line.match(/([\.'_a-z-]+)(\(\d+\))?\s((?:\s\w+\d?)+)/);
    if (match) {
      let { 1: head, 2: repeat, 3: keys } = match;

      if (filter && filter.has(head)) {
        return;
      }

      let newKeys = keys
        .split(" ")
        .slice(1) // Ignore first empty one
        .map(key => {
          let newKey = CMU_KEY_TO_WIKTIONARY_KEY_MAP.get(key.replace(/\d/, ""));
          if (newKey) {
            return newKey;
          } else {
            throw new Error(
              'Unknown CMU key: "' + key + '"\nin line: "' + line + '"'
            );
          }
        });
      normalizeKeys(newKeys);
      let joinedKeys = newKeys.join(" ");

      // "_" stands for a space in CMU
      head = head.replace("_", " ");

      let entry = [head, joinedKeys];

      if (/[\s'\.-]/.test(head)) {
        // Include both the entry with special characters and
        // another one with all of them removed
        let alt = head.replace(/[\s'\.-]/g, "");
        let altEntry = [alt, joinedKeys];
        return [entry, altEntry];
      } else {
        return [entry];
      }
    } else {
      let msg =
        'Line in source file did not match expected format: "' + line + '"';
      if (args.bailOnError) {
        throw new Error(msg);
      } else {
        console.warn(msg + ", skipping...");
      }
    }
  };

  const parseFile = async (
    sourceStream: Promise<NodeJS.ReadableStream>,
    filter: Promise<Set<string> | null>
  ): Promise<Map<string, string[]>> => {
    console.log("Parsing dictionary...");
    let filterSet = await filter;
    let source = await sourceStream;
    let map = new Map();
    return new Promise((resolve, reject) => {
      readline
        .createInterface(source)
        .on("line", line => {
          parseLine(line, filterSet)?.forEach(([key, value]) =>
            map.set(key, [...(map.get(key) || []), value])
          );
        })
        .on("error", reject)
        .on("close", () => resolve(map));
    });
  };

  const stringifyMap = (map: Map<string, string[]>): string => {
    return JSON.stringify(
      Object.fromEntries(
        Array.from(map.entries(), ([key, value]) => {
          if (value.length > 1) {
            // Remove duplicate transcriptions
            value = Array.from(new Set(value));
          }
          return [key, value];
        })
      )
    );
  };

  try {
    let filter = getFilter().catch(panic);
    let source = getSource().catch(panic);
    let totalEntries: number;
    fs.open(args.output, "w", (err, fd) => {
      if (err) {
        throw new Error("Could not open file for writing");
      }
      parseFile(source, filter)
        .then(map => {
          totalEntries = map.size;
          return stringifyMap(map);
        })
        .then(json => {
          console.log("Writing final output...");
          fs.writeFile(fd, json, "utf-8", () => {
            console.log(`File successfully written (${totalEntries} entries)`);
          });
        });
    });
  } catch (error) {
    panic(error);
  }
};

const ARG_PARSER = new argparse.ArgumentParser({
  description:
    "Parse the CMU dictionary to be used in the format of Wurdul's dictionary",
});
ARG_PARSER.add_argument("--source", {
  type: String,
  help: "file name of the CMU dictionary file",
});
ARG_PARSER.add_argument("--filter", {
  type: String,
  help: "file name of list of words to keep in the final dictionary",
});
ARG_PARSER.add_argument("--output", {
  type: String,
  required: true,
  help: "file name of the final dictionary",
});
ARG_PARSER.add_argument("--bail-on-error", {
  type: Boolean,
  default: false,
  help: "stop parsing as soon as an unexpected line shows up",
});

main();
