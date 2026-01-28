import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";

// Mock Blog Data
const POSTS = [
    {
        slug: "starting-my-portfolio",
        title: "Building my Portfolio with Next.js",
        excerpt: "Why I chose Next.js and Tailwind for my personal site.",
        date: "2026-01-28",
        tags: ["Next.js", "Personal"]
    },
    {
        slug: "learning-react-native",
        title: "First steps into Mobile Dev",
        excerpt: "Transitioning from web to mobile development as a student.",
        date: "2026-02-15",
        tags: ["Mobile", "React Native"]
    }
]

export default function BlogIndex() {
    return (
        <main className="min-h-screen p-6 md:p-12 max-w-4xl mx-auto mb-20">
            <div className="mb-12">
                <h1 className="text-4xl font-bold tracking-tight mb-4">Blog</h1>
                <p className="text-muted-foreground text-lg">Thoughts, learnings, and updates from my journey.</p>
            </div>

            <div className="grid gap-6">
                {POSTS.map(post => (
                    <Link key={post.slug} href={`/blog/${post.slug}`}>
                        <Card className="hover:border-primary/50 transition-colors">
                            <CardHeader>
                                <div className="flex justify-between items-start mb-2">
                                    <div className="text-sm text-muted-foreground">{post.date}</div>
                                    <div className="flex gap-2">
                                        {post.tags.map(tag => <Badge key={tag} variant="secondary" className="text-xs">{tag}</Badge>)}
                                    </div>
                                </div>
                                <CardTitle className="text-2xl">{post.title}</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <p className="text-muted-foreground">{post.excerpt}</p>
                            </CardContent>
                        </Card>
                    </Link>
                ))}
            </div>
        </main>
    );
}
