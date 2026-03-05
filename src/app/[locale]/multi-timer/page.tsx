import TimerView from "../timer/TimerView";
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
    const t = await getTranslations({ locale, namespace: 'Clock.MultiTimer.meta' });

    const isKo = locale === 'ko';
    const url = `${baseUrl}/${locale}/multi-timer`;

    return {
        title: t('title'),
        description: t('description'),
        keywords: t('keywords'),
        alternates: {
            canonical: url,
            languages: {
                'ko': `${baseUrl}/ko/multi-timer`,
                'en': `${baseUrl}/en/multi-timer`,
                'x-default': `${baseUrl}/ko/multi-timer`,
            },
        },
        openGraph: {
            title: t('ogTitle'),
            description: t('ogDescription'),
            url,
            siteName: 'Teck-Tani 웹도구',
            type: 'website',
            locale: isKo ? 'ko_KR' : 'en_US',
            alternateLocale: isKo ? 'en_US' : 'ko_KR',
        },
        twitter: {
            card: 'summary_large_image',
            title: t('ogTitle'),
            description: t('ogDescription'),
        },
        robots: {
            index: true,
            follow: true,
            googleBot: {
                index: true,
                follow: true,
                'max-video-preview': -1,
                'max-image-preview': 'large' as const,
                'max-snippet': -1,
            },
        },
    };
}

// ===== JSON-LD Schemas =====
function generateFaqSchema(locale: string) {
    const faqData =
        locale === 'ko'
            ? [
                  { question: "멀티 타이머는 최대 몇 개까지 동시에 실행할 수 있나요?", answer: "최대 4개의 독립적인 타이머를 동시에 실행할 수 있습니다. 각 타이머는 개별적으로 시간 설정, 시작, 정지, 리셋이 가능합니다." },
                  { question: "각 타이머에 다른 알람음을 설정할 수 있나요?", answer: "타이머 완료 시 알람이 울려 어떤 타이머가 끝났는지 바로 알 수 있습니다. 5종 알람음 중에서 선택할 수 있습니다." },
                  { question: "타이머 설정이 저장되나요?", answer: "네, 모든 타이머 설정은 브라우저의 localStorage에 자동 저장됩니다. 같은 기기와 브라우저에서 다시 방문하면 이전 설정이 유지됩니다." },
                  { question: "모바일에서도 사용할 수 있나요?", answer: "네, 스마트폰과 태블릿의 모바일 브라우저에서도 완벽하게 작동합니다. 반응형 디자인으로 화면 크기에 맞게 최적화되어 있습니다." },
                  { question: "이 서비스는 무료인가요?", answer: "네, 멀티 타이머는 완전히 무료이며 회원가입이나 설치가 필요하지 않습니다. 브라우저에서 바로 사용할 수 있습니다." },
              ]
            : [
                  { question: "How many timers can I run simultaneously?", answer: "You can run up to 4 independent timers simultaneously. Each timer can be set, started, stopped, and reset individually." },
                  { question: "Can I set different alarm sounds for each timer?", answer: "An alarm sounds when each timer completes so you know which timer finished. You can choose from 5 alarm sounds." },
                  { question: "Are timer settings saved?", answer: "Yes, all timer settings are automatically saved in your browser's localStorage and persist between visits on the same device." },
                  { question: "Does it work on mobile devices?", answer: "Yes, it works perfectly on smartphones and tablets with responsive design that adapts to any screen size." },
                  { question: "Is this service free?", answer: "Yes, the Multi Timer is completely free with no registration or installation required. Use it directly in your browser." },
              ];

    return {
        "@context": "https://schema.org",
        "@type": "FAQPage",
        mainEntity: faqData.map((item) => ({
            "@type": "Question",
            name: item.question,
            acceptedAnswer: { "@type": "Answer", text: item.answer },
        })),
    };
}

function generateHowToSchema(locale: string) {
    const isKo = locale === 'ko';

    return {
        "@context": "https://schema.org",
        "@type": "HowTo",
        name: isKo ? "멀티 타이머 사용 방법" : "How to Use Multi Timer",
        description: isKo
            ? "여러 개의 타이머를 동시에 실행하여 다양한 작업을 관리하는 방법을 안내합니다."
            : "Learn how to run multiple timers simultaneously to manage various tasks.",
        step: isKo
            ? [
                  { "@type": "HowToStep", name: "타이머 추가", text: "'+' 버튼을 눌러 새 타이머를 추가합니다. 최대 4개까지 추가할 수 있습니다." },
                  { "@type": "HowToStep", name: "시간 설정", text: "각 타이머의 시간(시/분/초)을 개별적으로 설정합니다. 프리셋 버튼으로 빠르게 설정할 수도 있습니다." },
                  { "@type": "HowToStep", name: "개별 또는 동시 시작", text: "각 타이머를 개별적으로 시작하거나, 필요에 따라 순차적으로 시작합니다." },
                  { "@type": "HowToStep", name: "알람 확인", text: "각 타이머가 끝나면 개별적으로 알람이 울립니다. 완료된 타이머를 확인하고 리셋하세요." },
              ]
            : [
                  { "@type": "HowToStep", name: "Add Timer", text: "Press the '+' button to add a new timer. You can add up to 4 timers." },
                  { "@type": "HowToStep", name: "Set Time", text: "Set the time (hours/minutes/seconds) for each timer individually. Quick preset buttons are also available." },
                  { "@type": "HowToStep", name: "Start Individually or Together", text: "Start each timer individually or sequentially as needed." },
                  { "@type": "HowToStep", name: "Check Alarms", text: "Each timer rings its alarm independently when complete. Check and reset finished timers." },
              ],
    };
}

function generateWebAppSchema(locale: string) {
    const isKo = locale === 'ko';

    return {
        "@context": "https://schema.org",
        "@type": "WebApplication",
        name: isKo ? "멀티 타이머" : "Multi Timer",
        description: isKo
            ? "최대 4개의 타이머를 동시에 실행할 수 있는 무료 온라인 멀티 타이머"
            : "Free online multi timer to run up to 4 timers simultaneously",
        url: `${baseUrl}/${locale}/multi-timer`,
        applicationCategory: "UtilitiesApplication",
        operatingSystem: "Any",
        offers: { "@type": "Offer", price: "0", priceCurrency: "KRW" },
        featureList: isKo
            ? ["최대 4개 독립 타이머 동시 실행", "각 타이머 개별 제어", "5종 알람음", "프리셋 버튼으로 빠른 설정", "자동 저장 (localStorage)", "반응형 디자인", "화면 꺼짐 방지"]
            : ["Up to 4 independent timers simultaneously", "Individual timer controls", "5 alarm sounds", "Quick preset buttons", "Auto save (localStorage)", "Responsive design", "Screen wake lock"],
        browserRequirements: "Requires JavaScript. Requires HTML5.",
        softwareVersion: "1.0",
    };
}

// ===== Page Component =====
const featureKeys = ["multiRun", "individual", "alarmSound", "presets", "autoSave"] as const;
const howtoStepKeys = ["step1", "step2", "step3", "step4"] as const;
const usecaseKeys = ["cooking", "laundry", "study", "work"] as const;
const faqKeys = ["maxTimers", "alarmSound", "save", "mobile", "free"] as const;

import RelatedTools from "@/components/RelatedTools";

export default async function MultiTimerPage(props: { params: Promise<{ locale: string }> }) {
    const { locale } = await props.params;
    setRequestLocale(locale);
    const t = await getTranslations({ locale, namespace: 'Clock.MultiTimer' });

    const faqSchema = generateFaqSchema(locale);
    const howToSchema = generateHowToSchema(locale);
    const webAppSchema = generateWebAppSchema(locale);

    return (
        <>
            <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />
            <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(howToSchema) }} />
            <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(webAppSchema) }} />

            <TimerView fixedMode="multi" />

            {/* SEO Content */}
            <article className="seo-article">
                <section className="seo-section">
                    <h2 className="seo-section-title">{t("seo.description.title")}</h2>
                    <p className="seo-text">{t("seo.description.p1")}</p>
                    <p className="seo-text">{t("seo.description.p2")}</p>
                </section>

                <section className="seo-section">
                    <h2 className="seo-section-title">{t("seo.features.title")}</h2>
                    <div className="seo-card-grid">
                        {featureKeys.map((key) => (
                            <div key={key} className="seo-card">
                                <h3 className="seo-card-title">{t(`seo.features.list.${key}.title`)}</h3>
                                <p className="seo-card-desc">{t(`seo.features.list.${key}.desc`)}</p>
                            </div>
                        ))}
                    </div>
                </section>

                <section className="seo-section">
                    <h2 className="seo-section-title">{t("seo.howto.title")}</h2>
                    <ol className="seo-howto-list">
                        {howtoStepKeys.map((key) => (
                            <li key={key} dangerouslySetInnerHTML={{ __html: t.raw(`seo.howto.steps.${key}`) }} />
                        ))}
                    </ol>
                </section>

                <section className="seo-section">
                    <h2 className="seo-section-title">{t("seo.usecases.title")}</h2>
                    <div className="seo-card-grid">
                        {usecaseKeys.map((key) => (
                            <div key={key} className="seo-card">
                                <h3 className="seo-card-title">{t(`seo.usecases.list.${key}.title`)}</h3>
                                <p className="seo-card-desc">{t(`seo.usecases.list.${key}.desc`)}</p>
                            </div>
                        ))}
                    </div>
                </section>

                <section className="seo-section">
                    <h2 className="seo-section-title">{t("seo.faq.title")}</h2>
                    {faqKeys.map((key) => (
                        <details key={key} className="seo-faq-item">
                            <summary>{t(`seo.faq.list.${key}.q`)}</summary>
                            <p>{t(`seo.faq.list.${key}.a`)}</p>
                        </details>
                    ))}
                </section>

                <section className="seo-section">
                    <h2 className="seo-section-title">{t("seo.privacy.title")}</h2>
                    <p className="seo-text">{t("seo.privacy.text")}</p>
                </section>
            </article>

            <RelatedTools currentHref="/multi-timer" />
        </>
    );
}
