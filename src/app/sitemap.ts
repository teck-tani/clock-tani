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
    // 각 페이지의 실제 마지막 수정일
    const lastModifiedDates: Record<string, Date> = {
        '/clock': new Date('2025-02-15'),
        '/stopwatch': new Date('2024-12-20'),
        '/timer': new Date('2024-12-20'),
        '/pomodoro': new Date('2024-12-20'),
        '/interval': new Date('2024-12-20'),
        '/multi-timer': new Date('2024-12-20'),
        '/alarm': new Date('2024-12-20'),
        '/server-time': new Date('2024-12-20'),
        '/dday-counter': new Date('2024-12-20'),
        '/privacy': new Date('2024-12-01'),
        '/terms': new Date('2024-12-01'),
        '/about': new Date('2024-12-01'),
    };

    for (const tool of tools) {
        for (const locale of locales) {
            entries.push({
                url: `${baseUrl}/${locale}${tool.path}`,
                lastModified: lastModifiedDates[tool.path] || new Date('2024-12-01'),
                changeFrequency: tool.changeFrequency,
                priority: tool.priority,
                alternates: {
                    languages: {
                        ko: `${baseUrl}/ko${tool.path}`,
                        en: `${baseUrl}/en${tool.path}`,
                    },
                },
            });
        }
    }

    return entries;
}
