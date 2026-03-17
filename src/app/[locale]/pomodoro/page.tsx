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
    const t = await getTranslations({ locale, namespace: 'Clock.Pomodoro.meta' });

    const isKo = locale === 'ko';
    const url = `${baseUrl}/${locale}/pomodoro`;

    return {
        title: t('title'),
        description: t('description'),
        keywords: t('keywords'),
        alternates: {
            canonical: url,
            languages: {
                'x-default': `${baseUrl}/ko/pomodoro`,
                'ko': `${baseUrl}/ko/pomodoro`,
                'en': `${baseUrl}/en/pomodoro`,
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
// FAQ 스키마는 번역 파일(seo.faq.list)에서 가져와 생성
const faqKeyList = ["q1", "q2", "q3", "q4"] as const;

function generateHowToSchema(locale: string) {
    const isKo = locale === 'ko';

    return {
        "@context": "https://schema.org",
        "@type": "HowTo",
        name: isKo ? "포모도로 타이머 사용 방법" : "How to Use Pomodoro Timer",
        description: isKo
            ? "포모도로 기법을 활용하여 집중력과 생산성을 높이는 방법을 안내합니다."
            : "Learn how to boost focus and productivity using the Pomodoro Technique.",
        step: isKo
            ? [
                  { "@type": "HowToStep", name: "집중 시간 설정", text: "기본 25분 또는 ± 버튼으로 원하는 집중 시간을 설정합니다. 휴식 시간(기본 5분)도 조절 가능합니다." },
                  { "@type": "HowToStep", name: "알람음 & 배경음 선택", text: "5종 알람음 중 선택하고, 집중에 도움이 되는 배경음(빗소리, 카페, 백색소음 등)을 설정합니다." },
                  { "@type": "HowToStep", name: "집중 세션 시작", text: "시작 버튼을 눌러 집중 타이머를 시작합니다. 타이머가 진행되는 동안 한 가지 작업에만 몰입하세요." },
                  { "@type": "HowToStep", name: "휴식 & 반복", text: "집중 시간이 끝나면 알람이 울리고 자동으로 휴식 타이머가 시작됩니다. 4세션 후에는 긴 휴식을 취하세요." },
              ]
            : [
                  { "@type": "HowToStep", name: "Set Focus Duration", text: "Set the focus time (default 25 min) using ± buttons. Break time (default 5 min) is also adjustable." },
                  { "@type": "HowToStep", name: "Choose Alarm & Ambient Sound", text: "Select from 5 alarm sounds and set ambient sounds (Rain, Cafe, White Noise, etc.) to help you focus." },
                  { "@type": "HowToStep", name: "Start Focus Session", text: "Press Start to begin the focus timer. Concentrate on a single task while the timer runs." },
                  { "@type": "HowToStep", name: "Break & Repeat", text: "When focus time ends, an alarm rings and break timer starts automatically. Take a long break after 4 sessions." },
              ],
    };
}

function generateWebAppSchema(locale: string) {
    const isKo = locale === 'ko';

    return {
        "@context": "https://schema.org",
        "@type": "WebApplication",
        name: isKo ? "포모도로 타이머" : "Pomodoro Timer",
        description: isKo
            ? "25분 집중 + 5분 휴식의 포모도로 기법으로 생산성을 높이는 무료 온라인 타이머"
            : "Free online Pomodoro timer using the 25 min focus + 5 min break technique for productivity",
        url: `${baseUrl}/${locale}/pomodoro`,
        applicationCategory: "UtilitiesApplication",
        operatingSystem: "Any",
        offers: { "@type": "Offer", price: "0", priceCurrency: "KRW" },
        featureList: isKo
            ? ["25분 집중 + 5분 휴식 자동 전환", "집중/휴식 시간 자유 조절", "포모도로 통계 및 기록", "6가지 배경음 지원", "5종 알람음 + 진동 알림", "작업 목록 관리", "자동 저장 (localStorage)"]
            : ["Auto 25 min focus + 5 min break switching", "Customizable focus/break durations", "Pomodoro statistics and tracking", "6 ambient sounds", "5 alarm sounds + vibration", "Task list management", "Auto save (localStorage)"],
        browserRequirements: "Requires JavaScript. Requires HTML5.",
        softwareVersion: "1.0",
    };
}

// ===== Page Component =====
const featureKeys = ["autoSwitch", "customTime", "statistics", "ambientSound", "taskList"] as const;
const howtoStepKeys = ["step1", "step2", "step3", "step4"] as const;
const usecaseKeys = ["study", "coding", "reading", "exam"] as const;
const faqKeys = ["q1", "q2", "q3", "q4"] as const;

import RelatedTools from "@/components/RelatedTools";

export default async function PomodoroPage(props: { params: Promise<{ locale: string }> }) {
    const { locale } = await props.params;
    setRequestLocale(locale);
    const t = await getTranslations({ locale, namespace: 'Clock.Pomodoro' });

    // FAQ 스키마를 번역 파일에서 생성 (중복 방지)
    const faqSchema = {
        "@context": "https://schema.org",
        "@type": "FAQPage",
        mainEntity: faqKeyList.map((key) => ({
            "@type": "Question",
            name: t(`seo.faq.list.${key}.q`),
            acceptedAnswer: { "@type": "Answer", text: t(`seo.faq.list.${key}.a`) },
        })),
    };
    const howToSchema = generateHowToSchema(locale);
    const webAppSchema = generateWebAppSchema(locale);

    return (
        <>
            <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />
            <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(howToSchema) }} />
            <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(webAppSchema) }} />

            <TimerView fixedMode="pomodoro" />

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

            <RelatedTools currentHref="/pomodoro" />
        </>
    );
}
