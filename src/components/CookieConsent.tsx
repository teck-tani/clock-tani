"use client";

import { useState, useEffect } from "react";
import { useTranslations, useLocale } from "next-intl";

const CONSENT_KEY = "cookieConsent";

export type ConsentState = "accepted" | "rejected" | null;

/** 쿠키 동의 상태를 가져오는 유틸리티 (다른 컴포넌트에서도 사용) */
export function getCookieConsent(): ConsentState {
    if (typeof window === "undefined") return null;
    return localStorage.getItem(CONSENT_KEY) as ConsentState;
}

export default function CookieConsent() {
    const t = useTranslations("CookieConsent");
    const locale = useLocale();
    const [visible, setVisible] = useState(false);

    useEffect(() => {
        const consent = localStorage.getItem(CONSENT_KEY);
        if (!consent) {
            // 약간의 딜레이 후 표시 (UX 향상)
            const timer = setTimeout(() => setVisible(true), 1500);
            return () => clearTimeout(timer);
        }
    }, []);

    const handleAccept = () => {
        localStorage.setItem(CONSENT_KEY, "accepted");
        setVisible(false);
        // 동의 후 GTM/AdSense가 로드될 수 있도록 커스텀 이벤트 발생
        window.dispatchEvent(new Event("cookieConsentChanged"));
    };

    const handleReject = () => {
        localStorage.setItem(CONSENT_KEY, "rejected");
        setVisible(false);
        window.dispatchEvent(new Event("cookieConsentChanged"));
    };

    if (!visible) return null;

    return (
        <div
            role="dialog"
            aria-label={t("title")}
            style={{
                position: "fixed",
                bottom: 0,
                left: 0,
                right: 0,
                zIndex: 9999,
                background: "var(--cookie-bg, #1a1a2e)",
                color: "var(--cookie-text, #e0e0e0)",
                padding: "16px 20px",
                boxShadow: "0 -2px 12px rgba(0,0,0,0.3)",
                display: "flex",
                flexWrap: "wrap",
                alignItems: "center",
                justifyContent: "center",
                gap: "12px",
                fontSize: "0.88rem",
                lineHeight: 1.5,
            }}
        >
            <p style={{ flex: "1 1 400px", margin: 0 }}>
                {t("description")}{" "}
                <a
                    href={`/${locale}/cookie-policy`}
                    style={{ color: "#22d3ee", textDecoration: "underline" }}
                >
                    {t("learnMore")}
                </a>
            </p>
            <div style={{ display: "flex", gap: "8px", flexShrink: 0 }}>
                <button
                    onClick={handleReject}
                    style={{
                        padding: "8px 18px",
                        borderRadius: 6,
                        border: "1px solid #555",
                        background: "transparent",
                        color: "#ccc",
                        cursor: "pointer",
                        fontSize: "0.85rem",
                        fontWeight: 500,
                    }}
                >
                    {t("reject")}
                </button>
                <button
                    onClick={handleAccept}
                    style={{
                        padding: "8px 18px",
                        borderRadius: 6,
                        border: "none",
                        background: "#0891b2",
                        color: "#fff",
                        cursor: "pointer",
                        fontSize: "0.85rem",
                        fontWeight: 600,
                    }}
                >
                    {t("accept")}
                </button>
            </div>
        </div>
    );
}
