import { Metadata } from "next";
import { getTranslations, setRequestLocale } from 'next-intl/server';
import { locales } from '@/navigation';

export function generateStaticParams() {
    return locales.map((locale) => ({ locale }));
}

export const dynamic = 'force-static';
export const revalidate = false;

const baseUrl = 'https://clock-tani.com';

export async function generateMetadata(props: { params: Promise<{ locale: string }> }): Promise<Metadata> {
    const { locale } = await props.params;
    const t = await getTranslations({ locale, namespace: 'About.meta' });
    const isKo = locale === 'ko';
    const url = `${baseUrl}/${locale}/about`;

    return {
        title: t('title'),
        description: t('description'),
        alternates: {
            canonical: url,
            languages: { 'ko': `${baseUrl}/ko/about`, 'en': `${baseUrl}/en/about` },
        },
        openGraph: {
            title: t('title'),
            description: t('description'),
            url,
            siteName: 'Clock-Tani',
            type: 'website',
            locale: isKo ? 'ko_KR' : 'en_US',
            alternateLocale: isKo ? 'en_US' : 'ko_KR',
        },
        twitter: {
            card: 'summary',
            title: t('title'),
            description: t('description'),
            site: '@teck_tani',
            creator: '@teck_tani',
        },
        robots: { index: true, follow: true },
    };
}

export default async function AboutPage(props: { params: Promise<{ locale: string }> }) {
    const { locale } = await props.params;
    setRequestLocale(locale);
    const t = await getTranslations({ locale, namespace: 'About' });

    const features = t.raw('features.items') as { name: string; desc: string }[];
    const values = t.raw('values.items') as string[];

    return (
        <div style={{ maxWidth: 800, margin: '0 auto', padding: '40px 20px', lineHeight: 1.8 }}>
            <h1 style={{ fontSize: '1.8rem', marginBottom: 16 }}>{t('title')}</h1>
            <p style={{ marginBottom: 32, fontSize: '1.05rem' }}>{t('description')}</p>

            <section style={{ marginBottom: 32 }}>
                <h2 style={{ fontSize: '1.3rem', marginBottom: 16 }}>{t('features.title')}</h2>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: 12 }}>
                    {features.map((item, i) => (
                        <div key={i} style={{ padding: '14px 16px', borderRadius: 8, border: '1px solid #e5e7eb', background: '#f9fafb' }}>
                            <strong>{item.name}</strong>
                            <p style={{ margin: '4px 0 0', fontSize: '0.9rem', color: '#666' }}>{item.desc}</p>
                        </div>
                    ))}
                </div>
            </section>

            <section style={{ marginBottom: 32 }}>
                <h2 style={{ fontSize: '1.3rem', marginBottom: 12 }}>{t('values.title')}</h2>
                <ul style={{ paddingLeft: 20 }}>
                    {values.map((item, i) => (
                        <li key={i} style={{ marginBottom: 6 }}>{item}</li>
                    ))}
                </ul>
            </section>

            <section>
                <h2 style={{ fontSize: '1.3rem', marginBottom: 8 }}>{t('contact.title')}</h2>
                <p>{t('contact.content')}</p>
                <p style={{ marginTop: 8 }}>
                    <a href={`mailto:${t('contact.email')}`} style={{ color: '#0891b2', fontWeight: 500 }}>
                        {t('contact.email')}
                    </a>
                </p>
            </section>
        </div>
    );
}
