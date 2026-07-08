import { Link } from 'react-router-dom';

import { formatDate } from '../../lib/dates';
import { getReadingTime } from '../../lib/readingTime';
import { imageUrlFor } from '../../lib/sanity/image';
import type { BlogPost } from '../../lib/types';

type BlogCardProps = {
  post: BlogPost;
};

function limitSentences(value: string, maxSentences = 3) {
  const sentences = value.match(/[^.!?]+[.!?]+|[^.!?]+$/g)?.map((sentence) => sentence.trim()) ?? [];

  if (sentences.length <= maxSentences) {
    return value;
  }

  return `${sentences.slice(0, maxSentences).join(' ')}...`;
}

export function BlogCard({ post }: BlogCardProps) {
  const featuredImageUrl = imageUrlFor(post.featuredImage, 720);

  return (
    <Link
      to={`/blog/${post.slug}`}
      className="brutal-panel-soft group block overflow-hidden transition duration-300 ease-[var(--ease-premium)] hover:-translate-x-0.5 hover:-translate-y-0.5"
    >
      {featuredImageUrl ? (
        <div className="border-b border-[#00d2ff]/24">
          <img
            src={featuredImageUrl}
            alt={post.featuredImage?.alt ?? post.title}
            className="h-40 w-full object-cover"
          />
        </div>
      ) : null}

      <div className="p-4 sm:p-5">
        <div className="flex flex-wrap gap-2">
          {post.categories.slice(0, 3).map((category) => (
            <span
              key={category._id}
              className="rounded-none border border-[#00d2ff]/45 bg-terminal px-2.5 py-1 font-tech text-[0.68rem] font-bold text-primary-strong"
            >
              {category.title}
            </span>
          ))}
        </div>

        <h3 className="mt-5 max-w-2xl font-display text-xl font-black leading-[1.35] text-balance text-ink sm:text-2xl">
          <span className="group-hover:text-primary-strong">
            {post.title}
          </span>
        </h3>
        <p className="mt-3 max-w-[66ch] text-sm leading-6 text-pretty text-muted">
          {limitSentences(post.excerpt)}
        </p>

        <div className="mt-5 flex flex-wrap items-center gap-x-4 gap-y-2 border-t border-[#00d2ff]/24 pt-4 font-tech text-xs font-semibold text-muted">
          <time dateTime={post.publishedAt}>{formatDate(post.publishedAt)}</time>
          <span>{post.readingTime ?? getReadingTime(post.markdownBody ?? post.body)}</span>
          {post.author ? <span>{post.author.name}</span> : null}
        </div>
      </div>
    </Link>
  );
}
