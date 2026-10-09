import test from "node:test";
import assert from "node:assert/strict";
import { initialEntrance, advanceEntrance } from "../src/lib/heroEntrance.ts";
test("rectangle finishes before the ready laptop can appear", () => {
  assert.equal(initialEntrance.phase, "outline");
  let state = advanceEntrance(initialEntrance, "ready");
  assert.equal(state.phase, "outline");
  state = advanceEntrance(state, "outlined");
  assert.equal(state.phase, "laptop");
  state = advanceEntrance(state, "shown");
  assert.equal(state.phase, "opening");
  assert.equal(advanceEntrance(state, "opened").phase, "complete");
});
test("premature completion cannot bypass readiness or the closed pose", () => {
  assert.equal(advanceEntrance(initialEntrance, "opened").phase, "outline");
  assert.equal(advanceEntrance(initialEntrance, "shown").phase, "outline");
});
test("load failure immediately restores static content, never a blank loading frame", () => {
  const state = advanceEntrance(initialEntrance, "failed");
  assert.equal(state.fallback, true);
  assert.equal(state.phase, "complete");
});
test("failure during opening recovers and reduced motion skips the camera sequence", () => {
  const opening = { phase: "opening", ready: true, fallback: false };
  assert.equal(advanceEntrance(opening, "failed").phase, "complete");
  const complete = advanceEntrance(initialEntrance, "skip");
  assert.equal(complete.phase, "complete");
  assert.equal(advanceEntrance(complete, "ready").phase, "complete");
});

test("slow model waits after the outline and resumes when ready", () => {
  const waiting = advanceEntrance(initialEntrance, "outlined");
  assert.equal(waiting.phase, "waiting");
  assert.equal(advanceEntrance(waiting, "ready").phase, "laptop");
});
