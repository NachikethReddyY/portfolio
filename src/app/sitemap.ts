import { MetadataRoute } from 'next'
import { client } from '@/sanity/lib/client'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
    const baseUrl = 'https://ynr.vercel.app'

    // Static Pages
    const routes: MetadataRoute.Sitemap = [
        {
            url: baseUrl,
            lastModified: new Date(),
            changeFrequency: 'monthly',
            priority: 1,
        },
        {
            url: `${baseUrl}/projects`,
            lastModified: new Date(),
            changeFrequency: 'weekly',
            priority: 0.8,
        },
        {
            url: `${baseUrl}/experience`,
            lastModified: new Date(),
            changeFrequency: 'monthly',
            priority: 0.7,
        },
    ]

    // Dynamic Projects
    const projects = await client.fetch(`
        *[_type == "project"] {
            "slug": slug.current,
            publishedAt,
            _updatedAt
        }
    `)

    const projectRoutes = projects.map((project: any) => ({
        url: `${baseUrl}/projects/${project.slug}`,
        lastModified: new Date(project._updatedAt || project.publishedAt || new Date()),
        changeFrequency: 'monthly',
        priority: 0.6,
    })) as MetadataRoute.Sitemap;

    return [...routes, ...projectRoutes]
}
