import type { PortableTextBlock } from "@portabletext/types";

export type LinkItem = {
  label: string;
  href: string;
};

export type Profile = {
  name: string;
  intro: string;
  location: string;
  about: string[];
  links: LinkItem[];
  stats: Array<{ label: string; value: string }>;
};

export type Post = {
  title: string;
  slug: string;
  excerpt: string;
  publishedAt: string;
  category?: string;
  readTime?: string;
  tags: string[];
  coverImage?: string;
  body?: PortableTextBlock[] | string;
  toc?: Array<{ title: string; anchor: string }>;
  footnotes?: Array<{ label: string; text: string; href?: string }>;
  benchmarkRows?: Array<{
    metric: string;
    note: string;
    values: Array<{ model: string; value: string; highlighted?: boolean }>;
  }>;
};
