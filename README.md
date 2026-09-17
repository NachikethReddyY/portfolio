# Nachiketh Reddy — motion portfolio

This is a React, TypeScript, and Vite portfolio for Nachiketh Reddy. The home
page combines GSAP motion with a Three.js laptop scene that loads the original
model at `/models/laptop.glb` and keeps an image fallback for server rendering
or unavailable WebGL. Projects, writing, profile information, and experience
start from local editorial content and can be replaced or extended by published
Sanity content.

The repository uses `pnpm` (12.4.2 in `package.json`) and Node.js 22.18 or
newer.

## Run and verify

```sh
pnpm install
pnpm dev
pnpm test
pnpm typecheck
pnpm build
pnpm preview
pnpm studio
pnpm studio:build
```

`pnpm dev` starts Vite at `127.0.0.1` and also wires the read-only content
endpoints through the Vite middleware. `pnpm build` runs the type checks, builds
the browser bundle, builds the SSR entry into `.evidence/build-ssr`, and
prerenders the public routes into `dist/`, and checks their headings, metadata, images, and internal links. `pnpm preview` serves that build.
`pnpm studio` starts Sanity's CLI development server, while `pnpm studio:build`
builds the Studio bundle. For the embedded `/studio` route, run `pnpm dev` and
open that route in the app.

The focused content and server checks are in `tests/`; the full suite runs with
`pnpm test`. The test suite does not log in to Sanity or write hosted content.

## Routes and source map

The route table is in `src/main.tsx`:

| Route             | Purpose                                                                 |
| ----------------- | ----------------------------------------------------------------------- |
| `/`               | Home, profile, selected work, writing, experience, and contact sections |
| `/projects`       | Project index with category filters                                     |
| `/projects/:slug` | Case-study detail page                                                  |
| `/writing`        | Searchable writing index                                                |
| `/writing/:slug`  | Article detail page                                                     |
| `/blog`           | Redirect to `/writing`                                                  |
| `/blog/:slug`     | Legacy article route handled by the article detail view                 |
| `/about`          | Redirect to the home page's `#about` anchor                             |
| `/contact`        | Redirect to the home page's `#contact` anchor                           |
| `/studio/*`       | Lazy-loaded Sanity Studio                                               |

Unknown routes and unknown content slugs render the not-found view.

The main files are:

- `src/main.tsx` — browser router, route composition, and Studio lazy boundary.
- `src/pages/Home.tsx`, `src/pages/Projects.tsx`, and `src/pages/Writing.tsx` — public page views.
- `src/components/Layout.tsx`, `src/components/PageTransition.tsx`, `src/components/LaptopScene.tsx`, and `src/components/RichContent.tsx` — shared layout, transitions, visual scene, and current Portable Text rendering.
- `src/site.css` — the portfolio's responsive layout, typography, color, and motion styles.
- `src/content/seed.json` and `src/content/types.ts` — local content and application types.
- `src/content/validation.ts` — Zod validation for profile, case studies, articles, experience, links, slugs, images, and Portable Text blocks.
- `src/content/query.ts` and `src/content/merge.ts` — published Sanity query and the legacy/new content merge.
- `src/content/store.tsx` — browser content loading with the local fallback.
- `src/cms/schema.ts` and `src/cms/StudioPage.tsx` — current document schemas and the embedded Studio route.
- `sanity/schemaTypes/` — existing legacy Sanity document and object schemas registered alongside the current schemas.
- `server/content.ts`, `server/http.ts`, and `server/publishing.ts` — server-side loading, read-only handlers, RSS, sitemap, and canonical URL handling.
- `api/content.ts`, `api/health.ts`, `api/rss.ts`, and `api/sitemap.ts` — Vercel function entry points.
- `scripts/prerender.mjs`, `scripts/export-content.mjs`, and `scripts/build-laptop.py` — prerendering, local draft export, and original model generation.

`DESIGN.md` records the current visual and interaction decisions.

## Sanity content and Studio login

The public app does not require a Sanity login. It starts with
`src/content/seed.json`, then the browser client in `src/content/store.tsx`
requests published Sanity data using the CDN and `perspective: "published"`.
If Sanity is disabled, unavailable, invalid, or returns content that fails the
schemas, the local content remains visible. There is no browser-side write
token.

The Studio at `/studio` does require the editor to sign in to Sanity in the
browser. It uses the signed-in editor session for Studio operations. The
embedded Studio registers both the current schemas from `src/cms/schema.ts`
and the existing schemas from `sanity/schemaTypes/`; `sanity.config.ts` and
`sanity.cli.ts` configure the same project and dataset for the Sanity CLI.

The current document types are `profile`, `caseStudy`, `article`, and
`experience`. Profile fields include the bio, personal interests, social links, stack descriptions, and contribution cards. Case studies and articles accept uploaded cover images or image URLs. The Studio separates current content from preserved legacy documents.

The legacy document types include `project` and `post`, along
with the other registered legacy Studio types. Current Portable Text supports
text blocks, links, `contentImage`, and `codeBlock`; legacy rich content keeps
its existing renderer and object types.

`src/content/query.ts` reads both generations:

- Current `profile`, `caseStudy`, `article`, and `experience` documents are queried with drafts excluded.
- Articles are limited to `publishedAt <= now()` so scheduled posts are not shown in the portfolio before that time.
- Legacy `project` and `post` documents are projected through `src/legacy/queries.ts` and converted by `src/content/merge.ts`.
- New-schema published projects and articles override matching legacy and seed entries by slug. A valid remote profile replaces the seeded profile, and a valid remote experience list replaces the seeded list. A legacy entry with a newer `_updatedAt` than the local snapshot can update that snapshot while preserving its editorial featured state.
- Every remote result is validated before it enters the app. Invalid records are dropped and missing profile or experience data falls back to the local seed.

The server loader follows the same published-only and fallback behavior for
`/api/*`, while caching the loaded result briefly in the function process.

Set local environment values from `.env.example` as needed:

| Variable                   | Use                                                      |
| -------------------------- | -------------------------------------------------------- |
| `VITE_SITE_URL`            | Canonical URL, prerender metadata, RSS, and sitemap base |
| `VITE_SANITY_ENABLED`      | Set to `false` to keep the browser on local content      |
| `VITE_SANITY_PROJECT_ID`   | Browser client and embedded Studio project               |
| `VITE_SANITY_DATASET`      | Browser client and embedded Studio dataset               |
| `VITE_SANITY_API_VERSION`  | Browser Sanity client API version                        |
| `SANITY_STUDIO_PROJECT_ID` | Sanity CLI project override                              |
| `SANITY_STUDIO_DATASET`    | Sanity CLI dataset override                              |

The server uses the corresponding `SANITY_STUDIO_*` values first, then the
`VITE_SANITY_*` values, with the public project and `production` dataset as
defaults. These settings do not grant write access to the public API.

## Read-only content endpoints

The API handlers accept `GET` and `HEAD`; other methods receive `405 Method Not
Allowed`. There is no content mutation endpoint in this application.

| Endpoint       | Response                                                                   |
| -------------- | -------------------------------------------------------------------------- |
| `/api/content` | Merged profile, projects, articles, and experience as JSON                 |
| `/api/health`  | JSON status plus whether the current content source is `sanity` or `local` |
| `/api/rss`     | RSS feed for published articles                                            |
| `/api/sitemap` | XML sitemap for public pages, projects, and articles                       |
| `/rss.xml`     | Vercel/Vite rewrite to `/api/rss`                                          |
| `/sitemap.xml` | Vercel/Vite rewrite to `/api/sitemap`                                      |

RSS and sitemap values are escaped and use the configured `VITE_SITE_URL` when
it is an HTTP(S) URL; otherwise they use the documented default origin.

## Export drafts without changing hosted Sanity

`pnpm content:export` validates `src/content/seed.json` and writes local
Sanity-shaped draft documents to the ignored
`artifacts/content/portfolio-drafts.ndjson`. It exports the profile, case
studies, body-bearing articles, and experience records with `drafts.*` IDs,
schema fields, and unique `_key` values for object arrays, including nested
Portable Text arrays.

The exporter is file-only. It does not create a Sanity client, require a
token, log in, or mutate a hosted dataset. To write to another local path:

```sh
CONTENT_EXPORT_OUTPUT=/tmp/portfolio-drafts.ndjson pnpm content:export
node --test tests/export-content.test.mjs
```

An import into hosted Sanity is a separate, explicit operation and is not part
of `pnpm content:export`.

## Vercel configuration

`vercel.json` describes the intended deployment shape:

- framework: `vite`
- install: `corepack pnpm install --frozen-lockfile`
- build: `pnpm build`
- output: `dist/`
- `/rss.xml` and `/sitemap.xml` rewrites to their API functions
- SPA fallback for browser routes while leaving `/api` paths available to functions
- `nosniff` and `strict-origin-when-cross-origin` headers, plus immutable caching for `/assets/*`

The repository contains deployment configuration; that configuration is not
evidence that a deployment has happened. A Vercel project must be connected
and configured separately. A host that serves only `dist/` can serve the
prerendered frontend, but it must provide equivalent server functions if the
read-only API, RSS, sitemap, and live Sanity fallback behavior are required.

## Regenerate the original Blender laptop

`scripts/build-laptop.py` procedurally builds the original graphite hinged
laptop, checks that the hinge bridges overlap the chassis and screen, exports a
Y-up GLB, renders a preview, and saves a Blender source file. With Blender on
your `PATH`:

```sh
blender --background --python scripts/build-laptop.py
```

The full run writes:

- `public/models/laptop.glb` — model loaded by `src/components/LaptopScene.tsx`.
- `.evidence/narrative-build/laptop.blend` — local editable Blender scene.
- `.evidence/narrative-build/render.png` — local verification render.

The optional fallback-only run writes
`public/models/laptop-fallback.webp` as a transparent render.

To rerender the transparent fallback from the saved scene:

```sh
blender --background .evidence/narrative-build/laptop.blend \
  --python scripts/build-laptop.py -- --fallback-only
```

The current SSR and WebGL-error path in `Home.tsx` uses the checked-in
`public/models/laptop-fallback.webp` image fallback. Keep that path available,
or intentionally update the component and asset together when changing the
fallback workflow.

The generated portrait is an ink-and-graphite illustration based on the user’s public LinkedIn portrait, used with permission. Its web asset is `public/images/nachiketh-sketch.webp`. The prompt asked for an identity-preserving editorial sketch with dark jacket, red tie, and warm paper; it was generated with the built-in image tool in edit mode.

Generated evidence under `.evidence/` and local concepts under `artifacts/`
are ignored by git. No deployment or hosted Sanity mutation is performed by
the commands documented here.
