import { generateOgImage, ogSize } from '@/lib/og-template';

export const runtime = 'edge';
export const alt = '자주 묻는 질문 (FAQ)';
export const size = ogSize;
export const contentType = 'image/png';

export default async function Image({ params }: { params: { locale: string } }) {
    return generateOgImage({
        locale: params.locale,
        title: { ko: '자주 묻는 질문 (FAQ)', en: 'Frequently Asked Questions' },
        subtitle: { ko: '시계, 타이머, 알람 등 시간 도구 사용법 Q&A', en: 'Q&A for Online Clock, Timer & Alarm Tools' },
        tags: {
            ko: ['사용법', '기술 관련', '개인정보', '무료'],
            en: ['How to Use', 'Technical', 'Privacy', 'FREE'],
        },
        icon: '❓',
        accentColor: '#6366f1',
    });
}
