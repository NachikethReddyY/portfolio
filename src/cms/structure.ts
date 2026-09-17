import type { StructureResolver } from "sanity/structure";

const documentType = (
  S: Parameters<StructureResolver>[0],
  type: string,
  title: string,
) => S.listItem().title(title).child(S.documentTypeList(type).title(title));

export const structure: StructureResolver = (S) =>
  S.list()
    .title("Content")
    .items([
      S.listItem()
        .title("Current content")
        .child(
          S.list()
            .title("Current content")
            .items([
              documentType(S, "profile", "Profile"),
              documentType(S, "caseStudy", "Case studies"),
              documentType(S, "article", "Writing"),
              documentType(S, "experience", "Experience"),
            ]),
        ),
      S.divider(),
      S.listItem()
        .title("Existing content")
        .child(
          S.list()
            .title("Existing content")
            .items([
              documentType(S, "author", "Authors"),
              documentType(S, "category", "Categories"),
              documentType(S, "homePage", "Homepage"),
              documentType(S, "post", "Posts"),
              documentType(S, "project", "Projects"),
              documentType(S, "siteSettings", "Site settings"),
              documentType(S, "skill", "Skills"),
              documentType(S, "socialLink", "Social links"),
            ]),
        ),
    ]);
