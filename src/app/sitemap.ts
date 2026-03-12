import type { MetadataRoute } from 'next';

const baseUrl = 'https://clock-tani.com';

const locales = ['ko', 'en'];
const tools = [
    { path: '', priority: 1.0, changeFrequency: 'daily' as const },
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
    // 빌드 시점 날짜를 자동으로 사용 (배포할 때마다 갱신됨)
    const buildDate = new Date();

    for (const tool of tools) {
        for (const locale of locales) {
            entries.push({
                url: `${baseUrl}/${locale}${tool.path}`,
                lastModified: buildDate,
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
