import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { resolveSiteUrl } from "../content/site";
import { useContent } from "../content/store";

export default function PageMetadata() {
  const location = useLocation();
  const { projects, articles } = useContent();
  useEffect(() => {
    const project = projects.find(
      (p) => location.pathname === `/projects/${p.slug}`,
    );
    const article = articles.find((p) =>
      ["/writing/", "/blog/"].some(
        (prefix) => location.pathname === prefix + p.slug,
      ),
    );
    const missing =
      !project &&
      !article &&
      !["/", "/projects", "/writing", "/blog", "/about", "/contact"].includes(
        location.pathname,
      );
    const title = project
      ? `${project.name} — Nachiketh Reddy`
      : article
        ? `${article.title} — Nachiketh Reddy`
        : location.pathname === "/projects"
          ? "Projects — Nachiketh Reddy"
          : location.pathname === "/writing"
            ? "Writing — Nachiketh Reddy"
            : missing
              ? "Page not found — Nachiketh Reddy"
              : "Nachiketh Reddy — Full-stack developer & aspiring AI engineer";
    const description =
      project?.summary ||
      article?.excerpt ||
      (missing
        ? "This page could not be found. Explore Nachiketh’s projects and writing."
        : "") ||
      "Student developer in Singapore building web applications, local AI tools, and agent workflows. Available for internships and projects.";
    const origin = resolveSiteUrl(import.meta.env.VITE_SITE_URL);
    const canonical = new URL(
      location.pathname.replace(/^\/blog\//, "/writing/"),
      origin,
    ).href;
    document.title = title;
    const setMeta = (
      attribute: "name" | "property",
      key: string,
      content: string,
    ) => {
      let tag = document.head.querySelector<HTMLMetaElement>(
        `meta[${attribute}="${key}"]`,
      );
      if (!tag) {
        tag = document.createElement("meta");
        tag.setAttribute(attribute, key);
        document.head.appendChild(tag);
      }
      tag.content = content;
    };
    setMeta("name", "description", description);
    setMeta("property", "og:title", title);
    setMeta("property", "og:description", description);
    setMeta("property", "og:url", canonical);
    setMeta("property", "og:type", article ? "article" : "website");
    setMeta(
      "property",
      "og:image",
      new URL(
        project?.image || article?.cover || "/images/nachiketh-sketch.webp",
        origin,
      ).href,
    );
    setMeta("name", "twitter:card", "summary_large_image");
    setMeta("name", "twitter:creator", "@Nachikethreddyy");
    let link = document.head.querySelector<HTMLLinkElement>(
      'link[rel="canonical"]',
    );
    if (!link) {
      link = document.createElement("link");
      link.rel = "canonical";
      document.head.appendChild(link);
    }
    link.href = canonical;
  }, [location.pathname, projects, articles]);
  return null;
}
