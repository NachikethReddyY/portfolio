import { ArrowUpRight, BookOpen, Brain, Flag, Github, Linkedin, Mail, MapPin, Trophy, Wrench } from "lucide-react";
import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import type { Post, Profile } from "./types";
import { fallbackPosts, profile as fallbackProfile } from "./data/fallback";
import { getPosts, getProfile, isSanityConfigured } from "./lib/sanity";

const work = [
  {
    icon: Wrench,
    title: "Web projects",
    text: "Building frontends, experiments, and practical tools while sharpening the fundamentals behind them.",
  },
  {
    icon: Brain,
    title: "AI exploration",
    text: "Testing where AI can accelerate learning, prototyping, and product thinking without skipping craft.",
  },
  {
    icon: Trophy,
    title: "Hackathon energy",
    text: "Using short build cycles to practice scope, shipping, collaboration, and fast judgment.",
  },
];

const interests = [
  { label: "Hackathlons", note: "fast feedback" },
  { label: "AI", note: "systems + leverage" },
  { label: "Formula 1", note: "precision under pressure" },
];

export function App() {
  const [profile, setProfile] = useState<Profile>(fallbackProfile);
  const [posts, setPosts] = useState<Post[]>(fallbackPosts.slice(0, 3));

  useEffect(() => {
    void Promise.all([getProfile(), getPosts(3)]).then(([nextProfile, nextPosts]) => {
      setProfile(nextProfile);
      setPosts(nextPosts);
    });
  }, []);

  const github = profile.links.find((link) => link.label === "GitHub");
  const linkedin = profile.links.find((link) => link.label === "LinkedIn");
  const email = profile.links.find((link) => link.label === "Email");

  return (
    <main className="site-shell">
      <header className="nav">
        <a className="brand" href="#top" aria-label="Nachiketh Reddy home">
          NR
        </a>
        <nav aria-label="Primary navigation">
          <a href="#about">About</a>
          <a href="#work">Work</a>
          <Link to="/blog">Blog</Link>
          <a href="#contact">Contact</a>
        </nav>
      </header>

      <section id="top" className="hero section">
        <div className="hero-copy">
          <div className="eyebrow">
            <MapPin size={16} aria-hidden />
            {profile.location} / Singapore Polytechnic
          </div>
          <h1>{profile.name}</h1>
          <p className="hero-intro">{profile.intro}</p>
          <div className="hero-actions">
            {github && (
              <a className="button primary" href={github.href} target="_blank" rel="noreferrer">
                <Github size={18} aria-hidden />
                GitHub
              </a>
            )}
            {linkedin && (
              <a className="button secondary" href={linkedin.href} target="_blank" rel="noreferrer">
                <Linkedin size={18} aria-hidden />
                LinkedIn
              </a>
            )}
          </div>
        </div>
        <aside className="dashboard" aria-label="Profile highlights">
          <div className="dashboard-topline">
            <span>Builder log</span>
            <span className="live-dot">Blog {isSanityConfigured ? "live" : "demo"}</span>
          </div>
          <div className="speed-read">
            <span>AI</span>
            <span>Hackathons</span>
            <span>F1</span>
          </div>
          <div className="stat-grid">
            {profile.stats.map((stat) => (
              <div key={stat.label}>
                <strong>{stat.value}</strong>
                <span>{stat.label}</span>
              </div>
            ))}
          </div>
          <div className="trackline" aria-hidden>
            <span />
          </div>
        </aside>
      </section>

      <section id="about" className="section split-section">
        <div>
          <p className="section-kicker">About</p>
          <h2>Learning in public, building with pressure, keeping taste in the loop.</h2>
        </div>
        <div className="paragraph-stack">
          {profile.about.map((paragraph) => (
            <p key={paragraph}>{paragraph}</p>
          ))}
        </div>
      </section>

      <section id="work" className="section">
        <div className="section-heading">
          <p className="section-kicker">What I do</p>
          <h2>Small experiments, real shipping muscles.</h2>
        </div>
        <div className="work-grid">
          {work.map((item) => {
            const Icon = item.icon;
            return (
              <article className="work-card" key={item.title}>
                <Icon size={22} aria-hidden />
                <h3>{item.title}</h3>
                <p>{item.text}</p>
              </article>
            );
          })}
        </div>
      </section>

      <section className="section interest-band" aria-label="Interests">
        {interests.map((interest) => (
          <div key={interest.label}>
            <span>{interest.label}</span>
            <p>{interest.note}</p>
          </div>
        ))}
        <Flag className="flag-icon" aria-hidden />
      </section>

      <section className="section blog-preview">
        <div className="section-heading row-heading">
          <div>
            <p className="section-kicker">Blog</p>
            <h2>Write once. Publish cleanly.</h2>
            <p className="section-note">
              Sanity is the writing desk: create a post there, press publish, and this site picks it up automatically.
            </p>
          </div>
          <Link className="text-link" to="/blog">
            View all <ArrowUpRight size={16} aria-hidden />
          </Link>
        </div>
        <div className="post-grid">
          {posts.map((post) => (
            <Link className="post-card" to={`/blog/${post.slug}`} key={post.slug}>
              <span>{new Date(post.publishedAt).toLocaleDateString("en-SG", { month: "short", day: "numeric" })}</span>
              <h3>{post.title}</h3>
              <p>{post.excerpt}</p>
              <div>{post.tags.map((tag) => `#${tag}`).join(" ")}</div>
            </Link>
          ))}
        </div>
      </section>

      <section id="contact" className="section contact">
        <div>
          <p className="section-kicker">Get in touch</p>
          <h2>Send a note, share a build, or pull me into a hackathon sprint.</h2>
        </div>
        <div className="contact-links">
          {email && (
            <a href={email.href}>
              <Mail size={18} aria-hidden />
              Email
            </a>
          )}
          {profile.links
            .filter((link) => link.label !== "Email")
            .map((link) => (
              <a key={link.label} href={link.href} target="_blank" rel="noreferrer">
                {link.label}
                <ArrowUpRight size={16} aria-hidden />
              </a>
            ))}
        </div>
      </section>

      <footer>
        <BookOpen size={16} aria-hidden />
        Built as a personal notebook for projects, posts, and the next lap.
      </footer>
    </main>
  );
}
