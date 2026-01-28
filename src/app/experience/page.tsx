import { TimelineTabs } from "@/components/experience/timeline-tabs";
import { ExperienceFolder } from "@/lib/types";

// Mock Data adapted for Tabs
const MOCK_FOLDERS: ExperienceFolder[] = [
    {
        _id: "folder-work",
        title: "work", // Matches Tab Value
        color: "blue",
        items: [
            {
                role: "Frontend Developer",
                company: "Freelance",
                startDate: "Jan 2024",
                endDate: "Present",
                description: [
                    "Built high-performance landing pages for local SMEs using Next.js, achieving 100/100 Lighthouse scores.",
                    "Developed a custom inventory management dashboard for a retail client, reducing stock counting time by 40%."
                ]
            },
            {
                role: "Frontend Developer Intern",
                company: "Tech Startups Inc",
                startDate: "May 2023",
                endDate: "Aug 2023",
                description: [
                    "Migrated legacy CRA app to Next.js 13, improving TTI by 35%.",
                    "Implemented design system with Tailwind CSS reducing bundle size by 30%."
                ]
            }
        ],
        previewImages: [],
    },
    {
        _id: "folder-education",
        title: "education",
        color: "slate",
        items: [
            {
                role: "Diploma in Information Technology",
                company: "Singapore Polytechnic",
                startDate: "2020",
                endDate: "2023",
                description: [
                    "Specialization in Software Engineering.",
                    "President of Coding Club (2021-2022).",
                    "Start-up Hackathon Winner (2022)."
                ]
            }
        ],
        previewImages: [],
    }
];

export default function ExperiencePage() {
    const work = MOCK_FOLDERS.find(f => f.title === 'work')!;
    const edu = MOCK_FOLDERS.find(f => f.title === 'education')!;

    return (
        <main className="min-h-screen p-4 md:p-12 mb-20">
            <div className="max-w-4xl mx-auto mb-10 text-center">
                <h1 className="text-4xl font-bold tracking-tight mb-4">Experience & Education</h1>
                <p className="text-muted-foreground text-lg">My professional journey and academic background.</p>
            </div>
            <TimelineTabs workExperience={work} education={edu} />
        </main>
    )
}
