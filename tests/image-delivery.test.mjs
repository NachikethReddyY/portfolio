import test from "node:test";
import assert from "node:assert/strict";
import { portfolioImage } from "../src/content/images.ts";

test("Sanity images receive bounded format-aware sizing without losing editorial crop", () => {
  const result = new URL(
    portfolioImage(
      "https://cdn.sanity.io/images/project/production/photo.png?rect=10,20,400,300",
      960,
    ),
  );
  assert.equal(result.searchParams.get("w"), "960");
  assert.equal(result.searchParams.get("auto"), "format");
  assert.equal(result.searchParams.get("fit"), "max");
  assert.equal(result.searchParams.get("rect"), "10,20,400,300");
  assert.equal(
    portfolioImage("/images/lah-cover.webp", 960),
    "/images/lah-cover.webp",
  );
  assert.equal(
    portfolioImage("https://example.com/photo.png", 960),
    "https://example.com/photo.png",
  );
  assert.equal(portfolioImage("", 960), "");
});

test("editor-specified image fit and focal crop are preserved", () => {
  const result = new URL(
    portfolioImage(
      "https://cdn.sanity.io/images/project/production/photo.png?fit=crop&crop=focalpoint&fp-x=.4&h=600",
      1200,
    ),
  );
  assert.equal(result.searchParams.get("fit"), "crop");
  assert.equal(result.searchParams.get("crop"), "focalpoint");
  assert.equal(result.searchParams.get("fp-x"), ".4");
  assert.equal(result.searchParams.get("h"), "600");
});

test("Sanity editor crops become pixel rectangles without discarding delivery options", async () => {
  const { applyImageCrop } = await import("../src/content/images.ts");
  const source =
    "https://cdn.sanity.io/images/project/production/abcdef-1000x800.png?auto=format";
  const crop = { left: 0.1, top: 0.2, right: 0.15, bottom: 0.05 };
  const result = new URL(applyImageCrop(source, { crop }));
  assert.equal(result.searchParams.get("rect"), "100,160,750,600");
  assert.equal(result.searchParams.get("auto"), "format");
  for (const metadata of [
    null,
    {},
    { crop: { ...crop, left: 2 } },
    { crop: { ...crop, left: 0.9 } },
  ]) {
    assert.equal(applyImageCrop(source, metadata), source);
  }
  assert.equal(
    applyImageCrop("/images/local.webp", { crop }),
    "/images/local.webp",
  );
  assert.equal(
    applyImageCrop("https://example.com/image.png", { crop }),
    "https://example.com/image.png",
  );
});
