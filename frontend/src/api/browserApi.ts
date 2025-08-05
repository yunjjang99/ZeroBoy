import type {
  ApiResponse,
  BrowserProfile,
  LaunchBrowserRequest,
  LaunchBrowserResponse,
  ReopenBrowserRequest,
  ReopenBrowserResponse,
  BrowserStatusResponse,
  SaveFingerprintRequest,
  UpdateSessionRequest,
} from "../types/api";
import { createApiUrl } from "@/config/api";

// 공통 API 호출 함수
async function apiCall<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<ApiResponse<T>> {
  const response = await fetch(createApiUrl(endpoint), {
    headers: {
      "Content-Type": "application/json",
      ...options.headers,
    },
    ...options,
  });

  if (!response.ok) {
    throw new Error(`API 호출 실패: ${response.status} ${response.statusText}`);
  }

  const data = await response.json();

  // 백엔드 응답 구조에 맞게 success 필드 매핑
  return {
    ...data,
    success: data.isSuccess,
  };
}

// Puppeteer API
export const puppeteerApi = {
  // 브라우저 실행
  launchBrowser: async (
    data: LaunchBrowserRequest
  ): Promise<LaunchBrowserResponse> => {
    const response = await apiCall<LaunchBrowserResponse>("/puppeteer/launch", {
      method: "POST",
      body: JSON.stringify({ url: data.url }),
    });

    if (!response.isSuccess) {
      throw new Error(response.message || "브라우저 실행에 실패했습니다.");
    }

    return response.data!;
  },

  // 브라우저 재생성
  reopenBrowser: async (
    data: ReopenBrowserRequest
  ): Promise<ReopenBrowserResponse> => {
    const response = await apiCall<ReopenBrowserResponse>("/puppeteer/reopen", {
      method: "POST",
      body: JSON.stringify({ uuid: data.uuid }),
    });

    if (!response.isSuccess) {
      throw new Error(response.message || "브라우저 재생성에 실패했습니다.");
    }

    return response.data!;
  },

  // 브라우저 상태 조회
  getBrowserStatus: async (): Promise<BrowserStatusResponse> => {
    const response = await apiCall<BrowserStatusResponse>("/puppeteer/status");

    if (!response.isSuccess) {
      throw new Error(response.message || "브라우저 상태 조회에 실패했습니다.");
    }

    return response.data!;
  },
};

// Fingerprint API (백엔드에 컨트롤러가 없으므로 서비스 기반으로 추정)
export const fingerprintApi = {
  // 프로필 목록 조회 (실제로는 백엔드에 엔드포인트가 필요)
  getProfiles: async (): Promise<BrowserProfile[]> => {
    const response = await apiCall<BrowserProfile[]>("/fingerprint/profiles");

    if (!response.isSuccess) {
      throw new Error(response.message || "프로필 목록 조회에 실패했습니다.");
    }

    return response.data || [];
  },

  // 프로필 조회
  getProfile: async (uuid: string): Promise<BrowserProfile | null> => {
    const response = await apiCall<BrowserProfile>(
      `/fingerprint/profiles/${uuid}`
    );

    if (!response.isSuccess) {
      throw new Error(response.message || "프로필 조회에 실패했습니다.");
    }

    return response.data || null;
  },

  // 프로필 저장
  saveFingerprint: async (data: SaveFingerprintRequest): Promise<string> => {
    const response = await apiCall<{ uuid: string }>("/fingerprint/profiles", {
      method: "POST",
      body: JSON.stringify(data),
    });

    if (!response.isSuccess) {
      throw new Error(response.message || "프로필 저장에 실패했습니다.");
    }

    return response.data!.uuid;
  },

  // 세션 업데이트
  updateSession: async (data: UpdateSessionRequest): Promise<void> => {
    const response = await apiCall(
      `/fingerprint/profiles/${data.uuid}/session`,
      {
        method: "PUT",
        body: JSON.stringify(data.session),
      }
    );

    if (!response.isSuccess) {
      throw new Error(response.message || "세션 업데이트에 실패했습니다.");
    }
  },

  // 프로필 삭제
  deleteProfile: async (uuid: string): Promise<void> => {
    const response = await apiCall(`/fingerprint/profiles/${uuid}`, {
      method: "DELETE",
    });

    if (!response.isSuccess) {
      throw new Error(response.message || "프로필 삭제에 실패했습니다.");
    }
  },
};
