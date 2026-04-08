'use client';

import dynamic from 'next/dynamic';

const CookieConsent = dynamic(() => import('./CookieConsent'), { ssr: false });

export default function LazyCookieConsent() {
    return <CookieConsent />;
}
