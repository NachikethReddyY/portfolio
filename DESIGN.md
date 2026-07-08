# Design

## Metadata

- Name: Nachiketh Reddy Portfolio
- Register: brand
- Scene: a Singapore Polytechnic student presents his work like a dark creator-learning site: cinematic tech illustration, oversized block display type, Courier-style body copy, terminal evidence, repo proof, and dotted retro texture.
- Color strategy: NetworkChuck-inspired dark purple creator palette with pale lavender type, warm coffee-gold emphasis, muted lavender panels, and teal/green only as small technical signals.

## Foundations

### Color

Use OKLCH tokens only. The deep purple surface carries focus; terminal readouts stay blacker than the page; pale lavender structure gives the editorial edge; warm gold carries action, links, and learning emphasis.

```css
:root {
  --color-bg: oklch(0.145 0.022 286);
  --color-surface: oklch(0.185 0.026 286);
  --color-surface-strong: oklch(0.245 0.034 286);
  --color-terminal: oklch(0.075 0.018 286);
  --color-terminal-soft: oklch(0.12 0.022 286);
  --color-ink: oklch(0.89 0.026 292);
  --color-muted: oklch(0.72 0.03 292);
  --color-soft: oklch(0.58 0.035 292);
  --color-primary: oklch(0.76 0.145 78);
  --color-primary-strong: oklch(0.84 0.16 78);
  --color-accent: oklch(0.82 0.075 305);
  --color-violet: oklch(0.68 0.14 306);
  --color-border: oklch(0.78 0.035 292);
  --color-danger: oklch(0.67 0.2 28);
  --color-warning: oklch(0.78 0.16 78);
  --color-success: oklch(0.68 0.14 170);
}
```

### Typography

- Display: Russo One
- Body: Courier Prime
- Technical labels: JetBrains Mono, used for metadata, code-like fragments, and terminal readouts
- Body reading size starts at 17px.
- Headings use balanced wrapping and zero letter spacing.

### Layout

- Mobile-first single column, expanding into asymmetric two-column feature sections on desktop.
- Section spacing uses fluid clamp values, with tighter groupings inside content modules.
- Cards are geometric light-bordered dark panels with small hard neon shadows only when they represent destination content.
- Background texture uses faint code snippets and schematic linework, not decorative grids or blurred orbs.
- Primary content max width: 1180px. Prose max width: 72ch.

### Motion

- Motion should make the site feel responsive and premium, not theatrical.
- Use subtle page-load reveals, hover lift for destination cards, and press feedback on buttons.
- Respect `prefers-reduced-motion` with instant or opacity-only transitions.

## Components

- Navbar: sticky transparent creator-site bar with outlined active states, small circular mark, and warm gold underline shadow.
- CTA Button: gold primary button, thick outlined secondary button, nested icon target.
- Project Card: strong luminous title, role, proof/impact line, status, neon tech badges, terminal readout and graph wireframe preview, links.
- About Hero: large stacked block heading, gold highlighted story copy, dotted texture, icon links, and generated editorial tech illustration.
- Blog Card: publication-style article preview with date, reading time, tags, and image support.
- Skill Badge: compact light-bordered dark chip with saturated category swatch and proficiency metadata.
- Rich Text Renderer: accessible Sanity Portable Text with headings, callouts, links, code, and images.
- SEO Component: route-level title, description, canonical URL, and social tags.

## Content System

Sanity owns site settings, education/current focus/GitHub stats, homepage content, projects, posts, authors, categories/tags, skills/technologies, and social links. Project documents include role, period, impact, what Nachiketh personally built, constraints/tradeoffs, lessons, and future improvements. The React app includes fallback seed content only so the project is inspectable before a Sanity project is connected.
