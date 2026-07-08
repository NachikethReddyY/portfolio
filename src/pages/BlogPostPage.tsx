import { useParams } from 'react-router-dom';

import { RichTextRenderer } from '../components/RichTextRenderer';
import { Seo } from '../components/Seo';
import { Section } from '../components/ui/Section';
import { usePageSettings } from '../hooks/usePageSettings';
import { useSanityQuery } from '../hooks/useSanityQuery';
import { formatDate } from '../lib/dates';
import { fallbackPosts } from '../lib/fallbackData';
import { getReadingTime } from '../lib/readingTime';
import { imageUrlFor } from '../lib/sanity/image';
import { postBySlugQuery } from '../lib/sanity/queries';
import type { BlogPost } from '../lib/types';

export function BlogPostPage() {
  const { slug = '' } = useParams();
  const settings = usePageSettings();
  const fallbackPost = fallbackPosts.find((post) => post.slug === slug) ?? fallbackPosts[0];
  const { data: post } = useSanityQuery<BlogPost>(postBySlugQuery, fallbackPost, { slug });
  const featuredImageUrl = imageUrlFor(post.featuredImage, 1600);
  const bodyContent = post.markdownBody ?? post.body;
  const readingTime = post.readingTime ?? getReadingTime(bodyContent);
  const authorName = post.author?.name ?? settings.name;
  const authorImageUrl = imageUrlFor(post.author?.image, 160);

  return (
    <>
      <Seo
        title={post.seoTitle ?? `${post.title} | ${settings.name}`}
        description={post.seoDescription ?? post.excerpt}
      />
      <Section className="article-page pb-16 pt-12 sm:pt-18">
        <article className="mx-auto max-w-5xl">
          <header className="article-hero reveal">
            <h1 className="article-title">{post.title}</h1>
            <p className="article-deck">{post.excerpt}</p>
            {featuredImageUrl ? (
              <div className="article-media article-media-blog">
                <img src={featuredImageUrl} alt={post.featuredImage?.alt ?? post.title} />
              </div>
            ) : null}
          </header>

          <div className="article-meta-rail">
            <div className="article-author">
              <span className="article-avatar" aria-hidden="true">
                <img src={authorImageUrl ?? '/assets/nachiketh-dark-profile-v3.png'} alt="" />
              </span>
              <span>{authorName}</span>
            </div>
            <div className="article-meta">
              <span>{readingTime}</span>
              <time dateTime={post.publishedAt}>{formatDate(post.publishedAt)}</time>
            </div>
          </div>

          <div className="article-body">
            <RichTextRenderer value={bodyContent} />
          </div>
        </article>
      </Section>
    </>
  );
}
