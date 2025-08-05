// 백엔드 API 응답 타입
export interface ApiResponse<T = any> {
  isSuccess: boolean;
  success?: boolean; // 프론트엔드 호환성을 위해 추가
  statusCode: number;
  message: string;
  timestamp: string;
  path: string;
  method: string;
  data?: T;
}

// 브라우저 프로필 타입 (기존 BrowserProfile과 통합)
export interface BrowserProfile {
  uuid: string;
  userAgent: string;
  language: string;
  languages: string[];
  timezone: string;
  platform: string;
  hardwareConcurrency: number;
  colorDepth: number;
  screenResolution: { width: number; height: number };
  gpuVendor: string;
  gpuModel: string;
  webdriver: boolean;
  latitude: number;
  longitude: number;
  publicIp: string;
  siteUrl: string;
  createdAt: Date;
  isActive?: boolean;
  cookies?: any[] | null;
  localStorage?: string | null;
  sessionStorage?: string | null;
}

// Puppeteer API 응답 타입들
export interface LaunchBrowserResponse {
  title: string;
  uuid: string;
}

export interface ReopenBrowserResponse {
  title: string;
}

export interface BrowserStatusResponse {
  count: number;
  statuses: any[];
}

// API 요청 타입들
export interface LaunchBrowserRequest {
  url: string;
}

export interface ReopenBrowserRequest {
  uuid: string;
}

export interface SaveFingerprintRequest {
  fingerprint: Partial<BrowserProfile>;
  siteUrl: string;
}

export interface UpdateSessionRequest {
  uuid: string;
  session: {
    cookies: any[];
    localStorage: string;
    sessionStorage: string;
  };
}
