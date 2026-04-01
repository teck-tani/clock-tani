# 타이머 (Timer)

## 목적

카운트다운 타이머의 허브 페이지. 일반 타이머, 포모도로, 인터벌(타바타) 3가지 모드를 탭으로 전환하며, 프리셋 시간, 배경 사운드, Wake Lock, 알림음 등을 통합 제공한다. 포모도로와 인터벌은 각각 별도 URL(/pomodoro, /interval)로도 접근 가능.

## 파일 맵

| 구분 | 파일 경로 |
|------|-----------|
| 서버 컴포넌트 | `src/app/[locale]/timer/page.tsx` |
| 클라이언트 뷰 | `src/app/[locale]/timer/TimerView.tsx` |
| 멀티타이머 뷰 | `src/app/[locale]/timer/MultiTimerView.tsx` |
| 배경음 플레이어 | `src/app/[locale]/timer/AmbientPlayer.tsx` |
| 포모도로 통계 | `src/app/[locale]/timer/PomodoroStats.tsx` |
| Wake Lock 훅 | `src/app/[locale]/timer/useWakeLock.ts` |
| CSS 모듈 | `src/app/[locale]/timer/timer.module.css` |
| 멀티타이머 CSS | `src/app/[locale]/timer/multiTimer.module.css` |
| 레이아웃 | `src/app/[locale]/timer/layout.tsx` |
| OG 이미지 | `src/app/[locale]/timer/opengraph-image.tsx` |
| 트위터 이미지 | `src/app/[locale]/timer/twitter-image.tsx` |
| 번역 | `messages/ko.json` → `Clock.Timer` |

## API 엔드포인트

없음

## 주요 데이터 저장소

| 저장소 | 키 | 내용 |
|--------|-----|------|
| localStorage | `timer_state` | 모드별 duration, timeLeft, isRunning, endTime |
| localStorage | `pomodoro_stats` | 포모도로 세션 이력 (타임스탬프 포함) |
| localStorage | `ambient_settings` | 배경음 볼륨, 사운드 종류 |

## 비즈니스 규칙

- **3가지 모드**: timer (일반), pomodoro (25/5/15분), interval (운동/휴식/라운드)
- `fixedMode` prop: 포모도로/인터벌 전용 페이지에서 모드 탭 숨김
- 프리셋 시간: 1초, 5초, 1분, 5분, 1시간, 5시간
- ScrollWheelPicker로 시간 입력
- 알림음 30초 후 자동 정지
- Wake Lock API로 타이머 실행 중 화면 꺼짐 방지
- 배경음(Ambient) 타이머 실행 중 재생 가능
- 포모도로 세션 통계 추적 및 내보내기

## 데이터 흐름

```
시간 설정 → state 업데이트 → localStorage 저장
시작 버튼 → endTime 계산 → setInterval(100ms) → 남은 시간 표시
         → Wake Lock 활성화 → 배경음 재생 (선택 시)
타이머 완료 → 알림음 재생 → 진동 → 30초 후 알림 정지
포모도로 → 세션 완료 → pomodoro_stats에 기록 → 다음 페이즈 자동 전환 (옵션)
```

## 주의사항

- **timer.module.css가 포모도로/인터벌의 스타일도 포함** — 수정 시 3개 페이지 모두 영향
- TimerView.tsx가 대형 컴포넌트 — fixedMode에 따라 분기 로직 많음
- `isLoaded` 플래그로 hydration 중 localStorage 저장 방지 필수
- 포모도로/인터벌 페이지는 TimerView를 `fixedMode` prop으로 재사용

## 관련 기능

- [포모도로](pomodoro.md) — fixedMode="pomodoro"로 접근
- [인터벌](interval.md) — fixedMode="interval"로 접근
- [멀티 타이머](multi-timer.md) — 독립 다중 타이머
- [사운드 시스템](sound-system.md) — 알림음 선택
- [PWA](pwa.md) — Wake Lock API
