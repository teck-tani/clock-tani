# 스톱워치 (Stopwatch)

## 목적

정밀한 시간 측정과 랩 타임 기록을 제공하는 스톱워치. 운동, 요리, 실험 등에서 경과 시간을 측정하고, 랩 기록을 내보내기할 수 있다. 랩 시 비프음과 진동 피드백을 지원한다.

## 파일 맵

| 구분 | 파일 경로 |
|------|-----------|
| 서버 컴포넌트 | `src/app/[locale]/stopwatch/page.tsx` |
| 클라이언트 뷰 | `src/app/[locale]/stopwatch/StopwatchView.tsx` |
| 래퍼 컴포넌트 | `src/app/[locale]/stopwatch/StopwatchWrapper.tsx` |
| CSS (글로벌) | `src/app/[locale]/stopwatch/stopwatch.css` |
| 레이아웃 | `src/app/[locale]/stopwatch/layout.tsx` |
| OG 이미지 | `src/app/[locale]/stopwatch/opengraph-image.tsx` |
| 트위터 이미지 | `src/app/[locale]/stopwatch/twitter-image.tsx` |
| 설정 Context | `src/contexts/StopwatchSettingsContext.tsx` |
| 번역 | `messages/ko.json` → `Clock.Stopwatch` |

## API 엔드포인트

없음

## 주요 데이터 저장소

| 저장소 | 키 | 내용 |
|--------|-----|------|
| localStorage | `stopwatch_laps` | 랩 타임 배열 |
| localStorage | `stopwatch_settings` | 소리/진동 활성화 여부 |

## 비즈니스 규칙

- 랩 비프음: Web Audio API로 800Hz, 80ms 사인파 생성
- 진동 피드백: 50ms 펄스 (모바일 터치 기기만)
- 랩 기록 내보내기 지원
- StopwatchSettingsContext로 설정 상태 관리

## 데이터 흐름

```
시작 버튼 → setInterval(10ms) → 경과 시간 표시
랩 버튼 → laps 배열에 추가 → localStorage 저장 → 비프음/진동 재생
리셋 → state 초기화 → localStorage 클리어
```

## 주의사항

- **CSS 모듈이 아닌 글로벌 CSS** (`stopwatch.css`) 사용 — 프로젝트 내 유일한 예외
- StopwatchSettingsContext는 이 도구 전용 Context
- Web Audio API는 사용자 상호작용 후에만 재생 가능 (autoplay 정책)

## 관련 기능

- [타이머](timer.md) — 카운트다운 방식
- [사운드 시스템](sound-system.md) — 알림음 (스톱워치는 Web Audio API 직접 사용)
- [테마](theme.md) — 다크/라이트 모드
