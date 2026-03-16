import { Metadata } from "next";
import { getTranslations, setRequestLocale } from 'next-intl/server';
import { locales } from '@/navigation';
import Link from 'next/link';
import { ALL_GUIDES } from '@/config/guides';
import { ALL_TOOLS } from '@/config/tools';

export function generateStaticParams() {
    return locales.map((locale) => ({ locale }));
}

export const dynamic = 'force-static';
export const revalidate = false;

const baseUrl = 'https://clock-tani.com';

export async function generateMetadata(props: { params: Promise<{ locale: string }> }): Promise<Metadata> {
    const { locale } = await props.params;
    const t = await getTranslations({ locale, namespace: 'Guides' });
    const isKo = locale === 'ko';
    const url = `${baseUrl}/${locale}/guides`;

    return {
        title: t('meta.title'),
        description: t('meta.description'),
        alternates: {
            canonical: url,
            languages: { 'ko': `${baseUrl}/ko/guides`, 'en': `${baseUrl}/en/guides` },
        },
        openGraph: {
            title: t('meta.title'),
            description: t('meta.description'),
            url,
            siteName: 'Clock-Tani',
            type: 'website',
            locale: isKo ? 'ko_KR' : 'en_US',
            alternateLocale: isKo ? 'en_US' : 'ko_KR',
        },
        twitter: {
            card: 'summary',
            title: t('meta.title'),
            description: t('meta.description'),
            site: '@teck_tani',
            creator: '@teck_tani',
        },
        robots: { index: true, follow: true },
    };
}

export default async function GuidesListPage(props: { params: Promise<{ locale: string }> }) {
    const { locale } = await props.params;
    setRequestLocale(locale);
    const t = await getTranslations({ locale, namespace: 'Guides' });

    // 도구 라벨 번역
    const toolT = await getTranslations({ locale, namespace: 'Index.tools' });

    return (
        <div style={{ maxWidth: 800, margin: '0 auto', padding: '40px 20px', lineHeight: 1.8 }}>
            <h1 style={{ fontSize: '1.8rem', marginBottom: 8 }}>{t('listTitle')}</h1>
            <p style={{ marginBottom: 32, fontSize: '1.05rem', color: '#666' }}>{t('listDescription')}</p>

            <div style={{ display: 'grid', gap: 20 }}>
                {ALL_GUIDES.map((guide) => {
                    // 관련 도구 라벨 찾기
                    const tool = ALL_TOOLS.find(t => t.href === guide.relatedTool);
                    const toolLabel = tool ? toolT(tool.labelKey) : '';

                    return (
                        <Link
                            key={guide.slug}
                            href={`/${locale}/guides/${guide.slug}`}
                            style={{
                                display: 'block',
                                padding: '20px 24px',
                                borderRadius: 12,
                                border: '1px solid var(--card-border, #e5e7eb)',
                                background: 'var(--card-bg, #f9fafb)',
                                textDecoration: 'none',
                                color: 'inherit',
                                transition: 'box-shadow 0.2s, border-color 0.2s',
                            }}
                        >
                            <h2 style={{ fontSize: '1.15rem', marginBottom: 8, color: 'var(--text-primary, #111)' }}>
                                {t(`titles.${guide.titleKey}`)}
                            </h2>
                            <p style={{ fontSize: '0.92rem', color: 'var(--text-secondary, #666)', marginBottom: 12, lineHeight: 1.6 }}>
                                {t(`descriptions.${guide.descKey}`)}
                            </p>
                            <div style={{ display: 'flex', alignItems: 'center', gap: 12, fontSize: '0.82rem', color: '#999' }}>
                                <span>{t('publishedAt')}: {guide.date}</span>
                                {toolLabel && (
                                    <span style={{
                                        padding: '2px 10px',
                                        borderRadius: 20,
                                        background: 'var(--badge-bg, #e0f2fe)',
                                        color: 'var(--badge-text, #0891b2)',
                                        fontSize: '0.78rem',
                                        fontWeight: 500,
                                    }}>
                                        {t('relatedTool')}: {toolLabel}
                                    </span>
                                )}
                            </div>
                        </Link>
                    );
                })}
            </div>
        </div>
    );
}
