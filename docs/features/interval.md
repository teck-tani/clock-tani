# 인터벌 타이머 (Interval Timer)

## 목적

운동(Work)과 휴식(Rest)을 정해진 라운드만큼 자동 반복하는 인터벌 타이머. 타바타(20초 운동 + 10초 휴식 x 8라운드), HIIT(40초 + 20초 x 6라운드) 등 프리셋을 제공하며 사용자 커스텀 설정 가능.

## 파일 맵

| 구분 | 파일 경로 |
|------|-----------|
| 서버 컴포넌트 | `src/app/[locale]/interval/page.tsx` |
| 레이아웃 | `src/app/[locale]/interval/layout.tsx` |
| OG 이미지 | `src/app/[locale]/interval/opengraph-image.tsx` |
| 트위터 이미지 | `src/app/[locale]/interval/twitter-image.tsx` |
| **실제 뷰 로직** | `src/app/[locale]/timer/TimerView.tsx` (fixedMode="interval") |
| **CSS** | `src/app/[locale]/timer/timer.module.css` (공유) |
| 번역 | `messages/ko.json` → `Clock.Timer` (타이머와 공유) |

## API 엔드포인트

없음

## 주요 데이터 저장소

| 저장소 | 키 | 내용 |
|--------|-----|------|
| localStorage | `timer_state` | 인터벌 모드의 운동/휴식/라운드 설정, 상태 |

## 비즈니스 규칙

- 운동 시간: 기본 20초 (조절 가능)
- 휴식 시간: 기본 10초 (조절 가능)
- 라운드 수: 기본 8라운드 (조절 가능)
- 프리셋: 타바타 (20s/10s x 8), HIIT (40s/20s x 6), 사용자 설정
- 운동 → 휴식 전환 시 알림음/진동
- 모든 라운드 완료 시 완료 알림

## 데이터 흐름

```
인터벌 페이지 로드 → TimerView(fixedMode="interval") 렌더링
프리셋 선택 → 운동/휴식/라운드 값 설정 → localStorage 저장
시작 → 운동 카운트다운 → 알림 → 휴식 카운트다운 → 알림 → 다음 라운드
     → 현재 라운드 표시 → 모든 라운드 완료 → 완료 알림
```

## 주의사항

- **자체 뷰 컴포넌트가 없음** — `TimerView.tsx`를 `fixedMode="interval"`로 재사용
- **모바일 375px 이하**: 운동/휴식/라운드 그리드가 1칼럼으로 변경 (timer.module.css)
- 스타일 수정 시 `.intervalGrid`, `.intervalCard` 등 인터벌 전용 클래스 확인

## 관련 기능

- [타이머](timer.md) — 뷰 로직 공유 (TimerView.tsx)
- [포모도로](pomodoro.md) — 같은 TimerView 사용
- [사운드 시스템](sound-system.md) — 운동/휴식 전환 알림음
- [가이드](guides.md) — "타바타 운동 타이머 사용법" 문서 연결
