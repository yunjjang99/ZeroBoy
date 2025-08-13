#!/bin/bash

# ZeroBoy 거래 페어 계정 정보 컬럼 추가 마이그레이션 스크립트

set -e

echo "🔄 ZeroBoy 거래 페어 계정 정보 컬럼 추가 마이그레이션 시작..."

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
    local backup_path="data/db/db_backup_before_account_info_$(date +%Y%m%d_%H%M%S).sqlite"
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

# 계정 정보 컬럼 추가
add_account_info_columns() {
    log_info "계정 정보 컬럼 추가 중..."
    
    # accountInfoA 컬럼 추가
    sqlite3 "$DB_PATH" "ALTER TABLE trading_pairs ADD COLUMN accountInfoA TEXT;" 2>/dev/null || {
        log_warning "accountInfoA 컬럼이 이미 존재하거나 추가 중 오류 발생"
    }
    
    # accountInfoB 컬럼 추가
    sqlite3 "$DB_PATH" "ALTER TABLE trading_pairs ADD COLUMN accountInfoB TEXT;" 2>/dev/null || {
        log_warning "accountInfoB 컬럼이 이미 존재하거나 추가 중 오류 발생"
    }
    
    log_success "계정 정보 컬럼 추가 완료"
}

# 마이그레이션 후 테이블 구조 확인
verify_migration() {
    log_info "마이그레이션 후 trading_pairs 테이블 구조:"
    sqlite3 "$DB_PATH" ".schema trading_pairs" 2>/dev/null || {
        log_error "마이그레이션 후 테이블 구조 확인 실패"
        exit 1
    }
    
    log_info "현재 거래 페어 데이터:"
    sqlite3 "$DB_PATH" "SELECT id, description, exchangeA, exchangeB, accountInfoA, accountInfoB FROM trading_pairs LIMIT 5;" 2>/dev/null || {
        log_warning "데이터 확인 중 오류 발생"
    }
}

# 메인 실행 함수
main() {
    log_info "ZeroBoy 거래 페어 계정 정보 컬럼 추가 마이그레이션"
    
    # 데이터베이스 확인
    check_database
    
    # 백업 생성
    create_backup
    
    # 현재 구조 확인
    check_table_structure
    
    # 사용자 확인
    log_warning "계정 정보 컬럼을 추가하시겠습니까? (y/N)"
    read -r response
    if [[ ! "$response" =~ ^[Yy]$ ]]; then
        log_info "마이그레이션이 취소되었습니다."
        exit 0
    fi
    
    # 계정 정보 컬럼 추가
    add_account_info_columns
    
    # 마이그레이션 검증
    verify_migration
    
    log_success "🎉 계정 정보 컬럼 추가 마이그레이션 완료!"
    log_info "이제 거래 페어에 브라우저 계정 정보를 저장할 수 있습니다."
}

# 스크립트 실행
main "$@"
