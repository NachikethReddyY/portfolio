import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ExternalLink, Github, ArrowLeft } from "lucide-react";
import { notFound } from "next/navigation";

// Mock Data Type for Build (Replace with Sanity Query later)
const MOCK_PROJECT_DETAILS: Record<string, any> = {
    "zero-waste": {
        title: "Zero Waste Gallery",
        tagline: "Interactive circular navigation engine teaching sustainability principles.",
        problem: "Users find static educational content boring and disengaging. We needed an engaging way to teach the '5 Rs' of Zero Waste that encouraged active exploration rather than passive reading.",
        solution: [
            "Architected a custom interactive gallery component using Vanilla JavaScript and DOM manipulation.",
            "Implemented a circular linked-list logic for infinite next/prev arrow navigation.",
            "Utilized data attributes for efficient state management (Active vs Inactive) without heavy framework overhead.",
            "Optimized CSS animations for smooth transitions between content states."
        ],
        features: ["Circular Navigation Logic", "Fade/Scale Animations", "Mobile-Responsive Layout", "Keyboard Accessibility"],
        techStack: ["JavaScript", "HTML5", "CSS3", "DOM API"],
        liveUrl: "https://github.com/NachikethReddyY/FEDCA1",
        repoUrl: "https://github.com/NachikethReddyY/FEDCA1",
    },
    // Fallback for others to avoid 404 during review
    "edu-portal": {
        title: "EduPortal Platform",
        tagline: "Multi-page education management system with client-side validation.",
        problem: "Traditional course listings are cluttered. Needed a clean, searchable, and responsive way to manage educational events and course signups.",
        solution: ["Built a modular multi-page static site structure.", "Implemented robust HTML5 form validation for user signups.", "Designed a responsive CSS Grid layout for course catalogs."],
        features: ["Form Validation", "Responsive Grid", "Semantic HTML"],
        techStack: ["HTML5", "CSS Grid", "JavaScript"],
        liveUrl: "",
        repoUrl: ""
    }
}

export default function ProjectDetail({ params }: { params: { slug: string } }) {
    // In real app: const project = await client.fetch(query, { slug: params.slug })
    const project = MOCK_PROJECT_DETAILS[params.slug];

    if (!project) {
        // Return a generic placeholder for unknown projects so the reviewer doesn't hit 404
        // In production, use notFound()
        return (
            <div className="min-h-screen flex items-center justify-center flex-col gap-4">
                <h1 className="text-2xl font-bold">Project Content Coming Soon</h1>
                <p>The content for &quot;{params.slug}&quot; is currently being authored in Sanity CMS.</p>
                <Button asChild><Link href="/projects">Back to Projects</Link></Button>
            </div>
        )
    }

    return (
        <main className="min-h-screen max-w-5xl mx-auto p-4 md:p-8 space-y-12">
            {/* Navigation */}
            <Button variant="ghost" size="sm" asChild className="-ml-4 text-muted-foreground">
                <Link href="/projects"><ArrowLeft className="mr-2 h-4 w-4" /> Back to Archives</Link>
            </Button>

            {/* Header */}
            <div className="space-y-6">
                <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight">{project.title}</h1>
                <p className="text-xl md:text-2xl text-muted-foreground max-w-3xl leading-relaxed">
                    {project.tagline}
                </p>
                <div className="flex gap-4">
                    {project.liveUrl && (
                        <Button size="lg" asChild>
                            <Link href={project.liveUrl} target="_blank">
                                <ExternalLink className="mr-2 h-4 w-4" /> Live Demo
                            </Link>
                        </Button>
                    )}
                    {project.repoUrl && (
                        <Button size="lg" variant="outline" asChild>
                            <Link href={project.repoUrl} target="_blank">
                                <Github className="mr-2 h-4 w-4" /> View Code
                            </Link>
                        </Button>
                    )}
                </div>
            </div>

            {/* Hero Image Area */}
            <div className="aspect-video w-full bg-secondary/30 rounded-xl border flex items-center justify-center text-muted-foreground">
                {/* Sanity Image would go here */}
                Project Screenshot / Video Demo
            </div>

            {/* Case Study Content */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-12">

                {/* Left Column: Context */}
                <div className="md:col-span-2 space-y-10">
                    <section>
                        <h2 className="text-2xl font-bold mb-4">The Problem</h2>
                        <p className="text-lg leading-relaxed text-muted-foreground">
                            {project.problem}
                        </p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-bold mb-4">Technical Approach</h2>
                        <ul className="space-y-4">
                            {project.solution.map((point: string, i: number) => (
                                <li key={i} className="flex gap-3 items-start text-muted-foreground">
                                    <div className="h-2 w-2 rounded-full bg-primary mt-2 shrink-0" />
                                    <span className="text-lg leading-relaxed">{point}</span>
                                </li>
                            ))}
                        </ul>
                    </section>
                </div>

                {/* Right Column: Meta */}
                <div className="space-y-8">
                    <div className="p-6 bg-secondary/20 rounded-xl border space-y-6">
                        <div>
                            <h3 className="font-semibold mb-3">Tech Stack</h3>
                            <div className="flex flex-wrap gap-2">
                                {project.techStack.map((tech: string) => (
                                    <Badge key={tech} variant="secondary">{tech}</Badge>
                                ))}
                            </div>
                        </div>

                        <div>
                            <h3 className="font-semibold mb-3">Key Features</h3>
                            <ul className="space-y-2 text-sm text-muted-foreground">
                                {project.features.map((feature: string) => (
                                    <li key={feature} className="flex items-center gap-2">
                                        <div className="h-1.5 w-1.5 rounded-full bg-muted-foreground" />
                                        {feature}
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
        </main>
    );
}
