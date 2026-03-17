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
    const t = await getTranslations({ locale, namespace: 'Clock.Interval.meta' });

    const isKo = locale === 'ko';
    const url = `${baseUrl}/${locale}/interval`;

    return {
        title: t('title'),
        description: t('description'),
        keywords: t('keywords'),
        alternates: {
            canonical: url,
            languages: {
                'x-default': `${baseUrl}/ko/interval`,
                'ko': `${baseUrl}/ko/interval`,
                'en': `${baseUrl}/en/interval`,
            },
        },
        openGraph: {
            title: t('ogTitle'),
            description: t('ogDescription'),
            url,
            siteName: 'Clock Tani',
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
                  { question: "타바타 운동이란 무엇인가요?", answer: "일본의 이즈미 타바타 박사가 개발한 고강도 인터벌 트레이닝(HIIT)입니다. 20초 전력 운동 + 10초 휴식을 8세트(총 4분) 반복합니다. 짧은 시간에 유산소와 무산소 능력을 동시에 향상시킬 수 있습니다." },
                  { question: "HIIT와 타바타의 차이점은 무엇인가요?", answer: "타바타는 HIIT의 한 종류입니다. HIIT는 고강도 인터벌 트레이닝의 총칭으로 운동/휴식 시간과 라운드를 자유롭게 설정합니다. 타바타는 20초/10초/8라운드로 고정된 특정 프로토콜입니다." },
                  { question: "운동/휴식 시간과 라운드를 자유롭게 설정할 수 있나요?", answer: "네, 운동 시간(5초~10분), 휴식 시간(5초~5분), 라운드 수(1~50)를 자유롭게 설정할 수 있습니다. 타바타(20초/10초/8라운드)와 기본 HIIT(30초/15초/10라운드) 프리셋도 제공합니다." },
                  { question: "인터벌 중간에 일시정지할 수 있나요?", answer: "네, 운동 또는 휴식 중 언제든지 일시정지 버튼을 눌러 잠시 멈출 수 있습니다. 다시 시작하면 멈춘 시점부터 이어서 진행됩니다." },
                  { question: "모바일에서도 사용할 수 있나요?", answer: "네, 스마트폰과 태블릿의 모바일 브라우저에서도 완벽하게 작동합니다. 반응형 디자인으로 화면 크기에 맞게 최적화되어 있습니다." },
                  { question: "이 서비스는 무료인가요?", answer: "네, 인터벌 타이머는 완전히 무료이며 회원가입이나 설치가 필요하지 않습니다. 브라우저에서 바로 사용할 수 있습니다." },
              ]
            : [
                  { question: "What is Tabata training?", answer: "Developed by Dr. Izumi Tabata in Japan, it's a high-intensity interval training (HIIT) protocol. Perform 20 seconds of all-out exercise + 10 seconds rest for 8 sets (4 minutes total). It improves both aerobic and anaerobic capacity in a short time." },
                  { question: "What's the difference between HIIT and Tabata?", answer: "Tabata is a specific type of HIIT. HIIT is the general term for high-intensity interval training with flexible work/rest times and rounds. Tabata is a fixed protocol of 20s work / 10s rest / 8 rounds." },
                  { question: "Can I customize work/rest times and rounds?", answer: "Yes, you can freely set work time (5s-10min), rest time (5s-5min), and rounds (1-50). Tabata (20s/10s/8 rounds) and basic HIIT (30s/15s/10 rounds) presets are also available." },
                  { question: "Can I pause during an interval?", answer: "Yes, you can pause at any time during work or rest by pressing the pause button. Resume to continue from where you stopped." },
                  { question: "Does it work on mobile devices?", answer: "Yes, it works perfectly on smartphones and tablets with responsive design that adapts to any screen size." },
                  { question: "Is this service free?", answer: "Yes, the Interval Timer is completely free with no registration or installation required. Use it directly in your browser." },
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
        name: isKo ? "인터벌 타이머 사용 방법" : "How to Use Interval Timer",
        description: isKo
            ? "타바타, HIIT 등 인터벌 트레이닝을 위한 타이머 사용 방법을 안내합니다."
            : "Learn how to use the interval timer for Tabata, HIIT, and custom training.",
        step: isKo
            ? [
                  { "@type": "HowToStep", name: "프리셋 또는 커스텀 선택", text: "타바타(20초/10초/8라운드) 또는 HIIT(30초/15초/10라운드) 프리셋을 선택하거나, 운동/휴식 시간과 라운드를 직접 설정합니다." },
                  { "@type": "HowToStep", name: "알람음 설정", text: "운동/휴식 전환 시 울리는 알람음을 5종 중 선택하고, 볼륨과 진동 옵션을 설정합니다." },
                  { "@type": "HowToStep", name: "인터벌 시작", text: "시작 버튼을 누르면 운동→휴식→운동... 순서로 자동 전환됩니다. 현재 라운드와 남은 시간이 크게 표시됩니다." },
                  { "@type": "HowToStep", name: "완료 확인", text: "모든 라운드가 끝나면 완료 알람이 울립니다. 총 운동 시간과 라운드 기록을 확인할 수 있습니다." },
              ]
            : [
                  { "@type": "HowToStep", name: "Choose Preset or Custom", text: "Select Tabata (20s/10s/8 rounds) or HIIT (30s/15s/10 rounds) preset, or set custom work/rest times and rounds." },
                  { "@type": "HowToStep", name: "Configure Alarm", text: "Choose from 5 alarm sounds for work/rest transitions. Set volume and vibration options." },
                  { "@type": "HowToStep", name: "Start Interval", text: "Press Start to begin automatic work→rest→work cycling. Current round and remaining time are displayed prominently." },
                  { "@type": "HowToStep", name: "Complete", text: "A completion alarm sounds when all rounds are done. Review total workout time and round records." },
              ],
    };
}

function generateWebAppSchema(locale: string) {
    const isKo = locale === 'ko';

    return {
        "@context": "https://schema.org",
        "@type": "WebApplication",
        name: isKo ? "인터벌 타이머 - 타바타 & HIIT" : "Interval Timer - Tabata & HIIT",
        description: isKo
            ? "타바타 운동, HIIT 트레이닝에 최적화된 무료 온라인 인터벌 타이머"
            : "Free online interval timer optimized for Tabata workouts and HIIT training",
        url: `${baseUrl}/${locale}/interval`,
        applicationCategory: "UtilitiesApplication",
        operatingSystem: "Any",
        offers: { "@type": "Offer", price: "0", priceCurrency: "KRW" },
        featureList: isKo
            ? ["타바타 프리셋 (20초/10초/8라운드)", "HIIT 프리셋 (30초/15초/10라운드)", "커스텀 운동/휴식/라운드 설정", "5종 알람음 + 진동 알림", "라운드 자동 전환", "화면 꺼짐 방지", "반응형 디자인"]
            : ["Tabata preset (20s/10s/8 rounds)", "HIIT preset (30s/15s/10 rounds)", "Custom work/rest/round settings", "5 alarm sounds + vibration", "Auto round switching", "Screen wake lock", "Responsive design"],
        browserRequirements: "Requires JavaScript. Requires HTML5.",
        softwareVersion: "1.0",
    };
}

// ===== Page Component =====
const featureKeys = ["tabataPreset", "customSettings", "autoSwitch", "alarmSound", "wakeLock"] as const;
const howtoStepKeys = ["step1", "step2", "step3", "step4"] as const;
const usecaseKeys = ["tabata", "hiit", "crossfit", "running"] as const;
const faqKeys = ["whatIsTabata", "hiitDiff", "customSettings", "pause", "mobile", "free"] as const;

import RelatedTools from "@/components/RelatedTools";

export default async function IntervalPage(props: { params: Promise<{ locale: string }> }) {
    const { locale } = await props.params;
    setRequestLocale(locale);
    const t = await getTranslations({ locale, namespace: 'Clock.Interval' });

    const faqSchema = generateFaqSchema(locale);
    const howToSchema = generateHowToSchema(locale);
    const webAppSchema = generateWebAppSchema(locale);

    return (
        <>
            <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />
            <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(howToSchema) }} />
            <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(webAppSchema) }} />

            <TimerView fixedMode="interval" />

            {/* SEO Content */}
            <article className="seo-article">
                <section className="seo-section">
                    <h1 className="seo-section-title">{t("seo.description.title")}</h1>
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

            <RelatedTools currentHref="/interval" />
        </>
    );
}
