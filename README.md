# ZeroBoy - Advanced Anti-Detection Browser Management System

ZeroBoy는 고급 안티디텍팅 기술을 활용한 브라우저 관리 시스템입니다. NestJS, React, Electron, camoufox-js를 조합하여 강력한 웹 지문 관리 및 브라우저 자동화 기능을 제공합니다.

## 🏗️ 아키텍처

```
ZeroBoy/
├── backend/              # NestJS 서버 (포트: 7778)
│   ├── src/
│   │   ├── puppeteer/    # camoufox-js + Playwright 기반 브라우저 관리
│   │   └── utils/        # 지문 생성 및 관리
│   └── package.json
├── frontend/            # React 앱
│   ├── src/
│   │   ├── components/  # UI 컴포넌트
│   │   ├── pages/       # 페이지 컴포넌트
│   │   └── api/         # API 클라이언트
│   └── package.json
├── electron/            # Electron 데스크탑 앱
│   ├── src/
│   └── package.json
├── data/               # Chrome 바이너리 및 데이터
│   └── chrome/
└── package.json        # 프로젝트 루트 설정
```

## 🚀 주요 기능

### 1. **고급 안티디텍팅 브라우저**

- **camoufox-js**: Playwright 기반의 강력한 안티디텍팅 브라우저
- **실제 사용자 시뮬레이션**: 자연스러운 마우스 움직임, 키보드 입력
- **웹 지문 관리**: Canvas, WebGL, Screen, Navigator 속성 조작

### 2. **고급 안티디텍팅**

- **웹 지문 관리**: Canvas, WebGL, Screen, Navigator 속성 조작
- **자동화 감지 방지**: webdriver, selenium, puppeteer 속성 완전 제거
- **실제 사용자 시뮬레이션**: 자연스러운 마우스 움직임, 키보드 입력

### 3. **단일 서버 아키텍처**

- **NestJS 서버**: 메인 API 및 모든 브라우저 관리
- **camoufox-js**: Node.js 환경에서 직접 실행되는 안티디텍팅 브라우저
- **Playwright**: 강력한 브라우저 자동화 엔진

## 🛠️ 설치 및 실행

### 1. **전체 프로젝트 설정**

```bash
# 프로젝트 클론
git clone <repository-url>
cd ZeroBoy

# 전체 의존성 설치 (Playwright 브라우저 포함)
npm run setup
```

### 2. **개별 서버 실행**

```bash
# 개발 모드 (모든 서버 동시 실행)
npm run start:dev

# 프로덕션 모드
npm run start
```

### 3. **개별 서버 실행**

```bash
# NestJS 서버만
npm run start:backend:dev

# React 프론트엔드만
npm run start:frontend:dev
```

## 📊 API 엔드포인트

### NestJS 서버 (포트: 7778)

```
POST   /puppeteer/browser/create     # Camoufox 브라우저 생성
GET    /puppeteer/browser/:uuid      # 브라우저 상태 조회
POST   /puppeteer/browser/:uuid/reopen  # 브라우저 재시작
DELETE /puppeteer/browser/:uuid      # 브라우저 종료
GET    /puppeteer/browsers           # 모든 브라우저 목록
```

## 🔧 환경 변수

```bash
# NestJS 서버
NODE_ENV=production
BACKEND_PORT=7778
DB_PATH=./data/db/db.sqlite
CHROME_PATH=/Applications/Google Chrome.app/Contents/MacOS/Google Chrome
```

## 🏗️ 빌드 및 배포

### 1. **개발 빌드**

```bash
# 백엔드 빌드
npm run build:backend

# 프론트엔드 빌드
npm run build:frontend

# Electron 빌드
npm run build:electron
```

### 2. **전체 빌드**

```bash
npm run build
```

### 3. **배포 패키지 생성**

```bash
# 개발용 패키지
npm run pack

# 배포용 패키지
npm run dist
```

## 🧪 테스트

```bash
# 전체 테스트
npm run test

# 백엔드 테스트만
npm run test:backend

# 프론트엔드 테스트만
npm run test:frontend
```

## 📝 코드 품질

```bash
# 전체 린트
npm run lint

# 백엔드 린트만
npm run lint:backend

# 프론트엔드 린트만
npm run lint:frontend
```

## 🔍 안티디텍팅 기능

### 1. **웹 지문 관리**

- **Canvas 조작 방지**: Canvas 함수 원본 유지
- **WebGL 속성 조작**: GPU 정보만 최소한으로 수정
- **Screen 속성**: 실제 화면 크기와 일치
- **Navigator 속성**: 언어, 플랫폼, 하드웨어 정보 관리

### 2. **자동화 감지 방지**

- **webdriver 속성 완전 제거**: navigator, window, document에서 모두 제거
- **프로토타입 체인 순회**: 상속된 속성까지 완전 제거
- **toString 오버라이드**: 자동화 관련 문자열 완전 차단
- **지속적인 모니터링**: setInterval로 지속적인 webdriver 제거

### 3. **실제 사용자 시뮬레이션**

- **자연스러운 지연**: geolocation 요청에 랜덤 지연
- **실제 화면 크기**: 고정 크기 대신 실제 화면 크기 사용
- **Chrome 버전 일치**: UserAgent와 실제 브라우저 버전 일치

## 🚀 camoufox-js + Playwright 장점

### 1. **단순한 아키텍처**

- Python 서버 불필요
- Node.js 환경에서 직접 실행
- 빌드/배포 프로세스 단순화

### 2. **강력한 안티디텍팅**

- camoufox-js의 고급 안티디텍팅 기능
- Playwright의 안정적인 브라우저 자동화
- 실제 사용자와 동일한 환경 시뮬레이션

### 3. **개발 편의성**

- TypeScript 지원
- NestJS와 완벽 통합
- 단일 언어 스택 (JavaScript/TypeScript)

## 🤝 기여하기

1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the Branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 라이선스

이 프로젝트는 MIT 라이선스 하에 배포됩니다. 자세한 내용은 `LICENSE` 파일을 참조하세요.

## 📞 지원

- **이슈 리포트**: GitHub Issues
- **문서**: [Wiki](https://github.com/your-repo/wiki)
- **이메일**: support@zeroboy.com

## 🙏 감사의 말

- [camoufox-js](https://github.com/apify/camoufox-js)
- [Playwright](https://playwright.dev/)
- [NestJS](https://nestjs.com/)
- [React](https://reactjs.org/)
- [Electron](https://www.electronjs.org/)
