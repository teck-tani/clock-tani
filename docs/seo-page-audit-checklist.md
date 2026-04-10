# clock-tani.com SEO 페이지별 검토 체크리스트

> **기준**: Google Search Central 가이드라인 (docs/google-search-console-guidelines.md)
> **검토일**: 2026-04-10
> **대상**: 18개 정적 페이지 + 16개 가이드 페이지 (ko/en 각각)

---

## 전체 요약

| 등급 | 항목 수 | 비율 |
|------|---------|------|
| ✅ 통과 | 156 | **100%** |
| ~~⚠️ 개선 권장~~ | ~~11~~ 0 | 0% |
| ~~❌ 수정 필요~~ | ~~3~~ 0 | 0% |

### ~~즉시 수정 필요 (Critical)~~ — 모두 완료 (2026-04-10)

| # | 문제 | 해당 페이지 | 상태 |
|---|------|-----------|------|
| 1 | ~~hreflang `x-default` 누락~~ | 홈페이지 | ✅ 완료 |
| 2 | ~~BreadcrumbList JSON-LD 누락~~ | 도구 8개 (clock 제외) | ✅ 완료 |
| 3 | ~~Stopwatch BreadcrumbList 누락~~ | 스톱워치 | ✅ 완료 (#2에 포함) |

### ~~권장 개선 (Recommended)~~ — 모두 완료 (2026-04-10)

| # | 문제 | 해당 페이지 | 파일 |
|---|------|-----------|------|
| 4 | ~~Twitter Card `summary` → `summary_large_image`~~ | 가이드 상세 | ✅ 완료 (2026-04-10) |
| 5 | ~~JSON-LD 없음~~ | 가이드 목록 | ✅ 완료 (2026-04-10) |
| 6 | ~~도구 컴포넌트 내 이미지 alt 속성 부족~~ | 전체 도구 | ✅ 완료 (2026-04-10) |

---

## 1. 공통 인프라 검토

### 1-1. 기술 기반

| 항목 | 상태 | 비고 |
|------|------|------|
| HTTPS | ✅ | HSTS 헤더 설정 (`max-age=31536000; includeSubDomains`) |
| 보안 헤더 | ✅ | CSP, X-Frame-Options, X-Content-Type-Options, X-XSS-Protection |
| robots.txt | ✅ | `src/app/robots.ts` — allow: /, disallow: /api, /_next, /.well-known |
| sitemap.xml | ✅ | `src/app/sitemap.ts` — 전체 페이지 + 가이드, hreflang alternates 포함 |
| 모바일 반응형 | ✅ | viewport meta, 반응형 CSS, PWA standalone |
| SSG 정적 생성 | ✅ | `force-static` + `revalidate: false`, 빠른 LCP |
| 파비콘 | ✅ | favicon.ico + favicon.svg, apple-touch-icon |
| manifest.json | ✅ | PWA 설정 완비, 아이콘 3종 (any, maskable) |
| 서비스 워커 | ✅ | Network-First 캐싱, 오프라인 지원 |
| Google Search Console 인증 | ✅ | `google-site-verification` 메타 태그 |
| Naver Search Advisor 인증 | ✅ | `naver-site-verification` 메타 태그 |
| 이미지 최적화 | ✅ | AVIF/WebP 포맷, 장기 캐시(1년) |
| 번들 최적화 | ✅ | react-icons, korean-lunar-calendar optimizePackageImports |
| console 제거 (프로덕션) | ✅ | `removeConsole: true` |

### 1-2. 다국어 (i18n)

| 항목 | 상태 | 비고 |
|------|------|------|
| URL 구조 | ✅ | 하위 디렉터리 방식 (`/ko/`, `/en/`) — Google 권장 |
| 번역 완성도 | ✅ | ko/en 모든 키 100% 일치 |
| 자동 리디렉션 | ✅ | `/` → `/ko` rewrite (301이 아닌 rewrite로 Googlebot 친화적) |
| 언어 선택기 | ✅ | Header 설정 드롭다운에서 언어 전환 가능 |
| 단일 언어 콘텐츠 | ✅ | 각 페이지가 단일 언어로만 표시 |

### 1-3. 광고 (AdSense)

| 항목 | 상태 | 비고 |
|------|------|------|
| 콘텐츠 접근 방해 없음 | ✅ | 광고가 콘텐츠를 가리지 않음 |
| lazy 로딩 | ✅ | 쿠키 동의 후 + 사용자 상호작용 후 로드 |
| 모바일 광고 크기 | ✅ | 250x250 정사각형 (적절한 크기) |
| 전면 광고 없음 | ✅ | 인터스티셜 광고 미사용 |

---

## 2. 홈페이지 (`/[locale]/page.tsx`)

### 기술적 SEO

| 항목 | 상태 | 비고 |
|------|------|------|
| title | ✅ | 고유, 다국어 번역 완비 |
| description | ✅ | 고유, 서비스 설명 포함 |
| canonical | ✅ | `https://clock-tani.com/{locale}` |
| hreflang ko/en | ✅ | 양방향 설정 |
| hreflang x-default | ✅ | `x-default` 설정 완료 |
| OpenGraph | ✅ | title, description, url, siteName, type, locale |
| Twitter Card | ✅ | `summary_large_image` |
| robots | ✅ | index: true, follow: true |
| sitemap 포함 | ✅ | priority 1.0, daily |

**✅ 수정 완료 (2026-04-10)**

### 구조화된 데이터

| 스키마 | 상태 | 필수 속성 |
|--------|------|----------|
| Organization | ✅ | name, url, logo, description, contactPoint |
| WebSite | ✅ | name, url, description, inLanguage |
| FAQPage | ✅ | mainEntity (동적 생성) |

### 콘텐츠 품질

| 항목 | 상태 | 비고 |
|------|------|------|
| 독창적 콘텐츠 | ✅ | 9개 도구 소개, 특징 설명 |
| E-E-A-T | ✅ | About 페이지 링크, 서비스 설명 |
| 내부 링크 | ✅ | 모든 도구 + 가이드 링크 |
| OG 이미지 | ✅ | 커스텀 OG 이미지 (도구 목록 + 도시 배경) |

---

## 3. 도구 페이지 (9개)

### 3-1. 시계 (Clock) — `/[locale]/clock/page.tsx`

#### 기술적 SEO

| 항목 | 상태 | 비고 |
|------|------|------|
| title | ✅ | "온라인 시계 - 세계시각 & 실시간 시계 \| Clock Tani" |
| description | ✅ | 70개+ 도시, 실시간, 드래그앤드롭 등 구체적 |
| canonical | ✅ | 올바름 |
| hreflang (x-default, ko, en) | ✅ | 양방향 완벽 |
| OpenGraph | ✅ | type: website, locale 설정 |
| Twitter Card | ✅ | summary_large_image |
| googleBot 지시사항 | ✅ | max-image-preview: large, max-snippet: -1 |
| sitemap | ✅ | priority 1.0 |

#### 구조화된 데이터

| 스키마 | 상태 | 비고 |
|--------|------|------|
| BreadcrumbList | ✅ | Home > Online Clock (2단계) |
| FAQPage | ✅ | 7개 Q&A |
| HowTo | ✅ | 4단계 |
| WebApplication | ✅ | UtilitiesApplication, 무료, 8개 기능 |

#### 콘텐츠

| 항목 | 상태 | 비고 |
|------|------|------|
| SEO 콘텐츠 섹션 | ✅ | 정의, 특징, 사용법, 활용사례, 도시 가이드, FAQ, 고유 콘텐츠 |
| 내부 링크 | ✅ | RelatedTools(5개), RelatedGuides |
| OG 이미지 | ✅ | 커스텀 (디지털 시계 표시) |

**평가: 완벽** — 모든 항목 통과

---

### 3-2. 스톱워치 (Stopwatch) — `/[locale]/stopwatch/page.tsx`

#### 기술적 SEO

| 항목 | 상태 | 비고 |
|------|------|------|
| title | ✅ | 고유 |
| description | ✅ | 고유 |
| canonical | ✅ | 올바름 |
| hreflang | ✅ | x-default, ko, en 모두 설정 |
| sitemap | ✅ | priority 0.8 |

#### 구조화된 데이터

| 스키마 | 상태 | 비고 |
|--------|------|------|
| BreadcrumbList | ✅ | Home > 온라인 스톱워치 (2단계) |
| FAQPage | ✅ | 5개 Q&A |
| HowTo | ✅ | 3단계 |
| WebApplication | ✅ | 구현됨 |

**✅ 수정 완료 (2026-04-10)**

---

### 3-3. 타이머 (Timer) — `/[locale]/timer/page.tsx`

#### 기술적 SEO: ✅ 모두 통과

#### 구조화된 데이터

| 스키마 | 상태 | 비고 |
|--------|------|------|
| BreadcrumbList | ✅ | Home > 온라인 타이머 (2단계) |
| FAQPage | ✅ | 7개 Q&A (4가지 모드 통합) |
| HowTo | ✅ | 5단계 |
| WebApplication | ✅ | 8개 기능 |

---

### 3-4. 포모도로 (Pomodoro) — `/[locale]/pomodoro/page.tsx`

#### 기술적 SEO: ✅ 모두 통과

#### 구조화된 데이터

| 스키마 | 상태 | 비고 |
|--------|------|------|
| BreadcrumbList | ✅ | Home > 포모도로 타이머 (2단계) |
| FAQPage | ✅ | 번역 파일 기반 동적 생성 |
| HowTo | ✅ | 4단계 |
| WebApplication | ✅ | 7개 기능 |

---

### 3-5. 인터벌 타이머 (Interval) — `/[locale]/interval/page.tsx`

#### 기술적 SEO: ✅ 모두 통과

#### 구조화된 데이터

| 스키마 | 상태 | 비고 |
|--------|------|------|
| BreadcrumbList | ✅ | Home > 인터벌 타이머 (2단계) |
| FAQPage | ✅ | 6개 Q&A (타바타/HIIT) |
| HowTo | ✅ | 4단계 |
| WebApplication | ✅ | 7개 기능 |

---

### 3-6. 멀티 타이머 (Multi-Timer) — `/[locale]/multi-timer/page.tsx`

#### 기술적 SEO: ✅ 모두 통과

#### 구조화된 데이터

| 스키마 | 상태 | 비고 |
|--------|------|------|
| BreadcrumbList | ✅ | Home > 멀티 타이머 (2단계) |
| FAQPage | ✅ | 5개 Q&A |
| HowTo | ✅ | 4단계 |
| WebApplication | ✅ | 7개 기능 |

---

### 3-7. 알람 (Alarm) — `/[locale]/alarm/page.tsx`

#### 기술적 SEO: ✅ 모두 통과

#### 구조화된 데이터

| 스키마 | 상태 | 비고 |
|--------|------|------|
| BreadcrumbList | ✅ | Home > 온라인 알람 시계 (2단계) |
| FAQPage | ✅ | 6개 Q&A |
| HowTo | ✅ | 4단계 |
| WebApplication | ✅ | 7개 기능 |

---

### 3-8. 서버 시간 (Server Time) — `/[locale]/server-time/page.tsx`

#### 기술적 SEO: ✅ 모두 통과

#### 구조화된 데이터

| 스키마 | 상태 | 비고 |
|--------|------|------|
| BreadcrumbList | ✅ | Home > 서버시간 (2단계) |
| FAQPage | ✅ | 5개 Q&A |
| HowTo | ✅ | 4단계 |
| WebApplication | ✅ | 5개 기능 |

---

### 3-9. D-day 카운터 (D-day Counter) — `/[locale]/dday-counter/page.tsx`

#### 기술적 SEO: ✅ 모두 통과

#### 구조화된 데이터

| 스키마 | 상태 | 비고 |
|--------|------|------|
| BreadcrumbList | ✅ | Home > D-Day 카운트다운 (2단계) |
| FAQPage | ✅ | 5개 Q&A |
| HowTo | ✅ | 4단계 |
| WebApplication | ✅ | 5개 기능 |

---

## 4. 가이드 페이지

### 4-1. 가이드 목록 (`/[locale]/guides/page.tsx`)

| 항목 | 상태 | 비고 |
|------|------|------|
| title | ✅ | 고유 |
| description | ✅ | 고유 |
| canonical | ✅ | 올바름 |
| hreflang | ✅ | x-default, ko, en |
| OpenGraph | ✅ | type: website |
| Twitter Card | ✅ | summary |
| JSON-LD | ✅ | CollectionPage + ItemList 구현 완료 |
| OG 이미지 | ✅ | 커스텀 OG 이미지 |

**✅ CollectionPage + ItemList JSON-LD 추가 완료 (2026-04-10)**

### 4-2. 가이드 상세 (`/[locale]/guides/[slug]/page.tsx`)

| 항목 | 상태 | 비고 |
|------|------|------|
| title | ✅ | 가이드별 고유 제목 |
| description | ✅ | 가이드별 고유 설명 |
| canonical | ✅ | 올바름 |
| hreflang | ✅ | x-default, ko, en |
| OpenGraph type | ✅ | `article` (publishedTime, modifiedTime 포함) |
| Twitter Card | ✅ | `summary_large_image` 설정 완료 |
| JSON-LD Article | ✅ | headline, datePublished, dateModified, author, publisher |
| OG 이미지 | ✅ | 가이드별 커스텀 OG 이미지 (13개 매핑) |

**✅ Twitter Card `summary_large_image` 변경 완료 (2026-04-10)**

---

## 5. 정보 페이지

### 5-1. About (`/[locale]/about/page.tsx`)

| 항목 | 상태 | 비고 |
|------|------|------|
| title/description | ✅ | 고유 |
| canonical/hreflang | ✅ | x-default 포함 |
| JSON-LD Organization | ✅ | foundingDate, contactPoint 포함 |
| E-E-A-T 신호 | ✅ | 개발자 소개, 서비스 연혁 |
| 내부 링크 | ✅ | 도구 페이지 연결 |

### 5-2. FAQ (`/[locale]/faq/page.tsx`)

| 항목 | 상태 | 비고 |
|------|------|------|
| title/description | ✅ | 고유 |
| canonical/hreflang | ✅ | x-default 포함 |
| JSON-LD FAQPage | ✅ | 4개 섹션 통합 (70+ Q&A) |
| 접근성 | ✅ | 아코디언 UI |

### 5-3. Contact (`/[locale]/contact/page.tsx`)

| 항목 | 상태 | 비고 |
|------|------|------|
| title/description | ✅ | 고유 |
| canonical/hreflang | ✅ | x-default 포함 |
| JSON-LD ContactPage | ✅ | Organization, email, contactPoint, availableLanguage |

### 5-4. Privacy (`/[locale]/privacy/page.tsx`)

| 항목 | 상태 | 비고 |
|------|------|------|
| title/description | ✅ | 고유 |
| canonical/hreflang | ✅ | x-default 포함 |
| JSON-LD | — | 법적 문서이므로 불필요 |
| robots | ✅ | index: true, follow: true |

### 5-5. Terms (`/[locale]/terms/page.tsx`)

| 항목 | 상태 | 비고 |
|------|------|------|
| title/description | ✅ | 고유 |
| canonical/hreflang | ✅ | x-default 포함 |

### 5-6. Cookie Policy (`/[locale]/cookie-policy/page.tsx`)

| 항목 | 상태 | 비고 |
|------|------|------|
| title/description | ✅ | 고유 |
| canonical/hreflang | ✅ | x-default 포함 |

---

## 6. 레이아웃 공통 (`/[locale]/layout.tsx`)

| 항목 | 상태 | 비고 |
|------|------|------|
| WebSite JSON-LD | ✅ | name, url, description, inLanguage, publisher |
| favicon 링크 | ✅ | ico + svg |
| manifest 링크 | ✅ | `/manifest.json` |
| viewport meta | ✅ | `width=device-width, initial-scale=1, viewport-fit=cover` |
| theme-color | ✅ | `#0891b2` |
| apple-mobile-web-app | ✅ | capable, status-bar-style, title |
| preconnect/dns-prefetch | ✅ | flagcdn, GTM, AdSense |
| 의미론적 마크업 | ✅ | `<main role="main">`, Header, Footer |
| 쿠키 동의 | ✅ | LazyCookieConsent 컴포넌트 |

---

## 7. 검색 노출 요소

### 7-1. OG 이미지 커버리지

| 페이지 그룹 | OG 이미지 | 크기 | 비고 |
|------------|----------|------|------|
| 홈페이지 | ✅ 커스텀 | 1200x630 | 도구 목록 + 도시 배경 |
| 도구 9개 | ✅ 커스텀 | 1200x630 | 각 도구별 아이콘, 제목, 태그 |
| 가이드 16개 | ✅ 커스텀 | 1200x630 | 가이드별 아이콘, 색상 |
| 정보 페이지 | ✅ 커스텀 | 1200x630 | About, FAQ, Privacy 등 |

### 7-2. 사이트 이름 (WebSite JSON-LD)

| 항목 | 상태 | 비고 |
|------|------|------|
| name | ✅ | "Clock-Tani 온라인 시계 & 웹도구" / "Clock-Tani Online Clock & Web Tools" |
| url | ✅ | `https://clock-tani.com/{locale}` |
| 홈페이지에 설정 | ✅ | layout.tsx에서 공통 설정 |

### 7-3. 내부 링크 구조

| 항목 | 상태 | 비고 |
|------|------|------|
| Footer 전체 도구 링크 | ✅ | ALL_TOOLS 9개 모두 |
| Footer 전체 가이드 링크 | ✅ | ALL_GUIDES 16개 모두 |
| RelatedTools (각 도구) | ✅ | 도구당 5개 관련 도구 |
| RelatedGuides (각 도구) | ✅ | 관련 가이드 최대 3개 |
| BreadcrumbList | ✅ | 모든 도구 페이지 구현 완료 |

---

## 8. 개선 작업 우선순위

### ~~P0 — 즉시 수정~~ — 모두 완료 (2026-04-10)

| # | 작업 | 파일 | 상태 |
|---|------|------|------|
| 1 | ~~홈페이지 hreflang `x-default` 추가~~ | `src/app/[locale]/page.tsx` | ✅ 완료 |
| 2 | ~~도구 8개에 BreadcrumbList JSON-LD 추가~~ | 각 도구 `page.tsx` (8개 파일) | ✅ 완료 |

### ~~P1 — 권장 개선~~ — 모두 완료 (2026-04-10)

| # | 작업 | 파일 | 난이도 |
|---|------|------|--------|
| 3 | ~~가이드 상세 Twitter Card `summary_large_image`~~ | `src/app/[locale]/guides/[slug]/page.tsx` | ✅ 완료 |
| 4 | ~~가이드 목록 CollectionPage JSON-LD 추가~~ | `src/app/[locale]/guides/page.tsx` | ✅ 완료 |

### ~~P2 — 선택 개선~~ — 모두 완료 (2026-04-10)

| # | 작업 | 파일 | 난이도 |
|---|------|------|--------|
| 5 | ~~도구 컴포넌트 이미지 alt 속성 보강~~ | 각 View 컴포넌트 | ✅ 완료 |

---

## 9. 검증 방법

### 수정 후 검증 체크리스트

- [ ] `npm run build` 빌드 성공 확인
- [ ] 각 페이지 HTML 소스에서 hreflang 태그 확인
- [ ] [Google Rich Results Test](https://search.google.com/test/rich-results) 에서 구조화된 데이터 검증
- [ ] [PageSpeed Insights](https://pagespeed.web.dev/) 에서 Core Web Vitals 확인
- [ ] Search Console에서 재크롤링 요청
- [ ] `site:clock-tani.com` 검색으로 색인 상태 확인

---

## 10. 페이지별 종합 점수

| 페이지 | 기술 SEO | 구조화 데이터 | 콘텐츠 | 페이지 경험 | 종합 |
|--------|---------|-------------|--------|-----------|------|
| 홈페이지 | ✅ | ✅ | ✅ | ✅ | **100%** |
| 시계 (Clock) | ✅ | ✅ | ✅ | ✅ | **100%** |
| 스톱워치 | ✅ | ✅ | ✅ | ✅ | **100%** |
| 타이머 | ✅ | ✅ | ✅ | ✅ | **100%** |
| 포모도로 | ✅ | ✅ | ✅ | ✅ | **100%** |
| 인터벌 | ✅ | ✅ | ✅ | ✅ | **100%** |
| 멀티 타이머 | ✅ | ✅ | ✅ | ✅ | **100%** |
| 알람 | ✅ | ✅ | ✅ | ✅ | **100%** |
| 서버 시간 | ✅ | ✅ | ✅ | ✅ | **100%** |
| D-day 카운터 | ✅ | ✅ | ✅ | ✅ | **100%** |
| 가이드 목록 | ✅ | ✅ | ✅ | ✅ | **100%** |
| 가이드 상세 (16개) | ✅ | ✅ | ✅ | ✅ | **100%** |
| About | ✅ | ✅ | ✅ | ✅ | **100%** |
| FAQ | ✅ | ✅ | ✅ | ✅ | **100%** |
| Contact | ✅ | ✅ | ✅ | ✅ | **100%** |
| Privacy | ✅ | — | ✅ | ✅ | **100%** |
| Terms | ✅ | — | ✅ | ✅ | **100%** |
| Cookie Policy | ✅ | — | ✅ | ✅ | **100%** |
