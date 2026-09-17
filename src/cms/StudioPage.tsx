import { Studio, defineConfig } from "sanity";
import { structureTool } from "sanity/structure";
import { schemaTypes } from "./schema";
import { structure } from "./structure";
import { schemaTypes as legacySchemaTypes } from "../../sanity/schemaTypes";
import { sanityProjectId, sanityDataset } from "../content/store";
const config = defineConfig({
  name: "nachiketh-portfolio",
  title: "Nachiketh · Content Studio",
  projectId: sanityProjectId,
  dataset: sanityDataset,
  basePath: "/studio",
  plugins: [structureTool({ structure })],
  schema: { types: [...legacySchemaTypes, ...schemaTypes] },
});
export default function StudioPage() {
  return (
    <div className="studio-root">
      <Studio config={config} />
    </div>
  );
}
