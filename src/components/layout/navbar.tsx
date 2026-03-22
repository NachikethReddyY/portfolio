"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

export function Navbar() {
    const pathname = usePathname();

    const links = [
        { href: "/", label: "Home" },
        { href: "/projects", label: "Projects" },
        { href: "/blog", label: "Blog" },
        { href: "/#experience", label: "Experience" },
    ];

    return (
        <header className="fixed top-6 left-1/2 -translate-x-1/2 z-50 w-[calc(100%-3rem)] max-w-5xl rounded-full bg-surface-container-lowest/80 backdrop-blur-xl shadow-[0_8px_32px_rgba(0,0,0,0.05)] border-none">
            <div className="flex h-16 items-center justify-between px-8">
                <Link href="/" className="font-serif font-bold text-2xl tracking-tight hover:text-primary transition-colors">
                    Nachiketh<span className="text-primary italic">.</span>
                </Link>

                <nav className="flex items-center gap-2">
                    {links.map((link) => {
                        const isActive = pathname === link.href;
                        return (
                            <Button
                                key={link.href}
                                variant="ghost"
                                size="sm"
                                asChild
                                className={cn(
                                    "relative rounded-full font-bold px-5 transition-all",
                                    isActive ? "text-primary" : "text-muted-foreground hover:text-foreground hover:bg-primary/5"
                                )}
                            >
                                <Link href={link.href}>
                                    {link.label}
                                    {isActive && (
                                        <motion.div
                                            layoutId="navbar-indicator"
                                            className="absolute inset-0 bg-primary/10 rounded-full -z-10"
                                            transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                                        />
                                    )}
                                </Link>
                            </Button>
                        )
                    })}
                </nav>
            </div>
        </header>
    );
}
