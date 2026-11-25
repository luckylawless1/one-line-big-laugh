// One Line, Big Laugh — make.fun entry (u-coral-404-one-line-big-laugh-328fb857)
// Writes a single funny line (<=200 chars) to /output/entry.txt.

import { mkdirSync, writeFileSync, readFileSync } from "node:fs";
import { createHash } from "node:crypto";
import { join } from "node:path";

const ENTRY =
  "I taught my dog to fetch my slippers. He now brings me the neighbor's slippers, the neighbor's mail, and, once, the neighbor.";

function checkGate(text: string): void {
  if (text.length < 1 || text.length > 200) {
    throw new Error(`gate: length ${text.length} outside 1-200 chars`);
  }
  if (!text.trim()) throw new Error("gate: entry is only whitespace");
  if (text !== text.trim()) {
    throw new Error("gate: leading/trailing whitespace");
  }
  if (text.includes("\n") || text.includes("\r")) {
    throw new Error("gate: entry must be a single line");
  }
  // Reject control characters (tabs, etc.) — the line must be clean text.
  if (/[\u0000-\u001f\u007f]/.test(text)) {
    throw new Error("gate: control character in entry");
  }
  const bytes = Buffer.byteLength(text, "utf8");
  console.log(`gate: ${text.length} chars, ${bytes} bytes`);
}

const outDir = process.env.MAKEFUN_OUTPUT_DIR || "/output";
mkdirSync(outDir, { recursive: true });
checkGate(ENTRY);
const outPath = join(outDir, "entry.txt");
writeFileSync(outPath, ENTRY + "\n", "utf8");

// Read-back byte verification.
const back = readFileSync(outPath, "utf8");
if (back !== ENTRY + "\n") throw new Error("gate: read-back mismatch");
const sha = createHash("sha256").update(back, "utf8").digest("hex");
console.log(`gate OK: ${ENTRY.length} chars, sha256 ${sha}`);
console.log(ENTRY);
