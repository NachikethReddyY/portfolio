import { PortableText, type PortableTextReactComponents } from '@portabletext/react';
import type { PortableTextBlock } from '@portabletext/types';

import { imageUrlFor } from '../lib/sanity/image';

type RichTextRendererProps = {
  value?: PortableTextBlock[];
};

const components: Partial<PortableTextReactComponents> = {
  block: {
    h2: ({ children }) => (
      <h2 className="mt-12 font-display text-3xl font-black leading-tight text-balance text-ink">
        {children}
      </h2>
    ),
    h3: ({ children }) => (
      <h3 className="mt-9 font-display text-2xl font-black leading-tight text-balance text-ink">
        {children}
      </h3>
    ),
    normal: ({ children }) => <p className="mt-5 text-pretty text-muted">{children}</p>,
    blockquote: ({ children }) => (
      <blockquote className="mt-8 rounded-md border-2 border-ink bg-accent p-5 text-xl font-semibold text-on-accent">
        {children}
      </blockquote>
    ),
  },
  marks: {
    link: ({ children, value }) => {
      const href = value?.href ?? '#';
      return (
        <a
          href={href}
          target={href.startsWith('http') ? '_blank' : undefined}
          rel={href.startsWith('http') ? 'noreferrer' : undefined}
          className="font-bold text-violet underline decoration-violet/50 underline-offset-4"
        >
          {children}
        </a>
      );
    },
    code: ({ children }) => (
      <code className="rounded-md border border-ink bg-surface-strong px-1.5 py-1 font-tech text-sm font-semibold text-ink">
        {children}
      </code>
    ),
  },
  types: {
    image: ({ value }) => {
      const src = imageUrlFor(value, 1400);

      if (!src) {
        return null;
      }

      return (
        <figure className="my-10">
          <img
            src={src}
            alt={value.alt ?? ''}
            className="w-full rounded-lg border-2 border-ink object-cover"
            loading="lazy"
          />
          {value.caption ? (
            <figcaption className="mt-3 text-sm text-muted">{value.caption}</figcaption>
          ) : null}
        </figure>
      );
    },
    callout: ({ value }) => (
      <aside className="stamp-panel my-8 rounded-lg p-5 text-ink">
        <p className="font-tech text-xs font-bold text-violet">{value.tone ?? 'Insight'}</p>
        <p className="mt-2 text-pretty">{value.text}</p>
      </aside>
    ),
  },
  list: {
    bullet: ({ children }) => <ul className="mt-5 list-disc space-y-2 pl-6 text-muted">{children}</ul>,
    number: ({ children }) => (
      <ol className="mt-5 list-decimal space-y-2 pl-6 text-muted">{children}</ol>
    ),
  },
};

export function RichTextRenderer({ value }: RichTextRendererProps) {
  if (!value?.length) {
    return null;
  }

  return (
    <div className="prose-content">
      <PortableText value={value} components={components} />
    </div>
  );
}
