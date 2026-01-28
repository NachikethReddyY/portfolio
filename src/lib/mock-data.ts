import { ExperienceFolder } from "@/lib/types";

export const MOCK_EXPERIENCE_FOLDERS: ExperienceFolder[] = [
    {
        _id: "folder-work",
        title: "work",
        color: "blue",
        items: [], // Cleared as requested
        previewImages: [],
    },
    {
        _id: "folder-education",
        title: "education",
        color: "slate",
        items: [
            {
                role: "Diploma in Computer Science",
                company: "Singapore Polytechnic",
                startDate: "Apr 2025",
                endDate: "Present",
                description: [
                    "Freshman Year.",
                    "Exploring full-stack development and system architecture.",
                    "Member of the SP Coding Club."
                ]
            }
        ],
        previewImages: [],
    }
];
