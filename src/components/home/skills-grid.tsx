import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
    SiHtml5,
    SiCss3,
    SiJavascript,
    SiGit,
    SiReact,
    SiPython
} from "react-icons/si";

const SKILLS = [
    { name: "HTML5", icon: <SiHtml5 className="h-5 w-5 text-[#E34F26]" />, status: "current" },
    { name: "CSS3", icon: <SiCss3 className="h-5 w-5 text-[#1572B6]" />, status: "current" },
    { name: "JavaScript", icon: <SiJavascript className="h-5 w-5 text-[#F7DF1E]" />, status: "current" },
    { name: "Python", icon: <SiPython className="h-5 w-5 text-[#3776AB]" />, status: "learning" },
    { name: "Git", icon: <SiGit className="h-5 w-5 text-[#F05032]" />, status: "learning" },
    { name: "React", icon: <SiReact className="h-5 w-5 text-[#61DAFB]" />, status: "learning" },
    { name: "React Native", icon: <SiReact className="h-5 w-5 text-[#61DAFB]" />, status: "learning" },
];

export function SkillsGrid() {
    return (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-7 gap-3">
            {SKILLS.map((skill) => (
                <Card key={skill.name} className="relative flex flex-col items-center justify-center p-3 gap-2 hover:border-primary/50 transition-colors cursor-default text-center h-24 overflow-visible group">

                    {skill.status === "learning" && (
                        <Badge className="absolute -top-2 -right-2 px-1.5 py-0.5 text-[10px] uppercase font-bold bg-blue-100 text-blue-700 hover:bg-blue-100 dark:bg-blue-900 dark:text-blue-300 pointer-events-none shadow-sm">
                            Learning
                        </Badge>
                    )}

                    <div className="h-8 w-8 rounded-md bg-secondary/50 flex items-center justify-center">
                        {skill.icon}
                    </div>
                    <span className="font-medium text-xs text-muted-foreground">{skill.name}</span>
                </Card>
            ))}
        </div>
    );
}
