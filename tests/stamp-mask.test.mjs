import test from "node:test";
import assert from "node:assert/strict";
import sharp from "sharp";
test("stamp cuts are transparent, including corners, while preserving the portrait area", async () => {
  const { data, info } = await sharp("public/images/stamp-mask.svg")
    .ensureAlpha()
    .raw()
    .toBuffer({ resolveWithObject: true });
  const alpha = (x, y) => data[(y * info.width + x) * 4 + 3];
  for (const [x, y] of [
    [0, 0],
    [149, 0],
    [0, 184],
    [149, 184],
    [15, 0],
    [0, 19],
    [75, 184],
    [149, 93],
  ])
    assert.equal(alpha(x, y), 0, `${x},${y} must be cut out`);
  assert.equal(alpha(75, 90), 255);
  assert.ok(alpha(8, 2) > 200);
});
