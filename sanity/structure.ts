import type { StructureResolver } from 'sanity/structure';

const listedTypes = new Set([
  'author',
  'category',
  'homePage',
  'post',
  'project',
  'siteSettings',
  'skill',
  'socialLink',
]);

export const structure: StructureResolver = (S) =>
  S.list()
    .title('Portfolio CMS')
    .items([
      S.documentTypeListItem('post').title('Blog Posts'),
      S.documentTypeListItem('project').title('Project Pages'),
      S.divider(),
      S.listItem()
        .title('Homepage')
        .schemaType('homePage')
        .child(S.document().schemaType('homePage').documentId('homepage')),
      S.listItem()
        .title('Site Settings')
        .schemaType('siteSettings')
        .child(S.document().schemaType('siteSettings').documentId('site-settings')),
      S.divider(),
      S.documentTypeListItem('author').title('Authors'),
      S.documentTypeListItem('category').title('Blog Categories'),
      S.documentTypeListItem('skill').title('Skills / Technologies'),
      S.documentTypeListItem('socialLink').title('Social Links'),
      ...S.documentTypeListItems().filter((item) => {
        const id = item.getId();

        return id ? !listedTypes.has(id) : true;
      }),
    ]);
