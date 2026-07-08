import { createReadStream, readdirSync } from 'node:fs';
import { basename, join } from 'node:path';

import { getCliClient } from 'sanity/cli';

const client = getCliClient({ apiVersion: '2026-07-08' });

const lahImageDir = '/Users/nr/Documents/Screenshots/LAH';
const coverFilename = 'SCR-20260704-ksda.jpeg';
const imageFilenames = readdirSync(lahImageDir)
  .filter((filename) => filename.endsWith('.jpeg'))
  .sort((a, b) => {
    if (a === coverFilename) return -1;
    if (b === coverFilename) return 1;
    if (a === 'harness.jpeg') return 1;
    if (b === 'harness.jpeg') return -1;
    return a.localeCompare(b);
  });

const captionByFilename: Record<string, string> = {
  'SCR-20260704-ksda.jpeg': 'Agent control room concept with chat above and prompt below.',
  'SCR-20260704-kser.jpeg': 'LAH workspace concept exploring local/cloud model control.',
  'SCR-20260704-ksgb.jpeg': 'Early layout direction for compact agent context.',
  'SCR-20260704-kshe.jpeg': 'Planning and context-management concept screen.',
  'SCR-20260704-kskj.jpeg': 'Longer LAH product brief section.',
  'SCR-20260704-ksrc.jpeg': 'Agent workflow and tool orchestration notes.',
  'SCR-20260704-kstr.jpeg': 'Compact interface section from the LAH brief.',
  'SCR-20260704-ksvn.jpeg': 'TUI-first control surface concept.',
  'SCR-20260704-ksxe.jpeg': 'LAH feature and extension concept.',
  'SCR-20260704-ktby.jpeg': 'Context and transcript management concept.',
  'SCR-20260704-ktdh.jpeg': 'Local agent helper product direction.',
  'harness.jpeg': 'Full-length LAH product brief capture.',
};

const ref = (_ref: string, _key: string) => ({ _key, _type: 'reference', _ref });
type PortableTextChild = {
  _type: 'span';
  _key: string;
  text: string;
  marks: string[];
};

const block = (
  text: string,
  style = 'normal',
  children: PortableTextChild[] = [{ _type: 'span', _key: 'span', text, marks: [] }],
  markDefs: Array<Record<string, unknown>> = [],
) => ({
  _key: `block-${Math.random().toString(36).slice(2)}`,
  _type: 'block',
  style,
  markDefs,
  children,
});
const bullet = (text: string) => ({
  ...block(text),
  listItem: 'bullet',
  level: 1,
});
const imageBlock = (filename: string, assetId: string) => ({
  _key: `image-${filename.replace(/[^a-z0-9]/gi, '-').toLowerCase()}`,
  _type: 'image',
  asset: { _type: 'reference', _ref: assetId },
  alt: captionByFilename[filename] ?? 'LAH project screenshot.',
  caption: captionByFilename[filename] ?? 'LAH project screenshot.',
});
const textWithMarks = (
  children: Array<{ text: string; marks?: string[] }>,
  markDefs: Array<Record<string, unknown>>,
  style = 'normal',
) => block('', style, children.map((child, index) => ({
  _type: 'span',
  _key: `span-${index}`,
  text: child.text,
  marks: child.marks ?? [],
})), markDefs);

async function uploadImage(path: string, label: string) {
  const existing = await client.fetch<{ _id: string } | null>(
    '*[_type == "sanity.imageAsset" && originalFilename == $filename][0]{_id}',
    { filename: basename(path) },
  );

  if (existing?._id) {
    return existing;
  }

  return client.assets.upload('image', createReadStream(path), {
    filename: basename(path),
    label,
  });
}

const assetsByFilename = new Map<string, { _id: string }>();

for (const filename of imageFilenames) {
  assetsByFilename.set(
    filename,
    await uploadImage(join(lahImageDir, filename), `LAH ${filename}`),
  );
}

const assetIdFor = (filename: string) => {
  const assetId = assetsByFilename.get(filename)?._id;

  if (!assetId) {
    throw new Error(`Missing uploaded asset for ${filename}`);
  }

  return assetId;
};

const coverAsset = assetsByFilename.get(coverFilename)!;
const postBody = [
  block('Local AI setups have a problem.'),
  block('Well, at least the smaller ones do.'),
  block('We cannot give them the context window they actually need.'),
  block('On consumer hardware, you realistically get anywhere from 8GB to 32GB of RAM to work with, not counting the maxed-out machines with 48GB to 128GB. I am using an M4 MacBook Air with 32GB of unified memory and 512GB of storage. With MLX, I can comfortably run models like Gemma 4 E4B, Qwen 3.6 9B, and even push into one of my favourite local coding models, Qwen 3.6 35B A3B.'),
  block('That sounds powerful, and it is. But it is not the same as having a giant cloud model with a massive context window and infrastructure doing the heavy lifting behind the scenes.'),
  block('If you are on Windows or Linux, you generally need much beefier GPU setups to get similar performance. If you are on a student budget, the gap becomes very real very quickly.'),
  block('The advice everyone gives', 'h2'),
  block('People often say the same thing: plug your local model into OpenCode and start coding with it.'),
  block('So I took that advice.'),
  block('Guess what happened?'),
  block('Constant context compaction.'),
  block('The model thinks for two minutes, then boom: compaction. It thinks again, then compaction again. Sometimes after running it for 30 minutes, it still does not output anything useful. The model forgets things. Planning falls apart. Reasoning becomes inconsistent, even when you give it good skills, instructions, and project context.'),
  block('The problem is not that local models are useless. They are not. If you have the hardware, they are actually pretty capable.'),
  block('The problem is that local agents need a different kind of harness.'),
  imageBlock('SCR-20260704-ktby.jpeg', assetIdFor('SCR-20260704-ktby.jpeg')),
  block('Why I care about this', 'h2'),
  block('I do not want to keep paying for cloud models forever, especially as a student.'),
  block('Sure, I have access to them right now. But for how long?'),
  block('AI is getting more expensive, and I think a lot of us are starting to feel that. We are all vibe coding, prototyping ideas, trying random product concepts, and sometimes just trying to get something out of our heads quickly. Learning to code properly still matters. I care about that a lot. But sometimes you want to test an idea without worrying about burning through credits.'),
  textWithMarks(
    [
      { text: 'The image above is from something I wanted to build: an HTML product brief created with GPT-5.5 on low reasoning using a ' },
      { text: 'design-ui', marks: ['code'] },
      { text: ' skill I made. If the screenshot is not clear, there is a better look here: ' },
      { text: 'LAH concept preview', marks: ['conceptPreview'] },
      { text: '.' },
    ],
    [
      {
        _key: 'conceptPreview',
        _type: 'link',
        href: 'https://www.linkedin.com/safety/go/?url=https%3A%2F%2Flnkd%2Ein%2FgzGtpEs5&urlhash=1Ljj&mt=T9XXxGIkV2s0jdDaS3r6wsCl_ckLyqwjIbZG2upl-3zPwCHqyCpSMEx18yeYDXiRxrQhwjaia47pS_9plWFtYOa0Pp_WBLMuK5Zn1QkD_YiVPMcjagOrH9VnYqE&isSdui=true',
      },
    ],
  ),
  block('For that kind of fast prototyping, I do not think people want to waste expensive credits every time.'),
  imageBlock('SCR-20260704-kser.jpeg', assetIdFor('SCR-20260704-kser.jpeg')),
  imageBlock('SCR-20260704-ksrc.jpeg', assetIdFor('SCR-20260704-ksrc.jpeg')),
  block('What we are building', 'h2'),
  textWithMarks(
    [
      { text: 'So my friends ' },
      { text: 'Cheng Jun Tee', marks: ['chengJun'] },
      { text: ', ' },
      { text: 'Chong Hao Ooi', marks: ['chongHao'] },
      { text: ', and I decided to build something.' },
    ],
    [
      { _key: 'chengJun', _type: 'link', href: 'https://www.linkedin.com/in/cj-tee/' },
      { _key: 'chongHao', _type: 'link', href: 'https://www.linkedin.com/in/chong-hao-ooi/' },
    ],
  ),
  block('We are working on LAH, a context-efficient AI harness for local and smaller-model agent workflows.'),
  block('The goal is to give AI agents:'),
  bullet('A knowledge base'),
  bullet('Efficient context management'),
  bullet('Better planning'),
  bullet('Better prototyping'),
  bullet('Built-in design tools'),
  bullet('The ability to create custom extensions'),
  block('The whole USP is simple: better context management.'),
  block('Instead of expecting the model to hold everything in its context window, we want the harness to manage what matters outside the model. Project knowledge should be durable. Plans should be explicit. Transcripts should be compact and exportable. Prompts should stay visible. Tool state should not disappear just because the model had to compress the conversation again.'),
  imageBlock('SCR-20260704-kshe.jpeg', assetIdFor('SCR-20260704-kshe.jpeg')),
  imageBlock('SCR-20260704-ksvn.jpeg', assetIdFor('SCR-20260704-ksvn.jpeg')),
  imageBlock('SCR-20260704-ksxe.jpeg', assetIdFor('SCR-20260704-ksxe.jpeg')),
  block('Why Go?', 'h2'),
  block('We are learning Go to build it.'),
  block('Why Go?'),
  block("Honestly, it was one of those decisions where we thought, \"It seems cool. Let's learn it.\""),
  block('Could we build the same thing in TypeScript? Probably. We might even move over eventually, especially since TypeScript itself is moving parts of its toolchain to Go. TypeScript would also make it easier for people to write custom instructions and extensions without needing to learn Go.'),
  block('But for now, Go gives us a reason to slow down, understand the system properly, and build the boring pieces ourselves.'),
  imageBlock('SCR-20260704-ktdh.jpeg', assetIdFor('SCR-20260704-ktdh.jpeg')),
  block('The hard part', 'h2'),
  block('One thing makes this project harder: we cannot really vibe code it.'),
  block('We have to write the code by hand.'),
  block('That does not mean we cannot use AI. We can use AI to teach us concepts, explain Go patterns, critique design decisions, and help us understand what we are building. But the actual implementation needs to be ours, because the point is not just to ship a wrapper. The point is to learn how agent systems work when the context window is not infinite and the budget is not unlimited.'),
  imageBlock('SCR-20260704-kskj.jpeg', assetIdFor('SCR-20260704-kskj.jpeg')),
  imageBlock('harness.jpeg', assetIdFor('harness.jpeg')),
  block('Can we actually pull this off?'),
  block('Well.'),
  block('We are about to find out over the coming months.'),
];

await client.createIfNotExists({
  _id: 'cat-ai',
  _type: 'category',
  title: 'AI',
  slug: { _type: 'slug', current: 'ai' },
});

await client.createIfNotExists({
  _id: 'cat-learning',
  _type: 'category',
  title: 'Learning',
  slug: { _type: 'slug', current: 'learning' },
});

await client.createIfNotExists({
  _id: 'cat-projects',
  _type: 'category',
  title: 'Projects',
  slug: { _type: 'slug', current: 'projects' },
});

await client.createIfNotExists({
  _id: 'author-nachiketh',
  _type: 'author',
  name: 'Nachiketh Reddy',
  role: 'Full Stack Developer + Aspiring AI Developer',
});

await client.createOrReplace({
  _id: 'skill-go-agent-systems',
  _type: 'skill',
  title: 'Go / Agent Systems',
  slug: { _type: 'slug', current: 'go-agent-systems' },
  category: 'systems',
  proficiency: 'learning',
  summary: 'Learning Go by building context-efficient local AI agent tooling and terminal-first workflows.',
});

await client.createOrReplace({
  _id: 'project-lah',
  _type: 'project',
  title: 'LAH',
  slug: { _type: 'slug', current: 'lah' },
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
    _type: 'image',
    asset: { _type: 'reference', _ref: coverAsset._id },
    alt: 'LAH product brief showing an agent control room with chat above and prompt below.',
  },
  gallery: [
    ...imageFilenames.map((filename) => ({
      _key: `gallery-${filename.replace(/[^a-z0-9]/gi, '-').toLowerCase()}`,
      _type: 'image',
      asset: { _type: 'reference', _ref: assetIdFor(filename) },
      alt: captionByFilename[filename] ?? 'LAH project screenshot.',
      caption: captionByFilename[filename] ?? 'LAH project screenshot.',
    })),
  ],
  technologies: [
    ref('skill-go-agent-systems', 'go-agent-systems'),
    ref('skill-python-ai', 'python-local-ai'),
    ref('skill-cli-systems', 'cli-systems-tools'),
  ],
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
});

await client.createOrReplace({
  _id: 'post-currently-building-lah',
  _type: 'post',
  title: 'Currently Building: LAH',
  slug: { _type: 'slug', current: 'currently-building-lah' },
  excerpt:
    'Why local AI coding agents struggle on consumer hardware, and why we are building a context-efficient harness for smaller models.',
  publishedAt: '2026-07-04T09:00:00.000Z',
  featuredImage: {
    _type: 'image',
    asset: { _type: 'reference', _ref: coverAsset._id },
    alt: 'LAH product brief showing an agent control room concept.',
  },
  author: ref('author-nachiketh', 'author-nachiketh'),
  categories: [ref('cat-ai', 'cat-ai'), ref('cat-projects', 'cat-projects'), ref('cat-learning', 'cat-learning')],
  body: postBody,
  seoTitle: 'Currently Building: LAH | Nachiketh Reddy',
  seoDescription:
    'A blog post about building LAH, a context-efficient local AI harness for smaller models and consumer hardware.',
});

const homePage = await client.fetch<{
  _id: string;
  featuredProjects?: Array<{ _key?: string; _ref: string; _type: 'reference' }>;
  highlightedPosts?: Array<{ _key?: string; _ref: string; _type: 'reference' }>;
} | null>('*[_type == "homePage"][0]{_id, featuredProjects, highlightedPosts}');

if (homePage?._id) {
  const featuredProjects = [
    ref('project-lah', 'project-lah'),
    ...(homePage.featuredProjects ?? []).filter((item) => item._ref !== 'project-lah'),
  ];
  const highlightedPosts = [
    ref('post-currently-building-lah', 'post-currently-building-lah'),
    ...(homePage.highlightedPosts ?? []).filter((item) => item._ref !== 'post-currently-building-lah'),
  ];

  await client.patch(homePage._id).set({ featuredProjects, highlightedPosts }).commit();
}

console.log('Upserted LAH skill, project, post, and image assets.');
