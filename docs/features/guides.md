# 가이드 시스템 (Guides)

## 목적

시간 관리, 타이머 활용법 등 실용 가이드를 제공하는 콘텐츠 시스템. SEO 롱테일 키워드 확보와 사용자 체류 시간 증가를 위한 정보성 페이지. 각 가이드는 관련 도구 페이지로의 CTA를 포함한다.

## 파일 맵

| 구분 | 파일 경로 |
|------|-----------|
| 가이드 설정 | `src/config/guides.ts` |
| 가이드 목록 페이지 | `src/app/[locale]/guides/page.tsx` |
| 가이드 목록 레이아웃 | `src/app/[locale]/guides/layout.tsx` |
| 가이드 목록 OG | `src/app/[locale]/guides/opengraph-image.tsx` |
| 개별 가이드 페이지 | `src/app/[locale]/guides/[slug]/page.tsx` |
| 개별 가이드 OG | `src/app/[locale]/guides/[slug]/opengraph-image.tsx` |
| 번역 (콘텐츠) | `messages/ko.json` → `Guides.articles.{slug}` |
| 번역 (제목/설명) | `messages/ko.json` → `Guides.titles`, `Guides.descriptions` |
| 사이트맵 | `src/app/sitemap.ts` (ALL_GUIDES에서 자동 생성) |

## API 엔드포인트

없음

## 주요 데이터 저장소

없음 (정적 콘텐츠, localStorage 미사용)

## 비즈니스 규칙

- `ALL_GUIDES` 배열에 가이드 정의: slug, titleKey, descKey, date, lastModified, relatedTool
- 현재 7개 가이드:
  1. `pomodoro-technique-guide` → /pomodoro
  2. `tabata-timer-guide` → /interval
  3. `time-zone-calculation` → /clock
  4. `dday-countdown-usage` → /dday-counter
  5. `time-management-techniques` → /timer
  6. `online-vs-device-clock` → /server-time
  7. `alarm-setting-tips` → /alarm
- 콘텐츠 구조: title, intro, sections[{title, content}], conclusion
- 각 가이드에 Article JSON-LD 스키마
- 관련 도구로의 CTA 버튼 포함

## 데이터 흐름

```
빌드 시 → generateStaticParams()로 locale × slug 조합 생성
        → 번역 파일에서 articles.{slug} 데이터 로드 → 정적 HTML 생성
사이트맵 → ALL_GUIDES에서 자동으로 URL 생성 (별도 등록 불필요)
```

## 주의사항

- 가이드 콘텐츠는 번역 파일(`messages/ko.json`, `en.json`)에 직접 작성
- 새 가이드 추가 시 3곳 수정: `config/guides.ts` + 번역 파일 + `opengraph-image.tsx`의 guideOgData
- 사이트맵은 ALL_GUIDES에서 자동 생성 — 별도 등록 불필요
- `findGuideBySlug()` 헬퍼 함수로 slug → GuideDef 조회

## 관련 기능

- [SEO](seo.md) — OG 이미지, JSON-LD Article 스키마
- [국제화](i18n.md) — 번역 파일 기반 콘텐츠
- 각 도구 문서 — relatedTool로 연결
