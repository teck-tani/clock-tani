import { generateOgImage, ogSize } from '@/lib/og-template';

export const runtime = 'edge';
export const alt = '온라인 알람시계';
export const size = ogSize;
export const contentType = 'image/png';

export default async function Image({ params }: { params: { locale: string } }) {
    return generateOgImage({
        locale: params.locale,
        title: { ko: '온라인 알람시계', en: 'Online Alarm Clock' },
        subtitle: { ko: '브라우저에서 바로 사용하는 무료 알람', en: 'Free Alarm Clock Right in Your Browser' },
        tags: {
            ko: ['최대 10개', '5종 알림음', '스누즈', '무료'],
            en: ['Up to 10', '5 Sounds', 'Snooze', 'FREE'],
        },
        icon: '⏰',
        accentColor: '#f97316',
    });
}
