"use client";

import Script from "next/script";
import { useEffect, useState } from "react";
import { getCookieConsent } from "./CookieConsent";

export default function LazyGTM() {
    const [load, setLoad] = useState(false);

    useEffect(() => {
        // 쿠키 동의가 없으면 GTM 로드하지 않음
        if (getCookieConsent() !== "accepted") {
            const onConsentChange = () => {
                if (getCookieConsent() === "accepted") {
                    setLoad(true);
                }
            };
            window.addEventListener("cookieConsentChanged", onConsentChange);
            return () => window.removeEventListener("cookieConsentChanged", onConsentChange);
        }

        const timer = setTimeout(() => setLoad(true), 3000);
        const handler = () => {
            setLoad(true);
            clearTimeout(timer);
        };

        window.addEventListener("scroll", handler, { once: true });
        window.addEventListener("click", handler, { once: true });
        window.addEventListener("touchstart", handler, { once: true });

        return () => {
            clearTimeout(timer);
            window.removeEventListener("scroll", handler);
            window.removeEventListener("click", handler);
            window.removeEventListener("touchstart", handler);
        };
    }, []);

    if (!load) return null;

    return (
        <>
            <Script
                src="https://www.googletagmanager.com/gtag/js?id=G-9LWQTKQLM1"
                strategy="afterInteractive"
            />
            <Script id="gtag-init" strategy="afterInteractive">
                {`window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments);}gtag('js',new Date());gtag('config','G-9LWQTKQLM1');`}
            </Script>
        </>
    );
}
