// API 설정
export const API_CONFIG = {
  // 전역 환경변수에서 API BASE URL 가져오기
  BASE_URL: __API_BASE_URL__ || "http://localhost:7777",

  // API 엔드포인트들
  ENDPOINTS: {
    // Trading API
    TRADING: {
      PAIRS: "/trading/pairs",
      PAIRS_WITH_BROWSERS: "/trading/pairs/with-browsers",
      PAIRS_WITH_BROWSER_PROFILES: "/trading/pairs/with-browser-profiles",
      PAIRS_AUTO_RECOVER: "/trading/pairs/auto-recover",
      COINS: "/trading/coins",
      RECOVER: "/trading/pairs/recover",
    },

    // Puppeteer API
    PUPPETEER: {
      LAUNCH: "/puppeteer/launch",
      REOPEN: "/puppeteer/reopen",
      STATUS: "/puppeteer/status",
      ACTIVE_BROWSERS: "/puppeteer/active-browsers",
    },

    // Browser Profiles API
    BROWSER_PROFILES: "/browser-profiles",
  },

  // HTTP 헤더
  HEADERS: {
    "Content-Type": "application/json",
  },
} as const;

// API URL 생성 헬퍼 함수
export const createApiUrl = (endpoint: string): string => {
  return `${API_CONFIG.BASE_URL}${endpoint}`;
};

// API 요청 헬퍼 함수
export const apiRequest = async <T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> => {
  const url = createApiUrl(endpoint);
  const response = await fetch(url, {
    headers: {
      ...API_CONFIG.HEADERS,
      ...options.headers,
    },
    ...options,
  });

  if (!response.ok) {
    throw new Error(
      `API request failed: ${response.status} ${response.statusText}`
    );
  }

  return response.json();
};
