"use client";

import { useState, useMemo } from "react";
import { Project } from "@/lib/types";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Github, ExternalLink, Search } from "lucide-react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";

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
        <div className="space-y-8">
            {/* SEARCH & FILTERS */}
            <div className="flex flex-col md:flex-row gap-4 items-center justify-between bg-secondary/30 p-4 rounded-xl backdrop-blur-sm sticky top-20 z-10 border">
                <div className="relative w-full md:w-96">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground h-4 w-4" />
                    <Input
                        placeholder="Search projects, stacks, or keywords..."
                        className="pl-9 bg-background"
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                    />
                </div>
                <div className="flex gap-2">
                    {(["all", "real-world", "personal", "academic"] as const).map((f) => (
                        <Button
                            key={f}
                            variant={filter === f ? "default" : "outline"}
                            size="sm"
                            onClick={() => setFilter(f)}
                            className="capitalize"
                        >
                            {f.replace("-", " ")}
                        </Button>
                    ))}
                </div>
            </div>

            {/* GRID */}
            <motion.div layout className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <AnimatePresence>
                    {filteredProjects.map((project) => (
                        <motion.div
                            layout
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.9 }}
                            key={project._id}
                        >
                            <Card className="h-full flex flex-col group hover:border-primary/50 transition-colors">
                                <div className="aspect-video bg-muted relative overflow-hidden">
                                    {/* Image placeholder - would use Sanity Image here */}
                                    <div className="absolute inset-0 flex items-center justify-center text-muted-foreground bg-secondary/50">
                                        {project.title} Preview
                                    </div>
                                </div>
                                <CardHeader>
                                    <div className="flex justify-between items-start">
                                        <div>
                                            <CardTitle className="leading-tight">{project.title}</CardTitle>
                                            <CardDescription className="mt-2 line-clamp-2">{project.tagline}</CardDescription>
                                        </div>
                                    </div>
                                </CardHeader>
                                <CardContent className="mt-auto space-y-4">
                                    <div className="flex flex-wrap gap-2">
                                        {project.techStack?.map((bg) => (
                                            <Badge key={bg.name} variant="secondary" className="text-xs">
                                                {bg.name}
                                            </Badge>
                                        ))}
                                    </div>
                                    <div className="flex gap-2 pt-2">
                                        {project.liveUrl && (
                                            <Button size="sm" className="w-full" asChild>
                                                <Link href={project.liveUrl} target="_blank">
                                                    <ExternalLink className="mr-2 h-4 w-4" /> Live Demo
                                                </Link>
                                            </Button>
                                        )}
                                        {project.repoUrl && (
                                            <Button size="sm" variant="outline" className="w-full" asChild>
                                                <Link href={project.repoUrl} target="_blank">
                                                    <Github className="mr-2 h-4 w-4" /> Code
                                                </Link>
                                            </Button>
                                        )}
                                    </div>
                                </CardContent>
                            </Card>
                        </motion.div>
                    ))}
                </AnimatePresence>
            </motion.div>

            {filteredProjects.length === 0 && (
                <div className="text-center py-20 text-muted-foreground">
                    <p>No projects found matching &quot;{query}&quot;</p>
                    <Button variant="link" onClick={() => { setQuery(""); setFilter("all") }}>Clear filters</Button>
                </div>
            )}
        </div>
    );
}
