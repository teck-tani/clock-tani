import { generateOgImage, ogSize } from '@/lib/og-template';

export const runtime = 'edge';
export const alt = 'Clock-Tani 소개';
export const size = ogSize;
export const contentType = 'image/png';

export default async function Image({ params }: { params: { locale: string } }) {
    return generateOgImage({
        locale: params.locale,
        title: { ko: 'Clock-Tani 소개', en: 'About Clock-Tani' },
        subtitle: { ko: '무료 온라인 시간 도구 모음', en: 'Free Online Time Tools Collection' },
        tags: {
            ko: ['시계', '타이머', '스톱워치', '알람', 'D-Day'],
            en: ['Clock', 'Timer', 'Stopwatch', 'Alarm', 'D-Day'],
        },
        icon: '🕐',
        accentColor: '#0891b2',
    });
}
