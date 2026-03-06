import { ImageResponse } from 'next/og';

export const runtime = 'edge';
export const alt = 'Clock-Tani - Online Clock & Time Tools';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

export default async function Image({ params }: { params: { locale: string } }) {
    const isKo = params.locale === 'ko';

    const tools = isKo
        ? ['시계', '타이머', '스톱워치', '알람', '포모도로', 'D-Day']
        : ['Clock', 'Timer', 'Stopwatch', 'Alarm', 'Pomodoro', 'D-Day'];

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
                        background: 'rgba(0, 0, 0, 0.5)',
                        borderRadius: '24px',
                        padding: '50px 80px',
                        border: '2px solid rgba(8, 145, 178, 0.4)',
                    }}
                >
                    <h1
                        style={{
                            fontSize: '56px',
                            fontWeight: 'bold',
                            color: '#ffffff',
                            margin: '0 0 16px 0',
                        }}
                    >
                        Clock-Tani
                    </h1>
                    <p
                        style={{
                            fontSize: '28px',
                            color: '#94a3b8',
                            margin: '0 0 32px 0',
                        }}
                    >
                        {isKo ? '온라인 시계 & 시간 관리 도구' : 'Online Clock & Time Management Tools'}
                    </p>
                    <div
                        style={{
                            display: 'flex',
                            gap: '12px',
                            flexWrap: 'wrap',
                            justifyContent: 'center',
                        }}
                    >
                        {tools.map((tool) => (
                            <span
                                key={tool}
                                style={{
                                    background: 'rgba(8, 145, 178, 0.2)',
                                    color: '#22d3ee',
                                    padding: '8px 20px',
                                    borderRadius: '20px',
                                    fontSize: '18px',
                                    fontWeight: 600,
                                    border: '1px solid rgba(8, 145, 178, 0.4)',
                                }}
                            >
                                {tool}
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
                    }}
                >
                    <span style={{ fontSize: '20px', color: 'rgba(148, 163, 184, 0.8)', fontWeight: 600 }}>
                        clock-tani.com
                    </span>
                </div>
            </div>
        ),
        { ...size }
    );
}
