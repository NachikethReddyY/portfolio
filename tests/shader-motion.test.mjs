import test from "node:test";
import assert from "node:assert/strict";
import { createShaderMotion } from "../src/lib/shaderMotion.ts";
function fixture() {
  let id = 0;
  const frames = new Map();
  const draws = [];
  const motion = createShaderMotion((dt) => draws.push(dt), {
    request: (callback) => {
      frames.set(++id, callback);
      return id;
    },
    cancel: (key) => frames.delete(key),
  });
  const tick = (time) => {
    const pending = [...frames.values()];
    frames.clear();
    pending.forEach((callback) => callback(time));
  };
  return { motion, frames, draws, tick };
}
test("shader stops scheduling after its finite motion budget", () => {
  const f = fixture();
  f.motion.setVisible(true);
  f.motion.play(100);
  for (let t = 0; t <= 250; t += 10) f.tick(t);
  assert.equal(f.frames.size, 0);
  assert.ok(f.draws.length >= 3 && f.draws.length <= 5);
});
test("hidden shader cancels work and resumes without counting hidden time", () => {
  const f = fixture();
  f.motion.setVisible(true);
  f.motion.play(100);
  f.tick(0);
  f.tick(40);
  f.motion.setVisible(false);
  assert.equal(f.frames.size, 0);
  f.motion.setVisible(true);
  f.tick(5000);
  f.tick(5040);
  assert.ok(f.frames.size > 0);
  f.tick(5080);
  assert.equal(f.frames.size, 0);
});
test("repeated pointer activity shares one frame; disposal cancels it permanently", () => {
  const f = fixture();
  f.motion.setVisible(true);
  for (let i = 0; i < 20; i++) f.motion.play(200);
  assert.equal(f.frames.size, 1);
  f.motion.dispose();
  assert.equal(f.frames.size, 0);
  f.motion.play(200);
  assert.equal(f.frames.size, 0);
});
test("muted footer text stays above AA contrast at the shader brightness ceiling", () => {
  const luminance = (rgb) =>
    rgb
      .map((v) => v / 255)
      .map((v) => (v <= 0.04045 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4))
      .reduce((sum, v, i) => sum + v * [0.2126, 0.7152, 0.0722][i], 0);
  const maxBackground = [13, 16, 19].map(
    (v, i) => v * 0.76 + [120, 181, 255][i] * 0.24,
  );
  assert.ok(
    (luminance([160, 166, 176]) + 0.05) / (luminance(maxBackground) + 0.05) >=
      4.5,
  );
});
