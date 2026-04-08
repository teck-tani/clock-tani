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
    const t = await getTranslations({ locale, namespace: 'Contact.meta' });
    const isKo = locale === 'ko';
    const url = `${baseUrl}/${locale}/contact`;

    return {
        title: t('title'),
        description: t('description'),
        keywords: isKo
            ? '문의, 연락처, Clock-Tani, 클락타니 문의'
            : 'contact, inquiry, Clock-Tani, get in touch',
        alternates: {
            canonical: url,
            languages: { 'x-default': `${baseUrl}/ko/contact`, 'ko': `${baseUrl}/ko/contact`, 'en': `${baseUrl}/en/contact` },
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

export default async function ContactPage(props: { params: Promise<{ locale: string }> }) {
    const { locale } = await props.params;
    setRequestLocale(locale);
    const t = await getTranslations({ locale, namespace: 'Contact' });

    const contactJsonLd = {
        '@context': 'https://schema.org',
        '@type': 'ContactPage',
        name: t('meta.title'),
        url: `${baseUrl}/${locale}/contact`,
        mainEntity: {
            '@type': 'Organization',
            name: 'Clock-Tani',
            url: baseUrl,
            email: 'admin@teck-tani.com',
            contactPoint: {
                '@type': 'ContactPoint',
                email: 'admin@teck-tani.com',
                contactType: 'customer support',
                availableLanguage: ['Korean', 'English'],
            },
        },
    };

    return (
        <div style={{ maxWidth: 800, margin: '0 auto', padding: '40px 20px', lineHeight: 1.8 }}>
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(contactJsonLd) }}
            />

            <h1 style={{ fontSize: '1.8rem', marginBottom: 16 }}>{t('title')}</h1>
            <p style={{ marginBottom: 32, fontSize: '1.05rem', color: 'var(--text-secondary, #555)' }}>
                {t('description')}
            </p>

            {/* 이메일 문의 */}
            <section style={{ marginBottom: 32 }}>
                <h2 style={{ fontSize: '1.3rem', marginBottom: 12 }}>{t('email.title')}</h2>
                <p style={{ marginBottom: 8 }}>{t('email.content')}</p>
                <a
                    href="mailto:admin@teck-tani.com"
                    style={{
                        display: 'inline-block',
                        padding: '12px 28px',
                        borderRadius: 8,
                        background: '#0891b2',
                        color: '#fff',
                        textDecoration: 'none',
                        fontWeight: 600,
                        fontSize: '1rem',
                    }}
                >
                    admin@teck-tani.com
                </a>
                <p style={{ marginTop: 8, fontSize: '0.88rem', color: '#888' }}>{t('email.responseTime')}</p>
            </section>

            {/* 문의 유형 안내 */}
            <section style={{ marginBottom: 32 }}>
                <h2 style={{ fontSize: '1.3rem', marginBottom: 16 }}>{t('inquiryTypes.title')}</h2>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: 12 }}>
                    {(t.raw('inquiryTypes.items') as { name: string; desc: string }[]).map((item, i) => (
                        <div key={i} style={{ padding: '14px 16px', borderRadius: 8, border: '1px solid var(--card-border, #e5e7eb)', background: 'var(--card-bg, #f9fafb)' }}>
                            <strong>{item.name}</strong>
                            <p style={{ margin: '4px 0 0', fontSize: '0.9rem', color: 'var(--text-secondary, #666)' }}>{item.desc}</p>
                        </div>
                    ))}
                </div>
            </section>

            {/* 운영 정보 */}
            <section style={{ marginBottom: 32 }}>
                <h2 style={{ fontSize: '1.3rem', marginBottom: 12 }}>{t('info.title')}</h2>
                <div style={{ padding: '16px 20px', borderRadius: 8, border: '1px solid var(--card-border, #e5e7eb)', background: 'var(--card-bg, #f9fafb)' }}>
                    {(t.raw('info.items') as { label: string; value: string }[]).map((item, i) => (
                        <div key={i} style={{ display: 'flex', gap: 12, marginBottom: i < 3 ? 8 : 0 }}>
                            <span style={{ fontWeight: 600, minWidth: 100 }}>{item.label}</span>
                            <span style={{ color: 'var(--text-secondary, #555)' }}>{item.value}</span>
                        </div>
                    ))}
                </div>
            </section>

            {/* 참고 링크 */}
            <section>
                <h2 style={{ fontSize: '1.3rem', marginBottom: 12 }}>{t('links.title')}</h2>
                <p style={{ color: 'var(--text-secondary, #555)' }}>{t('links.content')}</p>
                <div style={{ marginTop: 12, display: 'flex', gap: 16, flexWrap: 'wrap' }}>
                    <a href={`/${locale}/faq`} style={{ color: '#0891b2', textDecoration: 'none', fontWeight: 500 }}>{t('links.faq')}</a>
                    <a href={`/${locale}/guides`} style={{ color: '#0891b2', textDecoration: 'none', fontWeight: 500 }}>{t('links.guides')}</a>
                    <a href={`/${locale}/privacy`} style={{ color: '#0891b2', textDecoration: 'none', fontWeight: 500 }}>{t('links.privacy')}</a>
                    <a href={`/${locale}/terms`} style={{ color: '#0891b2', textDecoration: 'none', fontWeight: 500 }}>{t('links.terms')}</a>
                </div>
            </section>
        </div>
    );
}
