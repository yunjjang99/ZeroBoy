#!/bin/bash

# ZeroBoy Electron App 빌드 스크립트

set -e

echo "🚀 ZeroBoy Electron App 빌드 시작..."

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

# Node.js 버전 체크
check_node_version() {
    log_info "Node.js 버전 확인 중..."
    NODE_VERSION=$(node -v)
    log_info "현재 Node.js 버전: $NODE_VERSION"
}

# 의존성 설치
install_dependencies() {
    log_info "의존성 설치 중..."
    
    # 백엔드 의존성 설치
    log_info "백엔드 의존성 설치..."
    cd backend
    npm install
    cd ..
    
    # 프론트엔드 의존성 설치
    log_info "프론트엔드 의존성 설치..."
    cd frontend
    npm install
    cd ..
    
    # Electron 의존성 설치
    log_info "Electron 의존성 설치..."
    cd electron
    npm install
    cd ..
    
    log_success "의존성 설치 완료"
}

# 백엔드 빌드
build_backend() {
    log_info "백엔드 빌드 중..."
    cd backend
    npm run build
    cd ..
    log_success "백엔드 빌드 완료"
}

# 프론트엔드 빌드
build_frontend() {
    log_info "프론트엔드 빌드 중..."
    cd frontend
    npm run build
    cd ..
    log_success "프론트엔드 빌드 완료"
}

# Electron 앱 빌드
build_electron() {
  log_info "Electron 앱 빌드 중..."
  cd electron
  npm run dist
  cd ..
  log_success "Electron 앱 빌드 완료"
}

# 메인 실행 함수
main() {
    log_info "ZeroBoy Electron App 빌드 프로세스 시작"
    
    # Node.js 버전 체크
    check_node_version
    
    # 의존성 설치
    install_dependencies
    
    # 백엔드 빌드
    build_backend
    
    # 프론트엔드 빌드
    build_frontend
    
    # Electron 앱 빌드
    build_electron
    
    log_success "🎉 ZeroBoy Electron App 빌드 완료!"
    log_info "빌드된 파일은 electron/build/ 디렉토리에 있습니다."
}

# 스크립트 실행
main "$@"
