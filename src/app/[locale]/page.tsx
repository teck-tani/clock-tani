import { Metadata } from 'next';
import { setRequestLocale } from 'next-intl/server';
import { getTranslations } from 'next-intl/server';
import { locales } from '@/navigation';
import { Link } from '@/navigation';
import { ALL_TOOLS } from '@/config/tools';

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export const dynamic = 'force-static';
export const revalidate = false;

const baseUrl = 'https://clock-tani.com';

// 홈페이지 메타데이터
export async function generateMetadata(props: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await props.params;
  const t = await getTranslations({ locale, namespace: 'Meta' });
  const isKo = locale === 'ko';
  const url = `${baseUrl}/${locale}`;

  return {
    title: t('defaultTitle'),
    description: t('defaultDescription'),
    keywords: t('keywords'),
    alternates: {
      canonical: url,
      languages: { 'ko': `${baseUrl}/ko`, 'en': `${baseUrl}/en` },
    },
    openGraph: {
      title: t('ogTitle'),
      description: t('ogDescription'),
      url,
      siteName: 'Clock-Tani',
      type: 'website',
      locale: isKo ? 'ko_KR' : 'en_US',
      alternateLocale: isKo ? 'en_US' : 'ko_KR',
    },
    twitter: {
      card: 'summary_large_image',
      title: t('ogTitle'),
      description: t('ogDescription'),
      site: '@teck_tani',
      creator: '@teck_tani',
    },
    robots: { index: true, follow: true },
  };
}

const featureKeys = ['pwa', 'darkMode', 'responsive', 'multilang', 'free', 'fast'] as const;
const featureIcons: Record<string, string> = {
  pwa: '\u{1F4F1}',
  darkMode: '\u{1F319}',
  responsive: '\u{1F4BB}',
  multilang: '\u{1F310}',
  free: '\u2728',
  fast: '\u26A1',
};

export default async function HomePage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations({ locale, namespace: 'Homepage' });
  const tTools = await getTranslations({ locale, namespace: 'Index.tools' });

  // 도구 비교 가이드 데이터
  const comparisonItems = t.raw('comparison.items') as { tool: string; bestFor: string; desc: string }[];

  // FAQ 데이터
  const faqItems = t.raw('faq.items') as { q: string; a: string }[];

  // Organization JSON-LD 스키마
  const organizationJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: 'Clock-Tani',
    url: baseUrl,
    logo: `${baseUrl}/icons/icon-512x512.png`,
    description: t('description'),
    contactPoint: {
      '@type': 'ContactPoint',
      email: 'admin@teck-tani.com',
      contactType: 'customer support',
    },
    sameAs: [],
  };

  // WebSite JSON-LD 스키마
  const websiteJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: 'Clock-Tani',
    url: baseUrl,
    description: t('description'),
    inLanguage: locale === 'ko' ? 'ko-KR' : 'en-US',
  };

  // FAQ JSON-LD 스키마
  const faqJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqItems.map((item) => ({
      '@type': 'Question',
      name: item.q,
      acceptedAnswer: {
        '@type': 'Answer',
        text: item.a,
      },
    })),
  };

  return (
    <div className="homepage">
      {/* JSON-LD 구조화 데이터 */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
      />

      {/* 히어로 섹션 */}
      <div className="homepage-hero">
        <h1 className="homepage-title">{t('title')}</h1>
        <p className="homepage-desc">{t('description')}</p>
      </div>

      {/* 도구 그리드 */}
      <div className="homepage-tools-grid">
        {ALL_TOOLS.map((tool) => {
          const Icon = tool.icon;
          return (
            <Link key={tool.href} href={tool.href} className="homepage-tool-card" prefetch={false}>
              <span className="homepage-tool-icon"><Icon /></span>
              <span className="homepage-tool-name">{tTools(tool.labelKey)}</span>
              <span className="homepage-tool-desc">{t(`toolDescriptions.${tool.labelKey}`)}</span>
            </Link>
          );
        })}
      </div>

      {/* 주요 특징 */}
      <div className="homepage-features">
        <h2 className="homepage-features-title">{t('featuresTitle')}</h2>
        <div className="homepage-features-grid">
          {featureKeys.map((key) => (
            <div key={key} className="homepage-feature-item">
              <div className="homepage-feature-icon">{featureIcons[key]}</div>
              <div className="homepage-feature-name">{t(`features.${key}.name`)}</div>
              <div className="homepage-feature-desc">{t(`features.${key}.desc`)}</div>
            </div>
          ))}
        </div>
      </div>

      {/* 소개 섹션 */}
      <section className="homepage-content-section homepage-intro">
        <h2 className="homepage-section-title">{t('intro.title')}</h2>
        <div className="homepage-intro-text">
          <p>{t('intro.p1')}</p>
          <p>{t('intro.p2')}</p>
          <p>{t('intro.p3')}</p>
        </div>
      </section>

      {/* 도구 비교 가이드 */}
      <section className="homepage-content-section homepage-comparison">
        <h2 className="homepage-section-title">{t('comparison.title')}</h2>
        <p className="homepage-section-subtitle">{t('comparison.subtitle')}</p>
        <div className="homepage-comparison-grid">
          {comparisonItems.map((item, i) => (
            <div key={i} className="homepage-comparison-card">
              <div className="homepage-comparison-header">
                <span className="homepage-comparison-tool">{item.tool}</span>
                <span className="homepage-comparison-badge">{item.bestFor}</span>
              </div>
              <p className="homepage-comparison-desc">{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* FAQ 섹션 */}
      <section className="homepage-content-section homepage-faq">
        <h2 className="homepage-section-title">{t('faq.title')}</h2>
        <div className="homepage-faq-list">
          {faqItems.map((item, i) => (
            <details key={i} className="homepage-faq-item">
              <summary className="homepage-faq-question">{item.q}</summary>
              <p className="homepage-faq-answer">{item.a}</p>
            </details>
          ))}
        </div>
      </section>
    </div>
  );
}
