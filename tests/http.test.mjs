import { test } from "node:test";
import assert from "node:assert/strict";
import { createServer } from "node:http";
process.env.VITE_SANITY_ENABLED = "false";
const { handlePublicApi } = await import("../server/http.ts");
test("read-only content API serves valid fallback, supports HEAD, rejects mutation methods", async () => {
  const server = createServer(
    (req, res) => void handlePublicApi(req, res, "content"),
  );
  await new Promise((resolve) => server.listen(0, "127.0.0.1", resolve));
  try {
    const base = `http://127.0.0.1:${server.address().port}`;
    const result = await fetch(base);
    assert.equal(result.status, 200);
    assert.equal(result.headers.get("x-content-source"), "local");
    assert.ok((await result.json()).projects.length >= 10);
    const head = await fetch(base, { method: "HEAD" });
    assert.equal(head.status, 200);
    assert.equal(await head.text(), "");
    const post = await fetch(base, { method: "POST" });
    assert.equal(post.status, 405);
    assert.equal(post.headers.get("allow"), "GET, HEAD");
  } finally {
    await new Promise((resolve) => server.close(resolve));
  }
});

test("invalid CMS configuration returns readable local content instead of rejecting", async () => {
  const { execFile } = await import("node:child_process");
  const result = await new Promise((resolve, reject) =>
    execFile(
      process.execPath,
      [
        "--input-type=module",
        "-e",
        "const {loadPublishedContent}=await import('./server/content.ts');console.log((await loadPublishedContent()).source)",
      ],
      {
        cwd: new URL("..", import.meta.url),
        env: {
          ...process.env,
          VITE_SANITY_ENABLED: "true",
          SANITY_STUDIO_PROJECT_ID: "bad/id",
        },
      },
      (error, stdout) => (error ? reject(error) : resolve(stdout)),
    ),
  );
  assert.equal(result.trim(), "local");
});
