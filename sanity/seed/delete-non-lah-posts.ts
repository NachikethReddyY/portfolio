import { getCliClient } from 'sanity/cli';

const client = getCliClient({ apiVersion: '2026-07-08' });
const lahPostId = 'post-currently-building-lah';

const homePage = await client.fetch<{ _id: string } | null>('*[_type == "homePage"][0]{_id}');

if (homePage?._id) {
  await client
    .patch(homePage._id)
    .set({
      highlightedPosts: [{ _key: lahPostId, _type: 'reference', _ref: lahPostId }],
    })
    .commit();
}

const postsToDelete = await client.fetch<Array<{ _id: string; title: string }>>(
  '*[_type == "post" && _id != $lahPostId]{_id, title}',
  { lahPostId },
);

for (const post of postsToDelete) {
  await client.delete(post._id);
  console.log(`Deleted ${post._id}: ${post.title}`);
}

console.log(`Kept ${lahPostId} as the only blog post.`);
