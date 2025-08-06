#!/bin/bash

echo "📦 Copying essential backend dependencies..."

# 백엔드 디렉토리로 이동
cd backend

# 필수 의존성만 복사할 디렉토리 생성
mkdir -p ../frontend/backend-deps

# 핵심 NestJS 의존성만 복사
echo "Copying NestJS dependencies..."
cp -r node_modules/@nestjs ../frontend/backend-deps/
cp -r node_modules/@nestjs-common ../frontend/backend-deps/ 2>/dev/null || true
cp -r node_modules/@nestjs-core ../frontend/backend-deps/ 2>/dev/null || true

# TypeORM 및 관련 의존성
echo "Copying TypeORM dependencies..."
cp -r node_modules/typeorm ../frontend/backend-deps/
cp -r node_modules/reflect-metadata ../frontend/backend-deps/
cp -r node_modules/rxjs ../frontend/backend-deps/

# SQLite 관련
echo "Copying SQLite dependencies..."
cp -r node_modules/sqlite3 ../frontend/backend-deps/

# 기타 필수 의존성
echo "Copying other essential dependencies..."
cp -r node_modules/express ../frontend/backend-deps/
cp -r node_modules/passport ../frontend/backend-deps/
cp -r node_modules/passport-jwt ../frontend/backend-deps/
cp -r node_modules/bcryptjs ../frontend/backend-deps/
cp -r node_modules/cookie-parser ../frontend/backend-deps/
cp -r node_modules/dotenv ../frontend/backend-deps/
cp -r node_modules/winston ../frontend/backend-deps/

# 공통 유틸리티
echo "Copying utility dependencies..."
cp -r node_modules/class-validator ../frontend/backend-deps/
cp -r node_modules/class-transformer ../frontend/backend-deps/
cp -r node_modules/helmet ../frontend/backend-deps/
cp -r node_modules/cors ../frontend/backend-deps/

# 의존성 트리에서 필요한 추가 모듈들
echo "Copying additional dependencies..."
cp -r node_modules/tslib ../frontend/backend-deps/
cp -r node_modules/inversify ../frontend/backend-deps/
cp -r node_modules/async_hooks ../frontend/backend-deps/ 2>/dev/null || true

echo "✅ Backend dependencies copied successfully!"
echo "📁 Location: frontend/backend-deps/" 