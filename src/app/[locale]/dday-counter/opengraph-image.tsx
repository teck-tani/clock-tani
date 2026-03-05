import { generateOgImage, ogSize } from '@/lib/og-template';

export const runtime = 'edge';
export const alt = 'D-day 카운터';
export const size = ogSize;
export const contentType = 'image/png';

export default async function Image({ params }: { params: { locale: string } }) {
    return generateOgImage({
        locale: params.locale,
        title: { ko: 'D-day 카운터', en: 'D-Day Counter' },
        subtitle: { ko: '중요한 날까지 남은 일수를 실시간 확인', en: 'Real-time Countdown to Your Important Day' },
        tags: {
            ko: ['최대 20개', '6개 카테고리', '음력 지원', '무료'],
            en: ['Up to 20', '6 Categories', 'Lunar Calendar', 'FREE'],
        },
        icon: '📅',
        accentColor: '#ec4899',
    });
}
