# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

- `npm run dev` — Start dev server (localhost:3000)
- `npm run build` — Production build
- `npm run lint` — ESLint

## Architecture

**Stack:** Next.js 16 (App Router) + React 19 + TypeScript + Tailwind CSS 4 + next-intl

**Clock-Tani** is a Korean online clock/timer web app (clock-tani.com) with 9 tools: clock, stopwatch, timer, pomodoro, interval timer, multi-timer, alarm, server-time, D-Day counter.

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
- `src/components/soundUtils.ts` — Shared audio playback utilities
- `public/sounds/` — Alarm sound MP3 files

### Patterns

- **Server components by default**, `"use client"` only when needed
- **CSS Modules** (`.module.css`) for component styles, global CSS in `src/app/globals.css`
- **Theme:** `ThemeContext` sets `data-theme` attribute on body, stored in localStorage as `globalTheme`
- **Persistence:** localStorage for user settings (alarms, timer state, stopwatch laps, theme)
- **Vibration toggle:** Only shown on touch devices — check both `"vibrate" in navigator` AND `("ontouchstart" in window || navigator.maxTouchPoints > 0)`
- **SEO:** Per-page metadata, dynamic OG images (`opengraph-image.tsx`), sitemap (`src/app/sitemap.ts`), JSON-LD schema
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

## Style Conventions

- Korean comments in code
- Commit messages in Korean
- Path alias: `@/*` maps to `src/*`

## Contact

- 이메일: admin@teck-tani.com
