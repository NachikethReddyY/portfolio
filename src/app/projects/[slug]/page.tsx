import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { ExternalLink, Github, ArrowLeft, Calendar, User, Clock, Share2, PlayCircle } from "lucide-react";
import { notFound } from "next/navigation";
import { client } from "@/sanity/lib/client";
import { urlFor } from "@/sanity/lib/image";
import { PortableText } from "@portabletext/react";

// Cache revalidation for Sanity data
export const revalidate = 60; // Revalidate every 60 seconds

interface ProjectDetail {
    title: string;
    tagline: string;
    slug: { current: string };
    coverImage: any;
    startDate?: string;
    endDate?: string;
    publishedAt: string;
    problem: string;
    solution: any;
    liveUrl?: string;
    projectUrl?: string;
    repoUrl?: string;
    techStack: { name: string; category: string }[];
}

function formatDateRange(start?: string, end?: string) {
    if (!start) return '2025';
    const startDate = new Date(start).toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
    const endDate = end ? new Date(end).toLocaleDateString('en-US', { month: 'short', year: 'numeric' }) : 'Present';
    return `${startDate} - ${endDate}`;
}

const ptComponents = {
    block: {
        h3: ({ children }: any) => <h3 className="text-2xl font-bold mt-8 mb-4">{children}</h3>,
        h4: ({ children }: any) => <h4 className="text-xl font-bold mt-6 mb-3">{children}</h4>,
        normal: ({ children }: any) => <p className="mb-4 leading-relaxed text-muted-foreground">{children}</p>,
    },
    list: {
        bullet: ({ children }: any) => <ul className="list-disc pl-5 mb-4 space-y-2 text-muted-foreground">{children}</ul>,
        number: ({ children }: any) => <ol className="list-decimal pl-5 mb-4 space-y-2 text-muted-foreground">{children}</ol>,
    },
    types: {
        image: ({ value }: any) => {
            return (
                <div className="relative w-full aspect-video my-8 rounded-xl overflow-hidden bg-muted border border-border">
                    <Image
                        src={urlFor(value).url()}
                        alt={value.alt || 'Project Content Image'}
                        fill
                        className="object-cover"
                    />
                </div>
            );
        }
    }
};

export default async function ProjectDetail(props: { params: Promise<{ slug: string }> }) {
    const params = await props.params;

    const query = `*[_type == "project" && slug.current == $slug][0]{
        title,
        tagline,
        slug,
        coverImage,
        startDate,
        endDate,
        publishedAt,
        problem,
        solution,
        liveUrl,
        projectUrl,
        repoUrl,
        "techStack": techStack[]->{name, category}
    }`;

    const project: ProjectDetail = await client.fetch(query, { slug: params.slug });


    if (!project) {
        return notFound();
    }

    const dateDisplay = formatDateRange(project.startDate, project.endDate);

    return (
        <main className="min-h-screen bg-background">
            <article className="max-w-4xl mx-auto px-6 py-12 md:py-24 space-y-12">

                {/* Top Nav / Breadcrumb */}
                <div className="flex flex-col items-center gap-6 text-center">
                    <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
                        <Link href="/projects" className="hover:text-foreground transition-colors">Projects</Link>
                        <span>/</span>
                        <span className="text-foreground">Case Study</span>
                    </div>

                    <h1 className="text-4xl md:text-6xl font-bold tracking-tight text-foreground leading-[1.1] max-w-3xl">
                        {project.title}
                    </h1>

                    <p className="text-xl md:text-2xl text-muted-foreground max-w-2xl leading-relaxed">
                        {project.tagline}
                    </p>
                </div>

                {/* Hero Image */}
                <div className="rounded-3xl overflow-hidden border border-border bg-card shadow-sm aspect-video relative">
                    {project.coverImage ? (
                        <Image
                            src={urlFor(project.coverImage).width(1200).height(675).url()}
                            alt={project.title}
                            fill
                            className="object-cover"
                            priority
                        />
                    ) : (
                        <div className="w-full h-full flex items-center justify-center text-muted-foreground">
                            No Preview Image
                        </div>
                    )}
                </div>

                {/* Metadata Row */}
                <div className="flex flex-wrap items-center justify-center gap-x-8 gap-y-4 border-y border-border py-6 text-sm md:text-base">
                    <div className="flex items-center gap-2">
                        <div className="h-10 w-10 rounded-full overflow-hidden border">
                            <Image
                                src="/mesquare.png"
                                alt="Nachiketh"
                                width={40}
                                height={40}
                                className="object-cover w-full h-full"
                            />
                        </div>
                        <span className="font-semibold text-foreground">Nachiketh Reddy</span>
                    </div>

                    <div className="h-1 w-1 rounded-full bg-border hidden md:block" />

                    <div className="flex items-center gap-2 text-muted-foreground">
                        <Calendar className="h-4 w-4" />
                        <span>Published: {project.publishedAt ? new Date(project.publishedAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : 'N/A'}</span>
                    </div>

                    {(project.startDate || project.endDate) && (
                        <>
                            <div className="h-1 w-1 rounded-full bg-border hidden md:block" />
                            <div className="flex items-center gap-2 text-muted-foreground">
                                <Clock className="h-4 w-4" />
                                <span>{dateDisplay}</span>
                            </div>
                        </>
                    )}

                    <div className="h-1 w-1 rounded-full bg-border hidden md:block" />

                    <div className="flex gap-3">
                        {project.liveUrl && (
                            <Link href={project.liveUrl} target="_blank" className="flex items-center gap-1.5 font-medium text-blue-600 dark:text-blue-400 hover:underline">
                                <ExternalLink className="h-4 w-4" /> Visit Site
                            </Link>
                        )}
                        {project.projectUrl && (
                            <Link href={project.projectUrl} target="_blank" className="flex items-center gap-1.5 font-medium text-indigo-600 dark:text-indigo-400 hover:underline">
                                <PlayCircle className="h-4 w-4" /> View Project
                            </Link>
                        )}
                        {project.repoUrl && (
                            <Link href={project.repoUrl} target="_blank" className="flex items-center gap-1.5 font-medium text-foreground hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
                                <Github className="h-4 w-4" /> Code
                            </Link>
                        )}

                    </div>
                </div>

                {/* Content */}
                <div className="space-y-12">
                    {project.problem && (
                        <div className="prose prose-lg prose-zinc max-w-none">
                            <h2 className="text-3xl font-bold mb-4 tracking-tight text-foreground">The Problem</h2>
                            <p className="text-xl text-muted-foreground leading-relaxed">{project.problem}</p>
                        </div>
                    )}

                    {project.solution && (
                        <div className="prose prose-lg prose-zinc max-w-none">
                            <h2 className="text-3xl font-bold mb-4 tracking-tight text-foreground">The Solution</h2>
                            <PortableText value={project.solution} components={ptComponents} />
                        </div>
                    )}

                    {!project.problem && !project.solution && (
                        <p className="text-center text-muted-foreground italic py-12">
                            Detailed case study content coming soon...
                        </p>
                    )}
                </div>

                {/* Bottom Navigation */}
                <div className="pt-12 border-t text-center">
                    <Button variant="ghost" asChild>
                        <Link href="/projects" className="text-muted-foreground hover:text-foreground">
                            &larr; Back to all projects
                        </Link>
                    </Button>
                </div>

            </article>
        </main>
    );
}
