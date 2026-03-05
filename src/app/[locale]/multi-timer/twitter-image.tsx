import { generateOgImage, ogSize } from '@/lib/og-template';

export const runtime = 'edge';
export const alt = '멀티 타이머';
export const size = ogSize;
export const contentType = 'image/png';

export default async function Image({ params }: { params: { locale: string } }) {
    return generateOgImage({
        locale: params.locale,
        title: { ko: '멀티 타이머', en: 'Multi Timer' },
        subtitle: { ko: '최대 4개 타이머를 동시에 실행', en: 'Run Up to 4 Timers Simultaneously' },
        tags: {
            ko: ['동시 4개', '개별 제어', '요리 & 공부', '무료'],
            en: ['4 Timers', 'Individual Control', 'Cook & Study', 'FREE'],
        },
        icon: '⏳',
        accentColor: '#06b6d4',
    });
}
