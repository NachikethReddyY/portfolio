import { PortableText, type PortableTextReactComponents } from '@portabletext/react';
import type { PortableTextBlock } from '@portabletext/types';
import katex from 'katex';
import mermaid from 'mermaid';
import { useEffect, useId, useState, type ReactNode } from 'react';
import 'katex/dist/katex.min.css';

import { imageUrlFor } from '../lib/sanity/image';

type RichTextRendererProps = {
  value?: PortableTextBlock[] | string;
};

type CodeBlockValue = {
  filename?: string;
  language?: string;
  code?: string;
};

type TableValue = {
  caption?: string;
  columns?: string[];
  rows?: Array<{
    cells?: string[];
  }>;
};

type TodoListValue = {
  items?: Array<{
    text?: string;
    checked?: boolean;
  }>;
};

type FileBlockValue = {
  title?: string;
  description?: string;
  url?: string;
  asset?: {
    url?: string;
  };
};

type WebBookmarkValue = {
  title?: string;
  url?: string;
  description?: string;
};

type MermaidDiagramValue = {
  caption?: string;
  code?: string;
};

type ButtonValue = {
  label?: string;
  href?: string;
  variant?: 'primary' | 'secondary';
};

type MathBlockValue = {
  caption?: string;
  equation?: string;
};

type MarkdownBlockValue = {
  format?: 'markdown' | 'mdx';
  source?: string;
};

type PortableTextSpan = {
  _key?: string;
  _type: 'span';
  text?: string;
  marks?: string[];
};

type RichTextBlock = PortableTextBlock & {
  children?: Array<PortableTextSpan | Record<string, unknown>>;
};

type ColorMarkValue = {
  color?: string;
};

const textColors: Record<string, string> = {
  default: 'inherit',
  cyan: '#8fe7ff',
  green: '#9ff5bd',
  yellow: '#ffe88a',
  red: '#ff9f9f',
  purple: '#d8b4fe',
};

const backgroundColors: Record<string, string> = {
  cyan: 'rgba(0, 210, 255, 0.18)',
  green: 'rgba(74, 222, 128, 0.18)',
  yellow: 'rgba(250, 204, 21, 0.2)',
  red: 'rgba(248, 113, 113, 0.18)',
  purple: 'rgba(168, 85, 247, 0.18)',
  slate: 'rgba(148, 163, 184, 0.18)',
};

const highlightColors: Record<string, string> = {
  highlight: 'rgba(250, 204, 21, 0.35)',
  highlightYellow: 'rgba(250, 204, 21, 0.35)',
  highlightGreen: 'rgba(74, 222, 128, 0.28)',
  highlightCyan: 'rgba(0, 210, 255, 0.24)',
  highlightRed: 'rgba(248, 113, 113, 0.28)',
  highlightPurple: 'rgba(168, 85, 247, 0.28)',
};

const highlightAliases: Record<string, string> = {
  y: 'highlightYellow',
  yellow: 'highlightYellow',
  g: 'highlightGreen',
  green: 'highlightGreen',
  b: 'highlightCyan',
  blue: 'highlightCyan',
  c: 'highlightCyan',
  cyan: 'highlightCyan',
  r: 'highlightRed',
  red: 'highlightRed',
  p: 'highlightPurple',
  purple: 'highlightPurple',
};

function parseHighlightText(text: string) {
  const match = text.match(/^([a-z]+):\s+(.+)$/i);

  if (!match) {
    return { mark: 'highlight', text };
  }

  const mark = highlightAliases[match[1].toLowerCase()];

  return mark ? { mark, text: match[2] } : { mark: 'highlight', text };
}

function HighlightMark({ children, mark = 'highlight' }: { children: ReactNode; mark?: string }) {
  return (
    <mark
      className="box-decoration-clone rounded-none px-1 text-ink"
      style={{ backgroundColor: highlightColors[mark] ?? highlightColors.highlight }}
    >
      {children}
    </mark>
  );
}

mermaid.initialize({
  startOnLoad: false,
  securityLevel: 'strict',
  theme: 'dark',
  fontFamily: 'Inter, ui-sans-serif, system-ui, sans-serif',
});

function MathExpression({ equation, displayMode = false }: { equation?: string; displayMode?: boolean }) {
  if (!equation) {
    return null;
  }

  try {
    return (
      <span
        className={displayMode ? 'block overflow-x-auto py-2' : 'align-baseline'}
        dangerouslySetInnerHTML={{
          __html: katex.renderToString(equation, {
            displayMode,
            throwOnError: false,
          }),
        }}
      />
    );
  } catch {
    return <code className="font-tech text-primary-strong">{equation}</code>;
  }
}

function MermaidDiagram({ code }: { code?: string }) {
  const reactId = useId();
  const [svg, setSvg] = useState<string>();
  const [error, setError] = useState<string>();

  useEffect(() => {
    if (!code) {
      return;
    }

    let active = true;
    const id = `mermaid-${reactId.replace(/[^a-zA-Z0-9_-]/g, '')}`;

    mermaid
      .render(id, code)
      .then(({ svg: renderedSvg }) => {
        if (active) {
          setSvg(renderedSvg);
          setError(undefined);
        }
      })
      .catch((renderError: unknown) => {
        if (active) {
          setSvg(undefined);
          setError(renderError instanceof Error ? renderError.message : 'Unable to render diagram.');
        }
      });

    return () => {
      active = false;
    };
  }, [code, reactId]);

  if (!code) {
    return null;
  }

  if (error) {
    return (
      <pre className="overflow-x-auto p-4 font-tech text-sm leading-6 text-ink">
        <code>{code}</code>
      </pre>
    );
  }

  return svg ? (
    <div className="overflow-x-auto p-4" dangerouslySetInnerHTML={{ __html: svg }} />
  ) : (
    <div className="p-4 font-tech text-sm text-muted">Rendering diagram...</div>
  );
}

const components: Partial<PortableTextReactComponents> = {
  block: {
    h1: ({ children }) => (
      <h1 className="mt-12 font-display text-4xl font-black leading-tight text-balance text-ink sm:text-5xl">
        {children}
      </h1>
    ),
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
    h4: ({ children }) => (
      <h4 className="mt-8 font-display text-xl font-black leading-tight text-balance text-ink">
        {children}
      </h4>
    ),
    h5: ({ children }) => (
      <h5 className="mt-7 font-display text-lg font-black leading-tight text-balance text-ink">
        {children}
      </h5>
    ),
    h6: ({ children }) => (
      <h6 className="mt-6 font-tech text-sm font-bold uppercase text-primary-strong">
        {children}
      </h6>
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
    highlight: ({ children }) => <HighlightMark>{children}</HighlightMark>,
    highlightYellow: ({ children }) => <HighlightMark mark="highlightYellow">{children}</HighlightMark>,
    highlightGreen: ({ children }) => <HighlightMark mark="highlightGreen">{children}</HighlightMark>,
    highlightCyan: ({ children }) => <HighlightMark mark="highlightCyan">{children}</HighlightMark>,
    highlightRed: ({ children }) => <HighlightMark mark="highlightRed">{children}</HighlightMark>,
    highlightPurple: ({ children }) => <HighlightMark mark="highlightPurple">{children}</HighlightMark>,
    textColor: ({ children, value }) => {
      const color = textColors[(value as ColorMarkValue | undefined)?.color ?? 'default'];

      return <span style={{ color }}>{children}</span>;
    },
    backgroundColor: ({ children, value }) => {
      const backgroundColor = backgroundColors[(value as ColorMarkValue | undefined)?.color ?? 'cyan'];

      return (
        <span className="rounded-none px-1 text-ink" style={{ backgroundColor }}>
          {children}
        </span>
      );
    },
  },
  types: {
    inlineEquation: ({ value }) => (
      <span className="inline-block rounded-none border border-[#00d2ff]/25 bg-surface-strong px-1.5 py-0.5">
        <MathExpression equation={value.equation} />
      </span>
    ),
    divider: ({ value }) => (
      <div className="my-10 flex items-center gap-4" role="separator" aria-label={value.label || undefined}>
        <span className="h-px flex-1 bg-[#00d2ff]/30" />
        {value.label ? <span className="font-tech text-xs font-bold uppercase text-muted">{value.label}</span> : null}
        <span className="h-px flex-1 bg-[#00d2ff]/30" />
      </div>
    ),
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
    todoList: ({ value }) => {
      const todoList = value as TodoListValue;
      const items = todoList.items?.filter((item) => item.text) ?? [];

      if (!items.length) {
        return null;
      }

      return (
        <ul className="mt-6 space-y-3 text-muted">
          {items.map((item, index) => (
            <li key={`${item.text}-${index}`} className="flex gap-3">
              <input
                type="checkbox"
                checked={Boolean(item.checked)}
                readOnly
                className="mt-1 size-4 shrink-0 accent-[#00d2ff]"
                aria-label={item.checked ? 'Completed to-do item' : 'Incomplete to-do item'}
              />
              <span className={item.checked ? 'text-muted line-through decoration-[#00d2ff]/70' : undefined}>
                {item.text}
              </span>
            </li>
          ))}
        </ul>
      );
    },
    codeBlock: ({ value }) => {
      const codeBlock = value as CodeBlockValue;

      if (!codeBlock.code) {
        return null;
      }

      return (
        <figure className="my-8 overflow-hidden rounded-none border border-[#00d2ff]/35 bg-terminal">
          {codeBlock.filename || codeBlock.language ? (
            <figcaption className="flex items-center justify-between gap-4 border-b border-[#00d2ff]/25 px-4 py-2 font-tech text-xs font-bold text-muted">
              <span className="truncate">{codeBlock.filename ?? 'Code'}</span>
              {codeBlock.language ? (
                <span className="shrink-0 uppercase text-primary-strong">{codeBlock.language}</span>
              ) : null}
            </figcaption>
          ) : null}
          <pre className="overflow-x-auto p-4 font-tech text-sm leading-6 text-ink">
            <code>{codeBlock.code}</code>
          </pre>
        </figure>
      );
    },
    markdownBlock: ({ value }) => {
      const markdownBlock = value as MarkdownBlockValue;

      if (!markdownBlock.source) {
        return null;
      }

      return <MarkdownRenderer value={markdownBlock.source} />;
    },
    fileBlock: ({ value }) => {
      const fileBlock = value as FileBlockValue;
      const url = fileBlock.url ?? fileBlock.asset?.url;

      if (!url) {
        return null;
      }

      return (
        <a
          href={url}
          className="my-8 block rounded-none border border-[#00d2ff]/35 bg-terminal p-4 text-ink hover:border-[#00d2ff]"
        >
          <span className="block font-tech text-xs font-bold uppercase text-primary-strong">File</span>
          <span className="mt-2 block font-display text-xl font-black">
            {fileBlock.title || url.split('/').pop() || 'Download file'}
          </span>
          {fileBlock.description ? <span className="mt-1 block text-sm text-muted">{fileBlock.description}</span> : null}
        </a>
      );
    },
    webBookmark: ({ value }) => {
      const bookmark = value as WebBookmarkValue;

      if (!bookmark.url) {
        return null;
      }

      return (
        <a
          href={bookmark.url}
          target="_blank"
          rel="noreferrer"
          className="my-8 block rounded-none border border-[#00d2ff]/35 bg-terminal p-5 text-ink hover:border-[#00d2ff] hover:text-primary-strong"
        >
          <span className="font-display text-xl font-black">{bookmark.title || bookmark.url}</span>
          {bookmark.description ? <span className="mt-2 block text-sm text-muted">{bookmark.description}</span> : null}
          <span className="mt-4 block truncate font-tech text-xs font-bold text-muted">{bookmark.url}</span>
        </a>
      );
    },
    mermaidDiagram: ({ value }) => {
      const diagram = value as MermaidDiagramValue;

      if (!diagram.code) {
        return null;
      }

      return (
        <figure className="my-8 overflow-hidden rounded-none border border-[#00d2ff]/35 bg-terminal">
          <MermaidDiagram code={diagram.code} />
          {diagram.caption ? <figcaption className="border-t border-[#00d2ff]/25 px-4 py-3 text-sm text-muted">{diagram.caption}</figcaption> : null}
        </figure>
      );
    },
    button: ({ value }) => {
      const button = value as ButtonValue;

      if (!button.href || !button.label) {
        return null;
      }

      const isExternal = button.href.startsWith('http');

      return (
        <p className="mt-8">
          <a
            href={button.href}
            target={isExternal ? '_blank' : undefined}
            rel={isExternal ? 'noreferrer' : undefined}
            className={[
              'pressable inline-flex min-h-12 items-center rounded-none border px-5 font-tech text-sm font-bold',
              button.variant === 'secondary'
                ? 'border-[#00d2ff]/45 bg-surface-strong text-ink hover:border-[#00d2ff]'
                : 'border-[#00d2ff] bg-terminal text-on-ink hover:text-primary-strong',
            ].join(' ')}
          >
            {button.label}
          </a>
        </p>
      );
    },
    mathBlock: ({ value }) => {
      const mathBlock = value as MathBlockValue;

      if (!mathBlock.equation) {
        return null;
      }

      return (
        <figure className="my-8 overflow-x-auto rounded-none border border-[#00d2ff]/35 bg-terminal p-5 text-ink">
          <MathExpression equation={mathBlock.equation} displayMode />
          {mathBlock.caption ? <figcaption className="mt-3 text-sm text-muted">{mathBlock.caption}</figcaption> : null}
        </figure>
      );
    },
    table: ({ value }) => {
      const table = value as TableValue;
      const rows = table.rows?.filter((row) => row.cells?.length) ?? [];

      if (!rows.length) {
        return null;
      }

      const hasColumns = Boolean(table.columns?.length);
      const head = hasColumns ? table.columns : rows[0].cells;
      const body = hasColumns ? rows : rows.slice(1);

      return (
        <figure className="my-10 overflow-x-auto">
          <table className="min-w-full border-collapse border border-[#00d2ff]/35 text-left text-sm">
            <thead className="bg-terminal text-ink">
              <tr>
                {head?.map((cell, index) => (
                  <th key={`${cell}-${index}`} className="border border-[#00d2ff]/35 px-4 py-3 font-tech font-bold">
                    {cell}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="text-muted">
              {body.map((row, rowIndex) => (
                <tr key={rowIndex} className="odd:bg-surface-strong/40">
                  {row.cells?.map((cell, cellIndex) => (
                    <td key={`${cell}-${cellIndex}`} className="border border-[#00d2ff]/25 px-4 py-3 align-top">
                      {cell}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
          {table.caption ? <figcaption className="mt-3 text-sm text-muted">{table.caption}</figcaption> : null}
        </figure>
      );
    },
  },
  list: {
    bullet: ({ children }) => <ul className="mt-5 list-disc space-y-2 pl-6 text-muted">{children}</ul>,
    number: ({ children }) => (
      <ol className="mt-5 list-decimal space-y-2 pl-6 text-muted">{children}</ol>
    ),
    checkmarks: ({ children }) => <ul className="mt-5 list-none space-y-2 pl-0 text-muted">{children}</ul>,
  },
  listItem: {
    checkmarks: ({ children }) => (
      <li className="flex gap-3">
        <span className="mt-0.5 grid size-5 shrink-0 place-items-center border border-[#00d2ff]/45 font-tech text-[0.68rem] font-bold text-primary-strong" aria-hidden="true">
          x
        </span>
        <span>{children}</span>
      </li>
    ),
  },
};

function renderInlineMarkdown(text: string) {
  const parts = text.split(/(\[[^\]]+\]\([^)]+\)|`[^`]+`|==[^=]+==|\*\*[^*]+\*\*|\*[^*]+\*)/g);

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

    if (part.startsWith('==') && part.endsWith('==')) {
      const highlight = parseHighlightText(part.slice(2, -2));

      return (
        <HighlightMark key={`${part}-${index}`} mark={highlight.mark}>
          {highlight.text}
        </HighlightMark>
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

        if (/^[-*]\s+\[[ xX]\]\s+/m.test(trimmed)) {
          return (
            <ul key={key} className="mt-6 space-y-3 text-muted">
              {trimmed.split('\n').map((item) => {
                const taskMatch = item.match(/^[-*]\s+\[([ xX])\]\s+(.*)$/);

                if (!taskMatch) {
                  return null;
                }

                const checked = taskMatch[1].toLowerCase() === 'x';
                const label = taskMatch[2];

                return (
                  <li key={item} className="flex gap-3">
                    <input
                      type="checkbox"
                      checked={checked}
                      readOnly
                      className="mt-1 size-4 shrink-0 accent-[#00d2ff]"
                      aria-label={checked ? 'Completed to-do item' : 'Incomplete to-do item'}
                    />
                    <span className={checked ? 'text-muted line-through decoration-[#00d2ff]/70' : undefined}>
                      {renderInlineMarkdown(label)}
                    </span>
                  </li>
                );
              })}
            </ul>
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

function addMarkdownHighlightMarks(value: PortableTextBlock[]) {
  return value.map((block) => {
    const richBlock = block as RichTextBlock;

    if (richBlock._type !== 'block' || !Array.isArray(richBlock.children)) {
      return block;
    }

    let changed = false;
    const children = richBlock.children.flatMap((child, childIndex) => {
      if (child._type !== 'span' || typeof child.text !== 'string' || !child.text.includes('==')) {
        return [child];
      }

      const span = child as PortableTextSpan;
      const parts: PortableTextSpan[] = [];
      const matches = span.text?.matchAll(/==([^=\n]+)==/g) ?? [];
      let cursor = 0;
      let matchIndex = 0;

      for (const match of matches) {
        const index = match.index ?? 0;
        const highlight = parseHighlightText(match[1]);

        if (index > cursor) {
          parts.push({
            ...span,
            _key: `${span._key ?? childIndex}-plain-${matchIndex}`,
            text: span.text?.slice(cursor, index),
          });
        }

        parts.push({
          ...span,
          _key: `${span._key ?? childIndex}-highlight-${matchIndex}`,
          text: highlight.text,
          marks: Array.from(new Set([...(span.marks ?? []), highlight.mark])),
        });

        cursor = index + match[0].length;
        matchIndex += 1;
      }

      if (!parts.length) {
        return [child];
      }

      if (span.text && cursor < span.text.length) {
        parts.push({
          ...span,
          _key: `${span._key ?? childIndex}-plain-tail`,
          text: span.text.slice(cursor),
        });
      }

      changed = true;
      return parts;
    });

    return changed ? { ...richBlock, children } : block;
  });
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
      <PortableText value={addMarkdownHighlightMarks(value)} components={components} />
    </div>
  );
}
