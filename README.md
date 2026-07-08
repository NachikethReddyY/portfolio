# Nachiketh Reddy Portfolio

A Sanity-powered portfolio for Nachiketh Reddy, a Year 2 IT Diploma student at Singapore Polytechnic, full stack developer, and aspiring AI developer.

The site is built to show real project evidence: AI tooling, full-stack apps, secure coding work, hackathon prototypes, local-first tools, and writing about learning in public.

## Features

- Vite + React + TypeScript frontend
- Tailwind CSS 4 design system with OKLCH tokens
- Sanity Studio schemas for posts, projects, authors, categories/tags, site settings, homepage content, social links, and skills
- Rich project fields for role, period, project type, proof/impact, what I personally built, constraints/tradeoffs, lessons, and future improvements
- Routes for `/`, `/blog`, `/blog/:slug`, `/projects`, `/projects/:slug`, `/about`, and `/contact`
- Typed GROQ query helpers and fallback content based on Nachiketh's public GitHub projects
- Portable Text rendering, reading time, SEO metadata, responsive UI, focus states, and reduced-motion support

## Getting Started

```bash
npm install
cp .env.example .env.local
npm run dev
```

Run Sanity Studio:

```bash
npm run studio
```

Build both surfaces:

```bash
npm run build
npm run studio:build
```

## Environment Variables

```bash
VITE_SANITY_PROJECT_ID=your-project-id
VITE_SANITY_DATASET=production
VITE_SANITY_API_VERSION=2026-07-08
VITE_SITE_URL=https://your-domain.com

SANITY_STUDIO_PROJECT_ID=your-project-id
SANITY_STUDIO_DATASET=production
```

## CMS Setup

1. Create a Sanity project.
2. Add the project ID and dataset to `.env.local`.
3. Run `npm run studio`.
4. Import the seed content if useful:

```bash
npx sanity dataset import sanity/seed/portfolio.ndjson production
```

5. Edit `Site Settings`, `Homepage`, `Projects`, `Skills`, `Posts`, `Authors`, and `Social Links` in Studio.

## Content Notes

The fallback data in `src/lib/fallbackData.ts` is sourced from public GitHub profile/repo metadata and README content for projects including RoadRunners, Lumina, CodeProbe, Model Shelf, Qwen3.5 Distill, Iris Auth Lite, Cryptix, and VoxScribe.

Project pages are intentionally structured to answer:

- What problem did this solve?
- What was Nachiketh's role?
- What did he personally build?
- What constraints shaped the result?
- What technologies were used?
- What proof, impact, or demo exists?
- What did he learn?
- What would improve next?
