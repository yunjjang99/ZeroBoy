#!/bin/bash

echo "🚀 ZeroBoy Desktop Application Build Script"
echo "=========================================="

# 색상 정의
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# 에러 처리 함수
error_exit() {
    echo -e "${RED}❌ Error: $1${NC}" >&2
    exit 1
}

# 성공 메시지 함수
success_msg() {
    echo -e "${GREEN}✅ $1${NC}"
}

# 경고 메시지 함수
warning_msg() {
    echo -e "${YELLOW}⚠️  $1${NC}"
}

# Node.js 버전 확인
echo "📋 Checking Node.js version..."
NODE_VERSION=$(node -v)
echo "Node.js version: $NODE_VERSION"

# 의존성 설치
echo "📦 Installing dependencies..."
npm run install:all || error_exit "Failed to install dependencies"

# 기존 빌드 파일 정리
echo "🧹 Cleaning previous builds..."
npm run clean || error_exit "Failed to clean previous builds"

# 백엔드 빌드
echo "🔨 Building backend..."
cd backend
npm run build || error_exit "Failed to build backend"
cd ..

# 프론트엔드 빌드
echo "🔨 Building frontend..."
cd frontend
npm run build || error_exit "Failed to build frontend"
cd ..

# 일렉트론 앱 패키징
echo "📦 Packaging Electron application..."
cd frontend
npm run electron:build || error_exit "Failed to package Electron app"
cd ..

success_msg "Build completed successfully!"
echo ""
echo "📁 Build outputs:"
echo "   - Frontend: frontend/dist/"
echo "   - Backend: backend/dist/"
echo "   - Electron: frontend/release/"
echo ""
echo "🎉 Your ZeroBoy Desktop application is ready!"
echo "   You can find the installer in: frontend/release/" 