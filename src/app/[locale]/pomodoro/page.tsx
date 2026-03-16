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
function generateFaqSchema(locale: string) {
    const faqData =
        locale === 'ko'
            ? [
                  { question: "포모도로 기법이란 무엇인가요?", answer: "1980년대 프란체스코 시릴로가 개발한 시간 관리법입니다. 25분 집중 + 5분 휴식을 1뽀모도로로 하고, 4뽀모도로 후 15~30분 긴 휴식을 취합니다. 짧은 집중과 규칙적인 휴식으로 피로 없이 높은 생산성을 유지할 수 있습니다." },
                  { question: "포모도로 집중 시간을 25분이 아닌 다른 시간으로 변경할 수 있나요?", answer: "네, 집중 시간 옆의 ± 버튼을 눌러 1분부터 90분까지 5분 단위로 자유롭게 조절할 수 있습니다. 휴식 시간도 마찬가지입니다. 자신에게 맞는 최적의 시간을 찾아보세요." },
                  { question: "포모도로 통계는 어떻게 확인하나요?", answer: "세션을 완료할 때마다 자동으로 통계가 기록됩니다. 오늘 완료한 포모도로 수, 총 집중 시간 등을 확인할 수 있어 자신의 생산성을 객관적으로 파악할 수 있습니다." },
                  { question: "탭을 닫으면 타이머가 멈추나요?", answer: "네, 브라우저 탭을 완전히 닫으면 타이머가 멈춥니다. 하지만 다른 탭을 사용하거나 화면을 잠가도 탭이 열려있다면 타이머는 계속 작동합니다." },
                  { question: "배경음(빗소리, 카페 소음 등)을 사용할 수 있나요?", answer: "네, 6가지 배경음(빗소리, 카페, 백색소음, 모닥불, 파도, 숲)을 제공합니다. 집중할 때 적절한 배경음은 외부 소음을 차단하고 몰입도를 높여줍니다." },
                  { question: "이 서비스는 무료인가요?", answer: "네, 포모도로 타이머는 완전히 무료이며 회원가입이나 설치가 필요하지 않습니다. 브라우저에서 바로 사용할 수 있습니다." },
              ]
            : [
                  { question: "What is the Pomodoro Technique?", answer: "Developed by Francesco Cirillo in the 1980s. One 'pomodoro' is 25 minutes of focus + 5 minutes of break. After 4 pomodoros, take a 15-30 minute long break. Short focus periods with regular breaks maintain high productivity without fatigue." },
                  { question: "Can I change the focus time from 25 minutes?", answer: "Yes, use the ± buttons next to the focus time to adjust from 1 to 90 minutes in 5-minute increments. Break times are adjustable too. Find the optimal duration that works for you." },
                  { question: "How do I check my Pomodoro statistics?", answer: "Statistics are automatically recorded each time you complete a session. You can check the number of pomodoros completed today and total focus time to objectively track your productivity." },
                  { question: "Does the timer stop if I close the tab?", answer: "Yes, completely closing the browser tab stops the timer. However, using other tabs or locking the screen while keeping the tab open will not affect the timer." },
                  { question: "Can I use ambient sounds (rain, cafe noise, etc.)?", answer: "Yes, we offer 6 ambient sounds: Rain, Cafe, White Noise, Fireplace, Ocean Waves, and Forest. Appropriate background sounds help block external noise and boost focus." },
                  { question: "Is this service free?", answer: "Yes, the Pomodoro Timer is completely free with no registration or installation required. Use it directly in your browser." },
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
const faqKeys = ["whatIs", "changeTime", "statistics", "tabClose", "ambientSound", "free"] as const;

import RelatedTools from "@/components/RelatedTools";

export default async function PomodoroPage(props: { params: Promise<{ locale: string }> }) {
    const { locale } = await props.params;
    setRequestLocale(locale);
    const t = await getTranslations({ locale, namespace: 'Clock.Pomodoro' });

    const faqSchema = generateFaqSchema(locale);
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

            <RelatedTools currentHref="/pomodoro" />
        </>
    );
}
