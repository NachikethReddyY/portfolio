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
                    <SkillBadge icon={SiJavascript} name="JavaScript" color="#F7DF1E" />
                    <SkillBadge icon={SiNextdotjs} name="Next.js" color="#000000" />
                    <SkillBadge icon={SiNodedotjs} name="Node.js" color="#339933" />
                    <SkillBadge icon={SiGit} name="Git" color="#F05032" />
                    <SkillBadge icon={SiMysql} name="MySQL" color="#4169E1" />
                </div>
            </div>

            <div className="space-y-3">
                <h3 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">
                    Currently Learning
                </h3>
                <div className="flex flex-wrap gap-3 opacity-80">
                    <SkillBadge icon={SiPython} name="Python" color="#3776AB" />
                    <SkillBadge icon={SiReact} name="React" color="#61DAFB" />
                    <SkillBadge icon={SiReact} name="React Native" color="#61DAFB" />
                </div>
            </div>

            {/* Secondary / Exploring */}
            <div className="space-y-3">
                <h3 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">
                    Exploring Next
                </h3>
                <div className="flex flex-wrap gap-3 opacity-80">
                    <SkillBadge icon={SiNextdotjs} name="Next.js" color="#000000" />
                    <SkillBadge icon={SiPostgresql} name="PostgreSQL" color="#4169E1" />
                </div>
            </div>
        </div>
    );
}

function SkillBadge({ icon: Icon, name, color }: { icon: any, name: string, color: string }) {
    return (
        <div className="flex flex-col items-center gap-2 group cursor-default">
            <div className="h-12 w-12 bg-white border border-zinc-200 rounded-xl flex items-center justify-center shadow-sm group-hover:shadow-md group-hover:scale-105 transition-all">
                <Icon className="h-6 w-6" style={{ color }} />
            </div>
            <span className="font-medium text-xs text-zinc-500 group-hover:text-zinc-800 text-center max-w-[64px] leading-tight">{name}</span>
        </div>
    );
}
