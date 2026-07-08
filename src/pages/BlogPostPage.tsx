import { Link, useParams } from 'react-router-dom';

import { RichTextRenderer } from '../components/RichTextRenderer';
import { Seo } from '../components/Seo';
import { Section } from '../components/ui/Section';
import { usePageSettings } from '../hooks/usePageSettings';
import { useSanityQuery } from '../hooks/useSanityQuery';
import { formatDate } from '../lib/dates';
import { fallbackPosts } from '../lib/fallbackData';
import { getReadingTime } from '../lib/readingTime';
import { postBySlugQuery } from '../lib/sanity/queries';
import type { BlogPost } from '../lib/types';

export function BlogPostPage() {
  const { slug = '' } = useParams();
  const settings = usePageSettings();
  const fallbackPost = fallbackPosts.find((post) => post.slug === slug) ?? fallbackPosts[0];
  const { data: post } = useSanityQuery<BlogPost>(postBySlugQuery, fallbackPost, { slug });

  return (
    <>
      <Seo
        title={post.seoTitle ?? `${post.title} | ${settings.name}`}
        description={post.seoDescription ?? post.excerpt}
      />
      <Section className="pb-10 pt-14 sm:pt-20">
        <Link
          to="/blog"
          className="pressable hover-text-on-accent inline-flex min-h-11 items-center rounded-md border-2 border-ink bg-surface px-3 text-sm font-bold text-ink hover:bg-violet"
        >
          Back to blog
        </Link>
        <article className="mx-auto mt-6 max-w-3xl">
          <div className="flex flex-wrap gap-2">
            {post.categories.map((category) => (
              <span
                key={category._id}
                className="rounded-md border-2 border-ink bg-accent px-3 py-1 font-tech text-[0.68rem] font-bold text-on-accent"
              >
                {category.title}
              </span>
            ))}
          </div>
          <h1 className="mt-5 font-display text-5xl font-black leading-[0.98] text-balance text-ink sm:text-6xl">
            {post.title}
          </h1>
          <p className="mt-6 text-xl font-semibold leading-8 text-primary-strong text-pretty">
            {post.excerpt}
          </p>
          <div className="mt-8 flex flex-wrap gap-x-4 gap-y-2 border-y-2 border-ink py-4 font-tech text-xs font-semibold text-muted">
            <time dateTime={post.publishedAt}>{formatDate(post.publishedAt)}</time>
            <span>{post.readingTime ?? getReadingTime(post.body)}</span>
            {post.author ? <span>{post.author.name}</span> : null}
          </div>
          <RichTextRenderer value={post.body} />
        </article>
      </Section>
    </>
  );
}
