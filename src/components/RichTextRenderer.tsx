import { PortableText, type PortableTextReactComponents } from '@portabletext/react';
import type { PortableTextBlock } from '@portabletext/types';

import { imageUrlFor } from '../lib/sanity/image';

type RichTextRendererProps = {
  value?: PortableTextBlock[] | string;
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
      <blockquote className="mt-8 rounded-none border border-[#00d2ff] bg-terminal p-5 text-xl font-semibold text-ink shadow-[6px_6px_0_#243a56]">
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
          className="font-bold text-primary-strong underline decoration-primary/50 underline-offset-4"
        >
          {children}
        </a>
      );
    },
    code: ({ children }) => (
      <code className="rounded-none border border-[#00d2ff]/35 bg-surface-strong px-1.5 py-1 font-tech text-sm font-semibold text-ink">
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
            className="w-full rounded-none border border-[#00d2ff]/45 object-cover"
            loading="lazy"
          />
          {value.caption ? (
            <figcaption className="mt-3 text-sm text-muted">{value.caption}</figcaption>
          ) : null}
        </figure>
      );
    },
    callout: ({ value }) => (
      <aside className="stamp-panel my-8 p-5 text-ink">
        <p className="font-tech text-xs font-bold text-primary-strong">{value.tone ?? 'Insight'}</p>
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

function renderInlineMarkdown(text: string) {
  const parts = text.split(/(\[[^\]]+\]\([^)]+\)|`[^`]+`|\*\*[^*]+\*\*|\*[^*]+\*)/g);

  return parts.map((part, index) => {
    const linkMatch = part.match(/^\[([^\]]+)\]\(([^)]+)\)$/);

    if (linkMatch) {
      const [, label, href] = linkMatch;

      return (
        <a
          key={`${part}-${index}`}
          href={href}
          target={href.startsWith('http') ? '_blank' : undefined}
          rel={href.startsWith('http') ? 'noreferrer' : undefined}
          className="font-bold text-primary-strong underline decoration-primary/50 underline-offset-4"
        >
          {label}
        </a>
      );
    }

    if (part.startsWith('`') && part.endsWith('`')) {
      return (
        <code
          key={`${part}-${index}`}
          className="rounded-none border border-[#00d2ff]/35 bg-surface-strong px-1.5 py-1 font-tech text-sm font-semibold text-ink"
        >
          {part.slice(1, -1)}
        </code>
      );
    }

    if (part.startsWith('**') && part.endsWith('**')) {
      return <strong key={`${part}-${index}`}>{part.slice(2, -2)}</strong>;
    }

    if (part.startsWith('*') && part.endsWith('*')) {
      return <em key={`${part}-${index}`}>{part.slice(1, -1)}</em>;
    }

    return part;
  });
}

function MarkdownRenderer({ value }: { value: string }) {
  const blocks = value.trim().split(/\n{2,}/);

  return (
    <div className="prose-content">
      {blocks.map((block, index) => {
        const trimmed = block.trim();
        const key = `${trimmed.slice(0, 24)}-${index}`;

        if (trimmed.startsWith('```')) {
          return (
            <pre
              key={key}
              className="mt-6 overflow-x-auto rounded-none border border-[#00d2ff]/35 bg-terminal p-4 font-tech text-sm leading-6 text-ink"
            >
              <code>{trimmed.replace(/^```[a-z]*\n?/i, '').replace(/```$/, '').trim()}</code>
            </pre>
          );
        }

        if (trimmed.startsWith('### ')) {
          return (
            <h3 key={key} className="mt-9 font-display text-2xl font-black leading-[1.35] text-balance text-ink">
              {renderInlineMarkdown(trimmed.slice(4))}
            </h3>
          );
        }

        if (trimmed.startsWith('## ')) {
          return (
            <h2 key={key} className="mt-12 font-display text-3xl font-black leading-[1.35] text-balance text-ink">
              {renderInlineMarkdown(trimmed.slice(3))}
            </h2>
          );
        }

        if (/^[-*]\s+/m.test(trimmed)) {
          return (
            <ul key={key} className="mt-5 list-disc space-y-2 pl-6 text-muted">
              {trimmed.split('\n').map((item) => (
                <li key={item}>{renderInlineMarkdown(item.replace(/^[-*]\s+/, ''))}</li>
              ))}
            </ul>
          );
        }

        if (/^\d+\.\s+/m.test(trimmed)) {
          return (
            <ol key={key} className="mt-5 list-decimal space-y-2 pl-6 text-muted">
              {trimmed.split('\n').map((item) => (
                <li key={item}>{renderInlineMarkdown(item.replace(/^\d+\.\s+/, ''))}</li>
              ))}
            </ol>
          );
        }

        return (
          <p key={key} className="mt-5 text-pretty text-muted">
            {renderInlineMarkdown(trimmed.replace(/\n/g, ' '))}
          </p>
        );
      })}
    </div>
  );
}

export function RichTextRenderer({ value }: RichTextRendererProps) {
  if (!value?.length) {
    return null;
  }

  if (typeof value === 'string') {
    return <MarkdownRenderer value={value} />;
  }

  return (
    <div className="prose-content">
      <PortableText value={value} components={components} />
    </div>
  );
}
