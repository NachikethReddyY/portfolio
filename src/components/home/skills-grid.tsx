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
            <div className="space-y-4">
                <h3 className="text-xs font-serif font-bold uppercase tracking-widest text-muted-foreground/60 px-1">
                    Currently Working With
                </h3>
                <div className="flex flex-wrap gap-4">
                    <SkillBadge icon={SiJavascript} name="JavaScript" className="text-[#F7DF1E]" />
                    <SkillBadge icon={SiNextdotjs} name="Next.js" className="text-black dark:text-white" />
                    <SkillBadge icon={SiNodedotjs} name="Node.js" className="text-[#339933] dark:text-[#4BB543]" />
                    <SkillBadge icon={SiGit} name="Git" className="text-[#F05032]" />
                    <SkillBadge icon={SiMysql} name="MySQL" className="text-[#00758F] dark:text-[#4479A1] brightness-110" />
                </div>
            </div>

            <div className="space-y-4">
                <h3 className="text-xs font-serif font-bold uppercase tracking-widest text-muted-foreground/60 px-1">
                    Currently Learning
                </h3>
                <div className="flex flex-wrap gap-4 opacity-80">
                    <SkillBadge icon={SiPython} name="Python" className="text-[#3776AB] dark:text-[#5D9BC9]" />
                    <SkillBadge icon={SiReact} name="React" className="text-[#61DAFB]" />
                    <SkillBadge icon={SiReact} name="React Native" className="text-[#61DAFB]" />
                </div>
            </div>

            {/* Secondary / Exploring */}
            <div className="space-y-4">
                <h3 className="text-xs font-serif font-bold uppercase tracking-widest text-muted-foreground/60 px-1">
                    Exploring Next
                </h3>
                <div className="flex flex-wrap gap-4 opacity-80">
                    <SkillBadge icon={SiNextdotjs} name="Next.js" className="text-black dark:text-white" />
                    <SkillBadge icon={SiPostgresql} name="PostgreSQL" className="text-[#336791] dark:text-[#6082B6]" />
                </div>
            </div>
        </div>
    );
}

function SkillBadge({ icon: Icon, name, className }: { icon: any, name: string, className?: string }) {
    return (
        <div className="flex flex-col items-center gap-3 group cursor-default">
            <div className="h-14 w-14 bg-surface-container-low rounded-2xl flex items-center justify-center shadow-[0_8px_16px_-4px_rgba(0,0,0,0.04)] group-hover:shadow-[0_16px_32px_-8px_rgba(0,0,0,0.08)] group-hover:scale-110 transition-all duration-300 border-none">
                <Icon className={`h-7 w-7 ${className} transition-transform duration-300 group-hover:rotate-6`} />
            </div>
            <span className="font-sans font-medium text-[10px] tracking-wide text-muted-foreground group-hover:text-foreground text-center max-w-[72px] leading-tight transition-colors">{name}</span>
        </div>
    );
}
