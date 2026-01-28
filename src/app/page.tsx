import { Button } from "@/components/ui/button";
import { Github, Linkedin, MapPin, ArrowRight } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { TimelineTabs } from "@/components/experience/timeline-tabs";
import { SkillsGrid } from "@/components/home/skills-grid";
import { HeroProjectCard } from "@/components/home/hero-project-card";
import { MOCK_EXPERIENCE_FOLDERS } from "@/lib/mock-data";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { BubbleMenu } from "@/components/ui/bubble-menu";

export default function Home() {
  return (
    <main className="min-h-screen bg-[#f5f5f5] font-sans mb-20 relative">


      <div className="max-w-5xl mx-auto px-6 md:px-12 pt-12 md:pt-24 relative z-10 space-y-16">

        {/* 2. PROFILE & INTRO */}
        <div className="space-y-6">
          {/* Avatar + Status */}
          <div className="flex items-end justify-between">
            <div className="relative">
              <div className="h-32 w-32 rounded-full border-4 border-[#f5f5f5] bg-white overflow-hidden shadow-sm flex items-center justify-center relative">
                <Image
                  src="/mesquare.png"
                  alt="Nachiketh Profile"
                  width={128}
                  height={128}
                  className="object-cover w-full h-full"
                />
              </div>
              <div className="absolute bottom-2 right-2 h-5 w-5 bg-green-500 rounded-full border-4 border-[#f5f5f5] z-10" title="Available for work" />
            </div>

            <div className="flex gap-2 mb-2">
              <Button variant="outline" size="sm" asChild>
                <Link href="https://linkedin.com/in/ynr-nachiketh-reddy" target="_blank"><Linkedin className="h-4 w-4" /></Link>
              </Button>
              <Button variant="outline" size="sm" asChild>
                <Link href="https://github.com/NachikethReddyY" target="_blank"><Github className="h-4 w-4" /></Link>
              </Button>
              <Button variant="outline" size="sm" asChild>
                <Link href="mailto:contact@nachiketh.com"><ArrowRight className="h-4 w-4 -rotate-45" /></Link>
              </Button>
            </div>
          </div>

          <div className="space-y-6 max-w-3xl">
            <h1 className="text-4xl md:text-6xl font-bold tracking-tight text-foreground leading-tight">
              Full Stack Developer.
            </h1>
            <p className="text-xl text-muted-foreground leading-relaxed max-w-2xl">
              I build practical web systems with APIs and clean architecture using modern JavaScript frameworks.
            </p>

            <div className="flex flex-wrap gap-3 pt-2">
              <Badge variant="secondary" className="px-3 py-1 text-sm font-medium"><MapPin className="mr-1 h-3 w-3" /> Based in Singapore</Badge>
              <Badge variant="secondary" className="px-3 py-1 text-sm font-medium bg-green-100 text-green-700 hover:bg-green-100"><div className="mr-2 h-2 w-2 rounded-full bg-green-600 animate-pulse" /> Available to work</Badge>
            </div>

            <div className="pt-4">
              <Button size="lg" asChild className="font-semibold text-base px-8">
                <Link href="#projects">View Case Studies &rarr;</Link>
              </Button>
            </div>
          </div>
        </div>

        {/* 4. SKILLS SECTION */}
        <div className="pt-4">
          <SkillsGrid />
        </div>

        {/* 5. EXPERIENCE SECTION */}
        <section id="experience" className="scroll-mt-24 pt-8">
          <div className="mb-8">
            <h2 className="text-2xl font-bold tracking-tight mb-2">Professional Journey</h2>
          </div>
          <TimelineTabs
            workExperience={MOCK_EXPERIENCE_FOLDERS.find(f => f.title === 'work')!}
            education={MOCK_EXPERIENCE_FOLDERS.find(f => f.title === 'education')!}
          />
        </section>

        {/* 3. FEATURED PROJECTS SECTION (Moved Below Experience) */}
        <section id="projects" className="space-y-8 scroll-mt-24">
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <h2 className="text-2xl font-bold tracking-tight">Featured Projects</h2>
              <p className="text-muted-foreground">Real-world applications and technical implementations.</p>
            </div>
            <Button variant="ghost" asChild className="hidden md:flex">
              <Link href="/projects">View Archive &rarr;</Link>
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <HeroProjectCard
              title="Zero Waste Gallery"
              category="Academic"
              description="Custom JS circular navigation system for complex UIs."
              tags={["JavaScript", "DOM API"]}
              href="/projects/zero-waste"
            />
            <HeroProjectCard
              title="EduPortal Platform"
              category="Academic"
              description="End-to-end education platform with raw form validation."
              tags={["HTML5 Forms", "CSS Grid"]}
              href="/projects/edu-portal"
            />
            <HeroProjectCard
              title="Iris Lite v2"
              category="Personal"
              description="High-performance landing page (100 Lighthouse score)."
              tags={["Responsive", "Performance"]}
              href="/projects/iris-lite"
            />
          </div>

          <div className="md:hidden pt-4 text-center">
            <Button variant="outline" className="w-full" asChild>
              <Link href="/projects">View Archive &rarr;</Link>
            </Button>
          </div>
        </section>
      </div>
    </main>
  );
}
