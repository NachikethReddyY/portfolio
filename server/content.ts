import editorialSeed from "../src/content/seed.json" with { type: "json" };
import { createClient } from "@sanity/client";
import { portfolioSchema } from "../src/content/validation.ts";
import { mergeContent } from "../src/content/merge.ts";
import { contentQuery } from "../src/content/query.ts";
import type { PortfolioContent } from "../src/content/types.ts";
const seed = portfolioSchema.parse(editorialSeed);
type Result = {
  content: PortfolioContent;
  source: "sanity" | "local";
  fetchedAt: string;
};
let cached: Result | undefined;
let expires = 0;
let pending: Promise<Result> | undefined;
export async function loadPublishedContent(): Promise<Result> {
  if (cached && Date.now() < expires) return cached;
  if (pending) return pending;
  pending = (async () => {
    const fallback: Result = {
      content: seed,
      source: "local",
      fetchedAt: new Date().toISOString(),
    };
    if (process.env.VITE_SANITY_ENABLED === "false") return fallback;
    try {
      const client = createClient({
        projectId:
          process.env.SANITY_STUDIO_PROJECT_ID ||
          process.env.VITE_SANITY_PROJECT_ID ||
          "508uqyvi",
        dataset:
          process.env.SANITY_STUDIO_DATASET ||
          process.env.VITE_SANITY_DATASET ||
          "production",
        apiVersion: "2026-09-17",
        useCdn: true,
        perspective: "published",
      });
      const data = await client.fetch<unknown>(
        contentQuery,
        {},
        { signal: AbortSignal.timeout(4500) },
      );
      return {
        content: mergeContent(seed, data),
        source: "sanity" as const,
        fetchedAt: new Date().toISOString(),
      };
    } catch {
      return fallback;
    }
  })();
  try {
    cached = await pending;
    expires = Date.now() + 60_000;
    return cached;
  } finally {
    pending = undefined;
  }
}
