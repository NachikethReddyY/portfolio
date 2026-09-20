import test from "node:test";
import assert from "node:assert/strict";
import { headingTransfer } from "../src/lib/headingTransfer.ts";
const line = (top, targetTop = 500) => ({
  left: 100,
  top,
  width: 200,
  height: 40,
  x: 0,
  y: 0,
  scale: 1,
  layoutWidth: 200,
  targetLeft: 50,
  targetTop,
  targetWidth: 100,
});
test("handoff reaches its measured destination and reverses to its origin", () => {
  const start = line(100);
  const [end] = headingTransfer([start], 1);
  assert.deepEqual(end, { x: -50, y: 400, scale: 0.5 });
  const [back] = headingTransfer(
    [{ ...start, left: 50, top: 500, width: 100, height: 20, ...end }],
    0,
  );
  assert.ok(back.x === 0 && back.y === 0 && back.scale === 1);
});
test("two converging lines retain the existing eight pixel clearance", () => {
  const frames = [line(100), line(150, 500)];
  const poses = headingTransfer(frames, 0.8);
  const firstBottom =
    frames[0].top + poses[0].y + frames[0].height * poses[0].scale;
  const secondTop = frames[1].top + poses[1].y;
  assert.ok(secondTop >= firstBottom + 8 - 1e-10);
});
test("separate lines keep their original movement", () => {
  assert.deepEqual(headingTransfer([line(100), line(200, 600)], 0.5), [
    { x: -25, y: 200, scale: 0.75 },
    { x: -25, y: 200, scale: 0.75 },
  ]);
});
