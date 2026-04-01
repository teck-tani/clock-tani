# 멀티 타이머 (Multi-Timer)

## 목적

여러 개의 독립적인 카운트다운 타이머를 동시에 운영할 수 있는 기능. 요리에서 여러 요리 동시 관리, 업무에서 복수 작업 시간 추적 등에 활용. 드래그앤드롭 재정렬과 타이머 템플릿 저장을 지원한다.

## 파일 맵

| 구분 | 파일 경로 |
|------|-----------|
| 서버 컴포넌트 | `src/app/[locale]/multi-timer/page.tsx` |
| 클라이언트 뷰 | `src/app/[locale]/multi-timer/MultiTimerView.tsx` |
| CSS 모듈 | `src/app/[locale]/multi-timer/multiTimer.module.css` |
| 레이아웃 | `src/app/[locale]/multi-timer/layout.tsx` |
| OG 이미지 | `src/app/[locale]/multi-timer/opengraph-image.tsx` |
| 트위터 이미지 | `src/app/[locale]/multi-timer/twitter-image.tsx` |
| 번역 | `messages/ko.json` → `Clock.MultiTimer` |

## API 엔드포인트

없음

## 주요 데이터 저장소

| 저장소 | 키 | 내용 |
|--------|-----|------|
| localStorage | `multi_timer_state` | 타이머 객체 배열 (duration, timeLeft, isRunning, isSetting) |
| localStorage | `multi_timer_templates` | 저장된 타이머 프리셋/템플릿 |

## 비즈니스 규칙

- 타이머 개수 무제한 생성 가능
- 각 타이머 독립 제어 (시작/일시정지/리셋)
- 일괄 조작: 전체 시작, 전체 일시정지, 전체 리셋
- @dnd-kit 기반 드래그앤드롭 재정렬
- 타이머 설정을 템플릿으로 저장/불러오기
- 각 타이머: duration, timeLeft, isRunning, isSetting 상태 관리

## 데이터 흐름

```
타이머 추가 → 배열에 새 타이머 객체 추가 → localStorage 저장
개별 시작 → 해당 타이머만 카운트다운 → 완료 시 알림음
전체 시작 → 모든 타이머 동시 카운트다운
순서 변경 → @dnd-kit → 배열 재정렬 → localStorage 저장
템플릿 저장 → multi_timer_templates에 현재 설정 저장
```

## 주의사항

- `@dnd-kit` 패키지 의존 — 업데이트 시 DnD 동작 확인 필요
- 타이머가 많아지면 성능 이슈 가능 (각 타이머별 setInterval)
- timer 디렉토리의 MultiTimerView.tsx와 별개 파일 (혼동 주의)

## 관련 기능

- [타이머](timer.md) — 단일 카운트다운 타이머
- [사운드 시스템](sound-system.md) — 알림음
- [시계](clock.md) — @dnd-kit 동일 사용 (도시 재정렬)
