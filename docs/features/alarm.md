# 알람 (Alarm)

## 목적

사용자가 원하는 시각에 알림을 받을 수 있는 온라인 알람. 여러 알람을 등록하고, 각각 다른 알림음/라벨을 설정할 수 있다. 브라우저 Notification API를 활용해 탭이 비활성 상태여도 알림을 받을 수 있다.

## 파일 맵

| 구분 | 파일 경로 |
|------|-----------|
| 서버 컴포넌트 | `src/app/[locale]/alarm/page.tsx` |
| 클라이언트 뷰 | `src/app/[locale]/alarm/AlarmClient.tsx` |
| 시간 선택기 | `src/app/[locale]/alarm/ScrollWheelPicker.tsx` |
| CSS 모듈 | `src/app/[locale]/alarm/alarm.module.css` |
| 시간 선택기 CSS | `src/app/[locale]/alarm/scrollWheelPicker.module.css` |
| OG 이미지 | `src/app/[locale]/alarm/opengraph-image.tsx` |
| 트위터 이미지 | `src/app/[locale]/alarm/twitter-image.tsx` |
| 공유 소리 선택기 | `src/components/SoundPicker.tsx` |
| 소리 유틸 | `src/components/soundUtils.ts` |
| 번역 | `messages/ko.json` → `Clock.Alarm` |

## API 엔드포인트

없음

## 주요 데이터 저장소

| 저장소 | 키 | 내용 |
|--------|-----|------|
| localStorage | `alarm_list` | 알람 객체 배열 (time, label, enabled, sound, vibration) |

## 비즈니스 규칙

- 복수 알람 등록 가능
- 24시간 형식으로 시간 설정 (ScrollWheelPicker)
- 알람별 설정: 시간, 라벨, 알림음 (15종), 진동, 활성화/비활성화
- 알림음 15종 (`public/sounds/` 디렉토리)
- 브라우저 Notification API로 백그라운드 알림
- 알람 도달 시: 소리 재생 + 진동 + 브라우저 알림
- Tag 기반 알림 그룹핑 (중복 알림 방지)

## 데이터 흐름

```
알람 추가 → ScrollWheelPicker로 시간 설정 → alarm_list에 추가 → localStorage 저장
매 초 체크 → 현재 시각과 활성 알람 비교 → 일치 시:
  → Notification API 권한 요청/알림 전송
  → playMp3(sound, volume) 재생
  → navigator.vibrate() 진동 (모바일)
알람 편집/삭제 → alarm_list 업데이트 → localStorage 저장
```

## 주의사항

- Notification API 권한은 사용자 상호작용 후에만 요청 가능
- 브라우저 탭이 완전히 닫히면 알람 작동 안 함 (탭 활성/비활성은 OK)
- ScrollWheelPicker는 알람 전용 로컬 컴포넌트 (공유 컴포넌트가 아님)
- 알림음 마이그레이션 로직: `migrateSoundType()`으로 레거시 소리명 변환

## 관련 기능

- [사운드 시스템](sound-system.md) — SoundPicker, soundUtils 공유
- [타이머](timer.md) — 유사한 알림 메커니즘
- [가이드](guides.md) — "효과적인 알람 설정 팁" 문서 연결
