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

  return (
    <div className="homepage">
      <div className="homepage-hero">
        <h1 className="homepage-title">{t('title')}</h1>
        <p className="homepage-desc">{t('description')}</p>
      </div>

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
    </div>
  );
}
