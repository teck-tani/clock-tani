import { Metadata } from "next";
import { getTranslations, setRequestLocale } from 'next-intl/server';
import { locales } from '@/navigation';
import Breadcrumb from "@/components/Breadcrumb";

export function generateStaticParams() {
    return locales.map((locale) => ({ locale }));
}

export const dynamic = 'force-static';
export const revalidate = false;

const baseUrl = 'https://clock-tani.com';

export async function generateMetadata(props: { params: Promise<{ locale: string }> }): Promise<Metadata> {
    const { locale } = await props.params;
    const t = await getTranslations({ locale, namespace: 'Terms.meta' });
    const isKo = locale === 'ko';
    const url = `${baseUrl}/${locale}/terms`;

    return {
        title: t('title'),
        description: t('description'),
        keywords: isKo
            ? '이용약관, 서비스 약관, Clock-Tani'
            : 'terms of service, terms and conditions, Clock-Tani',
        alternates: {
            canonical: url,
            languages: { 'x-default': `${baseUrl}/ko/terms`, 'ko': `${baseUrl}/ko/terms`, 'en': `${baseUrl}/en/terms` },
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

export default async function TermsPage(props: { params: Promise<{ locale: string }> }) {
    const { locale } = await props.params;
    setRequestLocale(locale);
    const t = await getTranslations({ locale, namespace: 'Terms' });

    const sectionKeys = ['service', 'usage', 'disclaimer', 'liability', 'ip', 'changes', 'contact'] as const;
    const listSections = ['usage', 'disclaimer'];

    return (
        <div style={{ maxWidth: 800, margin: '0 auto', padding: '40px 20px', lineHeight: 1.8 }}>
            <Breadcrumb items={[{ label: t('title') }]} />

            <h1 style={{ fontSize: '1.8rem', marginBottom: 8 }}>{t('title')}</h1>
            <p style={{ color: '#888', marginBottom: 24, fontSize: '0.9rem' }}>{t('lastUpdated')}</p>
            <p style={{ marginBottom: 32 }}>{t('intro')}</p>

            {sectionKeys.map(key => (
                <section key={key} style={{ marginBottom: 28 }}>
                    <h2 style={{ fontSize: '1.2rem', marginBottom: 8 }}>{t(`sections.${key}.title`)}</h2>
                    <p>{t(`sections.${key}.content`)}</p>
                    {listSections.includes(key) && (
                        <ul style={{ paddingLeft: 20, marginTop: 8 }}>
                            {(t.raw(`sections.${key}.items`) as string[]).map((item, i) => (
                                <li key={i} style={{ marginBottom: 4 }}>{item}</li>
                            ))}
                        </ul>
                    )}
                    {key === 'contact' && (
                        <p style={{ marginTop: 8 }}>
                            <a href={`mailto:${t('sections.contact.email')}`} style={{ color: '#0891b2' }}>
                                {t('sections.contact.email')}
                            </a>
                        </p>
                    )}
                </section>
            ))}
        </div>
    );
}
