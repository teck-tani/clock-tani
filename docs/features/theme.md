# 테마 시스템 (Theme)

## 목적

라이트/다크 모드를 전역으로 관리하는 테마 시스템. 사용자 선호에 따라 전체 앱의 색상 스킴을 전환하며, 설정은 새로고침/재방문 시에도 유지된다.

## 파일 맵

| 구분 | 파일 경로 |
|------|-----------|
| Context Provider | `src/contexts/ThemeContext.tsx` |
| 설정 드롭다운 | `src/components/SettingsDropdown.tsx` |
| 글로벌 CSS 변수 | `src/app/globals.css` |
| 레이아웃 (Provider 적용) | `src/app/[locale]/layout.tsx` |

## API 엔드포인트

없음

## 주요 데이터 저장소

| 저장소 | 키 | 내용 |
|--------|-----|------|
| localStorage | `globalTheme` | `"light"` 또는 `"dark"` |

## 비즈니스 규칙

- 기본 테마: light
- `data-theme` 속성을 `<body>` 태그에 설정
- CSS 변수로 색상 전환: `[data-theme="dark"] { ... }`
- `mounted` 플래그로 SSR hydration mismatch 방지
- SettingsDropdown에서 토글 UI 제공

## 데이터 흐름

```
ThemeProvider 마운트 → localStorage에서 globalTheme 읽기
                    → body에 data-theme 속성 설정 → mounted=true
테마 토글 → state 업데이트 → body data-theme 변경 → localStorage 저장
```

## 주의사항

- **모든 컴포넌트의 다크 모드 스타일은 CSS에서 `[data-theme="dark"]` 선택자로 처리**
- 새 컴포넌트 추가 시 반드시 다크 테마 스타일 포함
- ThemeContext는 `useTheme()` 훅으로 접근
- hydration 전에는 테마 미적용 상태 — 깜빡임(FOUC) 가능성 있음

## 관련 기능

- 모든 도구 페이지 — 다크 모드 CSS 적용
- [시계](clock.md) — SettingsDropdown에서 테마 토글
