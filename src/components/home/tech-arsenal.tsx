"use client";

import { Terminal, Layers, Database, PenTool } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

const skills = [
  {
    title: "Backend Architecture",
    description: "Node.js, Python, Go, Microservices",
    icon: Terminal,
    color: "text-blue-500",
  },
  {
    title: "Frontend Engineering",
    description: "React, Next.js, Tailwind, Vue",
    icon: Layers,
    color: "text-indigo-400",
  },
  {
    title: "Cloud & DevOps",
    description: "AWS, Docker, Kubernetes, CI/CD",
    icon: Database,
    color: "text-slate-400",
  },
  {
    title: "Product Design",
    description: "Figma, UI Systems, UX Research",
    icon: PenTool,
    color: "text-zinc-400",
  },
];

export function TechArsenal() {
  return (
    <section className="space-y-16">
      <div className="text-center space-y-6 max-w-4xl mx-auto">
        <h2 className="text-5xl md:text-7xl font-serif font-bold tracking-tight text-foreground">
          The Technical Arsenal
        </h2>
        <p className="text-xl md:text-2xl text-muted-foreground/80 font-sans font-medium leading-relaxed max-w-2xl mx-auto">
          Bridging the gap between complex backend logic and high-fidelity front-end interfaces.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
        {skills.map((skill, index) => (
          <Card 
            key={index} 
            className="group bg-surface-container-low border-none rounded-[3rem] transition-all duration-700 hover:bg-surface-container-high hover:scale-[1.02] hover:shadow-2xl shadow-sm"
          >
            <CardContent className="p-10 md:p-12 space-y-10 h-full flex flex-col items-start justify-between min-h-[360px]">
              <div className="h-20 w-20 rounded-[2rem] bg-surface-container-highest flex items-center justify-center shadow-inner group-hover:scale-110 transition-transform duration-500">
                <skill.icon className={`h-10 w-10 ${skill.color}`} />
              </div>
              
              <div className="space-y-4">
                <h3 className="text-2xl md:text-3xl font-serif font-bold tracking-tight text-foreground group-hover:text-primary transition-colors duration-300">
                  {skill.title}
                </h3>
                <p className="text-base font-sans font-medium text-muted-foreground/90 leading-relaxed">
                  {skill.description}
                </p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </section>
  );
}
