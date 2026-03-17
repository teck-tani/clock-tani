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
        keywords: isKo
            ? '클락타니, Clock-Tani, 온라인 시계, 타이머, 스톱워치, 알람, 포모도로, D-Day'
            : 'Clock-Tani, online clock, timer, stopwatch, alarm, pomodoro, D-Day',
        alternates: {
            canonical: url,
            languages: { 'x-default': `${baseUrl}/ko/about`, 'ko': `${baseUrl}/ko/about`, 'en': `${baseUrl}/en/about` },
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
    const historyItems = t.raw('history.items') as { date: string; event: string }[];
    const techItems = t.raw('techStack.items') as { name: string; desc: string }[];

    // Organization JSON-LD 스키마
    const organizationJsonLd = {
        '@context': 'https://schema.org',
        '@type': 'Organization',
        name: 'Clock-Tani',
        url: baseUrl,
        logo: `${baseUrl}/icons/icon-512x512.png`,
        description: t('description'),
        foundingDate: '2024-01',
        contactPoint: {
            '@type': 'ContactPoint',
            email: t('contact.email'),
            contactType: 'customer support',
        },
    };

    return (
        <div style={{ maxWidth: 800, margin: '0 auto', padding: '40px 20px', lineHeight: 1.8 }}>
            {/* JSON-LD 구조화 데이터 */}
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationJsonLd) }}
            />

            <h1 style={{ fontSize: '1.8rem', marginBottom: 16 }}>{t('title')}</h1>
            <p style={{ marginBottom: 32, fontSize: '1.05rem' }}>{t('description')}</p>

            {/* 개발자 소개 (E-E-A-T) */}
            <section style={{ marginBottom: 32 }}>
                <h2 style={{ fontSize: '1.3rem', marginBottom: 12 }}>{t('developer.title')}</h2>
                <p style={{ marginBottom: 8 }}>{t('developer.content')}</p>
                <p style={{ color: '#666' }}>{t('developer.background')}</p>
            </section>

            {/* 제공 서비스 */}
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

            {/* 특징 */}
            <section style={{ marginBottom: 32 }}>
                <h2 style={{ fontSize: '1.3rem', marginBottom: 12 }}>{t('values.title')}</h2>
                <ul style={{ paddingLeft: 20 }}>
                    {values.map((item, i) => (
                        <li key={i} style={{ marginBottom: 6 }}>{item}</li>
                    ))}
                </ul>
            </section>

            {/* 서비스 연혁 */}
            <section style={{ marginBottom: 32 }}>
                <h2 style={{ fontSize: '1.3rem', marginBottom: 16 }}>{t('history.title')}</h2>
                <div style={{ borderLeft: '3px solid #0891b2', paddingLeft: 20 }}>
                    {historyItems.map((item, i) => (
                        <div key={i} style={{ marginBottom: 16, position: 'relative' }}>
                            <div style={{
                                position: 'absolute',
                                left: -28,
                                top: 6,
                                width: 12,
                                height: 12,
                                borderRadius: '50%',
                                background: '#0891b2',
                            }} />
                            <strong style={{ color: '#0891b2', fontSize: '0.9rem' }}>{item.date}</strong>
                            <p style={{ margin: '2px 0 0', fontSize: '0.95rem' }}>{item.event}</p>
                        </div>
                    ))}
                </div>
            </section>

            {/* 기술 스택 */}
            <section style={{ marginBottom: 32 }}>
                <h2 style={{ fontSize: '1.3rem', marginBottom: 8 }}>{t('techStack.title')}</h2>
                <p style={{ marginBottom: 16, color: '#666' }}>{t('techStack.description')}</p>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: 12 }}>
                    {techItems.map((item, i) => (
                        <div key={i} style={{ padding: '14px 16px', borderRadius: 8, border: '1px solid #e5e7eb', background: '#f9fafb' }}>
                            <strong>{item.name}</strong>
                            <p style={{ margin: '4px 0 0', fontSize: '0.9rem', color: '#666' }}>{item.desc}</p>
                        </div>
                    ))}
                </div>
            </section>

            {/* 문의 */}
            <section>
                <h2 style={{ fontSize: '1.3rem', marginBottom: 8 }}>{t('contact.title')}</h2>
                <p>{t('contact.content')}</p>
                <p style={{ marginTop: 4, fontSize: '0.9rem', color: '#666' }}>{t('contact.additionalInfo')}</p>
                <p style={{ marginTop: 8 }}>
                    <a href={`mailto:${t('contact.email')}`} style={{ color: '#0891b2', fontWeight: 500 }}>
                        {t('contact.email')}
                    </a>
                </p>
            </section>
        </div>
    );
}
