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
}

export function HeroProjectCard({ title, category, description, tags, href }: HeroProjectCardProps) {
    return (
        <Link href={href} className="group block h-full">
            <Card className="h-full overflow-hidden border-0 bg-white text-zinc-900 shadow-xl transition-all hover:scale-[1.01] hover:shadow-2xl">
                <CardContent className="p-0 relative flex flex-col h-full">

                    {/* Top Content Area */}
                    <div className="p-6 relative z-10 flex flex-col gap-1">
                        <div className="flex justify-between items-start">
                            <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                                {category}
                            </p>
                            <ArrowUpRight className="h-5 w-5 text-zinc-500 opacity-0 transition-opacity group-hover:opacity-100" />
                        </div>
                        <h3 className="text-2xl font-bold tracking-tight text-foreground mb-1">
                            {title}
                        </h3>
                        <p className="text-sm text-muted-foreground line-clamp-2">
                            {description}
                        </p>
                    </div>

                    {/* Image Area (Bottom) */}
                    <div className="mt-auto px-6 pb-6 w-full">
                        <div className="aspect-video w-full rounded-xl bg-zinc-800 relative overflow-hidden group-hover:ring-1 ring-white/10 transition-all">
                            {/* Gradient Placeholder for Image */}
                            <div className="absolute inset-0 bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 opacity-80 group-hover:opacity-100 transition-opacity" />
                            <div className="absolute inset-0 flex items-center justify-center font-medium text-white/50 text-lg">
                                {title} Preview
                            </div>
                        </div>
                    </div>

                </CardContent>
            </Card>
        </Link>
    );
}
