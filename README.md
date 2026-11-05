# 한자리 프론트

정기 모임의 선착순 신청, 출석, 노쇼 관리 서비스 [한자리](https://github.com/zemiles/hanjari)의 웹 화면입니다.

## 기술

React 19, TypeScript, Vite, Tailwind CSS 4, React Router 8, TanStack Query 5, MSW 3

## 실행

필요한 것: Node.js 22.22 이상

```bash
npm install
npm run dev
```

- 개발 모드는 기본으로 **MSW 목업**을 켭니다. 백엔드 없이 화면을 확인할 수 있습니다.
- 실제 백엔드(로컬 8080)에 붙이려면 `.env.development.local`에 `VITE_USE_MOCK=false`를 둡니다. `/api` 요청은 Vite 프록시가 백엔드로 넘깁니다.
- 운영 모드에서는 MSW 목업을 시작하지 않습니다. 실제 API 연동이 필요합니다.

## 현재 구현 범위

HJR-94의 프론트 공통 기반입니다. 라우터·레이아웃·공통 컴포넌트·API 클라이언트·CSRF 처리·인증 화면 보호와 MSW 목업을 포함합니다.

로그인 화면의 계정 전환은 개발 목업용입니다. 실제 카카오 로그인과 각 기능 화면은 후속 티켓에서 구현하며, 아직 화면 틀인 경로에는 해당 Jira 번호를 표시합니다.

## 검증과 PR

Node.js 22.22 이상에서 실행합니다.

```bash
npm run lint
npm run build
```

HJR-94 변경은 작업 브랜치의 한 PR로 묶어 `develop`에 머지합니다. `main`·`develop`은 보호 브랜치이며 PR과 `Lint and build` CI 통과가 필요합니다.

## 구조

| 폴더 | 내용 |
|---|---|
| `src/api` | API 클라이언트(CSRF 토큰·에러 처리), 계약 타입, 에러 코드, Query 설정 |
| `src/auth` | 로그인 상태(`useMe`), 로그인이 필요한 화면 보호, 돌아갈 주소 검증 |
| `src/app` | 라우터, 화면 목록, 레이아웃 |
| `src/components` | 공통 컴포넌트 (버튼, 입력칸, 확인 창, 알림, 빈 상태) |
| `src/pages` | 화면 |
| `src/mocks` | MSW 목업 (API 계약 그대로) |

## 규칙

- API 요청·응답은 백엔드 저장소의 `docs/api-contract.md`를 따릅니다. 계약이 바뀌면 계약 문서를 먼저 고칩니다.
- 사용자 입력(닉네임, 코드, 위치)은 주소에 넣지 않고 본문으로 보냅니다.
- 로그인은 HttpOnly 세션 쿠키라 프론트는 세션 값을 다루지 않습니다.
- CSRF는 Spring Security 기본 토큰입니다. API 클라이언트가 `XSRF-TOKEN` 쿠키 값을 `X-XSRF-TOKEN` 헤더로 보내고, 앱 시작·로그인·로그아웃 뒤 `GET /api/csrf`로 새 토큰을 받습니다.
