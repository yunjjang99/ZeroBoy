# ZeroBoy Frontend

ZeroBoy는 암호화폐 거래 봇을 위한 현대적인 웹 애플리케이션입니다.

## 🚀 기술 스택

- **React 18** - 사용자 인터페이스 라이브러리
- **TypeScript** - 타입 안전성
- **React Router v6** - 클라이언트 사이드 라우팅
- **Tailwind CSS** - 유틸리티 우선 CSS 프레임워크
- **Shadcn/ui** - 재사용 가능한 UI 컴포넌트
- **React Query (TanStack Query)** - 서버 상태 관리
- **React i18next** - 국제화 (한국어/영어)
- **Vite** - 빌드 도구
- **Electron** - 데스크톱 애플리케이션

## 📁 프로젝트 구조

```
src/
├── components/           # 재사용 가능한 컴포넌트
│   ├── common/          # 공통 컴포넌트
│   │   ├── StatusBadge.tsx
│   │   ├── ExchangeLogo.tsx
│   │   └── PnlDisplay.tsx
│   ├── ui/              # Shadcn/ui 컴포넌트
│   └── ...              # 기능별 컴포넌트
├── pages/               # 페이지 컴포넌트
│   ├── DashboardPage.tsx
│   ├── BrowserPage.tsx
│   ├── TradingPage.tsx
│   └── AnalyticsPage.tsx
├── layouts/             # 레이아웃 컴포넌트
│   └── MainLayout.tsx
├── router/              # 라우터 설정
│   └── AppRouter.tsx
├── contexts/            # React Context
├── hooks/               # 커스텀 훅
├── lib/                 # 유틸리티 함수
├── locales/             # 다국어 파일
└── types/               # TypeScript 타입 정의
```

## 🎯 주요 기능

### 1. 대시보드 (Dashboard)

- 계정 정보 표시
- 거래 내역 관리
- 이벤트 로그

### 2. 브라우저 관리 (Browser)

- 브라우저 프로필 관리
- 브라우저 실행/재시작
- 상태 모니터링

### 3. 거래 관제 (Trading)

- 헷징 페어 관리
- 실시간 포지션 모니터링
- 거래소 연결 상태 확인
- 손익 계산 및 표시

### 4. 분석 (Analytics)

- 거래 성과 분석
- 통계 차트
- 리포트 생성

## 🛠️ 개발 가이드

### 코드 컨벤션

#### 1. 컴포넌트 구조

```typescript
// ✅ 권장
interface ComponentProps {
  title: string;
  onAction: () => void;
  children?: React.ReactNode;
}

export const Component = React.memo<ComponentProps>(
  ({ title, onAction, children }) => {
    return (
      <div>
        <h1>{title}</h1>
        {children}
      </div>
    );
  }
);

Component.displayName = "Component";
```

#### 2. 페이지 컴포넌트

```typescript
// ✅ 권장
const PageName: React.FC = () => {
  const { t } = useTranslation();

  return (
    <div className="space-y-6">
      <h1>{t("page.title")}</h1>
      {/* 페이지 내용 */}
    </div>
  );
};

export default PageName;
```

#### 3. 공통 컴포넌트

- `React.memo`를 사용하여 불필요한 리렌더링 방지
- Props 인터페이스 명시적 정의
- `displayName` 설정으로 디버깅 개선

### 성능 최적화

#### 1. 컴포넌트 메모이제이션

```typescript
// ✅ 권장
export const ExpensiveComponent = React.memo<Props>(({ data }) => {
  return <div>{/* 복잡한 렌더링 */}</div>;
});
```

#### 2. 조건부 렌더링

```typescript
// ✅ 권장
{
  isLoading ? <LoadingSpinner /> : <Content data={data} />;
}

// ❌ 피해야 할 패턴
{
  isLoading && <LoadingSpinner />;
}
{
  !isLoading && <Content data={data} />;
}
```

#### 3. 이벤트 핸들러 최적화

```typescript
// ✅ 권장
const handleClick = useCallback(
  (id: string) => {
    // 핸들러 로직
  },
  [dependencies]
);

// ❌ 피해야 할 패턴
const handleClick = (id: string) => {
  // 매번 새로운 함수 생성
};
```

### 다국어 지원

#### 1. 번역 키 구조

```json
{
  "common": {
    "dashboard": "대시보드",
    "status": "상태",
    "actions": "작업"
  },
  "trading": {
    "title": "거래 관제",
    "position": {
      "entryPrice": "진입가",
      "markPrice": "시장가",
      "unrealizedPnl": "손익"
    }
  }
}
```

#### 2. 사용법

```typescript
const { t } = useTranslation()

// ✅ 권장
<span>{t('trading.position.entryPrice')}</span>

// ❌ 피해야 할 패턴
<span>{t('entryPrice')}</span>
```

### 다크 모드 지원

#### 1. Tailwind CSS 클래스

```typescript
// ✅ 권장
className = "bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100";

// ✅ 권장 - 그라데이션
className =
  "bg-gradient-to-r from-slate-50 to-slate-100 dark:from-slate-800 dark:to-slate-700";
```

#### 2. 색상 팔레트

- **Primary**: Blue (500-600)
- **Success**: Emerald (500-600)
- **Warning**: Amber (500-600)
- **Error**: Red (500-600)
- **Neutral**: Slate (50-900)

## 🚀 실행 방법

### 개발 모드

```bash
# 웹 전용 (Electron 없이)
npm run dev:web

# Electron 포함
npm run dev
```

### 빌드

```bash
# 웹 빌드
npm run build

# Electron 빌드
npm run build:electron
```

## 📦 주요 패키지

- `react-router-dom` - 클라이언트 사이드 라우팅
- `@tanstack/react-query` - 서버 상태 관리
- `react-i18next` - 국제화
- `lucide-react` - 아이콘 라이브러리
- `clsx` / `tailwind-merge` - 조건부 클래스 관리

## 🔧 개발 도구

- **ESLint** - 코드 품질 검사
- **Prettier** - 코드 포맷팅
- **TypeScript** - 타입 체크
- **React DevTools** - 컴포넌트 디버깅

## 📝 주의사항

1. **컴포넌트 분리**: 단일 책임 원칙에 따라 컴포넌트를 적절히 분리
2. **타입 안전성**: TypeScript를 활용하여 타입 안전성 확보
3. **성능 최적화**: React.memo, useCallback, useMemo 적절히 사용
4. **접근성**: ARIA 속성과 시맨틱 HTML 사용
5. **반응형 디자인**: 모바일부터 데스크톱까지 모든 화면 크기 지원

## 🤝 기여 가이드

1. 기능 브랜치 생성
2. 코드 작성 및 테스트
3. PR 생성
4. 코드 리뷰 후 머지

## �� 라이선스

MIT License
