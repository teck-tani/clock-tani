# 서버 시간 (Server Time)

## 목적

서버 기준 정확한 시간을 밀리초 단위로 표시하며, 사용자 기기 시간과의 차이를 보여준다. 수능, 티켓팅 등 정확한 시간이 필요한 상황에서 기기 시계의 오차를 보정하는 데 활용한다.

## 파일 맵

| 구분 | 파일 경로 |
|------|-----------|
| 서버 컴포넌트 | `src/app/[locale]/server-time/page.tsx` |
| 클라이언트 뷰 | `src/app/[locale]/server-time/ServerTimeClient.tsx` |
| CSS 모듈 | `src/app/[locale]/server-time/servertime.module.css` |
| OG 이미지 | `src/app/[locale]/server-time/opengraph-image.tsx` |
| 트위터 이미지 | `src/app/[locale]/server-time/twitter-image.tsx` |
| **API 라우트** | `src/app/api/server-time/route.ts` |
| 번역 | `messages/ko.json` → `Clock.ServerTime` |

## API 엔드포인트

| Method | URL | 설명 | 권한 |
|--------|-----|------|------|
| GET | `/api/server-time` | 현재 서버 타임스탬프 반환 | 공개 |

## 주요 데이터 저장소

| 저장소 | 키 | 내용 |
|--------|-----|------|
| localStorage | `servertime_h` | 목표 시각 (시) |
| localStorage | `servertime_m` | 목표 시각 (분) |
| localStorage | `servertime_s` | 목표 시각 (초) |
| localStorage | `servertime_sound` | 소리 활성화 여부 |

## 비즈니스 규칙

- 서버 시간 API 호출로 정확한 시간 동기화
- 10분마다 자동 재동기화
- 기기 시간과 서버 시간의 오차 표시
- 목표 시각 설정 시 해당 시각에 소리 알림
- 밀리초 단위 표시

## 데이터 흐름

```
페이지 로드 → GET /api/server-time → 서버 타임스탬프 수신
           → 기기 시간과의 offset 계산 → 보정된 시간 표시
10분마다 → 재동기화 → offset 갱신
목표 시각 설정 → localStorage 저장 → 매 초 비교 → 일치 시 알림
```

## 주의사항

- **프로젝트 내 유일한 API 라우트** — `src/app/api/server-time/route.ts`
- Ahrefs에서 "Slow page" 경고 (1,274ms) — API 호출 지연 때문이나 실사용에는 영향 적음
- 네트워크 지연(latency)이 offset 정확도에 영향 — 완벽한 동기화는 불가

## 관련 기능

- [시계](clock.md) — 세계 시계와 시간 비교
- [사운드 시스템](sound-system.md) — 목표 시각 알림음
- [가이드](guides.md) — "온라인 시계 vs 기기 시계: 정확도 비교" 문서 연결
