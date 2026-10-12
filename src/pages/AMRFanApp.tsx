import { useCallback, useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { Arrow, SocialIcon } from "../components/Icons";
import { currentSection } from "../lib/readingContents";
import { usePageMotion } from "../usePageMotion";

type TreeLeaf = { id: string; label: string };
type TreeBranch = TreeLeaf & { children?: TreeBranch[] };

const REPO_URL = "https://github.com/NachikethReddyY/AMR-Fan-App";
const DEMO_URL = "https://youtu.be/Fn2FTYSmvbQ";
const DEMO_ID = "Fn2FTYSmvbQ";
const SHOPIFY_URL = "https://shopify.engineering/back-to-native";
const MAKE_A_MARK_URL = "https://www.astonmartinf1.com/en-GB/make-a-mark";
/* The exact edition we worked from at the idea-thon. */
const ESG_REPORT_URL =
  "https://downloads.astonmartinf1.com/MakeAMark_ESG_Report_2025.pdf";
const ADS_IG_URL = "";
const ARTICLE_PATH =
  "/writing/amr-fan-app-turning-sustainability-reporting-into-something-fans-actually-use";

const LINKEDIN = {
  joseph: "https://www.linkedin.com/in/joseph-p-k/",
  aleisya: "https://www.linkedin.com/in/aleisya-fuad/",
  anirudh: "https://www.linkedin.com/in/anirudh-kumar-sp/",
  dylan: "https://www.linkedin.com/in/dylantsaiyiheng/",
  darius: "https://www.linkedin.com/in/kaungnyihein/",
  briana: "https://www.linkedin.com/in/briana-kong/",
  sachita: "https://www.linkedin.com/in/thasilsachita/",
  nachiketh: "https://www.linkedin.com/in/nachikethreddyy/",
};

const SECTIONS: TreeBranch[] = [
  { id: "amr-overview", label: "Overview" },
  {
    id: "amr-problem",
    label: "The problem statement",
    children: [{ id: "amr-fan", label: "Who we built for" }],
  },
  {
    id: "amr-decoding",
    label: "Decoding the brief",
    children: [
      { id: "amr-problems", label: "The problems" },
      { id: "amr-tension", label: "Two jobs, one app" },
    ],
  },
  {
    id: "amr-ideas",
    label: "The ideas",
    children: [{ id: "amr-kept", label: "What we kept" }],
  },
  {
    id: "amr-react",
    label: "v1: React Native",
    children: [{ id: "amr-react-wrong", label: "Why we dropped it" }],
  },
  {
    id: "amr-swift",
    label: "Rewriting it in Swift",
    children: [
      { id: "amr-society", label: "Where the Swift came from" },
      { id: "amr-modular", label: "Built to be swapped out" },
    ],
  },
  {
    id: "amr-design",
    label: "Designing the look",
    children: [{ id: "amr-driver-hook", label: "Driver numbers" }],
  },
  {
    id: "amr-features",
    label: "The features",
    children: [
      {
        id: "amr-loop",
        label: "The loop",
        children: [
          { id: "amr-plan", label: "Plan" },
          { id: "amr-prove", label: "Prove" },
          { id: "amr-earn", label: "Earn" },
          { id: "amr-see", label: "See" },
        ],
      },
      { id: "amr-travel", label: "Travel + Maps" },
      { id: "amr-camera", label: "The sustainability camera" },
      { id: "amr-theming", label: "Driver theming" },
    ],
  },
  {
    id: "amr-stack",
    label: "The stack",
    children: [{ id: "amr-data", label: "Data, auth, backend" }],
  },
  {
    id: "amr-port",
    label: "Swift to Android",
    children: [{ id: "amr-inspiration", label: "The inspiration" }],
  },
  {
    id: "amr-business",
    label: "Business benefits",
    children: [{ id: "amr-trust", label: "Trust and governance" }],
  },
  {
    id: "amr-decisions",
    label: "Decisions",
    children: [
      { id: "amr-cut", label: "The cut list" },
      { id: "amr-prompts", label: "Judge prompts" },
    ],
  },
  {
    id: "amr-constraints",
    label: "Constraints",
    children: [
      { id: "amr-time", label: "Time" },
      { id: "amr-cost", label: "Cost" },
      { id: "amr-platform", label: "The platform rewrite" },
    ],
  },
  { id: "amr-lessons", label: "Lessons learned" },
  { id: "amr-version", label: "Current version" },
  { id: "amr-end", label: "Where it lands" },
];

const SECTION_IDS = SECTIONS.map((section) => section.id);

function flatten(branches: TreeBranch[], depth = 0): Array<TreeLeaf & { depth: number }> {
  return branches.flatMap((branch) => [
    { id: branch.id, label: branch.label, depth },
    ...flatten(branch.children ?? [], depth + 1),
  ]);
}

const ALL_HEADINGS = flatten(SECTIONS);

/** True when the active heading is this branch or anywhere beneath it, so a
    chapter keeps its children open while the reader is inside one of them. */
function containsHeading(branch: TreeBranch, id: string): boolean {
  if (branch.id === id) return true;
  return (branch.children ?? []).some((child) => containsHeading(child, id));
}

const PROBLEMS = [
  {
    num: "01",
    title: "The report is built for auditors",
    text: "Long, dense, and written to prove the team met a target. Nobody reads a document that length for fun, so its audience is already converted.",
  },
  {
    num: "02",
    title: "Fans can't see themselves in it",
    text: "The report talks about the team. The fan has no line in it — nothing tells them what their behaviour has to do with a Scope 3 target.",
  },
  {
    num: "03",
    title: "Green advice skips the trip itself",
    text: "Carbon tools are built around a home and a commute. The journey a fan actually makes — wherever they are going today, and which way they take — is the one decision they can compare and change, and nothing was speaking to it.",
  },
  {
    num: "04",
    title: "Engagement without substance is cheap",
    text: "Points and streaks are easy to bolt on. They only mean something if the thing they reward is real.",
  },
];

const IDEA_BOARD = [
  { note: "ESG dashboard", state: "kept", text: "We focused on the environment side of the ESG reporting and showed it to the fans. That focus became the impact dashboard." },
  { note: "Auto-ingest the report", state: "future", text: "Future scope, not the MVP — the MVP had to work on the day. The idea: upload the whole report and let a model build the view out the way we think fans will read it best. Because it generates custom components rather than one fixed screen, those pieces can be composed into views that present the sustainability figures well." },
  { note: "Food + stay marketplace", state: "dropped", text: "Needed partners and commission logic. Slides only." },
  { note: "Community feed", state: "dropped", text: "Moderation and scale we didn't have time to earn." },
  { note: "Travel calculator", state: "kept", text: "Public transport vs car, same route, side by side." },
  { note: "Sustainability camera", state: "kept", text: "Photograph the action, let a model judge it, pay out points." },
  { note: "Impact dashboard", state: "kept", text: "Your savings against a real circuit — Marina Bay." },
  { note: "Driver theming", state: "kept", text: "Added late. It's the reason it felt like a fan app." },
];

/* Scatter angles for the idea postcards, so the pile reads tossed down rather
   than tiled; --tape gives each strip of tape its own slight skew. */
const POSTCARD_TILTS = [-2.4, 1.7, -1.2, 2.3, -1.8, 1.3, -2.2, 1.6];

const DECISIONS: Array<{
  id?: string;
  status: string;
  tone: string;
  title: string;
  text: string;
}> = [
  {
    id: "amr-cut",
    status: "Deferred",
    tone: "is-future",
    title: "ESG auto-ingestion",
    text: "Upload the report and let a model build the views from it. Out of MVP scope — the MVP had to work on the day — but it is still where a next version starts.",
  },
  {
    status: "Killed",
    tone: "is-killed",
    title: "Admin dashboard",
    text: "Cut in the same pass. Evaluators grade the fan experience, and the moderation traces stayed in the code.",
  },
  {
    status: "Killed",
    tone: "is-killed",
    title: "Hotel + food marketplace",
    text: "Cut in the same pass. Needed partner data and commission logic, and it sat outside the loop.",
  },
  {
    status: "Killed",
    tone: "is-killed",
    title: "Continuous location tracking",
    text: "Cut on privacy grounds. The cost to the fan outweighed what a live track would have bought the product.",
  },
  {
    id: "amr-prompts",
    status: "Rewrote",
    tone: "is-rewrote",
    title: "Judge prompts v1",
    text: "The first judge read emotion and context into photos and ruled too harshly. I rewrote it to weigh only what was visible for the specific claim.",
  },
  {
    status: "Rewrote",
    tone: "is-rewrote",
    title: "Neutral build → driver theming",
    text: "A generic green app with empty states. Rebuilt around a chosen driver, data-driven, so adding one is a data change.",
  },
  {
    status: "Shipped",
    tone: "is-shipped",
    title: "SHA-256 duplicate check",
    text: "Near-zero cost, stops casual reuse, and honest about its ceiling. Right trade for an MVP, wrong trade for production.",
  },
  {
    status: "Shipped",
    tone: "is-shipped",
    title: "Points ledger tied to verified actions",
    text: "Points are only ever minted by something that was checked. The economy never drifts from the evidence.",
  },
];

const MORE_PROJECTS = [
  {
    slug: "roadrunners",
    name: "RoadRunners",
    line: "Hackathon MVP — AI-guided learning journeys with XP, streaks and branching maps.",
    stack: ["TypeScript", "Next.js", "PostgreSQL"],
  },
  {
    slug: "lah",
    name: "LAH",
    line: "A terminal AI agent built around local models, streamed responses, tools and memory.",
    stack: ["TypeScript", "Python", "CLI"],
  },
  {
    slug: "model-shelf",
    name: "Model Shelf",
    line: "A local-first resolver for GGUF, MLX and safetensors models already on disk.",
    stack: ["Python", "Local AI"],
  },
  {
    slug: "vsms",
    name: "VSMS",
    line: "Tablet-first registration and queueing for community vision-screening events.",
    stack: ["React", "Express", "Supabase"],
  },
  {
    slug: "lumina",
    name: "Lumina",
    line: "A full-stack AI helpdesk with ticket workflows, assignment history and reporting.",
    stack: ["React", "Vite", "Express"],
  },
  {
    slug: "keel",
    name: "Keel",
    line: "A local-first Go task tracker with a Bubble Tea TUI and a Markdown ledger.",
    stack: ["Go", "TUI"],
  },
];

function FlagIcon() {
  const checks: Array<{ x: number; y: number }> = [];
  for (let row = 0; row < 6; row++) {
    for (let col = 0; col < 6; col++) {
      if ((row + col) % 2 === 0) checks.push({ x: 3 + col * 2, y: row * 2 });
    }
  }
  return (
    <svg
      className="amr-flag"
      viewBox="0 0 16 14"
      width="52"
      height="46"
      aria-hidden="true"
      focusable="false"
    >
      <g shapeRendering="crispEdges" fill="currentColor">
        <rect x="0" y="0" width="2" height="12" />
        <rect x="0" y="12" width="7" height="2" />
        {checks.map((cell) => (
          <rect key={`${cell.x}-${cell.y}`} x={cell.x} y={cell.y} width="2" height="2" />
        ))}
      </g>
    </svg>
  );
}

type WinPhoto = {
  src: string;
  width: number;
  height: number;
  alt: string;
  caption: string;
};

const WIN_PHOTOS: WinPhoto[] = [
  {
    src: "/images/amr/amr-team-pole-position.webp",
    width: 1600,
    height: 1200,
    alt: "The winning team receiving certificates with Pole Position on the screen behind them",
    caption: "Pole position — first place, with the certificates and prizes.",
  },
  {
    src: "/images/amr/amr-team-working.webp",
    width: 1200,
    height: 1600,
    alt: "Team members working on laptops around a table in the event room",
    caption: "Last-minute fixes before the presentation.",
  },
  {
    src: "/images/amr/amr-team-persona-pitch.webp",
    width: 1600,
    height: 1200,
    alt: "A presenter walking the judges through the pitch deck with the Freddy 35 persona slide on the big screen",
    caption:
      "Our deck on the big screen — the Freddy 35 persona we designed the whole app around.",
  },
  {
    src: "/images/amr/amr-team-app-demo.webp",
    width: 1600,
    height: 1199,
    alt: "The AMR Fan App home screen shown on the big display while the team presents to the judges",
    caption: "The app itself, live in front of the judges.",
  },
  {
    src: "/images/amr/amr-team-celebration.webp",
    width: 1200,
    height: 1600,
    alt: "The team posing with certificates of completion, AMR caps, prize boxes and tote bags",
    caption: "The team with the certificates, caps and prizes.",
  },
  {
    src: "/images/amr/amr-team-everyone.webp",
    width: 1600,
    height: 1200,
    alt: "Group photo of all the idea-thon teams, mentors and organisers",
    caption: "Everyone at the event — teams, mentors and organisers.",
  },
];

type ViewerItem = {
  src: string;
  width: number;
  height: number;
  alt: string;
  caption: string;
};

/* Screens shown in the Highlights strip. They open in the same viewer as the
   event photos, so every image on the page zooms the same way. */
const HIGHLIGHT_SHOTS: ViewerItem[] = [
  {
    src: "/images/amr/amr-home.webp",
    width: 720,
    height: 1566,
    alt: "Home screen: greeting, day streak and Green Points cards, quick actions and a Race IQ banner",
    caption:
      "Home — the day streak and Green Points lead, with the next action one thumb away.",
  },
  {
    src: "/images/amr/amr-driver-selection.webp",
    width: 720,
    height: 1566,
    alt: "Driver selection screen: 'On this team.' with Alonso and Stroll cards",
    caption:
      "Driver theming — pick a driver and the app re-skins to their colours and number.",
  },
  {
    src: "/images/amr/amr-cam-success.webp",
    width: 720,
    height: 1566,
    alt: "Verification result: 50 Sustainability Points, score 96 out of 100, confidence 98 percent and a written reason",
    caption:
      "Verified action — the AI returns a score, a confidence and its reason, then awards the points.",
  },
  {
    src: "/images/amr/amr-transport-modes.webp",
    width: 720,
    height: 1566,
    alt: "Route planner comparing train, walk, cycle and car with CO2e estimates",
    caption:
      "Travel planning — train, walk, cycle and car compared against your own transport.",
  },
  {
    src: "/images/amr/amr-impact.webp",
    width: 720,
    height: 1566,
    alt: "Impact dashboard: your travel beside all fans and the team's official footprint",
    caption:
      "Impact report — your savings against the whole fanbase and the team's official footprint.",
  },
];

const VIEWER: ViewerItem[] = [...WIN_PHOTOS, ...HIGHLIGHT_SHOTS];

/** The one image viewer for the whole page. A native dialog, so it sits in the
    browser's top layer above every section, gets a real backdrop to blur, traps
    focus, and closes on Escape for free. */
function Lightbox({
  index,
  onClose,
  onStep,
}: {
  index: number | null;
  onClose: () => void;
  onStep: (direction: 1 | -1) => void;
}) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const open = index !== null;
  const count = VIEWER.length;
  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;
    if (open && !dialog.open) dialog.showModal();
    else if (!open && dialog.open) dialog.close();
  }, [open]);
  const item = index === null ? VIEWER[0] : VIEWER[index];
  return (
    <dialog
      ref={dialogRef}
      className="amr-lightbox"
      aria-label={index === null ? "Photo viewer" : `Image ${index + 1} of ${count}`}
      onClose={onClose}
      onClick={(event) => {
        if (event.target === event.currentTarget) onClose();
      }}
    >
      {open && index !== null ? (
        <>
          <button
            type="button"
            className="amr-lightbox-close"
            onClick={onClose}
            aria-label="Close image viewer"
          >
            &#10005;
          </button>
          <button
            type="button"
            className="amr-lightbox-nav amr-lightbox-prev"
            onClick={() => onStep(-1)}
            aria-label="Previous image"
          >
            &#8249;
          </button>
          <figure className="amr-lightbox-figure">
            <img
              src={item.src}
              alt={item.alt}
              width={item.width}
              height={item.height}
            />
            <figcaption>
              {index + 1} / {count} — {item.caption}
            </figcaption>
          </figure>
          <button
            type="button"
            className="amr-lightbox-nav amr-lightbox-next"
            onClick={() => onStep(1)}
            aria-label="Next image"
          >
            &#8250;
          </button>
        </>
      ) : null}
    </dialog>
  );
}

function PhotoCarousel({
  onExpand,
}: {
  onExpand: (index: number, opener?: HTMLElement | null) => void;
}) {
  const trackRef = useRef<HTMLDivElement>(null);
  const [index, setIndex] = useState(0);
  const count = WIN_PHOTOS.length;
  const slideTo = (next: number) => {
    const track = trackRef.current;
    if (!track) return;
    const clamped = Math.min(count - 1, Math.max(0, next));
    const slide = track.querySelector<HTMLElement>("[data-slide]");
    const step = slide ? slide.offsetWidth + 16 : track.clientWidth;
    const reduce = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    track.scrollTo({
      left: clamped * step,
      behavior: reduce ? "auto" : "smooth",
    });
  };
  const onScroll = () => {
    const track = trackRef.current;
    if (!track) return;
    const slide = track.querySelector<HTMLElement>("[data-slide]");
    const step = slide ? slide.offsetWidth + 16 : track.clientWidth || 1;
    const next = Math.min(
      count - 1,
      Math.max(0, Math.round(track.scrollLeft / step)),
    );
    setIndex((prev) => (prev === next ? prev : next));
  };
  return (
    <figure className="amr-photos" data-reveal>
      <div className="amr-photos-head">
        <span className="amr-photos-kicker">Snaps from the event</span>
        <div className="amr-photos-nav">
          <button
            type="button"
            className="amr-photos-btn"
            onClick={() => slideTo(index - 1)}
            disabled={index === 0}
            aria-label="Previous photo"
          >
            &#8249;
          </button>
          <span className="amr-photos-count" aria-live="polite">
            {index + 1} / {count}
          </span>
          <button
            type="button"
            className="amr-photos-btn"
            onClick={() => slideTo(index + 1)}
            disabled={index === count - 1}
            aria-label="Next photo"
          >
            &#8250;
          </button>
        </div>
      </div>
      <div
        ref={trackRef}
        className="amr-photo-track"
        onScroll={onScroll}
        role="group"
        aria-roledescription="carousel"
        aria-label="Photos from the event"
      >
        {WIN_PHOTOS.map((photo, i) => (
          <div
            key={photo.src}
            data-slide
            className="amr-photo"
            role="group"
            aria-roledescription="slide"
            aria-label={`${i + 1} of ${count}`}
          >
            <button
              type="button"
              className="amr-photo-expand"
              onClick={(event) => onExpand(i, event.currentTarget)}
              aria-label={`Expand photo ${i + 1} of ${count}: ${photo.caption}`}
            >
              <img
                src={photo.src}
                alt={photo.alt}
                width={photo.width}
                height={photo.height}
                loading="lazy"
                decoding="async"
              />
            </button>
            <p className="amr-photo-cap">{photo.caption}</p>
          </div>
        ))}
      </div>
    </figure>
  );
}

function DemoVideo() {
  const [playing, setPlaying] = useState(false);
  return (
    <figure className="amr-demo" data-reveal>
      {playing ? (
        <iframe
          src={`https://www.youtube-nocookie.com/embed/${DEMO_ID}?autoplay=1&rel=0`}
          title="AMR Fan App demo video"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
        />
      ) : (
        <button
          type="button"
          className="amr-demo-facade"
          onClick={() => setPlaying(true)}
          aria-label="Play the demo video"
        >
          <img
            src={`https://i.ytimg.com/vi/${DEMO_ID}/maxresdefault.jpg`}
            onError={(event) => {
              const image = event.currentTarget;
              if (!image.src.endsWith("/hqdefault.jpg")) {
                image.src = `https://i.ytimg.com/vi/${DEMO_ID}/hqdefault.jpg`;
              }
            }}
            alt=""
            width="1280"
            height="720"
            loading="lazy"
          />
          <span className="amr-play" aria-hidden="true">
            <svg viewBox="0 0 24 24" width="22" height="22" aria-hidden="true">
              <path d="M8 5.5v13l11-6.5z" fill="currentColor" />
            </svg>
          </span>
        </button>
      )}
      <figcaption>
        Demo — the working MVP on YouTube.{" "}
        <a href={DEMO_URL} target="_blank" rel="noopener noreferrer">
          Watch on YouTube <Arrow diagonal />
        </a>
      </figcaption>
    </figure>
  );
}

/** A hand-written margin annotation: ink-blue Caveat, a slight tilt, and a
    drawn arrow reaching back into the paragraph it comments on. Sits inline
    with the paragraph on narrow screens. */
function Note({
  text,
  href,
  label,
}: {
  text: string;
  href?: string;
  label?: string;
}) {
  return (
    <aside className="amr-note" data-reveal>
      {href ? (
        <a className="amr-note-link" href={href} target="_blank" rel="noopener noreferrer">
          {label ?? "Open"} <Arrow diagonal />
        </a>
      ) : null}
      <span className="amr-note-text">{text}</span>
    </aside>
  );
}

/** A labelled code panel with a title bar, so it reads as a code block. */
function CodeBlock({ label, children }: { label: string; children: string }) {
  return (
    <figure className="amr-code" data-reveal>
      <figcaption className="amr-code-bar">
        <span className="amr-code-icon" aria-hidden="true">
          <svg viewBox="0 0 24 24" width="13" height="13">
            <path
              d="m9 8-5 4 5 4M15 8l5 4-5 4"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.7"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </span>
        {label}
      </figcaption>
      <pre>{children}</pre>
    </figure>
  );
}

/** One level of the tree. Children stay closed until their chapter is the one
    the reader is actually in, measured from the centre of the viewport, and
    collapse again the moment that chapter is left. */
function TreeLevel({
  branches,
  depth,
  activeHeading,
}: {
  branches: TreeBranch[];
  depth: number;
  activeHeading: string;
}) {
  return (
    <>
      {branches.map((branch) => {
        const open = containsHeading(branch, activeHeading);
        return (
          <div key={branch.id} className="amr-tree-item">
            <a
              href={`#${branch.id}`}
              className={`amr-tree-link${branch.children ? " is-branch" : ""}`}
              style={{ paddingLeft: depth * 9 }}
              aria-current={activeHeading === branch.id ? "location" : undefined}
              aria-expanded={branch.children ? open : undefined}
            >
              <span className="amr-marker" aria-hidden="true">└</span>
              {branch.label}
            </a>
            {branch.children && (
              <div
                className={`amr-children${open ? " is-open" : ""}`}
                aria-hidden={open ? undefined : true}
              >
                <div className="amr-children-clip">
                  <TreeLevel
                    branches={branch.children}
                    depth={depth + 1}
                    activeHeading={activeHeading}
                  />
                </div>
              </div>
            )}
          </div>
        );
      })}
    </>
  );
}

export default function AMRFanApp() {
  const scope = usePageMotion("amr-fan-app");
  const bodyRef = useRef<HTMLDivElement>(null);
  const [activeHeading, setActiveHeading] = useState(SECTION_IDS[0]);
  const [progress, setProgress] = useState(0);
  const [pastHero, setPastHero] = useState(false);
  const [showTreeTitle, setShowTreeTitle] = useState(false);
  const [viewer, setViewer] = useState<number | null>(null);
  const viewerOpener = useRef<HTMLElement | null>(null);
  const openViewer = useCallback(
    (index: number, opener?: HTMLElement | null) => {
      viewerOpener.current = opener ?? null;
      setViewer(index);
    },
    [],
  );
  const closeViewer = useCallback(() => setViewer(null), []);
  const stepViewer = useCallback((direction: 1 | -1) => {
    setViewer((current) =>
      current === null
        ? current
        : (current + direction + VIEWER.length) % VIEWER.length,
    );
  }, []);
  // Once the dialog has actually closed, hand focus back to whatever opened it.
  useEffect(() => {
    if (viewer !== null) return;
    const opener = viewerOpener.current;
    if (!opener) return;
    viewerOpener.current = null;
    const frame = requestAnimationFrame(() => opener.focus());
    return () => cancelAnimationFrame(frame);
  }, [viewer]);

  useEffect(() => {
    const body = bodyRef.current;
    if (!body) return;
    let frame = 0;
    const measure = () => {
      frame = 0;
      const hero = document.querySelector(".amr-hero");
      const heroBottom = hero ? hero.getBoundingClientRect().bottom : 0;
      setPastHero(heroBottom < 96);
      const heroTitle = hero ? hero.querySelector("h1") : null;
      const titleGone = heroTitle
        ? heroTitle.getBoundingClientRect().bottom < 0
        : true;
      setShowTreeTitle(titleGone);
      const rect = body.getBoundingClientRect();
      // Progress from the true painted extent of the article: the last
      // section's bottom edge, measured live, so the number can't be thrown
      // off by box-sizing quirks or late-loading media.
      const docTop = rect.top + window.scrollY;
      const sections = body.querySelectorAll("section");
      const endEl = sections.length ? sections[sections.length - 1] : body;
      const endDoc = endEl.getBoundingClientRect().bottom + window.scrollY;
      const total = Math.max(endDoc - docTop - window.innerHeight, 1);
      const scrolled = Math.min(Math.max(window.scrollY - docTop, 0), total);
      setProgress(Math.round((scrolled / total) * 100));
      const tops = ALL_HEADINGS.flatMap((heading) => {
        const element = document.getElementById(heading.id);
        return element ? [{ id: element.id, top: element.getBoundingClientRect().top }] : [];
      });
      // The hotspot is the centre of the screen: whatever the reader is
      // looking at is what the tree marks, not whatever sat under the top edge
      // earlier in the page. Tops are sorted because the Overview facts band
      // sits above the first chapter while its ids come later in the tree.
      setActiveHeading(currentSection(tops, window.innerHeight * 0.42));
    };
    const schedule = () => {
      if (!frame) frame = requestAnimationFrame(measure);
    };
    measure();
    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", schedule);
    const observer = new ResizeObserver(schedule);
    observer.observe(body);
    return () => {
      cancelAnimationFrame(frame);
      observer.disconnect();
      window.removeEventListener("scroll", schedule);
      window.removeEventListener("resize", schedule);
    };
  }, []);

  return (
    <article
      ref={scope}
      className={`amr-page${pastHero ? " is-past-hero" : ""}`}
    >
      <header className="amr-hero">
        <div className="shell">
          <Link className="back-link" to="/projects">
            <span aria-hidden="true">←</span> All projects
          </Link>
          <FlagIcon />
          <span className="amr-tag">Native apps</span>
          <h1 tabIndex={-1}>AMR Fan App</h1>
          <p className="amr-dek">
            Turning Aston Martin Aramco&rsquo;s Make A Mark sustainability work
            into something fans actually do: a green travel calculator and a
            curated fan experience around it, built in a hackathon.
          </p>
          <dl className="amr-meta">
            <div>
              <dt>Author</dt>
              <dd>Nachiketh Reddy</dd>
            </div>
            <div>
              <dt>Published</dt>
              <dd>11 Oct 2026</dd>
            </div>
            <div>
              <dt>Reading time</dt>
              <dd>3 min read + 3:30 demo</dd>
            </div>
          </dl>
        </div>
      </header>

      {/* Overview facts: one grouped strip above the article, separate from
          the chapters — at a glance, what I owned, the team. No rule on top.
          */}
      <div className="amr-facts-band" data-reveal>
        <section className="amr-facts-col" id="amr-glance">
          <h2 className="amr-facts-title">At a glance</h2>
          <dl className="amr-glance">
            <div>
              <dt>Context</dt>
              <dd>
                Cognizant &times; Aston Martin Formula 1 Gen-AI idea-thon, Make
                A Mark challenge
              </dd>
            </div>
            <div>
              <dt>AI spend</dt>
              <dd>$0.065 of model API calls</dd>
            </div>
            <div>
              <dt>Status</dt>
              <dd>
                Working prototype, presented to evaluators — hackathon MVP, not
                production
              </dd>
            </div>
            <div>
              <dt>Timeline</dt>
              <dd>15 Sep – 8 Oct 2026</dd>
            </div>
          </dl>
        </section>
        <section className="amr-facts-col" id="amr-role">
          <h2 className="amr-facts-title">What I owned</h2>
          <ul className="amr-owned">
            <li>
              The iOS app in Swift — navigation, camera flow, driver theming,
              points UI, impact report
            </li>
            <li>Travel emissions logic + Google Maps routing</li>
            <li>
              The AI verification pipeline — photo → SHA-256 duplicate check →
              Luna + Jev judge prompt → verdict + points
            </li>
            <li>Judge prompt rewrites, when v1 ruled too harshly</li>
            <li>
              The decision to drop React Native, and the Kotlin port that
              followed
            </li>
          </ul>
        </section>
        <section className="amr-facts-col" id="amr-team">
          <h2 className="amr-facts-title">The team</h2>
          <ul className="amr-team">
            <li>
              <a
                href={LINKEDIN.nachiketh}
                target="_blank"
                rel="noopener noreferrer"
              >
                <strong>Nachiketh Reddy</strong>
              </a>{" "}
              (iOS Developer and Presentation Lead)
            </li>
            <li>
              <a
                href={LINKEDIN.joseph}
                target="_blank"
                rel="noopener noreferrer"
              >
                <strong>Joseph P K</strong>
              </a>{" "}
              (Cognizant team mentor)
            </li>
            <li>
              <a
                href={LINKEDIN.aleisya}
                target="_blank"
                rel="noopener noreferrer"
              >
                <strong>Aleisya Fuad</strong>
              </a>{" "}
              (Cognizant team mentor)
            </li>
            <li>
              <a
                href={LINKEDIN.anirudh}
                target="_blank"
                rel="noopener noreferrer"
              >
                <strong>Anirudh Kumar</strong>
              </a>{" "}
              (Cloud Developer and Android Vibe Coder)
            </li>
            <li>
              <a
                href={LINKEDIN.briana}
                target="_blank"
                rel="noopener noreferrer"
              >
                <strong>Briana Kong</strong>
              </a>
            </li>
            <li>
              <a
                href={LINKEDIN.dylan}
                target="_blank"
                rel="noopener noreferrer"
              >
                <strong>Dylan Tsai</strong>
              </a>
            </li>
            <li>
              <a
                href={LINKEDIN.darius}
                target="_blank"
                rel="noopener noreferrer"
              >
                <strong>Kaung Nyi (Darius) Hein</strong>
              </a>
            </li>
            <li>
              <a
                href={LINKEDIN.sachita}
                target="_blank"
                rel="noopener noreferrer"
              >
                <strong>Sachita Thasil</strong>
              </a>
            </li>
          </ul>
        </section>
      </div>
      <div className="amr-layout">
        <aside className="amr-tree">
          <div className="amr-tree-sticky">
            <p
              className={`amr-tree-title${showTreeTitle ? " is-visible" : ""}`}
              aria-hidden={showTreeTitle ? undefined : true}
            >
              AMR Fan App
            </p>
            <p className="amr-tree-label" id="amr-tree-label">
              Tree
            </p>
            <nav aria-labelledby="amr-tree-label">
              {SECTIONS.map((section) => (
                <TreeLevel
                  key={section.id}
                  branches={[section]}
                  depth={0}
                  activeHeading={activeHeading}
                />
              ))}
            </nav>
            <div className="amr-progress" aria-hidden="true">
              <span className="amr-progress-track">
                <span style={{ width: `${progress}%` }} />
              </span>
              <span className="amr-progress-num">
                {String(progress).padStart(2, "0")}%
              </span>
            </div>
            <p className="amr-hint" aria-hidden="true">
              Press ↑ / ↓ to scroll
            </p>
            <div className="amr-tree-spacer" aria-hidden="true" />
            <div className="amr-tree-links">
              <p className="amr-tree-label">Links</p>
              <a href={REPO_URL} target="_blank" rel="noopener noreferrer">
                <span className="amr-marker" aria-hidden="true">
                  └
                </span>
                <span className="amr-link-icon" aria-hidden="true">
                  <SocialIcon kind="github" />
                </span>
                Source
                <Arrow diagonal />
              </a>
              <a href={DEMO_URL} target="_blank" rel="noopener noreferrer">
                <span className="amr-marker" aria-hidden="true">
                  └
                </span>
                <span className="amr-link-icon is-play" aria-hidden="true">
                  <svg viewBox="0 0 24 24">
                    <path d="M8 5.5v13l11-6.5z" fill="currentColor" />
                  </svg>
                </span>
                Demo
                <Arrow diagonal />
              </a>
            </div>
          </div>
        </aside>

        <div className="amr-body" ref={bodyRef}>
          <section id="amr-overview" data-reveal>
            <h2>Overview</h2>
            <p className="amr-lede">
              Recently, I got the opportunity to participate in the Cognizant
              &times; Aston Martin Aramco Gen-AI idea-thon, representing
              Singapore Polytechnic — and we won first place! 🏆🎉 In this case
              study, I&rsquo;ll break down how it came together, how I carried
              my team through the iOS build of the fan app that turns
              sustainability reporting into something fans actually do — plan a
              greener route, prove an action with a photo, earn points, and
              spend them on rewards.
            </p>
            <p>
              This project wasn&rsquo;t cheap to build, either: the development
              process alone took over $10,000 of model usage — GPT-6 Astra,
              GPT-6 Sol, GPT-6.1 Sol, GPT-6 Luna, DeepSeek v4.1 Flash and Muse
              Spark 1.3. I&rsquo;ve made a bunch of mistakes using these models
              for development, and in the past two weeks I&rsquo;ve changed a
              lot about how I work with AI agents — in a good way.
            </p>
            <p className="amr-read-links">
              During the read, if this interests you —{" "}
              <a href={REPO_URL} target="_blank" rel="noopener noreferrer">
                read the code
              </a>{" "}
              or{" "}
              <a href={DEMO_URL} target="_blank" rel="noopener noreferrer">
                watch the demo
              </a>
              .
            </p>
            <p>
              We came up with a solid Minimum Viable Product (MVP) that
              presented the app&rsquo;s true intention and complete purpose —
              business logic included — and while getting there cost real model
              money, the final build itself was kept as lean as possible: $0.065
              of model API calls for the entire week. Throughout this case study
              you&rsquo;ll follow our thought process the same way it happened —
              deciphering the problem statement, iterating through our different
              versions, and how each feature became what it is in the final
              build.
            </p>
            <PhotoCarousel onExpand={openViewer} />
            <p>
              Right here is a full video demo of the entire app in action. This
              app was not meant to be pretty first — it was meant to highlight
              the functionality, so it is not as polished as one would hope. But
              it is a MVP.
            </p>
            <DemoVideo />
            <div className="amr-highlights-wrap">
              <h3 className="amr-boxlabel">Highlights</h3>
              <div className="amr-highlights">
                <button
                  type="button"
                  className="amr-highlight"
                  onClick={(event) =>
                    openViewer(WIN_PHOTOS.length + 0, event.currentTarget)
                  }
                >
                  <img
                    src="/images/amr/amr-home.webp"
                    alt="Home screen: greeting, day streak and Green Points cards, quick actions and a Race IQ banner"
                    width="720"
                    height="1566"
                    loading="lazy"
                    decoding="async"
                  />
                  <span className="amr-highlight-label">Home</span>
                </button>
                <button
                  type="button"
                  className="amr-highlight"
                  onClick={(event) =>
                    openViewer(WIN_PHOTOS.length + 1, event.currentTarget)
                  }
                >
                  <img
                    src="/images/amr/amr-driver-selection.webp"
                    alt="Driver selection screen: 'On this team.' with Alonso and Stroll cards"
                    width="720"
                    height="1566"
                    loading="lazy"
                    decoding="async"
                  />
                  <span className="amr-highlight-label">Driver theming</span>
                </button>
                <button
                  type="button"
                  className="amr-highlight"
                  onClick={(event) =>
                    openViewer(WIN_PHOTOS.length + 2, event.currentTarget)
                  }
                >
                  <img
                    src="/images/amr/amr-cam-success.webp"
                    alt="Verification result: 50 Sustainability Points, score 96 out of 100, confidence 98 percent and a written reason"
                    width="720"
                    height="1566"
                    loading="lazy"
                    decoding="async"
                  />
                  <span className="amr-highlight-label">Verified action</span>
                </button>
                <button
                  type="button"
                  className="amr-highlight"
                  onClick={(event) =>
                    openViewer(WIN_PHOTOS.length + 3, event.currentTarget)
                  }
                >
                  <img
                    src="/images/amr/amr-transport-modes.webp"
                    alt="Route planner comparing train, walk, cycle and car with CO₂e estimates"
                    width="720"
                    height="1566"
                    loading="lazy"
                    decoding="async"
                  />
                  <span className="amr-highlight-label">Travel planning</span>
                </button>
                <button
                  type="button"
                  className="amr-highlight"
                  onClick={(event) =>
                    openViewer(WIN_PHOTOS.length + 4, event.currentTarget)
                  }
                >
                  <img
                    src="/images/amr/amr-impact.webp"
                    alt="Impact dashboard: your travel beside all fans and the team's official footprint"
                    width="720"
                    height="1566"
                    loading="lazy"
                    decoding="async"
                  />
                  <span className="amr-highlight-label">Impact report</span>
                </button>
              </div>
            </div>
          </section>

          <section id="amr-problem" data-reveal>
            <h2>The problem statement</h2>
            <blockquote className="amr-brief" cite={MAKE_A_MARK_URL}>
              <p>
                &ldquo;How can AI transform Aston Martin Aramco&rsquo;s
                sustainability, inclusion and community data into a trusted,
                real-time view of impact — and how can those insights be
                delivered in creative, engaging ways that make sustainability
                more tangible and relevant to Formula One audiences?&rdquo;
              </p>
              <Note
                text="This is the real programme the app had to serve — not a marketing brief, an annual report with numbers in it."
                href={MAKE_A_MARK_URL}
                label="Make A Mark"
              />
            </blockquote>
            <p>
              The problem statement breaks down into two parts. First, take
              Aston Martin&rsquo;s sustainability data and turn it into
              something trustworthy and current. Second, deliver it in a way
              that reaches people who would never go looking for it.
            </p>
            <p>
              The second part is where the actual problem is. Nobody opens an
              app to read a sustainability report, so the report can&rsquo;t be
              the reason a fan opens it. The app has to be entertaining first —
              something a fan wants to open, and wants to come back to the next
              day — while still saying everything the report was meant to say.
              That left us with one question: where does a fan&rsquo;s own
              behaviour actually touch the team&rsquo;s footprint — and can you
              show them that on a phone, on an ordinary day?
            </p>
            <h3 id="amr-fan">Who we built for</h3>
            <p>
              We curated the entire app around a single person — our target
              persona, Freddy, 35. The age was deliberate, not a guess: 35 is
              the average age of an Aston Martin fan, which puts Freddy in the
              middle of the audience we actually had to convince. Every feature
              argument had a referee.
            </p>
            <div className="amr-persona">
              <div className="amr-persona-head">
                <h4 className="amr-persona-tag">Freddy, 35</h4>
                <span className="amr-persona-note">built around him</span>
              </div>
              <p className="amr-persona-line">
                He follows the team daily and drives past the circuit regularly,
                but has no way to see whether greener choices make a difference
                — and he can&rsquo;t read an ESG report.
              </p>
              <div className="amr-persona-needs">
                <p className="amr-owned-label">Needs</p>
                <ul>
                  <li>A fast, honest comparison of his travel options</li>
                  <li>
                    Proof his choices count, next to the team&rsquo;s numbers
                  </li>
                  <li>The ESG report translated into something he can read</li>
                </ul>
              </div>
            </div>
            <p>
              The idea behind him was simple. Make something engaging, and make
              it translated — a fan has to want to open this, and then be able
              to read what&rsquo;s inside it.
            </p>
            <p>
              If a feature didn&rsquo;t serve one of those three needs, it
              didn&rsquo;t make the build. That rule killed more ideas than the
              deadline did.
            </p>
          </section>

          <section id="amr-decoding" data-reveal>
            <h2>Decoding the brief</h2>
            <p>
              Before anything else, we broke the brief apart out loud — a long,
              messy session where we said every obvious answer and then argued
              it down.
            </p>
            <h3 id="amr-problems">The problems</h3>
            <div className="amr-note-beside">
              <p>
                Before we designed anything, we tried reading the thing we were
                meant to translate. Aston Martin&rsquo;s ESG report is a
                genuinely technical document, and it isn&rsquo;t written for a
                fan. We work with technical documentation and still had to read
                it about five times to take in even a fifth of it. A regular
                person won&rsquo;t spend that time on something that never
                promised them anything back.
              </p>
              <Note
                text="The 2025 edition we worked from."
                href={ESG_REPORT_URL}
                label="Make A Mark ESG report"
              />
            </div>
            <ol className="amr-problems">
              {PROBLEMS.map((problem) => (
                <li key={problem.num}>
                  <span className="amr-problem-num">{problem.num}</span>
                  <div>
                    <strong>{problem.title}</strong>
                    <p>{problem.text}</p>
                  </div>
                </li>
              ))}
            </ol>
            <p>
              So the answer couldn&rsquo;t be a prettier report. That is where
              the dashboard idea came from — keep the report&rsquo;s numbers,
              throw away its format — and those four problems are what it had to
              answer: readability, a line for the fan, a trip they can actually
              change, and a reason to come back.
            </p>
            <h3 id="amr-tension">Two jobs, one app</h3>
            <p>
              Make the Environment report readable — short, simple, neatly
              organised, not a PDF with a hero image on top. And give fans
              something worth returning to, because nobody contributes to a
              sustainability effort they don&rsquo;t know they&rsquo;re part of.
            </p>
            <p>
              Those two pull against each other. Push engagement too hard —
              points, streaks, rewards — and you lose credibility. Push
              credibility too hard — charts, citations, caveats — and nobody
              opens it twice. Every decision in the build is a vote on that
              tension. Our Mentors said:
            </p>
            <aside className="amr-callout" data-reveal>
              <p>
                Don&rsquo;t build a sustainability app with F1 stickers on it.
                Build a fan app where sustainable behaviour happens to earn you
                something. Build an experience for fans to give them a reason to
                keep coming back to the app.
              </p>
            </aside>
            <p>
              One scope call came early. The brief spans all of ESG —
              environment, social and governance — and we couldn&rsquo;t do all
              of it justice, so we didn&rsquo;t pretend to. We took the
              environment pillar and went deep, because it&rsquo;s the one a
              fan&rsquo;s own behaviour can already move: the journey, the
              choices, the footprint. Social and governance stayed on the deck
              as future scope.
            </p>
          </section>

          <section id="amr-ideas" data-reveal>
            <h2>The ideas</h2>
            <p>
              We whiteboarded it and threw more at the wall than we kept. The
              point of writing them all down is that the ones we killed had
              reasons, and those reasons are the interesting part.
            </p>
            <div className="amr-board">
              {IDEA_BOARD.map((idea, index) => (
                <div
                  key={idea.note}
                  className={`amr-postit is-${idea.state}`}
                  style={{
                    ["--tilt" as string]: `${POSTCARD_TILTS[index % POSTCARD_TILTS.length]}deg`,
                    ["--tape" as string]: `${index % 2 ? 3 : -5}deg`,
                  }}
                >
                  <span className="amr-postit-state">{idea.state}</span>
                  <strong>{idea.note}</strong>
                  <p>{idea.text}</p>
                </div>
              ))}
            </div>
            <h3 id="amr-kept">What we kept</h3>
            <p>
              Initially, we decided to build the entire MVP around the green
              travel calculator and design a curated experience around it. The
              main part is the calculation of the carbon dioxide emissions. All
              the fan has to do is what they already know how to do: search the
              two locations they want to travel between, pick the mode of
              transport, and the app gives back the time, the route, and how
              much carbon dioxide each option produces. We took the averages
              and baked them into the calculator.
            </p>
            <p>
              Transport only covers the trip, though. Everything else a fan
              does in a day needed its own way in, and a typed claim is worth
              nothing without proof — so the second feature became the
              sustainability camera: photograph the action, let a model judge
              what it can actually see, get points.
            </p>
            <p>
              Then came the question the calculator couldn&rsquo;t answer: so
              what? Grams of carbon dioxide mean nothing to a fan. The third
              feature, the impact dashboard, sets your savings against
              something you can picture — laps of Marina Bay — next to the
              team&rsquo;s official numbers.
            </p>
            <p>
              And around all of it, the curated fan experience — the layer that
              brings people back: driver theming, challenges, rewards, the
              daily streak, the quiz. Theming arrived embarrassingly late and
              turned out to be the reason the app felt like a fan app instead
              of a utility.
            </p>
            <figure className="amr-kept-fig" data-reveal>
              <div className="amr-kept-shots">
                <figure>
                  <img
                    src="/images/amr/amr-transport-modes.webp"
                    alt="Travel calculator: transport modes with emissions compared for the same journey"
                    width="720"
                    height="1566"
                    loading="lazy"
                    decoding="async"
                  />
                  <figcaption>Travel calculator</figcaption>
                </figure>
                <figure>
                  <img
                    src="/images/amr/amr-cam-success.webp"
                    alt="Sustainability camera: a verified action scoring 96 and paying out 50 points"
                    width="720"
                    height="1566"
                    loading="lazy"
                    decoding="async"
                  />
                  <figcaption>Sustainability camera</figcaption>
                </figure>
                <figure>
                  <img
                    src="/images/amr/amr-impact.webp"
                    alt="Impact dashboard: personal savings measured against a real circuit"
                    width="720"
                    height="1566"
                    loading="lazy"
                    decoding="async"
                  />
                  <figcaption>Impact dashboard</figcaption>
                </figure>
                <figure>
                  <img
                    src="/images/amr/amr-driver-selection.webp"
                    alt="Driver theming: the On this team screen with Alonso and Stroll cards"
                    width="720"
                    height="1566"
                    loading="lazy"
                    decoding="async"
                  />
                  <figcaption>Driver theming</figcaption>
                </figure>
              </div>
              <figcaption className="amr-kept-cap">
                Screens from the MVP — the four features that made the cut.
              </figcaption>
            </figure>
            <p>
              Everything else stayed on the slide deck as future scope, and some
              of it — the community feed, leaderboards, hotel booking — stayed
              there permanently.
            </p>
          </section>

          <section id="amr-react" data-reveal>
            <h2>v1: React Native</h2>
            <p>
              The original platform plan was React Native. One codebase, both
              stores, no rebuilding the same screen twice — and for a student
              team with no native experience that was a sensible bet, not a lazy
              one. I set up the repository, the branches, and the first build.
            </p>
            <h3 id="amr-react-wrong">Why we dropped it</h3>
            <p>
              It wasn&rsquo;t one thing going wrong, it was a pile of them, and
              none of them were about cost.
            </p>
            <ul className="amr-owned">
              <li>
                <strong>It wasn&rsquo;t designing well.</strong> Even with the
                strongest model we had access to at the time, the output didn
                &ldquo; get it&rdquo; — layouts looked like a website pretending
                to be an app.
              </li>
              <li>
                <strong>Things broke on one side or the other.</strong> A lot of
                the build behaved on iOS and quietly failed on Android, or the
                reverse. Cross-platform stopped being a feature and became a
                second debugging surface.
              </li>
              <li>
                <strong>Functionality didn&rsquo;t translate.</strong> Sensors,
                camera behaviour and gestures — the exact parts the
                sustainability camera needed — were where it fell apart.
              </li>
              <li>
                <strong>The codebase got too big for us to hold.</strong> As it
                grew, the AI started going rogue: drifting intent, changing
                things nobody asked it to change, and losing track of what it
                had already done.
              </li>
            </ul>
            <p>
              The one genuine win was Expo — real sensor access and fast phone
              tooling. It just stopped being worth what it cost us.
            </p>
            <aside className="amr-callout" data-reveal>
              <p>
                At some point I decided to rewrite the whole thing in Swift — a
                language I&rsquo;d learned properly through the{" "}
                <a
                  href={ADS_IG_URL || undefined}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="amr-underline"
                >
                  Apple Developer Society
                </a>
                . Not because React Native is bad, but because I could hold a
                native codebase in my head and I could not hold that one.
              </p>
            </aside>
          </section>

          <section id="amr-swift" data-reveal>
            <h2>Rewriting it in Swift</h2>
            <p>
              I wrote it myself, in Swift, with an AI-assisted workflow
              I&rsquo;d been refining for six months. Not vibe-coding — plans
              and specs first, generated second, and then I read, ran and tested
              everything it produced. That loop is what let me learn camera
              permission flows, state management under a live theme, and how to
              talk to a backend without shipping a security hole alongside it.
            </p>
            <h3 id="amr-society">Where the Swift came from</h3>
            <p>
              Before this, Swift was a club thing. As president of the Apple
              Developer Society at Singapore Polytechnic I&rsquo;d taught pieces
              of it and built small demos, but I&rsquo;d never shipped a full
              app with a backend and an AI pipeline hanging off it. This was the
              first time the knowledge had to survive contact with real camera
              permissions, real network failures and a demo that could not
              crash.
            </p>
            <h3 id="amr-modular">Built to be swapped out</h3>
            <p>
              Once I started writing features, the thing that mattered most
              became obvious: the app should never lock you into its features.
              Modularity by design — every feature a self-contained module on a
              shared backend, so you can swap one in or out without rethinking
              the app around it.
            </p>
            <p>
              That decision came straight out of the refocus. We were told, flat
              out, that the scope was too big, and the answer was not to write
              smaller features — it was to write features that could be removed
              on a Tuesday without breaking anything else. Killing a module had
              to cost an hour, not a weekend.
            </p>
            <figure className="amr-fig" data-reveal>
              <div className="amr-fig-frames is-pair">
                <img
                  src="/images/amr/amr-home.webp"
                  alt="Home screen: greeting, day streak and Green Points cards, quick actions and a Race IQ banner"
                  width="720"
                  height="1566"
                  loading="lazy"
                  decoding="async"
                />
                <img
                  src="/images/amr/amr-accounts-alonso.webp"
                  alt="Account screen themed with the chosen driver, showing earned points, day streak and Green Points"
                  width="720"
                  height="1565"
                  loading="lazy"
                  decoding="async"
                />
              </div>
              <figcaption>
                <span className="amr-fig-num">Fig 01</span>
                The Swift build, late in the project — home surface and the
                driver-themed account, both swapping on the same module set.
              </figcaption>
            </figure>
          </section>

          <section id="amr-design" data-reveal>
            <h2>Designing the look</h2>
            <p>
              The first Swift build worked and looked like nothing: a blank
              page, no styling, no point of view. I opened Figma to work around
              it and find a UI that actually suited the app, and built an Aston
              Martin design language for it — a liquid-glass treatment with the
              team&rsquo;s aesthetic running through the whole surface.
            </p>
            <p>
              It was better and still wrong. Something was missing: too blank,
              too dark, a shell waiting for a reason to exist. So I took it one
              step further and went looking for what a fan already had an
              attachment to.
            </p>
            <h3 id="amr-driver-hook">Driver numbers</h3>
            <p>
              Drivers have numbers, and a fan&rsquo;s driver is the one thing
              they already love about this team. That number became the
              app&rsquo;s spine: pick Alonso or Stroll and the entire interface
              restyles around them — colour, imagery, and a giant number on the
              home screen that reads from across a room.
            </p>
            <figure className="amr-fig" data-reveal>
              <div className="amr-fig-frames is-pair">
                <img
                  src="/images/amr/amr-driver-selection.webp"
                  alt="Driver selection screen: 'On this team.' with Alonso and Stroll cards"
                  width="720"
                  height="1566"
                  loading="lazy"
                  decoding="async"
                />
                <img
                  src="/images/amr/amr-home.webp"
                  alt="Home screen: greeting, day streak and Green Points cards, quick actions and a Race IQ banner"
                  width="720"
                  height="1566"
                  loading="lazy"
                  decoding="async"
                />
              </div>
              <figcaption>
                <span className="amr-fig-num">Fig 02</span>
                Pick your driver, get their app. The number is the aesthetic —
                before and after theming, same modules underneath.
              </figcaption>
            </figure>
            <p>
              Every driver image in the app is public-source. There was no
              licensed F1 asset kit, which is exactly why the theming had to be
              data-driven: adding a driver is a data change, not a code change.
            </p>
          </section>

          <section id="amr-features" data-reveal>
            <h2>The features</h2>
            <p>
              Everything in the app runs the same loop: plan it, prove it, earn
              for it, see what it did.
            </p>
            <h3 id="amr-loop">The loop</h3>
            <p>
              That&rsquo;s also why any one part could disappear without the
              rest noticing.
            </p>
            <h4 id="amr-plan">Plan</h4>
            <p>
              Pick where you&rsquo;re going and how you get there — public
              transport, cycle, walk, car — and see estimated emissions side by
              side for the same journey.
            </p>
            <h4 id="amr-prove">Prove</h4>
            <p>
              Photograph the action. The backend hashes it, checks it, and hands
              it to a model that returns a verdict with a reason.
            </p>
            <h4 id="amr-earn">Earn</h4>
            <p>
              Verified actions mint points. Points buy driver questions, votes,
              perks and trees.
            </p>
            <h4>See</h4>
            <p>
              An impact report sets your savings against a real circuit, next to
              the team&rsquo;s official numbers.
            </p>
            <figure className="amr-fig" data-reveal>
              <div className="amr-fig-frames is-pair">
                <img
                  src="/images/amr/amr-transport-modes.webp"
                  alt="Route planner comparing train, walk, cycle and car with CO₂e estimates"
                  width="720"
                  height="1566"
                  loading="lazy"
                  decoding="async"
                />
                <img
                  src="/images/amr/amr-journey-complete.webp"
                  alt="Journey complete screen: 82 points earned and 1.64 kg CO₂e saved, framed against laps of the Marina Bay Street Circuit"
                  width="720"
                  height="1566"
                  loading="lazy"
                  decoding="async"
                />
              </div>
              <figcaption>
                <span className="amr-fig-num">Fig 03</span>
                Plan — routes compared side by side with CO₂e estimates. Where a
                number wasn&rsquo;t verifiable the app said so, and a completed
                journey pays out against laps of the Marina Bay Street Circuit.
              </figcaption>
            </figure>
            <figure className="amr-fig" data-reveal>
              <div className="amr-fig-frames is-trio">
                <img
                  src="/images/amr/amr-cam-send.webp"
                  alt="Camera confirmation: a photo of hands planting a seedling, with Continue and Retake photo buttons"
                  width="720"
                  height="1566"
                  loading="lazy"
                  decoding="async"
                />
                <img
                  src="/images/amr/amr-cam-processing.webp"
                  alt="The submitted photo shown with a 'Sending…' status while the backend verifies it"
                  width="720"
                  height="1566"
                  loading="lazy"
                  decoding="async"
                />
                <img
                  src="/images/amr/amr-cam-success.webp"
                  alt="Verification result: 50 Sustainability Points, score 96 out of 100, confidence 98 percent and a written reason"
                  width="720"
                  height="1566"
                  loading="lazy"
                  decoding="async"
                />
              </div>
              <figcaption>
                <span className="amr-fig-num">Fig 04</span>
                Prove — confirm the photo, send it, and the judge comes back
                with points, a score, a confidence level and a written reason.
                Never a silent accept.
              </figcaption>
            </figure>
            <h3 id="amr-travel">Travel + Maps</h3>
            <p>
              Why transport, and not recycling or food? Because the emissions a
              fan actually controls are the ones in the journey, and the journey
              is a decision they make every day rather than once a season.
              It&rsquo;s also the one decision with a clean, comparable answer —
              the same route, four ways to travel it, four different numbers.
            </p>
            <p>
              The math is distance &times; an emission factor per mode. Routing
              goes through Google Maps, so the same code works in any race city
              rather than one hard-coded track. I used AI to research and
              cross-check the factors, and the UI labelled every number{" "}
              <em>estimated</em> — occupancy, traffic and vehicle mix all move
              it. Points represent participation, not verified kilograms
              avoided.
            </p>
            <p>
              What unlocked it was anchoring on <strong>Scope 3</strong>. Fan
              travel <em>is</em> a Scope 3 category, so a fan&rsquo;s train ride
              ties directly to the part of a team&rsquo;s footprint fans can
              influence. Our mentors pushed us onto that and it reframed the
              whole feature.
            </p>
            <h3 id="amr-camera">The sustainability camera</h3>
            <p>
              This was the spine of the app and the part I think about most.
            </p>
            <p>
              The first idea was passive tracking: infer what the fan did and
              pay out points for it. I killed it during development. If points
              mean anything, you need evidence, and self-reported activity is
              the easiest thing in the world to fake.
            </p>
            <p>
              So it became a camera. You open it and pick the action
              you&rsquo;re claiming — reusing, refilling, repairing, recycling,
              planting. You take the photo and confirm it. The app shows it
              going out with a plain <em>Sending…</em> — no fake progress bar,
              no pretending it&rsquo;s instant. On the other side, the image is
              hashed with SHA-256 before anything else happens; a hash
              that&rsquo;s already in the database means a reused photo and
              scores zero. A new hash gets sent to Luna + Jev with one
              structured instruction: does this visibly show the claimed action,
              judge only what is visible. The verdict, the score, the confidence
              level and a written reason all come back and land on screen
              together. Pass and 100 points are minted — capped at 2000 per
              action, so one photo of &ldquo;recycled a hundred cans&rdquo;
              can&rsquo;t farm the ledger.
            </p>
            <p>
              Prompt iteration was the real work. The first judge ruled too
              harshly — it read emotion and context into photos, so a far-away
              bus shot correctly failed while a legitimate inside-the-bus shot
              sat on the line. I rewrote it to weigh only visible evidence for
              the specific claim, and verdicts started holding up.
            </p>
            <aside className="amr-callout" data-reveal>
              <p>
                SHA-256 is an exact-match hash: change one pixel and it changes
                completely. It stops casual reuse at near-zero cost and stops a
                determined cheater not at all. That was the deliberate trade for
                an MVP. The production answer is perceptual hashing with a
                similarity threshold, a labelled test set so false positives and
                negatives are measurable, and a human review queue for the
                borderline cases.
              </p>
            </aside>
            <p>
              And to be clear about what this isn&rsquo;t: it&rsquo;s
              probabilistic. A staged photo can pass, a legitimate one can fail.
              It&rsquo;s a signal worth points, not proof worth a claim.
            </p>
            <h3 id="amr-theming">Driver theming</h3>
            <p>
              Pick Alonso or Stroll and the app restyles — colours, imagery and
              a giant number on the home screen. Theming is data-driven, so the
              design work is a data file, not a rebuild.
            </p>
            <figure className="amr-fig" data-reveal>
              <div className="amr-fig-frames is-trio">
                <img
                  src="/images/amr/amr-rewards.webp"
                  alt="Rewards screen: Green Points balance, fan challenges banner and a merchandise store"
                  width="720"
                  height="1566"
                  loading="lazy"
                  decoding="async"
                />
                <img
                  src="/images/amr/amr-achievements.webp"
                  alt="Achievements corkboard with earned pins and locked pins"
                  width="720"
                  height="1566"
                  loading="lazy"
                  decoding="async"
                />
                <img
                  src="/images/amr/amr-race-iq.webp"
                  alt="Race IQ quiz: complete today's quiz to earn 100 Green Points"
                  width="720"
                  height="1566"
                  loading="lazy"
                  decoding="async"
                />
              </div>
              <figcaption>
                <span className="amr-fig-num">Fig 05</span>
                Earn — points fund the rewards store and fan challenges, Race IQ
                pays out daily, and earned pins land on a corkboard.
              </figcaption>
            </figure>
            <h3 id="amr-see">Impact report</h3>
            <p>
              Nobody feels &ldquo;120g CO₂ saved.&rdquo; So the report sets your
              savings against Marina Bay — the circuit we had the SVG track for
              — so the number lands somewhere you can picture.
            </p>
            <figure className="amr-fig" data-reveal>
              <div className="amr-fig-frames is-solo">
                <img
                  src="/images/amr/amr-impact.webp"
                  alt="Impact dashboard: your travel beside all fans and the team's official footprint"
                  width="720"
                  height="1566"
                  loading="lazy"
                  decoding="async"
                />
              </div>
              <figcaption>
                <span className="amr-fig-num">Fig 06</span>
                See — your travel set beside all fans&rsquo; and the
                team&rsquo;s official 2025 footprint.
              </figcaption>
            </figure>
            <aside className="amr-callout" data-reveal>
              <p>
                User estimates stay visually separate from Aston Martin&rsquo;s
                official ESG figures. Never imply fan points equal team
                reduction.
              </p>
            </aside>
            <p>
              A tree-planting side feature sat on the same loop: spend points
              toward the annual planting and a 3D forest populates as you give.
              Some actions don&rsquo;t pay out for months, so the reward has to
              be delayed without feeling empty.
            </p>
          </section>

          <section id="amr-stack" data-reveal>
            <h2>The stack</h2>
            <p>
              Two native clients, one shared backend, boring infrastructure on
              purpose.
            </p>
            <CodeBlock label="architecture.txt">
              {`Mobile clients (Swift iOS main, Kotlin Android)
  ├─ Maps / routing ───────> Google Maps API
  ├─ Auth ─────────────────> Azure auth
  ├─ App data (REST) ──────> Supabase ──> PostgreSQL
  └─ Image submission ─────> Backend (Azure-ready)
                              ├─ SHA-256 hash → duplicate check in DB
                              └─ Luna + Jev → verdict + reasoning → points`}
            </CodeBlock>
            <h3 id="amr-data">Data, auth, backend</h3>
            <p>
              Supabase over PostgreSQL holds users, points, challenges, votes
              and submission hashes. Fast to iterate, relational where we needed
              it, and free at our scale.
            </p>
            <p>
              Azure handles auth so credentials never lived in our code — which
              mattered, because securing a backend was new to me. The backend
              ran on a private machine for the demo but was structured
              Azure-ready: finishing the cloud deploy is configuration, not a
              rewrite.
            </p>
            <aside className="amr-callout" data-reveal>
              <p>
                Maps, auth and model APIs can all fail, and the prototype has no
                real fallbacks or caching. A production build needs them.
              </p>
            </aside>
          </section>

          <section id="amr-port" data-reveal>
            <h2>Swift to Android</h2>
            <p>
              Once the iOS build was real, Android stopped being a second
              codebase to maintain and became a port. Anirudh took the Kotlin
              side; I handed over the Swift source, the specs and the
              screenshots, and Astra did the translation work between them —
              implementing the Android version with the iOS version as the
              reference.
            </p>
            <p>
              That is the direction we&rsquo;d argue for now: build the iOS app
              properly first, then port to Kotlin with AI, instead of writing
              one codebase that behaves natively on neither.
            </p>
            <h3 id="amr-inspiration">The inspiration</h3>
            <div className="amr-note-beside">
              <p>
                The clearest statement of why that trade changed came from{" "}
                <a href={SHOPIFY_URL} target="_blank" rel="noopener noreferrer">
                  Shopify&rsquo;s engineering write-up on moving back to native
                </a>{" "}
                — published in September 2026, while we were mid-build.
              </p>
              <Note
                text="The piece that made us feel less alone in throwing away the React build."
                href={SHOPIFY_URL}
                label="Shopify: back to native"
              />
            </div>
            <p>
              They had gone all-in on React Native in 2020 for the same reasons
              we did, and in 2026 they moved back to Swift and Kotlin because
              coding agents changed the economics: agents could implement a
              feature on one platform using the other as the reference, so the
              cost of building twice was no longer double. Their rebuild of the
              Shop app went from proof of concept to published native app in
              twelve weeks.
            </p>
            <p>
              Same motion, student scale: the Swift app is the source of truth,
              Kotlin is the port, and both apps stay on one product loop while
              respecting platform conventions.
            </p>
          </section>

          <section id="amr-business" data-reveal>
            <h2>Business benefits</h2>
            <p>
              The reason this was worth building: it moves sustainability from a
              report someone reads to a loop fans run, without asking anyone to
              trust a number they can&rsquo;t see.
            </p>
            <table className="amr-value">
              <caption>Who wins, and who pays</caption>
              <thead>
                <tr>
                  <th scope="col">Side</th>
                  <th scope="col">What they get</th>
                  <th scope="col">How it earns</th>
                  <th scope="col">Who pays</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>Fans</td>
                  <td>
                    A simple way to join in, with rewards that mean something
                  </td>
                  <td>Time, attention, verified actions</td>
                  <td>Themselves</td>
                </tr>
                <tr>
                  <td>Aston Martin</td>
                  <td>Engagement plus reported, source-backed impact data</td>
                  <td>Merchandise uplift and sponsorship value</td>
                  <td>ESG and marketing budget</td>
                </tr>
                <tr>
                  <td>Partners</td>
                  <td>Access to fans who already opted in</td>
                  <td>Commission and rebates on in-app bookings</td>
                  <td>Revenue share</td>
                </tr>
              </tbody>
            </table>
            <p>
              These aren&rsquo;t guesses: sustainability becomes measurable per
              fan instead of asserted, the merchandise loop gets a reason to
              exist, partners get a place to reach fans, and the team gets
              engagement data a sponsor can actually price.
            </p>
            <p>
              The sizing in our final deck was a model, not a measurement. This
              is the whole calculation:
            </p>
            <figure className="amr-fig" data-reveal>
              <div className="amr-finance">
                <div className="amr-finance-funnel">
                  <div className="amr-finance-funnel-step">
                    <span className="amr-finance-big">2.4M</span>
                    <span className="amr-finance-sub">potential fans</span>
                  </div>
                  <span className="amr-finance-arrow" aria-hidden="true">
                    &rarr;
                  </span>
                  <div className="amr-finance-funnel-step">
                    <span className="amr-finance-big">5%</span>
                    <span className="amr-finance-sub">assumed adoption</span>
                  </div>
                  <span className="amr-finance-arrow" aria-hidden="true">
                    &rarr;
                  </span>
                  <div className="amr-finance-funnel-step">
                    <span className="amr-finance-big">120K</span>
                    <span className="amr-finance-sub">active users</span>
                  </div>
                </div>
                <div className="amr-finance-revenue">
                  <p className="amr-finance-kicker">
                    Illustrative revenue, per year
                  </p>
                  <div className="amr-finance-bar-row">
                    <span className="amr-finance-bar-label">Merchandise</span>
                    <span className="amr-finance-bar-track">
                      <span
                        className="amr-finance-bar"
                        style={{ width: "40%" }}
                      />
                    </span>
                    <span className="amr-finance-bar-value">$720K</span>
                  </div>
                  <p className="amr-finance-assume">
                    120K users × 10% buy × $60 average order
                  </p>
                  <div className="amr-finance-bar-row">
                    <span className="amr-finance-bar-label">
                      Partner commission
                    </span>
                    <span className="amr-finance-bar-track">
                      <span
                        className="amr-finance-bar is-main"
                        style={{ width: "60%" }}
                      />
                    </span>
                    <span className="amr-finance-bar-value">$1.08M</span>
                  </div>
                  <p className="amr-finance-assume">
                    120K users × 6 bookings/yr × $1.50
                  </p>
                  <div className="amr-finance-total">
                    <span>Total</span>
                    <span className="amr-finance-total-value">~$1.8M</span>
                  </div>
                </div>
                <div className="amr-finance-units">
                  <p className="amr-finance-kicker">
                    Unit economics, per active fan per month
                  </p>
                  <div className="amr-finance-unit-grid">
                    <div className="amr-finance-unit">
                      <span className="amr-finance-big is-revenue">~$1.25</span>
                      <span className="amr-finance-sub">revenue</span>
                    </div>
                    <div className="amr-finance-unit">
                      <span className="amr-finance-big">~$0.16</span>
                      <span className="amr-finance-sub">cost to serve</span>
                    </div>
                  </div>
                  <p className="amr-finance-assume">
                    4 × $0.01 photo checks + 20 × $0.005 route lookups + $0.02
                    hosting
                  </p>
                </div>
              </div>
              <figcaption>
                <span className="amr-fig-num">Fig 08</span>
                Illustrative model from our final deck — assumed adoption,
                buying and booking behaviour; every input needs a pilot to
                validate. Sponsorship upside excluded. The $0.065 prototype
                spend below is separate: what the demo cost to run, not what
                each user costs to serve.
              </figcaption>
            </figure>
            <p>
              The only number from this build I&rsquo;d defend: $0.065 of model
              spend for a working prototype.
            </p>
            <h3 id="amr-trust">Trust and governance</h3>
            <p>
              Every gameable part had a designed answer. Faked photos meet a
              confidence score and activity rules. Inaccurate emissions are
              labelled, and unavailable numbers show as unavailable rather than
              guessed. Official figures stay admin-approved with a source and a
              reporting period. Uploaded photos are personal data with retention
              rules, not free stock. Points abuse gets rate limits.
            </p>
          </section>

          <section id="amr-decisions" data-reveal>
            <h2>Decisions</h2>
            <p>
              Modularity is what made cutting cheap. Three killed, one deferred,
              two rewritten, two shipped — and the modules that died did it
              without breaking the ones that didn&rsquo;t.
            </p>
            <div className="amr-decisions">
              {DECISIONS.map((decision) => (
                <div key={decision.title} className="amr-decision">
                  <div className="amr-decision-head">
                    <span className={`amr-chip ${decision.tone}`}>
                      {decision.status}
                    </span>
                    <h3 id={decision.id}>{decision.title}</h3>
                  </div>
                  <p>{decision.text}</p>
                </div>
              ))}
            </div>
          </section>

          <section id="amr-constraints" data-reveal>
            <h2>Constraints</h2>
            <ol className="amr-lessons-list amr-constraints-list">
              <li id="amr-time">
                <strong>Time — 15 Sep to 8 Oct 2026.</strong> The idea-thon, two
                on-stage rounds and the build in one window. The gap after the
                first on-stage is where the refocus happened: the scope had
                spread too thin, our Cognizant mentors said so plainly, and we
                cut to environment-only and mobility-only.
              </li>
              <li id="amr-cost">
                <strong>Cost — $0.065, against a pooled ~$10.</strong> That
                ruled out training anything and ruled out a big model on every
                call, so Luna + Jev were picked as judges specifically for cost,
                and every call was tuned to fit. Gemini was the cheap
                alternative on the table and wasn&rsquo;t used for verification.
              </li>
              <li id="amr-platform">
                <strong>The platform rewrite.</strong> Mid-build, the React
                Native codebase stopped being maintainable, and the whole thing
                was rewritten in Swift — the single biggest constraint on the
                schedule, and the reason a modular, swappable architecture was
                not optional.
              </li>
            </ol>
          </section>

          <section id="amr-lessons" data-reveal>
            <h2>Lessons learned</h2>
            <ol className="amr-lessons-list">
              <li>
                <strong>Cognizant taught us design thinking properly.</strong>{" "}
                The coaching around the brief — persona first, reframe the
                problem, then solutions — is the part I still use. We arrived
                with a dashboard idea and left with a fan loop.
              </li>
              <li>
                <strong>Optimise the AI workflow, not the output.</strong> Six
                months in, the gains stopped coming from better prompts and
                started coming from better structure around them: specs first,
                small slices, review gates.
              </li>
              <li>
                <strong>Planning is the whole game with AI.</strong> When the
                codebase outgrew what a model could hold, the cost was not the
                model — it was the missing plan. Vague instructions are how
                agents go rogue.
              </li>
              <li>
                <strong>Functionality first, UI last.</strong> I left the
                styling blank until the loop worked, then designed it in one
                pass. The reverse order is how you get a beautiful screen that
                ships nothing.
              </li>
              <li>
                <strong>Scope is engineering.</strong> The cut list shipped the
                demo. Every feature we killed bought quality somewhere that
                mattered more.
              </li>
              <li>
                <strong>Design the weak point first.</strong> Verification and
                anti-cheat deserved time before UI polish, because they are
                where trust is won or lost.
              </li>
            </ol>
          </section>

          <section id="amr-version" data-reveal>
            <h2>Current version</h2>
            <p>
              What exists today is a working prototype: route planning, the
              AI-verified camera, points, driver theming and the impact report,
              presented to evaluators, built for $0.065 of model spend. The
              backend runs on a private machine, structured Azure-ready.
            </p>
            <p>
              What it isn&rsquo;t is finished. The UI is rough — it&rsquo;s not
              a bad design, it&rsquo;s a design that ran out of runway. Maps,
              auth and model APIs have no fallbacks or caching. SHA-256 stops
              casual reuse only. Uploaded photos have no retention policy behind
              them. And no environmental outcome has been measured — the app
              proves a loop, not a carbon result.
            </p>
            <figure className="amr-fig" data-reveal>
              <div className="amr-fig-frames is-pair">
                <img
                  src="/images/amr/amr-cam-loading.webp"
                  alt="Verification in progress: a submitted photo shown with a 'Sending…' status"
                  width="720"
                  height="1566"
                  loading="lazy"
                  decoding="async"
                />
                <img
                  src="/images/amr/amr-cam-error.webp"
                  alt="Failed verification: 'Could not process photo' with a Try again button"
                  width="720"
                  height="1566"
                  loading="lazy"
                  decoding="async"
                />
              </div>
              <figcaption>
                <span className="amr-fig-num">Fig 07</span>
                What failure looked like — a plain &ldquo;Sending&hellip;&rdquo;
                and, when a request failed, an honest error with a manual retry.
                No silent fallbacks behind it.
              </figcaption>
            </figure>
            <div className="amr-prose-links">
              <a href={REPO_URL} target="_blank" rel="noopener noreferrer">
                Read the code <Arrow diagonal />
              </a>
              <a href={DEMO_URL} target="_blank" rel="noopener noreferrer">
                Watch the demo <Arrow diagonal />
              </a>
              <Link to={ARTICLE_PATH}>
                Read the article <Arrow diagonal />
              </Link>
            </div>
          </section>

          <section id="amr-end" data-reveal>
            <h2>Where it lands</h2>
            <p>
              We set out to make a sustainability report readable for fans, and
              what we learned is that you don&rsquo;t get there by presenting
              the report better. You get there by giving fans something to do —
              plan a greener route, prove an action, earn a point, see it
              against a real circuit — and keeping the numbers honest the entire
              way.
            </p>
            <p>
              What I&rsquo;d keep if we did it again: the loop, the data-driven
              theming, and the discipline of killing features on schedule. What
              I&rsquo;d change: decide the platform and the verification
              pipeline before anything else, because those two cost us more time
              than every screen combined.
            </p>
            <aside className="amr-callout is-end" data-reveal>
              <p>
                I hope Aston Martin does pursue this idea and hands it back to
                the fans. The prototype is not polished, but the loop works, the
                numbers are honest, and with a small push this could be a
                genuinely great product — a place where 2.4 million fans can see
                what their travel actually costs the planet, and what it&rsquo;s
                worth.
              </p>
            </aside>
            <div className="amr-more">
              <h3 className="amr-boxlabel">More projects</h3>
              <div className="amr-more-grid">
                {MORE_PROJECTS.map((project, index) => (
                  <Link
                    key={project.slug}
                    to={`/projects/${project.slug}`}
                    className="amr-more-card"
                  >
                    <span className="amr-more-index">
                      {String(index + 1).padStart(2, "0")}
                    </span>
                    <span className="amr-more-body">
                      <strong>{project.name}</strong>
                      <span className="amr-more-line">{project.line}</span>
                      <span className="amr-more-stack">
                        {project.stack.map((tech) => (
                          <span key={tech}>{tech}</span>
                        ))}
                      </span>
                    </span>
                    <span className="amr-more-arrow" aria-hidden="true">
                      <Arrow diagonal />
                    </span>
                  </Link>
                ))}
              </div>
              <Link className="amr-more-all" to="/projects">
                All projects and experiments <Arrow diagonal />
              </Link>
            </div>
          </section>
        </div>
      </div>
      <Lightbox index={viewer} onClose={closeViewer} onStep={stepViewer} />
    </article>
  );
}
