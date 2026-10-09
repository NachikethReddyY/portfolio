import { portfolioImage } from "../content/images";
import { lazy, Suspense } from "react";
import type { PortableTextBlock } from "@portabletext/types";
import { PortableText } from "@portabletext/react";
import type { PortableTextComponents } from "@portabletext/react";
import type { ContentBlock } from "../content/types";
import { RenderBoundary } from "./RenderBoundary";
const components: PortableTextComponents = {
  types: {
    contentImage: ({ value }) => (
      <figure>
        <img
          src={portfolioImage(value.url, 1400)}
          alt={value.alt}
          loading="lazy"
        />
        {value.caption && <figcaption>{value.caption}</figcaption>}
      </figure>
    ),
    codeBlock: ({ value }) => (
      <figure className="code-block">
        <figcaption>{value.filename || value.language}</figcaption>
        <pre>
          <code>{value.code}</code>
        </pre>
      </figure>
    ),
  },
  marks: {
    link: ({ value, children }) => (
      <a href={value?.href} target="_blank" rel="noopener noreferrer">
        {children}
      </a>
    ),
  },
  block: {
    h2: ({ children, value }) => <h2 id={value._key}>{children}</h2>,
    h3: ({ children, value }) => <h3 id={value._key}>{children}</h3>,
  },
};
export function RichContent({ body }: { body: ContentBlock[] }) {
  return (
    <div className="prose">
      <PortableText value={body} components={components} />
    </div>
  );
}

const LegacyRenderer = lazy(() =>
  import("../legacy/RichTextRenderer").then((module) => ({
    default: module.RichTextRenderer,
  })),
);
export function ReadableArticleFallback({
  body,
}: {
  body: unknown[] | string;
}) {
  const paragraphs =
    typeof body === "string"
      ? [body]
      : body.flatMap((block) => {
          if (!block || typeof block !== "object") return [];
          const fields = block as Record<string, unknown>;
          if (Array.isArray(fields.children)) {
            return fields.children
              .map((child) =>
                child &&
                typeof child === "object" &&
                "text" in child &&
                typeof child.text === "string"
                  ? child.text
                  : "",
              )
              .join("");
          }
          const text = [
            fields.code,
            fields.equation,
            fields.source,
            fields.caption,
          ]
            .filter((value): value is string => typeof value === "string")
            .join("\n");
          return text ? [text] : [];
        });
  return (
    <>
      <p role="status">
        Some formatting couldn’t load. The article text is still available.
      </p>
      <button
        className="button-secondary"
        onClick={() => window.location.reload()}
      >
        Reload formatting
      </button>
      {paragraphs.map((text, index) => (
        <p key={index} style={{ whiteSpace: "pre-wrap" }}>
          {text}
        </p>
      ))}
    </>
  );
}

export function LegacyRichContent({ body }: { body: unknown[] | string }) {
  return (
    <div className="prose legacy-prose">
      <RenderBoundary fallback={<ReadableArticleFallback body={body} />}>
        <Suspense fallback={<p>Loading article…</p>}>
          <LegacyRenderer value={body as PortableTextBlock[] | string} />
        </Suspense>
      </RenderBoundary>
    </div>
  );
}
