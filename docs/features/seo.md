# SEO (검색엔진 최적화)

## 목적

구글 등 검색엔진에서 각 도구 페이지가 최상단에 노출되도록 메타데이터, JSON-LD 구조화 데이터, Open Graph 이미지, 사이트맵을 체계적으로 관리한다. 한국어(ko) 우선, 영어(en) 확장 전략.

## 파일 맵

| 구분 | 파일 경로 |
|------|-----------|
| 사이트맵 | `src/app/sitemap.ts` |
| OG 이미지 템플릿 | `src/lib/og-template.tsx` |
| 각 페이지 OG 이미지 | `src/app/[locale]/{tool}/opengraph-image.tsx` |
| 각 페이지 트위터 이미지 | `src/app/[locale]/{tool}/twitter-image.tsx` |
| 메타데이터 | 각 `page.tsx`의 `generateMetadata()` |
| JSON-LD 스키마 | 각 `page.tsx`의 `<script type="application/ld+json">` |
| 미들웨어 | `src/middleware.ts` |
| 로봇 설정 | `src/app/robots.ts` (있을 경우) |

## API 엔드포인트

없음

## 주요 데이터 저장소

없음 (빌드 시 정적 생성)

## 비즈니스 규칙

### 메타데이터 규격

| 항목 | 규격 |
|------|------|
| title | `도구명 \| Clock Tani` (30~60자) |
| description | 120~155자 (핵심 키워드 포함) |
| canonical | `https://clock-tani.com/{locale}/{tool}` |
| hreflang | ko, en, x-default (= ko) |
| og:image | 1200x630px (og-template.tsx로 생성) |

### JSON-LD 스키마 유형

| 스키마 | 적용 페이지 | 용도 |
|--------|-------------|------|
| WebSite | 루트 레이아웃 | 사이트 정보 |
| WebApplication | 도구 페이지 | 앱 카테고리, 기능, 가격(무료) |
| FAQPage | 도구 페이지 | 검색 결과 FAQ 리치 스니펫 |
| HowTo | 도구 페이지 | 사용법 단계별 리치 스니펫 |
| BreadcrumbList | 시계 페이지 | 탐색 경로 |
| Article | 가이드 페이지 | 콘텐츠 기사 |

### 사이트맵 규칙

- 모든 locale × page 조합 자동 생성
- 가이드는 `ALL_GUIDES`에서 자동 포함
- priority: 홈(1.0), 도구(0.7~0.8), 가이드(0.6), FAQ(0.5), 기타(0.3~0.4)
- alternates: ko, en, x-default 링크 포함
- lastModified 날짜 수동 관리

### OG 이미지 생성

- `generateOgImage()` 공유 템플릿 (대부분 도구/가이드)
- 커스텀 ImageResponse (시계, 서버시간, 홈, about, privacy, terms)
- 크기: 1200x630px, PNG 형식
- Edge runtime 사용

## 데이터 흐름

```
빌드 시 → generateStaticParams() → 모든 locale 페이지 생성
       → generateMetadata() → title, description, og, twitter 메타 태그 생성
       → JSON-LD 스키마 생성 → <script> 태그로 삽입
       → opengraph-image.tsx → OG 이미지 라우트 생성
       → sitemap.ts → sitemap.xml 생성
크롤링 → 구글봇이 메타데이터, JSON-LD, OG 이미지, 사이트맵 수집
```

## 주의사항

- **title에 반드시 `| Clock Tani` 포함** — Ahrefs "Title too short" 경고 방지
- **description 120~155자** — Ahrefs "Meta description too short" 경고 방지
- **모든 페이지에 opengraph-image.tsx 필수** — "Open Graph tags incomplete" 방지
- 사이트맵 lastModified 날짜를 콘텐츠 변경 시 업데이트
- x-default hreflang은 항상 ko 버전으로 설정
- 구글 사이트 인증 메타 태그: `lW_RIa_R307p6URsjv8k_taWgR3nVxXrNgbQHbuGmuM`
- 네이버 사이트 인증: `8efdf91d89be6f86112f5bac1d571c04fc9f9621`

## 관련 기능

- [가이드](guides.md) — Article 스키마, 롱테일 키워드
- [국제화](i18n.md) — hreflang, locale 기반 메타데이터
- 모든 도구 문서 — 각 도구별 JSON-LD 스키마
