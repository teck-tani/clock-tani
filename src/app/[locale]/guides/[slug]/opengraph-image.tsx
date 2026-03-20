import { generateOgImage, ogSize } from '@/lib/og-template';

export const alt = '가이드';
export const size = ogSize;
export const contentType = 'image/png';

// 슬러그별 OG 이미지 데이터
const guideOgData: Record<string, {
    title: { ko: string; en: string };
    subtitle: { ko: string; en: string };
    icon: string;
    accentColor: string;
    tags: { ko: string[]; en: string[] };
}> = {
    'pomodoro-technique-guide': {
        title: { ko: '포모도로 기법 완벽 가이드', en: 'Pomodoro Technique Guide' },
        subtitle: { ko: '25분 집중 + 5분 휴식으로 생산성 UP', en: '25-Min Focus + 5-Min Break for Productivity' },
        icon: '🍅',
        accentColor: '#ef4444',
        tags: { ko: ['25분 집중', '5분 휴식', '생산성', '무료 타이머'], en: ['25-Min Focus', '5-Min Break', 'Productivity', 'Free Timer'] },
    },
    'tabata-timer-guide': {
        title: { ko: '타바타 운동 타이머 사용법', en: 'Tabata Workout Timer Guide' },
        subtitle: { ko: '20초 운동 / 10초 휴식 / 8라운드 HIIT', en: '20s Work / 10s Rest / 8 Rounds HIIT' },
        icon: '🏋️',
        accentColor: '#f97316',
        tags: { ko: ['타바타', 'HIIT', '인터벌', '운동'], en: ['Tabata', 'HIIT', 'Interval', 'Workout'] },
    },
    'time-zone-calculation': {
        title: { ko: '시차 계산하는 방법', en: 'Time Zone Calculation Guide' },
        subtitle: { ko: 'UTC, GMT, 서머타임 완벽 정리', en: 'UTC, GMT & Daylight Saving Time Explained' },
        icon: '🌍',
        accentColor: '#3b82f6',
        tags: { ko: ['UTC/GMT', '서머타임', '시차 비교', '해외 여행'], en: ['UTC/GMT', 'DST', 'Time Diff', 'Travel'] },
    },
    'dday-countdown-usage': {
        title: { ko: 'D-Day 카운트다운 활용법', en: 'D-Day Countdown Guide' },
        subtitle: { ko: '시험, 기념일, 마감일 관리', en: 'Track Exams, Events & Deadlines' },
        icon: '📅',
        accentColor: '#8b5cf6',
        tags: { ko: ['시험 D-Day', '기념일', '마감일', '목표 관리'], en: ['Exam D-Day', 'Anniversary', 'Deadline', 'Goals'] },
    },
    'time-management-techniques': {
        title: { ko: '시간 관리 기법 5가지', en: '5 Time Management Techniques' },
        subtitle: { ko: '검증된 생산성 향상 방법 비교', en: 'Proven Methods to Boost Productivity' },
        icon: '⏰',
        accentColor: '#0891b2',
        tags: { ko: ['포모도로', '타임 블로킹', '2분 법칙', '생산성'], en: ['Pomodoro', 'Time Blocking', '2-Min Rule', 'Productivity'] },
    },
    'online-vs-device-clock': {
        title: { ko: '온라인 시계 vs 기기 시계', en: 'Online vs Device Clock' },
        subtitle: { ko: 'NTP 동기화와 정확도 기술 비교', en: 'NTP Sync & Accuracy Comparison' },
        icon: '🔬',
        accentColor: '#059669',
        tags: { ko: ['NTP 동기화', '밀리초 정밀도', '티켓팅', '서버 시간'], en: ['NTP Sync', 'Millisecond', 'Ticketing', 'Server Time'] },
    },
    'alarm-setting-tips': {
        title: { ko: '효과적인 알람 설정 팁', en: 'Effective Alarm Setting Tips' },
        subtitle: { ko: '수면 주기 기반 최적 기상법', en: 'Wake Up Better with Sleep Cycle Timing' },
        icon: '⏰',
        accentColor: '#d946ef',
        tags: { ko: ['수면 주기', '90분 사이클', '스누즈', '아침 루틴'], en: ['Sleep Cycle', '90-Min Cycle', 'Snooze', 'Morning Routine'] },
    },
};

export default async function Image({ params }: { params: { locale: string; slug: string } }) {
    const data = guideOgData[params.slug];

    // 매핑에 없는 slug는 기본 가이드 이미지
    if (!data) {
        return generateOgImage({
            locale: params.locale,
            title: { ko: '시간 관리 가이드', en: 'Time Management Guide' },
            subtitle: { ko: 'Clock-Tani 실용 가이드', en: 'Practical Guide by Clock-Tani' },
            tags: { ko: ['가이드', '시간 관리', '생산성', '무료'], en: ['Guide', 'Time Management', 'Productivity', 'Free'] },
            icon: '📖',
            accentColor: '#0891b2',
        });
    }

    return generateOgImage({
        locale: params.locale,
        ...data,
    });
}
