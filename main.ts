import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";

// The pick: "word".
//
// A dictionary is a book made entirely of words. Erase the word "word"
// and the book can no longer name what it is made of: every entry in it
// is a word, yet the word for "word" itself is gone. The joke needs no
// caption, because the deletion is self-erasing — the moment you read
// the entry you see the hole it leaves behind. It is not a disgust word
// and not a wish ("taxes", "Monday"): the humour comes from the word
// itself, from the gap its absence opens in the language, and it is not
// the field's first thought, which is exactly what the judge rewards.
const word = "word";

// Gate, mirroring the bounty: one word, 1-77 characters, nothing else
// attached. A space, a newline or a carriage return would smuggle in a
// second word or a second line, so any whitespace at all is rejected,
// and the entry must be a single alphabetic token, spelled as-is.
if (word.length < 1 || word.length > 77) {
  throw new Error(`entry must be 1-77 characters, got ${word.length}`);
}
if (word.trim() !== word || /\s/.test(word) || !/^[A-Za-z]+$/.test(word)) {
  throw new Error("entry must be exactly one word with nothing attached");
}

const outputDir = process.env.MAKEFUN_OUTPUT_DIR ?? "/output";
mkdirSync(outputDir, { recursive: true });
const outPath = join(outputDir, "entry.txt");
writeFileSync(outPath, word, "utf8");
// Round-trip: the judge reads exactly this file, so fail loudly if what
// landed on disk differs by even one byte from the word above — a stray
// newline or encoding quirk must never reach the judge unnoticed.
if (readFileSync(outPath, "utf8") !== word) {
  throw new Error("entry.txt round-trip mismatch");
}
console.log(`wrote ${word.length} characters, 1 word`);
