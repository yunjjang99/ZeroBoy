# ZeroBoy Desktop Application

ZeroBoy는 암호화폐 헤징 및 차익거래 봇을 위한 데스크톱 애플리케이션입니다. 일렉트론 기반으로 구축되어 백엔드 서버와 SQLite 데이터베이스를 포함한 완전한 패키징을 제공합니다.

## 🚀 주요 기능

- **브라우저 프로필 관리**: Puppeteer를 통한 브라우저 인스턴스 생성 및 관리
- **SQLite 데이터베이스**: 로컬 데이터 저장 및 관리
- **다크/라이트 테마**: 사용자 친화적인 UI 테마 지원
- **다국어 지원**: 한국어/영어 언어 전환
- **Tanstack Query**: 효율적인 API 상태 관리
- **커스텀 알림 시스템**: 네이티브 alert/confirm 대체

## 📋 시스템 요구사항

- **Node.js**: 20.16.0 이상
- **npm**: 9.0.0 이상
- **운영체제**: Windows, macOS, Linux

## 🛠️ 설치 및 실행

### 1. 저장소 클론

```bash
git clone https://github.com/yunjjang99/ZeroBoy.git
cd ZeroBoy
```

### 2. 의존성 설치

```bash
npm run install:all
```

### 3. 개발 모드 실행

```bash
# 백엔드와 프론트엔드를 동시에 실행
npm run dev

# 또는 개별 실행
npm run dev:backend  # 백엔드만 (포트 7777)
npm run dev:frontend # 프론트엔드만 (포트 5173)
```

## 🏗️ 빌드 및 패키징

### 완전한 데스크톱 앱 빌드

```bash
# 자동 빌드 스크립트 실행
./build.sh

# 또는 수동 빌드
npm run build        # 백엔드 + 프론트엔드 빌드
npm run package      # 일렉트론 앱 패키징
```

### 빌드 결과물

- **백엔드**: `backend/dist/`
- **프론트엔드**: `frontend/dist/`
- **일렉트론 앱**: `frontend/release/`

## 📁 프로젝트 구조

```
ZeroBoy/
├── backend/                 # NestJS 백엔드
│   ├── src/
│   │   ├── fingerprint/     # 브라우저 프로필 관리
│   │   ├── puppeteer/       # 브라우저 자동화
│   │   └── user/           # 사용자 관리
│   ├── data/               # SQLite 데이터베이스
│   └── dist/               # 빌드 결과물
├── frontend/               # React + Electron 프론트엔드
│   ├── src/
│   │   ├── components/     # React 컴포넌트
│   │   ├── api/           # API 호출 함수
│   │   ├── hooks/         # Tanstack Query 훅
│   │   └── contexts/      # React Context
│   ├── electron/          # Electron 메인 프로세스
│   └── dist/              # 빌드 결과물
├── build.sh               # 자동 빌드 스크립트
└── package.json           # 루트 설정
```

## 🔧 기술 스택

### 백엔드

- **NestJS**: Node.js 프레임워크
- **TypeORM**: SQLite ORM
- **Puppeteer**: 브라우저 자동화
- **Socket.io**: 실시간 통신

### 프론트엔드

- **React 18**: UI 라이브러리
- **Electron**: 데스크톱 앱 프레임워크
- **Tanstack Query**: 서버 상태 관리
- **Tailwind CSS**: 스타일링
- **TypeScript**: 타입 안전성

## 🎯 주요 API 엔드포인트

### 브라우저 프로필 관리

- `GET /fingerprint/profiles` - 프로필 목록 조회
- `POST /fingerprint/profiles` - 새 프로필 생성
- `DELETE /fingerprint/profiles/:uuid` - 프로필 삭제

### Puppeteer 브라우저 제어

- `POST /puppeteer/launch` - 새 브라우저 실행
- `POST /puppeteer/reopen` - 브라우저 재시작
- `GET /puppeteer/status` - 브라우저 상태 조회

## 🎨 UI 컴포넌트

- **BrowserProfilesSection**: 브라우저 프로필 목록 표시
- **BrowserProfileCard**: 개별 프로필 카드
- **AlertModal**: 커스텀 알림 모달
- **ConfirmModal**: 커스텀 확인 모달
- **Toast**: 토스트 알림
- **UrlInputModal**: URL 입력 모달

## 🔄 개발 워크플로우

1. **백엔드 개발**: NestJS 컨트롤러 및 서비스 수정
2. **프론트엔드 개발**: React 컴포넌트 및 API 연동
3. **테스트**: 개발 모드에서 기능 테스트
4. **빌드**: 프로덕션 빌드 및 패키징
5. **배포**: 일렉트론 앱 배포

## 🐛 문제 해결

### 백엔드 서버 연결 오류

- 포트 7777이 사용 가능한지 확인
- 백엔드 빌드가 완료되었는지 확인

### SQLite 데이터베이스 오류

- `backend/data/` 디렉토리 존재 확인
- 데이터베이스 파일 권한 확인

### 일렉트론 빌드 오류

- Node.js 버전 확인 (20.16.0 이상)
- 모든 의존성 설치 확인

## 📝 라이선스

ISC License

## 🤝 기여하기

1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the Branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📞 지원

- **이슈**: [GitHub Issues](https://github.com/yunjjang99/ZeroBoy/issues)
- **문서**: [GitHub Wiki](https://github.com/yunjjang99/ZeroBoy/wiki)
