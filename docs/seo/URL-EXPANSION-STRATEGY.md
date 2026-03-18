# SEO URL 확장 전략

> **작성일:** 2026-03-18
> **상태:** 대기 중 — 기존 페이지 노출 회복 후 순차 진행

---

## 배경

- 제목/본문 수정 후 구글 노출 24시간 0으로 하락
- 1~2주 대기 후 회복 여부 확인 예정
- 회복 확인 후 URL 확장 순차 진행
- **목표:** 구글 최상단 노출 (국내 우선 → 해외 확장)

## 현재 상태

- 9개 도구 + 7개 가이드 + 보조 페이지 = 22개 고유 페이지 × 2언어 = **44 URL**
- Next.js App Router, `generateStaticParams` + `force-static` 패턴
- `guides/[slug]` 동적 라우트가 참조 패턴

---

## 확장 전략 (우선순위 순)

### 1단계: 타이머 프리셋 페이지 (+26페이지)

**타겟 키워드:** "5분 타이머", "10분 타이머", "3분 타이머" 등

| 항목 | 내용 |
|---|---|
| URL | `/ko/timer/3분`, `/en/timer/3-minutes` |
| 프리셋 | 1분, 2분, 3분, 5분, 7분, 10분, 15분, 20분, 25분, 30분, 45분, 1시간, 2시간 |
| 페이지 수 | 13개 × 2언어 = 26페이지 |

**구현 방법:**

1. `src/config/timerPresets.ts` 생성
   - `TimerPresetDef` 인터페이스: `{ id, slugs: { ko, en }, seconds, contentKey }`
   - `ALL_TIMER_PRESETS` 배열, `findPresetBySlug(slug, locale)` 헬퍼
2. `src/app/[locale]/timer/[duration]/page.tsx` 생성
   - `guides/[slug]/page.tsx` 패턴 따라 구현
   - `generateStaticParams`, `force-static`, `generateMetadata`, JSON-LD
3. `src/app/[locale]/timer/TimerView.tsx` 수정
   - `initialSeconds?: number` prop 추가
4. 번역 파일에 프리셋별 콘텐츠 추가
   - 각 프리셋별 고유 제목, 설명(200~300자), FAQ
   - 예: 3분→라면/계란, 5분→명상/스트레칭, 25분→포모도로
5. `src/app/sitemap.ts` 업데이트
6. 메인 `/timer` 페이지에 "인기 타이머" 섹션 추가 (내부 링크)

---

### 2단계: 도시별 시계 페이지 (+40~140페이지)

**타겟 키워드:** "뉴욕 시간", "런던 현재 시간", "일본 시간"

| 항목 | 내용 |
|---|---|
| URL | `/ko/clock/뉴욕`, `/en/clock/new-york` |
| 1차 | 검색량 높은 20개 도시 먼저 |
| 2차 | cities.ts 전체 70개+ 도시로 확장 |

**우선 도시 (20개):**
서울, 도쿄, 뉴욕, 런던, 파리, 로스앤젤레스, 시드니, 싱가포르, 홍콩, 베이징, 방콕, 두바이, 모스크바, 베를린, 토론토, 시카고, 하노이, 오사카, 호치민, 자카르타

**구현 방법:**

1. `src/app/[locale]/clock/cities.ts` 수정 — 각 도시에 `slug`/`slugKo` 필드 추가
2. `src/app/[locale]/clock/[city]/page.tsx` 생성 — 도시별 고유 메타데이터
3. `src/app/[locale]/clock/[city]/CityClockView.tsx` 생성 — 해당 도시 시계 + 서울 시차
4. 번역: 템플릿 기반 (`"{cityName} 현재 시간 - {country} {timezone}"`)
5. 사이트맵, OG 이미지 업데이트
6. 메인 `/clock` 페이지에 도시 목록 섹션 추가

---

### 3단계: D-Day 이벤트 페이지 (+30~40페이지)

**타겟 키워드:** "수능 디데이", "크리스마스 며칠 남았나"

| 항목 | 내용 |
|---|---|
| URL | `/ko/dday-counter/수능`, `/en/dday-counter/christmas` |
| 이벤트 수 | 15~20개 × 2언어 = 30~40페이지 |

**이벤트 목록:**
- 한국: 수능, 크리스마스, 설날, 추석, 어린이날, 발렌타인데이, 화이트데이, 빼빼로데이, 어버이날, 한글날, 개천절, 졸업식
- 글로벌: Christmas, New Year, Valentine's Day, Halloween, Thanksgiving, Easter

**구현 방법:**

1. `src/config/ddayEvents.ts` 생성 — 매년 반복 이벤트는 자동 날짜 계산
2. `src/app/[locale]/dday-counter/[event]/page.tsx` 생성
3. 각 이벤트별 300자+ 고유 콘텐츠 (의미, 준비 방법 등)
4. 사이트맵 업데이트

---

### 4단계: 가이드 추가 (+26페이지)

기존 7개 → 20개로 확장. 기존 인프라 그대로 활용.

**추가 가이드 후보:**
- 타이머로 집중력 높이는 5가지 방법
- 세계 시차 계산 완전 가이드
- 효율적인 알람 설정 습관
- 인터벌 트레이닝 프로그램 모음
- 디데이 활용법: 목표 관리와 동기부여
- 포모도로 변형 기법: 52/17, 90/20
- 온라인 시계 vs 스마트폰 시계 비교

---

## 얇은 콘텐츠(Thin Content) 방지

1. 페이지당 **최소 300자 이상 고유 SSR 콘텐츠**
2. 각 페이지가 **실제로 다른 기능** 제공
3. 페이지별 **고유 meta title/description**
4. **내부 링크 메시** — 허브앤스포크 구조로 토픽 클러스터 형성
5. **점진적 배포** — 한 카테고리씩 배포 후 GSC에 제출

---

## 배포 타임라인

| 시기 | 할 일 |
|---|---|
| 지금~2주 | 대기. 코드 준비만 |
| 2~3주 후 | 노출 회복 확인 → 타이머 프리셋 26개 배포 |
| 4~5주 후 | 도시별 시계 20개 추가 |
| 6주 이후 | D-Day, 나머지 도시, 가이드 순차 추가 |

---

## URL 수 예상

| 전략 | 신규 페이지 | 누적 |
|---|---|---|
| 현재 | — | 44 |
| + 타이머 프리셋 | +26 | 70 |
| + 도시 시계 (20개) | +40 | 110 |
| + D-Day 이벤트 | +30 | 140 |
| + 도시 확장 (70개) | +100 | 240 |
| + 가이드 추가 | +26 | **~270** |

---

## 수정할 주요 파일

| 파일 | 변경 내용 |
|---|---|
| `src/config/timerPresets.ts` | 신규 — 프리셋 정의 |
| `src/config/ddayEvents.ts` | 신규 — 이벤트 정의 |
| `src/app/[locale]/timer/[duration]/page.tsx` | 신규 — 프리셋 페이지 |
| `src/app/[locale]/clock/[city]/page.tsx` | 신규 — 도시 시계 페이지 |
| `src/app/[locale]/clock/[city]/CityClockView.tsx` | 신규 — 도시 시계 클라이언트 |
| `src/app/[locale]/dday-counter/[event]/page.tsx` | 신규 — 이벤트 페이지 |
| `src/app/[locale]/timer/TimerView.tsx` | 수정 — `initialSeconds` prop 추가 |
| `src/app/[locale]/clock/cities.ts` | 수정 — slug 필드 추가 |
| `src/app/sitemap.ts` | 수정 — 신규 카테고리 추가 |
| `messages/ko.json` | 수정 — 번역 추가 |
| `messages/en.json` | 수정 — 번역 추가 |

## 참조 패턴

- `src/app/[locale]/guides/[slug]/page.tsx` — 동적 라우트 구현 패턴
- `src/config/guides.ts` — 콘텐츠 정의 패턴

## 검증 방법

1. `npm run build` → 모든 정적 페이지 생성 확인
2. `/sitemap.xml` 접근 → 신규 URL 포함 확인
3. 각 프리셋/도시/이벤트 페이지 접근 → 고유 콘텐츠 렌더링 확인
4. GSC URL 검사 도구로 색인 가능 여부 확인
