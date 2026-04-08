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
    const t = await getTranslations({ locale, namespace: 'FAQ.meta' });
    const isKo = locale === 'ko';
    const url = `${baseUrl}/${locale}/faq`;

    return {
        title: t('title'),
        description: t('description'),
        keywords: isKo
            ? 'FAQ, 자주 묻는 질문, Clock-Tani, 온라인 시계, 타이머, 스톱워치, 사용법'
            : 'FAQ, frequently asked questions, Clock-Tani, online clock, timer, stopwatch, how to use',
        alternates: {
            canonical: url,
            languages: { 'x-default': `${baseUrl}/ko/faq`, 'ko': `${baseUrl}/ko/faq`, 'en': `${baseUrl}/en/faq` },
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

// FAQ 섹션별 아이템 타입
type FaqItem = { q: string; a: string };
type ToolFaqSection = { title: string; items: FaqItem[] };

// 도구별 FAQ 키 목록
const toolKeys = ['clock', 'stopwatch', 'timer', 'pomodoro', 'alarm', 'serverTime', 'ddayCounter'] as const;

export default async function FaqPage(props: { params: Promise<{ locale: string }> }) {
    const { locale } = await props.params;
    setRequestLocale(locale);
    const t = await getTranslations({ locale, namespace: 'FAQ' });

    // 각 섹션 데이터 가져오기
    const generalItems = t.raw('general.items') as FaqItem[];
    const technicalItems = t.raw('technical.items') as FaqItem[];
    const privacyItems = t.raw('privacy.items') as FaqItem[];

    // 도구별 FAQ 데이터
    const toolSections: ToolFaqSection[] = toolKeys.map((key) => ({
        title: t(`tools.${key}.title`),
        items: t.raw(`tools.${key}.items`) as FaqItem[],
    }));

    // 모든 FAQ 아이템을 모아서 FAQPage JSON-LD 생성
    const allFaqItems = [
        ...generalItems,
        ...toolSections.flatMap((s) => s.items),
        ...technicalItems,
        ...privacyItems,
    ];

    const faqJsonLd = {
        '@context': 'https://schema.org',
        '@type': 'FAQPage',
        mainEntity: allFaqItems.map((item) => ({
            '@type': 'Question',
            name: item.q,
            acceptedAnswer: {
                '@type': 'Answer',
                text: item.a,
            },
        })),
    };

    return (
        <div style={{ maxWidth: 800, margin: '0 auto', padding: '40px 20px', lineHeight: 1.8 }}>
            {/* FAQPage JSON-LD 구조화 데이터 */}
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
            />

            <h1 style={{ fontSize: '1.8rem', marginBottom: 8 }}>{t('title')}</h1>
            <p style={{ marginBottom: 32, fontSize: '1.05rem', color: '#64748b' }}>{t('subtitle')}</p>

            {/* 일반 질문 */}
            <section style={{ marginBottom: 32 }}>
                <h2 style={{ fontSize: '1.3rem', marginBottom: 16 }}>{t('general.title')}</h2>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                    {generalItems.map((item, i) => (
                        <details key={i} style={{ border: '1px solid #e5e7eb', borderRadius: 8, overflow: 'hidden' }}>
                            <summary style={{
                                padding: '14px 16px',
                                cursor: 'pointer',
                                fontWeight: 600,
                                fontSize: '0.95rem',
                                background: '#f9fafb',
                                listStyle: 'none',
                            }}>
                                {item.q}
                            </summary>
                            <p style={{ padding: '12px 16px', margin: 0, fontSize: '0.9rem', color: '#555', borderTop: '1px solid #e5e7eb' }}>
                                {item.a}
                            </p>
                        </details>
                    ))}
                </div>
            </section>

            {/* 도구별 질문 */}
            <section style={{ marginBottom: 32 }}>
                <h2 style={{ fontSize: '1.3rem', marginBottom: 16 }}>{t('tools.title')}</h2>
                {toolSections.map((section, si) => (
                    <div key={si} style={{ marginBottom: 24 }}>
                        <h3 style={{ fontSize: '1.1rem', marginBottom: 10, color: '#0891b2' }}>{section.title}</h3>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                            {section.items.map((item, i) => (
                                <details key={i} style={{ border: '1px solid #e5e7eb', borderRadius: 8, overflow: 'hidden' }}>
                                    <summary style={{
                                        padding: '14px 16px',
                                        cursor: 'pointer',
                                        fontWeight: 600,
                                        fontSize: '0.95rem',
                                        background: '#f9fafb',
                                        listStyle: 'none',
                                    }}>
                                        {item.q}
                                    </summary>
                                    <p style={{ padding: '12px 16px', margin: 0, fontSize: '0.9rem', color: '#555', borderTop: '1px solid #e5e7eb' }}>
                                        {item.a}
                                    </p>
                                </details>
                            ))}
                        </div>
                    </div>
                ))}
            </section>

            {/* 기술 관련 질문 */}
            <section style={{ marginBottom: 32 }}>
                <h2 style={{ fontSize: '1.3rem', marginBottom: 16 }}>{t('technical.title')}</h2>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                    {technicalItems.map((item, i) => (
                        <details key={i} style={{ border: '1px solid #e5e7eb', borderRadius: 8, overflow: 'hidden' }}>
                            <summary style={{
                                padding: '14px 16px',
                                cursor: 'pointer',
                                fontWeight: 600,
                                fontSize: '0.95rem',
                                background: '#f9fafb',
                                listStyle: 'none',
                            }}>
                                {item.q}
                            </summary>
                            <p style={{ padding: '12px 16px', margin: 0, fontSize: '0.9rem', color: '#555', borderTop: '1px solid #e5e7eb' }}>
                                {item.a}
                            </p>
                        </details>
                    ))}
                </div>
            </section>

            {/* 개인정보 & 데이터 */}
            <section style={{ marginBottom: 32 }}>
                <h2 style={{ fontSize: '1.3rem', marginBottom: 16 }}>{t('privacy.title')}</h2>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                    {privacyItems.map((item, i) => (
                        <details key={i} style={{ border: '1px solid #e5e7eb', borderRadius: 8, overflow: 'hidden' }}>
                            <summary style={{
                                padding: '14px 16px',
                                cursor: 'pointer',
                                fontWeight: 600,
                                fontSize: '0.95rem',
                                background: '#f9fafb',
                                listStyle: 'none',
                            }}>
                                {item.q}
                            </summary>
                            <p style={{ padding: '12px 16px', margin: 0, fontSize: '0.9rem', color: '#555', borderTop: '1px solid #e5e7eb' }}>
                                {item.a}
                            </p>
                        </details>
                    ))}
                </div>
            </section>
        </div>
    );
}
