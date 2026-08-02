import { createReadStream } from 'node:fs';
import { basename } from 'node:path';

import { getCliClient } from 'sanity/cli';

const client = getCliClient({ apiVersion: '2026-07-08' });
const ref = (_ref: string, _key: string) => ({ _key, _type: 'reference', _ref });
const list = (items: string[]) => items;

const skills = [
  {
    _id: 'skill-swift',
    _type: 'skill',
    title: 'Swift / SwiftUI',
    slug: { _type: 'slug', current: 'swift-swiftui' },
    category: 'mobile',
    proficiency: 'learning',
    summary: 'Native Apple-platform apps built with Swift, SwiftUI, and system frameworks.',
  },
  {
    _id: 'skill-vscode-extensions',
    _type: 'skill',
    title: 'VS Code Extensions',
    slug: { _type: 'slug', current: 'vscode-extensions' },
    category: 'frontend',
    proficiency: 'learning',
    summary: 'Editor themes and extensions packaged for Visual Studio Code.',
  },
  {
    _id: 'skill-coreml-vision',
    _type: 'skill',
    title: 'Core ML / Vision',
    slug: { _type: 'slug', current: 'coreml-vision' },
    category: 'ai',
    proficiency: 'learning',
    summary: 'On-device Apple machine learning with Core ML and Vision.',
  },
  {
    _id: 'skill-mongodb',
    _type: 'skill',
    title: 'MongoDB',
    slug: { _type: 'slug', current: 'mongodb' },
    category: 'database',
    proficiency: 'learning',
    summary: 'Document storage for full-stack applications and self-hosted tools.',
  },
];

const project = ({
  id,
  title,
  slug,
  summary,
  status,
  projectType,
  role,
  period,
  sortDate,
  impact,
  technologies,
  problem,
  solution,
  whatIBuilt,
  constraints,
  features,
  githubUrl,
  demoUrl,
  lessonsLearned,
  futureImprovements,
}: {
  id: string;
  title: string;
  slug: string;
  summary: string;
  status: 'building' | 'shipped' | 'archived' | 'experiment';
  projectType: 'ai-tooling' | 'full-stack' | 'cybersecurity' | 'mobile-hardware' | 'cli-systems' | 'coursework' | 'experiment';
  role: string;
  period: string;
  sortDate: string;
  impact: string;
  technologies: string[];
  problem: string;
  solution: string;
  whatIBuilt: string[];
  constraints: string[];
  features: string[];
  githubUrl?: string;
  demoUrl?: string;
  lessonsLearned: string[];
  futureImprovements: string[];
}) => ({
  _id: `project-${id}`,
  _type: 'project',
  title,
  slug: { _type: 'slug', current: slug },
  summary,
  status,
  projectType,
  role,
  period,
  sortDate,
  impact,
  featured: false,
  technologies: technologies.map((skill, index) => ref(skill, `technology-${index}`)),
  problem,
  solution,
  whatIBuilt: list(whatIBuilt),
  constraints: list(constraints),
  features: list(features),
  githubUrl,
  demoUrl,
  lessonsLearned: list(lessonsLearned),
  futureImprovements: list(futureImprovements),
});

const projects = [
  project({
    id: 'vsms',
    title: 'Visual Screening Management System',
    slug: 'vsms',
    summary: 'An ongoing tablet-first web application for managing participant registration, queues, screening stations, reviews, and event progress during community vision-screening events.',
    status: 'building',
    projectType: 'full-stack',
    role: 'Requirements, workflow documentation, design system, and full-stack planning',
    period: 'Jul 2026 – Present',
    sortDate: '2026-08-02',
    impact: 'I mapped the five staff roles, wrote the user stories, and used them to shape the tablet navigation.',
    technologies: ['skill-typescript', 'skill-react-next', 'skill-node-express', 'skill-postgres-supabase'],
    problem: 'Vision-screening events involve registration, consent, queues, multiple screening stations, reviewer decisions, referrals, and live event monitoring. When those steps are spread across documents and conversations, staff workflows and implementation decisions become ambiguous.',
    solution: 'The team is translating the source requirements into role-specific workflows and a responsive tablet-first system. The product direction prioritises large readable controls, calm clinical styling, clear queue state, and visible offline or synchronisation status.',
    whatIBuilt: [
      'Reviewed source requirements and consolidated them into user stories, workflows, open questions, and shared HTML documentation.',
      'Mapped the needs and navigation of administrators, registration staff, queue staff, screening-station staff, and reviewers.',
      'Developed and critiqued design-system directions, dashboard layouts, and prototypes with attention to accessibility and tablet use.',
      'Explored role-based access, backend architecture, PostgreSQL data modelling, and offline or synchronisation behaviour with the team.',
    ],
    constraints: [
      'The work is an active school client project, so sensitive requirements and participant information must remain private.',
      'Staff may be moving between stations, so readability, touch targets, and status clarity matter more than decorative UI.',
      'Some client decisions are still unresolved; the case study distinguishes confirmed requirements from ongoing exploration.',
    ],
    features: [
      'Participant registration and consent-related steps',
      'Queue and screening-station workflows',
      'Reviewer and referral decisions',
      'Role-based access and navigation',
      'Event progress and dashboard monitoring',
      'Offline and synchronisation status planning',
    ],
    lessonsLearned: [
      'Implementation moves faster when roles, exceptions, and unanswered client questions are documented first.',
      'A useful dashboard is organised around staff decisions, not a collection of decorative metrics.',
      'Designing for an active event means prioritising touch targets, contrast, and quick scanning.',
    ],
    futureImprovements: [
      'Validate remaining workflow decisions with the client.',
      'Test the interface with representative tablet sizes and realistic sample data.',
      'Document the final architecture and synchronisation strategy after implementation choices are confirmed.',
    ],
  }),
  project({
    id: 'reddone',
    title: 'ReDDone',
    slug: 'reddone',
    summary: 'An approval-gated control plane that turns market evidence into a verified Next.js application, private GitHub repository, and prebuilt Vercel deployment.',
    status: 'shipped',
    projectType: 'ai-tooling',
    role: 'Full-stack builder across the control plane, provider integrations, verification, and release workflow',
    period: 'Jul 2026',
    sortDate: '2026-07-18',
    impact: 'Shipped a safe demo mode plus fail-closed private and hackathon modes for evidence-backed product generation and deployment.',
    technologies: ['skill-typescript', 'skill-react-next', 'skill-postgres-supabase', 'skill-security'],
    problem: 'Agent-built applications need evidence, isolation, approval gates, and a verifiable release path before generated code can be trusted with real provider accounts.',
    solution: 'ReDDone separates research, specification, building, verification, approval, and deployment while keeping provider credentials server-side and generated code inside isolated sandboxes.',
    whatIBuilt: [
      'A Next.js control plane for projects, findings, specifications, builds, approvals, releases, and deployments.',
      'GitHub, Vercel, model-provider, storage, and sandbox integration boundaries with redacted readiness states.',
      'Demo, private, and hackathon operating modes with explicit fail-closed activation requirements.',
    ],
    constraints: [
      'Generated code and previews cannot be trusted until their source and release artifacts are verified.',
      'External provider credentials must stay server-side and remain write-only from the browser.',
    ],
    features: ['Evidence-backed research', 'Approval-gated specifications and releases', 'Isolated builder and verifier sandboxes', 'Private GitHub and Vercel deployment workflow'],
    githubUrl: 'https://github.com/NachikethReddyY/reddone',
    demoUrl: 'https://reddone.vercel.app',
    lessonsLearned: ['Agentic product generation needs explicit human gates, not just a better prompt.', 'Demo mode is most useful when it exercises the real contracts without pretending mocks are live.'],
    futureImprovements: ['Expand provider adapters only after the current security boundaries are proven in production.', 'Add more evidence sources behind the same authorization and audit model.'],
  }),
  project({
    id: 'promptforge',
    title: 'PromptForge',
    slug: 'promptforge',
    summary: 'A prompt workshop that turns rough ideas into model-specific, agent-ready prompts with task templates, target-model presets, local history, and server-side generation.',
    status: 'shipped',
    projectType: 'ai-tooling',
    role: 'Built the React interface, Express generation API, prompt templates, validation, and provider configuration',
    period: 'Jul 2026',
    sortDate: '2026-07-09',
    impact: 'Delivered a working MVP that improves prompts without exposing the OpenAI API key to frontend code.',
    technologies: ['skill-typescript', 'skill-react-next', 'skill-node-express'],
    problem: 'A rough prompt often lacks the structure, constraints, and model-specific guidance an agent needs to produce reliable work.',
    solution: 'PromptForge combines task templates, target-model presets, optional context, and a server-side optimizer into one focused prompt-building flow.',
    whatIBuilt: ['Vite React TypeScript prompt builder and local preset/history storage.', 'Express endpoint using the OpenAI Responses API with Zod request validation.', 'Templates for planning, implementation, debugging, refactoring, documentation, and system prompts.'],
    constraints: ['API keys must never reach browser code.', 'The selected target model is separate from the model that rewrites the prompt.'],
    features: ['Model-specific prompt presets', 'Agent plan mode', 'Task templates', 'Local prompt history', 'Server-side generation'],
    githubUrl: 'https://github.com/NachikethReddyY/promptforge',
    lessonsLearned: ['Prompt quality improves when intent, constraints, and expected artifacts are made explicit.', 'Provider configuration is easier to reason about when generation and target models are separate concepts.'],
    futureImprovements: ['Implement the configured local-provider adapters.', 'Add export formats for common coding-agent workflows.'],
  }),
  project({
    id: 'memworker',
    title: 'MemWorker',
    slug: 'memworker',
    summary: 'A privacy-first mobile assistant for social workers with recording, client memory, CANS workflows, after-hours queues, and an offline-first product direction.',
    status: 'shipped',
    projectType: 'mobile-hardware',
    role: 'Mobile product builder across the Expo app, client workflows, service architecture, and deployment setup',
    period: 'Jun–Aug 2026',
    sortDate: '2026-06-11',
    impact: 'Built the cross-platform application foundation and working client, recording, transcript, queue, and CANS screens for a social-work use case.',
    technologies: ['skill-typescript', 'skill-mobile', 'skill-postgres-supabase', 'skill-node-express'],
    problem: 'Social workers need fast capture and durable client context, but sensitive case data cannot casually flow through consumer cloud tools.',
    solution: 'MemWorker combines an Expo mobile interface with recording, transcripts, structured client memory, queues, and a privacy-first path toward on-device transcription and local AI.',
    whatIBuilt: ['Expo Router application with client, chat, recording, transcript, queue, CANS, and after-hours flows.', 'Express API and worker services with PostgreSQL, Redis, and Railway/Kubernetes deployment configuration.', 'Accessible mobile design system with privacy cues and a friendly Foxy mascot.'],
    constraints: ['Client data requires explicit privacy and transmission boundaries.', 'On-device speech and model features must fit mobile storage, battery, and memory limits.'],
    features: ['One-tap recording', 'Client memory and CANS views', 'After-hours queues', 'Transcript and chat flows', 'Cross-platform Expo app'],
    githubUrl: 'https://github.com/NachikethReddyY/MemWorker',
    lessonsLearned: ['Privacy has to shape the architecture before AI features are added.', 'Sensitive workflows need clear offline, sync, and audit states in the interface.'],
    futureImprovements: ['Finish on-device transcription and encrypted local memory.', 'Validate the workflow with social workers before expanding automation.'],
  }),
  project({
    id: 'tab',
    title: 'Tab',
    slug: 'tab',
    summary: 'A native macOS application switcher with global hotkeys, fuzzy search, Liquid Glass cards, keyboard navigation, and screen-aware window placement.',
    status: 'experiment',
    projectType: 'cli-systems',
    role: 'Built the SwiftUI app, window manager, hotkey controller, fuzzy search, settings, and switcher interface',
    period: 'Jun 2026',
    sortDate: '2026-06-15',
    impact: 'Packaged a working native macOS switcher as a downloadable DMG.',
    technologies: ['skill-swift', 'skill-cli-systems'],
    problem: 'The default app-switching flow becomes slow when many windows are open and the desired app is easier to name than to find visually.',
    solution: 'Tab opens a compact keyboard-first overlay, filters running apps with fuzzy search, and activates the selected window without leaving the current workflow.',
    whatIBuilt: ['SwiftUI Liquid Glass switcher panel with complete-row sizing and overflow affordances.', 'Global hotkey handling, window discovery, app activation, and keyboard navigation.', 'Configurable settings and fuzzy search across running applications.'],
    constraints: ['A switcher must feel instant and stay out of the way.', 'The panel has to adapt to different screen sizes without clipping partial rows.'],
    features: ['Global hotkeys', 'Fuzzy app search', 'Keyboard navigation', 'Liquid Glass interface', 'Screen-aware layout'],
    githubUrl: 'https://github.com/NachikethReddyY/tab',
    lessonsLearned: ['Tiny desktop utilities depend more on interaction latency than feature count.', 'Native window management requires careful focus and multi-screen behavior.'],
    futureImprovements: ['Add signed and notarized releases.', 'Collect usage feedback before adding more switching modes.'],
  }),
  project({
    id: 'midnight-code',
    title: 'Midnight Code',
    slug: 'midnight-code',
    summary: 'A true-void VS Code theme that removes visual chrome and keeps attention on code with a black, white, and electric-blue palette.',
    status: 'shipped',
    projectType: 'experiment',
    role: 'Designed and packaged the color system as a VS Code theme',
    period: 'Jun 2026',
    sortDate: '2026-06-09',
    impact: 'Published a complete installable theme configuration for VS Code.',
    technologies: ['skill-vscode-extensions'],
    problem: 'Editor themes often add too many competing colors and make the surrounding interface louder than the code.',
    solution: 'Midnight Code uses a near-black canvas, restrained white text, and blue accents so state remains legible without constant visual noise.',
    whatIBuilt: ['A complete VS Code workbench and syntax-color configuration.', 'Extension metadata for installing the theme as Super Black & Blue.', 'A deliberately narrow palette for high contrast and low distraction.'],
    constraints: ['The palette has to preserve semantic differences without becoming colorful.', 'High contrast still needs readable comments, selections, errors, and inactive UI.'],
    features: ['True-black editor chrome', 'High-contrast syntax colors', 'Electric-blue accents', 'VS Code theme packaging'],
    githubUrl: 'https://github.com/NachikethReddyY/midnight-code',
    lessonsLearned: ['A restrained theme is mostly a hierarchy problem, not a color-count problem.', 'Editor chrome can disappear without hiding important state.'],
    futureImprovements: ['Test more languages and extension surfaces.', 'Publish to the VS Code Marketplace if the theme gets broader use.'],
  }),
  project({
    id: 'keel',
    title: 'Keel',
    slug: 'keel',
    summary: 'A local-first Go task tracker with a Bubble Tea TUI and a canonical Markdown ledger that people, shell tools, and AI agents can edit together.',
    status: 'shipped',
    projectType: 'cli-systems',
    role: 'Built the Go CLI, Markdown parser, safe storage layer, terminal interface, timers, recurrence, and agent workflow',
    period: 'May–Jun 2026',
    sortDate: '2026-05-31',
    impact: 'Shipped a usable terminal task manager that keeps its source of truth in one portable Markdown file.',
    technologies: ['skill-go-agent-systems', 'skill-cli-systems'],
    problem: 'Terminal-heavy workflows split tasks across apps that local agents cannot inspect or safely update.',
    solution: 'Keel stores tasks, metadata, notes, subtasks, timers, and recurrence in a human-readable ledger while providing both CLI commands and a focused terminal UI.',
    whatIBuilt: ['Markdown task grammar and parser with preservation of unknown metadata.', 'Bubble Tea workbench for filtering, searching, editing, timing, and completing tasks.', 'Crash-safe writes with temp files, fsync, rename, conflict detection, and repair backups.'],
    constraints: ['The Markdown file must remain the canonical source of truth.', 'Concurrent human or agent edits cannot be silently overwritten.'],
    features: ['Bubble Tea TUI', 'Markdown ledger', 'Recurring tasks and subtasks', 'Task timers', 'OpenCode agent flow', 'Safe atomic writes'],
    githubUrl: 'https://github.com/NachikethReddyY/keel',
    lessonsLearned: ['A plain-text format becomes an API when multiple tools depend on it.', 'Local-first tools still need concurrency and data-loss protection.'],
    futureImprovements: ['Add importers only when another task source is actually needed.', 'Expand agent workflows without weakening the ledger conflict checks.'],
  }),
  project({
    id: 'clipper',
    title: 'Clipper',
    slug: 'clipper',
    summary: 'A local-first research clipper that saves pages and highlights from a Chrome extension into a self-hosted Next.js library backed by MongoDB.',
    status: 'building',
    projectType: 'full-stack',
    role: 'Built the browser extension, web library, API integration, and self-hosted Docker workflow',
    period: 'May 2026',
    sortDate: '2026-05-13',
    impact: 'Delivered a working page-and-highlight capture flow with a self-hosted library and unpacked Chrome extension.',
    technologies: ['skill-typescript', 'skill-react-next', 'skill-mongodb'],
    problem: 'Research links and useful passages disappear into browser history or closed tabs before they can become durable notes.',
    solution: 'Clipper captures the current page or selected text from a Manifest V3 extension and sends it to a self-hosted searchable web library.',
    whatIBuilt: ['Manifest V3 background, content, popup, anchor, and API modules.', 'Next.js web application and API routes for the clip library.', 'Docker Compose setup for the web service and MongoDB.'],
    constraints: ['The extension has to work with browser permission and content-script boundaries.', 'The project stays self-hosted so the clipped research remains under the user’s control.'],
    features: ['Clip full pages', 'Save selected highlights', 'Keyboard shortcuts', 'Self-hosted web library', 'Docker deployment'],
    githubUrl: 'https://github.com/NachikethReddyY/clipper',
    lessonsLearned: ['Browser extensions are distributed systems in miniature.', 'Local-first research tools need a reliable capture path more than a complicated editor.'],
    futureImprovements: ['Finish the rebrand and improve search.', 'Add export once real usage reveals the required formats.'],
  }),
  project({
    id: 'imposter-game',
    title: 'Imposter Game',
    slug: 'imposter-game',
    summary: 'A one-page pass-and-play party game that secretly assigns one imposter while every other player receives the same discussion topic.',
    status: 'shipped',
    projectType: 'experiment',
    role: 'Designed and built the complete browser game in one HTML file',
    period: 'Mar 2026',
    sortDate: '2026-03-15',
    impact: 'Shipped a zero-install multiplayer game that runs directly in a browser.',
    technologies: ['skill-html-css', 'skill-javascript'],
    problem: 'A quick in-person party game should not require accounts, downloads, or one phone per player.',
    solution: 'One device guides players through private role reveals, discussion, voting, and the final imposter reveal.',
    whatIBuilt: ['Player-count setup and random topic/imposter assignment.', 'Pass-the-device privacy screens for each role reveal.', 'Discussion timer, voting flow, final reveal, and replay state.'],
    constraints: ['Each role must stay hidden while a single device moves between players.', 'The entire game intentionally fits in one dependency-free HTML file.'],
    features: ['Three-or-more player setup', 'Random topic and imposter assignment', 'Private role reveals', 'Pass-and-play flow', 'Final imposter reveal'],
    githubUrl: 'https://github.com/NachikethReddyY/Imposter-game',
    lessonsLearned: ['A small game succeeds when the turn-by-turn instructions are unambiguous.', 'One-file prototypes are useful when the interaction matters more than architecture.'],
    futureImprovements: ['Add custom topic packs.', 'Persist nothing unless players ask for history or profiles.'],
  }),
  project({
    id: 'coreml-workshop',
    title: 'CoreML Workshop',
    slug: 'coreml-workshop',
    summary: 'An iPhone fruit-classification workshop app that runs a Core ML model on a selected photo and displays the top label with confidence.',
    status: 'shipped',
    projectType: 'mobile-hardware',
    role: 'Created the workshop and built the SwiftUI image-classification app',
    period: 'Oct 2025',
    sortDate: '2025-10-26',
    impact: 'Delivered an on-device image-classification demo for the ADS x SPAI workshop.',
    technologies: ['skill-swift', 'skill-coreml-vision'],
    problem: 'Core ML is easier to understand when learners can run a real model on a phone instead of only reading about inference code.',
    solution: 'The SwiftUI app lets a user choose a photo, runs a Vision/Core ML classification request, and shows the fruit label and confidence on-device.',
    whatIBuilt: ['SwiftUI image picker and classification interface.', 'Vision request wrapping a Core ML fruit-classification model.', 'Result, confidence, loading, simulator, and error states.'],
    constraints: ['The model must run entirely on the device.', 'Simulator and physical-device compute paths need different Core ML configuration.'],
    features: ['Photo-library picker', 'On-device Core ML inference', 'Fruit classification label', 'Confidence score', 'SwiftUI workshop interface'],
    githubUrl: 'https://github.com/NachikethReddyY/CoreML-Workshop',
    lessonsLearned: ['A visible end-to-end demo makes machine-learning concepts easier to teach.', 'Vision handles much of the image pipeline when the model contract is clear.'],
    futureImprovements: ['Bundle more sample images for workshops.', 'Add a short explanation of confidence and model limitations in the app.'],
  }),
  project({
    id: 'kingdom-clash',
    title: 'Kingdom Clash',
    slug: 'kingdom-clash',
    summary: 'A full-stack wellness game where real-life challenges earn points and PowerChips used to unlock heroes, fight bosses, and grow a virtual kingdom.',
    status: 'shipped',
    projectType: 'coursework',
    role: 'Full-stack developer across the static frontend, Express API, authentication, and MySQL data model',
    period: 'Jan–Feb 2026',
    sortDate: '2026-02-01',
    impact: 'Delivered a backend-development project with role-based access, wellness tracking, hero progression, raids, and leaderboards.',
    technologies: ['skill-javascript', 'skill-html-css', 'skill-node-express', 'skill-security'],
    problem: 'Wellness habits are difficult to sustain when progress feels abstract and rewards are disconnected from everyday actions.',
    solution: 'Kingdom Clash turns wellness challenges into a game economy where activity rewards fund hero recruitment, boss raids, duels, and kingdom growth.',
    whatIBuilt: ['Static HTML, CSS, and JavaScript screens for participants and admins.', 'Express REST API with JWT authentication, bcrypt hashing, and role-based access.', 'MySQL game economy covering challenges, heroes, battles, rewards, and leaderboards.'],
    constraints: ['The project had to satisfy backend coursework while remaining demoable as a complete game.', 'Multi-table game state must preserve points, ownership, rewards, and combat rules.'],
    features: ['JWT authentication', 'Role-based access', 'Wellness challenges', 'Hero recruitment and battles', 'Points and PowerChips leaderboards'],
    githubUrl: 'https://github.com/ST0503-BED/bed-ca2-NachikethReddyY',
    lessonsLearned: ['Authentication affects the whole product flow, not only the login endpoint.', 'Game rules are easier to maintain when state changes are enforced in the backend.'],
    futureImprovements: ['Wrap multi-table rewards and duels in database transactions.', 'Add automated authentication, permissions, and game-economy checks.'],
  }),
];

const covers = [
  {
    id: 'project-vsms',
    path: '/Users/nr/Sites/portfolio/public/assets/vsms/vsms-cover.jpeg',
    alt: 'VSMS public landing page showing a community vision-screening workspace.',
  },
  {
    id: 'project-codeprobe',
    path: '/Users/nr/Sites/portfolio/public/assets/codeprobe/codeprobe-cover.jpeg',
    alt: 'CodeProbe terminal scan reporting dependency vulnerabilities, exploit verification, patches, and a risk score.',
  },
  {
    id: 'project-lumina',
    path: '/Users/nr/Sites/portfolio/public/assets/lumina/lumina-cover.jpeg',
    alt: 'Lumina landing page showing its AI-assisted support-ticket routing workflow.',
  },
  {
    id: 'project-cryptix',
    path: '/Users/nr/Sites/portfolio/public/assets/cryptix/cryptix-cover.png',
    alt: 'Cryptix game-store interface used for the secure coding analysis.',
  },
  {
    id: 'project-kingdom-clash',
    path: '/Users/nr/Sites/portfolio/public/assets/kingdom-clash/kingdom-clash-cover.jpeg',
    alt: 'Kingdom Clash landing page with the game logo and sign-up actions over a fantasy landscape.',
  },
];

async function uploadCover(path: string, label: string) {
  const filename = basename(path);
  const existing = await client.fetch<{ _id: string } | null>(
    '*[_type == "sanity.imageAsset" && originalFilename == $filename] | order(_createdAt desc)[0]{_id}',
    { filename },
  );

  return existing ?? client.assets.upload('image', createReadStream(path), { filename, label });
}

for (const skill of skills) await client.createOrReplace(skill);
for (const document of projects) await client.createOrReplace(document);

await client.patch('project-lah').set({ sortDate: '2026-08-01' }).commit();
await client.patch('project-codeprobe').set({ status: 'archived' }).commit();

for (const cover of covers) {
  const asset = await uploadCover(cover.path, `${cover.id} cover`);
  const image = {
    _type: 'image',
    asset: { _type: 'reference', _ref: asset._id },
    alt: cover.alt,
  };

  await client
    .patch(cover.id)
    .set({ coverImage: image })
    .setIfMissing({ gallery: [{ ...image, _key: 'cover' }] })
    .commit();
}

console.log(`Upserted ${projects.length} projects and ${covers.length} Sanity covers.`);
