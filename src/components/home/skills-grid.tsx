"use client";

import {
    SiHtml5, SiCss3, SiJavascript, SiTypescript,
    SiReact, SiNextdotjs, SiTailwindcss, SiGit,
    SiPython, SiNodedotjs, SiPostgresql, SiMysql
} from "react-icons/si";

export function SkillsGrid() {
    return (
        <div className="space-y-6">
            {/* Primary Stack */}
            <div className="space-y-3">
                <h3 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">
                    Currently Working With
                </h3>
                <div className="flex flex-wrap gap-3">
                    <SkillBadge icon={SiJavascript} name="JavaScript" className="text-[#F7DF1E]" />
                    <SkillBadge icon={SiNextdotjs} name="Next.js" className="text-black dark:text-white" />
                    <SkillBadge icon={SiNodedotjs} name="Node.js" className="text-[#339933] dark:text-[#4BB543]" />
                    <SkillBadge icon={SiGit} name="Git" className="text-[#F05032]" />
                    <SkillBadge icon={SiMysql} name="MySQL" className="text-[#00758F] dark:text-[#4479A1] brightness-110" />
                </div>
            </div>

            <div className="space-y-3">
                <h3 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">
                    Currently Learning
                </h3>
                <div className="flex flex-wrap gap-3 opacity-80">
                    <SkillBadge icon={SiPython} name="Python" className="text-[#3776AB] dark:text-[#5D9BC9]" />
                    <SkillBadge icon={SiReact} name="React" className="text-[#61DAFB]" />
                    <SkillBadge icon={SiReact} name="React Native" className="text-[#61DAFB]" />
                </div>
            </div>

            {/* Secondary / Exploring */}
            <div className="space-y-3">
                <h3 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">
                    Exploring Next
                </h3>
                <div className="flex flex-wrap gap-3 opacity-80">
                    <SkillBadge icon={SiNextdotjs} name="Next.js" className="text-black dark:text-white" />
                    <SkillBadge icon={SiPostgresql} name="PostgreSQL" className="text-[#336791] dark:text-[#6082B6]" />
                </div>
            </div>
        </div>
    );
}

function SkillBadge({ icon: Icon, name, className }: { icon: any, name: string, className?: string }) {
    return (
        <div className="flex flex-col items-center gap-2 group cursor-default">
            <div className="h-12 w-12 bg-card border border-border rounded-xl flex items-center justify-center shadow-sm group-hover:shadow-md group-hover:scale-105 transition-all">
                <Icon className={`h-6 w-6 ${className}`} />
            </div>
            <span className="font-medium text-xs text-muted-foreground group-hover:text-foreground text-center max-w-[64px] leading-tight">{name}</span>
        </div>
    );
}
