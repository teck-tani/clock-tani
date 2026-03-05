import { NextIntlClientProvider } from 'next-intl';
import { getMessages, getTranslations, setRequestLocale } from 'next-intl/server';
import { Metadata } from 'next';
import { locales } from '@/navigation';
import "../globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import GoogleAdsense from "@/components/GoogleAdsense";
import LazyFeedbackButton from "@/components/LazyFeedbackButton";
import LazyGTM from "@/components/LazyGTM";
import { ThemeProvider } from "@/contexts/ThemeContext";
import PWARegister from "@/components/PWARegister";

const systemFontStack = '-apple-system, BlinkMacSystemFont, "Apple SD Gothic Neo", "Pretendard", "Roboto", "Noto Sans KR", sans-serif';

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations({ locale, namespace: 'Meta' });
  const baseUrl = 'https://clock-tani.com';
  return {
    metadataBase: new URL(baseUrl),
    title: t('defaultTitle'),
    description: t('defaultDescription'),
    alternates: {
      canonical: `${baseUrl}/${locale}`,
      languages: {
        'ko': `${baseUrl}/ko`,
        'en': `${baseUrl}/en`,
        'x-default': `${baseUrl}/ko`,
      },
    },
  };
}

function generateWebSiteSchema(locale: string) {
  const baseUrl = 'https://clock-tani.com';
  const isKo = locale === 'ko';

  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "name": isKo ? "Clock-Tani 온라인 시계 & 웹도구" : "Clock-Tani Online Clock & Web Tools",
    "url": `${baseUrl}/${locale}`,
    "description": isKo
      ? "정확한 온라인 시계, 세계시계, 스톱워치, 타이머, 포모도로, 알람, D-Day 카운트다운을 무료로 제공합니다."
      : "Free online clock, world clock, stopwatch, timer, pomodoro, alarm, and D-Day countdown tools.",
    "inLanguage": isKo ? "ko-KR" : "en-US",
    "publisher": {
      "@type": "Organization",
      "name": "Clock-Tani",
      "url": baseUrl,
    },
  };
}

export default async function LocaleLayout({ children, params }: { children: React.ReactNode; params: Promise<{ locale: string }>; }) {
  const { locale } = await params;
  setRequestLocale(locale);
  const allMessages = await getMessages({ locale });

  const webSiteSchema = generateWebSiteSchema(locale);

  return (
    <html lang={locale}>
      <head>
        <link rel="icon" href="/favicon.ico" />
        <link rel="manifest" href="/manifest.json" />
        <meta name="theme-color" content="#0891b2" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
        <meta name="apple-mobile-web-app-title" content="Clock Tani" />
        <link rel="apple-touch-icon" href="/icon-192x192.svg" />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(webSiteSchema) }} />
      </head>
      <body style={{ fontFamily: systemFontStack }}>
        <NextIntlClientProvider messages={allMessages}>
          <ThemeProvider>
              <div id="top-container"><Header /></div>
              <main>{children}</main>
              <div id="footer-container"><Footer /></div>
              <LazyFeedbackButton />
          </ThemeProvider>
        </NextIntlClientProvider>
        <LazyGTM />
        <GoogleAdsense />
        <PWARegister />
      </body>
    </html>
  );
}
