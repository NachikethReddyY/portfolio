import { SearchableGrid } from "@/components/projects/searchable-grid";
import { Project } from "@/lib/types";

// Mock Data for now - will allow the page to build before Sanity data is ready
const MOCK_PROJECTS: Project[] = [
    {
        _id: "1",
        title: "Zero Waste Gallery",
        slug: { current: "zero-waste" },
        tagline: "Interactive circular navigation engine teaching sustainability principles.",
        type: "academic",
        isFeatured: true,
        techStack: [{ name: "JavaScript", category: "core" }, { name: "DOM API", category: "core" }, { name: "CSS Animation", category: "core" }],
        liveUrl: "https://github.com/NachikethReddyY/FEDCA1",
        repoUrl: "https://github.com/NachikethReddyY/FEDCA1",
    },
    {
        _id: "2",
        title: "EduPortal Platform",
        slug: { current: "edu-portal" },
        tagline: "Multi-page education management system with client-side validation.",
        type: "academic",
        isFeatured: true,
        techStack: [{ name: "HTML5", category: "core" }, { name: "CSS Grid", category: "core" }, { name: "Forms", category: "core" }],
        liveUrl: "https://github.com/NachikethReddyY/FED-CA2",
        repoUrl: "https://github.com/NachikethReddyY/FED-CA2",
    },
    {
        _id: "3",
        title: "Iris Lite v2",
        slug: { current: "iris-lite" },
        tagline: "Lightweight, high-performance landing page implementation.",
        type: "personal",
        isFeatured: true,
        techStack: [{ name: "Responsive Design", category: "core" }, { name: "Performance", category: "learning" }],
        liveUrl: "https://github.com/NachikethReddyY/iris-lite-v2",
        repoUrl: "https://github.com/NachikethReddyY/iris-lite-v2",
    },
    {
        _id: "4",
        title: "QR Code Component",
        slug: { current: "qr-code" },
        tagline: "Pixel-perfect implementation of Frontend Mentor challenge.",
        type: "personal",
        isFeatured: false,
        techStack: [{ name: "HTML", category: "core" }, { name: "CSS", category: "core" }],
        liveUrl: "https://github.com/NachikethReddyY/QR-code",
        repoUrl: "https://github.com/NachikethReddyY/QR-code",
    }
];

export default function ProjectsPage() {
    return (
        <main className="min-h-screen p-4 md:p-8 max-w-7xl mx-auto space-y-8">
            <div className="space-y-4">
                <h1 className="text-4xl font-bold tracking-tight">Engineering Archives</h1>
                <p className="text-muted-foreground text-lg max-w-2xl">
                    A collection of projects demonstrating technical competence, problem-solving, and attention to detail.
                </p>
            </div>

            <SearchableGrid projects={MOCK_PROJECTS} />
        </main>
    );
}
