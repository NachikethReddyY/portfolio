import { projectFields, postFields } from "../legacy/queries.ts";
// Both schema generations remain readable; drafts are excluded and scheduled posts are hidden until their date.
export const contentQuery = `{
 "profile": *[_type == "profile" && !(_id in path("drafts.**"))][0],
 "projects": *[_type == "caseStudy" && hidden != true && !(_id in path("drafts.**"))] | order(year desc){..., "slug":slug.current, coverUpload{..., asset->{url}}, "image":coalesce(coverUpload.asset->url,image,""), defined(gallery) => {"gallery":gallery[]{..., upload{..., asset->{url}}, "url":coalesce(upload.asset->url,url)}}, "links":coalesce(links,[]), body[]{..., _type == "contentImage" => {upload{..., asset->{url}}, "url":coalesce(upload.asset->url,url)}}},
 "articles": *[_type == "article" && hidden != true && publishedAt <= now() && !(_id in path("drafts.**"))] | order(publishedAt desc){..., "slug":slug.current, coverUpload{..., asset->{url}}, "cover":coalesce(coverUpload.asset->url,cover,""), "sources":coalesce(sources,[]), body[]{..., _type == "contentImage" => {upload{..., asset->{url}}, "url":coalesce(upload.asset->url,url)}}},
 "hiddenProjects": *[_type == "caseStudy" && hidden == true && !(_id in path("drafts.**"))].slug.current,
 "hiddenArticles": *[_type == "article" && (hidden == true || publishedAt > now()) && !(_id in path("drafts.**"))].slug.current,
 "experience": *[_type == "experience" && !(_id in path("drafts.**"))] | order(order asc, _createdAt asc){..., "id":coalesce(id,_id)},
 "legacyProjects": *[_type == "project" && defined(title) && defined(slug.current) && defined(summary) && !(_id in path("drafts.**"))]{${projectFields}},
 "legacyArticles": *[_type == "post" && defined(title) && defined(slug.current) && publishedAt <= now() && !(_id in path("drafts.**"))]{${postFields}}
}`;
