import type { MetadataRoute } from 'next';
import { ALL_GUIDES } from '@/config/guides';

const baseUrl = 'https://clock-tani.com';

const locales = ['ko', 'en'];
// lastModified: 해당 페이지 코드가 실제로 변경된 날짜 (배포 시점이 아님)
// 페이지를 수정하면 해당 날짜도 함께 업데이트할 것
const pages = [
    { path: '', priority: 1.0, changeFrequency: 'daily' as const, lastModified: '2026-03-17' },
    { path: '/clock', priority: 1.0, changeFrequency: 'daily' as const, lastModified: '2026-03-10' },
    { path: '/stopwatch', priority: 0.8, changeFrequency: 'monthly' as const, lastModified: '2026-03-17' },
    { path: '/timer', priority: 0.8, changeFrequency: 'monthly' as const, lastModified: '2026-03-17' },
    { path: '/pomodoro', priority: 0.8, changeFrequency: 'monthly' as const, lastModified: '2026-03-17' },
    { path: '/interval', priority: 0.7, changeFrequency: 'monthly' as const, lastModified: '2026-03-17' },
    { path: '/multi-timer', priority: 0.7, changeFrequency: 'monthly' as const, lastModified: '2026-03-17' },
    { path: '/alarm', priority: 0.7, changeFrequency: 'monthly' as const, lastModified: '2026-03-17' },
    { path: '/server-time', priority: 0.7, changeFrequency: 'monthly' as const, lastModified: '2026-03-17' },
    { path: '/dday-counter', priority: 0.7, changeFrequency: 'monthly' as const, lastModified: '2026-03-17' },
    { path: '/faq', priority: 0.5, changeFrequency: 'monthly' as const, lastModified: '2026-03-17' },
    { path: '/guides', priority: 0.6, changeFrequency: 'weekly' as const, lastModified: '2026-03-17' },
    { path: '/privacy', priority: 0.3, changeFrequency: 'yearly' as const, lastModified: '2026-03-17' },
    { path: '/terms', priority: 0.3, changeFrequency: 'yearly' as const, lastModified: '2026-03-17' },
    { path: '/about', priority: 0.4, changeFrequency: 'yearly' as const, lastModified: '2026-03-17' },
];

export default function sitemap(): MetadataRoute.Sitemap {
    const entries: MetadataRoute.Sitemap = [];

    // 일반 페이지
    for (const page of pages) {
        for (const locale of locales) {
            entries.push({
                url: `${baseUrl}/${locale}${page.path}`,
                lastModified: new Date(page.lastModified),
                changeFrequency: page.changeFrequency,
                priority: page.priority,
                alternates: {
                    languages: {
                        ko: `${baseUrl}/ko${page.path}`,
                        en: `${baseUrl}/en${page.path}`,
                    },
                },
            });
        }
    }

    // 가이드 개별 페이지
    for (const guide of ALL_GUIDES) {
        for (const locale of locales) {
            entries.push({
                url: `${baseUrl}/${locale}/guides/${guide.slug}`,
                lastModified: new Date(guide.lastModified),
                changeFrequency: 'monthly' as const,
                priority: 0.6,
                alternates: {
                    languages: {
                        ko: `${baseUrl}/ko/guides/${guide.slug}`,
                        en: `${baseUrl}/en/guides/${guide.slug}`,
                    },
                },
            });
        }
    }

    return entries;
}
