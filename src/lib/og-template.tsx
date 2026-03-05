import { ImageResponse } from 'next/og';

interface OgTemplateProps {
    locale: string;
    title: { ko: string; en: string };
    subtitle: { ko: string; en: string };
    tags: { ko: string[]; en: string[] };
    icon: string;
    accentColor: string;
}

export const ogSize = { width: 1200, height: 630 };

export function generateOgImage({
    locale,
    title,
    subtitle,
    tags,
    icon,
    accentColor,
}: OgTemplateProps) {
    const isKo = locale === 'ko';
    const titleText = isKo ? title.ko : title.en;
    const subtitleText = isKo ? subtitle.ko : subtitle.en;
    const tagList = isKo ? tags.ko : tags.en;

    return new ImageResponse(
        (
            <div
                style={{
                    width: '100%',
                    height: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 50%, #0f172a 100%)',
                    fontFamily: 'sans-serif',
                }}
            >
                <div
                    style={{
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        justifyContent: 'center',
                        background: 'rgba(0, 0, 0, 0.6)',
                        borderRadius: '24px',
                        padding: '50px 80px',
                        border: `2px solid ${accentColor}40`,
                        boxShadow: `0 0 60px ${accentColor}30`,
                    }}
                >
                    <span
                        style={{
                            fontSize: '80px',
                            marginBottom: '20px',
                        }}
                    >
                        {icon}
                    </span>

                    <h1
                        style={{
                            fontSize: '48px',
                            fontWeight: 'bold',
                            color: '#ffffff',
                            margin: '0 0 16px 0',
                            textAlign: 'center',
                        }}
                    >
                        {titleText}
                    </h1>

                    <p
                        style={{
                            fontSize: '24px',
                            color: '#94a3b8',
                            margin: '0 0 24px 0',
                            textAlign: 'center',
                        }}
                    >
                        {subtitleText}
                    </p>

                    <div
                        style={{
                            display: 'flex',
                            gap: '12px',
                            flexWrap: 'wrap',
                            justifyContent: 'center',
                        }}
                    >
                        {tagList.map((tag) => (
                            <span
                                key={tag}
                                style={{
                                    background: `${accentColor}30`,
                                    color: accentColor,
                                    padding: '8px 20px',
                                    borderRadius: '20px',
                                    fontSize: '16px',
                                    fontWeight: 600,
                                    border: `1px solid ${accentColor}60`,
                                }}
                            >
                                {tag}
                            </span>
                        ))}
                    </div>
                </div>

                <div
                    style={{
                        position: 'absolute',
                        bottom: '30px',
                        right: '40px',
                        display: 'flex',
                        alignItems: 'center',
                    }}
                >
                    <span
                        style={{
                            fontSize: '20px',
                            color: 'rgba(148, 163, 184, 0.8)',
                            fontWeight: 600,
                        }}
                    >
                        clock-tani.com
                    </span>
                </div>
            </div>
        ),
        { ...ogSize }
    );
}
