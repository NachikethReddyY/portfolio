import { lazy, Suspense } from "react";
import type { PortableTextBlock } from "@portabletext/types";
import { PortableText } from "@portabletext/react";
import type { PortableTextComponents } from "@portabletext/react";
import type { ContentBlock } from "../content/types";
const components: PortableTextComponents = {
  types: {
    contentImage: ({ value }) => (
      <figure>
        <img src={value.url} alt={value.alt} loading="lazy" />
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
export function LegacyRichContent({ body }: { body: unknown[] | string }) {
  return (
    <div className="prose legacy-prose">
      <Suspense fallback={<p>Loading article…</p>}>
        <LegacyRenderer value={body as PortableTextBlock[] | string} />
      </Suspense>
    </div>
  );
}
