import type { PortableTextBlock } from '@portabletext/types';

function extractText(value: unknown): string {
  if (!value) {
    return '';
  }

  if (typeof value === 'string') {
    return value;
  }

  if (Array.isArray(value)) {
    return value.map(extractText).join(' ');
  }

  if (typeof value === 'object') {
    const record = value as Record<string, unknown>;
    if (typeof record.text === 'string') {
      return record.text;
    }
    if (Array.isArray(record.children)) {
      return record.children.map(extractText).join(' ');
    }
  }

  return '';
}

export function getReadingTime(blocks?: PortableTextBlock[]) {
  const text = extractText(blocks);
  const words = text.trim().split(/\s+/).filter(Boolean).length;
  const minutes = Math.max(1, Math.ceil(words / 220));
  return `${minutes} min read`;
}
