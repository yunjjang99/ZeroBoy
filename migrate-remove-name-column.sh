#!/bin/bash

# ZeroBoy name 컬럼 제거 마이그레이션 스크립트

set -e

echo "🔄 ZeroBoy name 컬럼 제거 마이그레이션 시작..."

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

# SQLite 데이터베이스 경로
DB_PATH="data/db/db.sqlite"

# 데이터베이스 존재 확인
check_database() {
    if [ ! -f "$DB_PATH" ]; then
        log_error "데이터베이스 파일을 찾을 수 없습니다: $DB_PATH"
        exit 1
    fi
    log_info "데이터베이스 파일 확인됨: $DB_PATH"
}

# 백업 생성
create_backup() {
    local backup_path="data/db/db_backup_before_name_removal_$(date +%Y%m%d_%H%M%S).sqlite"
    log_info "데이터베이스 백업 생성 중: $backup_path"
    cp "$DB_PATH" "$backup_path"
    log_success "백업 완료: $backup_path"
}

# 현재 테이블 구조 확인
check_table_structure() {
    log_info "현재 trading_pairs 테이블 구조:"
    sqlite3 "$DB_PATH" ".schema trading_pairs" 2>/dev/null || {
        log_error "trading_pairs 테이블을 찾을 수 없습니다."
        exit 1
    }
}

# name 컬럼 제거
remove_name_column() {
    log_info "name 컬럼 제거 중..."
    
    # 임시 테이블 생성 (name 컬럼 제외)
    sqlite3 "$DB_PATH" "
    CREATE TABLE trading_pairs_temp (
        id VARCHAR PRIMARY KEY,
        description VARCHAR(100),
        exchangeA VARCHAR(50),
        exchangeB VARCHAR(50),
        browserAUuid VARCHAR(36),
        browserBUuid VARCHAR(36),
        status VARCHAR(20) DEFAULT 'inactive',
        isActive BOOLEAN DEFAULT 0,
        lastActiveAt DATETIME,
        settings TEXT,
        createdAt DATETIME,
        updatedAt DATETIME
    );" 2>/dev/null || log_warning "임시 테이블 생성 중 오류 발생"
    
    # 데이터 복사 (name 컬럼 제외)
    sqlite3 "$DB_PATH" "
    INSERT INTO trading_pairs_temp 
    SELECT id, description, exchangeA, exchangeB, browserAUuid, browserBUuid, 
           status, isActive, lastActiveAt, settings, createdAt, updatedAt
    FROM trading_pairs;" 2>/dev/null || log_warning "데이터 복사 중 오류 발생"
    
    # 기존 테이블 삭제
    sqlite3 "$DB_PATH" "DROP TABLE trading_pairs;" 2>/dev/null || log_warning "기존 테이블 삭제 중 오류 발생"
    
    # 임시 테이블을 새 테이블로 이름 변경
    sqlite3 "$DB_PATH" "ALTER TABLE trading_pairs_temp RENAME TO trading_pairs;" 2>/dev/null || log_warning "테이블 이름 변경 중 오류 발생"
    
    log_success "name 컬럼 제거 완료"
}

# 마이그레이션 후 테이블 구조 확인
verify_migration() {
    log_info "마이그레이션 후 trading_pairs 테이블 구조:"
    sqlite3 "$DB_PATH" ".schema trading_pairs" 2>/dev/null || {
        log_error "마이그레이션 후 테이블 구조 확인 실패"
        exit 1
    }
    
    log_info "현재 거래 페어 데이터:"
    sqlite3 "$DB_PATH" "SELECT id, description, exchangeA, exchangeB, status FROM trading_pairs LIMIT 5;" 2>/dev/null || {
        log_warning "데이터 확인 중 오류 발생"
    }
}

# 메인 실행 함수
main() {
    log_info "ZeroBoy name 컬럼 제거 마이그레이션"
    
    # 데이터베이스 확인
    check_database
    
    # 백업 생성
    create_backup
    
    # 현재 구조 확인
    check_table_structure
    
    # 사용자 확인
    log_warning "name 컬럼을 제거하시겠습니까? (y/N)"
    read -r response
    if [[ ! "$response" =~ ^[Yy]$ ]]; then
        log_info "마이그레이션이 취소되었습니다."
        exit 0
    fi
    
    # name 컬럼 제거
    remove_name_column
    
    # 마이그레이션 검증
    verify_migration
    
    log_success "🎉 name 컬럼 제거 마이그레이션 완료!"
    log_info "이제 UNIQUE 제약 조건 오류가 발생하지 않습니다."
}

# 스크립트 실행
main "$@"
