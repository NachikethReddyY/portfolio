import { Link } from 'react-router-dom';

import { formatDate } from '../../lib/dates';
import { getReadingTime } from '../../lib/readingTime';
import type { BlogPost } from '../../lib/types';

type BlogCardProps = {
  post: BlogPost;
};

export function BlogCard({ post }: BlogCardProps) {
  return (
    <article className="brutal-panel-soft rounded-lg p-5 transition duration-300 ease-[var(--ease-premium)] hover:-translate-y-1 sm:p-6">
      <div className="flex flex-wrap gap-2">
        {post.categories.slice(0, 3).map((category) => (
          <span
            key={category._id}
            className="rounded-md border-2 border-ink bg-accent px-2.5 py-1 font-tech text-[0.68rem] font-bold text-on-accent"
          >
            {category.title}
          </span>
        ))}
      </div>

      <h3 className="mt-5 max-w-2xl font-display text-2xl font-black leading-[1.35] text-balance text-ink">
        <Link to={`/blog/${post.slug}`} className="hover:text-violet">
          {post.title}
        </Link>
      </h3>
      <p className="mt-3 max-w-[66ch] text-pretty text-muted">{post.excerpt}</p>

      <div className="mt-6 flex flex-wrap items-center gap-x-4 gap-y-2 border-t-2 border-ink pt-4 font-tech text-xs font-semibold text-muted">
        <time dateTime={post.publishedAt}>{formatDate(post.publishedAt)}</time>
        <span>{post.readingTime ?? getReadingTime(post.body)}</span>
        {post.author ? <span>{post.author.name}</span> : null}
      </div>
    </article>
  );
}
