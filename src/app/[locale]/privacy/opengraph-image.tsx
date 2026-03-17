import { generateOgImage, ogSize } from '@/lib/og-template';

export const runtime = 'edge';
export const alt = '개인정보처리방침';
export const size = ogSize;
export const contentType = 'image/png';

export default async function Image({ params }: { params: { locale: string } }) {
    return generateOgImage({
        locale: params.locale,
        title: { ko: '개인정보처리방침', en: 'Privacy Policy' },
        subtitle: { ko: 'Clock-Tani 개인정보 보호 안내', en: 'Clock-Tani Privacy Information' },
        tags: {
            ko: ['개인정보 보호', '이용자 권리', '보안'],
            en: ['Privacy', 'User Rights', 'Security'],
        },
        icon: '🔒',
        accentColor: '#6366f1',
    });
}
