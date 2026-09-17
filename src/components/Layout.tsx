import { useEffect, useRef, useState } from "react";
import type { ReactNode } from "react";
import { Link, NavLink, useLocation } from "react-router-dom";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import PageMetadata from "./PageMetadata";
import { Arrow, SocialIcon } from "./Icons";
import { useContent } from "../content/store";

export function Socials({ labels = false }: { labels?: boolean }) {
  const { profile } = useContent();
  const socialLinks = [
    { kind: "github", name: "GitHub", url: profile.github },
    { kind: "linkedin", name: "LinkedIn", url: profile.linkedin },
    {
      kind: "instagram",
      name: "Instagram",
      url: profile.instagram ?? "https://www.instagram.com/nachikethreddy_ynr/",
    },
    { kind: "x", name: "X", url: profile.x ?? "https://x.com/Nachikethreddyy" },
  ] as const;
  return (
    <div className={`social-links ${labels ? "with-labels" : ""}`}>
      {socialLinks.map((s) => (
        <a
          key={s.kind}
          href={s.url}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={`${s.name} (opens in a new tab)`}
        >
          <SocialIcon kind={s.kind} />
          {labels && <span>{s.name}</span>}
        </a>
      ))}
    </div>
  );
}

export default function Layout({ children }: { children: ReactNode }) {
  const { profile } = useContent();
  const [open, setOpen] = useState(false);
  const dialog = useRef<HTMLDialogElement>(null);
  const menuButton = useRef<HTMLButtonElement>(null);
  const location = useLocation();
  useEffect(() => {
    setOpen(false);
  }, [location.pathname, location.hash]);
  useEffect(() => {
    if (open) {
      dialog.current?.showModal();
      document.body.style.overflow = "hidden";
    } else {
      dialog.current?.close();
      document.body.style.removeProperty("overflow");
    }
    return () => {
      document.body.style.removeProperty("overflow");
    };
  }, [open]);
  useGSAP(
    () => {
      if (
        !open ||
        window.matchMedia("(prefers-reduced-motion: reduce)").matches
      )
        return;
      gsap.fromTo(
        ".menu-link",
        { y: 30, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.55,
          stagger: 0.065,
          ease: "power3.out",
        },
      );
    },
    { scope: dialog, dependencies: [open], revertOnUpdate: true },
  );
  const close = () => {
    setOpen(false);
    menuButton.current?.focus();
  };
  return (
    <>
      <PageMetadata />
      <Link
        to={{
          pathname: location.pathname,
          search: location.search,
          hash: "#main",
        }}
        className="skip-link"
      >
        Skip to content
      </Link>
      <header className="site-nav shell">
        <Link to="/" className="brand" aria-label="Nachiketh Reddy home">
          Nachiketh<span> Reddy</span>
          <i>.</i>
        </Link>
        <nav className="glass-nav" aria-label="Main navigation">
          <NavLink to="/" end>
            Home
          </NavLink>
          <NavLink to="/projects">Work</NavLink>
          <NavLink to="/writing">Writing</NavLink>
          <Link to="/#about">About</Link>
        </nav>
        <a
          className="nav-contact"
          href={profile.linkedin}
          target="_blank"
          rel="noopener noreferrer"
        >
          Say hello <Arrow diagonal />
        </a>
        <button
          className="menu-toggle"
          ref={menuButton}
          onClick={() => setOpen(true)}
          aria-expanded={open}
          aria-controls="navigation-menu"
        >
          <span>Menu</span>
          <i />
          <i />
        </button>
      </header>
      <dialog
        id="navigation-menu"
        aria-label="Navigation"
        ref={dialog}
        className="navigation-menu"
        onCancel={(event) => {
          event.preventDefault();
          close();
        }}
        onClick={(event) => {
          if (event.target === event.currentTarget) close();
        }}
      >
        <div className="menu-inner">
          <div className="menu-top">
            <span>Nachiketh Reddy</span>
            <button onClick={close} aria-label="Close navigation">
              Close <span aria-hidden="true">×</span>
            </button>
          </div>
          <nav aria-label="Expanded navigation">
            {[
              ["/", "Home"],
              ["/projects", "Work"],
              ["/writing", "Writing"],
              ["/#about", "About"],
              ["/#ai", "AI & workflows"],
              ["/#contact", "Contact"],
            ].map(([to, label], index) => (
              <Link className="menu-link" key={to} to={to} onClick={close}>
                <small>0{index + 1}</small>
                {label}
                <Arrow />
              </Link>
            ))}
          </nav>
          <div className="menu-bottom">
            <p>
              {profile.location} · UTC+8
              <br />
              <span>{profile.availability}</span>
            </p>
            <Socials />
          </div>
        </div>
      </dialog>
      <main id="main" tabIndex={-1}>
        {children}
      </main>
      <footer className="footer" id="contact">
        <div className="shell">
          <div className="footer-top">
            <p>
              <span className="availability-dot" /> {profile.availability}
            </p>
            <p>{profile.location} · Open to remote</p>
          </div>
          <div className="footer-call">
            <h2>
              Have something
              <br />
              in mind?
            </h2>
            <a
              href={profile.linkedin}
              target="_blank"
              rel="noopener noreferrer"
              className="contact-orbit"
              aria-label="Say hello on LinkedIn"
            >
              <span>Say hello</span>
              <Arrow diagonal />
            </a>
          </div>
          <div className="footer-links">
            <p>
              A project, an internship, or a good conversation.
              <br />
              I’d like to hear about it.
            </p>
            <div>
              <Link to="/projects">Projects</Link>
              <Link to="/writing">Writing</Link>
              <Link to="/#about">About me</Link>
            </div>
            <Socials labels />
          </div>
          <div className="footer-name" aria-hidden="true">
            nachiketh<span>.</span>
          </div>
          <div className="footer-bottom">
            <span>© {new Date().getFullYear()} Nachiketh Reddy</span>
            <span>Made with curiosity. Still iterating.</span>
            <Link
              to={{
                pathname: location.pathname,
                search: location.search,
                hash: "#main",
              }}
            >
              Back to top ↑
            </Link>
          </div>
        </div>
      </footer>
    </>
  );
}
