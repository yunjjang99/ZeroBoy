#!/bin/bash

echo "📦 Copying complete backend dependencies..."

# 백엔드 디렉토리로 이동
cd backend

# 기존 복사본 제거
rm -rf ../frontend/backend-deps-complete

# 전체 node_modules 복사
echo "Copying complete node_modules..."
cp -r node_modules ../frontend/backend-deps-complete

# package.json도 복사
cp package.json ../frontend/backend-deps-complete/

echo "✅ Complete backend dependencies copied successfully!"
echo "📁 Location: frontend/backend-deps-complete/"
echo "📊 Size: $(du -sh ../frontend/backend-deps-complete | cut -f1)" 