# 🕐 Clock-Tani — 무료 온라인 시계, 타이머 & 생산성 도구

[![Live Demo](https://img.shields.io/badge/Live_Demo-clock--tani.com-0891b2?style=for-the-badge&logo=vercel)](https://clock-tani.com)
[![License](https://img.shields.io/badge/license-All_Rights_Reserved-red?style=for-the-badge)](LICENSE)
[![Next.js](https://img.shields.io/badge/Next.js-16-black?style=for-the-badge&logo=nextdotjs)](https://nextjs.org)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?style=for-the-badge&logo=typescript)](https://www.typescriptlang.org)
[![PWA](https://img.shields.io/badge/PWA-ready-5A0FC8?style=for-the-badge&logo=pwa)](https://clock-tani.com)

**[Clock-Tani](https://clock-tani.com/)**는 설치 없이 브라우저에서 바로 사용할 수 있는 무료 온라인 시간 관리 웹앱입니다. PWA를 지원하여 오프라인에서도 사용 가능합니다.

> 🌐 **English**: Clock-Tani is a free online suite of 9 time management tools including World Clock, Timer, Stopwatch, Pomodoro, Interval Timer (Tabata/HIIT), Multi-Timer, Alarm, Server Time, and D-Day Counter. No installation required — works in any browser. Try it at **[clock-tani.com/en](https://clock-tani.com/en)**.

## 주요 기능

### [온라인 세계시계](https://clock-tani.com/ko/clock)

전 세계 70개 이상 도시의 현재 시간을 실시간으로 확인하세요. 여러 시간대를 한눈에 비교하고, 드래그앤드롭으로 자주 보는 도시를 정렬할 수 있습니다. 아날로그/디지털 표시 모드와 12시간/24시간 형식을 지원합니다.

### [온라인 스톱워치](https://clock-tani.com/ko/stopwatch)

밀리초 단위의 정밀한 온라인 스톱워치입니다. 랩타임 기록, 구간 시간 추적, CSV 내보내기 기능을 제공합니다. 운동, 요리, 공부 시간 측정에 활용하세요.

### [온라인 타이머](https://clock-tani.com/ko/timer)

다양한 프리셋 버튼으로 빠르게 설정할 수 있는 카운트다운 타이머입니다. 5가지 알림음과 6가지 배경 사운드(빗소리, 카페, 화이트노이즈, 벽난로, 파도, 숲)를 제공합니다. 화면 꺼짐 방지 기능으로 타이머 실행 중 화면이 꺼지지 않습니다.

### [뽀모도로 타이머](https://clock-tani.com/ko/pomodoro)

뽀모도로 기법으로 집중력을 높이세요. 25분 집중 후 5분 휴식을 자동으로 전환합니다. 집중 시간 통계 추적, 작업 목록 관리, 앰비언트 사운드로 최적의 집중 환경을 만들어 줍니다.

### [인터벌 타이머 / HIIT 타이머](https://clock-tani.com/ko/interval)

고강도 인터벌 트레이닝을 위한 타이머입니다. 타바타 프리셋(20초 운동 / 10초 휴식 x 8라운드)을 기본 제공하며, 운동/휴식 시간과 라운드 수를 자유롭게 설정할 수 있습니다. 라운드 자동 전환으로 운동에만 집중하세요.

### [멀티 타이머](https://clock-tani.com/ko/multi-timer)

최대 4개의 독립적인 카운트다운 타이머를 동시에 실행할 수 있습니다. 각 타이머를 개별적으로 제어할 수 있어 여러 요리를 동시에 하거나, 여러 과목을 병행 학습할 때 유용합니다.

### [온라인 알람시계](https://clock-tani.com/ko/alarm)

최대 10개의 알람을 동시에 설정할 수 있습니다. 5가지 알림음, 스누즈 기능, 빠른 프리셋(10분, 30분, 1시간), 알람별 라벨 설정, 브라우저 알림을 지원합니다.

### [서버시간 / 티켓팅 시계](https://clock-tani.com/ko/server-time)

NTP 서버와 동기화된 정확한 시간을 밀리초 단위로 표시합니다. 네트워크 지연 보정 기능으로 더욱 정밀합니다. 티켓팅, 한정 판매 등 1초가 중요한 순간에 필수적인 도구입니다.

### [D-Day 카운터](https://clock-tani.com/ko/dday-counter)

최대 20개의 이벤트를 동시에 관리하는 D-Day 카운트다운입니다. 6개 카테고리(일반, 생일, 기념일, 시험, 여행, 업무)와 음력 지원, 공유 기능을 제공합니다. 다가오는 이벤트는 D-N, 당일은 D-Day, 지난 이벤트는 D+N으로 표시됩니다.

## 기술 스택

- **프레임워크**: [Next.js](https://nextjs.org/) 16 (App Router)
- **언어**: TypeScript
- **스타일링**: Tailwind CSS 4
- **다국어**: next-intl (한국어, 영어)
- **PWA**: Service Worker 기반 오프라인 지원
- **드래그앤드롭**: @dnd-kit
- **배포**: Vercel

## 시작하기

```bash
npm install
npm run dev
```

브라우저에서 [http://localhost:3000](http://localhost:3000)을 열어주세요.

## 지원 언어

- 한국어: [https://clock-tani.com/ko/clock](https://clock-tani.com/ko/clock)
- English: [https://clock-tani.com/en/clock](https://clock-tani.com/en/clock)

## 바로가기

- 웹사이트: [https://clock-tani.com](https://clock-tani.com/)
- 개인정보처리방침: [https://clock-tani.com/ko/privacy](https://clock-tani.com/ko/privacy)
- 이용약관: [https://clock-tani.com/ko/terms](https://clock-tani.com/ko/terms)
- 소개: [https://clock-tani.com/ko/about](https://clock-tani.com/ko/about)

## 문의 / Contact

- 📧 Email: [admin@teck-tani.com](mailto:admin@teck-tani.com)
- 🌐 Website: [clock-tani.com](https://clock-tani.com)

## 라이선스 / License

© 2026 Clock-Tani. **All Rights Reserved.**

이 저장소는 포트폴리오 및 학습 목적으로 공개되어 있습니다.
소스 코드의 복사, 재배포, 상업적 이용은 사전 서면 동의 없이 금지됩니다.
자세한 내용은 [LICENSE](LICENSE) 파일을 참고하세요.

This repository is published for portfolio and educational purposes only.
Copying, redistribution, or commercial use of the source code without prior
written permission is prohibited. See [LICENSE](LICENSE) for details.
