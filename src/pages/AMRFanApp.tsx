import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { Arrow, SocialIcon } from "../components/Icons";
import { currentSection } from "../lib/readingContents";
import { usePageMotion } from "../usePageMotion";

type TreeLeaf = { id: string; label: string };
type TreeSection = TreeLeaf & { children?: TreeLeaf[] };

const REPO_URL = "https://github.com/NachikethReddyY/AMR-Fan-App";
const DEMO_URL = "https://youtu.be/Fn2FTYSmvbQ";
const DEMO_ID = "Fn2FTYSmvbQ";
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
};

const SECTIONS: TreeSection[] = [
  { id: "amr-overview", label: "Overview" },
  { id: "amr-brief", label: "The brief" },
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
  {
    id: "amr-built",
    label: "What I built",
    children: [
      { id: "amr-ios", label: "iOS app in Swift" },
      { id: "amr-android", label: "Android in Kotlin" },
      { id: "amr-travel", label: "Travel emissions + Maps" },
      { id: "amr-verify", label: "AI verification" },
    ],
  },
  {
    id: "amr-decisions",
    label: "Decisions",
    children: [
      { id: "amr-cut", label: "The cut list" },
      { id: "amr-prompts", label: "Judge prompts" },
      { id: "amr-theming", label: "Driver theming" },
    ],
  },
  {
    id: "amr-constraints",
    label: "Constraints",
    children: [
      { id: "amr-budget", label: "A ~$10 budget" },
      { id: "amr-time", label: "Hackathon + 2 weeks" },
      { id: "amr-native", label: "From web to native" },
    ],
  },
  { id: "amr-lessons", label: "Lessons learned" },
  { id: "amr-status", label: "Status" },
];

const SECTION_IDS = SECTIONS.map((section) => section.id);
const ALL_HEADINGS: TreeLeaf[] = SECTIONS.flatMap((section) => [
  section,
  ...(section.children ?? []),
]);
const OWNER_OF = new Map<string, string>(
  SECTIONS.flatMap((section) => [
    [section.id, section.id] as const,
    ...(section.children ?? []).map((child) => [child.id, section.id] as const),
  ]),
);

const PRINCIPLES = [
  {
    num: "P1",
    title: "Credibility first",
    text: "Never fake sustainability numbers. Estimates stay estimates — and we say so.",
  },
  {
    num: "P2",
    title: "Fan-first",
    text: "It's a fan app first. Sustainability earns rewards; it never preaches.",
  },
  {
    num: "P3",
    title: "Prove, don't claim",
    text: "Good intentions don't score points. Verified evidence does.",
  },
];

const DECISIONS: Array<{
  id?: string;
  status: string;
  tone: string;
  title: string;
  text: string;
}> = [
  {
    id: "amr-cut",
    status: "Killed",
    tone: "is-killed",
    title: "ESG auto-ingestion",
    text: "Pulling the 90-page report into the app automatically. Gone in the first refocus, when the POC went environment-only and mobility-only.",
  },
  {
    status: "Killed",
    tone: "is-killed",
    title: "Admin dashboard",
    text: "Cut in the same pass — out of demo scope. Evaluators grade the fan experience.",
  },
  {
    status: "Killed",
    tone: "is-killed",
    title: "Hotel marketplace",
    text: "Cut in the same pass — outside the plan → prove → earn → see loop.",
  },
  {
    id: "amr-prompts",
    status: "Rewrote",
    tone: "is-rewrote",
    title: "Judge prompts v1",
    text: "The first AI judge ruled too harshly. I rewrote the prompts until verdicts held up — a fan app that punishes unfairly loses fans.",
  },
  {
    id: "amr-theming",
    status: "Shipped",
    tone: "is-shipped",
    title: "Driver theming, public-source only",
    text: "No proper F1 image kit and no licensed assets. All driver imagery is public-source, which shaped the theming approach.",
  },
];

const STACK = [
  "Swift",
  "Kotlin",
  "Supabase",
  "PostgreSQL",
  "Azure auth",
  "Google Maps API",
  "Luna + Jev",
  "SHA-256",
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

export default function AMRFanApp() {
  const scope = usePageMotion("amr-fan-app");
  const bodyRef = useRef<HTMLDivElement>(null);
  const [activeHeading, setActiveHeading] = useState(SECTION_IDS[0]);
  const [progress, setProgress] = useState(0);
  const [pastHero, setPastHero] = useState(false);
  const [showTreeTitle, setShowTreeTitle] = useState(false);

  useEffect(() => {
    const body = bodyRef.current;
    if (!body) return;
    let frame = 0;
    const measure = () => {
      frame = 0;
      const hero = document.querySelector(".amr-hero");
      const heroBottom = hero ? hero.getBoundingClientRect().bottom : 0;
      setPastHero(heroBottom < 96);
      // The tree title enters the moment the hero h1 fully leaves the
      // viewport, and leaves again when it scrolls back — a one-shot
      // CSS transition drives the motion, so it stays smooth.
      const heroTitle = hero ? hero.querySelector("h1") : null;
      const titleGone = heroTitle
        ? heroTitle.getBoundingClientRect().bottom < 0
        : true;
      setShowTreeTitle(titleGone);
      const rect = body.getBoundingClientRect();
      if (rect.height > 0) {
        const visible = window.innerHeight - rect.top;
        setProgress(Math.max(0, Math.min(100, Math.round((visible / rect.height) * 100))));
      }
      const tops = ALL_HEADINGS.flatMap((heading) => {
        const element = document.getElementById(heading.id);
        return element ? [{ id: element.id, top: element.getBoundingClientRect().top }] : [];
      });
      setActiveHeading(currentSection(tops));
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

  const activeSection = OWNER_OF.get(activeHeading) ?? SECTION_IDS[0];

  return (
    <article ref={scope} className={`amr-page${pastHero ? " is-past-hero" : ""}`}>
      <header className="amr-hero">
        <div className="shell">
          <Link className="back-link" to="/projects">
            <span aria-hidden="true">←</span> All projects
          </Link>
          <FlagIcon />
          <span className="amr-tag">Native apps</span>
          <h1 tabIndex={-1}>AMR Fan App</h1>
          <p className="amr-dek">
            Turning Aston Martin Aramco&rsquo;s Make A Mark sustainability work into
            something fans actually do: a plan → prove → earn → see loop, built in a
            hackathon.
          </p>
          <dl className="amr-meta">
            <div>
              <dt>Author</dt>
              <dd>Nachiketh Reddy</dd>
            </div>
            <div>
              <dt>Published</dt>
              <dd>Oct 2026</dd>
            </div>
            <div>
              <dt>Reading time</dt>
              <dd>4 min</dd>
            </div>
          </dl>
        </div>
      </header>

      <div className="amr-layout">
        <aside className="amr-tree">
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
              <div key={section.id} className="amr-tree-item">
                <a
                  href={`#${section.id}`}
                  aria-current={activeSection === section.id ? "location" : undefined}
                >
                  <span className="amr-marker" aria-hidden="true">
                    └
                  </span>
                  {section.label}
                </a>
                {section.children && (
                  <div
                    className={`amr-children${activeSection === section.id ? " is-open" : ""}`}
                    aria-hidden={activeSection === section.id ? undefined : true}
                  >
                    <div className="amr-children-clip">
                      {section.children.map((child) => (
                        <a
                          key={child.id}
                          href={`#${child.id}`}
                          aria-current={activeHeading === child.id ? "location" : undefined}
                          tabIndex={activeSection === section.id ? undefined : -1}
                        >
                          <span className="amr-marker" aria-hidden="true">
                            └
                          </span>
                          {child.label}
                        </a>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </nav>
          <div className="amr-progress" aria-hidden="true">
            <span className="amr-progress-track">
              <span style={{ width: `${progress}%` }} />
            </span>
            <span className="amr-progress-num">{String(progress).padStart(2, "0")}%</span>
          </div>
          <p className="amr-hint" aria-hidden="true">
            Press ↑ / ↓ to scroll
          </p>
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
        </aside>

        <div className="amr-body" ref={bodyRef}>
          <section id="amr-overview" data-reveal>
            <h2>Overview</h2>
            <div className="amr-rolebox">
              <p className="amr-boxlabel">My role</p>
              <p className="amr-roleline">
                iOS Developer — the primary client, in Swift. Presentation Lead
                — the story we put in front of evaluators.
              </p>
              <p className="amr-owned-label">What I personally owned</p>
              <ul className="amr-owned">
                <li>
                  The iOS app in Swift — navigation, camera flow, driver
                  theming, points UI, impact report
                </li>
                <li>Travel emissions logic + Google Maps routing integration</li>
                <li>
                  The AI verification pipeline — image → SHA-256 duplicate check
                  → Luna + Jev judge prompt → verdict + points
                </li>
                <li>Judge prompt rewrites, when v1 ruled too harshly</li>
                <li>Kotlin contributions to the Android counterpart</li>
              </ul>
            </div>
            <div className="amr-rolebox">
              <p className="amr-boxlabel">The team</p>
              <ul className="amr-team">
                <li>
                  <a
                    href={LINKEDIN.joseph}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <strong>Joseph P K</strong>
                  </a>{" "}
                  (Cognizant Team Mentor)
                </li>
                <li>
                  <a
                    href={LINKEDIN.aleisya}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <strong>Aleisya Fuad</strong>
                  </a>{" "}
                  (Cognizant Team Mentor)
                </li>
                <li>
                  <a
                    href={LINKEDIN.anirudh}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <strong>Anirudh Kumar</strong>
                  </a>{" "}
                  (cloud developer, Android)
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
                    href={LINKEDIN.briana}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <strong>Briana Kong</strong>
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
            </div>
            <dl className="amr-facts">
              <div>
                <dt>Timeline</dt>
                <dd>Hackathon + ~2 weeks after the first on-stage</dd>
              </div>
              <div>
                <dt>Status</dt>
                <dd>
                  Working prototype presented to evaluators — hackathon MVP, not
                  production
                </dd>
              </div>
              <div>
                <dt>Context</dt>
                <dd>Aston Martin Aramco F1 hackathon, Make A Mark challenge</dd>
              </div>
              <div>
                <dt>AI spend</dt>
                <dd>~$10, existing APIs only</dd>
              </div>
            </dl>
            <p className="amr-lede">
              For Aston Martin Aramco&rsquo;s Make A Mark hackathon I carried the
              iOS build of a fan app that turns sustainability reporting into
              something
              fans actually do: plan lower-emission race travel, prove sustainable
              actions with an AI-verified photo, and earn points, driver challenges
              and a personal impact report.
            </p>
            <p>
              It shipped as a working prototype presented to evaluators — route
              planning, AI-verified camera, points, driver theming, impact report —
              on roughly $10 of AI spend. It shipped because we cut scope twice.
            </p>
            <ul className="amr-stack-row" aria-label="Stack">
              {STACK.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
            <DemoVideo />
            <div className="amr-highlights-wrap">
              <p className="amr-boxlabel">Highlights</p>
              <div className="amr-highlights">
                <a className="amr-highlight" href="#amr-ios">
                  <img
                    src="/images/amr/amr-home.webp"
                    alt="Home screen: greeting, day streak and Green Points cards, quick actions and a Race IQ banner"
                    width="720"
                    height="1566"
                    loading="lazy"
                    decoding="async"
                  />
                  <span className="amr-highlight-label">
                    <em>0.1</em> Home
                  </span>
                </a>
                <a className="amr-highlight" href="#amr-theming">
                  <img
                    src="/images/amr/amr-driver-selection.webp"
                    alt="Driver selection screen: 'On this team.' with Alonso and Stroll cards"
                    width="720"
                    height="1566"
                    loading="lazy"
                    decoding="async"
                  />
                  <span className="amr-highlight-label">
                    <em>0.2</em> Driver theming
                  </span>
                </a>
                <a className="amr-highlight" href="#amr-prove">
                  <img
                    src="/images/amr/amr-cam-success.webp"
                    alt="Verification result: 50 Sustainability Points, score 96/100, confidence 98% and a written reason"
                    width="720"
                    height="1566"
                    loading="lazy"
                    decoding="async"
                  />
                  <span className="amr-highlight-label">
                    <em>0.3</em> Verified action
                  </span>
                </a>
                <a className="amr-highlight" href="#amr-plan">
                  <img
                    src="/images/amr/amr-transport-modes.webp"
                    alt="Route planner comparing train, walk, cycle and car with CO₂e estimates"
                    width="720"
                    height="1566"
                    loading="lazy"
                    decoding="async"
                  />
                  <span className="amr-highlight-label">
                    <em>0.4</em> Travel planning
                  </span>
                </a>
                <a className="amr-highlight" href="#amr-see">
                  <img
                    src="/images/amr/amr-impact.webp"
                    alt="Impact dashboard: your travel beside all fans and the team's official footprint"
                    width="720"
                    height="1566"
                    loading="lazy"
                    decoding="async"
                  />
                  <span className="amr-highlight-label">
                    <em>0.5</em> Impact report
                  </span>
                </a>
              </div>
            </div>
          </section>

          <section id="amr-brief" data-reveal>
            <h2>
              <span className="amr-num">01</span>The brief
            </h2>
            <p>
              Aston Martin Aramco does real sustainability work under Make A Mark —
              Environment, Belong, Community. But it&rsquo;s a 90-page report: dense,
              written for accountability, almost never read by fans.
            </p>
            <p>
              The hackathon brief was two jobs pulling opposite ways: convey that ESG
              information to fans in a way they get, and attract F1 fans who
              didn&rsquo;t open the app for sustainability in the first place. Push
              engagement too hard — points, streaks, rewards — and you lose
              credibility. Push credibility too hard — PDF charts — and nobody opens
              it twice.
            </p>
            <p>
              My take never changed: don&rsquo;t build a sustainability app with F1
              stickers on it. Build a fan app where sustainable behaviour happens to
              earn you something.
            </p>
            <div className="amr-principles" role="list">
              {PRINCIPLES.map((principle) => (
                <div key={principle.num} role="listitem">
                  <span className="amr-principle-num">{principle.num}</span>
                  <h3>{principle.title}</h3>
                  <p>{principle.text}</p>
                </div>
              ))}
            </div>
          </section>

          <section id="amr-loop" data-reveal>
            <h2>
              <span className="amr-num">02</span>The loop
            </h2>
            <p>An all-in-one fan hub running a simple four-step loop.</p>
            <h3 id="amr-plan">Plan</h3>
            <p>
              Pick how you get to the race — public transport, cycle, walk, car —
              and see estimated emissions side-by-side, powered by Google Maps
              routing.
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
                <span className="amr-fig-num">Fig 02.1</span>
                Plan — routes compared side-by-side with CO₂e estimates. Where a
                number wasn&rsquo;t verifiable the app said so (&ldquo;CO₂
                unavailable — geography unverified&rdquo;), and a completed journey
                pays out against laps of the Marina Bay Street Circuit.
              </figcaption>
            </figure>
            <h3 id="amr-prove">Prove</h3>
            <p>
              Snap a photo of the action. The backend verifies it, so good
              intentions become evidence without manual review.
            </p>
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
                  alt="Verification result: 50 Sustainability Points, score 96/100, confidence 98% and a written reason"
                  width="720"
                  height="1566"
                  loading="lazy"
                  decoding="async"
                />
              </div>
              <figcaption>
                <span className="amr-fig-num">Fig 02.2</span>
                Prove — confirm the photo, send it, and the judge returns a
                verdict: points, a score, a confidence level and a written reason.
                Never a silent accept.
              </figcaption>
            </figure>
            <h3 id="amr-earn">Earn</h3>
            <p>
              Verified actions earn points. Spend points to ask drivers questions
              and dares, vote, and unlock perks.
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
                <span className="amr-fig-num">Fig 02.3</span>
                Earn — points fund the rewards store and fan challenges, Race IQ
                pays out daily, and earned pins land on a corkboard.
              </figcaption>
            </figure>
            <h3 id="amr-see">See</h3>
            <p>
              An impact report compares your savings to something you actually
              understand — a real circuit — closing the loop.
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
                <span className="amr-fig-num">Fig 02.4</span>
                See — your travel set beside all fans&rsquo; and the team&rsquo;s
                official 2025 footprint.
              </figcaption>
            </figure>
          </section>

          <section id="amr-built" data-reveal>
            <h2>
              <span className="amr-num">03</span>What I built
            </h2>
            <p>
              I carried this build — the iOS app in Swift, the travel emissions
              logic, the AI verification pipeline — with{" "}
              <a href={LINKEDIN.anirudh} target="_blank" rel="noopener noreferrer">
                Anirudh Kumar
              </a>{" "}
              supporting on cloud and Android. I built it modular on purpose:
              every feature is self-contained on a shared backend, so a whole
              module could be killed without breaking the rest. We needed that
              more than once.
            </p>
            <pre className="amr-arch" aria-label="System architecture diagram in text form">
{`Mobile clients (Swift iOS main, Kotlin Android)
  ├─ Maps / routing ───────> Google Maps API
  ├─ Auth ─────────────────> Azure auth
  ├─ App data (REST) ──────> Supabase ──> PostgreSQL
  └─ Image submission ─────> Backend
                              ├─ SHA-256 hash → duplicate check in DB
                              └─ Luna + Jev → verdict + reasoning → points`}
            </pre>
            <aside className="amr-callout" data-reveal>
              <p className="amr-callout-label">Key decision</p>
              <p>
                Every submission is hashed with SHA-256 and checked against the
                database before it&rsquo;s judged — the same photo can&rsquo;t farm
                points twice. Verification and anti-cheat got design time before UI
                polish.
              </p>
            </aside>
            <h3 id="amr-ios">iOS app in Swift</h3>
            <p>
              Navigation, camera flow, driver theming, points UI, and the impact
              report — the primary client, where the loop lives end to end.
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
                <span className="amr-fig-num">Fig 03.1</span>
                The primary client, in Swift — the loop&rsquo;s home surface and
                the driver-themed account.
              </figcaption>
            </figure>
            <h3 id="amr-android">Android in Kotlin</h3>
            <p>
              Contributions to the Android counterpart, keeping both apps on the
              same product loop while respecting platform conventions.
            </p>
            <h3 id="amr-travel">
              Travel emissions + Maps
              <span className="amr-badge">P1 · Credibility first</span>
            </h3>
            <p>
              The travel emissions logic and Google Maps routing integration that
              turn transport choices into comparable, estimated impact — estimates
              clearly labelled as estimates.
            </p>
            <h3 id="amr-verify">
              AI verification
              <span className="amr-badge">P3 · Prove, don&rsquo;t claim</span>
            </h3>
            <p>
              The pipeline behind Prove: image → SHA-256 duplicate check in the
              database → Luna + Jev judge prompt → verdict with reasoning → points.
              When the first judge version ruled too harshly, I rewrote the prompts
              until the verdicts held up.
            </p>
          </section>

          <section id="amr-decisions" data-reveal>
            <h2>
              <span className="amr-num">04</span>Decisions & trade-offs
            </h2>
            <p>
              The modular build made cutting cheap: every feature was
              self-contained on the shared backend, so a whole module could die
              without breaking the rest. We needed that more than once.
            </p>
            <div className="amr-decisions">
              {DECISIONS.map((decision) => (
                <div key={decision.title} className="amr-decision">
                  <div className="amr-decision-head">
                    <span className={`amr-chip ${decision.tone}`}>{decision.status}</span>
                    <h3 id={decision.id}>{decision.title}</h3>
                  </div>
                  <p>{decision.text}</p>
                </div>
              ))}
            </div>
          </section>

          <section id="amr-constraints" data-reveal>
            <h2>
              <span className="amr-num">05</span>Constraints
            </h2>
            <p>Constraints decided more than ideas did.</p>
            <h3 id="amr-budget">A ~$10 budget</h3>
            <p>
              Students, ~$10 total for AI/API. That ruled out training anything and
              big-model-on-every-call. Existing APIs only — Luna + Jev as judges —
              with calls tuned to fit the budget.
            </p>
            <h3 id="amr-time">Hackathon + 2 weeks</h3>
            <p>
              After the first on-stage the team spread way too thin. Our
              Cognizant mentors{" "}
              <a href={LINKEDIN.joseph} target="_blank" rel="noopener noreferrer">
                Joseph P K
              </a>{" "}
              and{" "}
              <a href={LINKEDIN.aleisya} target="_blank" rel="noopener noreferrer">
                Aleisya Fuad
              </a>{" "}
              carried the team — they told us straight, and we refocused the POC
              on environment-only and mobility-only.
            </p>
            <h3 id="amr-native">From web to native</h3>
            <p>
              Web dev was my thing — I&rsquo;m president of the Apple Developer
              Society at Singapore Polytechnic — but I&rsquo;d never shipped native
              mobile, backend security, and an AI pipeline from scratch. Six-plus
              months of AI-assisted coding helped me move fast — not vibe-coding: I
              read, ran, and tested everything.
            </p>
          </section>

          <section id="amr-lessons" data-reveal>
            <h2>
              <span className="amr-num">06</span>Lessons learned
            </h2>
            <ol className="amr-lessons-list">
              <li>
                <strong>Scope is engineering.</strong> The cut list shipped the
                demo.
              </li>
              <li>
                <strong>Design the weak point first.</strong> Verification and
                anti-cheat deserved time before UI polish.
              </li>
              <li>
                <strong>Say what&rsquo;s estimated.</strong> Credibility is the
                product here.
              </li>
              <li>
                <strong>The stretch was worth it.</strong> Web → native, backend
                security, and AI pipelines taught me more than tutorials.
              </li>
            </ol>
          </section>

          <section id="amr-status" data-reveal>
            <h2>
              <span className="amr-num">07</span>Status
            </h2>
            <p>
              A hackathon MVP: working prototype presented to evaluators — route
              planning, AI-verified camera, points, driver theming, impact report —
              at roughly $10 of AI spend. The backend ran on a private server for
              the demo, structured Azure-ready: full deploy is config, not rewrite.
              Honest gap: Maps, auth, and model APIs can fail, and the prototype
              has no real fallbacks or caching; production would need them.
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
                <span className="amr-fig-num">Fig 07.1</span>
                What failure looked like — a plain &ldquo;Sending&hellip;&rdquo;
                and, when a request failed, an honest error with a manual retry.
                No silent fallbacks behind it.
              </figcaption>
            </figure>
            <p>
              The source is public on GitHub, and I wrote the longer story behind
              the build.{" "}
              <a href={REPO_URL} target="_blank" rel="noopener noreferrer">
                Read the code <Arrow diagonal />
              </a>{" "}
              <Link to={ARTICLE_PATH}>
                Read the article <Arrow diagonal />
              </Link>
            </p>
          </section>
        </div>
      </div>
    </article>
  );
}
