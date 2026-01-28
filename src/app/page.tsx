import { Button } from "@/components/ui/button";
import { Github, Linkedin, MapPin, Mail } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { TimelineTabs } from "@/components/experience/timeline-tabs";
import { SkillsGrid } from "@/components/home/skills-grid";
import { HeroProjectCard } from "@/components/home/hero-project-card";
import { MOCK_EXPERIENCE_FOLDERS } from "@/lib/mock-data";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { BubbleMenu } from "@/components/ui/bubble-menu";

import { client } from "@/sanity/lib/client";
import { urlFor } from "@/sanity/lib/image";

export const revalidate = 60;

export default async function Home() {
  const featuredProjects = await client.fetch(`
    *[_type == "project" && isFeatured == true] | order(publishedAt desc)[0...3] {
      _id,
      title,
      slug,
      tagline,
      coverImage,
      publishedAt,
      repoUrl,
      "type": coalesce(type, "personal"),
      "techStack": techStack[]->name
    }
  `);

  return (
    <main className="min-h-screen bg-background font-sans mb-20 relative">


      <div className="max-w-7xl mx-auto px-6 md:px-12 pt-20 md:pt-32 relative z-10 space-y-8">

        {/* 2. PROFILE & INTRO */}
        <div className="space-y-6">
          {/* Avatar + Status */}
          <div className="flex items-end justify-between">
            <div className="relative">
              <div className="h-32 w-32 rounded-full border-4 border-border bg-card overflow-hidden shadow-sm flex items-center justify-center relative">
                <Image
                  src="/mesquare.png"
                  alt="Nachiketh Profile"
                  width={128}
                  height={128}
                  className="object-cover w-full h-full"
                />
              </div>
              <div className="absolute bottom-2 right-2 h-5 w-5 bg-green-500 rounded-full border-4 border-border z-10" title="Available for work" />
            </div>

            <div className="flex gap-2 mb-2">
              <Button variant="outline" size="sm" asChild>
                <Link href="https://linkedin.com/in/ynr-nachiketh-reddy" target="_blank"><Linkedin className="h-4 w-4" /></Link>
              </Button>
              <Button variant="outline" size="sm" asChild>
                <Link href="https://github.com/NachikethReddyY" target="_blank"><Github className="h-4 w-4" /></Link>
              </Button>
              <Button variant="outline" size="sm" asChild>
                <Link href="mailto:ynrdevs@gmail.com"><Mail className="h-4 w-4" /></Link>
              </Button>
            </div>
          </div>

          <div className="space-y-6 w-full">
            <h1 className="text-4xl md:text-6xl font-bold tracking-tight text-foreground leading-tight">
              Hi, I&apos;m Nachiketh Reddy.
            </h1>
            <p className="text-xl text-muted-foreground leading-relaxed">
              I am a Full Stack Developer building practical web systems with APIs and clean architecture using modern JavaScript frameworks. I&apos;m a 17-year-old student at <span className="font-medium text-foreground">Singapore Polytechnic 🇸🇬</span>, pursuing my Diploma in Computer Science. While I&apos;m just starting my academic journey (Class of &apos;28), I spend my free time exploring full-stack development and system architecture.
            </p>
            <div className="flex flex-row items-center gap-6 pt-4 text-sm font-medium text-muted-foreground">
              <div className="flex items-center gap-2">
                <MapPin className="h-4 w-4" />
                <span>Based in Singapore</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="relative flex h-2.5 w-2.5">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-green-500"></span>
                </span>
                <span className="text-green-600 dark:text-green-400">Available to work</span>
              </div>
            </div>

            <div className="pt-4">
              <Button size="lg" asChild className="font-semibold text-base px-8">
                <Link href="#projects">View Case Studies &rarr;</Link>
              </Button>
            </div>
          </div>
        </div>

        {/* 4. SKILLS SECTION */}
        <div>
          <SkillsGrid />
        </div>

        {/* 5. EXPERIENCE SECTION */}
        <section id="experience" className="scroll-mt-24">
          <TimelineTabs
            workExperience={MOCK_EXPERIENCE_FOLDERS.find(f => f.title === 'work')!}
            education={MOCK_EXPERIENCE_FOLDERS.find(f => f.title === 'education')!}
          />
        </section>

        {/* 3. FEATURED PROJECTS SECTION */}
        <section id="projects" className="space-y-6 scroll-mt-24">
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
            {featuredProjects.map((project: any) => (
              <HeroProjectCard
                key={project._id}
                title={project.title}
                category={project.type}
                description={project.tagline}
                tags={project.techStack || []}
                href={`/projects/${project.slug.current}`}
                imageUrl={project.coverImage ? urlFor(project.coverImage).width(800).url() : undefined}
                date={project.publishedAt ? new Date(project.publishedAt).toLocaleDateString("en-US", { month: "short", year: "numeric" }) : undefined}
                repoUrl={project.repoUrl}
              />
            ))}
            {featuredProjects.length === 0 && (
              <div className="col-span-1 md:col-span-2 text-center py-12 text-muted-foreground border border-border rounded-xl bg-card">
                No featured projects found. Add them in Sanity Studio!
              </div>
            )}
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
