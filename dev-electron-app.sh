#!/bin/bash

# ZeroBoy Electron App 개발 모드 실행 스크립트

set -e

echo "🚀 ZeroBoy Electron App 개발 모드 시작..."

# 색상 정의
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# 로그 함수
log_info() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

log_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

log_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

log_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# 프로세스 종료 함수
cleanup() {
    log_info "프로세스 정리 중..."
    pkill -f "npm run dev" || true
    pkill -f "electron" || true
    pkill -f "node.*backend" || true
    log_success "프로세스 정리 완료"
    exit 0
}

# 시그널 핸들러 설정
trap cleanup SIGINT SIGTERM

# 백엔드 빌드 확인
check_backend_build() {
    if [ ! -f "backend/dist/main.js" ]; then
        log_warning "백엔드가 빌드되지 않았습니다. 빌드 중..."
        cd backend
        npm run build
        cd ..
        log_success "백엔드 빌드 완료"
    else
        log_info "백엔드 빌드 파일 확인됨"
    fi
}

# 프론트엔드 빌드 확인
check_frontend_build() {
    if [ ! -d "frontend/dist" ] || [ -z "$(ls -A frontend/dist 2>/dev/null)" ]; then
        log_warning "프론트엔드가 빌드되지 않았습니다. 빌드 중..."
        cd frontend
        npm run build
        cd ..
        log_success "프론트엔드 빌드 완료"
    else
        log_info "프론트엔드 빌드 파일 확인됨"
    fi
}

# 의존성 확인
check_dependencies() {
    log_info "의존성 확인 중..."
    
    # 백엔드 의존성 확인
    if [ ! -d "backend/node_modules" ]; then
        log_warning "백엔드 의존성이 설치되지 않았습니다. 설치 중..."
        cd backend
        npm install
        cd ..
    fi
    
    # 프론트엔드 의존성 확인
    if [ ! -d "frontend/node_modules" ]; then
        log_warning "프론트엔드 의존성이 설치되지 않았습니다. 설치 중..."
        cd frontend
        npm install
        cd ..
    fi
    
    # Electron 의존성 확인
    if [ ! -d "electron/node_modules" ]; then
        log_warning "Electron 의존성이 설치되지 않았습니다. 설치 중..."
        cd electron
        npm install
        cd ..
    fi
    
    log_success "의존성 확인 완료"
}

# 개발 서버 시작
start_dev_servers() {
    log_info "개발 서버 시작 중..."
    
    # 백엔드 개발 서버 시작 (백그라운드)
    log_info "백엔드 개발 서버 시작..."
    cd backend
    npm run start:dev &
    BACKEND_PID=$!
    cd ..
    
    # 잠시 대기
    sleep 3
    
    # 프론트엔드 개발 서버 시작 (백그라운드)
    log_info "프론트엔드 개발 서버 시작..."
    cd frontend
    npm run dev &
    FRONTEND_PID=$!
    cd ..
    
    # 서버 시작 대기
    log_info "서버 시작 대기 중..."
    sleep 5
    
    log_success "개발 서버 시작 완료"
}

# Electron 앱 시작
start_electron() {
  log_info "Electron 앱 시작 중..."
  cd electron
  npm run dev
  cd ..
}

# 메인 실행 함수
main() {
    log_info "ZeroBoy Electron App 개발 모드 시작"
    
    # 의존성 확인
    check_dependencies
    
    # 빌드 확인
    check_backend_build
    check_frontend_build
    
    # 개발 서버 시작
    start_dev_servers
    
    # Electron 앱 시작
    start_electron
}

# 스크립트 실행
main "$@"
