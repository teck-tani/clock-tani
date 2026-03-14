# Clock Tani 플랫폼별 SEO 포스팅 명령 프롬프트

> 이 프롬프트를 복사해서 Claude Code에 붙여넣으면, 지정한 플랫폼에 9개 메뉴 포스팅을 자동으로 진행합니다.
> `{{PLATFORM_URL}}`과 `{{PLATFORM_NAME}}`만 교체하면 됩니다.

---

## 사용법

1. 아래 프롬프트에서 `{{PLATFORM_URL}}`과 `{{PLATFORM_NAME}}`을 오늘 포스팅할 플랫폼으로 교체
2. Claude Code에 붙여넣기
3. 로그인이 필요하면 직접 로그인 후 진행 지시

---

## 프롬프트 본문

```
지금부터 {{PLATFORM_NAME}}({{PLATFORM_URL}})에 Clock Tani의 9개 메뉴를 하나씩 포스팅해줘.

## 목표
- 구글 SEO 백링크 확보 (국내 1위 → 글로벌 영향력 확장)
- 각 포스팅에 clock-tani.com 링크 삽입 (Dofollow 백링크)
- 9개 메뉴 전체 포스팅 + 메뉴 간 크로스 링크

## 포스팅할 9개 메뉴

| # | 메뉴 | 경로 | 한글 키워드 | 영문 키워드 |
|---|------|------|------------|------------|
| 1 | 온라인 시계 | /ko/clock | 온라인 시계, 현재 시간 | online clock, current time |
| 2 | 스톱워치 | /ko/stopwatch | 온라인 스톱워치, 랩타임 | online stopwatch, lap timer |
| 3 | 타이머 | /ko/timer | 온라인 타이머, 카운트다운 | online timer, countdown |
| 4 | 포모도로 타이머 | /ko/pomodoro | 포모도로, 집중 타이머 | pomodoro timer, focus timer |
| 5 | 인터벌 타이머 | /ko/interval | 인터벌 타이머, HIIT, 타바타 | interval timer, HIIT, tabata |
| 6 | 멀티 타이머 | /ko/multi-timer | 멀티 타이머, 동시 타이머 | multi timer, simultaneous |
| 7 | 알람 시계 | /ko/alarm | 온라인 알람, 웹 알람 | online alarm, web alarm |
| 8 | 서버시간 | /ko/server-time | 서버시간, 티켓팅 시간 | server time, exact time |
| 9 | D-Day 카운터 | /ko/dday-counter | 디데이, 카운트다운 | d-day counter, countdown |

## 사이트 정보
- 사이트: https://clock-tani.com (배포: https://clock-tani.vercel.app)
- 기술스택: Next.js 16 + TypeScript + Tailwind CSS 4 + PWA
- 특징: 설치 없음, 무료, 브라우저만 있으면 사용, 다크모드, 모바일 최적화

## 플랫폼별 글쓰기 가이드

각 플랫폼의 특성에 맞게 톤과 구성을 조절해줘:

### 블로그/콘텐츠 플랫폼
- **워드프레스(wordpress.com)**: SEO에 최적화된 구조적 글. H2/H3 소제목 적극 활용, 메타 설명 작성, 태그/카테고리 설정. 글 길이 1000-1500자. Gutenberg 블록 에디터 사용.
- **티스토리(tistory.com)**: 구글 검색 유입 중심. HTML 편집 가능하므로 구조화된 마크다운. 키워드 밀도 높게. 대표 이미지 설정 필수.
- **브런치(brunch.co.kr)**: 에세이/칼럼 톤. "개발자의 시간 관리" 같은 스토리텔링. 도구 소개보다 경험담 중심. 고품질 글만 승인되므로 정성들여 작성.
- **벨로그(velog.io)**: 개발자 대상 기술 블로그 톤. 마크다운 기반. 기술적 특징(PWA, Next.js, Web Audio API 등) 강조. 코드 블록 활용 가능.
- **미디엄(medium.com)**: 글로벌 독자 대상이므로 영어로 작성. 스토리텔링 + 실용적 가이드 혼합. "5 Free Online Tools for..." 같은 리스티클 형식도 좋음.
- **Blogger(blogger.com)**: 구글 소유 플랫폼. SEO 키워드 중심. 검색 의도에 맞는 실용적 가이드. 퍼머링크 커스텀 설정.

### 개발자/기술 플랫폼
- **DEV.to(dev.to)**: 영어 기술 블로그. "Building a PWA Clock with Next.js" 같은 기술 포스팅. 코드 스니펫 포함. 태그: #nextjs #pwa #webdev #typescript
- **Hashnode(hashnode.com)**: 영어 기술 블로그. DEV.to와 유사하지만 개인 도메인 연결 가능. 시리즈물로 구성.

### 커뮤니티
- **Reddit**: 영어. 자기 홍보가 아닌 "유용한 도구 공유" 톤. r/webdev, r/productivity, r/StudyTips 등 서브레딧별 맞춤. 짧고 임팩트 있게.
- **클리앙/디시/뽐뿌**: 한국 커뮤니티 톤. "만들어 본 웹앱인데 쓸만합니다" 느낌. 과한 홍보 금지. 솔직하고 캐주얼하게.
- **오르비**: 수험생 대상. "수능 D-100 꿀팁" 같은 실용 정보 + 도구 소개.

### 디렉토리/프로필
- **ProductHunt**: 영어. 제품 런칭 형식. 한 줄 태그라인 + 주요 기능 3-5개 + 스크린샷.
- **AlternativeTo**: "Alternative to time.is / online-stopwatch.com" 등록 형식.

## 각 포스팅 필수 포함 요소
1. **제목**: 메인 키워드 포함 (플랫폼에 맞는 톤)
2. **도입부**: 문제 제기 또는 사용 시나리오 → 해결책으로 Clock Tani 소개
3. **주요 기능**: 3-5개 핵심 기능 소제목으로 설명
4. **활용 사례**: 표 또는 리스트로 구체적 상황 제시
5. **사이트 링크**: https://clock-tani.com/ko/{tool-path} (최소 2회 삽입)
6. **크로스 링크**: 다른 8개 메뉴 링크 리스트 (글 하단)
7. **태그/키워드**: 플랫폼이 태그를 지원하면 관련 태그 5개 내외

## 작업 방식
1. Playwright 브라우저로 {{PLATFORM_URL}} 접속
2. 로그인 상태 확인 (미로그인이면 알려줘)
3. 1번 메뉴부터 순서대로 포스팅
4. 각 포스팅 완료 후 URL 기록
5. 9개 완료 후 결과 요약표 출력
6. 완료된 플랫폼은 BACKLINK-STRATEGY.md에 ✅ 표시 업데이트

## 주의사항
- 스팸성 글 금지. 자연스럽고 유용한 콘텐츠로 작성
- 앵커 텍스트 다양하게: "Clock Tani", "온라인 시계", "무료 타이머" 등 섞어서
- 각 글마다 살짝 다른 구성과 표현 사용 (중복 콘텐츠 방지)
- 플랫폼 규칙 준수 (셀프 프로모션 제한 등)
- Cloudflare Turnstile 등 봇 방지가 있으면 대기 후 진행
```

---

## 빠른 복사용 예시

### 워드프레스
```
지금부터 워드프레스(https://wordpress.com)에 Clock Tani의 9개 메뉴를 하나씩 포스팅해줘.
(위 프롬프트 전체 붙여넣기)
```

### 티스토리
```
지금부터 티스토리(https://www.tistory.com)에 Clock Tani의 9개 메뉴를 하나씩 포스팅해줘.
(위 프롬프트 전체 붙여넣기)
```

### DEV.to (영어)
```
지금부터 DEV.to(https://dev.to)에 Clock Tani의 9개 메뉴를 하나씩 포스팅해줘.
(위 프롬프트 전체 붙여넣기)
```

---

## 포스팅 진행 현황

| 플랫폼 | 상태 | 완료일 | 비고 |
|--------|------|--------|------|
| 네이버 블로그 | ✅ 완료 | 2026-03-12 | 9개 메뉴 전체 |
| 벨로그 | ✅ 완료 | 2026-03-13 | 9개 메뉴 전체 |
| 워드프레스 | ⬜ 예정 | — | |
| 티스토리 | ⬜ 예정 | — | |
| 브런치 | ⬜ 예정 | — | |
| 미디엄 | ⬜ 예정 | — | |
| Blogger | ⬜ 예정 | — | |
| DEV.to | ⬜ 예정 | — | |
| Hashnode | ⬜ 예정 | — | |
