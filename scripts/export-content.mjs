import { readFileSync, mkdirSync, writeFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { createStarterDocuments } from "../src/cms/starterContent.ts";
import { portfolioSchema } from "../src/content/validation.ts";

const projectRoot = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const outputPath = resolve(
  projectRoot,
  process.env.CONTENT_EXPORT_OUTPUT ??
    "artifacts/content/portfolio-drafts.ndjson",
);

const content = portfolioSchema.parse(
  JSON.parse(
    readFileSync(new URL("../src/content/seed.json", import.meta.url)),
  ),
);

const docs = createStarterDocuments(content);

mkdirSync(dirname(outputPath), { recursive: true });
writeFileSync(
  outputPath,
  docs.map((doc) => JSON.stringify(doc)).join("\n") + "\n",
);

console.log(
  `Exported ${docs.length} drafts to ${outputPath}. No Sanity data was changed.`,
);
