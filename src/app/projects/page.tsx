import { SearchableGrid } from "@/components/projects/searchable-grid";
import { client } from "@/sanity/lib/client";

export const revalidate = 60;

export default async function ProjectsPage() {
    const query = `*[_type == "project"] | order(publishedAt desc) {
        _id,
        title,
        slug,
        tagline,
        coverImage,
        publishedAt,
        "type": coalesce(type, "personal"),
        isFeatured,
        "techStack": techStack[]->{name, category},
        liveUrl,
        repoUrl
    }`;

    const projects = await client.fetch(query);

    return (
        <main className="min-h-screen bg-[#f5f5f5] font-sans">
            <div className="max-w-7xl mx-auto px-6 md:px-12 pt-20 md:pt-32 space-y-12">
                <div className="space-y-6 max-w-3xl">
                    <h1 className="text-5xl md:text-7xl font-bold tracking-tight text-foreground leading-[1.1]">
                        Engineering Archives.
                    </h1>
                    <p className="text-xl text-muted-foreground leading-relaxed">
                        A curated collection of technical implementations, experiments, and production-ready applications.
                        Search by tech stack, category, or keyword.
                    </p>
                </div>

                <SearchableGrid projects={projects} />
            </div>
        </main>
    );
}
