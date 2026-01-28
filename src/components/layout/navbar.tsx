"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";

export function Navbar() {
    const pathname = usePathname();

    const links = [
        { href: "/", label: "Home" },
        { href: "/projects", label: "Projects" },
        { href: "/blog", label: "Blog" },
        { href: "/#experience", label: "Experience" },
    ];

    return (
        <header className="fixed top-0 left-0 right-0 z-50 border-b bg-background/80 backdrop-blur-md">
            <div className="max-w-7xl mx-auto flex h-16 items-center justify-between px-4 md:px-8">
                <Link href="/" className="font-bold text-xl tracking-tighter">
                    Nachiketh<span className="text-primary">.</span>
                </Link>

                <nav className="flex items-center gap-1">
                    {links.map((link) => {
                        const isActive = pathname === link.href;
                        return (
                            <Button
                                key={link.href}
                                variant={isActive ? "secondary" : "ghost"}
                                size="sm"
                                asChild
                                className="relative"
                            >
                                <Link href={link.href}>
                                    {link.label}
                                    {isActive && (
                                        <motion.div
                                            layoutId="navbar-indicator"
                                            className="absolute inset-0 bg-primary/10 rounded-md -z-10"
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
