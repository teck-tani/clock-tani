import { generateOgImage, ogSize } from '@/lib/og-template';

export const runtime = 'edge';
export const alt = '이용약관';
export const size = ogSize;
export const contentType = 'image/png';

export default async function Image({ params }: { params: { locale: string } }) {
    return generateOgImage({
        locale: params.locale,
        title: { ko: '이용약관', en: 'Terms of Service' },
        subtitle: { ko: 'Clock-Tani 서비스 이용 규정', en: 'Clock-Tani Service Terms' },
        tags: {
            ko: ['이용 조건', '면책 사항', '저작권'],
            en: ['Usage Terms', 'Disclaimer', 'Copyright'],
        },
        icon: '📋',
        accentColor: '#6366f1',
    });
}
