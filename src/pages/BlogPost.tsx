import { PortableText, type PortableTextComponents } from "@portabletext/react";
import { ArrowLeft, ExternalLink } from "lucide-react";
import { Link, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import type { PortableTextBlock } from "@portabletext/types";
import type { Post } from "../types";
import { getPost } from "../lib/sanity";

const portableTextComponents: PortableTextComponents = {
  block: {
    h2: ({ children, value }) => (
      <h2 id={typeof value?._key === "string" ? value._key : undefined}>{children}</h2>
    ),
    normal: ({ children }) => <p>{children}</p>,
  },
};

export function BlogPost() {
  const { slug } = useParams();
  const [post, setPost] = useState<Post | null | undefined>(undefined);

  useEffect(() => {
    if (!slug) return;
    void getPost(slug).then(setPost);
  }, [slug]);

  if (post === undefined) {
    return (
      <main className="site-shell inner-page">
        <div className="empty-state">Loading post...</div>
      </main>
    );
  }

  if (!post) {
    return (
      <main className="site-shell inner-page">
        <Link className="back-link" to="/blog">
          <ArrowLeft size={18} aria-hidden />
          Blog
        </Link>
        <div className="empty-state">
          <h1>Post not found</h1>
          <p>This draft might still be in the garage.</p>
        </div>
      </main>
    );
  }

  return (
    <main className="site-shell inner-page">
      <header className="nav article-nav">
        <Link className="back-link" to="/blog">
          <ArrowLeft size={18} aria-hidden />
          Blog
        </Link>
        <Link className="text-link" to="/">
          Nachiketh Reddy
        </Link>
      </header>
      <article className="article-shell">
        <header className="article-hero">
          <div className="article-meta">
            <span>{new Date(post.publishedAt).toLocaleDateString("en-SG", { dateStyle: "medium" })}</span>
            {post.category && <span>{post.category}</span>}
            {post.readTime && <span>{post.readTime}</span>}
          </div>
          <h1>{post.title}</h1>
          <p>{post.excerpt}</p>
        </header>

        <div className="article-feature" aria-label="Benchmark interpretation summary">
          <div>
            <span className="feature-label">Signal</span>
            <strong>Scores become useful when the caveats travel with them.</strong>
          </div>
          <div className="feature-orbit" aria-hidden>
            <span />
            <span />
            <span />
          </div>
        </div>

        <div className="article-layout">
          {post.toc?.length ? (
            <aside className="article-toc" aria-label="Table of contents">
              <p>Table of contents</p>
              {post.toc.map((item) => (
                <a href={`#${item.anchor}`} key={item.anchor}>
                  {item.title}
                </a>
              ))}
            </aside>
          ) : null}

          <div className="article-main">
            <div className="article-tags">{post.tags.map((tag) => <span key={tag}>{tag}</span>)}</div>
            <div className="article-body">
              {Array.isArray(post.body) ? (
                <PortableText value={post.body as PortableTextBlock[]} components={portableTextComponents} />
              ) : (
                <p>{post.body}</p>
              )}
            </div>

            {post.benchmarkRows?.length ? (
              <section className="benchmark-section" aria-labelledby="benchmark-table-title">
                <div>
                  <p className="section-kicker">Benchmark snapshot</p>
                  <h2 id="benchmark-table-title">Compare the score with the setup.</h2>
                </div>
                <div className="benchmark-table" role="table">
                  {post.benchmarkRows.map((row) => (
                    <div className="benchmark-row" role="row" key={row.metric}>
                      <div className="benchmark-metric" role="cell">
                        <strong>{row.metric}</strong>
                        <span>{row.note}</span>
                      </div>
                      {row.values.map((value) => (
                        <div className={value.highlighted ? "benchmark-value is-highlighted" : "benchmark-value"} role="cell" key={value.model}>
                          <span>{value.model}</span>
                          <strong>{value.value}</strong>
                        </div>
                      ))}
                    </div>
                  ))}
                </div>
              </section>
            ) : null}

            {post.footnotes?.length ? (
              <section className="footnotes" aria-labelledby="footnotes-title">
                <h2 id="footnotes-title">Footnotes</h2>
                {post.footnotes.map((note, index) => (
                  <p key={note.label}>
                    <sup>{index + 1}</sup>
                    <span>{note.label}: </span>
                    {note.text}
                    {note.href && (
                      <a href={note.href} target="_blank" rel="noreferrer" aria-label={`${note.label} source`}>
                        <ExternalLink size={14} aria-hidden />
                      </a>
                    )}
                  </p>
                ))}
              </section>
            ) : null}
          </div>
        </div>
      </article>
    </main>
  );
}
