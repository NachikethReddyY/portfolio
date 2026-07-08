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

  return (
    <>
      <Seo
        title={`Blog | ${settings.name}`}
        description="Technical writing, learning notes, project reflections, and frontend development essays."
      />
      <Section className="pb-10 pt-14 sm:pt-20">
        <div className="max-w-4xl">
          <p className="font-tech text-sm font-bold text-violet">Developer Publication</p>
          <h1 className="mt-4 font-display text-5xl font-black leading-[0.98] text-balance text-ink sm:text-6xl">
            Notes from learning full-stack and AI in public.
          </h1>
          <p className="mt-6 text-xl font-semibold leading-8 text-primary-strong text-pretty">
            Writing about decisions, constraints, mistakes, and learning makes the work easier to
            trust. This is where technical notes become a record of growth.
          </p>
        </div>
        {error ? (
          <div className="mt-8">
            <ErrorState message={error} />
          </div>
        ) : null}
      </Section>
      <Section className="pt-4">
        <div className="grid gap-8 md:grid-cols-[repeat(auto-fit,minmax(320px,1fr))]">
          {posts.map((post) => (
            <BlogCard key={post._id} post={post} />
          ))}
        </div>
      </Section>
    </>
  );
}
