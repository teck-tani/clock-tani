'use client';

import { useEffect } from 'react';

export default function Error({
    error,
    reset,
}: {
    error: Error & { digest?: string };
    reset: () => void;
}) {
    useEffect(() => {
        console.error(error);
    }, [error]);

    return (
        <div style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            minHeight: '60vh',
            padding: '40px 20px',
            textAlign: 'center',
        }}>
            <h1 style={{ fontSize: '3rem', fontWeight: 700, color: '#ef4444', marginBottom: 8 }}>
                Oops!
            </h1>
            <h2 style={{ fontSize: '1.2rem', marginBottom: 16, color: 'var(--text-primary, #334155)' }}>
                문제가 발생했습니다 / Something went wrong
            </h2>
            <p style={{ fontSize: '0.95rem', color: 'var(--text-secondary, #64748b)', marginBottom: 32, maxWidth: 400 }}>
                일시적인 오류가 발생했습니다. 다시 시도해 주세요.
            </p>
            <button
                onClick={() => reset()}
                style={{
                    padding: '12px 32px',
                    borderRadius: 8,
                    background: '#0891b2',
                    color: '#fff',
                    border: 'none',
                    cursor: 'pointer',
                    fontWeight: 600,
                    fontSize: '1rem',
                }}
            >
                다시 시도 / Try Again
            </button>
        </div>
    );
}
