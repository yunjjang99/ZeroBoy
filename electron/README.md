# ZeroBoy Electron

ZeroBoy 데스크톱 애플리케이션을 위한 Electron 설정입니다.

## 구조

```
electron/
├── src/
│   ├── main.ts          # 메인 프로세스
│   ├── preload.ts       # 프리로드 스크립트
│   └── update.ts        # 업데이트 관련
├── dist/                # TypeScript 컴파일 결과물
├── resources/           # 앱 아이콘 및 리소스
├── package.json         # Electron 의존성 및 빌드 설정
├── tsconfig.json        # TypeScript 설정
└── README.md
```

## 설치

```bash
cd electron
npm install
```

## 개발 모드 실행

```bash
# TypeScript 컴파일 및 Electron 실행
npm run dev

# 또는 개별 실행
npm run build  # TypeScript 컴파일
npm start      # Electron 실행
```

## 빌드

### 개발 빌드

```bash
npm run pack
```

### 배포용 빌드

```bash
npm run dist
```

## 빌드 설정

- **Windows**: NSIS 인스톨러
- **macOS**: DMG 파일
- **Linux**: AppImage

## 주의사항

1. Electron 앱을 실행하기 전에 백엔드와 프론트엔드가 먼저 빌드되어야 합니다.
2. 개발 모드에서는 프론트엔드 개발 서버가 자동으로 시작됩니다.
3. 프로덕션 모드에서는 빌드된 정적 파일을 사용합니다.
4. TypeScript로 작성되어 있어 타입 안정성을 보장합니다.

## 의존성

- electron: ^37.2.5
- electron-builder: ^24.13.3
- electron-packager: ^15.3.0
- typescript: ^5.0.0
