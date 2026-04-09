# Google Search Central 종합 SEO 가이드라인

> **목적**: Google Search Central 공식 문서의 전체 내용을 정리한 SEO/검색 최적화 참고 문서입니다.
> 새로운 기능 추가, 콘텐츠 수정, 페이지 삭제 등 모든 작업 시 이 문서를 참고하여 Google 정책을 준수해야 합니다.
> **출처**: https://developers.google.com/search/docs (2026년 4월 기준)

---

## 목차

1. [검색엔진 최적화 기초](#1-검색엔진-최적화-기초)
2. [크롤링 및 색인 생성](#2-크롤링-및-색인-생성)
3. [순위 및 검색 노출](#3-순위-및-검색-노출)
4. [구조화된 데이터](#4-구조화된-데이터)
5. [모니터링 및 디버깅](#5-모니터링-및-디버깅)
6. [사이트별 가이드](#6-사이트별-가이드)
7. [clock-tani.com 적용 체크리스트](#7-clock-tanicom-적용-체크리스트)

---

## 1. 검색엔진 최적화 기초

### 1-1. Google 검색의 작동 방식 (3단계)

| 단계 | 설명 |
|------|------|
| **크롤링** | Googlebot이 인터넷에서 페이지를 찾아 텍스트, 이미지, 동영상을 다운로드. Chrome처럼 JavaScript 실행 |
| **색인 생성** | 페이지 내용을 분석하여 대규모 데이터베이스에 저장. 중복 콘텐츠 클러스터링, 표준 페이지 선택 |
| **검색결과 게재** | 사용자 검색어에 맞는 품질·관련성 높은 결과를 위치, 언어, 기기 유형 등 고려하여 반환 |

- Google은 금전적 대가로 순위를 높이지 않음
- 모든 페이지의 크롤링/색인 생성/게재가 보장되지 않음

### 1-2. 검색 Essentials (필수사항)

#### 기술 요구사항
- Google이 웹페이지에 접근 가능해야 함
- robots.txt와 메타 태그로 크롤링 제어
- 모바일 최적화 필수
- 적절한 파일 형식 사용 (HTML, PDF, 이미지, 동영상 등)

#### 주요 권장사항
- 유용하고 신뢰할 수 있는 사용자 중심 콘텐츠 제작
- 사용자 검색어를 고려한 단어 사용
- 링크를 크롤링 가능하도록 설정 (`<a href>`)
- 대체 텍스트와 링크 텍스트 작성
- 사이트맵 제출 및 구조화된 데이터 활용

### 1-3. SEO 기본 가이드

#### Google이 콘텐츠를 찾도록 하기
- `site:도메인` 검색으로 색인 상태 확인
- 사이트맵 제출 (필수는 아니지만 권장)
- CSS와 JavaScript 등 중요 리소스 접근 가능하게 유지

#### 사이트 구성
- **설명적 URL 사용**: `example.com/pets/cats.html` (임의 식별자 피하기)
- **주제별 페이지 그룹화**: 디렉터리로 비슷한 주제 분류
- **중복 콘텐츠 축소**: `rel="canonical"` 또는 301 리디렉션

#### 검색결과 표시 최적화
- **제목(title)**: 명확하고 간결하며 페이지 콘텐츠를 정확히 설명
- **메타 설명**: 짧고 명확하며 각 페이지에 고유하게 작성
- **이미지**: 관련 텍스트 근처에 배치, alt 속성에 설명적 텍스트 추가

#### 무시해야 할 것들
- 메타 키워드 태그 (Google은 사용하지 않음)
- 키워드 반복 (과도한 반복은 스팸 정책 위반)
- 도메인 이름의 키워드 (순위에 거의 영향 없음)
- 콘텐츠 길이 (최소/최대 단어 수 요구사항 없음)
- 제목 태그 순서 (Google 검색 관점에서 무관)

### 1-4. 유용한 콘텐츠 제작 가이드라인

#### 콘텐츠 품질 체크리스트
- [ ] 고유한 정보, 조사, 분석 자료를 제공하는가?
- [ ] 주제에 대한 본질적이고 완전한 설명을 제공하는가?
- [ ] 뻔하지 않은 유용한 분석이나 흥미로운 정보를 포함하는가?
- [ ] 다른 출처를 활용할 때 단순 복사가 아닌 가치와 독창성을 추가했는가?
- [ ] 제목이 이해를 돕는 요약인가? (과장/충격적이지 않은가?)
- [ ] 북마크, 공유, 추천할 만한 가치가 있는 페이지인가?
- [ ] 완성도 높게 제작되었는가? (급하게 제작되지 않았는가?)

#### E-E-A-T 원칙
**경험(Experience) + 전문성(Expertise) + 권위(Authority) + 신뢰성(Trustworthiness)**

- **신뢰성이 가장 중요**하며, 나머지는 신뢰성에 기여하는 요소
- 작성자 정보(바이라인)를 명확히 표시
- 작성자의 배경과 전문 분야를 설명
- AI/자동화 사용 시 투명하게 공개
- YMYL(Your Money or Your Life) 주제에서는 특히 높은 E-E-A-T 필요

#### 검색엔진 중심 콘텐츠 경고 신호 (피해야 할 것)
- 주로 검색엔진 방문 유도 목적인 콘텐츠
- 여러 주제에 대해 대량 콘텐츠 제작
- 광범위한 자동화로 다양한 주제 콘텐츠 생성
- 다른 사람의 이야기를 요약하며 가치를 더하지 않는 것
- 실제 변경 없이 페이지 날짜만 변경하는 것
- 특정 단어 수에 맞추려는 것 (Google은 선호 단어 수가 없음)

### 1-5. 생성형 AI 사용 안내
- AI 생성 콘텐츠 자체는 금지가 아님
- **핵심**: 콘텐츠가 사용자에게 유용한지가 중요
- AI 사용 사실을 투명하게 공개
- AI로 대량 저품질 콘텐츠 생성은 스팸 정책 위반

---

## 2. 크롤링 및 색인 생성

### 2-1. URL 구조
- 설명적 URL 사용 (읽기 쉬운 단어 포함)
- UTF-8 인코딩 사용
- 하이픈(-)으로 단어 구분 (밑줄 대신)

### 2-2. 사이트맵

#### 필요한 경우
- 500개 이상 페이지의 대규모 사이트
- 외부 링크가 적은 새로운 사이트
- 동영상/이미지/뉴스 등 리치 미디어 콘텐츠가 많은 경우

#### 주요 규칙
- XML 형식 표준 사이트맵
- 동영상/이미지/뉴스 확장 사이트맵 지원
- 사이트맵 색인 파일로 대규모 사이트맵 관리 가능
- 사이트맵이 있어도 모든 항목이 크롤링/색인 보장되지 않음

### 2-3. robots.txt

#### 목적
- 크롤링 트래픽 관리 (서버 과부하 방지)
- 중요하지 않은 페이지의 크롤링 방지
- 미디어 파일(이미지, 동영상) 크롤링 제어

#### 중요 제한사항
- robots.txt는 **페이지를 검색결과에서 숨기는 수단이 아님**
- 다른 사이트에서 링크된 URL은 여전히 색인 생성 가능
- 완전히 숨기려면: 비밀번호 보호, noindex 메타 태그, 페이지 삭제

### 2-4. 메타 태그 및 로봇 제어

#### robots 메타 태그 주요 값

| 값 | 설명 |
|------|------|
| `noindex` | 검색결과에 페이지 미표시 |
| `nofollow` | 페이지의 링크를 크롤링하지 않음 |
| `nosnippet` | 텍스트 스니펫 및 동영상 미리보기 미표시 |
| `max-snippet:[N]` | 스니펫을 최대 N자로 제한 |
| `max-image-preview:[size]` | 이미지 미리보기 크기 제한 (none/standard/large) |
| `max-video-preview:[N]` | 동영상 미리보기 최대 N초 |
| `notranslate` | 검색결과 번역 미제공 |
| `noimageindex` | 페이지 이미지 색인 미생성 |

#### X-Robots-Tag HTTP 헤더
- HTML이 아닌 파일(PDF, 이미지)에 사용
- 예시: `X-Robots-Tag: noindex, nofollow`

#### data-nosnippet HTML 속성
- `span`, `div`, `section` 요소에만 사용
- 특정 텍스트 섹션을 스니펫에서 제외

#### 주의사항
- robots.txt로 크롤링 차단 시 메타 태그는 무시됨 (크롤링 허용해야 규칙 적용)
- 규칙 충돌 시 더 제한적인 규칙이 적용됨

### 2-5. URL 표준화 (Canonical)

#### 방법 (효과 순서)
1. **301/308 리디렉션** (가장 강력)
2. **`rel="canonical"` 링크 태그** (HTML `<head>`)
3. **`rel="canonical"` HTTP 헤더** (PDF 등 비HTML)
4. **사이트맵** (약한 신호)

#### 모범 사례
- 절대 경로 사용 필수 (상대 경로 금지)
- `<head>` 섹션에만 포함
- HTTPS를 HTTP보다 우선시
- 사이트 내 링크는 표준 URL로 통일
- robots.txt로 표준화 금지 (작동하지 않음)

### 2-6. 리디렉션

#### 유형

| 유형 | HTTP 코드 | Google 처리 |
|------|-----------|-------------|
| **영구** | 301, 308 | 새 URL을 표준으로 인식, 검색결과에 새 URL 표시 |
| **임시** | 302, 303, 307 | 원본 URL 유지, 검색결과에 원본 URL 표시 가능 |

#### 구현 우선순위
1. 서버 측 리디렉션 (가장 권장)
2. Meta refresh 리디렉션
3. JavaScript 리디렉션 (다른 방법 불가 시만)

### 2-7. JavaScript SEO

#### Google의 JavaScript 처리 3단계
1. **크롤링**: HTML의 href 속성에서 URL 추출
2. **렌더링**: headless Chromium으로 JavaScript 실행
3. **색인 생성**: 렌더링된 HTML 기반으로 색인화

#### 핵심 권장사항
- 고유한 `<title>`과 메타 설명을 JavaScript로 설정 가능
- `<a href>` 태그로 링크 제공 (JavaScript 전용 라우팅은 Google이 발견 불가)
- History API로 URL 라우팅 구현 (URL 프래그먼트 `#` 피하기)
- 장기 캐싱: 파일명에 콘텐츠 해시 포함 (`main.2bb85551.js`)
- JSON-LD 구조화된 데이터를 JavaScript로 동적 삽입 가능
- `noindex` 메타 태그를 JavaScript로 변경/삭제하면 의도대로 작동 안 할 수 있음

### 2-8. 모바일 사이트 및 모바일 중심 색인 생성
- Google은 모바일 버전의 콘텐츠를 크롤링하여 색인 생성
- 반응형 웹 디자인이 가장 권장
- 모바일 버전에도 데스크톱과 동일한 콘텐츠·구조화된 데이터·메타 태그 포함 필수

### 2-9. 사이트 이전
- **호스팅만 변경**: URL 구조 유지, DNS 업데이트
- **URL 변경 이전**: 301 리디렉션 필수, Search Console에서 주소 변경 알림
- **A/B 테스트**: 클로킹으로 간주되지 않도록 `rel="canonical"` 설정

### 2-10. 삭제 및 정보 관리
- **페이지 삭제**: noindex 메타 태그 또는 410 상태 코드
- **이미지 삭제**: robots.txt로 이미지 크롤링 차단
- **임시 사이트 중지**: 503 상태 코드 반환 (1~2일 이하 권장)

---

## 3. 순위 및 검색 노출

### 3-1. 제목 링크 (Title Link)

#### Google의 제목 결정 소스
- `<title>` 요소의 콘텐츠
- 페이지의 시각적 제목/heading (`<h1>` 등)
- `og:title` 메타 태그
- 앵커 텍스트 및 링크 텍스트

#### 모범 사례
- 모든 페이지에 고유한 `<title>` 요소 포함
- 명확하고 간결한 텍스트 (불필요하게 긴 텍스트 회피)
- 키워드 반복 금지 (스팸으로 간주)
- 적절한 브랜딩 (하이픈/콜론으로 사이트명 구분)
- 페이지 주 언어와 `<title>` 언어 일치

### 3-2. 스니펫 (Snippet)

#### 생성 원리
- 사용자의 검색어와 가장 관련성 높은 페이지 콘텐츠에서 자동 생성
- 동일 페이지도 검색어에 따라 다른 스니펫 표시 가능

#### 메타 설명 작성 원칙
- 페이지별 고유 설명 작성 (모든 페이지 동일 설명 금지)
- 콘텐츠 관련 구체적 정보 포함 (저자, 날짜, 가격 등)
- 키워드 나열이 아닌 자연스러운 문장

### 3-3. 파비콘 (Favicon)

#### 기술 요구사항
- 정사각형 (가로세로 비율 1:1)
- 최소 8x8px, 권장 48x48px 이상
- 홈페이지 `<head>`에 `<link rel="icon" href="/favicon.ico">` 추가
- 사이트당 파비콘 1개 (호스트명 기준)
- URL 안정적 유지 (자주 변경 금지)

### 3-4. 사이트 이름 (Site Name)

#### 설정 방법 (JSON-LD)
```json
{
  "@context": "https://schema.org",
  "@type": "WebSite",
  "name": "사이트명",
  "alternateName": ["약자", "다른이름"],
  "url": "https://example.com/"
}
```
- 홈페이지에 설정 필수
- 간결하고 고유한 이름 선택
- 일반 명사 대신 브랜드 이름 사용

### 3-5. 이미지 검색 최적화

#### 핵심 권장사항
- 표준 HTML `<img>` 태그 사용 (CSS 배경 이미지는 인덱싱 안 됨)
- `alt` 속성에 설명적 텍스트 추가 (키워드 스터핑 금지)
- 설명적 파일명 사용 (`black-puppy-playing.jpg`)
- 지원 형식: BMP, GIF, JPEG, PNG, WebP, SVG, AVIF
- 이미지 사이트맵 제출
- 반응형 이미지: `srcset` 속성 또는 `<picture>` 요소 사용

### 3-6. Google 디스커버

#### 노출 조건
- Google에 색인 생성 필수
- 디스커버 콘텐츠 정책 준수
- 특별한 태그나 구조화된 데이터 불필요

#### 권장사항
- 클릭베이트/선정적 전략 금지
- 너비 1,200px 이상 고품질 이미지
- `og:image` 메타 태그 또는 schema.org 마크업 사용
- 텍스트가 많은 이미지 피하기

### 3-7. 페이지 경험 (Page Experience)

#### 자체 평가 체크리스트
- [ ] Core Web Vitals가 우수한가?
- [ ] HTTPS로 안전하게 제공되는가?
- [ ] 모바일 친화적인가?
- [ ] 과도한 광고가 없는가?
- [ ] 방해가 되는 전면 광고(인터스티셜)가 없는가?
- [ ] 주요 콘텐츠와 광고를 쉽게 구분할 수 있는가?

### 3-8. Core Web Vitals

| 지표 | 측정 항목 | 목표 기준 |
|------|----------|----------|
| **LCP** (Largest Contentful Paint) | 로드 성능 | 2.5초 이내 |
| **INP** (Interaction to Next Paint) | 사용자 응답성 | 200ms 미만 |
| **CLS** (Cumulative Layout Shift) | 시각적 안정성 | 0.1 미만 |

- Search Console Core Web Vitals 보고서로 확인
- PageSpeed Insights로 페이지별 성능 측정
- 완벽한 점수가 반드시 상위 순위를 보장하지 않음

### 3-9. 광고 관련 주의사항
- 콘텐츠 접근을 가리는 팝업 금지
- 콘텐츠를 읽기 위해 광고를 닫아야 하는 방식 금지
- 스크롤 중 갑자기 나타나는 광고 금지
- **핵심 콘텐츠를 방해하거나 주의를 분산시키는 과도한 수의 광고 금지**

### 3-10. 순위 시스템 가이드

#### 주요 순위 시스템

| 시스템 | 설명 |
|--------|------|
| **BERT** | 단어 조합의 다양한 의미와 의도 파악 AI |
| **PageRank/링크 분석** | 페이지 간 링크 구조로 관련성·신뢰성 판단 |
| **RankBrain** | 단어와 개념 간 관계를 이해하는 AI |
| **MUM** | 언어를 이해하고 생성하는 다중 모달 AI |
| **최신 정보 시스템** | 최근 정보가 중요한 검색에서 최신 콘텐츠 우선 |
| **원본 콘텐츠 시스템** | 인용만 한 콘텐츠보다 원본 콘텐츠 우선 |
| **신뢰할 수 있는 정보 시스템** | 공신력 있는 페이지 노출, 저품질 콘텐츠 강등 |
| **리뷰 시스템** | 전문가/애호가의 고품질 리뷰에 보상 |
| **사이트 다양성 시스템** | 동일 사이트에서 2개 이상 결과 표시 제한 |
| **스팸 감지 (SpamBrain)** | 스팸 정책 위반 콘텐츠 감지·대응 |
| **중복 삭제 시스템** | 유사 웹페이지 중 가장 관련성 높은 결과만 표시 |

### 3-11. 번역된 검색결과
- Google은 검색어 언어와 다른 언어의 관련 결과를 자동 번역하여 표시 가능
- 자동 번역은 개별 사용자에게만 표시되며, 별도 URL이 생성되지 않음

---

## 4. 구조화된 데이터

### 4-1. 기본 개념

#### 지원 형식
- **JSON-LD (권장)**: `<script>` 태그 내 삽입, 구현/유지보수 가장 용이
- 마이크로데이터, RDFa도 지원되나 JSON-LD 권장

#### 핵심 가이드라인
- 필수 속성을 모두 포함해야 리치 결과 표시
- **적지만 완전하고 정확한 데이터 > 많지만 부정확한 데이터**
- 페이지 콘텐츠를 설명하는 마크업만 사용 (사용자에게 보이지 않는 정보 금지)
- 빈 페이지에 구조화된 데이터만 보관하는 것 금지
- 리치 결과 테스트 도구로 유효성 검증

### 4-2. 주요 스키마 유형

#### Article (기사/블로그)
```json
{
  "@context": "https://schema.org",
  "@type": "NewsArticle",
  "headline": "기사 제목",
  "image": ["https://example.com/photo.jpg"],
  "datePublished": "2024-01-05T08:00:00+09:00",
  "dateModified": "2024-02-05T09:20:00+09:00",
  "author": [{"@type": "Person", "name": "저자", "url": "https://example.com/author"}]
}
```

#### BreadcrumbList (탐색경로)
```json
{
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  "itemListElement": [
    {"@type": "ListItem", "position": 1, "name": "홈", "item": "https://example.com/"},
    {"@type": "ListItem", "position": 2, "name": "카테고리", "item": "https://example.com/category"},
    {"@type": "ListItem", "position": 3, "name": "현재 페이지"}
  ]
}
```

#### FAQPage (자주 묻는 질문)
- 보건 당국/정부 사이트 중심으로 리치 결과 제공
- 각 질문에 답변 1개, 광고 목적 사용 금지

#### 기타 지원 유형
| 유형 | 용도 |
|------|------|
| WebApplication | 웹 애플리케이션 |
| Organization | 조직 정보 |
| Review / ReviewSnippet | 리뷰 |
| Product / MerchantListing | 제품/판매자 |
| Event | 이벤트 |
| HowTo | 단계별 가이드 |
| Recipe | 레시피 |
| Video | 동영상 |
| LocalBusiness | 지역 업체 |
| Course | 교육 과정 |
| JobPosting | 채용 정보 |
| SoftwareApp | 소프트웨어 앱 |
| Dataset | 데이터셋 |
| WebSite | 사이트 이름/검색 |

---

## 5. 모니터링 및 디버깅

### 5-1. Search Console 활용

#### 필수 설정
1. 사이트 소유권 확인
2. 색인 생성 범위 확인 (오류 수정)
3. 사이트맵 제출
4. 실적 모니터링 (검색어, 페이지별 트래픽)

#### 주요 보고서

| 보고서 | 용도 |
|--------|------|
| 색인 생성 범위 | 크롤링/색인 문제 파악 |
| URL 검사 | 특정 페이지 색인 상태 진단 |
| 실적 보고서 | 검색어/페이지별 트래픽 추적 |
| Core Web Vitals | 페이지 성능 분석 |
| 직접 조치 | 검색결과 제외 문제 확인 |
| 리치 결과 상태 | 구조화된 데이터 오류 검토 |
| 보안 문제 | 해킹/멀웨어 경고 |

### 5-2. 검색 트래픽 감소 디버깅
- 기술적 문제 (서버 다운, DNS 오류)
- 보안 문제 (해킹, 멀웨어)
- 직접 조치 (스팸 정책 위반)
- 알고리즘 변경 (핵심 업데이트)
- 검색 관심도 변화 (계절적/트렌드)

### 5-3. 보안 및 악용 방지

#### 사용자 생성 스팸 방지
- 댓글/포럼에 스팸 필터링
- CAPTCHA, 사용자 인증
- nofollow 속성으로 스팸 링크 가치 차단

#### 멀웨어/피싱 방지
- 정기적 보안 업데이트
- 강력한 비밀번호/2단계 인증
- 의심스러운 활동 모니터링
- Google 세이프 브라우징으로 경고 표시

### 5-4. 검색 연산자
- `site:example.com`: 특정 사이트의 색인 상태 확인
- `site:example.com 키워드`: 사이트 내 특정 콘텐츠 검색

---

## 6. 사이트별 가이드

### 6-1. 국제 및 다국어 사이트

#### URL 구조
- **하위 디렉터리 방식 권장**: `/ko/page`, `/en/page`
- Google은 URL로 언어를 구분하는 것을 권장 (쿠키/브라우저 설정 대신)

#### hreflang 구현
```html
<link rel="alternate" hreflang="ko" href="https://example.com/ko/page" />
<link rel="alternate" hreflang="en" href="https://example.com/en/page" />
<link rel="alternate" hreflang="x-default" href="https://example.com/ko/page" />
```

#### 필수 규칙
- 각 언어 버전은 자신 포함 모든 언어 버전 나열
- **양방향 링크 필수**: A→B이면 B→A도 있어야 함
- 정규화된 전체 URL 사용 (프로토콜 포함)
- ISO 639-1 언어코드 + ISO 3166-1 지역코드

#### 자동 리디렉션 금지
- 사용자 언어를 추측하여 자동 리디렉션하면 Google이 모든 버전을 크롤링 못 함
- 언어 선택기 UI 제공 권장

### 6-2. 전자상거래 사이트
- 제품 데이터를 Google Merchant Center와 공유
- 제품 구조화된 데이터 (Product, MerchantListing) 포함
- URL 구조: 카테고리/제품 계층으로 설계
- 페이지네이션: 무한 스크롤보다 페이지 번호 권장

---

## 7. 스팸 정책 (절대 위반하면 안 되는 것들)

### 7-1. 주요 스팸 유형

| 유형 | 설명 |
|------|------|
| **클로킹** | 검색엔진과 사용자에게 서로 다른 콘텐츠 표시 |
| **키워드 스터핑** | 순위 조작 목적으로 키워드 반복 채우기 |
| **숨겨진 텍스트/링크** | 사용자에게 보이지 않는 텍스트/링크 배치 |
| **링크 스팸** | 순위 조작 목적 링크 구매/판매/과도한 교환 |
| **확장된 콘텐츠 악용** | AI/자동화로 가치 없는 대량 페이지 생성 |
| **스크래핑** | 다른 사이트 콘텐츠 복사하여 가치 없이 게시 |
| **부적절한 리디렉션** | 사용자를 원래 의도와 다른 콘텐츠로 리디렉션 |
| **사이트 인지도 악용** | 기존 순위 신호 활용 목적 무관한 서드파티 콘텐츠 호스팅 |
| **도어웨이 악용** | 특정 검색어용 중간 페이지로 사용자 유도 |
| **만료된 도메인 악용** | 만료 도메인 구매하여 저품질 콘텐츠 호스팅 |
| **머신 생성 트래픽** | 자동 검색어 전송/검색결과 스크래핑 |
| **사기** | 사칭/거짓 정보로 사용자 유인 |

### 7-2. 허용되는 경우
- 아코디언/탭으로 추가 콘텐츠 숨기기 (사용자 상호작용으로 표시)
- 스크린 리더 전용 텍스트
- 광고/스폰서 링크에 `rel="nofollow"` 또는 `rel="sponsored"` 사용

---

## 8. clock-tani.com 적용 체크리스트

### 현재 준수 상태
- [x] HTTPS 사용
- [x] 모바일 반응형 디자인
- [x] 사이트맵 자동 생성 (`src/app/sitemap.ts`)
- [x] hreflang 태그 (ko/en 양방향)
- [x] canonical URL 설정
- [x] JSON-LD 구조화 데이터 (WebApplication, BreadcrumbList, Organization)
- [x] 설명적 URL 구조 (`/ko/clock`, `/en/timer` 등)
- [x] 메타 제목/설명 각 페이지별 고유
- [x] 개인정보처리방침, 이용약관, 소개, FAQ, 연락처 페이지
- [x] E-E-A-T: About 페이지에 개발자 소개, 서비스 연혁
- [x] 쿠키 동의 배너 (GDPR/AdSense 준수)
- [x] 파비콘 설정

### 작업 시 반드시 확인할 사항
- [ ] 새 페이지 추가 시: 메타데이터, canonical, hreflang, sitemap, 구조화된 데이터 포함 확인
- [ ] 콘텐츠 작성 시: 독창적이고 사용자에게 유용한 내용인지 확인
- [ ] 페이지 삭제 시: 301 리디렉션 설정, 사이트맵에서 제거
- [ ] URL 변경 시: 301 리디렉션, canonical URL 업데이트
- [ ] 광고 추가 시: 콘텐츠 접근을 방해하지 않는지 확인
- [ ] 구조화된 데이터 추가 시: 리치 결과 테스트 도구로 검증
- [ ] 이미지 추가 시: alt 속성 작성, 관련 텍스트 근처 배치, 설명적 파일명
- [ ] 외부 링크 추가 시: 신뢰할 수 없는 경우 `rel="nofollow"` 사용
- [ ] JavaScript 변경 시: 크롤링 가능한 `<a href>` 링크 유지 확인
- [ ] Core Web Vitals: LCP 2.5초 이내, INP 200ms 미만, CLS 0.1 미만 유지

---

## 참고 링크

### 검색엔진 최적화 기초
- [SEO 기본 가이드](https://developers.google.com/search/docs/fundamentals/seo-starter-guide?hl=ko)
- [Google 검색 작동 방식](https://developers.google.com/search/docs/fundamentals/how-search-works?hl=ko)
- [유용한 콘텐츠 제작](https://developers.google.com/search/docs/fundamentals/creating-helpful-content?hl=ko)
- [생성형 AI 사용 안내](https://developers.google.com/search/docs/fundamentals/using-gen-ai-content?hl=ko)

### 크롤링 및 색인 생성
- [사이트맵](https://developers.google.com/search/docs/crawling-indexing/sitemaps/overview?hl=ko)
- [robots.txt](https://developers.google.com/search/docs/crawling-indexing/robots/intro?hl=ko)
- [메타 태그](https://developers.google.com/search/docs/crawling-indexing/special-tags?hl=ko)
- [로봇 메타 태그](https://developers.google.com/search/docs/crawling-indexing/robots-meta-tag?hl=ko)
- [URL 표준화](https://developers.google.com/search/docs/crawling-indexing/consolidate-duplicate-urls?hl=ko)
- [리디렉션](https://developers.google.com/search/docs/crawling-indexing/301-redirects?hl=ko)
- [JavaScript SEO](https://developers.google.com/search/docs/crawling-indexing/javascript/javascript-seo-basics?hl=ko)

### 순위 및 검색 노출
- [제목 링크](https://developers.google.com/search/docs/appearance/title-link?hl=ko)
- [스니펫](https://developers.google.com/search/docs/appearance/snippet?hl=ko)
- [파비콘](https://developers.google.com/search/docs/appearance/favicon-in-search?hl=ko)
- [사이트 이름](https://developers.google.com/search/docs/appearance/site-names?hl=ko)
- [이미지 검색](https://developers.google.com/search/docs/appearance/google-images?hl=ko)
- [Google 디스커버](https://developers.google.com/search/docs/appearance/google-discover?hl=ko)
- [페이지 경험](https://developers.google.com/search/docs/appearance/page-experience?hl=ko)
- [Core Web Vitals](https://developers.google.com/search/docs/appearance/core-web-vitals?hl=ko)
- [순위 시스템 가이드](https://developers.google.com/search/docs/appearance/ranking-systems-guide?hl=ko)
- [구조화된 데이터](https://developers.google.com/search/docs/appearance/structured-data/intro-structured-data?hl=ko)

### 모니터링 및 디버깅
- [Search Console 시작](https://developers.google.com/search/docs/monitor-debug/search-console-start?hl=ko)
- [트래픽 감소 디버그](https://developers.google.com/search/docs/monitor-debug/debugging-search-traffic-drops?hl=ko)
- [보안](https://developers.google.com/search/docs/monitor-debug/security?hl=ko)

### 사이트별 가이드
- [국제화 — 다국어 사이트 관리](https://developers.google.com/search/docs/specialty/international/managing-multi-regional-sites?hl=ko)
- [국제화 — hreflang](https://developers.google.com/search/docs/specialty/international/localized-versions?hl=ko)
- [국제화 — 언어 적응형 페이지](https://developers.google.com/search/docs/specialty/international/locale-adaptive-pages?hl=ko)
- [스팸 정책](https://developers.google.com/search/docs/essentials/spam-policies?hl=ko)
