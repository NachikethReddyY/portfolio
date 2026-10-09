export interface TextSpan {
  _type: "span";
  _key: string;
  text: string;
  marks?: string[];
}
export interface TextBlock {
  _type: "block";
  _key: string;
  style?: "normal" | "h2" | "h3" | "blockquote";
  children: TextSpan[];
  markDefs?: { _key: string; _type: "link"; href: string }[];
  listItem?: "bullet" | "number";
  level?: number;
}
export interface ImageBlock {
  _type: "contentImage";
  _key: string;
  url: string;
  alt: string;
  caption?: string;
}
export interface CodeBlock {
  _type: "codeBlock";
  _key: string;
  language: string;
  code: string;
  filename?: string;
}
export type ContentBlock = TextBlock | ImageBlock | CodeBlock;
export interface SourceLink {
  label: string;
  url: string;
}
export interface CaseStudy {
  slug: string;
  name: string;
  category:
    | "AI systems"
    | "Web applications"
    | "Developer tools"
    | "Native apps"
    | "Open source";
  summary: string;
  headline: string;
  status: string;
  year: string;
  image: string;
  imageAlt: string;
  accent: "mint" | "lavender" | "warm" | "blue";
  stack: string[];
  role: string;
  featured: boolean;
  links: SourceLink[];
  body: ContentBlock[];
  legacyRevision?: string;
  legacyBody?: unknown[] | string;
  gallery?: { url: string; alt: string; caption?: string }[];
  cover?: string;
}
export interface Article {
  slug: string;
  title: string;
  excerpt: string;
  category: "Building" | "AI workflows" | "Notes";
  publishedAt: string;
  readMinutes: number;
  featured: boolean;
  body: ContentBlock[];
  legacyRevision?: string;
  legacyBody?: unknown[] | string;
  gallery?: { url: string; alt: string; caption?: string }[];
  cover?: string;
  sources: SourceLink[];
}
export interface Experience {
  id: string;
  organization: string;
  title: string;
  period: string;
  kind: "Education" | "Leadership" | "Open source";
  description: string;
  url?: string;
}
export interface Profile {
  name: string;
  role: string;
  aspiration: string;
  location: string;
  availability: string;
  intro: string;
  github: string;
  linkedin: string;
  email?: string;
  about?: string;
  personal?: string;
  instagram?: string;
  x?: string;
  tools?: { id: string; name: string; description: string }[];
  contributions?: {
    name: string;
    title: string;
    description: string;
    status: string;
    href: string;
    number: string;
  }[];
}
export interface PortfolioContent {
  profile: Profile;
  projects: CaseStudy[];
  articles: Article[];
  experience: Experience[];
}
