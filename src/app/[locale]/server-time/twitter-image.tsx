import { generateOgImage, ogSize } from '@/lib/og-template';

export const runtime = 'edge';
export const alt = '서버시간 / 티켓팅 시계';
export const size = ogSize;
export const contentType = 'image/png';

export default async function Image({ params }: { params: { locale: string } }) {
    return generateOgImage({
        locale: params.locale,
        title: { ko: '서버시간 / 티켓팅 시계', en: 'Server Time / Ticketing Clock' },
        subtitle: { ko: 'NTP 동기화 밀리초 정밀 시계', en: 'NTP Synchronized Millisecond Precision Clock' },
        tags: {
            ko: ['NTP 동기화', '밀리초 단위', '티켓팅 필수', '무료'],
            en: ['NTP Sync', 'Millisecond', 'Ticketing', 'FREE'],
        },
        icon: '🎯',
        accentColor: '#10b981',
    });
}
