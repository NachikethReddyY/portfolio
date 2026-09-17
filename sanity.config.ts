import { starterContentTool } from "./src/cms/StarterContentTool";
import { defineConfig } from "sanity";
import { structureTool } from "sanity/structure";
import { schemaTypes } from "./src/cms/schema";
import { structure } from "./src/cms/structure";
import { schemaTypes as existingSchemaTypes } from "./sanity/schemaTypes";
export default defineConfig({
  name: "nachiketh-portfolio",
  title: "Nachiketh · Content Studio",
  projectId: process.env.SANITY_STUDIO_PROJECT_ID || "508uqyvi",
  dataset: process.env.SANITY_STUDIO_DATASET || "production",
  basePath: "/studio",
  plugins: [structureTool({ structure })],
  tools: (previous) => [...previous, starterContentTool],
  schema: { types: [...existingSchemaTypes, ...schemaTypes] },
});
