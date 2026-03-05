import { generateOgImage, ogSize } from '@/lib/og-template';

export const runtime = 'edge';
export const alt = '온라인 스톱워치';
export const size = ogSize;
export const contentType = 'image/png';

export default async function Image({ params }: { params: { locale: string } }) {
    return generateOgImage({
        locale: params.locale,
        title: { ko: '온라인 스톱워치', en: 'Online Stopwatch' },
        subtitle: { ko: '밀리초 단위 정밀 시간 측정 & 랩타임 기록', en: 'Millisecond Precision & Lap Time Recording' },
        tags: {
            ko: ['밀리초 정밀', '랩타임 기록', 'CSV 내보내기', '무료'],
            en: ['Millisecond', 'Lap Time', 'CSV Export', 'FREE'],
        },
        icon: '⏱️',
        accentColor: '#3b82f6',
    });
}
