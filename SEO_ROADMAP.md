# Clock-Tani 구글 #1 SEO 실행 로드맵

> 목표: 구글 검색 "온라인 시계", "온라인 타이머" 등 핵심 키워드 1위 달성

---

## 🔧 1단계: 초기 작업 (0~4주) — 기술 SEO 완성

### A. 구글 서치콘솔 심화 세팅

#### 1️⃣ 모든 페이지 수동 색인 요청
- [ ] 총 20개 URL 모두 색인 요청 (ko/en x 10페이지)

**수동 색인 요청할 URL 목록:**
```
한국어 (ko):
- [ ] https://clock-tani.com/ko/clock
- [ ] https://clock-tani.com/ko/stopwatch
- [ ] https://clock-tani.com/ko/timer
- [ ] https://clock-tani.com/ko/pomodoro
- [ ] https://clock-tani.com/ko/interval
- [ ] https://clock-tani.com/ko/multi-timer
- [ ] https://clock-tani.com/ko/alarm
- [ ] https://clock-tani.com/ko/server-time
- [ ] https://clock-tani.com/ko/dday-counter
- [ ] https://clock-tani.com/ko

영어 (en):
- [ ] https://clock-tani.com/en/clock
- [ ] https://clock-tani.com/en/stopwatch
- [ ] https://clock-tani.com/en/timer
- [ ] https://clock-tani.com/en/pomodoro
- [ ] https://clock-tani.com/en/interval
- [ ] https://clock-tani.com/en/multi-timer
- [ ] https://clock-tani.com/en/alarm
- [ ] https://clock-tani.com/en/server-time
- [ ] https://clock-tani.com/en/dday-counter
- [ ] https://clock-tani.com/en
```

**작업 방법:**
1. Google Search Console 접속 → https://search.google.com/search-console
2. clock-tani.com 프로퍼티 선택
3. 좌측 메뉴 → "URL 검사"
4. 위 URL 하나씩 복사 붙여넣기
5. "색인 생성 요청" 클릭

#### 2️⃣ 사이트맵 제출 확인
- [ ] 사이트맵 이미 제출되었는지 확인
- [ ] 미제출 시: https://clock-tani.com/sitemap.xml 제출

**작업 방법:**
1. Google Search Console → 좌측 메뉴 "사이트맵"
2. "사이트맵 URL 입력"
3. `https://clock-tani.com/sitemap.xml` 입력 후 제출

#### 3️⃣ Core Web Vitals 보고서 확인
- [ ] 모바일 Core Web Vitals 점수 확인
- [ ] 데스크톱 Core Web Vitals 점수 확인
- [ ] LCP, CLS, INP 오류 항목 확인

**작업 방법:**
1. Google Search Console → 좌측 메뉴 "Core Web Vitals"
2. 각 메트릭 확인
3. 개선이 필요하면 메모

#### 4️⃣ 모바일 사용성 오류 확인
- [ ] 모바일 사용성 오류 0개 목표
- [ ] 오류가 있으면 항목 확인

**작업 방법:**
1. Google Search Console → 좌측 메뉴 "모바일 사용성"
2. 오류 목록 확인 및 메모

---

### B. 기술 SEO 보완 확인

#### 1️⃣ sitemap.ts 수정 상태 확인
- [x] ✅ 완료: `lastModified`를 `new Date()`에서 고정 날짜로 변경
- [x] ✅ 각 페이지별 실제 수정일로 설정

**파일:** `src/app/sitemap.ts`

#### 2️⃣ robots.txt 점검
- [ ] `https://clock-tani.com/robots.txt` 접속 후 확인
- [ ] `Sitemap: https://clock-tani.com/sitemap.xml` 명시 확인
- [ ] `User-agent: *` 아래 불필요한 차단 없는지 확인
- [ ] `/api`, `/_next` 등 내부 경로만 차단되어 있는지 확인

#### 3️⃣ 페이지별 canonical 태그 점검
- [ ] `/clock` 페이지 검사
- [ ] `/stopwatch` 페이지 검사
- [ ] `/timer` 페이지 검사
- [ ] `/pomodoro` 페이지 검사
- [ ] `/interval` 페이지 검사
- [ ] `/multi-timer` 페이지 검사
- [ ] `/alarm` 페이지 검사
- [ ] `/server-time` 페이지 검사
- [ ] `/dday-counter` 페이지 검사

**확인 방법:**
1. 각 페이지 우클릭 → "페이지 소스 보기"
2. `<link rel="canonical"` 검색
3. URL이 절대 경로 `https://`로 시작하는지 확인
4. `x-default` hreflang이 `/ko/clock` 형식인지 확인

#### 4️⃣ OpenGraph 이미지 존재 확인
- [ ] `/public/og/clock.png` 존재 확인 (1200x630)
- [ ] `/public/og/stopwatch.png` 확인
- [ ] `/public/og/timer.png` 확인
- [ ] `/public/og/pomodoro.png` 확인
- [ ] `/public/og/interval.png` 확인
- [ ] `/public/og/multi-timer.png` 확인
- [ ] `/public/og/alarm.png` 확인
- [ ] `/public/og/server-time.png` 확인
- [ ] `/public/og/dday-counter.png` 확인

**확인 방법:**
- `public` 폴더에서 직접 파일 확인
- 또는 브라우저 개발자도구 Network 탭에서 이미지 로드 확인

#### 5️⃣ 루트 리다이렉션 확인
- [ ] `https://clock-tani.com` 접속 → `/ko/clock` 자동 리다이렉트 확인
- [ ] `https://clock-tani.com/ko` 접속 → `/ko/clock` 자동 리다이렉트 확인

---

### C. 핵심 키워드 타겟 확정

각 페이지별 주요 키워드 정의:

| 페이지 | Primary KW | Secondary KW |
|--------|-----------|--------------|
| /clock | 온라인 시계 | 세계시계, 디지털 시계, 현재시간 |
| /stopwatch | 온라인 스톱워치 | 스톱워치, 초시계, 랩타임 |
| /timer | 온라인 타이머 | 카운트다운, 요리 타이머 |
| /pomodoro | 뽀모도로 타이머 | 포모도로, 집중 타이머 |
| /alarm | 온라인 알람시계 | 알람, 브라우저 알람 |
| /server-time | 티켓팅 시계 | 서버시간, 정확한 시간 |
| /dday-counter | D-day 카운터 | 디데이, 날짜 계산 |
| /interval | 인터벌 타이머 | HIIT 타이머, 타바타 |

---

### D. 메타 태그 품질 점검

각 페이지의 title과 description 형식 확인:

#### Title 태그 (60자 이내, Primary KW 앞에 배치)
- [ ] /clock: "온라인 시계 - 세계시계 & 디지털 시계 | Clock-Tani"
- [ ] /stopwatch: "온라인 스톱워치 - 정밀 시간 측정 | Clock-Tani"
- [ ] /timer: "온라인 타이머 - 요리/공부/운동 타이머 | Clock-Tani"
- [ ] /pomodoro: "뽀모도로 타이머 - 25분 집중 타이머 | Clock-Tani"
- [ ] /alarm: "온라인 알람시계 - 브라우저 알람 | Clock-Tani"
- [ ] /server-time: "티켓팅 시계 - 서버시간 | Clock-Tani"
- [ ] /dday-counter: "D-day 카운터 - 디데이 카운트다운 | Clock-Tani"
- [ ] /interval: "인터벌 타이머 - 타바타 HIIT | Clock-Tani"

#### Description 태그 (155자 이내, 키워드 + CTA)
- [ ] 각 페이지 description이 unique한지 확인
- [ ] Primary KW가 포함되어 있는지 확인
- [ ] "지금 사용해보세요", "무료로 사용" 등 CTA 포함 확인

**확인 방법:**
1. 각 페이지 우클릭 → "페이지 소스 보기"
2. `<meta name="description"` 검색
3. content 값 확인

---

## 📊 2단계: 중기 작업 (1~3개월) — 콘텐츠 & 권위 강화

### A. 내부 링크 구조 강화

#### 1️⃣ 각 페이지 하단 "관련 도구" 섹션 추가
- [ ] /clock → /timer, /pomodoro, /dday-counter 링크 추가
- [ ] /stopwatch → /timer, /pomodoro 링크 추가
- [ ] /timer → /pomodoro, /interval, /multi-timer 링크 추가
- [ ] /pomodoro → /timer, /multi-timer 링크 추가
- [ ] /interval → /multi-timer, /timer 링크 추가
- [ ] /multi-timer → /timer, /pomodoro 링크 추가
- [ ] /alarm → /timer, /server-time 링크 추가
- [ ] /server-time → /clock, /alarm 링크 추가
- [ ] /dday-counter → /alarm, /clock 링크 추가

#### 2️⃣ 홈페이지 (/ko) 강화
- [ ] 홈페이지에 모든 도구 소개 섹션 추가
- [ ] 각 도구로의 내부 링크 추가 (9개)
- [ ] Feature 강조 섹션 추가

#### 3️⃣ Footer 링크 확인
- [ ] Footer에 모든 도구 링크 포함되어 있는지 확인
- [ ] Header 내비게이션에 주요 도구 링크 확인

---

### B. 블로그/가이드 콘텐츠 생성

새 페이지 또는 블로그 섹션 생성:

#### 블로그 포스트 5개 (각 2000자 이상)

1️⃣ **뽀모도로 기법 완전 가이드**
   - [ ] 작성: `/ko/blog/pomodoro-technique-guide`
   - [ ] 키워드: "뽀모도로 기법", "포모도로", "집중력"
   - [ ] 내부 링크: /pomodoro (3회 이상)
   - [ ] 메타 설명: 포모도로 기법의 과학적 배경, 실행 방법, 효과

2️⃣ **티켓팅 성공 비결 - 서버시간 활용법**
   - [ ] 작성: `/ko/blog/ticketing-tips`
   - [ ] 키워드: "티켓팅", "서버시간", "정확한 시간"
   - [ ] 내부 링크: /server-time (3회 이상)
   - [ ] 메타 설명: 콘서트/뮤지컬 티켓팅 성공 팁

3️⃣ **HIIT 타바타 완전 가이드**
   - [ ] 작성: `/ko/blog/hiit-tabata-guide`
   - [ ] 키워드: "타바타", "HIIT", "고강도 인터벌"
   - [ ] 내부 링크: /interval (3회 이상)
   - [ ] 메타 설명: 타바타 운동법, HIIT와의 차이, 효과

4️⃣ **D-Day로 시험 준비하기**
   - [ ] 작성: `/ko/blog/dday-study-tips`
   - [ ] 키워드: "디데이", "D-day", "수능 준비"
   - [ ] 내부 링크: /dday-counter (3회 이상)
   - [ ] 메타 설명: 시험 준비 시간관리, 목표 설정

5️⃣ **세계 시간대 완전 정복**
   - [ ] 작성: `/ko/blog/world-timezones`
   - [ ] 키워드: "세계시계", "시간대", "GMT"
   - [ ] 내부 링크: /clock (3회 이상)
   - [ ] 메타 설명: 세계 주요 도시 시간대, 계산법

**각 블로그 포스트 구성:**
- 제목 (H1)
- 소개 (150자)
- 본문 섹션 5개 (각 400자)
- 결론 (200자)
- 관련 도구 링크

---

### C. 소셜 시그널 활성화

#### 1️⃣ 트위터/X 활성화
- [ ] 계정: @teck_tani
- [ ] 주 1회 이상 포스팅
- [ ] 콘텐츠 예시:
  - "뽀모도로 타이머로 25분 집중! 집중력 2배 높이는 방법 👉 [링크]"
  - "티켓팅 성공 비결? 정확한 서버시간! ⏰ [링크]"
  - "HIIT 타바타 운동 4분 완성 💪 [링크]"

#### 2️⃣ Google Business Profile
- [ ] 구글 비즈니스 프로필 등록 (웹 서비스)
- [ ] 회사 정보 입력
- [ ] 주요 도구 소개

#### 3️⃣ 카카오 오픈채널 (선택)
- [ ] 오픈채널 개설
- [ ] 주 2회 팁/뉴스 공유

---

### D. JSON-LD Schema 전 페이지 완성 확인

✅ **이미 구현된 부분:**
- [ ] FAQPage schema (모든 페이지)
- [ ] HowTo schema (모든 페이지)
- [ ] WebApplication schema (모든 페이지)
- [ ] BreadcrumbList schema (/clock에 있음, 필요시 확산)

**확인 사항:**
- [ ] 각 페이지 Rich Results Test에서 오류 없는지 확인

**Rich Results Test:** https://search.google.com/test/rich-results

---

## 🔗 3단계: 장기 작업 (3~12개월) — 백링크 & 도메인 권위

### A. 백링크 확보 전략 (가장 중요)

#### 1️⃣ 커뮤니티 자연스러운 언급
- [ ] 클리앙에서 "온라인 시계" 관련 글에 댓글로 소개
- [ ] 루리웹에서 "도구" 관련 글 작성 + clock-tani 링크
- [ ] 오르비(수험생 커뮤니티)에서 "뽀모도로", "D-Day" 추천
- [ ] 블라인드(직장인)에서 "생산성 도구" 소개
- [ ] 보배드림에서 관련 스레드 참여

#### 2️⃣ 네이버 블로그 백링크
- [ ] 자신의 네이버 블로그 개설
- [ ] 각 도구별 상세 리뷰 포스팅 (9개)
- [ ] 각 블로그 포스트에 clock-tani 링크 삽입
- [ ] 파워블로거 협업 요청 (생산성, 공부법 블로거)

#### 3️⃣ 티스토리/브런치 게스트 포스팅
- [ ] 생산성 관련 티스토리 블로거에 게스트 포스트 제안
- [ ] 브런치에 "온라인 도구 활용" 시리즈 연재 (월 2회)
- [ ] 각 게시물에 clock-tani 링크

#### 4️⃣ ProductHunt & 해커뉴스
- [ ] ProductHunt에 clock-tani 제품 등록
- [ ] Hacker News "Show HN" 포스팅 (영어 버전)

#### 5️⃣ 유튜버 & 크리에이터 PR
- [ ] 스터디 with me 채널 PR
- [ ] 타임랩스 채널 PR
- [ ] 체대 유튜버 PR (HIIT 관련)
- [ ] 수능 준비 유튜버 PR (D-Day 관련)

---

### B. 콘텐츠 마케팅 확장

#### 1️⃣ 유튜브 채널 (또는 쇼츠)
- [ ] 채널 개설 또는 쇼츠 시작
- [ ] 콘텐츠 예시:
  - "30초로 배우는 뽀모도로 타이머"
  - "티켓팅 성공 비결 - 서버시계"
  - "4분 타바타 운동 완성"
  - "D-Day로 수능 준비하기"
- [ ] Description에 clock-tani.com 링크 추가

#### 2️⃣ 인스타그램/틱톡
- [ ] 생산성 팁 + clock-tani 활용 영상
- [ ] 수험생/직장인 타겟 콘텐츠
- [ ] Bio에 clock-tani.com 링크

---

### C. 지속적인 기술 SEO 유지

#### 1️⃣ Core Web Vitals 모니터링
- [ ] 매월 PageSpeed Insights 체크
- [ ] LCP < 2.5초 유지
- [ ] CLS < 0.1 유지
- [ ] INP < 200ms 유지

#### 2️⃣ 정기 콘텐츠 업데이트
- [ ] 분기별 1회: 각 페이지 콘텐츠 최신화
- [ ] 블로그 포스트 연 2회 업데이트
- [ ] sitemap lastModified 실제 수정일로 갱신

#### 3️⃣ Google Search Console 정기 점검
- [ ] 주 1회: Performance 리포트 확인
  - 클릭수, 노출수, CTR, 평균 순위
- [ ] 색인 커버리지 오류 즉시 수정
- [ ] CTR 낮은 페이지 → 메타 description 개선
- [ ] 새 에러 항목 즉시 조치

#### 4️⃣ 경쟁사 분석
- [ ] 월 1회: Google "온라인 시계" 1위 사이트 분석
- [ ] ahrefs 무료 도구로 백링크 수 비교
- [ ] 성공한 키워드 전략 참고

---

### D. E-E-A-T 강화

#### 1️⃣ /about 페이지 강화
- [ ] 개발자 소개 (경력, 기술 스택)
- [ ] 도구 개발 배경 및 철학
- [ ] 업데이트 이력 (분기별)
- [ ] 사용자 리뷰/피드백

#### 2️⃣ Privacy Policy & Terms 개선
- [ ] 명확한 데이터 정책 작성
- [ ] 사용 약관 상세화
- [ ] 연락처 정보 명시

#### 3️⃣ 신뢰도 신호
- [ ] HTTPS 확인 (✅ Vercel 기본)
- [ ] Contact 페이지 또는 피드백 폼 활성화
- [ ] 소셜 미디어 링크 추가

---

## ✅ 검증 방법

### 주간 모니터링
- [ ] **구글 서치콘솔** — Performance 리포트
  - URL: https://search.google.com/search-console
  - 확인 항목: 클릭수, 노출수, CTR, 평균 순위
  - 기록: 스프레드시트에 정리

- [ ] **시크릿 모드 검색** — 타겟 키워드로 순위 확인
  - 검색: "온라인 시계", "온라인 타이머", "뽀모도로 타이머" 등
  - 기록: 1위부터 10위까지 순위 메모

### 월간 모니터링
- [ ] **PageSpeed Insights** — https://pagespeed.web.dev/
  - 모바일 + 데스크톱 점수 확인
  - LCP, CLS, INP 메트릭 기록

- [ ] **Rich Results Test** — https://search.google.com/test/rich-results
  - 각 페이지 스키마 오류 확인
  - 오류 있으면 즉시 수정

- [ ] **경쟁사 분석**
  - 구글 1위 사이트 백링크 수 확인
  - 콘텐츠 길이 비교

---

## 📅 타임라인

| 시점 | 목표 | 작업 |
|------|------|------|
| 이번 주 | 기술 SEO 완성 | A단계 모든 항목 완료 |
| 1개월 | 20개 URL 색인 | 서치콘솔 색인 요청, 모니터링 |
| 2개월 | 첫 키워드 순위권 진입 | 노출수 증가 시작 |
| 3개월 | 블로그 5개 완성 | 콘텐츠 기반 트래픽 증가 |
| 6개월 | 주요 키워드 순위 향상 | 백링크 축적, 도메인 권위 상승 |
| 12개월 | 주요 키워드 1위 | 1위 달성 목표 |

---

## 📝 진행 상황 기록

**마지막 업데이트:** 2026-03-06

### 완료된 항목
- [x] sitemap.ts lastModified 고정 날짜로 수정
- [x] 모든 페이지 SEO 콘텐츠 확인 (이미 구현됨)
- [x] JSON-LD schemas 확인 (이미 구현됨)

### 다음 할 일
- [ ] A단계: 구글 서치콘솔 20개 URL 색인 요청
- [ ] A단계: robots.txt, canonical 태그 점검
- [ ] A단계: Core Web Vitals 확인

### 주요 진행 이슈
(완료 후 기록)

---

**🎯 최종 목표: 3개월 내 주요 키워드 순위권(10위 이내) 진입 → 12개월 내 1위 달성**
