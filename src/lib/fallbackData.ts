import type { BlogPost, HomePageContent, Project, SiteSettings, Skill } from './types';

export const fallbackSkills: Skill[] = [
  {
    _id: 'skill-typescript',
    title: 'TypeScript',
    slug: 'typescript',
    category: 'frontend',
    proficiency: 'daily',
    summary: 'Typed full-stack app code across React, Next.js, APIs, and project dashboards.',
  },
  {
    _id: 'skill-javascript',
    title: 'JavaScript',
    slug: 'javascript',
    category: 'frontend',
    proficiency: 'daily',
    summary: 'Browser interfaces, client-side utilities, and full-stack application logic.',
  },
  {
    _id: 'skill-html-css',
    title: 'HTML / CSS',
    slug: 'html-css',
    category: 'frontend',
    proficiency: 'daily',
    summary: 'Semantic interfaces, responsive layouts, and accessible interaction states.',
  },
  {
    _id: 'skill-react-next',
    title: 'React',
    slug: 'react-nextjs',
    category: 'frontend',
    proficiency: 'daily',
    summary: 'Vite, component systems, responsive interfaces, and full-stack product frontends.',
  },
  {
    _id: 'skill-nextjs',
    title: 'Next.js',
    slug: 'nextjs',
    category: 'frontend',
    proficiency: 'confident',
    summary: 'App Router projects, server-side product flows, and hackathon delivery.',
  },
  {
    _id: 'skill-node-express',
    title: 'Node.js / Express',
    slug: 'node-express',
    category: 'backend',
    proficiency: 'confident',
    summary: 'REST APIs, auth flows, server-side app logic, and integration with relational data.',
  },
  {
    _id: 'skill-python',
    title: 'Python',
    slug: 'python',
    category: 'backend',
    proficiency: 'confident',
    summary: 'CLI tools, workflow scripts, data experiments, and local model utilities.',
  },
  {
    _id: 'skill-local-agents',
    title: 'Local agents',
    slug: 'local-agents',
    category: 'ai',
    proficiency: 'learning',
    summary: 'Local models, tool calls, streamed output, memory, and context handling.',
  },
  {
    _id: 'skill-postgres-supabase',
    title: 'PostgreSQL',
    slug: 'postgresql-supabase',
    category: 'database',
    proficiency: 'confident',
    summary: 'Relational schemas, seed data, workflow state, and reporting flows.',
  },
  {
    _id: 'skill-supabase',
    title: 'Supabase',
    slug: 'supabase',
    category: 'backend',
    proficiency: 'confident',
    summary: 'Authentication, PostgreSQL, storage, and row-level security in project work.',
  },
  {
    _id: 'skill-mysql',
    title: 'MySQL',
    slug: 'mysql',
    category: 'database',
    proficiency: 'confident',
    summary: 'Secure-coding coursework, relational queries, and API-backed application data.',
  },
  {
    _id: 'skill-security',
    title: 'Secure Coding / OWASP',
    slug: 'secure-coding-owasp',
    category: 'security',
    proficiency: 'learning',
    summary: 'OWASP Top 10 analysis, JWT/auth review, vulnerability documentation, and fix tracking.',
  },
  {
    _id: 'skill-mobile',
    title: 'Expo / Mobile',
    slug: 'expo-mobile',
    category: 'mobile',
    proficiency: 'learning',
    summary: 'Expo Router, device flows, secure storage, camera/hardware companions, and Android builds.',
  },
  {
    _id: 'skill-cli-systems',
    title: 'CLI / Systems Tools',
    slug: 'cli-systems-tools',
    category: 'systems',
    proficiency: 'learning',
    summary: 'Python, shell, local-first file formats, terminal workflows, and agent-readable tools.',
  },
  {
    _id: 'skill-go-agent-systems',
    title: 'AI-agent architecture',
    slug: 'agent-architecture',
    category: 'ai',
    proficiency: 'exploring',
    summary: 'Agent loops, tool interfaces, streaming output, memory, and local inference workflows.',
  },
];

export const fallbackSiteSettings: SiteSettings = {
  name: 'Nachiketh Reddy',
  role: 'Full-stack developer and Information Technology student',
  education: 'Year 2 Diploma in Information Technology student at Singapore Polytechnic',
  currentFocus: 'Web apps, AI tools, cloud computing, and cybersecurity.',
  githubUsername: 'NachikethReddyY',
  publicRepoCount: 52,
  location: 'Singapore',
  availability:
    'Open to full-stack internships and software projects in Singapore or remote.',
  shortBio:
    'I am a Year 2 Information Technology student at Singapore Polytechnic who builds web apps and AI tools.',
  portfolioUrl: 'https://nachikethreddyy.vercel.app',
  socialLinks: [
    {
      _id: 'social-github',
      label: 'GitHub',
      url: 'https://github.com/NachikethReddyY',
      kind: 'github',
    },
    {
      _id: 'social-linkedin',
      label: 'LinkedIn',
      url: 'https://www.linkedin.com/in/nachikethreddyy/',
      kind: 'linkedin',
    },
    {
      _id: 'social-portfolio',
      label: 'Current Portfolio',
      url: 'https://nachikethreddyy.vercel.app',
      kind: 'other',
    },
  ],
  seoTitle: 'Nachiketh Reddy | Full-stack Developer',
  seoDescription:
    'Portfolio of Nachiketh Reddy, a Year 2 Information Technology student who builds web apps and AI tools.',
};

const skill = (title: string) => fallbackSkills.find((item) => item.title === title)!;

export const fallbackProjects: Project[] = [
  {
    _id: 'project-lah',
    title: 'Local Agent Helper',
    slug: 'lah',
    summary:
      'A terminal AI agent that two friends and I are building around local models, streamed responses, tools, and memory.',
    status: 'building',
    projectType: 'ai-tooling',
    role: 'Co-builder working on architecture, streaming, tools, and terminal interaction',
    period: 'Started Jul 2026',
    sortDate: '2026-08-01',
    impact:
      'I am using LAH to learn how streaming, tool calls, terminal state, and memory fail in practice.',
    featured: true,
    coverImage: {
      asset: {
        url: '/assets/lah/SCR-20260704-ksda.jpeg',
      },
      alt: 'LAH product brief showing an agent control room with chat above and prompt below.',
      caption: 'Early LAH product brief for a local-first agent control room.',
    },
    gallery: [
      {
        asset: {
          url: '/assets/lah/SCR-20260704-ksda.jpeg',
        },
        alt: 'Agent control room concept with chat above and prompt below.',
        caption: 'Agent control room concept with chat above and prompt below.',
      },
      {
        asset: {
          url: '/assets/lah/SCR-20260704-kser.jpeg',
        },
        alt: 'LAH workspace concept exploring local and cloud model control.',
        caption: 'LAH workspace concept exploring local and cloud model control.',
      },
      {
        asset: {
          url: '/assets/lah/SCR-20260704-ksgb.jpeg',
        },
        alt: 'Early layout direction for compact agent context.',
        caption: 'Early layout direction for compact agent context.',
      },
      {
        asset: {
          url: '/assets/lah/SCR-20260704-kshe.jpeg',
        },
        alt: 'Planning and context-management concept screen.',
        caption: 'Planning and context-management concept screen.',
      },
      {
        asset: {
          url: '/assets/lah/SCR-20260704-kskj.jpeg',
        },
        alt: 'Longer LAH product brief section.',
        caption: 'Longer LAH product brief section.',
      },
      {
        asset: {
          url: '/assets/lah/SCR-20260704-ksrc.jpeg',
        },
        alt: 'Agent workflow and tool orchestration notes.',
        caption: 'Agent workflow and tool orchestration notes.',
      },
      {
        asset: {
          url: '/assets/lah/SCR-20260704-kstr.jpeg',
        },
        alt: 'Compact interface section from the LAH brief.',
        caption: 'Compact interface section from the LAH brief.',
      },
      {
        asset: {
          url: '/assets/lah/SCR-20260704-ksvn.jpeg',
        },
        alt: 'TUI-first control surface concept.',
        caption: 'TUI-first control surface concept.',
      },
      {
        asset: {
          url: '/assets/lah/SCR-20260704-ksxe.jpeg',
        },
        alt: 'LAH feature and extension concept.',
        caption: 'LAH feature and extension concept.',
      },
      {
        asset: {
          url: '/assets/lah/SCR-20260704-ktby.jpeg',
        },
        alt: 'Context and transcript management concept.',
        caption: 'Context and transcript management concept.',
      },
      {
        asset: {
          url: '/assets/lah/SCR-20260704-ktdh.jpeg',
        },
        alt: 'Local agent helper product direction.',
        caption: 'Local agent helper product direction.',
      },
      {
        asset: {
          url: '/assets/lah/harness.jpeg',
        },
        alt: 'Full-length LAH product brief capture.',
        caption: 'Full-length LAH product brief capture.',
      },
    ],
    technologies: [skill('TypeScript'), skill('Python'), skill('Local agents'), skill('CLI / Systems Tools')],
    problem:
      'Local AI models can be useful on consumer hardware, but small context windows make serious agent workflows fragile: compaction happens constantly, plans get lost, and the model can spend minutes thinking without producing useful progress.',
    solution:
      'LAH connects OpenAI-compatible local model servers, a TypeScript agent loop, safe tools, streamed output, and a terminal interface. The team is testing what information should stay in context and what should live in durable memory.',
    whatIBuilt: [
      'Streaming-response parsing for OpenAI-compatible model output and experiments with local servers such as LM Studio.',
      'Terminal interface work, tool-calling support, and several safe read-only tools for inspecting the local environment.',
      'Context and memory experiments aimed at helping smaller local models stay focused without repeatedly sending the entire conversation.',
    ],
    constraints: [
      'The repository is private because this is an active team project.',
      'Consumer machines need the system to be frugal with memory, storage, and token context.',
      'Tools begin with safe, non-destructive operations while the team learns how to expose computer access responsibly.',
    ],
    features: [
      'OpenAI-compatible local model connections',
      'Streamed model and thinking output',
      'Safe tool-calling experiments',
      'Terminal-first interaction',
      'Context and memory management experiments',
    ],
    lessonsLearned: [
      'Agent reliability depends on the whole pipeline, not only the prompt or model.',
      'Terminal selection, application-managed selection, and the host clipboard are separate abstraction layers.',
      'TypeScript made the project easier to iterate on after the team moved away from its initial Go implementation.',
    ],
    futureImprovements: [
      'Add safer write tools after the tool-result flow is reliable.',
      'Improve loading, streaming, and thinking-output feedback.',
      'Test context strategies across more local providers and model sizes.',
      'Grow the command-line interface before considering a graphical interface.',
    ],
    seoTitle: 'Local Agent Helper | Nachiketh Reddy',
    seoDescription:
      'An in-development TypeScript agent harness exploring local models, tool execution, streaming responses, and context management.',
  },
  {
    _id: 'project-vsms',
    title: 'Visual Screening Management System',
    slug: 'vsms',
    summary:
      'An ongoing tablet-first web application for managing participant registration, queues, screening stations, reviews, and event progress during community vision-screening events.',
    status: 'building',
    projectType: 'full-stack',
    role: 'Requirements, workflow documentation, design system, and full-stack planning',
    period: 'Jul 2026 – Present',
    sortDate: '2026-08-02',
    impact:
      'I mapped the five staff roles, wrote the user stories, and used them to shape the tablet navigation.',
    featured: true,
    coverImage: {
      asset: {
        url: '/assets/vsms/vsms-cover.jpeg',
      },
      alt: 'VSMS public landing page showing a community vision-screening workspace.',
      caption: 'Public-facing VSMS landing page using recreated, non-sensitive content.',
    },
    technologies: [
      skill('TypeScript'),
      skill('React'),
      skill('Node.js / Express'),
      skill('PostgreSQL'),
    ],
    problem:
      'Vision-screening events involve registration, consent, queues, multiple screening stations, reviewer decisions, referrals, and live event monitoring. When those steps are spread across documents and conversations, staff workflows and implementation decisions become ambiguous.',
    solution:
      'The team is translating the source requirements into role-specific workflows and a responsive tablet-first system. The product direction prioritises large readable controls, calm clinical styling, clear queue state, and visible offline or synchronisation status.',
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
    seoTitle: 'Visual Screening Management System | Nachiketh Reddy',
    seoDescription:
      'A case study in translating a multi-station community vision-screening workflow into a usable tablet-first web application.',
  },
  {
    _id: 'project-roadrunners',
    title: 'RoadRunners',
    slug: 'roadrunners',
    summary:
      'A hackathon app that builds a learning plan from a career goal, then tracks lessons with maps, XP, and streaks.',
    status: 'archived',
    projectType: 'full-stack',
    role: 'Full-stack builder on an AI learning product MVP',
    period: 'Jun 2026',
    sortDate: '2026-06-01',
    impact:
      'Shipped a demoable product for the learning-to-earning challenge with auth, roadmap generation, progress tracking, and interactive coding lessons.',
    featured: false,
    coverImage: {
      asset: {
        url: '/assets/roadrunners/roadrunners-cover.png',
      },
      alt: 'RoadRunners landing page introducing its breadth-first learning journey.',
      caption: 'The live RoadRunners product introduces its goal-based, branching learning flow.',
    },
    technologies: [
      skill('TypeScript'),
      skill('React'),
      skill('Next.js'),
      skill('PostgreSQL'),
      skill('Supabase'),
    ],
    problem:
      'Students can find learning content everywhere, but the path from a goal to actual employable practice is fragmented and hard to keep momentum on.',
    solution:
      'RoadRunners creates an AI-generated journey from a career goal, then adds branches, pivots, XP, streaks, maps, and CodeCasts so the path feels active instead of static.',
    whatIBuilt: [
      'A Next.js and TypeScript application with Supabase auth, PostgreSQL storage, and RLS-aware product flows.',
      'AI roadmap generation with validated fallback content when model calls are unavailable.',
      'Interactive CodeCast surfaces with editable code, checkpoints, optional narration, and execution paths.',
    ],
    constraints: [
      'Hackathon time pressure required demo clarity over deep curriculum coverage.',
      'AI generation needed strong fallback states so the product still worked during model/API failure.',
    ],
    features: [
      'Google OAuth and email-code sign in',
      'AI-generated branching roadmaps',
      'XP, levels, streaks, journey dashboard, and map view',
      'Monaco, Sandpack, Pyodide, Daytona, and optional ElevenLabs narration',
    ],
    githubUrl: 'https://github.com/NachikethReddyY/roadrunners',
    demoUrl: 'https://learnwithroadrunners.vercel.app/',
    lessonsLearned: [
      'AI features need guardrails, schemas, and fallback content as much as prompts.',
      'A strong hackathon demo should make the core loop obvious in the first minute.',
      'Learning products work better when progress is visible and revisable.',
    ],
    futureImprovements: [
      'Add richer curriculum quality evaluation.',
      'Improve analytics around roadmap completion and pivot behavior.',
      'Turn CodeCasts into reusable lesson templates.',
    ],
  },
  {
    _id: 'project-qr-code-generator',
    title: 'QR Code Generator',
    slug: 'qr-code-generator',
    summary:
      'A focused browser utility that turns a URL or text into a downloadable QR code from a single screen.',
    status: 'shipped',
    projectType: 'experiment',
    role: 'Frontend developer across interface, generation, validation, and download behaviour',
    period: 'Oct 2025 · Updated Feb 2026',
    sortDate: '2026-02-01',
    impact:
      'Provides a direct generate-and-download workflow without accounts, stored data, or unnecessary navigation.',
    featured: false,
    coverImage: {
      asset: {
        url: '/assets/qr-code/qr-code-cover.png',
      },
      alt: 'QR Code Generator interface with a text input, generate button, and preview area.',
      caption: 'The live QR Code Generator keeps the complete workflow on one screen.',
    },
    technologies: [skill('JavaScript'), skill('HTML / CSS')],
    problem:
      'Generating a QR code should be a quick task, but many tools add sign-up flows, advertising, or unrelated controls around a simple interaction.',
    solution:
      'A lightweight client-side page accepts a URL or text, validates the input, renders the QR code in the browser, and enables a direct image download.',
    whatIBuilt: [
      'A responsive single-page interface with clear input, generation, preview, and download states.',
      'Client-side QR rendering and PNG download behaviour using QRCode.js.',
      'Inline empty-input feedback and disabled download behaviour before a code is generated.',
    ],
    constraints: [
      'The project intentionally stays client-only and does not store generated content.',
      'The small scope prioritises a reliable core workflow over accounts, history, or customisation.',
    ],
    features: [
      'Generate a QR code from a URL or text',
      'Preview the result in the browser',
      'Download the generated code as an image',
      'Responsive single-screen layout',
    ],
    githubUrl: 'https://github.com/NachikethReddyY/QR-code',
    demoUrl: 'https://ynr-qrcode.vercel.app/',
    lessonsLearned: [
      'A small utility benefits from making its primary action obvious and keeping every state visible.',
      'Client-side generation can keep a simple tool fast and avoid collecting user input on a server.',
    ],
    futureImprovements: [
      'Add colour, size, and error-correction controls only if real users need them.',
      'Replace CDN dependencies with locally bundled assets for stronger deployment control.',
    ],
    seoTitle: 'QR Code Generator | Nachiketh Reddy',
    seoDescription:
      'A lightweight client-side QR code generator built with JavaScript, HTML, and CSS.',
  },
  {
    _id: 'project-lumina',
    title: 'Lumina',
    slug: 'lumina',
    summary:
      'A full-stack AI helpdesk and issue-tracking platform with ticket workflows, assignment history, dashboards, reporting, onboarding, and PostgreSQL-backed state.',
    status: 'shipped',
    projectType: 'full-stack',
    role: 'Full-stack developer across frontend, backend, database, and workflow design',
    period: 'May 2026',
    sortDate: '2026-05-01',
    impact:
      'I built the ticket flow from signup and approval through assignment, comments, status changes, and reporting.',
    featured: true,
    coverImage: {
      asset: {
        url: '/assets/lumina/lumina-cover.jpeg',
      },
      alt: 'Lumina landing page showing an AI-assisted support ticket workflow.',
      caption: 'Lumina public demo showing its support-ticket routing workflow.',
    },
    technologies: [
      skill('TypeScript'),
      skill('React'),
      skill('Node.js / Express'),
      skill('PostgreSQL'),
    ],
    problem:
      'Helpdesk platforms need more than a ticket form: they need onboarding, assignment rules, audit history, comments, reporting, and a database model that supports workflow reality.',
    solution:
      'Lumina combines a React frontend, Express backend, PostgreSQL schema, ticket assignment history, JSONB metadata, seed data, dashboards, and AI-assisted ticket routing.',
    whatIBuilt: [
      'A Vite React TypeScript frontend paired with an Express backend.',
      'PostgreSQL schema, seed data, refresh scripts, reporting helpers, and ticket assignment state.',
      'Ticket lifecycle screens for onboarding, approval, comments, status changes, notifications, and dashboards.',
    ],
    constraints: [
      'The project had to support database design assessment requirements while still feeling like a usable product.',
      'Role handling had to stay simple enough for demos while still representing HR, managers, developers, and QA.',
    ],
    features: [
      'Account creation, OTP verification, and Google OAuth linking',
      'AI-assisted routing and ticket assignment',
      'Developer/QA assignment history',
      'Dashboards, notifications, audit history, and HR reporting',
    ],
    githubUrl: 'https://github.com/NachikethReddyY/lumina',
    demoUrl: 'https://ynr-lumina.vercel.app',
    lessonsLearned: [
      'Database shape has a direct impact on how cleanly workflow UI can be built.',
      'Reporting and audit trails are easier when assignment history is modeled explicitly.',
      'AI routing is more trustworthy when users can still see and change workflow state.',
    ],
    futureImprovements: [
      'Add stronger production auth hardening.',
      'Build admin configuration for routing rules.',
      'Add deeper reporting filters and export paths.',
    ],
  },
  {
    _id: 'project-codeprobe',
    title: 'CodeProbe Scanner',
    slug: 'codeprobe-scanner',
    summary:
      'A CLI that scans dependencies and source code, reports security issues, and suggests patches.',
    status: 'archived',
    projectType: 'cybersecurity',
    role: 'Built the scanner and CLI',
    period: 'Jun 2026',
    sortDate: '2026-06-01',
    impact:
      'Scans dependencies and source code, reports security issues, and suggests fixes in one CLI run.',
    featured: false,
    coverImage: {
      asset: {
        url: '/assets/codeprobe/codeprobe-cover.jpeg',
      },
      alt: 'CodeProbe terminal scan reporting dependency vulnerabilities, exploit verification, patches, and risk score.',
      caption: 'CodeProbe v1.0 scanning dependencies and source code from the terminal.',
    },
    technologies: [
      skill('TypeScript'),
      skill('Node.js / Express'),
      skill('Secure Coding / OWASP'),
    ],
    problem:
      'Developers often separate dependency vulnerability checks from source-code security review, which makes remediation slower and easier to ignore.',
    solution:
      'CodeProbe scans package dependencies and source-code patterns, reports CVEs, assigns a risk score, and can ask Kimi to draft a patch.',
    whatIBuilt: [
      'Recursive package scanning for monorepos and nested projects.',
      'Source-code checks for secrets, SQL injection, command injection, XSS, path traversal, insecure randomness, and unsafe eval usage.',
      'Risk scoring, reports, and patch drafts from Kimi.',
    ],
    constraints: [
      'Automated fixes need to be explainable enough for developers to trust.',
      'Security scanners must avoid false confidence, so reporting needs clear severity and proof context.',
    ],
    features: [
      'OSV.dev and npm advisory dependency checks',
      'SAST vulnerability pattern detection',
      'Automatic fixes for selected issue classes',
      'Kimi LLM patch generation',
      'Aggregated monorepo reports',
    ],
    githubUrl: 'https://github.com/NachikethReddyY/codeprobe',
    lessonsLearned: [
      'Security tooling is most useful when it meets developers inside their normal workflow.',
      'AI patching needs strong boundaries: clear issue, narrow context, reviewable diff.',
    ],
    futureImprovements: [
      'Add more language analyzers.',
      'Export SARIF for GitHub code scanning.',
      'Add CI-friendly non-interactive scan modes.',
    ],
  },
  {
    _id: 'project-model-shelf',
    title: 'Model Shelf',
    slug: 'model-shelf',
    summary:
      'A local-first model storage standard and resolver for GGUF, MLX, and safetensors models so agents can inspect what is already on disk.',
    status: 'experiment',
    projectType: 'ai-tooling',
    role: 'CLI and local AI workflow designer',
    period: 'Jun 2026',
    sortDate: '2026-06-01',
    impact:
      'Keeps local model files and metadata in a folder that both people and agents can inspect.',
    featured: false,
    coverImage: {
      asset: {
        url: '/assets/model-shelf/model-shelf-cover.png',
      },
      alt: 'GitHub repository preview for Model Shelf.',
      caption: 'Official GitHub repository preview for Model Shelf.',
    },
    technologies: [skill('Python'), skill('Local agents'), skill('CLI / Systems Tools')],
    problem:
      'Local AI workflows often lose track of which models exist on disk, which format they use, who published them, and how much memory they need.',
    solution:
      'Model Shelf defines a simple visible `models/` layout plus a CLI resolver that answers model format, publisher, quantization, disk/RAM expectations, and launch/install commands.',
    whatIBuilt: [
      'A Python CLI with `ms init`, model shelf layout conventions, and local resolver commands.',
      'A storage standard for GGUF, MLX, and safetensors model formats.',
      'Install/update flows designed for local agent and runtime workflows.',
    ],
    constraints: [
      'The tool intentionally avoids web apps, background services, and databases.',
      'The shelf folder has to stay human-readable and agent-readable.',
    ],
    features: [
      'Visible `models/` directory standard',
      'GGUF, MLX, and safetensors organization',
      'Install and update commands',
      'Local model metadata resolution',
    ],
    githubUrl: 'https://github.com/NachikethReddyY/model-shelf',
    lessonsLearned: [
      'Local-first AI tools need boring, inspectable file conventions.',
      'A CLI can be a product when the workflow is clear and repeatable.',
    ],
    futureImprovements: [
      'Add richer model metadata validation.',
      'Support more runtime launch adapters.',
      'Add examples for common local model stacks.',
    ],
  },
  {
    _id: 'project-qwen-distill',
    title: 'Qwen3.5 Distill',
    slug: 'qwen3-distill',
    summary:
      'A ready-to-train fine-tuning dataset and workflow for experimenting with a small local coding model using curated code, system-design, and tool-use examples.',
    status: 'experiment',
    projectType: 'ai-tooling',
    role: 'AI experimenter building local model training workflows',
    period: 'Jun 2026',
    sortDate: '2026-06-01',
    impact:
      'Explores whether a small, local model can reason about production code and tool use with carefully curated training data.',
    featured: false,
    coverImage: {
      asset: {
        url: '/assets/qwen-distill/qwen-distill-cover.png',
      },
      alt: 'GitHub repository preview for the Qwen3.5 Distill training experiment.',
      caption: 'Official GitHub repository preview for Qwen3.5 Distill.',
    },
    technologies: [skill('Python'), skill('Local agents')],
    problem:
      'Large cloud coding models are powerful but expensive, remote, and hard to customize for personal workflows.',
    solution:
      'The project curates hundreds of examples and provides repeatable MLX and GPU training workflows for future Qwen adapter experiments.',
    whatIBuilt: [
      'Training data groups for React, JavaScript, Python, system design, REST/GraphQL, Docker, and tool-use.',
      'MLX local training scripts for Apple Silicon and GPU training scripts for CUDA/Nosana paths.',
      'Evaluation workflow for generated coding responses.',
    ],
    constraints: [
      'Small-model quality depends heavily on data quality, not just training scripts.',
      'Local training must balance memory, cost, and iteration speed.',
    ],
    features: [
      '331 curated examples',
      'MLX adapter workflow',
      'GPU training option',
      'Prompt categories for code, tools, agents, and system design',
    ],
    githubUrl: 'https://github.com/NachikethReddyY/qwen3-distill',
    lessonsLearned: [
      'Fine-tuning is as much data design as model training.',
      'A local model workflow needs repeatable scripts before it needs a fancy interface.',
    ],
    futureImprovements: [
      'Add structured eval benchmarks.',
      'Publish model cards for adapter variants.',
      'Compare local output against larger hosted models.',
    ],
  },
  {
    _id: 'project-iris-auth-lite',
    title: 'Iris Auth Lite',
    slug: 'iris-auth-lite',
    summary:
      'An offline iris capture and verification app using Expo Router, Raspberry Pi camera capture, on-device enhancement, secure storage, and audit logs.',
    status: 'experiment',
    projectType: 'mobile-hardware',
    role: 'Mobile app and hardware-integration builder for a hackathon prototype',
    period: 'SUTD HacX 2025',
    sortDate: '2025-08-01',
    impact:
      'Packaged a working mobile iris-scan prototype connected to a Raspberry Pi capture rig for hackathon presentation.',
    featured: false,
    coverImage: {
      asset: {
        url: '/assets/iris-auth-lite/iris-auth-lite-cover.png',
      },
      alt: 'GitHub repository preview for the Iris Auth Lite mobile and Raspberry Pi prototype.',
      caption: 'Official GitHub repository preview for Iris Auth Lite.',
    },
    technologies: [skill('TypeScript'), skill('Expo / Mobile'), skill('Python'), skill('Local agents')],
    problem:
      'Biometric identity demos often depend on cloud processing or fragile capture flows that are hard to explain and hard to trust.',
    solution:
      'Iris Auth Lite keeps capture, quality scoring, enhancement, templates, PINs, and logs on-device while using a Raspberry Pi camera companion for image capture.',
    whatIBuilt: [
      'Expo Router flow from onboarding through PIN creation, Pi connection, and iris scan.',
      'Raspberry Pi companion camera server integration over local hotspot endpoints.',
      'Secure Store persistence for templates, PINs, and audit logs.',
    ],
    constraints: [
      'The prototype needed to run offline and be demoable from real mobile hardware.',
      'Image quality had to be checked before accepting frames into the verification template.',
      'The checked-in ONNX model is still a placeholder and must be replaced before treating verification as complete.',
    ],
    features: [
      'Raspberry Pi MJPEG preview and REST capture endpoints',
      'Deterministic quality scoring',
      'On-device super-resolution path',
      'Secure persistence and audit log export',
    ],
    githubUrl: 'https://github.com/NachikethReddyY/iris-lite-v2',
    lessonsLearned: [
      'Hardware demos need clear connection states and recovery paths.',
      'Biometric UX has to make privacy and storage decisions visible.',
    ],
    futureImprovements: [
      'Improve enrollment guidance.',
      'Add stronger security documentation.',
      'Package a repeatable Pi provisioning script.',
    ],
  },
  {
    _id: 'project-cryptix',
    title: 'Cryptix Security Analysis',
    slug: 'cryptix-security-analysis',
    summary:
      'A secure coding project analyzing a game store web app for OWASP Top 10 risks, with assigned ownership over broken access control plus logging and monitoring.',
    status: 'shipped',
    projectType: 'cybersecurity',
    role: 'OWASP analyst for A01 Broken Access Control and A09 Logging & Monitoring',
    period: 'Jul 2026',
    sortDate: '2026-07-01',
    impact:
      'Produced exploit notes, evidence, documentation, and remediation guidance for a Node/Express/MySQL/JWT web application.',
    featured: false,
    coverImage: {
      asset: {
        url: '/assets/cryptix/cryptix-cover.png',
      },
      alt: 'GitHub repository preview for the Cryptix secure coding project.',
      caption: 'Official GitHub repository preview for the Cryptix team project.',
    },
    technologies: [
      skill('Node.js / Express'),
      skill('Secure Coding / OWASP'),
      skill('MySQL'),
    ],
    problem:
      'A web app can appear functional while still exposing access-control, authentication, injection, and monitoring weaknesses.',
    solution:
      'The team divided OWASP categories, tested assigned risks, documented findings, and proposed fixes with API testing and post-fix evidence.',
    whatIBuilt: [
      'Owned analysis for broken access control and logging/monitoring weaknesses.',
      'Used Bruno, DataGrip, OrbStack, K9s, JWT review, and database inspection in the testing workflow.',
      'Contributed documentation, fix tracking, and post-fix screenshots.',
    ],
    constraints: [
      'The project needed to satisfy secure coding coursework while remaining clear enough for team handoff.',
      'Findings had to include evidence and practical remediation, not just vulnerability labels.',
    ],
    features: [
      'OWASP Top 10 scouting and assignment matrix',
      'Node.js Express backend and static frontend analysis',
      'MySQL database review',
      'JWT middleware and route testing',
      'Vulnerability reports and fix tracker',
    ],
    githubUrl: 'https://github.com/NachikethReddyY/turbo-funicular',
    lessonsLearned: [
      'Security work improves when ownership is explicit by vulnerability category.',
      'Logs and monitoring are part of security, not a cleanup task after launch.',
    ],
    futureImprovements: [
      'Add automated regression tests for the remediated issues.',
      'Create a concise public case-study version of the report.',
    ],
  },
  {
    _id: 'project-kingdom-clash',
    title: 'Kingdom Clash',
    slug: 'kingdom-clash',
    summary:
      'A full-stack wellness game where real-life challenges earn points and PowerChips used to unlock heroes, fight bosses, and grow a virtual kingdom.',
    status: 'shipped',
    projectType: 'coursework',
    role: 'Full-stack developer across the static frontend, Express API, authentication, and MySQL data model',
    period: 'Jan–Feb 2026',
    sortDate: '2026-02-01',
    impact:
      'Delivered a Singapore Polytechnic backend-development project with role-based access, wellness tracking, hero progression, raids, and leaderboard workflows.',
    featured: false,
    coverImage: {
      asset: {
        url: '/assets/kingdom-clash/kingdom-clash-cover.jpeg',
      },
      alt: 'Kingdom Clash landing page with the game logo and sign-up actions over a fantasy landscape.',
      caption: 'Kingdom Clash landing page and entry points.',
    },
    gallery: [
      {
        asset: {
          url: '/assets/kingdom-clash/kingdom-clash-cover.jpeg',
        },
        alt: 'Kingdom Clash landing page with the game logo and sign-up actions over a fantasy landscape.',
        caption: 'Kingdom Clash landing page and entry points.',
      },
    ],
    technologies: [
      skill('JavaScript'),
      skill('HTML / CSS'),
      skill('Node.js / Express'),
      skill('MySQL'),
      skill('Secure Coding / OWASP'),
    ],
    problem:
      'Wellness habits are difficult to sustain when progress feels abstract and rewards are disconnected from everyday actions.',
    solution:
      'Kingdom Clash turns wellness challenges into a game economy: completing activities earns points and PowerChips that fund hero recruitment, boss raids, duels, and kingdom growth.',
    whatIBuilt: [
      'A static HTML, CSS, and JavaScript interface for authentication, dashboards, challenges, the hero store, raids, settings, and admin workflows.',
      'An Express REST API with JWT authentication, bcrypt password hashing, role-based access control, and account/session handling.',
      'A MySQL schema and business rules for users, challenges, completions, heroes, boss battles, duels, battle logs, leaderboards, and rewards.',
    ],
    constraints: [
      'The project had to satisfy backend-development coursework requirements while remaining demoable as a complete game experience.',
      'Database updates for points, PowerChips, hero ownership, and combat state needed to preserve game rules across several related tables.',
    ],
    features: [
      'JWT authentication and bcrypt password hashing',
      'Participant, admin, and owner role-based access',
      'Wellness challenge creation, joining, cooldowns, and completion rewards',
      'Hero recruitment, healing, revival, deployment, boss raids, and duels',
      'Points and PowerChips leaderboards',
    ],
    githubUrl: 'https://github.com/ST0503-BED/bed-ca2-NachikethReddyY',
    lessonsLearned: [
      'Authentication affects the entire product flow, from redirects and protected pages to role checks on API routes.',
      'Game mechanics become easier to maintain when their limits and state changes are enforced in the backend, not only in the interface.',
    ],
    futureImprovements: [
      'Wrap multi-table reward and duel updates in explicit database transactions.',
      'Add automated API checks for authentication, permissions, and game-economy rules.',
      'Replace client-side cooldown state with server-authoritative timestamps.',
    ],
  },
  {
    _id: 'project-voxscribe',
    title: 'VoxScribe',
    slug: 'voxscribe',
    summary:
      'A local desktop speech-to-text and Smart Write tool using faster-whisper, Ollama, global hotkeys, clipboard injection, and a lightweight overlay.',
    status: 'experiment',
    projectType: 'ai-tooling',
    role: 'Local AI desktop-tool builder',
    period: 'Mar 2026',
    sortDate: '2026-03-01',
    impact:
      'Keeps dictation and rewriting on the user’s computer instead of sending audio to a cloud service.',
    featured: false,
    coverImage: {
      asset: {
        url: '/assets/voxscribe/voxscribe-cover.png',
      },
      alt: 'GitHub repository preview for the VoxScribe local voice transcription tool.',
      caption: 'Official GitHub repository preview for VoxScribe.',
    },
    technologies: [skill('Python'), skill('Local agents'), skill('CLI / Systems Tools')],
    problem:
      'Voice dictation tools are useful, but many route audio through cloud services and make local privacy difficult.',
    solution:
      'VoxScribe runs in the system tray, records through global hotkeys, transcribes with local Whisper, optionally rewrites with a local Ollama model, and injects text into the active app.',
    whatIBuilt: [
      'Python desktop workflow with system hotkeys and status overlay.',
      'Local faster-whisper transcription path.',
      'Local LLM rewriting through Ollama and smart text injection.',
    ],
    constraints: [
      'Desktop utilities need strong permission and fallback behavior.',
      'Low-latency feedback matters because users are speaking into the system live.',
    ],
    features: [
      'Local Whisper STT',
      'Ollama-powered Smart Write',
      'Global hotkeys',
      'Floating overlay',
      'Clipboard and focused-field injection',
    ],
    githubUrl: 'https://github.com/NachikethReddyY/voxscribe',
    lessonsLearned: [
      'Local AI UX is about speed, permission trust, and small feedback loops.',
      'A useful AI tool can be quiet and system-level, not always a chat interface.',
    ],
    futureImprovements: [
      'Polish cross-platform packaging.',
      'Add model/profile presets.',
      'Improve onboarding around local dependencies.',
    ],
  },
];

function blogBlock(key: string, text: string, style: 'normal' | 'h2' = 'normal') {
  return {
    _type: 'block' as const,
    _key: key,
    style,
    markDefs: [],
    children: [{ _type: 'span' as const, _key: `${key}-span`, text, marks: [] }],
  };
}

export const fallbackPosts: BlogPost[] = [
  {
    _id: 'post-planning-before-coding',
    title: 'The Most Useful Thing I Built for VSMS Wasn’t Code',
    slug: 'planning-software-before-writing-it',
    excerpt:
      'Before our team touched the main build, I turned scattered requirements into one document we could actually work from.',
    publishedAt: '2026-07-22T09:00:00.000Z',
    featuredImage: {
      asset: { url: '/assets/vsms/vsms-cover.jpeg' },
      alt: 'VSMS public landing page for a community vision-screening workflow.',
      caption: 'VSMS translates a multi-station screening event into a tablet-first workflow.',
    },
    categories: [
      { _id: 'cat-full-stack', title: 'Full-stack', slug: 'full-stack' },
      { _id: 'cat-process', title: 'Process', slug: 'process' },
      { _id: 'cat-learning', title: 'Learning', slug: 'learning' },
    ],
    readingTime: '3 min read',
    body: [
      blogBlock(
        'planning-intro',
        'VSMS looked like a normal full-stack school project at first: frontend, backend, database, roles. Then I started reading the requirements properly. The hard part was not choosing a framework. The event process lived across several documents and conversations, and each person had a slightly different picture of how it should work.',
      ),
      blogBlock('planning-workflow-heading', 'My first deliverable was an HTML document', 'h2'),
      blogBlock(
        'planning-workflow',
        'Nobody asked me to make it. I collected the requirements, grouped the user stories, listed the roles, and wrote down the questions we still needed to ask the client. That document became more useful than another early dashboard mock-up because the team could finally point at the same version of the process.',
      ),
      blogBlock('planning-roles-heading', 'I had to map five different staff views', 'h2'),
      blogBlock(
        'planning-roles',
        'The system has administrators, registration staff, queue staff, screening-station staff, and reviewers. They all work at the same event, but they do not need the same screen. Mapping who hands a participant to whom exposed decisions that a generic role-based dashboard would have hidden.',
      ),
      blogBlock('planning-unknowns-heading', 'I wrote down what we still did not know', 'h2'),
      blogBlock(
        'planning-unknowns',
        'What happens if the connection drops between stations? Can consent be corrected later? Who moves someone back in the queue? I could have guessed and drawn a polished screen around the guess. Instead, I kept a visible list of client questions. It made the uncertainty look less impressive, but it stopped us from treating assumptions as requirements.',
      ),
      blogBlock('planning-interface-heading', 'The event changed the design', 'h2'),
      blogBlock(
        'planning-interface',
        'Staff will use the app on tablets while people are waiting and moving between stations. That is why the controls are large, the status colours are calm, and each role sees only what it needs. The design came from the room the software will be used in, not from a dashboard trend.',
      ),
      blogBlock('planning-lesson-heading', 'What I would repeat', 'h2'),
      blogBlock(
        'planning-lesson',
        'On my next client project, I would do the same thing earlier: make one shared description of the process, mark every unanswered question, and only then decide what the first screen should be. The document was not a delay before development. It was the first useful part of the development.',
      ),
    ],
    seoTitle: 'The Most Useful Thing I Built for VSMS Wasn’t Code | Nachiketh Reddy',
    seoDescription:
      'How I turned scattered VSMS requirements into one shared guide before our team started the main build.',
  },
  {
    _id: 'post-ai-code-ownership',
    title: 'I Use AI Every Day. I Still Own the Code.',
    slug: 'ai-without-giving-up-code-ownership',
    excerpt:
      'I am not interested in pretending I code without AI. I am interested in knowing when its answer is wrong.',
    publishedAt: '2026-07-15T09:00:00.000Z',
    featuredImage: {
      asset: { url: '/assets/lah/SCR-20260704-kshe.jpeg' },
      alt: 'LAH diagram showing how goals, questions, permissions, tools, and output fit together.',
      caption: 'A LAH design note showing the checks around an AI agent task.',
    },
    categories: [
      { _id: 'cat-ai', title: 'AI', slug: 'ai' },
      { _id: 'cat-engineering', title: 'Engineering', slug: 'engineering' },
      { _id: 'cat-learning', title: 'Learning', slug: 'learning' },
    ],
    readingTime: '3 min read',
    body: [
      blogBlock(
        'ownership-intro',
        'I use AI a lot. I use it when I am learning a library, comparing approaches, tracing a bug, or trying to get a rough version working. Pretending otherwise would be dishonest. The important question for me is not whether AI touched the code. It is whether I can explain the code after it did.',
      ),
      blogBlock('ownership-explore-heading', 'My rule is simple', 'h2'),
      blogBlock(
        'ownership-explore',
        'If an AI gives me code that I cannot debug when it breaks, I do not own it yet. I read the dependency documentation, follow the state changes, run the code, and check the failure cases. Sometimes the suggestion survives. Sometimes the best result is deleting it and writing the smaller version myself.',
      ),
      blogBlock('ownership-review-heading', 'LAH made this impossible to fake', 'h2'),
      blogBlock(
        'ownership-review',
        'In LAH, a clean answer is not enough. A streamed response can arrive in the wrong order. A tool call can fail halfway through. Context can be compacted and remove something the model still needs. Working on the harness forced me to follow the full path instead of accepting a function because it compiled.',
      ),
      blogBlock('ownership-debug-heading', 'AI did not make the stack decision for us', 'h2'),
      blogBlock(
        'ownership-debug',
        'LAH started in Go and later moved to TypeScript. AI helped us compare options and prototype parts of both versions, but the decision came from the team: TypeScript gave us a better ecosystem for the terminal interface, schemas, and integrations we were building. The fastest-looking language on paper was not the fastest way for us to ship and maintain the project.',
      ),
      blogBlock('ownership-principle-heading', 'Where I draw the line', 'h2'),
      blogBlock(
        'ownership-principle',
        'I use the first draft only after I can explain the important parts, test the paths that can fail, and maintain it after the demo.',
      ),
    ],
    seoTitle: 'I Use AI Every Day. I Still Own the Code. | Nachiketh Reddy',
    seoDescription:
      'How I use AI for software development while still reading, testing, and maintaining the code.',
  },
  {
    _id: 'post-terminal-selection',
    title: 'Terminal Text Selection Looked Easy Until I Built It',
    slug: 'native-terminal-selection',
    excerpt:
      'The task sounded tiny: highlight text and copy it. Then I found two selection systems that looked identical and behaved completely differently.',
    publishedAt: '2026-07-08T09:00:00.000Z',
    featuredImage: {
      asset: { url: '/assets/lah/SCR-20260704-kser.jpeg' },
      alt: 'Local Agent Helper terminal workspace concept.',
      caption: 'LAH made terminal selection an application-design problem rather than a styling detail.',
    },
    categories: [
      { _id: 'cat-terminal', title: 'Terminal UI', slug: 'terminal-ui' },
      { _id: 'cat-ai', title: 'AI', slug: 'ai' },
      { _id: 'cat-debugging', title: 'Debugging', slug: 'debugging' },
    ],
    readingTime: '3 min read',
    body: [
      blogBlock(
        'selection-intro',
        'One LAH issue sounded almost embarrassing to spend time on: text selection. A user should drag across text, copy it, and move on. The terminal already highlights text, so I assumed the application could read that selection. It could not.',
      ),
      blogBlock('selection-layers-heading', 'The highlight belonged to the terminal, not LAH', 'h2'),
      blogBlock(
        'selection-layers',
        'When the host terminal highlights rendered cells, it does not send LAH a neat string containing the selected text. From the application’s point of view, nothing was selected. The terminal drew the highlight outside the state that OpenTUI and my code controlled.',
      ),
      blogBlock('selection-boundary-heading', 'OpenTUI selection is a different feature', 'h2'),
      blogBlock(
        'selection-boundary',
        'OpenTUI can manage a selection inside the app, but then the app has to own the range, the interaction, and the copy command. Visually, it can look almost the same as native terminal selection. Architecturally, it is the opposite: one is host state and the other is application state.',
      ),
      blogBlock('selection-design-heading', 'The clipboard is a fallback, not a hidden API', 'h2'),
      blogBlock(
        'selection-design',
        'After the user copies native terminal text, LAH can read the clipboard if the platform allows it. That still does not tell the app what is currently highlighted. Treating the clipboard as though it were live selection state would make the behaviour unreliable and different across terminals.',
      ),
      blogBlock('selection-lesson-heading', 'What I changed', 'h2'),
      blogBlock(
        'selection-lesson',
        'I stopped looking for one event handler that would magically connect both layers. The honest options were an explicit OpenTUI-managed selection flow or clear clipboard behaviour after a native copy. The bug reminded me that before fixing an interaction, I need to ask who actually owns it.',
      ),
    ],
    seoTitle: 'Terminal Text Selection Looked Easy Until I Built It | Nachiketh Reddy',
    seoDescription:
      'What building a terminal AI tool revealed about native terminal selection, application state, and clipboard boundaries.',
  },
  {
    _id: 'post-currently-building-lah',
    title: 'I Built an AI Agent Harness to See What Happens Under the Prompt',
    slug: 'currently-building-lah',
    excerpt:
      'I was using coding agents without really knowing what happened after I pressed Enter, so two friends and I started building the missing pieces ourselves.',
    publishedAt: '2026-07-04T09:00:00.000Z',
    featuredImage: {
      asset: {
        url: '/assets/lah/SCR-20260704-ksda.jpeg',
      },
      alt: 'Local Agent Helper product brief showing an agent control room concept.',
      caption: 'Local Agent Helper began as an attempt to understand the full agent workflow.',
    },
    categories: [
      {
        _id: 'cat-ai',
        title: 'AI',
        slug: 'ai',
      },
      {
        _id: 'cat-projects',
        title: 'Projects',
        slug: 'projects',
      },
      {
        _id: 'cat-learning',
        title: 'Learning',
        slug: 'learning',
      },
    ],
    readingTime: '3 min read',
    body: [
      blogBlock(
        'lah-intro',
        'I knew how to use coding agents, but not how they parsed responses, called tools, or decided what stayed in context. LAH started because I wanted to build those steps myself.',
      ),
      blogBlock('lah-team-heading', 'It is a team project, and it is still unfinished', 'h2'),
      blogBlock(
        'lah-team',
        'Two friends and I are building LAH together. The repository is private while we are still changing the architecture. It is not production-ready and it is not trying to replace the major coding agents. Right now, we are using it to test streaming, tools, memory, and terminal behaviour.',
      ),
      blogBlock('lah-context-heading', 'Small local models make every wasted token obvious', 'h2'),
      blogBlock(
        'lah-context',
        'On consumer hardware, I cannot pretend the context window is unlimited. If LAH sends too much, the model slows down or loses focus. If it removes the wrong detail, the plan falls apart. That turned context management from an abstract AI topic into a real product constraint.',
      ),
      blogBlock('lah-stream-heading', 'Streaming is not just printing text slowly', 'h2'),
      blogBlock(
        'lah-stream',
        'A model response arrives as events that need to be parsed, displayed, and connected to tool calls. Thinking output, normal text, tool arguments, failures, and completion signals do not all behave the same way. Building the parser made me understand why an agent can feel broken even when the model itself is responding correctly.',
      ),
      blogBlock('lah-tools-heading', 'The tool loop is where the agent becomes real', 'h2'),
      blogBlock(
        'lah-tools',
        'We built the first tools separately so we could see the whole loop. The model needs a clear tool description, the harness needs to validate the request, the terminal needs to show what happened, and the next model turn needs the result without filling the context with noise.',
      ),
      blogBlock('lah-typescript-heading', 'Why we moved from Go to TypeScript', 'h2'),
      blogBlock(
        'lah-typescript',
        'The first version explored Go. We moved back to TypeScript because the ecosystem matched the TUI, validation, and provider work we were doing, and because all three of us could change and debug it faster. For this team and project, TypeScript was the more practical choice.',
      ),
      blogBlock('lah-next-heading', 'What I am working on next', 'h2'),
      blogBlock(
        'lah-next',
        'Next I am working on better write tools, clearer streaming feedback, file indexing, more reliable memory, and tests across local model providers.',
      ),
    ],
    seoTitle: 'I Built an AI Agent Harness to See What Happens Under the Prompt | Nachiketh Reddy',
    seoDescription:
      'What I learned by rebuilding streamed responses, tool calls, terminal state, and context handling in LAH.',
  },
];

export const fallbackHomePage: HomePageContent = {
  headline: 'Hello, I’m Nachiketh.',
  subheadline:
    'I’m Nachiketh Reddy, a Year 2 Information Technology student at Singapore Polytechnic. I work mainly with React, TypeScript, Node.js, and PostgreSQL.',
  positioningStatement:
    'I usually learn a tool by building with it, breaking something, and tracing why it broke.',
  primaryCtaLabel: 'View Selected Work',
  primaryCtaHref: '/projects',
  secondaryCtaLabel: 'Read About My Approach',
  secondaryCtaHref: '#about',
  focusAreas: [
    {
      title: 'AI tools',
      description:
        'In LAH, I parse streamed model output, connect tool calls, and test how much context a local model actually needs.',
    },
    {
      title: 'Web applications',
      description:
        'VSMS, Lumina, and RoadRunners have pushed me to think about roles, databases, interfaces, reliability, and the people using the system.',
    },
    {
      title: 'Cloud and security',
      description:
        'My security work has made me check permissions, logs, and deployment settings earlier.',
    },
  ],
  featuredProjects: fallbackProjects.filter((project) => project.featured),
  highlightedPosts: fallbackPosts,
  skills: fallbackSkills.filter((item) =>
    ['TypeScript', 'React', 'Node.js / Express', 'PostgreSQL'].includes(item.title),
  ),
  seoTitle: 'Nachiketh Reddy | Full-stack Developer',
  seoDescription:
    'Nachiketh Reddy is a Year 2 Information Technology student who builds web apps and AI tools.',
};
