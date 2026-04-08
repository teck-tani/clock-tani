"use client";

import Script from "next/script";
import { useEffect, useState } from "react";
import { getCookieConsent } from "./CookieConsent";

export default function GoogleAdsense() {
    const [loadAds, setLoadAds] = useState(false);

    useEffect(() => {
        // 쿠키 동의가 없으면 AdSense 로드하지 않음
        if (getCookieConsent() !== "accepted") {
            const onConsentChange = () => {
                if (getCookieConsent() === "accepted") {
                    setLoadAds(true);
                }
            };
            window.addEventListener("cookieConsentChanged", onConsentChange);
            return () => window.removeEventListener("cookieConsentChanged", onConsentChange);
        }

        const handleInteraction = () => {
            setLoadAds(true);
        };

        window.addEventListener("scroll", handleInteraction, { once: true });
        window.addEventListener("mousemove", handleInteraction, { once: true });
        window.addEventListener("touchstart", handleInteraction, { once: true });
        window.addEventListener("keydown", handleInteraction, { once: true });

        return () => {
            window.removeEventListener("scroll", handleInteraction);
            window.removeEventListener("mousemove", handleInteraction);
            window.removeEventListener("touchstart", handleInteraction);
            window.removeEventListener("keydown", handleInteraction);
        };
    }, []);

    if (!loadAds) return null;

    return (
        <Script
            async
            src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-4836555208250151"
            crossOrigin="anonymous"
            strategy="lazyOnload"
            onError={() => {
                console.debug('Google Ads script load deferred');
            }}
        />
    );
}
