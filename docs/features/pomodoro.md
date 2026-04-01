# 포모도로 (Pomodoro)

## 목적

프란체스코 시릴로가 개발한 포모도로 기법을 온라인으로 구현. 25분 집중 → 5분 휴식 → (4세션 후) 15분 긴 휴식 사이클을 반복하며 생산성을 높인다. 세션 통계 추적 기능 제공.

## 파일 맵

| 구분 | 파일 경로 |
|------|-----------|
| 서버 컴포넌트 | `src/app/[locale]/pomodoro/page.tsx` |
| 레이아웃 | `src/app/[locale]/pomodoro/layout.tsx` |
| OG 이미지 | `src/app/[locale]/pomodoro/opengraph-image.tsx` |
| 트위터 이미지 | `src/app/[locale]/pomodoro/twitter-image.tsx` |
| **실제 뷰 로직** | `src/app/[locale]/timer/TimerView.tsx` (fixedMode="pomodoro") |
| **CSS** | `src/app/[locale]/timer/timer.module.css` (공유) |
| **통계 컴포넌트** | `src/app/[locale]/timer/PomodoroStats.tsx` |
| 번역 | `messages/ko.json` → `Clock.Timer` (타이머와 공유) |

## API 엔드포인트

없음

## 주요 데이터 저장소

| 저장소 | 키 | 내용 |
|--------|-----|------|
| localStorage | `timer_state` | 포모도로 모드의 집중/휴식/긴휴식 시간, 상태 |
| localStorage | `pomodoro_stats` | 세션 이력 (완료 시각, 집중 시간) |

## 비즈니스 규칙

- 집중 시간: 기본 25분 (사용자 조절 가능)
- 휴식 시간: 기본 5분 (사용자 조절 가능)
- 긴 휴식: 기본 15분 (4세션 완료 후)
- "자동으로 다음 세션 시작" 토글 지원
- 세션 카운터 표시
- 사용자 설정값 localStorage 저장 (새로고침 시 유지)

## 데이터 흐름

```
포모도로 페이지 로드 → TimerView(fixedMode="pomodoro") 렌더링
                    → localStorage에서 마지막 설정값 복원
집중 완료 → 알림음 → pomodoro_stats에 기록 → 휴식 페이즈 전환 (자동/수동)
4세션 후 → 긴 휴식 자동 전환
```

## 주의사항

- **자체 뷰 컴포넌트가 없음** — `TimerView.tsx`를 `fixedMode="pomodoro"`로 재사용
- **스타일 수정 시 `timer.module.css` 수정** → 타이머/인터벌 페이지에도 영향
- page.tsx에서 메타데이터와 JSON-LD는 포모도로 전용으로 별도 작성

## 관련 기능

- [타이머](timer.md) — 뷰 로직 공유 (TimerView.tsx)
- [인터벌](interval.md) — 같은 TimerView 사용
- [사운드 시스템](sound-system.md) — 알림음
- [가이드](guides.md) — "포모도로 기법 완벽 가이드" 문서 연결
