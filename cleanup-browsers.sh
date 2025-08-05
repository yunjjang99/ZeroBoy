#!/bin/bash

echo "🧹 크롬 브라우저 프로세스 정리 시작..."

# macOS에서 크롬 관련 프로세스 찾기 및 종료
echo "📱 macOS 크롬 프로세스 정리 중..."

# Chromium 프로세스 종료
pkill -f "Chromium" 2>/dev/null || echo "Chromium 프로세스 없음"

# Chrome 프로세스 종료
pkill -f "Google Chrome" 2>/dev/null || echo "Google Chrome 프로세스 없음"

# puppeteer 관련 프로세스 종료
pkill -f "puppeteer" 2>/dev/null || echo "Puppeteer 프로세스 없음"

# node 프로세스 중 백엔드 관련 프로세스 종료
pkill -f "main.js" 2>/dev/null || echo "Backend 프로세스 없음"

# 3초 대기 후 남은 프로세스 확인
sleep 3

echo "🔍 남은 크롬 관련 프로세스 확인:"
ps aux | grep -i "chrome\|chromium\|puppeteer" | grep -v grep || echo "크롬 관련 프로세스 없음"

echo "✅ 크롬 브라우저 프로세스 정리 완료!" 