import type { ContentBlock } from "../content/types";

export interface ReadingSection {
  id: string;
  label: string;
}
export function readingSections(body: ContentBlock[]): ReadingSection[] {
  return body.flatMap((block) => {
    if (block._type !== "block" || block.style !== "h2") return [];
    const label = block.children
      .map((span) => span.text)
      .join("")
      .trim();
    return label ? [{ id: block._key, label }] : [];
  });
}

export function currentSection(
  headings: { id: string; top: number }[],
  offset = 140,
) {
  // Sort by viewport position first: callers may pass ids in reading order
  // while the page places some of them (meta bands) above earlier chapters.
  const sorted = [...headings].sort((a, b) => a.top - b.top);
  let active = sorted[0]?.id;
  for (const heading of sorted) {
    if (heading.top > offset) break;
    active = heading.id;
  }
  return active;
}
