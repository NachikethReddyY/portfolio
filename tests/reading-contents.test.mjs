import test from "node:test";
import assert from "node:assert/strict";
import { readingSections, currentSection } from "../src/lib/readingContents.ts";

test("contents uses actual h2 keys and span text, ignoring empty headings and other blocks", () => {
  assert.deepEqual(
    readingSections([
      {
        _type: "block",
        _key: "intro",
        style: "h2",
        children: [{ text: "The " }, { text: "problem" }],
      },
      {
        _type: "block",
        _key: "body",
        style: "normal",
        children: [{ text: "Paragraph" }],
      },
      { _type: "block", _key: "empty", style: "h2", children: [{ text: " " }] },
      { _type: "contentImage", _key: "image", url: "/image.png", alt: "" },
    ]),
    [{ id: "intro", label: "The problem" }],
  );
});
test("reading position tracks headings in both scroll directions", () => {
  assert.equal(
    currentSection([
      { id: "a", top: 200 },
      { id: "b", top: 800 },
    ]),
    "a",
  );
  assert.equal(
    currentSection([
      { id: "a", top: -300 },
      { id: "b", top: 100 },
    ]),
    "b",
  );
  assert.equal(
    currentSection([
      { id: "a", top: 20 },
      { id: "b", top: 400 },
    ]),
    "a",
  );
  assert.equal(currentSection([]), undefined);
});
