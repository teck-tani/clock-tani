import { generateOgImage, ogSize } from '@/lib/og-template';

export const runtime = 'edge';
export const alt = '온라인 타이머';
export const size = ogSize;
export const contentType = 'image/png';

export default async function Image({ params }: { params: { locale: string } }) {
    return generateOgImage({
        locale: params.locale,
        title: { ko: '온라인 타이머', en: 'Online Timer' },
        subtitle: { ko: '요리, 공부, 운동에 딱 맞는 카운트다운 타이머', en: 'Countdown Timer for Cooking, Study & Workout' },
        tags: {
            ko: ['5종 알림음', '배경 사운드', '화면 꺼짐 방지', '무료'],
            en: ['5 Alarm Sounds', 'Ambient Sound', 'Wake Lock', 'FREE'],
        },
        icon: '⏲️',
        accentColor: '#f59e0b',
    });
}
