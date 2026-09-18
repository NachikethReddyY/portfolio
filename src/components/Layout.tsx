import { useEffect, useRef, useState } from "react";
import type { ReactNode } from "react";
import { Link, useLocation } from "react-router-dom";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import PageMetadata from "./PageMetadata";
import { SoundFeedback } from "./SoundFeedback";
import { ConnectAtmosphere } from "./ConnectAtmosphere";
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
  const [compactBrand, setCompactBrand] = useState(false);
  useEffect(() => {
    const updateBrand = () => setCompactBrand(window.scrollY > 80);
    updateBrand();
    window.addEventListener("scroll", updateBrand, { passive: true });
    return () => window.removeEventListener("scroll", updateBrand);
  }, []);
  const dialog = useRef<HTMLDialogElement>(null);
  const menuButton = useRef<HTMLButtonElement>(null);
  const location = useLocation();
  const menuAnimation = useRef<gsap.core.Timeline | null>(null);
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
      menuAnimation.current = gsap
        .timeline()
        .fromTo(
          dialog.current,
          { clipPath: "inset(0 0 0 100%)" },
          {
            clipPath: "inset(0 0 0 0%)",
            duration: 0.42,
            ease: "power3.inOut",
          },
        )
        .fromTo(
          ".menu-top,.menu-bottom",
          { opacity: 0 },
          {
            opacity: 1,
            duration: 0.2,
          },
          0.25,
        )
        .fromTo(
          ".menu-link",
          { x: 28, opacity: 0 },
          {
            x: 0,
            opacity: 1,
            duration: 0.34,
            stagger: 0.045,
            ease: "power3.out",
          },
          0.25,
        );
      return () => {
        menuAnimation.current = null;
      };
    },
    { scope: dialog, dependencies: [open], revertOnUpdate: true },
  );
  const close = () => {
    const animation = menuAnimation.current;
    if (
      animation &&
      !window.matchMedia("(prefers-reduced-motion: reduce)").matches
    ) {
      animation
        .eventCallback("onReverseComplete", () => {
          setOpen(false);
          menuButton.current?.focus();
        })
        .timeScale(1.5)
        .reverse();
    } else {
      setOpen(false);
      menuButton.current?.focus();
    }
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
        <Link
          to="/"
          className={`brand${compactBrand ? " is-compact" : ""}`}
          aria-label="Nachiketh Reddy home"
        >
          <span className="brand-full" aria-hidden="true">
            Nachiketh<span> Reddy</span>
            <i>.</i>
          </span>
          <span className="brand-initial" aria-hidden="true">
            N
          </span>
        </Link>
        <a
          className="nav-contact"
          href={profile.linkedin}
          target="_blank"
          rel="noopener noreferrer"
        >
          Connect <Arrow diagonal />
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
                <span className="menu-link-label">{label}</span>
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
        <ConnectAtmosphere />
        <div className="shell">
          <div className="footer-top">
            <p>
              <span className="availability-dot" /> {profile.availability}
            </p>
            <p>{profile.location} · Open to remote</p>
          </div>
          <div className="footer-call">
            <h2>
              Connect
              <br />
              with me.
            </h2>
            <a
              href={profile.linkedin}
              target="_blank"
              rel="noopener noreferrer"
              className="contact-orbit"
              aria-label="Connect on LinkedIn"
            >
              <span>Connect</span>
              <Arrow diagonal />
            </a>
          </div>
          <div className="footer-links">
            <p>
              Connect with me on{" "}
              <a
                href={profile.x ?? "https://x.com/Nachikethreddyy"}
                target="_blank"
                rel="noopener noreferrer"
              >
                X
              </a>{" "}
              or{" "}
              <a
                href={profile.linkedin}
                target="_blank"
                rel="noopener noreferrer"
              >
                LinkedIn
              </a>
              .
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
            <SoundFeedback />
            <span>© {new Date().getFullYear()} Nachiketh Reddy</span>
            <span className="footer-location">{profile.location}</span>
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
