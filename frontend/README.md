# ZeroBoy Frontend

ZeroBoy의 데스크톱 프론트엔드 애플리케이션입니다. Electron과 React, Tailwind CSS를 사용하여 구축되었습니다.

## 기술 스택

- **Electron**: 데스크톱 애플리케이션 프레임워크
- **React**: UI 라이브러리
- **TypeScript**: 타입 안전성
- **Vite**: 빌드 도구 및 개발 서버
- **Tailwind CSS**: 유틸리티 우선 CSS 프레임워크
- **Electron Builder**: 애플리케이션 패키징

## 설치 및 실행

### 의존성 설치

```bash
npm install
```

### 개발 모드 실행

```bash
# 개발 서버와 Electron을 동시에 실행
npm run electron:dev

# 또는 개별적으로 실행
npm run dev        # Vite 개발 서버만 실행
npm run electron   # Electron만 실행 (포트 5173 대기)
```

### 빌드

```bash
# 프로덕션 빌드
npm run build

# Electron 애플리케이션 빌드 (실행 파일 생성)
npm run electron:build

# 빌드된 애플리케이션 미리보기
npm run electron:preview
```

## 프로젝트 구조

```
frontend/
├── electron/           # Electron 메인 프로세스 파일들
│   ├── main.ts        # 메인 프로세스 진입점
│   ├── preload.ts     # 프리로드 스크립트
│   └── update.ts      # 업데이트 관련
├── src/               # React 소스 코드
│   ├── App.tsx        # 메인 앱 컴포넌트
│   ├── main.tsx       # React 진입점
│   └── index.css      # 전역 스타일 (Tailwind CSS)
├── dist/              # 빌드된 파일들
├── dist-electron/     # Electron 빌드 파일들
├── tailwind.config.js # Tailwind CSS 설정
├── postcss.config.js  # PostCSS 설정
├── vite.config.ts     # Vite 설정
└── package.json       # 프로젝트 설정
```

## 스크립트

- `npm run dev`: Vite 개발 서버 실행
- `npm run build`: 프로덕션 빌드
- `npm run preview`: 빌드된 앱 미리보기
- `npm run electron`: Electron 실행 (포트 5173 대기)
- `npm run electron:dev`: 개발 모드로 Electron 실행
- `npm run electron:build`: Electron 애플리케이션 빌드
- `npm run electron:preview`: 빌드된 Electron 앱 미리보기

## Tailwind CSS 사용법

이 프로젝트는 Tailwind CSS를 사용합니다. 컴포넌트에서 직접 유틸리티 클래스를 사용할 수 있습니다.

### 예시

```tsx
<div className="bg-blue-500 text-white p-4 rounded-lg hover:bg-blue-600">
  Hello World
</div>
```

### 커스텀 색상

`tailwind.config.js`에서 커스텀 색상을 정의했습니다:

- `primary-*`: 파란색 계열
- `secondary-*`: 회색 계열

## 개발 팁

1. **Hot Reload**: 개발 모드에서는 코드 변경 시 자동으로 새로고침됩니다.
2. **DevTools**: 개발 모드에서는 Electron DevTools가 자동으로 열립니다.
3. **TypeScript**: 모든 컴포넌트는 TypeScript로 작성되어 타입 안전성을 보장합니다.
4. **Tailwind CSS**: 유틸리티 클래스를 사용하여 빠르게 스타일링할 수 있습니다.

## 빌드 및 배포

### Windows

```bash
npm run electron:build
# release/ 폴더에 .exe 파일이 생성됩니다.
```

### macOS

```bash
npm run electron:build
# release/ 폴더에 .dmg 파일이 생성됩니다.
```

### Linux

```bash
npm run electron:build
# release/ 폴더에 AppImage 파일이 생성됩니다.
```
