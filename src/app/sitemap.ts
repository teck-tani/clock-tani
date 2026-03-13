import type { MetadataRoute } from 'next';

const baseUrl = 'https://clock-tani.com';

const locales = ['ko', 'en'];
// lastModified: 해당 페이지 코드가 실제로 변경된 날짜 (배포 시점이 아님)
// 페이지를 수정하면 해당 날짜도 함께 업데이트할 것
const tools = [
    { path: '', priority: 1.0, changeFrequency: 'daily' as const, lastModified: '2026-03-12' },
    { path: '/clock', priority: 1.0, changeFrequency: 'daily' as const, lastModified: '2026-03-10' },
    { path: '/stopwatch', priority: 0.8, changeFrequency: 'monthly' as const, lastModified: '2026-03-09' },
    { path: '/timer', priority: 0.8, changeFrequency: 'monthly' as const, lastModified: '2026-03-09' },
    { path: '/pomodoro', priority: 0.8, changeFrequency: 'monthly' as const, lastModified: '2026-03-09' },
    { path: '/interval', priority: 0.7, changeFrequency: 'monthly' as const, lastModified: '2026-03-09' },
    { path: '/multi-timer', priority: 0.7, changeFrequency: 'monthly' as const, lastModified: '2026-03-09' },
    { path: '/alarm', priority: 0.7, changeFrequency: 'monthly' as const, lastModified: '2026-03-09' },
    { path: '/server-time', priority: 0.7, changeFrequency: 'monthly' as const, lastModified: '2026-03-08' },
    { path: '/dday-counter', priority: 0.7, changeFrequency: 'monthly' as const, lastModified: '2026-03-09' },
    { path: '/privacy', priority: 0.3, changeFrequency: 'yearly' as const, lastModified: '2026-03-05' },
    { path: '/terms', priority: 0.3, changeFrequency: 'yearly' as const, lastModified: '2026-03-05' },
    { path: '/about', priority: 0.4, changeFrequency: 'yearly' as const, lastModified: '2026-03-05' },
];

export default function sitemap(): MetadataRoute.Sitemap {
    const entries: MetadataRoute.Sitemap = [];

    for (const tool of tools) {
        for (const locale of locales) {
            entries.push({
                url: `${baseUrl}/${locale}${tool.path}`,
                lastModified: new Date(tool.lastModified),
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
