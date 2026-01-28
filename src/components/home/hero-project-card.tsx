"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";

interface HeroProjectCardProps {
    title: string;
    category: string;
    description: string;
    tags: string[];
    href: string;
    imageUrl?: string;
    date?: string;
    repoUrl?: string;
}

import Image from "next/image";

export function HeroProjectCard({ title, category, description, tags, href, imageUrl, date, repoUrl }: HeroProjectCardProps) {
    return (
        <Card className="h-full overflow-hidden border-0 bg-white text-zinc-900 shadow-xl transition-all hover:scale-[1.01] hover:shadow-2xl relative group">
            {/* Clickable Overlay */}
            <Link href={href} className="absolute inset-0 z-10 focus:outline-none focus:ring-2 ring-primary/50 rounded-xl" />

            <CardContent className="p-0 relative flex flex-col h-full">

                {/* Top Content Area */}
                <div className="p-6 relative flex flex-col gap-1">
                    <div className="flex justify-between items-start mb-1">
                        <div className="flex items-center gap-3">
                            <Badge variant="secondary" className="text-[10px] tracking-wider font-bold uppercase bg-zinc-100 text-zinc-600 hover:bg-zinc-200">
                                {category}
                            </Badge>
                            {date && (
                                <span className="text-xs font-medium text-zinc-400">
                                    {date}
                                </span>
                            )}
                        </div>

                        {/* Quick Access Actions (z-20 to sit above link) */}
                        <div className="flex gap-2 relative z-20">
                            {repoUrl && (
                                <Link
                                    href={repoUrl}
                                    target="_blank"
                                    className="p-2 -mt-2 -mr-2 text-zinc-400 hover:text-zinc-900 transition-colors rounded-full hover:bg-zinc-100"
                                    onClick={(e) => e.stopPropagation()}
                                    title="View Source Code"
                                >
                                    <Github className="h-5 w-5" />
                                </Link>
                            )}
                        </div>
                    </div>

                    <h3 className="text-2xl font-bold tracking-tight text-foreground mb-2 mt-1 group-hover:text-blue-600 transition-colors">
                        {title}
                    </h3>
                    <p className="text-sm text-muted-foreground line-clamp-2 leading-relaxed">
                        {description}
                    </p>
                </div>

                {/* Image Area (Bottom) */}
                <div className="mt-auto px-6 pb-6 w-full">
                    <div className="aspect-video w-full rounded-xl bg-zinc-800 relative overflow-hidden ring-1 ring-zinc-900/5 group-hover:ring-zinc-900/10 transition-all">
                        {imageUrl ? (
                            <Image
                                src={imageUrl}
                                alt={title}
                                fill
                                className="object-cover transition-transform duration-700 group-hover:scale-105"
                            />
                        ) : (
                            <>
                                <div className="absolute inset-0 bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 opacity-80 group-hover:opacity-100 transition-opacity" />
                                <div className="absolute inset-0 flex items-center justify-center font-medium text-white/50 text-lg">
                                    {title} Preview
                                </div>
                            </>
                        )}
                    </div>
                </div>

            </CardContent>
        </Card>
    );
}

import { Github } from "lucide-react";
