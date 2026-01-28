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
                <TabsList className="grid w-full grid-cols-2 mb-6 h-10 border border-zinc-200 rounded-lg bg-transparent p-1">
                    <TabsTrigger value="work" className="text-sm font-medium data-[state=active]:bg-background data-[state=active]:shadow-sm">Work Experience</TabsTrigger>
                    <TabsTrigger value="education" className="text-sm font-medium data-[state=active]:bg-background data-[state=active]:shadow-sm">Education</TabsTrigger>
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
        return <div className="text-center text-muted-foreground py-6">No entries found.</div>
    }

    return (
        <Card className="border shadow-sm">
            <CardContent className="p-4 md:p-6">
                <div className="relative space-y-8">
                    {/* Vertical Line */}
                    <div className="absolute top-3 bottom-3 left-[23px] w-px bg-border md:left-[27px]" />

                    {items.map((item, idx) => (
                        <div key={idx} className="relative flex gap-4 md:gap-6">
                            {/* Logo / Icon */}
                            <div className="relative z-10 shrink-0">
                                <div className="h-12 w-12 rounded-full border bg-background flex items-center justify-center md:h-14 md:w-14 shadow-sm">
                                    {type === "work" ? (
                                        <Briefcase className="h-5 w-5 text-primary" />
                                    ) : (
                                        <GraduationCap className="h-5 w-5 text-primary" />
                                    )}
                                </div>
                            </div>

                            {/* Content */}
                            <div className="flex-1 pt-1">
                                <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-2 mb-2">
                                    <div>
                                        <h3 className="text-2xl font-bold text-foreground leading-tight">
                                            {item.company || item.institution || "Organization"}
                                        </h3>
                                        <p className="text-lg text-muted-foreground font-medium">
                                            {item.role || item.degree}
                                        </p>
                                    </div>
                                    <div className="shrink-0 text-sm font-medium text-muted-foreground bg-secondary/50 px-3 py-1 rounded-full w-fit">
                                        {item.startDate} - {item.endDate || "Present"}
                                    </div>
                                </div>

                                <ul className="list-disc list-outside ml-4 md:ml-5 space-y-2 text-muted-foreground mb-4 leading-relaxed">
                                    {item.description?.map((desc: string, i: number) => (
                                        <li key={i}>{desc}</li>
                                    ))}
                                </ul>

                                {/* Tags/Chips */}
                                <div className="flex flex-wrap gap-2">
                                    {type === "education" && (
                                        <>
                                            <Badge variant="secondary" className="font-normal text-xs">
                                                <Globe className="mr-1 h-3 w-3" /> Final Year Project
                                            </Badge>
                                            {/* Placeholder logic for Dean's list etc. if data exists */}
                                        </>
                                    )}
                                    {type === "work" && item.skillsDemonstrated?.map((skill: any) => (
                                        <Badge key={skill._id} variant="outline" className="font-normal text-xs">
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
