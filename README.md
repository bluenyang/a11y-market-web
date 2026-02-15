# 🛒 A11yMarket Web (Client)

[![React](https://img.shields.io/badge/React-19.0-61DAFB?logo=react&logoColor=black)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue?logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Vite](https://img.shields.io/badge/Vite-7.0-646CFF?logo=vite)](https://vitejs.dev/)
[![Zustand](https://img.shields.io/badge/Zustand-5.0-orange?logo=react)](https://zustand-demo.pmnd.rs/)
[![TanStack Query](https://img.shields.io/badge/TanStack%20Query-5.0-FF4154?logo=react-query&logoColor=white)](https://tanstack.com/query/latest)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-CSS-06B6D4?logo=tailwindcss)](https://tailwindcss.com/)
[![Docker](https://img.shields.io/badge/Docker-Enabled-blue?logo=docker)](https://www.docker.com/)
[![License](https://img.shields.io/badge/License-MIT-lightgrey.svg)](LICENSE)

**A11yMarket Web**은 누구나 장벽 없이 쇼핑할 수 있는 **접근성(Accessibility, A11y) 중심의 중개 이커머스 클라이언트**입니다.
TanStack Router 기반의 SPA(Single Page Application)로 구축되었으며, 자체적인 접근성 오버레이와 맞춤형 프로필 기능을 통해 디지털 소외 계층에게 최적화된 쇼핑 경험을 제공합니다.

---

## 📖 목차 (Table of Contents)

- [프로젝트 소개 (Introduction)](#-프로젝트-소개-introduction)
- [주요 기능 (Key Features)](#-주요-기능-key-features)
- [접근성 기능 (Accessibility Features)](#-접근성-기능-accessibility-features)
- [기술 스택 (Tech Stack)](#-기술-스택-tech-stack)
- [폴더 구조 (Project Structure)](#-폴더-구조-project-structure)
- [시작하기 (Getting Started)](#-시작하기-getting-started)
- [배포 가이드 (Deployment)](#-배포-가이드-deployment)
- [설정 가이드 (Configuration)](#-설정-가이드-configuration)

---

## 📢 프로젝트 소개 (Introduction)

A11yMarket Web은 단순한 쇼핑몰을 넘어, **포용적인 사용자 경험(Inclusive UX)**을 지향합니다.
저시력자, 색각 이상자, 고령자 등 다양한 사용자가 자신의 신체적 특성에 맞춰 UI를 조절할 수 있으며, AI가 분석한 이미지를 음성으로 듣거나 요약된 정보로 확인할 수 있습니다.

![MainPage](./.github/resources/1.png)

---

## ✨ 주요 기능 (Key Features)

### 🛍️ 이커머스 핵심 기능

- **상품 탐색 & 검색:** 카테고리별 상품 조회 및 필터링
- **장바구니 & 주문:** 실시간 재고 확인, 장바구니 관리, 배송지 관리
- **결제 시스템:** **Toss Payments** 연동을 통한 안전하고 간편한 결제
- **판매자 대시보드:** 매출 통계, 주문 처리 현황, 클레임 관리를 시각화된 차트(Recharts)로 제공
- **소셜 로그인:** 카카오(Kakao) OAuth2 간편 로그인 및 자동 회원가입

### 🤖 AI 연동 기능

- **이미지 읽어주기:** 백엔드(Gemini)와 연동하여 상품 이미지의 내용을 텍스트 및 음성(TTS)으로 제공
- **스마트 요약:** 복잡한 상품 상세 정보를 AI가 핵심만 요약하여 노출

---

## ♿ 접근성 기능 (Accessibility Features)

별도의 스크린 리더 없이도 웹 자체적으로 제공하는 **접근성 오버레이(Global A11y Overlay)**가 핵심입니다.

![이미지3:접근성 설정 오버레이 및 적용 화면 GIF](./.github/resources/2.gif)

| 기능                     | 설명                                                               |
| :----------------------- | :----------------------------------------------------------------- |
| **Global A11y Menu**     | 모든 페이지 우측 하단에 플로팅 버튼으로 접근성 설정 메뉴 제공      |
| **맞춤형 프로필**        | 글자 크기, 색상 대비, 커서 크기 등의 설정을 프로필로 저장/불러오기 |
| **고대비 모드**          | 시인성을 극대화한 고대비(High Contrast) 테마 전환                  |
| **TTS (Text-to-Speech)** | 상품명, 가격, 설명 등 주요 텍스트 정보를 음성으로 읽어주는 기능    |
| **가독성 향상**          | 난독증 배려 폰트, 커서 크기 확대, 줄 간격 조절 등 세부 옵션 제공   |

---

## 🛠 기술 스택 (Tech Stack)

최신 React 생태계 기술을 적극 도입하여 성능과 개발 생산성을 확보했습니다.

| 분류              | 기술            | 비고                            |
| :---------------- | :-------------- | :------------------------------ |
| **Core**          | React 19.0      | Library                         |
| **Build Tool**    | Vite 7.3        | Bundler                         |
| **Routing**       | TanStack Router | File-based Routing              |
| **State Mngt**    | Zustand         | Global State (Auth, Cart, A11y) |
| **Data Fetching** | TanStack Query  | Server State & Caching          |
| **Styling**       | Tailwind CSS    | Utility-first CSS               |
| **UI Components** | Shadcn/UI       | Radix UI 기반 Headless 컴포넌트 |
| **Visualization** | Recharts        | 판매자 대시보드 차트            |
| **Infra**         | Docker, Nginx   | Container & Web Server          |

---

## 📂 프로젝트 구조 (Project Structure)

TanStack Router의 파일 기반 라우팅 규칙을 따릅니다.

```bash
src/
├── api/             # Axios 인스턴스 및 도메인별 API 함수
├── assets/          # 정적 자원 (이미지, 폰트 등)
├── components/      # UI 컴포넌트
│   ├── accessibility/ # 접근성 오버레이 관련
│   ├── seller/        # 판매자 대시보드 관련
│   └── ui/            # Shadcn/UI 공통 컴포넌트
├── constants/       # 애플리케이션 전역 상수
├── hooks/           # Custom Hooks (useA11yEffect 등)
├── lib/             # 유틸리티 함수 및 상수
├── routes/          # 페이지 라우팅 정의 (File-based)
│   ├── _auth/         # 로그인/회원가입 (Layout 공유)
│   ├── _error/        # 에러 페이지 (404, 500)
│   ├── _need-auth/    # 인증 필요 페이지 (마이페이지, 판매자)
│   │   ├── _admin/      # 관리자 전용 페이지
│   │   ├── _seller/     # 판매자 전용 페이지
│   │   ├── cart/        # 장바구니 페이지
│   │   ├── mypage/      # 마이페이지
│   │   └── order/       # 주문/결제 페이지
│   ├── product/       # 상품 조회 및 상세 페이지
│   ├── seller/        # 판매자 정보 조회 페이지
│   ├── _root.jsx      # 루트 레이아웃
│   └── index.jsx      # 메인 페이지
└── store/           # Zustand Global Stores
```

---

## 🚀 시작하기 (Getting Started)

로컬 개발 환경에서 프로젝트를 실행하는 방법입니다.

### 사전 요구사항 (Prerequisites)

- Node.js 18+
- Yarn 4+ (Corepack enabled recommended)

### 설치 및 실행

1.  **레포지토리 클론**

    ```bash
    git clone https://github.com/gamesung-coding/a11y-market-web.git
    cd a11y-market-web
    ```

2.  **의존성 설치 및 에디터 설정**

    이 프로젝트는 **Yarn PnP**와 **Offline Cache**를 사용합니다.
    의존성 파일들은 리포지토리에 포함되어 있지만(`.yarn/cache`), PnP 로더 파일(`.pnp.cjs`) 생성을 위해 **최초 1회 설치 과정**이 필요합니다.

    ```bash
    yarn install
    ```

    > **Note:** 의존성이 캐시되어 있으므로 설치는 매우 빠르게 완료됩니다.

    **VS Code**를 사용하는 경우, 올바른 타입 인식을 위해 다음 명령어를 실행하여 SDK를 설정하고 **워크스페이스 버전의 TypeScript**를 사용하도록 허용해야 합니다.

    ```bash
    yarn dlx @yarnpkg/sdks vscode
    ```

    > 명령 실행 후 VS Code 우측 하단에서 TypeScript 버전 선택 알림이 뜨면 **"Use Workspace Version"**을 클릭해주세요.

3.  **환경 변수 설정 (.env)**
    `.env` 파일을 생성하고 필요한 값을 입력합니다.

    ```bash
    cp ./.env.example .env
    ```

    | 변수명                   | 설명                          | 예시                         |
    | :----------------------- | :---------------------------- | :--------------------------- |
    | **VITE_API_BASE_URL**    | 백엔드 API 주소               | `https://api.a11ymarket.com` |
    | **VITE_MINIO_ENDPOINT**  | MinIO 서버 주소               | `minio.a11ymarket.com`       |
    | **DEBUG**                | 디버그 모드 설정 (true/false) | `false`                      |
    | **VITE_TOSS_CLIENT_KEY** | Toss Payments 클라이언트 키   | `test_ck_****************`   |

4.  **개발 서버 실행**
    ```bash
    yarn dev
    ```
    브라우저에서 `http://localhost:5173`으로 접속합니다.

---

## 🐳 배포 가이드 (Deployment)

운영(Production) 환경에서는 Docker 이미지를 사용하여 Nginx 웹 서버 위에서 구동됩니다.

### 1. 배포 파일 준비

프로젝트의 `.docker` 폴더 내에 있는 다음 두 파일을 배포 서버의 동일한 경로에 위치시킵니다.

- `docker-compose.production.yaml`
- `.env`

### 2. 환경 변수 설정 (.env)

`.env` 파일을 생성(또는 수정)하여 운영 환경에 맞는 값을 설정합니다.

| 변수명        | 설명        | 예시             |
| :------------ | :---------- | :--------------- |
| **HOST_NAME** | 도메인 이름 | `a11ymarket.com` |

### 3. 서비스 실행

GHCR(GitHub Container Registry)에서 최신 이미지를 받아와 실행합니다.

```bash
# 1. 최신 이미지 Pull (GHCR)
docker compose -f docker-compose.production.yaml pull

# 2. 컨테이너 실행 (Background)
docker compose -f docker-compose.production.yaml up -d
```

> **Tip:** 별도의 빌드 과정 없이, GitHub Actions를 통해 빌드된 최신 이미지를 즉시 배포할 수 있습니다.

---

## 🤝 Contributing

접근성 개선에 대한 아이디어나 버그 제보는 언제나 환영합니다!

1.  Fork the Project
2.  Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3.  Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4.  Push to the Branch (`git push origin feature/AmazingFeature`)
5.  Open a Pull Request
