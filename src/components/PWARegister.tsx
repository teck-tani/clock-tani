"use client";

import { useEffect } from 'react';

export default function PWARegister() {
  useEffect(() => {
    if (!('serviceWorker' in navigator)) return;

    // localhost에서는 SW 해제 (캐싱 문제 방지)
    if (location.hostname === 'localhost' || location.hostname === '127.0.0.1') {
      navigator.serviceWorker.getRegistrations().then(regs =>
        regs.forEach(r => { r.unregister(); console.log('SW unregistered (dev)'); })
      );
      return;
    }

    navigator.serviceWorker
      .register('/sw.js')
      .then((registration) => {
        console.log('SW registered:', registration.scope);
        // 새 SW 발견 시 즉시 활성화
        registration.addEventListener('updatefound', () => {
          const newWorker = registration.installing;
          if (newWorker) {
            newWorker.addEventListener('statechange', () => {
              if (newWorker.state === 'activated') {
                console.log('New SW activated');
              }
            });
          }
        });
      })
      .catch((error) => {
        console.log('SW registration failed:', error);
      });
  }, []);

  return null;
}
