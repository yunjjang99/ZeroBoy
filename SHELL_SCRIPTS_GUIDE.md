# ZeroBoy Shell Scripts 가이드

이 문서는 ZeroBoy 프로젝트의 모든 셸 스크립트에 대한 사용법과 설명을 제공합니다.

## 📋 목차

1. [빌드 스크립트](#빌드-스크립트)
2. [개발 스크립트](#개발-스크립트)
3. [유틸리티 스크립트](#유틸리티-스크립트)
4. [데이터베이스 마이그레이션 스크립트](#데이터베이스-마이그레이션-스크립트)

---

## 🏗️ 빌드 스크립트

### 1. `build.sh` - 전체 애플리케이션 빌드

**목적**: ZeroBoy 데스크톱 애플리케이션의 전체 빌드 프로세스를 실행합니다.

**사용법**:

```bash
./build.sh
```

**실행 과정**:

1. Node.js 버전 확인
2. 모든 의존성 설치 (`npm run install:all`)
3. 기존 빌드 파일 정리 (`npm run clean`)
4. 백엔드 빌드 (`backend/` 디렉토리)
5. 프론트엔드 빌드 (`frontend/` 디렉토리)
6. Electron 앱 패키징

**출력 위치**:

- Frontend: `frontend/dist/`
- Backend: `backend/dist/`
- Electron: `frontend/release/`

**언제 사용하나요?**

- 프로덕션 배포용 빌드
- 전체 애플리케이션을 처음부터 빌드할 때
- 릴리즈 버전 생성 시

---

### 2. `build-electron.sh` - Electron 전용 빌드

**목적**: Electron 애플리케이션만을 위한 최적화된 빌드 프로세스입니다.

**사용법**:

```bash
./build-electron.sh
```

**실행 과정**:

1. 파일 디스크립터 제한 증가 (`ulimit -n 65536`)
2. Node.js 버전 확인
3. 기존 빌드 파일 정리
4. 백엔드 빌드
5. 백엔드 의존성 완전 복사 (`copy-complete-backend-deps.sh`)
6. 프론트엔드 빌드
7. Electron 파일 TypeScript 컴파일
8. Electron 앱 패키징

**특징**:

- 백엔드 의존성을 완전히 복사하여 배포 환경에서의 안정성 보장
- TypeScript 파일들을 직접 컴파일하여 Electron 메인 프로세스 준비

**언제 사용하나요?**

- Electron 앱만 빌드할 때
- 백엔드 의존성이 완전히 필요한 배포 환경

---

### 3. `build-electron-app.sh` - Electron 앱 빌드 (새로운 방식)

**목적**: 새로운 구조의 Electron 앱 빌드 스크립트입니다.

**사용법**:

```bash
./build-electron-app.sh
```

**실행 과정**:

1. Node.js 버전 체크
2. 모든 의존성 설치 (backend, frontend, electron)
3. 백엔드 빌드
4. 프론트엔드 빌드
5. Electron 앱 빌드 (`electron/` 디렉토리)

**출력 위치**:

- Electron: `electron/build/`

**언제 사용하나요?**

- 새로운 Electron 구조를 사용할 때
- `electron/` 디렉토리 기반 빌드

---

## 🚀 개발 스크립트

### 4. `dev-electron-app.sh` - 개발 모드 실행

**목적**: 개발 환경에서 Electron 앱을 실행하기 위한 스크립트입니다.

**사용법**:

```bash
./dev-electron-app.sh
```

**실행 과정**:

1. 의존성 확인 및 설치
2. 백엔드 빌드 확인 및 필요시 빌드
3. 프론트엔드 빌드 확인 및 필요시 빌드
4. 백엔드 개발 서버 시작 (백그라운드)
5. 프론트엔드 개발 서버 시작 (백그라운드)
6. Electron 앱 시작

**특징**:

- 자동으로 필요한 빌드를 수행
- 개발 서버들을 백그라운드에서 실행
- Ctrl+C로 모든 프로세스 정리 가능

**언제 사용하나요?**

- 개발 중 Electron 앱 테스트
- 실시간 코드 변경 확인

---

## 🛠️ 유틸리티 스크립트

### 5. `cleanup-browsers.sh` - 브라우저 프로세스 정리

**목적**: 크롬 브라우저와 관련 프로세스들을 정리합니다.

**사용법**:

```bash
./cleanup-browsers.sh
```

**정리 대상**:

- Chromium 프로세스
- Google Chrome 프로세스
- Puppeteer 관련 프로세스
- 백엔드 main.js 프로세스

**언제 사용하나요?**

- 브라우저 프로세스가 남아있어 문제가 발생할 때
- Puppeteer 관련 메모리 누수 해결
- 개발 서버 재시작 전 정리

---

### 6. `copy-backend-deps.sh` - 백엔드 의존성 복사 (선택적)

**목적**: 백엔드의 필수 의존성만을 프론트엔드로 복사합니다.

**사용법**:

```bash
./copy-backend-deps.sh
```

**복사되는 의존성**:

- NestJS 관련 모듈들
- TypeORM 및 관련 의존성
- SQLite 관련 모듈
- Express, Passport 등 핵심 모듈
- 유틸리티 라이브러리들

**출력 위치**: `frontend/backend-deps/`

**언제 사용하나요?**

- 배포 시 백엔드 의존성을 최소화하고 싶을 때
- 필수 모듈만 포함한 경량 배포

---

### 7. `copy-complete-backend-deps.sh` - 백엔드 의존성 완전 복사

**목적**: 백엔드의 전체 node_modules를 프론트엔드로 복사합니다.

**사용법**:

```bash
./copy-complete-backend-deps.sh
```

**특징**:

- 전체 node_modules 복사
- package.json도 함께 복사
- 복사된 크기 정보 표시

**출력 위치**: `frontend/backend-deps-complete/`

**언제 사용하나요?**

- 배포 시 백엔드 의존성을 완전히 보장하고 싶을 때
- 의존성 누락 문제를 방지하고 싶을 때

---

## 🗄️ 데이터베이스 마이그레이션 스크립트

### 8. `migrate-add-account-info.sh` - 계정 정보 컬럼 추가

**목적**: trading_pairs 테이블에 계정 정보 컬럼을 추가합니다.

**사용법**:

```bash
./migrate-add-account-info.sh
```

**실행 과정**:

1. 데이터베이스 존재 확인
2. 자동 백업 생성
3. 현재 테이블 구조 확인
4. 사용자 확인 (y/N)
5. accountInfoA, accountInfoB 컬럼 추가
6. 마이그레이션 검증

**추가되는 컬럼**:

- `accountInfoA`: 첫 번째 거래소 계정 정보
- `accountInfoB`: 두 번째 거래소 계정 정보

**백업 위치**: `data/db/db_backup_before_account_info_YYYYMMDD_HHMMSS.sqlite`

**언제 사용하나요?**

- 브라우저 계정 정보를 거래 페어에 저장할 기능을 추가할 때
- 데이터베이스 스키마 업그레이드 시

---

### 9. `migrate-remove-name-column.sh` - name 컬럼 제거

**목적**: trading_pairs 테이블에서 name 컬럼을 제거합니다.

**사용법**:

```bash
./migrate-remove-name-column.sh
```

**실행 과정**:

1. 데이터베이스 존재 확인
2. 자동 백업 생성
3. 현재 테이블 구조 확인
4. 사용자 확인 (y/N)
5. 임시 테이블 생성 (name 컬럼 제외)
6. 데이터 복사
7. 기존 테이블 삭제 및 임시 테이블 이름 변경
8. 마이그레이션 검증

**백업 위치**: `data/db/db_backup_before_name_removal_YYYYMMDD_HHMMSS.sqlite`

**언제 사용하나요?**

- UNIQUE 제약 조건 오류 해결 시
- 불필요한 name 컬럼을 제거하고 싶을 때

---

## 📝 스크립트 실행 권한 설정

모든 스크립트를 실행하기 전에 실행 권한을 부여해야 합니다:

```bash
chmod +x *.sh
```

## 🔧 스크립트 실행 순서 가이드

### 초기 설정

1. `migrate-add-account-info.sh` (필요시)
2. `migrate-remove-name-column.sh` (필요시)

### 개발 환경

1. `dev-electron-app.sh` - 개발 모드 실행

### 프로덕션 빌드

1. `build.sh` - 전체 빌드
2. 또는 `build-electron.sh` - Electron 전용 빌드
3. 또는 `build-electron-app.sh` - 새로운 Electron 빌드

### 문제 해결

1. `cleanup-browsers.sh` - 브라우저 프로세스 정리
2. `copy-complete-backend-deps.sh` - 의존성 문제 해결

## ⚠️ 주의사항

1. **데이터베이스 마이그레이션**: 실행 전 반드시 백업을 확인하세요
2. **의존성 복사**: `copy-complete-backend-deps.sh`는 큰 용량을 차지할 수 있습니다
3. **프로세스 정리**: `cleanup-browsers.sh`는 실행 중인 브라우저를 모두 종료합니다
4. **빌드 순서**: 백엔드 → 프론트엔드 → Electron 순서로 빌드됩니다

## 🆘 문제 해결

### 빌드 실패 시

1. `cleanup-browsers.sh` 실행
2. `rm -rf node_modules` 후 재설치
3. `copy-complete-backend-deps.sh` 실행

### 의존성 문제 시

1. `copy-complete-backend-deps.sh` 실행
2. 백엔드와 프론트엔드 의존성 재설치

### 데이터베이스 문제 시

1. 백업 파일 확인
2. 마이그레이션 스크립트 재실행
