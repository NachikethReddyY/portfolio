import { Image } from 'sanity'

export interface TechSkill {
    name: string;
    category: 'core' | 'learning';
    icon?: any; // Sanity Image
}

export interface Project {
    _id: string;
    title: string;
    slug: { current: string };
    tagline: string;
    type: 'real-world' | 'personal' | 'academic';
    coverImage?: any;
    startDate?: string;
    endDate?: string;
    problem?: string;
    solution?: any;
    techStack: TechSkill[];
    liveUrl?: string;
    repoUrl?: string;
    isFeatured: boolean;
    publishedAt?: string;
}

export interface ExperienceItem {
    role: string;
    company: string;
    startDate: string;
    endDate?: string;
    description: string[];
    skillsDemonstrated?: { _id: string; name: string }[];
}

export interface ExperienceFolder {
    _id: string;
    title: string;
    color: string;
    coverImage?: any;
    items: ExperienceItem[];
    previewImages: any[];
}
