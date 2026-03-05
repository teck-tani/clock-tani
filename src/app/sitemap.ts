import type { MetadataRoute } from 'next';

const baseUrl = 'https://clock-tani.com';

const locales = ['ko', 'en'];
const tools = [
    { path: '/clock', priority: 1.0, changeFrequency: 'daily' as const },
    { path: '/stopwatch', priority: 0.8, changeFrequency: 'monthly' as const },
    { path: '/timer', priority: 0.8, changeFrequency: 'monthly' as const },
    { path: '/pomodoro', priority: 0.8, changeFrequency: 'monthly' as const },
    { path: '/interval', priority: 0.7, changeFrequency: 'monthly' as const },
    { path: '/multi-timer', priority: 0.7, changeFrequency: 'monthly' as const },
    { path: '/alarm', priority: 0.7, changeFrequency: 'monthly' as const },
    { path: '/server-time', priority: 0.7, changeFrequency: 'monthly' as const },
    { path: '/dday-counter', priority: 0.7, changeFrequency: 'monthly' as const },
    { path: '/privacy', priority: 0.3, changeFrequency: 'yearly' as const },
    { path: '/terms', priority: 0.3, changeFrequency: 'yearly' as const },
    { path: '/about', priority: 0.4, changeFrequency: 'yearly' as const },
];

export default function sitemap(): MetadataRoute.Sitemap {
    const entries: MetadataRoute.Sitemap = [];

    for (const tool of tools) {
        for (const locale of locales) {
            entries.push({
                url: `${baseUrl}/${locale}${tool.path}`,
                lastModified: new Date(),
                changeFrequency: tool.changeFrequency,
                priority: tool.priority,
            });
        }
    }

    return entries;
}
