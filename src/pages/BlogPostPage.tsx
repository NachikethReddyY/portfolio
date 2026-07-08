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
          className="pressable inline-flex min-h-11 items-center rounded-none border border-[#00d2ff] bg-[#0d1622] px-3 font-tech text-sm font-bold uppercase text-ink shadow-[5px_5px_0_#243a56] hover:-translate-x-0.5 hover:-translate-y-0.5"
        >
          Back to blog
        </Link>
        <article className="mx-auto mt-6 max-w-3xl">
          <div className="flex flex-wrap gap-2">
            {post.categories.map((category) => (
              <span
                key={category._id}
                className="rounded-none border border-[#00d2ff]/45 bg-terminal px-3 py-1 font-tech text-[0.68rem] font-bold text-primary-strong"
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
          <div className="mt-8 flex flex-wrap gap-x-4 gap-y-2 border-y border-[#00d2ff]/24 py-4 font-tech text-xs font-semibold text-muted">
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
