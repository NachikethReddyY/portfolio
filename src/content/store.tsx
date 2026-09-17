import { createContext, useContext, useEffect, useState } from "react";
import type { ReactNode } from "react";
import { createClient } from "@sanity/client";
import seed from "./seed.json";
import { portfolioSchema } from "./validation";
import { mergeContent } from "./merge";
import { contentQuery } from "./query";
import type { PortfolioContent } from "./types";

export const localContent: PortfolioContent = portfolioSchema.parse(seed);
export const sanityProjectId =
  import.meta.env.VITE_SANITY_PROJECT_ID || "508uqyvi";
export const sanityDataset =
  import.meta.env.VITE_SANITY_DATASET || "production";
const ContentContext = createContext(localContent);
export function ContentProvider({ children }: { children: ReactNode }) {
  const [content, setContent] = useState(localContent);
  useEffect(() => {
    if (import.meta.env.VITE_SANITY_ENABLED === "false") return;
    const controller = new AbortController();
    const timeout = window.setTimeout(() => controller.abort(), 5000);
    try {
      const client = createClient({
        projectId: sanityProjectId,
        dataset: sanityDataset,
        apiVersion: import.meta.env.VITE_SANITY_API_VERSION || "2026-09-17",
        useCdn: true,
        perspective: "published",
      });
      client
        .fetch<unknown>(contentQuery, {}, { signal: controller.signal })
        .then((value) => {
          if (!controller.signal.aborted)
            setContent(mergeContent(localContent, value));
        })
        .catch(() => {
          /* Keep local content readable when CMS is unavailable. */
        })
        .finally(() => window.clearTimeout(timeout));
    } catch {
      window.clearTimeout(timeout);
    }
    return () => {
      controller.abort();
      window.clearTimeout(timeout);
    };
  }, []);
  return (
    <ContentContext.Provider value={content}>
      {children}
    </ContentContext.Provider>
  );
}
export function useContent() {
  return useContext(ContentContext);
}
