import { projectFields, postFields } from "../legacy/queries.ts";
// Both schema generations remain readable; drafts are excluded and scheduled posts are hidden until their date.
export const contentQuery = `{
 "profile": *[_type == "profile" && !(_id in path("drafts.**"))][0],
 "projects": *[_type == "caseStudy" && !(_id in path("drafts.**"))] | order(year desc){..., "slug":slug.current, "image":coalesce(coverUpload.asset->url,image,""), "links":coalesce(links,[]), body[]{..., _type == "contentImage" => {"url":coalesce(upload.asset->url,url)}}},
 "articles": *[_type == "article" && publishedAt <= now() && !(_id in path("drafts.**"))] | order(publishedAt desc){..., "slug":slug.current, "cover":coalesce(coverUpload.asset->url,cover,""), "sources":coalesce(sources,[]), body[]{..., _type == "contentImage" => {"url":coalesce(upload.asset->url,url)}}},
 "experience": *[_type == "experience" && !(_id in path("drafts.**"))]{..., "id":_id},
 "legacyProjects": *[_type == "project" && defined(title) && defined(slug.current) && defined(summary) && !(_id in path("drafts.**"))]{${projectFields}},
 "legacyArticles": *[_type == "post" && defined(title) && defined(slug.current) && publishedAt <= now() && !(_id in path("drafts.**"))]{${postFields}}
}`;
