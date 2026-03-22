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
        <Card className="h-full overflow-hidden bg-card text-card-foreground shadow-[0_20px_40px_-15px_rgba(0,0,0,0.04)] transition-all hover:scale-[1.01] hover:shadow-[0_40px_80px_-20px_rgba(0,0,0,0.08)] relative group border-none">
            {/* Clickable Overlay */}
            <Link href={href} className="absolute inset-0 z-10 focus:outline-none focus:ring-2 ring-primary/20 rounded-[2rem]" />

            <CardContent className="p-0 relative flex flex-col h-full">

                {/* Top Content Area */}
                <div className="p-8 relative flex flex-col gap-1">
                    <div className="flex justify-between items-start mb-2">
                        <div className="flex items-center gap-3">
                            <Badge variant="secondary" className="text-[10px] tracking-widest font-bold uppercase rounded-full bg-surface-container-high">
                                {category}
                            </Badge>
                            {date && (
                                <span className="text-xs font-medium text-muted-foreground/80">
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
                                    className="p-2 -mt-2 -mr-2 text-muted-foreground hover:text-primary transition-colors rounded-full hover:bg-primary/5"
                                    onClick={(e) => e.stopPropagation()}
                                    title="View Source Code"
                                >
                                    <Github className="h-5 w-5" />
                                </Link>
                            )}
                        </div>
                    </div>

                    <h3 className="text-3xl font-serif font-bold tracking-tight text-foreground mb-3 mt-1 group-hover:text-primary transition-colors leading-tight">
                        {title}
                    </h3>
                    <p className="text-base text-muted-foreground/90 line-clamp-2 leading-relaxed font-sans">
                        {description}
                    </p>
                </div>

                {/* Image Area (Bottom) */}
                <div className="mt-auto px-8 pb-8 w-full">
                    <div className="aspect-video w-full rounded-2xl bg-surface-container-low relative overflow-hidden group-hover:shadow-lg transition-all">
                        {imageUrl ? (
                            <Image
                                src={imageUrl}
                                alt={title}
                                fill
                                className="object-cover transition-transform duration-700 group-hover:scale-105"
                            />
                        ) : (
                            <>
                                <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-primary-container/20 group-hover:opacity-100 transition-opacity" />
                                <div className="absolute inset-0 flex items-center justify-center font-serif italic text-primary/40 text-lg">
                                    {title}
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
