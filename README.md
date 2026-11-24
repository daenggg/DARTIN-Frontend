# DARTIN

기업명 하나로 재무제표, 최신 뉴스, AI 분석, 채용공고 링크를 한 번에 조회하고 AI와 대화로 기업 정보를 탐색할 수 있는 웹 서비스입니다.

<br>

![DARTIN 로그인 페이지](./login-preview.jpg)

<br>

## 주요 기능

| 기능 | 설명 |
|------|------|
| 기업 검색 | 키워드로 상장 기업 검색, 동명 기업 후보 선택 지원 |
| 기업 대시보드 | 기업 기본 정보, 연도별 재무제표, 최신 뉴스, AI 한줄평 |
| 채용공고 연결 | 사람인 / 원티드 / Work24 채용 링크 바로가기 |
| AI 채팅 | 기업에 대해 AI와 실시간 스트리밍 질의응답 (SSE) |
| 채팅 히스토리 | 대화 세션 저장 및 불러오기, 핀 고정 |
| 카카오 로그인 | 카카오 OAuth 2.0 소셜 로그인 |
| 다크모드 | 라이트 / 다크 테마 전환 |

<br>

## 기술 스택

| 분류 | 기술 |
|------|------|
| Framework | React 19, TypeScript |
| Build Tool | Vite |
| Styling | Tailwind CSS v4 |
| Routing | React Router DOM v7 |
| HTTP | Axios, Fetch API (SSE) |
| Chart | Chart.js, react-chartjs-2 |
| Deploy | Vercel |

<br>

## 프로젝트 구조

```
src/
├── components/
│   ├── chat/           # AI 채팅 영역, 채팅 히스토리 사이드바
│   ├── common/         # 공통 모달, 마크다운 렌더러, 온보딩
│   ├── company/        # 기업 대시보드 (재무, 뉴스, 기업정보 탭)
│   ├── layout/         # 헤더
│   └── login/          # 로그인 프리뷰 카드
├── hooks/              # 커스텀 훅
├── pages/              # 라우팅 페이지 (Login, Home, NotFound)
├── services/           # API 통신 (auth, chat, company)
└── types/              # 공통 TypeScript 타입 정의
```

<br>

## 시작하기

```bash
# 의존성 설치
npm install

# 개발 서버 실행
npm run dev

# 빌드
npm run build
```

### 환경 변수 설정

`.env` 파일을 생성하고 아래 변수를 설정하세요.

```env
VITE_KAKAO_REST_API_KEY=your_kakao_rest_api_key
VITE_KAKAO_REDIRECT_URI=your_redirect_uri
VITE_BACKEND_URL=your_backend_api_url
```

<br>

## 관련 링크

- Backend Repository: [DARTIN-Backend](https://github.com/daenggg/DARTIN-Backend)
- 배포 URL: https://go-wests-frontend.vercel.app
