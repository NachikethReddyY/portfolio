import { ArrowLeft, ArrowUpRight } from "lucide-react";
import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import type { Post } from "../types";
import { fallbackPosts } from "../data/fallback";
import { getPosts, isSanityConfigured } from "../lib/sanity";

export function BlogIndex() {
  const [posts, setPosts] = useState<Post[]>(fallbackPosts);

  useEffect(() => {
    void getPosts().then(setPosts);
  }, []);

  return (
    <main className="site-shell inner-page">
      <header className="nav">
        <Link className="back-link" to="/">
          <ArrowLeft size={18} aria-hidden />
          Home
        </Link>
        <span className="live-dot">Blog {isSanityConfigured ? "live" : "demo"}</span>
      </header>
      <section className="section page-hero">
        <p className="section-kicker">Blog</p>
        <h1>Build notes, AI experiments, and things worth remembering.</h1>
        <p>
          The simple version: write posts in Sanity, publish them, and they show up here. The demo posts keep the
          page useful until your Sanity project is connected.
        </p>
      </section>
      <section className="section post-list" aria-label="All posts">
        {posts.length ? (
          posts.map((post) => (
            <Link className="post-row" to={`/blog/${post.slug}`} key={post.slug}>
              <div>
                <span>{new Date(post.publishedAt).toLocaleDateString("en-SG", { dateStyle: "medium" })}</span>
                <h2>{post.title}</h2>
                <p>{post.excerpt}</p>
              </div>
              <ArrowUpRight size={20} aria-hidden />
            </Link>
          ))
        ) : (
          <div className="empty-state">
            <h2>No posts yet</h2>
            <p>Publish the first post in Sanity and it will appear here automatically.</p>
          </div>
        )}
      </section>
    </main>
  );
}
