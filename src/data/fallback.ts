import type { Post, Profile } from "../types";

export const profile: Profile = {
  name: "Nachiketh Reddy",
  intro:
    "Singapore-based builder and developer exploring AI, hackathons, and the systems mindset behind Formula 1.",
  location: "Singapore",
  about: [
    "I am a builder studying at Singapore Polytechnic, using software as a way to turn half-formed ideas into things people can actually try. My work sits around web development, AI experiments, and the fast feedback loops that come from hackathons.",
    "Right now, I am learning in public through projects, prototypes, and the occasional messy repo that becomes useful later. I care about shipping, but I care just as much about understanding why something works.",
    "Outside the editor, I am drawn to Formula 1 because it rewards the same things good engineering does: precision, iteration, taste under pressure, and knowing when one small change can move the whole race.",
  ],
  links: [
    { label: "GitHub", href: "https://github.com/nachikethreddyy" },
    { label: "LinkedIn", href: "https://www.linkedin.com/in/nachikethreddyy" },
    { label: "Portfolio", href: "https://nachikethreddyy.vercel.app" },
    { label: "Instagram", href: "https://www.instagram.com/nachikethreddy_ynr" },
    { label: "Email", href: "mailto:hello@example.com" },
  ],
  stats: [
    { label: "Public repos", value: "37" },
    { label: "Base", value: "Singapore" },
    { label: "Focus", value: "AI + Web" },
  ],
};

export const fallbackPosts: Post[] = [
  {
    title: "Reading AI Benchmarks Without Losing the Plot",
    slug: "reading-ai-benchmarks-without-losing-the-plot",
    excerpt:
      "Scores are useful, but the harness, setup, and footnotes often explain more than the headline number.",
    category: "AI",
    readTime: "6 min read",
    publishedAt: "2026-06-27",
    tags: ["AI", "benchmarks", "systems"],
    toc: [
      { title: "The headline is not the whole result", anchor: "headline" },
      { title: "What changed in the run", anchor: "run" },
      { title: "A better way to read tables", anchor: "tables" },
      { title: "Footnotes are product surface", anchor: "footnotes" },
    ],
    benchmarkRows: [
      {
        metric: "Agentic terminal coding",
        note: "Terminal-Bench 2.1",
        values: [
          { model: "GPT-5.5", value: "83.4%", highlighted: true },
          { model: "Opus 4.8", value: "74.6%" },
          { model: "Gemini 3.1 Pro", value: "70.3%" },
        ],
      },
      {
        metric: "Agentic computer use",
        note: "OSWorld-Verified",
        values: [
          { model: "Opus 4.7", value: "82.3%", highlighted: true },
          { model: "GPT-5.5", value: "78.7%" },
          { model: "Gemini 3.1 Pro", value: "76.2%" },
        ],
      },
      {
        metric: "Agentic financial analysis",
        note: "Finance Agent v2",
        values: [
          { model: "Gemini 3.5 Flash", value: "57.9%", highlighted: true },
          { model: "Opus 4.8", value: "53.9%" },
          { model: "GPT-5.5", value: "51.8%" },
        ],
      },
    ],
    footnotes: [
      {
        label: "Terminal-Bench 2.1",
        text:
          "Reported scores can vary by harness. The public Terminus-2 harness and Codex CLI harness are not identical evaluation contexts.",
      },
      {
        label: "OSWorld-Verified",
        text:
          "Evaluation setup changed to better reflect real-world performance, and the Opus 4.7 score was updated to 82.3%.",
        href: "https://www.anthropic.com/claude-opus-4-8-system-card",
      },
      {
        label: "Finance Agent v2",
        text:
          "Gemini 3.5 Flash scoring 57.9% is notable because the delta is part of the story, not just the final rank.",
      },
    ],
    body: [
      {
        _type: "block",
        _key: "intro",
        style: "normal",
        markDefs: [],
        children: [
          {
            _type: "span",
            _key: "intro-span",
            text:
              "Benchmark tables look precise, which makes them easy to over-trust. A score can be real and still be incomplete without knowing how the model was run, what harness measured it, and whether the task resembles the work you actually care about.",
            marks: [],
          },
        ],
      },
      {
        _type: "block",
        _key: "headline",
        style: "h2",
        markDefs: [],
        children: [{ _type: "span", _key: "headline-span", text: "The headline is not the whole result", marks: [] }],
      },
      {
        _type: "block",
        _key: "headline-body",
        style: "normal",
        markDefs: [],
        children: [
          {
            _type: "span",
            _key: "headline-body-span",
            text:
              "The useful question is not only which model won. It is what changed between runs, whether the setup was public or product-specific, and whether the metric rewards the kind of judgment you need.",
            marks: [],
          },
        ],
      },
      {
        _type: "block",
        _key: "run",
        style: "h2",
        markDefs: [],
        children: [{ _type: "span", _key: "run-span", text: "What changed in the run", marks: [] }],
      },
      {
        _type: "block",
        _key: "run-body",
        style: "normal",
        markDefs: [],
        children: [
          {
            _type: "span",
            _key: "run-body-span",
            text:
              "A benchmark result is a system output. Change the harness, the tools, the starting state, or the scoring rubric, and the number can move. That does not make the benchmark useless; it makes the methodology part of the result.",
            marks: [],
          },
        ],
      },
      {
        _type: "block",
        _key: "tables",
        style: "h2",
        markDefs: [],
        children: [{ _type: "span", _key: "tables-span", text: "A better way to read tables", marks: [] }],
      },
      {
        _type: "block",
        _key: "tables-body",
        style: "normal",
        markDefs: [],
        children: [
          {
            _type: "span",
            _key: "tables-body-span",
            text:
              "Good tables should slow you down just enough to compare like with like. Highlight the meaningful delta, keep the metric label visible, and put caveats close to the numbers instead of burying them at the bottom.",
            marks: [],
          },
        ],
      },
      {
        _type: "block",
        _key: "footnotes",
        style: "h2",
        markDefs: [],
        children: [{ _type: "span", _key: "footnotes-span", text: "Footnotes are product surface", marks: [] }],
      },
      {
        _type: "block",
        _key: "footnotes-body",
        style: "normal",
        markDefs: [],
        children: [
          {
            _type: "span",
            _key: "footnotes-body-span",
            text:
              "The footnote is where the honest context lives. On technical posts, it is not legal debris; it is part of the interface for trust.",
            marks: [],
          },
        ],
      },
    ],
  },
  {
    title: "First build log",
    slug: "notes-from-the-next-build-sprint",
    excerpt:
      "A simple place for experiments, hackathon ideas, and the lessons that stack up while learning to build better software.",
    publishedAt: "2026-06-27",
    tags: ["building", "learning"],
    body: "This is demo content from the local fallback data. Once Sanity is connected, published posts replace these automatically.",
  },
  {
    title: "Why hackathons are useful pressure",
    slug: "why-hackathons-are-useful-pressure",
    excerpt:
      "Hackathons compress product thinking, engineering tradeoffs, and taste into one very loud feedback loop.",
    publishedAt: "2026-06-20",
    tags: ["hackathons", "product"],
    body: "A draft space for writing about what hackathons teach: speed, scope, collaboration, and the discipline of finishing.",
  },
  {
    title: "AI tools, taste, and learning the hard parts",
    slug: "ai-tools-taste-and-learning",
    excerpt:
      "Using AI to move faster is useful, but the long game is still learning how systems fit together.",
    publishedAt: "2026-06-12",
    tags: ["AI", "craft"],
    body: "A short reflection on pairing AI-assisted building with fundamentals, review, and curiosity.",
  },
];
