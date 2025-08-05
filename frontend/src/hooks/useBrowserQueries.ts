import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { API_CONFIG, createApiUrl } from "@/config/api";
import { Exchange } from "./useTradingQueries";

// 새로운 타입 정의
interface BrowserProfile {
  uuid: string;
  siteUrl: string;
  exchange: string;
  accountInfo?: { accountId: string; memo: string };
  isActive: boolean;
  lastActiveAt?: string;
}

interface TradingPairWithBrowserProfiles {
  pairId: string;
  pairName: string;
  exchangeA: Exchange;
  exchangeB: Exchange;
  status: string;
  createdAt: string;
  browserA?: BrowserProfile;
  browserB?: BrowserProfile;
}

interface BrowserStatus {
  uuid: string;
  isConnected: boolean;
  tabs: string[];
}

interface BrowserStatusResponse {
  count: number;
  statuses: BrowserStatus[];
}

// API 함수들
const browserApi = {
  // 새로운 pair 정보와 함께 브라우저 프로필 조회
  getTradingPairsWithBrowserProfiles: async (): Promise<
    TradingPairWithBrowserProfiles[]
  > => {
    const response = await fetch(
      createApiUrl(API_CONFIG.ENDPOINTS.TRADING.PAIRS_WITH_BROWSER_PROFILES)
    );
    if (!response.ok) {
      throw new Error("Failed to fetch trading pairs with browser profiles");
    }
    const result = await response.json();
    return result.data || []; // data 필드에서 배열 추출
  },

  // 브라우저 상태 조회
  getBrowserStatuses: async (): Promise<BrowserStatusResponse> => {
    const response = await fetch(createApiUrl("/puppeteer/status"));
    if (!response.ok) {
      throw new Error("Failed to fetch browser statuses");
    }
    const result = await response.json();
    return result.data || { count: 0, statuses: [] };
  },

  // 브라우저 실행
  launchBrowser: async ({
    url,
  }: {
    url: string;
  }): Promise<{ uuid: string; title: string }> => {
    const response = await fetch(createApiUrl("/puppeteer/launch"), {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ url }),
    });
    if (!response.ok) {
      throw new Error("Failed to launch browser");
    }
    return response.json();
  },

  // 브라우저 재생성
  reopenBrowser: async ({
    uuid,
  }: {
    uuid: string;
  }): Promise<{ title: string; isAlreadyRunning: boolean }> => {
    const response = await fetch(createApiUrl("/puppeteer/reopen"), {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ uuid }),
    });
    if (!response.ok) {
      throw new Error("Failed to reopen browser");
    }
    return response.json();
  },

  // 프로필 삭제
  deleteProfile: async (uuid: string): Promise<void> => {
    const response = await fetch(
      createApiUrl(`/fingerprint/profiles/${uuid}`),
      {
        method: "DELETE",
      }
    );
    if (!response.ok) {
      throw new Error("Failed to delete profile");
    }
  },
};

// Query Keys
export const browserQueryKeys = {
  all: ["browser"] as const,
  profiles: () => [...browserQueryKeys.all, "profiles"] as const,
  tradingPairsWithProfiles: () =>
    [...browserQueryKeys.all, "trading-pairs-with-profiles"] as const,
  profile: (uuid: string) =>
    [...browserQueryKeys.all, "profile", uuid] as const,
};

// 새로운 pair 정보와 함께 브라우저 프로필 조회 훅
export const useTradingPairsWithBrowserProfiles = () => {
  return useQuery({
    queryKey: browserQueryKeys.tradingPairsWithProfiles(),
    queryFn: browserApi.getTradingPairsWithBrowserProfiles,
    staleTime: 10 * 1000, // 10초
    refetchInterval: 15 * 1000, // 15초마다 자동 갱신
  });
};

// 브라우저 상태 조회 훅
export const useBrowserStatuses = () => {
  return useQuery({
    queryKey: ["browser", "statuses"],
    queryFn: browserApi.getBrowserStatuses,
    staleTime: 3 * 1000, // 3초
    refetchInterval: 5 * 1000, // 5초마다 자동 갱신
  });
};

// 브라우저 실행 훅
export const useLaunchBrowser = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: browserApi.launchBrowser,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: browserQueryKeys.tradingPairsWithProfiles(),
      });
    },
  });
};

// 브라우저 재생성 훅
export const useReopenBrowser = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: browserApi.reopenBrowser,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: browserQueryKeys.tradingPairsWithProfiles(),
      });
    },
  });
};

// 프로필 삭제 훅
export const useDeleteProfile = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: browserApi.deleteProfile,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: browserQueryKeys.tradingPairsWithProfiles(),
      });
    },
  });
};

// 기존 호환성을 위한 훅들 (deprecated)
export const useProfiles = useTradingPairsWithBrowserProfiles;
