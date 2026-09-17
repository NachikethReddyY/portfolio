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
