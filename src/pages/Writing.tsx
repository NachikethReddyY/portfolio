import { useLayoutEffect, useState, useMemo } from "react";
import { portfolioImage } from "../content/images";
import {
  Link,
  useParams,
  useSearchParams,
  useNavigationType,
} from "react-router-dom";
import { useContent } from "../content/store";
import { Arrow } from "../components/Icons";
import { RichContent, LegacyRichContent } from "../components/RichContent";
import { usePageMotion } from "../usePageMotion";
import type { Article } from "../content/types";
import NotFound from "./NotFound";
import { ReadingContents } from "../components/ReadingContents";
import { readingSections } from "../lib/readingContents";
const date = (value: string) =>
  new Intl.DateTimeFormat("en", {
    day: "numeric",
    month: "short",
    year: "numeric",
  }).format(new Date(value));
export function ArticleRow({
  article,
  index = 0,
}: {
  article: Article;
  index?: number;
}) {
  return (
    <Link to={`/writing/${article.slug}`} className="article-row">
      <span className="article-num">{String(index + 1).padStart(2, "0")}</span>
      <div>
        <span className="article-category">{article.category}</span>
        <h3>{article.title}</h3>
        <p>{article.excerpt}</p>
        <span className="article-date">
          {date(article.publishedAt)} · {article.readMinutes} min read
        </span>
      </div>
      <Arrow diagonal />
    </Link>
  );
}
export default function Writing() {
  const { articles } = useContent();
  const [searchParams, setSearchParams] = useSearchParams();
  const navigationType = useNavigationType();
  const [query, setDraftQuery] = useState(() => searchParams.get("q") ?? "");
  useLayoutEffect(() => {
    if (navigationType !== "REPLACE")
      setDraftQuery(searchParams.get("q") ?? "");
  }, [searchParams, navigationType]);
  const setQuery = (value: string) => {
    // Keep typing synchronous; router updates run in a React transition.
    setDraftQuery(value);
    setSearchParams(
      (current) => {
        const next = new URLSearchParams(current);
        if (value) next.set("q", value);
        else next.delete("q");
        return next;
      },
      { replace: true, preventScrollReset: true },
    );
  };
  const scope = usePageMotion();
  const filtered = articles.filter((a) =>
    `${a.title} ${a.excerpt} ${a.category}`
      .toLowerCase()
      .includes(query.toLowerCase()),
  );
  return (
    <section ref={scope} className="index-page writing-index shell">
      <header className="page-heading">
        <p>Writing & field notes</p>
        <h1 tabIndex={-1}>
          Things I’m
          <br />
          working <em>through.</em>
        </h1>
        <div className="page-intro">
          <p>
            Notes from building software, working with AI, and finding out why
            the first attempt didn’t work.
            <a className="writing-rss" href="/rss.xml">
              Follow via RSS <Arrow diagonal />
            </a>
          </p>
          <label className="search-field">
            <span>Search writing</span>
            <input
              type="search"
              name="writing-search"
              placeholder="Search notes…"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
          </label>
        </div>
      </header>
      <div aria-live="polite">
        {filtered.length ? (
          filtered.map((a, i) => (
            <ArticleRow key={a.slug} article={a} index={i} />
          ))
        ) : (
          <div className="empty-state">
            <h2>No notes match “{query}”.</h2>
            <button onClick={() => setQuery("")}>Show all writing</button>
          </div>
        )}
      </div>
    </section>
  );
}
export function ArticleDetail() {
  const { slug } = useParams();
  const { articles, profile } = useContent();
  const article = articles.find((a) => a.slug === slug);
  const scope = usePageMotion(slug);
  const sections = useMemo(
    () => readingSections(article?.body ?? []),
    [article],
  );
  if (!article) return <NotFound />;
  const next = articles[(articles.indexOf(article) + 1) % articles.length];
  return (
    <article ref={scope} className="article-page shell">
      <header className="article-heading">
        <Link className="back-link" to="/writing">
          ← All writing
        </Link>
        <div className="detail-kicker">
          <span>{article.category}</span>
          <span>{article.readMinutes} min read</span>
        </div>
        <h1 tabIndex={-1}>{article.title}</h1>
        <p>{article.excerpt}</p>
        <div className="article-byline">
          <img
            src="/images/nachiketh-sketch.webp"
            alt=""
            width="44"
            height="44"
          />
          <div>
            <span>Nachiketh Reddy</span>
            <time dateTime={article.publishedAt}>
              {date(article.publishedAt)}
            </time>
          </div>
        </div>
      </header>
      <div
        className={`reading-layout article-reading${sections.length ? "" : " reading-layout-solo"}`}
      >
        <ReadingContents sections={sections} label="Article contents" />
        <div className="article-body reading-main">
          {article.cover && (
            <figure>
              <img src={portfolioImage(article.cover, 1400)} alt="" />
            </figure>
          )}
          <RichContent body={article.body} />
          {article.legacyBody && (
            <LegacyRichContent body={article.legacyBody} />
          )}
          {article.sources.length > 0 && (
            <details className="article-sources">
              <summary>Sources & related work</summary>
              <ul>
                {article.sources.map((s) => (
                  <li key={s.url}>
                    <a href={s.url} target="_blank" rel="noopener noreferrer">
                      {s.label}
                      <Arrow diagonal />
                    </a>
                  </li>
                ))}
              </ul>
            </details>
          )}
          <div className="article-end">
            <p>Thanks for reading.</p>
            <a
              href={profile.x ?? "https://x.com/Nachikethreddyy"}
              target="_blank"
              rel="noopener noreferrer"
            >
              Continue the conversation on X <Arrow diagonal />
            </a>
          </div>
        </div>
      </div>
      <Link className="next-article" to={`/writing/${next.slug}`}>
        <span>Read next</span>
        <h2>{next.title}</h2>
        <Arrow />
      </Link>
    </article>
  );
}
