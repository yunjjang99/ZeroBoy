// 전역 환경변수 타입 정의
declare global {
  const __API_BASE_URL__: string;

  interface Window {
    electron?: {
      // Add any specific electron APIs you're using here
      [key: string]: any;
    };
  }
}

export {};
