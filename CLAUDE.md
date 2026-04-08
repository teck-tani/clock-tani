# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

- `npm run dev` — Start dev server (localhost:3000)
- `npm run build` — Production build
- `npm run lint` — ESLint

## Architecture

**Stack:** Next.js 16 (App Router) + React 19 + TypeScript + Tailwind CSS 4 + next-intl

**Clock-Tani** is a Korean online clock/timer web app (clock-tani.com) with 9 tools: clock, stopwatch, timer, pomodoro, interval timer, multi-timer, alarm, server-time, D-Day counter.

**Notable dependencies:** `@dnd-kit/*` (multi-timer drag-and-drop), `korean-lunar-calendar` (음력 계산), `react-icons`

### Routing & i18n

- Locale-based routing: `/[locale]/[tool]` (e.g., `/ko/timer`, `/en/alarm`)
- Supported locales: `ko` (default), `en` — prefix always shown
- Translation files: `messages/ko.json`, `messages/en.json`
- Middleware (`src/middleware.ts`) handles locale detection via next-intl
- Navigation helpers: `src/navigation.ts`

### Key Directories

- `src/app/[locale]/` — Page routes, each tool has its own directory with page.tsx + client view component
- `src/components/` — Shared components (Header, SoundPicker, ShareButton, etc.)
- `src/contexts/` — React Context providers (ThemeContext, StopwatchSettingsContext)
- `src/config/tools.ts` — Tool definitions, `ALL_TOOLS`, `findToolByPathname()`, `getRelatedTools()`
- `src/config/guides.ts` — Guide definitions, `ALL_GUIDES`, `findGuideBySlug()` (slug, titleKey, relatedTool)
- `src/lib/og-template.tsx` — 공유 OG 이미지 생성 템플릿 (`generateOgImage()`)
- `src/components/soundUtils.ts` — Shared audio playback utilities
- `public/sounds/` — Alarm sound MP3 files (15종)

### Patterns

- **Server components by default**, `"use client"` only when needed
- **CSS Modules** (`.module.css`) for component styles, global CSS in `src/app/globals.css`. 공유 레이아웃은 `SharedClockLayout.module.css`, 도구별 스타일은 각 도구 디렉토리의 `.module.css` (예외: stopwatch는 `stopwatch.css` 글로벌)
- **Theme:** `ThemeContext` sets `data-theme` attribute on body, stored in localStorage as `globalTheme`
- **Persistence:** localStorage for user settings (alarms, timer state, stopwatch laps, theme)
- **Vibration toggle:** Only shown on touch devices — check both `"vibrate" in navigator` AND `("ontouchstart" in window || navigator.maxTouchPoints > 0)`
- **SEO:** Per-page metadata, dynamic OG images (`opengraph-image.tsx` — `src/lib/og-template.tsx` 공유 템플릿 사용), sitemap (`src/app/sitemap.ts`), JSON-LD schema
- **Guides:** `/guides/[slug]` 동적 라우트, `src/config/guides.ts`에서 7개 가이드 정의, 각 가이드가 `relatedTool`로 도구 연결
- **PWA:** Service worker at `public/sw.js`, manifest at `public/manifest.json`
- **Lazy loading:** GTM, AdSense, and FeedbackButton are dynamically imported

### Browser APIs Used

- Web Audio API (stopwatch beep sound)
- Vibration API (haptic feedback on mobile)
- Wake Lock API (prevent screen sleep during timers)
- Notification API (timer/alarm alerts)
- Service Worker (PWA offline support)

## UI/UX 통일 원칙

**공통된 기능이나 UI는 반드시 모든 메뉴에서 동일한 방식으로 구현한다.** 새로운 기능을 추가하거나 기존 UI를 수정할 때, 같은 기능이 다른 메뉴에도 존재하면 모두 통일된 스타일로 맞춰야 한다.

- 진동 토글, 소리 선택, 공유 버튼 등 공통 UI는 하나의 스타일로 통일
- 공통 기능은 가능한 한 공유 컴포넌트(`src/components/`)로 추출하여 재사용
- 한 메뉴에서 UI를 변경하면, 같은 UI를 사용하는 다른 메뉴도 함께 변경

## next.config.ts 주요 설정

- **리다이렉트:** `/` → `/ko` (301 영구 리다이렉트)
- **보안 헤더:** CSP, X-Frame-Options, HSTS, Permissions-Policy
- **패키지 최적화:** `react-icons`, `korean-lunar-calendar` optimizePackageImports
- **프로덕션:** console 자동 제거, compression 활성화

## Style Conventions

- Korean comments in code
- Commit messages in Korean
- Path alias: `@/*` maps to `src/*`

## 기능별 명세 문서

기능 수정 시 해당 문서를 먼저 참조하여 파일 맵, 비즈니스 규칙, 주의사항을 확인한다.

### 도구 (Tools)

| 기능 | 문서 | 비고 |
|------|------|------|
| 시계 | [docs/features/clock.md](docs/features/clock.md) | 세계 시계, 70개 도시, DnD |
| 스톱워치 | [docs/features/stopwatch.md](docs/features/stopwatch.md) | 랩 타임, Web Audio API |
| 타이머 | [docs/features/timer.md](docs/features/timer.md) | 3모드 허브 (타이머/포모도로/인터벌) |
| 포모도로 | [docs/features/pomodoro.md](docs/features/pomodoro.md) | TimerView fixedMode 재사용 |
| 인터벌 | [docs/features/interval.md](docs/features/interval.md) | TimerView fixedMode 재사용 |
| 멀티 타이머 | [docs/features/multi-timer.md](docs/features/multi-timer.md) | 다중 독립 타이머, DnD |
| 알람 | [docs/features/alarm.md](docs/features/alarm.md) | Notification API, 15종 알림음 |
| 서버 시간 | [docs/features/server-time.md](docs/features/server-time.md) | 유일한 API 라우트 |
| D-Day 카운터 | [docs/features/dday-counter.md](docs/features/dday-counter.md) | 음력 변환 |

### 공유 시스템

| 기능 | 문서 | 비고 |
|------|------|------|
| 가이드 | [docs/features/guides.md](docs/features/guides.md) | 20개 가이드, config 기반 |
| 테마 | [docs/features/theme.md](docs/features/theme.md) | 라이트/다크, ThemeContext |
| 사운드 | [docs/features/sound-system.md](docs/features/sound-system.md) | SoundPicker, 15종 MP3 |
| PWA | [docs/features/pwa.md](docs/features/pwa.md) | SW, Wake Lock, 매니페스트 |
| SEO | [docs/features/seo.md](docs/features/seo.md) | OG 이미지, JSON-LD, 사이트맵 |
| 국제화 | [docs/features/i18n.md](docs/features/i18n.md) | ko/en, next-intl |

### SEO/검색 가이드라인

| 문서 | 비고 |
|------|------|
| [docs/google-search-console-guidelines.md](docs/google-search-console-guidelines.md) | Google 공식 SEO 가이드라인 종합 (E-E-A-T, 스팸정책, 구조화데이터, 페이지경험 등) |

**모든 작업 시 이 문서를 참고하여 Google 정책을 준수할 것.** 특히:
- 새 페이지/콘텐츠 추가 시: 메타데이터, canonical, hreflang, sitemap, 구조화 데이터 확인
- 콘텐츠 작성 시: E-E-A-T 원칙 준수, 독창적이고 사용자에게 유용한 내용
- 광고 추가 시: 콘텐츠 접근을 방해하지 않는지 확인
- 페이지 삭제/URL 변경 시: 301 리디렉션 설정

## Contact

- 이메일: admin@teck-tani.com
