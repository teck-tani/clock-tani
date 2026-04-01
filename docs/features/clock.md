# 시계 (Clock)

## 목적

전 세계 70개 이상 도시의 현재 시간을 실시간으로 표시하는 세계 시계 기능. 디지털/아날로그 디스플레이 모드, 12h/24h 시간 형식, 도시 추가/삭제/재정렬을 지원하며, 사용자가 필요한 도시를 선택해 한 화면에서 비교할 수 있다.

## 파일 맵

| 구분 | 파일 경로 |
|------|-----------|
| 서버 컴포넌트 | `src/app/[locale]/clock/page.tsx` |
| 클라이언트 뷰 | `src/app/[locale]/clock/ClockView.tsx` |
| 도시 데이터 | `src/app/[locale]/clock/cities.ts` |
| 도시 검색 모달 | `src/app/[locale]/clock/CitySearchModal.tsx` |
| 드래그앤드롭 래퍼 | `src/app/[locale]/clock/DndWrapper.tsx` |
| CSS 모듈 | `src/app/[locale]/clock/ClockView.module.css` |
| 레이아웃 | `src/app/[locale]/clock/layout.tsx` |
| OG 이미지 | `src/app/[locale]/clock/opengraph-image.tsx` |
| 트위터 이미지 | `src/app/[locale]/clock/twitter-image.tsx` |
| 아이콘 | `src/app/[locale]/clock/icon.svg` |
| 번역 | `messages/ko.json` → `Clock.Clock`, `messages/en.json` |
| 도구 등록 | `src/config/tools.ts` → `ALL_TOOLS` |

## API 엔드포인트

없음 (클라이언트 사이드 시간 계산)

## 주요 데이터 저장소

| 저장소 | 키 | 내용 |
|--------|-----|------|
| localStorage | `worldClockState` | 선택된 도시 배열, displayMode (digital/analog), timeFormat (24h/12h), fontSize |

## 비즈니스 규칙

- 도시 데이터는 `cities.ts`에 70개 이상 정의 (timezone offset 기반)
- 기본 도시: 서울 (KST, UTC+9)
- 디스플레이 모드: 디지털 / 아날로그 전환 가능
- 시간 형식: 12시간 / 24시간 전환 가능
- 도시 순서: @dnd-kit 기반 드래그앤드롭으로 재정렬
- 폰트 크기 조절 기능

## 데이터 흐름

```
사용자 도시 추가 → CitySearchModal → ClockView state 업데이트 → localStorage 저장
사용자 순서 변경 → DndWrapper → ClockView state 업데이트 → localStorage 저장
페이지 로드 → localStorage에서 worldClockState 복원 → setInterval로 1초마다 시간 갱신
```

## 주의사항

- ClockView.tsx가 1040줄 이상으로 대형 컴포넌트 — 수정 시 사이드이펙트 주의
- `cities.ts` 수정 시 도시 이름 번역 키도 `messages/` 파일에 추가 필요
- opengraph-image.tsx는 커스텀 구현 (공유 og-template 미사용)
- SettingsDropdown에서 displayMode/timeFormat 변경 시 커스텀 이벤트로 전달

## 관련 기능

- [서버 시간](server-time.md) — 정확한 서버 시간 비교
- [테마](theme.md) — 다크/라이트 모드
- [SEO](seo.md) — BreadcrumbList, FAQ, HowTo, WebApplication JSON-LD 스키마
