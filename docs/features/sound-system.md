# 사운드 시스템 (Sound System)

## 목적

타이머, 알람, 스톱워치 등에서 사용하는 알림음 재생과 소리 선택 UI를 공유 모듈로 관리. 15종의 알림음, 볼륨 조절, 진동 피드백, 소리 미리듣기를 통합 제공한다.

## 파일 맵

| 구분 | 파일 경로 |
|------|-----------|
| 소리 유틸리티 | `src/components/soundUtils.ts` |
| 소리 선택 UI | `src/components/SoundPicker.tsx` |
| 소리 선택 CSS | `src/components/soundPicker.module.css` |
| 알림음 파일 (15종) | `public/sounds/*.mp3` |

## 알림음 목록

| 파일명 | 설명 |
|--------|------|
| `arpeggio.mp3` | 아르페지오 |
| `cheerful.mp3` | 밝은 소리 |
| `discreet.mp3` | 조용한 알림 |
| `early-sunrise.mp3` | 아침 해뜨기 |
| `good-morning.mp3` | 좋은 아침 |
| `little-dwarf.mp3` | 작은 난쟁이 |
| `loving-you.mp3` | 사랑스러운 |
| `lovingly.mp3` | 다정한 |
| `martian-gun.mp3` | 마션 건 |
| `rooster.mp3` | 수탉 |
| `sisfus.mp3` | 시스푸스 |
| `soft-bells.mp3` | 부드러운 벨 |
| `solemn.mp3` | 엄숙한 |
| `swinging.mp3` | 스윙 |
| `system-fault.mp3` | 시스템 경고 |

## API 엔드포인트

없음

## 주요 데이터 저장소

각 도구별로 소리 설정을 자체 localStorage 키에 저장 (공유 키 없음)

## 비즈니스 규칙

- `playMp3(sound, volume)`: `/sounds/{sound}.mp3` 재생, 볼륨 0~100
- `stopAudio(audio)`: 재생 중지 및 정리
- `migrateSoundType()`: 레거시 소리명 → 신규 소리명 변환 (classic→soft-bells 등)
- SoundPicker: 5초 미리듣기 제한
- 진동 토글: `"vibrate" in navigator && ("ontouchstart" in window || navigator.maxTouchPoints > 0)` 조건부 표시
- 스톱워치만 Web Audio API 직접 사용 (800Hz, 80ms 사인파) — SoundPicker 미사용

## 데이터 흐름

```
SoundPicker 렌더링 → props로 sound/vibration 상태 전달
소리 선택 → onSoundChange 콜백 → 부모 컴포넌트에서 localStorage 저장
미리듣기 → playMp3() → 5초 후 자동 정지
알림 발동 → playMp3(sound, volume) + navigator.vibrate(50)
```

## 주의사항

- **UI/UX 통일 원칙**: SoundPicker의 스타일/동작을 변경하면 타이머, 알람 등 모든 사용처에 영향
- 브라우저 autoplay 정책: 사용자 상호작용 없이 소리 재생 불가
- `migrateSoundType()`: 새 소리 추가/이름 변경 시 마이그레이션 로직 업데이트 필요
- MP3 파일 추가 시 `soundUtils.ts`의 `SoundType` 타입에도 추가 필요

## 관련 기능

- [타이머](timer.md) — 알림음 + 배경음(Ambient)
- [알람](alarm.md) — 알림음 선택
- [스톱워치](stopwatch.md) — Web Audio API (별도)
- [인터벌](interval.md) — 운동/휴식 전환 알림
