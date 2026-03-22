import { Button } from "@/components/ui/button";
import { Github, Linkedin, MapPin, Mail } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { TimelineTabs } from "@/components/experience/timeline-tabs";
import { TechArsenal } from "@/components/home/tech-arsenal";
import { HeroProjectCard } from "@/components/home/hero-project-card";
import { MOCK_EXPERIENCE_FOLDERS } from "@/lib/mock-data";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { BubbleMenu } from "@/components/ui/bubble-menu";

import { client } from "@/sanity/lib/client";
import { urlFor } from "@/sanity/lib/image";

export const revalidate = 60;

export default async function Home() {
  let featuredProjects: any[] = [];
  try {
    featuredProjects = await client.fetch(`
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
  } catch (error) {
    console.warn("[Sanity]: Failed to fetch projects. Falling back to empty state.", error);
  }

  return (
    <main className="min-h-screen bg-background mb-20 relative font-sans">
      <div className="max-w-7xl mx-auto px-6 md:px-12 pt-16 md:pt-24 relative z-10 space-y-12">

        {/* 2. PROFILE & INTRO */}
        <section className="py-12 md:py-20">
          <div className="space-y-10">
            {/* Avatar + Status */}
            <div className="flex items-end justify-between">
              <div className="relative">
                <div className="h-40 w-40 rounded-[2.5rem] bg-surface-container-low overflow-hidden shadow-[0_20px_40px_-15px_rgba(0,0,0,0.08)] flex items-center justify-center relative group transition-all hover:scale-[1.02]">
                  <Image
                    src="/mesquare.png"
                    alt="Nachiketh Profile"
                    width={160}
                    height={160}
                    className="object-cover w-full h-full grayscale hover:grayscale-0 transition-all duration-700"
                  />
                </div>
                <div className="absolute bottom-4 right-4 h-6 w-6 bg-green-500 rounded-full border-4 border-background z-10" title="Available for work" />
              </div>

              <div className="flex gap-4 mb-4">
                <Button variant="outline" size="icon" asChild className="rounded-2xl">
                  <Link href="https://linkedin.com/in/nachikethreddyy" target="_blank"><Linkedin className="h-5 w-5" /></Link>
                </Button>
                <Button variant="outline" size="icon" asChild className="rounded-2xl">
                  <Link href="https://github.com/nachikethreddyy" target="_blank"><Github className="h-5 w-5" /></Link>
                </Button>
                <Button variant="outline" size="icon" asChild className="rounded-2xl">
                  <Link href="mailto:y.nachiketh.reddy@gmail.com"><Mail className="h-5 w-5" /></Link>
                </Button>
              </div>
            </div>

            <div className="space-y-8 max-w-4xl">
              <h1 className="text-6xl md:text-8xl font-serif font-bold tracking-tight text-foreground leading-[1.1]">
                Hi, I&apos;m <span className="text-primary italic">Nachiketh</span> Reddy.
              </h1>
              <p className="text-xl md:text-2xl text-muted-foreground/90 leading-relaxed font-sans font-medium">
                I am a Full Stack Developer building practical web systems with APIs and clean architecture. I&apos;m a 17-year-old student at <span className="text-foreground border-b-2 border-primary/20 pb-0.5">Singapore Polytechnic 🇸🇬</span>, pursuing my Diploma in Computer Science.
              </p>
              
              <div className="flex flex-wrap items-center gap-8 text-sm font-semibold tracking-wide text-muted-foreground/60 uppercase">
                <div className="flex items-center gap-3">
                  <MapPin className="h-4 w-4" />
                  <span>Based in Singapore</span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="relative flex h-2.5 w-2.5">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-green-500"></span>
                  </span>
                  <span className="text-green-600 dark:text-green-400">Available to work</span>
                </div>
              </div>

              <div className="pt-6">
                <Button size="lg" asChild className="font-bold text-lg shadow-xl hover:shadow-primary/30 active:scale-95 transition-all">
                  <Link href="#projects">Explore My Work &rarr;</Link>
                </Button>
              </div>
            </div>
          </div>
        </section>
      </div>

      {/* TONAL SECTION FOR SKILLS & EXPERIENCE */}
      <div className="bg-surface-container-low/50 py-24 md:py-32">
        <div className="max-w-7xl mx-auto px-6 md:px-12 space-y-32">
          {/* 4. SKILLS SECTION */}
          <TechArsenal />

          {/* 5. EXPERIENCE SECTION */}
          <section id="experience" className="scroll-mt-32 space-y-12">
            <h2 className="text-3xl md:text-4xl font-serif font-bold tracking-tight">The Journey</h2>
            <TimelineTabs
              workExperience={MOCK_EXPERIENCE_FOLDERS.find(f => f.title === 'work')!}
              education={MOCK_EXPERIENCE_FOLDERS.find(f => f.title === 'education')!}
            />
          </section>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 md:px-12 py-24 md:py-32 space-y-24">
        {/* 3. FEATURED PROJECTS SECTION */}
        <section id="projects" className="space-y-12 scroll-mt-32">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div className="space-y-3">
              <h2 className="text-4xl md:text-5xl font-serif font-bold tracking-tight">Selected Works</h2>
              <p className="text-lg text-muted-foreground/80 font-sans max-w-xl">Deep-dives into systems architecture and real-world implementations.</p>
            </div>
            <Button variant="ghost" asChild className="text-primary font-bold hover:bg-primary/5 rounded-2xl px-6">
              <Link href="/projects">View Full Archive &rarr;</Link>
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
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
              <div className="col-span-1 md:col-span-2 text-center py-24 text-muted-foreground border border-dashed border-muted-foreground/20 rounded-[3rem] bg-surface-container-low font-serif italic text-xl">
                The gallery is currently empty. Incoming masterpieces...
              </div>
            )}
          </div>

          <div className="md:hidden pt-8">
            <Button variant="outline" className="w-full text-lg h-14" asChild>
              <Link href="/projects">View Full Archive &rarr;</Link>
            </Button>
          </div>
        </section>
      </div>
    </main>
  );
}
