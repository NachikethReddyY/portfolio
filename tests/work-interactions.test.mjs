import test from "node:test";
import assert from "node:assert/strict";
import { previewTilt, galleryStep } from "../src/lib/workInteractions.ts";
import { playClick } from "../src/lib/interfaceSound.ts";

test("preview movement is neutral at centre and bounded outside the card", () => {
  assert.deepEqual(previewTilt(0.5, 0.5), { x: 0, y: 0 });
  assert.deepEqual(previewTilt(5, -5), { x: 3, y: 3 });
});
test("gallery arrows wrap in both directions and tolerate an empty gallery", () => {
  assert.equal(galleryStep(2, 1, 3), 0);
  assert.equal(galleryStep(0, -1, 3), 2);
  assert.equal(galleryStep(0, 1, 0), 0);
});
test("click sound has a low finite envelope and disconnects after playing", () => {
  const calls = [];
  const parameter = {
    setValueAtTime: (...args) => calls.push(args),
    exponentialRampToValueAtTime: (...args) => calls.push(args),
  };
  const oscillator = {
    frequency: parameter,
    connect() {},
    start() {},
    stop: (time) => calls.push(["stop", time]),
    disconnect: () => calls.push("oscillator disconnected"),
    onended: null,
  };
  const gain = {
    gain: parameter,
    connect() {},
    disconnect: () => calls.push("gain disconnected"),
  };
  playClick({
    currentTime: 10,
    destination: {},
    createOscillator: () => oscillator,
    createGain: () => gain,
  });
  assert.ok(calls.some((entry) => entry[0] === "stop" && entry[1] <= 10.1));
  assert.ok(calls.some((entry) => entry[0] === 0.025));
  oscillator.onended();
  assert.ok(calls.includes("oscillator disconnected"));
  assert.ok(calls.includes("gain disconnected"));
});
