import { createElement } from 'react';
import type { PortableTextInputProps, PortableTextPluginsProps } from 'sanity';

const commandRows = [
  ['/h1', '# Heading'],
  ['/h2', '## Heading'],
  ['/h3', '### Heading'],
  ['/bullet', '- Item'],
  ['/number', '1. Item'],
  ['/todo', '- [ ] Task'],
  ['/divider', '---'],
  ['/quote', '> Quote'],
  ['/link', '[label](https://example.com)'],
  ['/highlight', '==highlighted text=='],
  ['/code', '```ts'],
  ['/mermaid', 'Add Mermaid diagram block'],
  ['/math', 'Add LaTeX block or inline equation'],
];

export function RichTextInput(props: PortableTextInputProps) {
  return createElement(
    'div',
    null,
    props.renderDefault(props),
    createElement(
      'div',
      {
        style: {
          marginTop: '0.75rem',
          border: '1px solid rgba(0, 210, 255, 0.28)',
          background: '#0c101a',
          color: '#cbc9dc',
          padding: '0.75rem',
          fontFamily: 'JetBrains Mono, monospace',
          fontSize: '0.75rem',
          lineHeight: 1.5,
        },
      },
      createElement(
        'div',
        { style: { color: '#8fe7ff', fontWeight: 800, marginBottom: '0.5rem' } },
        '/ commands and markdown shortcuts',
      ),
      createElement(
        'div',
        { style: { display: 'grid', gap: '0.35rem' } },
        commandRows.map(([command, shortcut]) =>
          createElement(
            'div',
            {
              key: command,
              style: {
                display: 'grid',
                gap: '0.5rem',
                gridTemplateColumns: 'minmax(5.5rem, max-content) 1fr',
              },
            },
            createElement('code', { style: { color: '#ffe88a' } }, command),
            createElement('span', null, shortcut),
          ),
        ),
      ),
    ),
  );
}

export function RichTextPortableTextPlugins(props: PortableTextPluginsProps) {
  const markdown = props.plugins.markdown ?? {};
  const markdownConfig = markdown.config ?? {};

  return props.renderDefault({
    ...props,
    plugins: {
      ...props.plugins,
      markdown: {
        ...markdown,
        config: {
          ...markdownConfig,
          horizontalRuleObject: ({ context }) => {
            const schemaType = context.schema.blockObjects.find((object) => object.name === 'divider');

            return schemaType ? { _type: schemaType.name } : undefined;
          },
          linkObject: ({ context, props: linkProps }) => {
            const schemaType = context.schema.annotations.find((annotation) => annotation.name === 'link');

            return schemaType ? { _type: schemaType.name, href: linkProps.href } : undefined;
          },
        },
      },
    },
  });
}
