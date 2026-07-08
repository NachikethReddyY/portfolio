import type { PortableTextBlock } from '@portabletext/types';

export type SanityImage = {
  asset?: {
    _ref?: string;
    url?: string;
    metadata?: {
      lqip?: string;
      dimensions?: {
        width: number;
        height: number;
      };
    };
  };
  alt?: string;
  caption?: string;
};

export type Category = {
  _id: string;
  title: string;
  slug: string;
  description?: string;
};

export type Skill = {
  _id: string;
  title: string;
  slug: string;
  category:
    | 'frontend'
    | 'backend'
    | 'ai'
    | 'security'
    | 'mobile'
    | 'database'
    | 'cms'
    | 'design'
    | 'tooling'
    | 'systems';
  proficiency?: 'daily' | 'confident' | 'learning' | 'exploring';
  summary?: string;
};

export type Author = {
  _id: string;
  name: string;
  role?: string;
  image?: SanityImage;
  bio?: string;
};

export type SocialLink = {
  _id: string;
  label: string;
  url: string;
  kind: 'github' | 'linkedin' | 'email' | 'resume' | 'other';
};

export type SeoFields = {
  seoTitle?: string;
  seoDescription?: string;
  seoImage?: SanityImage;
};

export type SiteSettings = SeoFields & {
  name: string;
  role: string;
  education?: string;
  currentFocus?: string;
  githubUsername?: string;
  publicRepoCount?: number;
  email?: string;
  location?: string;
  availability?: string;
  shortBio?: string;
  resumeUrl?: string;
  portfolioUrl?: string;
  socialLinks: SocialLink[];
};

export type FocusArea = {
  title: string;
  description: string;
};

export type ProjectStatus = 'building' | 'shipped' | 'archived' | 'experiment';
export type ProjectType =
  | 'ai-tooling'
  | 'full-stack'
  | 'cybersecurity'
  | 'mobile-hardware'
  | 'cli-systems'
  | 'coursework'
  | 'experiment';

export type Project = SeoFields & {
  _id: string;
  createdAt?: string;
  title: string;
  slug: string;
  summary: string;
  status: ProjectStatus;
  projectType?: ProjectType;
  role?: string;
  period?: string;
  impact?: string;
  featured?: boolean;
  coverImage?: SanityImage;
  gallery?: SanityImage[];
  technologies: Skill[];
  problem: string;
  solution: string;
  whatIBuilt: string[];
  constraints: string[];
  features: string[];
  githubUrl?: string;
  demoUrl?: string;
  lessonsLearned: string[];
  futureImprovements: string[];
  body?: PortableTextBlock[];
};

export type BlogPost = SeoFields & {
  _id: string;
  title: string;
  slug: string;
  excerpt: string;
  publishedAt: string;
  featuredImage?: SanityImage;
  author?: Author;
  categories: Category[];
  body?: PortableTextBlock[];
  readingTime?: string;
};

export type HomePageContent = SeoFields & {
  headline: string;
  subheadline: string;
  positioningStatement?: string;
  primaryCtaLabel: string;
  primaryCtaHref: string;
  secondaryCtaLabel: string;
  secondaryCtaHref: string;
  focusAreas: FocusArea[];
  featuredProjects: Project[];
  highlightedPosts: BlogPost[];
  skills: Skill[];
};
