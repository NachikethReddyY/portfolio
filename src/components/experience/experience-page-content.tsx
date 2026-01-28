"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ExperienceFolder } from "@/lib/types";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { X, Calendar } from "lucide-react";
import { Button } from "@/components/ui/button";

interface ExperiencePageContentProps {
    folders: ExperienceFolder[];
}

export function ExperiencePageContent({ folders }: ExperiencePageContentProps) {
    const [selectedId, setSelectedId] = useState<string | null>(null);

    // Find selected folder data
    const selectedFolder = folders.find(f => f._id === selectedId);

    return (
        <div className="min-h-screen p-8 relative">
            <div className="max-w-7xl mx-auto mb-12">
                <h1 className="text-4xl font-bold tracking-tight mb-4">Professional Journey</h1>
                <p className="text-muted-foreground text-lg">Click on a folder to view details.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12 max-w-7xl mx-auto">
                {folders.map((folder) => (
                    <FolderCard
                        key={folder._id}
                        folder={folder}
                        onClick={() => setSelectedId(folder._id)}
                    />
                ))}
            </div>

            <AnimatePresence>
                {selectedId && selectedFolder && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                        {/* Backdrop */}
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setSelectedId(null)}
                            className="absolute inset-0 bg-background/80 backdrop-blur-sm"
                        />

                        {/* Expanded Card */}
                        <motion.div
                            layoutId={`folder-container-${selectedId}`}
                            className="w-full max-w-3xl bg-card border shadow-2xl rounded-xl overflow-hidden z-10 relative max-h-[80vh] flex flex-col"
                        >
                            {/* Header */}
                            <motion.div
                                layoutId={`folder-header-${selectedId}`}
                                className={`h-32 ${folderColorMap[folderColor(selectedFolder.color)]} p-6 flex items-start justify-between text-white`}
                            >
                                <div>
                                    <motion.h2 layoutId={`folder-title-${selectedId}`} className="text-3xl font-bold">
                                        {selectedFolder.title}
                                    </motion.h2>
                                </div>
                                <Button variant="ghost" size="icon" className="text-white hover:bg-white/20" onClick={() => setSelectedId(null)}>
                                    <X className="h-6 w-6" />
                                </Button>
                            </motion.div>

                            {/* Content */}
                            <div className="p-6 overflow-y-auto">
                                <div className="space-y-8">
                                    {selectedFolder.items.map((item, idx) => (
                                        <div key={idx} className="relative pl-8 border-l-2 border-muted pb-8 last:pb-0">
                                            <div className="absolute left-[-9px] top-0 h-4 w-4 rounded-full bg-primary" />
                                            <div className="mb-2">
                                                <h3 className="text-xl font-semibold">{item.role}</h3>
                                                <div className="text-muted-foreground flex items-center gap-2">
                                                    <span className="font-medium text-foreground">{item.company}</span>
                                                    <span>•</span>
                                                    <div className="flex items-center text-sm">
                                                        <Calendar className="h-3 w-3 mr-1" />
                                                        {item.startDate} - {item.endDate || "Present"}
                                                    </div>
                                                </div>
                                            </div>
                                            <ul className="list-disc list-outside ml-4 space-y-1 text-muted-foreground">
                                                {item.description.map((desc, i) => (
                                                    <li key={i}>{desc}</li>
                                                ))}
                                            </ul>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
}

function FolderCard({ folder, onClick }: { folder: ExperienceFolder; onClick: () => void }) {
    const isBlue = folder.color.includes("blue");

    return (
        <motion.div
            layoutId={`folder-container-${folder._id}`}
            onClick={onClick}
            className="cursor-pointer group relative"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
        >
            {/* Back Tab */}
            <div className={`absolute top-0 left-0 w-1/3 h-8 rounded-t-lg -mt-8 ${folderColorMap[folderColor(folder.color)]} brightness-75`} />

            {/* Main Folder Face */}
            <motion.div
                layoutId={`folder-header-${folder._id}`}
                className={`h-64 rounded-lg rounded-tl-none shadow-lg p-6 relative overflow-hidden ${folderColorMap[folderColor(folder.color)]} flex flex-col justify-between`}
            >
                <motion.h3 layoutId={`folder-title-${folder._id}`} className="text-2xl font-bold text-white relative z-10">
                    {folder.title}
                </motion.h3>

                {/* Decorative "Sticker" placeholder */}
                <div className="absolute bottom-4 right-4 opacity-50 rotate-12">
                    <div className="h-24 w-24 bg-white/20 rounded-full blur-xl" />
                </div>

                <div className="bg-white/10 backdrop-blur-md rounded-md p-2 text-white/80 text-sm w-fit">
                    {folder.items.length} items
                </div>
            </motion.div>

            {/* Preview Photos "Fanning Out" (Visual only for now) */}
            <div className="absolute -top-12 right-4 w-32 h-40 bg-white p-2 shadow-xl rotate-6 group-hover:rotate-12 group-hover:-translate-y-4 transition-transform duration-300 z-[-1] rounded-sm">
                <div className="w-full h-24 bg-gray-100 mb-2" />
                <div className="h-2 w-16 bg-gray-200 rounded" />
            </div>
            <div className="absolute -top-8 right-12 w-32 h-40 bg-white p-2 shadow-md -rotate-3 group-hover:-rotate-6 group-hover:-translate-y-8 transition-transform duration-300 z-[-2] rounded-sm">
                <div className="w-full h-24 bg-gray-100 mb-2" />
            </div>
        </motion.div>
    )
}

// Helper for Tailwind colors (Safe-list approach)
const folderColorMap: Record<string, string> = {
    blue: "bg-blue-600",
    green: "bg-emerald-600",
    orange: "bg-orange-500",
    slate: "bg-slate-700",
};

function folderColor(c: string) {
    if (c.includes("blue")) return "blue";
    if (c.includes("green")) return "green";
    if (c.includes("orange")) return "orange";
    return "slate";
}
