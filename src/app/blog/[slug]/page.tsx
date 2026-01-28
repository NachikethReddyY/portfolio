import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default function BlogPost({ params }: { params: { slug: string } }) {
    return (
        <main className="min-h-screen p-6 md:p-12 max-w-3xl mx-auto mb-20">
            <Button variant="ghost" asChild className="mb-8 pl-0 hover:pl-0 hover:bg-transparent text-muted-foreground hover:text-foreground">
                <Link href="/blog">
                    <ArrowLeft className="mr-2 h-4 w-4" /> Back to Blog
                </Link>
            </Button>

            <article className="prose prose-zinc dark:prose-invert lg:prose-xl">
                <h1>Building my Portfolio with Next.js</h1>
                <p className="lead">
                    This is a placeholder for the blog post content. Ideally, this would be fetched from Sanity CMS using the slug <code>{params.slug}</code>.
                </p>
                <p>
                    Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
                    Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.
                </p>
                <h2>Why Next.js?</h2>
                <p>
                    Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.
                    Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
                </p>
            </article>
        </main>
    );
}
