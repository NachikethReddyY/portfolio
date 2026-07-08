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
    _id: 'skill-react-next',
    title: 'React / Next.js',
    slug: 'react-nextjs',
    category: 'frontend',
    proficiency: 'daily',
    summary: 'Vite, Next.js App Router, component systems, and responsive product interfaces.',
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
    _id: 'skill-python-ai',
    title: 'Python / Local AI',
    slug: 'python-local-ai',
    category: 'ai',
    proficiency: 'confident',
    summary: 'Local model tooling, Whisper transcription, MLX experiments, and AI workflow scripts.',
  },
  {
    _id: 'skill-postgres-supabase',
    title: 'PostgreSQL / Supabase',
    slug: 'postgresql-supabase',
    category: 'database',
    proficiency: 'confident',
    summary: 'Relational schemas, Supabase Auth, RLS-aware apps, seed data, and reporting flows.',
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
    summary: 'Go, Python, shell, local-first file formats, terminal workflows, and agent-readable tools.',
  },
  {
    _id: 'skill-go-agent-systems',
    title: 'Go / Agent Systems',
    slug: 'go-agent-systems',
    category: 'systems',
    proficiency: 'learning',
    summary: 'Learning Go by building context-efficient local AI agent tooling and terminal-first workflows.',
  },
];

export const fallbackSiteSettings: SiteSettings = {
  name: 'Nachiketh Reddy',
  role: 'Full Stack Developer + Aspiring AI Developer',
  education: 'Year 2 IT Diploma student at Singapore Polytechnic',
  currentFocus: 'Full-stack products, local AI tools, automation, cloud, and cybersecurity.',
  githubUsername: 'NachikethReddyY',
  publicRepoCount: 49,
  location: 'Singapore',
  availability:
    'Open to internships, hackathons, AI projects, and full-stack collaborations in Singapore or remote.',
  shortBio:
    'I am a Year 2 IT student at Singapore Polytechnic building full-stack apps, local AI tools, secure systems, and experiments that turn curiosity into working software.',
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
  seoTitle: 'Nachiketh Reddy | Full Stack + Aspiring AI Developer',
  seoDescription:
    'Portfolio of Nachiketh Reddy, a Year 2 IT student at Singapore Polytechnic building full-stack apps, AI tooling, secure systems, and local-first developer tools.',
};

const skill = (title: string) => fallbackSkills.find((item) => item.title === title)!;

export const fallbackProjects: Project[] = [
  {
    _id: 'project-lah',
    title: 'LAH',
    slug: 'lah',
    summary:
      'A context-efficient local AI harness for smaller models, built around knowledge bases, planning, compact transcripts, design tools, and custom extensions.',
    status: 'building',
    projectType: 'ai-tooling',
    role: 'Co-builder learning Go and shaping the agent workflow',
    period: 'Started Jul 2026',
    impact:
      'Targets the biggest pain point in consumer local AI coding setups: small context windows that cause constant compaction, forgotten plans, and inconsistent reasoning.',
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
    technologies: [skill('Go / Agent Systems'), skill('Python / Local AI'), skill('CLI / Systems Tools')],
    problem:
      'Local AI models can be useful on consumer hardware, but small context windows make serious agent workflows fragile: compaction happens constantly, plans get lost, and the model can spend minutes thinking without producing useful progress.',
    solution:
      'LAH is being designed as a local-first agent harness that keeps durable knowledge, plans, prompts, transcripts, tools, and extension state outside the model context so smaller models can work with less waste.',
    whatIBuilt: [
      'Early product direction for a TUI-first local agent workspace with a fixed prompt area, scrollable chat, model switching, cost/token visibility, and compact transcript exports.',
      'A context-management strategy centered on durable knowledge, explicit plans, and selective recall instead of repeatedly stuffing the full conversation back into the model.',
      'Initial design briefs and workflow sketches for built-in prototyping, design tools, custom extensions, and local/cloud model switching.',
    ],
    constraints: [
      'The project is intentionally being written by hand while using AI as a teacher, not as the primary code generator.',
      'Consumer machines need the system to be frugal with memory, storage, and token context.',
      'Go is a learning choice for the team, which means the architecture has to stay simple enough to build while learning the language.',
    ],
    features: [
      'Knowledge base for durable project memory',
      'Context-efficient prompt and transcript management',
      'Planning and review loops for agent work',
      'Local model first workflow with room for cloud fallback',
      'Built-in design and prototyping tools',
      'Custom skills, instructions, and extensions',
      'TUI-first agent control room',
    ],
    lessonsLearned: [
      'Better prompts do not solve local AI context limits on their own.',
      'Agent workflows need memory and planning systems that live outside the model window.',
      'Learning the implementation language can be part of the product constraint, not a side quest.',
    ],
    futureImprovements: [
      'Ship the first usable Go prototype.',
      'Test context strategies against MLX local models on consumer Apple Silicon.',
      'Decide whether extension authoring should stay in Go or move toward TypeScript for accessibility.',
      'Benchmark transcript compaction, knowledge recall, and planning reliability against existing local agent flows.',
    ],
    seoTitle: 'LAH | Local Agent Helper',
    seoDescription:
      'A currently building local AI agent harness focused on better context management for consumer hardware and smaller local models.',
  },
  {
    _id: 'project-roadrunners',
    title: 'RoadRunners',
    slug: 'roadrunners',
    summary:
      'A hackathon MVP that turns a career goal into an AI-guided learning journey with XP, streaks, branching maps, and interactive CodeCasts.',
    status: 'shipped',
    projectType: 'full-stack',
    role: 'Full-stack builder on an AI learning product MVP',
    period: 'Jun 2026',
    impact:
      'Shipped a demoable product for the learning-to-earning challenge with auth, roadmap generation, progress tracking, and interactive coding lessons.',
    featured: true,
    technologies: [
      skill('TypeScript'),
      skill('React / Next.js'),
      skill('PostgreSQL / Supabase'),
      skill('Python / Local AI'),
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
    demoUrl: 'https://roadrunners-ten.vercel.app',
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
    _id: 'project-lumina',
    title: 'Lumina',
    slug: 'lumina',
    summary:
      'A full-stack AI helpdesk and issue-tracking platform with ticket workflows, assignment history, dashboards, reporting, onboarding, and PostgreSQL-backed state.',
    status: 'shipped',
    projectType: 'full-stack',
    role: 'Full-stack developer across frontend, backend, database, and workflow design',
    period: 'May 2026',
    impact:
      'Demonstrates an end-to-end ticket lifecycle from signup and approval through AI-assisted routing, comments, status changes, notifications, and HR-style reporting.',
    featured: true,
    technologies: [
      skill('TypeScript'),
      skill('React / Next.js'),
      skill('Node.js / Express'),
      skill('PostgreSQL / Supabase'),
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
      'A full-stack vulnerability scanner that combines dependency scanning, SAST checks, risk scoring, and AI-generated patch suggestions.',
    status: 'building',
    projectType: 'cybersecurity',
    role: 'Security tooling builder',
    period: 'Jun 2026',
    impact:
      'Turns security review into a developer workflow by scanning dependencies and source code, then suggesting or generating fixes.',
    featured: true,
    technologies: [
      skill('TypeScript'),
      skill('Node.js / Express'),
      skill('Secure Coding / OWASP'),
      skill('Python / Local AI'),
    ],
    problem:
      'Developers often separate dependency vulnerability checks from source-code security review, which makes remediation slower and easier to ignore.',
    solution:
      'CodeProbe scans package dependencies and source code patterns together, scores risk, reports CVEs, and uses Kimi AI integration to generate intelligent patch suggestions.',
    whatIBuilt: [
      'Recursive package scanning for monorepos and nested projects.',
      'Source-code checks for secrets, SQL injection, command injection, XSS, path traversal, insecure randomness, and unsafe eval usage.',
      'Risk scoring, reporting, and AI patch generation workflow.',
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
    status: 'building',
    projectType: 'ai-tooling',
    role: 'CLI and local AI workflow designer',
    period: 'Jun 2026',
    impact:
      'Creates a visible, file-based convention for local models without requiring a database, server, or hidden app state.',
    featured: true,
    technologies: [skill('Python / Local AI'), skill('CLI / Systems Tools')],
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
      'A fine-tuning experiment for a small local coding model trained on curated React, Python, JavaScript, system design, and tool-use examples.',
    status: 'experiment',
    projectType: 'ai-tooling',
    role: 'AI experimenter building local model training workflows',
    period: 'Jun 2026',
    impact:
      'Explores whether a small, local model can reason about production code and tool use with carefully curated training data.',
    featured: false,
    technologies: [skill('Python / Local AI'), skill('TypeScript')],
    problem:
      'Large cloud coding models are powerful but expensive, remote, and hard to customize for personal workflows.',
    solution:
      'The project curates hundreds of examples and trains Qwen adapters locally with MLX or on GPU infrastructure, targeting reasoning, code generation, and tool-use behavior.',
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
    status: 'shipped',
    projectType: 'mobile-hardware',
    role: 'Mobile app and hardware-integration builder for a hackathon prototype',
    period: 'SUTD HacX 2025',
    impact:
      'Packaged a working mobile iris-scan prototype connected to a Raspberry Pi capture rig for hackathon presentation.',
    featured: false,
    technologies: [skill('TypeScript'), skill('Expo / Mobile'), skill('Python / Local AI')],
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
    impact:
      'Produced exploit notes, evidence, documentation, and remediation guidance for a Node/Express/MySQL/JWT web application.',
    featured: false,
    technologies: [
      skill('Node.js / Express'),
      skill('Secure Coding / OWASP'),
      skill('PostgreSQL / Supabase'),
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
    _id: 'project-voxscribe',
    title: 'VoxScribe',
    slug: 'voxscribe',
    summary:
      'A local desktop speech-to-text and Smart Write tool using faster-whisper, Ollama, global hotkeys, clipboard injection, and a lightweight overlay.',
    status: 'experiment',
    projectType: 'ai-tooling',
    role: 'Local AI desktop-tool builder',
    period: 'Mar 2026',
    impact:
      'Explores privacy-first voice workflows where transcription and rewriting stay on the user machine.',
    featured: false,
    technologies: [skill('Python / Local AI'), skill('CLI / Systems Tools')],
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

export const fallbackPosts: BlogPost[] = [
  {
    _id: 'post-currently-building-lah',
    title: 'Currently Building: LAH',
    slug: 'currently-building-lah',
    excerpt:
      'Why local AI coding agents struggle on consumer hardware, and why we are building a context-efficient harness for smaller models.',
    publishedAt: '2026-07-04T09:00:00.000Z',
    featuredImage: {
      asset: {
        url: '/assets/lah/SCR-20260704-ksda.jpeg',
      },
      alt: 'LAH product brief showing an agent control room concept.',
      caption: 'LAH started from a simple frustration: local agents need better context management.',
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
    author: {
      _id: 'author-nachiketh',
      name: 'Nachiketh Reddy',
      role: 'Full Stack Developer + Aspiring AI Developer',
    },
    readingTime: '5 min read',
    body: [
      {
        _type: 'block',
        _key: 'lah-intro',
        style: 'normal',
        markDefs: [],
        children: [
          {
            _type: 'span',
            _key: 'span',
            text: 'Local AI setups have a problem. Well, at least the smaller ones do. We cannot give them the context window they actually need.',
            marks: [],
          },
        ],
      },
      {
        _type: 'block',
        _key: 'lah-hardware',
        style: 'normal',
        markDefs: [],
        children: [
          {
            _type: 'span',
            _key: 'span',
            text: 'On consumer hardware, local models can be capable, but smaller context windows make serious agent workflows fragile: compaction happens constantly, plans get lost, and reasoning becomes inconsistent.',
            marks: [],
          },
        ],
      },
      {
        _type: 'block',
        _key: 'lah-what-building-heading',
        style: 'h2',
        markDefs: [],
        children: [
          {
            _type: 'span',
            _key: 'span',
            text: 'What we are building',
            marks: [],
          },
        ],
      },
      {
        _type: 'block',
        _key: 'lah-what-building',
        style: 'normal',
        markDefs: [],
        children: [
          {
            _type: 'span',
            _key: 'span',
            text: 'LAH is a context-efficient AI harness for local and smaller-model agent workflows, focused on knowledge bases, planning, compact transcripts, built-in design tools, and custom extensions.',
            marks: [],
          },
        ],
      },
      {
        _type: 'block',
        _key: 'lah-hard-part-heading',
        style: 'h2',
        markDefs: [],
        children: [
          {
            _type: 'span',
            _key: 'span',
            text: 'The hard part',
            marks: [],
          },
        ],
      },
      {
        _type: 'block',
        _key: 'lah-hard-part',
        style: 'normal',
        markDefs: [],
        children: [
          {
            _type: 'span',
            _key: 'span',
            text: 'We are learning Go and writing the implementation by hand, using AI mainly as a teacher. We are about to find out over the coming months whether we can pull it off.',
            marks: [],
          },
        ],
      },
    ],
    seoTitle: 'Currently Building: LAH | Nachiketh Reddy',
    seoDescription:
      'A blog post about building LAH, a context-efficient local AI harness for smaller models and consumer hardware.',
  },
];

export const fallbackHomePage: HomePageContent = {
  headline: 'Nachiketh Reddy',
  subheadline:
    'Full stack developer and aspiring AI developer building products across web apps, local model tools, security projects, and automation.',
  positioningStatement:
    'I am a Year 2 IT diploma student at Singapore Polytechnic. My work sits where full-stack engineering meets AI: shipping usable apps, studying cloud and cybersecurity, and building local-first tools that make models, voice, and developer workflows more practical.',
  primaryCtaLabel: 'Explore Projects',
  primaryCtaHref: '/projects',
  secondaryCtaLabel: 'View GitHub',
  secondaryCtaHref: 'https://github.com/NachikethReddyY',
  focusAreas: [
    {
      title: 'AI systems that run close to the machine',
      description:
        'Model Shelf, Qwen fine-tuning, VoxScribe, and voice tooling are pushing me toward local-first AI workflows, model operations, and agent-readable systems.',
    },
    {
      title: 'Full-stack products with real workflows',
      description:
        'RoadRunners and Lumina show the app side: auth, databases, dashboards, ticket flows, AI routing, learning journeys, and deployable interfaces.',
    },
    {
      title: 'Security and cloud-aware engineering',
      description:
        'Secure coding coursework, OWASP analysis, and Singapore Polytechnic IT training shape how I think about auth, access, logs, and reliable systems.',
    },
  ],
  featuredProjects: fallbackProjects.filter((project) => project.featured),
  highlightedPosts: fallbackPosts,
  skills: fallbackSkills,
  seoTitle: 'Nachiketh Reddy | Full Stack + Aspiring AI Developer',
  seoDescription:
    'Nachiketh Reddy is a Year 2 IT student at Singapore Polytechnic building full-stack apps, local AI tools, secure systems, and automation projects.',
};
