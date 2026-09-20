import { createContext, useContext, useEffect, useState } from "react";
import type { ReactNode } from "react";
import seed from "./seed.json";
import { portfolioSchema } from "./validation";
import type { PortfolioContent } from "./types";

export const localContent: PortfolioContent = portfolioSchema.parse(seed);
export const sanityProjectId =
  import.meta.env.VITE_SANITY_PROJECT_ID || "508uqyvi";
export const sanityDataset =
  import.meta.env.VITE_SANITY_DATASET || "production";
const ContentContext = createContext(localContent);
function initialPageContent(): PortfolioContent {
  if (typeof document === "undefined") return localContent;
  try {
    const snapshot = document.getElementById("portfolio-content")?.textContent;
    if (snapshot) return portfolioSchema.parse(JSON.parse(snapshot));
  } catch {
    // A missing or stale build snapshot must not prevent the portfolio from opening.
  }
  return localContent;
}
export function ContentProvider({
  children,
  initialContent,
}: {
  children: ReactNode;
  initialContent?: PortfolioContent;
}) {
  const [content, setContent] = useState(
    () => initialContent ?? initialPageContent(),
  );
  useEffect(() => {
    if (import.meta.env.VITE_SANITY_ENABLED === "false") return;
    const controller = new AbortController();
    const timeout = window.setTimeout(() => controller.abort(), 5000);
    try {
      fetch("/api/content", { signal: controller.signal })
        .then(async (response) => {
          if (!response.ok)
            throw new Error(`Content request failed: ${response.status}`);
          return portfolioSchema.parse(await response.json());
        })
        .then((value) => {
          if (!controller.signal.aborted) setContent(value);
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
