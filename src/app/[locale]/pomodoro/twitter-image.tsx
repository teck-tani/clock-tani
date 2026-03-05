import { generateOgImage, ogSize } from '@/lib/og-template';

export const runtime = 'edge';
export const alt = '포모도로 타이머';
export const size = ogSize;
export const contentType = 'image/png';

export default async function Image({ params }: { params: { locale: string } }) {
    return generateOgImage({
        locale: params.locale,
        title: { ko: '포모도로 타이머', en: 'Pomodoro Timer' },
        subtitle: { ko: '25분 집중 + 5분 휴식으로 생산성 극대화', en: '25min Focus + 5min Break for Maximum Productivity' },
        tags: {
            ko: ['자동 세션 전환', '집중 통계', '작업 목록', '무료'],
            en: ['Auto Session', 'Focus Stats', 'Task List', 'FREE'],
        },
        icon: '🍅',
        accentColor: '#ef4444',
    });
}
