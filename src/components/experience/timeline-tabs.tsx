"use client";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Briefcase, GraduationCap, Calendar, MapPin, Globe } from "lucide-react";
import { ExperienceFolder } from "@/lib/types";

interface TimelineTabsProps {
    workExperience: ExperienceFolder;
    education: ExperienceFolder;
}

export function TimelineTabs({ workExperience, education }: TimelineTabsProps) {
    return (
        <div className="max-w-full mx-auto w-full">
            <Tabs defaultValue="education" className="w-full">
                <TabsList className="grid w-full grid-cols-2 mb-10 h-14 bg-surface-container-low rounded-full p-1.5 border-none shadow-inner">
                    <TabsTrigger value="work" className="text-sm font-bold tracking-tight rounded-full transition-all data-[state=active]:bg-background data-[state=active]:text-primary data-[state=active]:shadow-lg py-3">Work Experience</TabsTrigger>
                    <TabsTrigger value="education" className="text-sm font-bold tracking-tight rounded-full transition-all data-[state=active]:bg-background data-[state=active]:text-primary data-[state=active]:shadow-lg py-3">Education</TabsTrigger>
                </TabsList>

                <TabsContent value="work">
                    <TimelineList items={workExperience?.items || []} type="work" />
                </TabsContent>
                <TabsContent value="education">
                    <TimelineList items={education?.items || []} type="education" />
                </TabsContent>
            </Tabs>
        </div>
    );
}

function TimelineList({ items, type }: { items: any[], type: "work" | "education" }) {
    if (!items || items.length === 0) {
        return <div className="text-center text-muted-foreground/60 py-12 font-serif italic text-lg">No entries found.</div>
    }

    return (
        <Card className="border-none shadow-[0_20px_40px_-15px_rgba(0,0,0,0.04)] bg-card rounded-[3rem]">
            <CardContent className="p-8 md:p-12">
                <div className="relative space-y-12">
                    {/* Vertical Line */}
                    <div className="absolute top-4 bottom-4 left-[27px] w-0.5 bg-primary/10 md:left-[35px]" />

                    {items.map((item, idx) => (
                        <div key={idx} className="relative flex gap-8 md:gap-10">
                            {/* Logo / Icon */}
                            <div className="relative z-10 shrink-0">
                                <div className="h-14 w-14 rounded-2xl border-none bg-surface-container-low flex items-center justify-center md:h-18 md:w-18 shadow-sm transition-transform hover:scale-110 duration-300">
                                    {type === "work" ? (
                                        <Briefcase className="h-6 w-6 text-primary" />
                                    ) : (
                                        <GraduationCap className="h-6 w-6 text-primary" />
                                    )}
                                </div>
                            </div>

                            {/* Content */}
                            <div className="flex-1 pt-1">
                                <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4 mb-4">
                                    <div className="space-y-1">
                                        <h3 className="text-2xl md:text-3xl font-serif font-bold text-foreground leading-tight tracking-tight">
                                            {item.company || item.institution || "Organization"}
                                        </h3>
                                        <p className="text-lg md:text-xl text-primary font-medium font-sans">
                                            {item.role || item.degree}
                                        </p>
                                    </div>
                                    <div className="shrink-0 text-sm font-bold tracking-tight text-muted-foreground/80 bg-surface-container-high px-4 py-2 rounded-full w-fit shadow-xs">
                                        {item.startDate} - {item.endDate || "Present"}
                                    </div>
                                </div>

                                <ul className="list-disc list-outside ml-6 space-y-3 text-muted-foreground/90 mb-6 leading-relaxed font-sans">
                                    {item.description?.map((desc: string, i: number) => (
                                        <li key={i}>{desc}</li>
                                    ))}
                                </ul>

                                {/* Tags/Chips */}
                                <div className="flex flex-wrap gap-2.5">
                                    {type === "education" && item.projectUrl && (
                                        <Badge variant="secondary" className="font-bold text-xs hover:bg-primary/5 hover:text-primary transition-all rounded-full px-4 py-1">
                                            <a href={item.projectUrl} target="_blank" rel="noopener noreferrer" className="flex items-center">
                                                <Globe className="mr-2 h-3.5 w-3.5" /> Final Year Project
                                            </a>
                                        </Badge>
                                    )}
                                    {type === "work" && item.skillsDemonstrated?.map((skill: any) => (
                                        <Badge key={skill._id} variant="outline" className="font-medium text-[10px] uppercase tracking-widest rounded-full px-3 py-1 bg-surface-container-low border-none text-muted-foreground">
                                            {skill.name}
                                        </Badge>
                                    ))}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </CardContent>
        </Card>
    )
}
