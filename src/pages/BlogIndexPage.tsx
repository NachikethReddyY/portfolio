import { Search } from 'lucide-react';
import { useMemo, useState } from 'react';

import { BlogCard } from '../components/cards/BlogCard';
import { Seo } from '../components/Seo';
import { ErrorState } from '../components/ui/ErrorState';
import { Section } from '../components/ui/Section';
import { usePageSettings } from '../hooks/usePageSettings';
import { useSanityQuery } from '../hooks/useSanityQuery';
import { fallbackPosts } from '../lib/fallbackData';
import { allPostsQuery } from '../lib/sanity/queries';
import type { BlogPost } from '../lib/types';

export function BlogIndexPage() {
  const settings = usePageSettings();
  const { data: posts, error } = useSanityQuery<BlogPost[]>(allPostsQuery, fallbackPosts);
  const [query, setQuery] = useState('');
  const filteredPosts = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();

    if (!normalizedQuery) {
      return posts;
    }

    return posts.filter((post) =>
      [post.title, post.excerpt, ...post.categories.map((category) => category.title)]
        .join(' ')
        .toLowerCase()
        .includes(normalizedQuery),
    );
  }, [posts, query]);

  return (
    <>
      <Seo
        title={`Writing | ${settings.name}`}
        description="Technical writing, learning notes, project reflections, and full-stack development essays."
      />
      <Section className="!pb-8 !pt-12 lg:!pb-10 lg:!pt-16">
        <div className="max-w-4xl">
          <p className="font-tech text-xs font-semibold uppercase tracking-[0.18em] text-primary-strong">
            Writing
          </p>
          <h1 className="mt-4 max-w-[16ch] font-display text-5xl font-semibold leading-[0.98] tracking-[-0.035em] text-ink sm:text-6xl">
            My blog.
          </h1>
        </div>
        {error ? (
          <div className="mt-8">
            <ErrorState message={error} />
          </div>
        ) : null}
      </Section>

      <Section className="!pb-20 !pt-4 lg:!pb-24 lg:!pt-6">
        <div className="writing-toolbar">
          <label htmlFor="writing-search" className="font-tech text-[0.68rem] font-semibold uppercase text-soft">
            Search writing
          </label>
          <div className="relative mt-2 max-w-2xl">
            <Search
              aria-hidden="true"
              className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-muted"
              size={17}
            />
            <input
              id="writing-search"
              type="search"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Search by title, topic, or keyword"
              className="min-h-12 w-full border border-primary/40 bg-terminal py-3 pl-10 pr-4 text-sm text-ink placeholder:text-soft focus:border-primary focus:outline-none"
            />
          </div>
          <p className="mt-3 font-tech text-xs text-soft" aria-live="polite">
            {filteredPosts.length} {filteredPosts.length === 1 ? 'note' : 'notes'}
          </p>
        </div>

        <div className="mt-8">
          {filteredPosts.length ? (
            <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
              {filteredPosts.map((post) => (
                <BlogCard key={post._id} post={post} />
              ))}
            </div>
          ) : (
            <div className="max-w-2xl border border-primary/30 bg-surface p-6">
              <p className="font-semibold text-ink">No notes match that search.</p>
              <p className="mt-2 text-sm text-muted">Try a project name or topic such as AI, TypeScript, or learning.</p>
            </div>
          )}
        </div>
      </Section>
    </>
  );
}
