# PWA (Progressive Web App)

## 목적

Clock-Tani를 네이티브 앱처럼 설치 가능하게 만들고, 오프라인에서도 기본 기능을 사용할 수 있도록 하는 PWA 기능. Service Worker 캐싱, 앱 매니페스트, 화면 꺼짐 방지(Wake Lock)를 포함한다.

## 파일 맵

| 구분 | 파일 경로 |
|------|-----------|
| Service Worker | `public/sw.js` |
| 매니페스트 | `public/manifest.json` |
| SW 등록 컴포넌트 | `src/components/PWARegister.tsx` |
| Wake Lock 훅 | `src/app/[locale]/timer/useWakeLock.ts` |
| 아이콘 (192px) | `public/icon-192x192.svg` |
| 아이콘 (512px) | `public/icon-512x512.svg` |
| 마스커블 아이콘 | `public/icon-maskable.svg` |
| 파비콘 | `public/favicon.svg`, `public/favicon.ico` |

## API 엔드포인트

없음

## 주요 데이터 저장소

없음 (Service Worker 캐시 스토리지 사용)

## 비즈니스 규칙

- 캐시 이름: `clock-tani-v3`
- 캐싱 전략: Network-first (HTML + 정적 자산)
- 이전 버전 캐시 자동 정리
- 초기 캐싱: manifest, icons, 주요 라우트
- 디스플레이 모드: standalone (몰입형)
- 테마 색상: `#0891b2` (시안)
- 배경 색상: `#0f172a` (다크 네이비)
- Wake Lock API: 타이머 실행 중 화면 꺼짐 방지
- 마스커블 아이콘 지원 (적응형 디자인)

## 데이터 흐름

```
앱 로드 → PWARegister → navigator.serviceWorker.register('/sw.js')
         → 캐시 초기화 → 주요 리소스 프리캐싱
네트워크 요청 → SW 인터셉트 → 네트워크 우선 → 실패 시 캐시 폴백
캐시 버전 변경 → activate 이벤트 → 이전 버전 캐시 삭제
타이머 시작 → useWakeLock() → navigator.wakeLock.request('screen')
타이머 종료 → Wake Lock 해제
```

## 주의사항

- `sw.js` 수정 시 캐시 버전(`clock-tani-v3`)을 반드시 업데이트
- Network-first 전략이라 오프라인에서는 캐시된 페이지만 접근 가능
- Wake Lock API는 일부 브라우저에서만 지원 — 폴백 없음 (graceful degradation)
- iOS Safari에서 PWA 설치 시 일부 제한 (푸시 알림 등)

## 관련 기능

- [타이머](timer.md) — Wake Lock 사용
- [알람](alarm.md) — Notification API
- [테마](theme.md) — manifest의 theme_color
