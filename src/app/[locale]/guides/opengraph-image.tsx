import { generateOgImage, ogSize } from '@/lib/og-template';

export const runtime = 'edge';
export const alt = '시간 관리 가이드';
export const size = ogSize;
export const contentType = 'image/png';

export default async function Image({ params }: { params: { locale: string } }) {
    return generateOgImage({
        locale: params.locale,
        title: { ko: '시간 관리 가이드', en: 'Time Management Guides' },
        subtitle: { ko: '생산성 향상을 위한 7가지 실용 가이드', en: '7 Practical Guides to Boost Productivity' },
        tags: {
            ko: ['포모도로', '타바타', '시차 계산', 'D-Day'],
            en: ['Pomodoro', 'Tabata', 'Time Zones', 'D-Day'],
        },
        icon: '📖',
        accentColor: '#0891b2',
    });
}
