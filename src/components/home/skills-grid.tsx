"use client";

import {
    SiHtml5, SiCss3, SiJavascript, SiTypescript,
    SiReact, SiNextdotjs, SiTailwindcss, SiGit,
    SiPython, SiNodedotjs, SiSupabase, SiPostgresql
} from "react-icons/si";

export function SkillsGrid() {
    return (
        <div className="space-y-8">
            {/* Primary Stack */}
            <div className="space-y-4">
                <h3 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">
                    Currently Working With
                </h3>
                <div className="flex flex-wrap gap-3">
                    <SkillBadge icon={SiJavascript} name="JavaScript" color="#F7DF1E" />
                    <SkillBadge icon={SiTypescript} name="TypeScript" color="#3178C6" />
                    <SkillBadge icon={SiReact} name="React" color="#61DAFB" />
                    <SkillBadge icon={SiNextdotjs} name="Next.js" color="#000000" />
                    <SkillBadge icon={SiTailwindcss} name="Tailwind" color="#06B6D4" />
                    <SkillBadge icon={SiNodedotjs} name="Node.js" color="#339933" />
                    <SkillBadge icon={SiGit} name="Git" color="#F05032" />
                    <SkillBadge icon={SiSupabase} name="Supabase" color="#3ECF8E" />
                </div>
            </div>

            {/* Secondary / Exploring */}
            <div className="space-y-4">
                <h3 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">
                    Exploring Next
                </h3>
                <div className="flex flex-wrap gap-3 opacity-80">
                    <SkillBadge icon={SiPython} name="Python" color="#3776AB" />
                    <SkillBadge icon={SiPostgresql} name="PostgreSQL" color="#4169E1" />
                    {/* Add more as needed */}
                </div>
            </div>
        </div>
    );
}

function SkillBadge({ icon: Icon, name, color }: { icon: any, name: string, color: string }) {
    return (
        <div className="flex items-center gap-2 px-4 py-2 bg-white border border-zinc-200 rounded-lg shadow-sm hover:shadow-md transition-all">
            <Icon className="h-5 w-5" style={{ color }} />
            <span className="font-medium text-sm text-zinc-700">{name}</span>
        </div>
    );
}
