---
name: clock-tani-dev-guide
description: Clock-Tani 프로젝트의 개발 가이드 스킬. Next.js App Router 기반 시간 도구 웹앱에서 새 도구 추가, 가이드 페이지 작성, 컴포넌트 개발, SEO 설정 등을 요청할 때 이 스킬을 사용한다.
triggers:
  - "새 도구 만들어줘"
  - "페이지 추가"
  - "가이드 추가"
  - "컴포넌트 만들어줘"
  - "SEO 설정"
  - "번역 추가"
  - "사이트맵"
---

# Clock-Tani 개발 가이드

Clock-Tani는 Next.js 16 App Router + React 19 + TypeScript + Tailwind CSS 4 + next-intl 기반의 한국어 온라인 시계/타이머 웹앱이다.

---

## 1. 프레임워크 패턴

### Server Component (page.tsx) + Client View 분리

모든 도구 페이지는 **서버 컴포넌트**(`page.tsx`)와 **클라이언트 뷰**(`ToolView.tsx`)로 분리한다.

**page.tsx (서버 컴포넌트):**
```typescript
import { getTranslations } from 'next-intl/server';
import { locales } from '@/navigation';
import ToolView from './ToolView';

export function generateStaticParams() {
    return locales.map((locale) => ({ locale }));
}

export const dynamic = 'force-static';
export const revalidate = false;

export async function generateMetadata(props: { params: Promise<{ locale: string }> }): Promise<Metadata> {
    const { locale } = await props.params;
    const t = await getTranslations({ locale, namespace: 'Clock.ToolName.meta' });

    return {
        title: t('title'),           // "도구명 | Clock Tani" 형식
        description: t('description'), // 120~155자 권장
        keywords: t('keywords'),
        alternates: {
            canonical: `${baseUrl}/${locale}/tool-path`,
            languages: {
                'x-default': `${baseUrl}/ko/tool-path`,
                'ko': `${baseUrl}/ko/tool-path`,
                'en': `${baseUrl}/en/tool-path`,
            }
        },
        openGraph: { title, description, url, siteName: 'Clock-Tani', type: 'website', locale, alternateLocale },
        twitter: { card: 'summary_large_image', title, description },
        robots: { index: true, follow: true },
    };
}

export default async function ToolPage(props: { params: Promise<{ locale: string }> }) {
    const { locale } = await props.params;
    // JSON-LD 스키마 생성 (FAQPage, HowTo, WebApplication)
    // SEO 콘텐츠 (article 섹션)

    return (
        <>
            <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />
            <ToolView />
            <article className={styles.seoContent}>
                {/* 검색엔진용 설명, FAQ 등 */}
            </article>
        </>
    );
}
```

**ToolView.tsx (클라이언트 컴포넌트):**
```typescript
"use client";
import { useTranslations } from 'next-intl';
import { useTheme } from '@/contexts/ThemeContext';
import styles from './tool.module.css';

export default function ToolView() {
    const t = useTranslations('Clock.ToolName');
    const { theme } = useTheme();
    const [isLoaded, setIsLoaded] = useState(false); // hydration 안전 플래그

    // localStorage 복원 (마운트 시)
    useEffect(() => {
        const saved = localStorage.getItem(STORAGE_KEY);
        if (saved) setState(JSON.parse(saved));
        setIsLoaded(true);
    }, []);

    // 상태 변경 시 localStorage 저장
    useEffect(() => {
        if (!isLoaded) return;
        localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    }, [state, isLoaded]);

    return <div className={styles.wrapper}>...</div>;
}
```

### 정적 생성 (Static Generation)

- 모든 도구/가이드 페이지는 `force-static` + `generateStaticParams()`로 빌드 시 정적 생성
- locale × slug 조합으로 모든 경로 사전 생성

---

## 2. 새 도구(Tool) 추가 체크리스트

### 2-1. 도구 등록

**`src/config/tools.ts`:**
```typescript
export const ALL_TOOLS: ToolDef[] = [
    // 기존 도구들...
    { href: '/new-tool', labelKey: 'newTool', icon: FaIcon, category: 'time' },
];

export const RELATED_TOOLS: Record<string, string[]> = {
    // 기존 매핑...
    '/new-tool': ['/timer', '/pomodoro'],
};
```

### 2-2. 파일 생성

```
src/app/[locale]/new-tool/
├── page.tsx              ← 서버 컴포넌트 (메타데이터 + JSON-LD + SEO 콘텐츠)
├── NewToolView.tsx       ← 클라이언트 컴포넌트 ("use client")
├── newTool.module.css    ← CSS 모듈
├── layout.tsx            ← 패스스루 레이아웃
├── opengraph-image.tsx   ← OG 이미지 (og-template.tsx 사용)
└── twitter-image.tsx     ← (선택) 트위터 이미지
```

**layout.tsx (패스스루):**
```typescript
export default function NewToolLayout({ children }: { children: React.ReactNode }) {
    return <>{children}</>;
}
```

**opengraph-image.tsx:**
```typescript
import { generateOgImage, ogSize } from '@/lib/og-template';

export const runtime = 'edge';
export const alt = '도구 한글명';
export const size = ogSize;
export const contentType = 'image/png';

export default async function Image({ params }: { params: { locale: string } }) {
    return generateOgImage({
        locale: params.locale,
        title: { ko: '한글 제목', en: 'English Title' },
        subtitle: { ko: '한글 설명', en: 'English Description' },
        tags: { ko: ['태그1', '태그2', '무료'], en: ['Tag1', 'Tag2', 'FREE'] },
        icon: '아이콘이모지',
        accentColor: '#색상코드',
    });
}
```

### 2-3. 번역 추가

**`messages/ko.json` & `messages/en.json`:**
```json
{
  "Clock": {
    "NewTool": {
      "meta": {
        "title": "도구명 | Clock Tani",
        "description": "120~155자 설명",
        "keywords": "키워드1, 키워드2",
        "ogTitle": "OG 제목",
        "ogDescription": "OG 설명"
      },
      "controls": { "start": "시작", "stop": "정지", "reset": "재설정" },
      "labels": { /* UI 라벨 */ },
      "seo": {
        "faq": {
          "list": {
            "questionKey": { "question": "질문?", "answer": "답변" }
          }
        }
      }
    }
  }
}
```

### 2-4. 사이트맵 등록

**`src/app/sitemap.ts`:**
```typescript
const pages = [
    // 기존 페이지들...
    { path: '/new-tool', priority: 0.8, changeFrequency: 'monthly' as const, lastModified: '날짜' },
];
```

### 2-5. 빌드 검증

```bash
npm run build    # 빌드 성공 확인
npm run lint     # ESLint 통과 확인
```

빌드 출력에서 확인:
- `● /[locale]/new-tool` (정적 페이지 생성됨)
- `ƒ /[locale]/new-tool/opengraph-image` (OG 이미지 라우트)

---

## 3. 가이드(Guide) 추가 체크리스트

### 3-1. 가이드 등록

**`src/config/guides.ts`:**
```typescript
export const ALL_GUIDES: GuideDef[] = [
    // 기존 가이드들...
    {
        slug: 'new-guide-slug',
        titleKey: 'newGuide',
        descKey: 'newGuideDesc',
        date: '2026-04-01',
        lastModified: '2026-04-01',
        relatedTool: '/timer',  // 관련 도구 경로
    },
];
```

### 3-2. 번역에 가이드 콘텐츠 추가

**`messages/ko.json`:**
```json
{
  "Guides": {
    "titles": { "newGuide": "가이드 제목" },
    "descriptions": { "newGuideDesc": "가이드 설명" },
    "articles": {
      "new-guide-slug": {
        "title": "가이드 제목",
        "intro": "도입부 텍스트",
        "sections": [
          { "title": "섹션 1", "content": "내용..." },
          { "title": "섹션 2", "content": "내용..." }
        ],
        "conclusion": "결론 텍스트"
      }
    }
  }
}
```

### 3-3. OG 이미지 데이터 추가

**`src/app/[locale]/guides/[slug]/opengraph-image.tsx`:**
`guideOgData` 객체에 새 slug 항목 추가.

### 3-4. 사이트맵

가이드는 `ALL_GUIDES`에서 자동으로 사이트맵에 포함됨 (별도 수정 불필요).

---

## 4. 공유 컴포넌트 작성 패턴

### Props 설계 원칙

```typescript
interface ComponentProps {
    value: ValueType;              // 현재 값
    onChange: (v: ValueType) => void; // 변경 콜백
    t: (key: string) => string;    // 번역 함수 (문자열 하드코딩 금지)
    className?: string;            // 외부 스타일 오버라이드
    disabled?: boolean;            // 비활성화
}
```

### 컴포넌트 규칙

- `src/components/`에 배치
- CSS 모듈 사용 (`ComponentName.module.css`)
- 문자열은 반드시 `t()` 번역 함수를 통해 전달
- useEffect cleanup에서 리소스 해제 (Audio, Timer 등)
- 모바일 진동: `"vibrate" in navigator && ("ontouchstart" in window || navigator.maxTouchPoints > 0)` 체크

---

## 5. CSS 모듈 패턴

### 파일 구조

- **도구별 스타일:** `src/app/[locale]/tool/tool.module.css`
- **공유 레이아웃:** `src/components/SharedClockLayout.module.css`
- **공유 컴포넌트:** `src/components/componentName.module.css`
- **글로벌 CSS:** `src/app/globals.css` (CSS 변수 정의)
- **예외:** stopwatch는 `stopwatch.css` 글로벌 스타일

### CSS 변수 활용

```css
.element {
    padding: var(--space-md);          /* 간격 */
    border-radius: var(--radius-lg);   /* 둥근 모서리 */
    transition: all var(--transition-smooth); /* 애니메이션 */
    background: var(--gradient-primary);     /* 그라데이션 */
}
```

### 반응형 브레이크포인트

```css
@media (max-width: 640px) { /* 모바일 */ }
@media (max-width: 375px) { /* 소형 모바일 */ }
```

### 다크 테마 지원

```css
[data-theme="dark"] .element {
    background: #1e293b;
    color: #e2e8f0;
}
```

---

## 6. localStorage 데이터 저장 패턴

```typescript
const STORAGE_KEY = 'feature_state';
const [isLoaded, setIsLoaded] = useState(false);

// 1. 마운트 시 복원
useEffect(() => {
    try {
        const saved = localStorage.getItem(STORAGE_KEY);
        if (saved) setState(JSON.parse(saved));
    } catch {
        try { localStorage.removeItem(STORAGE_KEY); } catch {}
    }
    setIsLoaded(true);  // hydration 완료 표시
}, []);

// 2. 변경 시 저장 (hydration 이후만)
useEffect(() => {
    if (!isLoaded) return;
    try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch {
        console.warn('localStorage quota exceeded');
    }
}, [state, isLoaded]);
```

**핵심 규칙:**
- `isLoaded` 플래그로 SSR hydration 중 저장 방지
- try-catch로 quota exceeded 에러 처리
- 복원 실패 시 기존 데이터 삭제 후 기본값 사용

---

## 7. SEO 체크리스트

### 메타데이터 필수 항목

| 항목 | 규격 | 비고 |
|------|------|------|
| `title` | `도구명 \| Clock Tani` 형식 | 30~60자 |
| `description` | 120~155자 | 핵심 키워드 포함 |
| `keywords` | 쉼표 구분 | 검색 의도 반영 |
| `canonical` | 절대 URL | locale 포함 |
| `hreflang` | ko, en, x-default | x-default = ko |
| `og:image` | 1200x630px | og-template.tsx 사용 |

### JSON-LD 스키마 (도구 페이지 필수)

1. **FAQPage** — 자주 묻는 질문 (최소 3개)
2. **HowTo** — 사용 방법 단계별 설명
3. **WebApplication** — 앱 메타정보 (무료, 카테고리 등)

### OG 이미지 생성

```typescript
// src/lib/og-template.tsx의 generateOgImage() 사용
generateOgImage({
    locale,
    title: { ko: '한글', en: 'English' },
    subtitle: { ko: '한글 설명', en: 'English desc' },
    tags: { ko: ['태그'], en: ['Tag'] },
    icon: '이모지',
    accentColor: '#색상',
});
```

---

## 8. 개발 체크리스트 (공통)

### 새 기능 추가 시

- [ ] `ko.json`과 `en.json` 양쪽에 번역 추가
- [ ] CSS 모듈로 스타일 작성 (글로벌 스타일 금지)
- [ ] 다크 테마 대응 (`[data-theme="dark"]`)
- [ ] 모바일 반응형 확인 (640px, 375px)
- [ ] localStorage 사용 시 `isLoaded` 패턴 적용
- [ ] `npm run build` 성공 확인
- [ ] `npm run lint` 통과

### UI 변경 시

- [ ] 같은 UI가 다른 도구에도 있으면 **모두 통일** (UI/UX 통일 원칙)
- [ ] 공통 기능은 `src/components/`에 공유 컴포넌트로 추출
- [ ] 진동 토글, 소리 선택 등 공유 UI는 동일 스타일 유지

### SEO 관련 변경 시

- [ ] title 30~60자, description 120~155자 확인
- [ ] `| Clock Tani` 서픽스 포함
- [ ] canonical + hreflang 설정
- [ ] opengraph-image.tsx 생성/업데이트
- [ ] 사이트맵 등록 확인
- [ ] JSON-LD 스키마 추가
- [ ] `npm run build` 후 라우트 출력 확인

### 커밋 시

- [ ] 커밋 메시지 한국어로 작성
- [ ] 코드 주석 한국어로 작성
- [ ] 이미지 파일(png, jpg) 커밋에 포함하지 않음
