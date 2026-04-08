import { Metadata } from "next";
import { getTranslations, setRequestLocale } from 'next-intl/server';
import { locales } from '@/navigation';
import Link from 'next/link';
import { ALL_GUIDES, findGuideBySlug, getRelatedGuides } from '@/config/guides';
import { ALL_TOOLS } from '@/config/tools';
import { notFound } from 'next/navigation';
import Breadcrumb from "@/components/Breadcrumb";

// 모든 locale × slug 조합 생성
export function generateStaticParams() {
    const params: { locale: string; slug: string }[] = [];
    for (const locale of locales) {
        for (const guide of ALL_GUIDES) {
            params.push({ locale, slug: guide.slug });
        }
    }
    return params;
}

export const dynamic = 'force-static';
export const revalidate = false;

const baseUrl = 'https://clock-tani.com';

export async function generateMetadata(props: { params: Promise<{ locale: string; slug: string }> }): Promise<Metadata> {
    const { locale, slug } = await props.params;
    const guide = findGuideBySlug(slug);
    if (!guide) return {};

    const t = await getTranslations({ locale, namespace: 'Guides' });
    const isKo = locale === 'ko';
    const url = `${baseUrl}/${locale}/guides/${slug}`;

    const title = t(`titles.${guide.titleKey}`);
    const metaTitle = `${title} | Clock-Tani`;
    const description = t(`descriptions.${guide.descKey}`);

    return {
        title: metaTitle,
        description,
        alternates: {
            canonical: url,
            languages: {
                'x-default': `${baseUrl}/ko/guides/${slug}`,
                'ko': `${baseUrl}/ko/guides/${slug}`,
                'en': `${baseUrl}/en/guides/${slug}`,
            },
        },
        openGraph: {
            title: metaTitle,
            description,
            url,
            siteName: 'Clock-Tani',
            type: 'article',
            locale: isKo ? 'ko_KR' : 'en_US',
            alternateLocale: isKo ? 'en_US' : 'ko_KR',
            publishedTime: guide.date,
            modifiedTime: guide.lastModified,
        },
        twitter: {
            card: 'summary',
            title: metaTitle,
            description,
            site: '@teck_tani',
            creator: '@teck_tani',
        },
        robots: { index: true, follow: true },
    };
}

// Article JSON-LD 스키마 생성
function generateArticleSchema(guide: NonNullable<ReturnType<typeof findGuideBySlug>>, locale: string, title: string, description: string) {
    return {
        "@context": "https://schema.org",
        "@type": "Article",
        "headline": title,
        "description": description,
        "datePublished": guide.date,
        "dateModified": guide.lastModified,
        "author": {
            "@type": "Organization",
            "name": "Clock-Tani",
            "url": baseUrl,
        },
        "publisher": {
            "@type": "Organization",
            "name": "Clock-Tani",
            "url": baseUrl,
        },
        "mainEntityOfPage": {
            "@type": "WebPage",
            "@id": `${baseUrl}/${locale}/guides/${guide.slug}`,
        },
        "inLanguage": locale === 'ko' ? 'ko-KR' : 'en-US',
    };
}

export default async function GuideArticlePage(props: { params: Promise<{ locale: string; slug: string }> }) {
    const { locale, slug } = await props.params;
    setRequestLocale(locale);

    const guide = findGuideBySlug(slug);
    if (!guide) notFound();

    const t = await getTranslations({ locale, namespace: 'Guides' });
    const toolT = await getTranslations({ locale, namespace: 'Index.tools' });
    const tBreadcrumb = await getTranslations({ locale, namespace: 'Breadcrumb' });

    const title = t(`titles.${guide.titleKey}`);
    const description = t(`descriptions.${guide.descKey}`);

    // 기사 데이터 가져오기
    const articleData = t.raw(`articles.${slug}`) as {
        title: string;
        intro: string;
        sections: { title: string; content: string }[];
        conclusion: string;
    };

    // 관련 가이드
    const relatedGuides = getRelatedGuides(slug);

    // 관련 도구 정보
    const tool = ALL_TOOLS.find(tool => tool.href === guide.relatedTool);
    const toolLabel = tool ? toolT(tool.labelKey) : '';

    const articleSchema = generateArticleSchema(guide, locale, title, description);

    return (
        <>
            <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }} />
            <article style={{ maxWidth: 800, margin: '0 auto', padding: '40px 20px', lineHeight: 1.9 }}>
                <Breadcrumb items={[{ label: tBreadcrumb('guides'), href: '/guides' }, { label: articleData.title }]} />

                {/* 목록으로 돌아가기 */}
                <Link
                    href={`/${locale}/guides`}
                    style={{ color: '#0891b2', fontSize: '0.9rem', textDecoration: 'none', marginBottom: 24, display: 'inline-block' }}
                >
                    &larr; {t('backToList')}
                </Link>

                {/* 제목 및 메타 정보 */}
                <h1 style={{ fontSize: '1.8rem', marginBottom: 12, lineHeight: 1.4 }}>{articleData.title}</h1>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 16, marginBottom: 24, fontSize: '0.85rem', color: '#999' }}>
                    <span>{t('publishedAt')}: {guide.date}</span>
                    <span>{t('lastModified')}: {guide.lastModified}</span>
                    {toolLabel && (
                        <Link
                            href={`/${locale}${guide.relatedTool}`}
                            style={{
                                padding: '2px 10px',
                                borderRadius: 20,
                                background: 'var(--badge-bg, #e0f2fe)',
                                color: 'var(--badge-text, #0891b2)',
                                fontSize: '0.78rem',
                                fontWeight: 500,
                                textDecoration: 'none',
                            }}
                        >
                            {t('relatedTool')}: {toolLabel}
                        </Link>
                    )}
                </div>

                {/* 도입부 */}
                <p style={{ fontSize: '1.05rem', marginBottom: 32, color: 'var(--text-secondary, #444)' }}>
                    {articleData.intro}
                </p>

                {/* 본문 섹션들 */}
                {articleData.sections.map((section, i) => (
                    <section key={i} style={{ marginBottom: 28 }}>
                        <h2 style={{ fontSize: '1.25rem', marginBottom: 10, color: 'var(--text-primary, #111)' }}>
                            {section.title}
                        </h2>
                        <div
                            style={{ fontSize: '0.98rem', color: 'var(--text-secondary, #333)' }}
                            dangerouslySetInnerHTML={{ __html: section.content.replace(/\n/g, '<br/>') }}
                        />
                    </section>
                ))}

                {/* 결론 */}
                <section style={{ marginBottom: 32, padding: '20px 24px', borderRadius: 12, background: 'var(--card-bg, #f0f9ff)', border: '1px solid var(--card-border, #e0f2fe)' }}>
                    <h2 style={{ fontSize: '1.15rem', marginBottom: 8 }}>{locale === 'ko' ? '마무리' : 'Conclusion'}</h2>
                    <p style={{ fontSize: '0.98rem', color: 'var(--text-secondary, #444)' }}>{articleData.conclusion}</p>
                </section>

                {/* 관련 가이드 */}
                {relatedGuides.length > 0 && (
                    <section style={{ marginBottom: 32 }}>
                        <h2 style={{ fontSize: '1.15rem', marginBottom: 12 }}>{locale === 'ko' ? '함께 읽으면 좋은 가이드' : 'Recommended Guides'}</h2>
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: 12 }}>
                            {relatedGuides.map((g) => (
                                <Link key={g.slug} href={`/${locale}/guides/${g.slug}`} style={{ display: 'block', padding: '12px 14px', borderRadius: 8, border: '1px solid var(--card-border, #e5e7eb)', background: 'var(--card-bg, #f9fafb)', textDecoration: 'none', color: 'inherit' }}>
                                    <strong style={{ fontSize: '0.88rem', color: 'var(--text-primary, #222)' }}>{t(`titles.${g.titleKey}`)}</strong>
                                </Link>
                            ))}
                        </div>
                    </section>
                )}

                {/* 관련 도구 CTA */}
                {tool && (
                    <div style={{ textAlign: 'center', padding: '24px 0' }}>
                        <Link
                            href={`/${locale}${guide.relatedTool}`}
                            style={{
                                display: 'inline-block',
                                padding: '12px 32px',
                                borderRadius: 8,
                                background: '#0891b2',
                                color: '#fff',
                                textDecoration: 'none',
                                fontWeight: 600,
                                fontSize: '1rem',
                            }}
                        >
                            {toolLabel} {locale === 'ko' ? '바로 사용하기' : 'Try it now'} &rarr;
                        </Link>
                    </div>
                )}
            </article>
        </>
    );
}
