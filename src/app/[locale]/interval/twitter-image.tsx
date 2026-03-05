import { generateOgImage, ogSize } from '@/lib/og-template';

export const runtime = 'edge';
export const alt = '인터벌 타이머';
export const size = ogSize;
export const contentType = 'image/png';

export default async function Image({ params }: { params: { locale: string } }) {
    return generateOgImage({
        locale: params.locale,
        title: { ko: '인터벌 타이머', en: 'Interval Timer' },
        subtitle: { ko: '타바타 & HIIT 트레이닝에 최적화된 타이머', en: 'Optimized for Tabata & HIIT Training' },
        tags: {
            ko: ['타바타 프리셋', 'HIIT', '라운드 자동 전환', '무료'],
            en: ['Tabata Preset', 'HIIT', 'Auto Round', 'FREE'],
        },
        icon: '💪',
        accentColor: '#8b5cf6',
    });
}
