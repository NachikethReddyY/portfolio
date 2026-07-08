export const imageFields = `
  asset->{
    url,
    metadata {
      lqip,
      dimensions
    }
  },
  alt,
  caption
`;

export const skillFields = `
  _id,
  title,
  "slug": slug.current,
  category,
  proficiency,
  summary
`;

export const categoryFields = `
  _id,
  title,
  "slug": slug.current,
  description
`;

export const socialFields = `
  _id,
  label,
  url,
  kind
`;

export const authorFields = `
  _id,
  name,
  role,
  bio,
  image {
    ${imageFields}
  }
`;

export const projectFields = `
  _id,
  "createdAt": _createdAt,
  title,
  "slug": slug.current,
  summary,
  status,
  projectType,
  role,
  period,
  impact,
  featured,
  coverImage {
    ${imageFields}
  },
  gallery[] {
    ${imageFields}
  },
  "technologies": coalesce(technologies[]->{
    ${skillFields}
  }, []),
  problem,
  solution,
  "whatIBuilt": coalesce(whatIBuilt, []),
  "constraints": coalesce(constraints, []),
  "features": coalesce(features, []),
  githubUrl,
  demoUrl,
  "lessonsLearned": coalesce(lessonsLearned, []),
  "futureImprovements": coalesce(futureImprovements, []),
  body,
  seoTitle,
  seoDescription,
  seoImage {
    ${imageFields}
  }
`;

export const postFields = `
  _id,
  title,
  "slug": slug.current,
  excerpt,
  publishedAt,
  featuredImage {
    ${imageFields}
  },
  author->{
    ${authorFields}
  },
  categories[]->{
    ${categoryFields}
  },
  markdownBody,
  body,
  seoTitle,
  seoDescription,
  seoImage {
    ${imageFields}
  }
`;

export const siteSettingsQuery = `
  *[_type == "siteSettings"][0]{
    name,
    role,
    education,
    currentFocus,
    githubUsername,
    publicRepoCount,
    email,
    location,
    availability,
    shortBio,
    resumeUrl,
    portfolioUrl,
    socialLinks[]->{
      ${socialFields}
    },
    seoTitle,
    seoDescription,
    seoImage {
      ${imageFields}
    }
  }
`;

export const homePageQuery = `
  *[_type == "homePage"][0]{
    headline,
    subheadline,
    positioningStatement,
    primaryCtaLabel,
    primaryCtaHref,
    secondaryCtaLabel,
    secondaryCtaHref,
    focusAreas,
    featuredProjects[]->{
      ${projectFields}
    },
    highlightedPosts[]->{
      ${postFields}
    },
    skills[]->{
      ${skillFields}
    },
    seoTitle,
    seoDescription,
    seoImage {
      ${imageFields}
    }
  }
`;

export const allProjectsQuery = `
  *[
    _type == "project" &&
    defined(title) &&
    defined(slug.current) &&
    defined(summary) &&
    defined(status) &&
    defined(problem) &&
    defined(solution)
  ] | order(featured desc, _createdAt desc) {
    ${projectFields}
  }
`;

export const projectBySlugQuery = `
  *[
    _type == "project" &&
    slug.current == $slug &&
    defined(summary) &&
    defined(status) &&
    defined(problem) &&
    defined(solution)
  ][0] {
    ${projectFields}
  }
`;

export const allPostsQuery = `
  *[
    _type == "post" &&
    defined(title) &&
    defined(slug.current) &&
    defined(excerpt) &&
    defined(publishedAt)
  ] | order(publishedAt desc) {
    ${postFields}
  }
`;

export const postBySlugQuery = `
  *[
    _type == "post" &&
    slug.current == $slug &&
    defined(excerpt) &&
    defined(publishedAt)
  ][0] {
    ${postFields}
  }
`;

export const allSkillsQuery = `
  *[_type == "skill"] | order(category asc, title asc) {
    ${skillFields}
  }
`;
