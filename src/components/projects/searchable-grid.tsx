"use client";

import { useState, useMemo } from "react";
import { Project } from "@/lib/types";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { urlFor } from "@/sanity/lib/image";
import { HeroProjectCard } from "@/components/home/hero-project-card";

interface SearchableGridProps {
    projects: Project[];
}

export function SearchableGrid({ projects }: SearchableGridProps) {
    const [query, setQuery] = useState("");
    const [filter, setFilter] = useState<"all" | "real-world" | "personal" | "academic">("all");

    const filteredProjects = useMemo(() => {
        return projects.filter((p) => {
            const matchesQuery =
                p.title.toLowerCase().includes(query.toLowerCase()) ||
                p.tagline.toLowerCase().includes(query.toLowerCase()) ||
                p.techStack?.some((t) => t.name.toLowerCase().includes(query.toLowerCase()));

            const matchesFilter = filter === "all" || p.type === filter;

            return matchesQuery && matchesFilter;
        });
    }, [query, filter, projects]);

    return (
        <div className="space-y-12">
            {/* SEARCH & FILTERS */}
            <div className="sticky top-6 z-30 px-4 md:px-0">
                <div className="max-w-4xl mx-auto flex flex-col md:flex-row gap-3 md:items-center md:justify-between md:bg-background/80 md:backdrop-blur-xl md:border md:border-border/60 md:shadow-sm md:p-2 md:pl-4 md:rounded-full md:ring-1 md:ring-border/40">

                    <div className="relative w-full md:w-80 bg-background/80 backdrop-blur-xl border border-border/60 shadow-sm rounded-full p-0.5 ring-1 ring-border/40 md:bg-transparent md:backdrop-blur-none md:border-none md:shadow-none md:ring-0 md:p-0">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground h-4 w-4" />
                        <input
                            placeholder="Search archives..."
                            className="w-full bg-transparent border-none focus:ring-0 pl-9 text-sm h-10 text-foreground placeholder:text-muted-foreground"
                            value={query}
                            onChange={(e) => setQuery(e.target.value)}
                        />
                    </div>

                    <div className="flex bg-muted rounded-xl md:rounded-full p-1 gap-1 w-full md:w-auto overflow-x-auto no-scrollbar shadow-sm ring-1 ring-border/40 md:shadow-none md:ring-0">
                        {(["all", "real-world", "personal", "academic"] as const).map((f) => (
                            <button
                                key={f}
                                onClick={() => setFilter(f)}
                                className={`
                                    px-4 py-2 md:py-1.5 rounded-lg md:rounded-full text-xs font-medium transition-all whitespace-nowrap flex-1 md:flex-none
                                    ${filter === f
                                        ? "bg-background text-foreground shadow-sm"
                                        : "text-muted-foreground hover:text-foreground"
                                    }
                                    capitalize
                                `}
                            >
                                {f.replace("-", " ")}
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            {/* GRID */}
            <motion.div layout className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <AnimatePresence>
                    {filteredProjects.map((project) => (
                        <motion.div
                            layout
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.95 }}
                            transition={{ duration: 0.2 }}
                            key={project._id}
                        >
                            <HeroProjectCard
                                title={project.title}
                                category={project.type}
                                description={project.tagline}
                                tags={project.techStack?.map(t => t.name) || []}
                                href={`/projects/${project.slug.current}`}
                                imageUrl={project.coverImage ? urlFor(project.coverImage).width(800).url() : undefined}
                                date={project.publishedAt ? new Date(project.publishedAt).toLocaleDateString("en-US", { month: "short", year: "numeric" }) : undefined}
                                repoUrl={project.repoUrl}
                            />
                        </motion.div>
                    ))}
                </AnimatePresence>
            </motion.div>

            {filteredProjects.length === 0 && (
                <div className="text-center py-32 text-muted-foreground bg-card rounded-3xl border border-border">
                    <p className="text-lg">No projects match your criteria.</p>
                    <Button variant="link" onClick={() => { setQuery(""); setFilter("all") }} className="mt-2">
                        Clear all filters
                    </Button>
                </div>
            )}
        </div>
    );
}
