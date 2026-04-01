# D-Day 카운터 (D-Day Counter)

## 목적

시험, 기념일, 프로젝트 마감 등 중요 날짜까지 남은 일수(또는 경과 일수)를 계산하고 관리하는 기능. 한국 전통 명절을 위한 음력 날짜 변환도 지원한다.

## 파일 맵

| 구분 | 파일 경로 |
|------|-----------|
| 서버 컴포넌트 | `src/app/[locale]/dday-counter/page.tsx` |
| 클라이언트 뷰 | `src/app/[locale]/dday-counter/DdayCounterClient.tsx` |
| 음력 변환 | `src/app/[locale]/dday-counter/lunar.ts` |
| CSS 모듈 | `src/app/[locale]/dday-counter/dday.module.css` |
| OG 이미지 | `src/app/[locale]/dday-counter/opengraph-image.tsx` |
| 트위터 이미지 | `src/app/[locale]/dday-counter/twitter-image.tsx` |
| 번역 | `messages/ko.json` → `Clock.DdayCounter` |

## API 엔드포인트

없음

## 주요 데이터 저장소

| 저장소 | 키 | 내용 |
|--------|-----|------|
| localStorage | `dday_events_v2` | 이벤트 객체 배열 (date, label, color) |

## 비즈니스 규칙

- 복수 이벤트 등록 가능
- D-day 계산: 미래 날짜 → "D-N" (남은 일수), 과거 날짜 → "D+N" (경과 일수)
- 이벤트별 라벨, 색상 커스터마이징
- 음력 ↔ 양력 변환: `korean-lunar-calendar` 패키지 사용
- 저장 키가 `dday_events_v2` — v1에서 마이그레이션된 형태

## 데이터 흐름

```
이벤트 추가 → 날짜/라벨/색상 입력 → dday_events_v2에 추가 → localStorage 저장
페이지 로드 → localStorage에서 이벤트 복원 → 각 이벤트별 D-Day 계산 → 표시
음력 날짜 선택 → lunar.ts에서 양력 변환 → 양력 기준으로 D-Day 계산
```

## 주의사항

- `korean-lunar-calendar` 패키지 의존 — `next.config.ts`에서 `optimizePackageImports` 설정됨
- localStorage 키가 `_v2` — 이전 버전 데이터와 호환성 주의
- 음력 변환은 한국 사용자 특화 기능 — 영어 페이지에서도 동작하지만 UX 맥락이 다름

## 관련 기능

- [시계](clock.md) — 현재 날짜/시간 참조
- [가이드](guides.md) — "D-Day 카운트다운 활용법" 문서 연결
