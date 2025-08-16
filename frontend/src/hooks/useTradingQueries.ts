import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { API_CONFIG, createApiUrl } from "@/config/api";

// Exchange enum 정의 (백엔드와 동일)
export enum Exchange {
  BINANCE = "binance",
  ORANGEX = "orangex",
  BYDFI = "bydfi",
}

// 타입 정의
type CreateTradingPairVars = {
  exchangeA: Exchange;
  exchangeB: Exchange;
  accountInfo: Record<string, { accountId: string; memo: string }>;
};

type UpdateTradingPairVars = {
  id: string;
  data: {
    exchangeA?: Exchange;
    exchangeB?: Exchange;
    status?: string;
    isActive?: boolean;
    accountInfo?: Record<string, { accountId: string; memo: string }>;
  };
};

type DeleteTradingPairVars = string;

type DeleteTradingPairResponse = {
  isSuccess: boolean;
  statusCode: number;
  message: string;
  timestamp: string;
  path: string;
  method: string;
  data: { message: string };
};

type ActivateVars = {
  id: string;
  exchangeAUrl: string;
  exchangeBUrl: string;
  accountInfo?: Record<string, { accountId: string; memo: string }>;
};

type DeactivateVars = string;

type CreateTradingCoinVars = {
  tradingPairId: string;
  exchange: Exchange;
  positionType: "long" | "short";
  entryPrice: string;
  quantity: string;
  leverage: string;
};

type UpdateTradingCoinVars = {
  id: string;
  data: {
    tradingPairId: string;
    exchange?: Exchange;
    positionType?: "long" | "short";
    entryPrice?: string;
    quantity?: string;
    leverage?: string;
  };
};

type DeleteTradingCoinVars = string;

type UpdateCoinPriceVars = {
  id: string;
  currentPrice: number;
};

type CreateTradingPairWithBrowsersVars = {
  exchangeA: Exchange;
  exchangeB: Exchange;
  exchangeAUrl: string;
  exchangeBUrl: string;
  accountInfo: Record<string, { accountId: string; memo: string }>;
};

// 응답 타입 정의
interface TradingPairResponse {
  id: string;
  name: string;
  description: string;
  exchangeA: Exchange;
  exchangeB: Exchange;
  status: string;
  isActive: boolean;
  browserAUuid?: string;
  browserBUuid?: string;
  createdAt: string;
  updatedAt: string;
  tradingCoins?: TradingCoinResponse[];
}

// 백엔드 success 응답 래퍼 타입
interface SuccessResponse<T> {
  isSuccess: boolean;
  statusCode: number;
  message: string;
  timestamp: string;
  path: string;
  method: string;
  data: T;
}

interface TradingCoinResponse {
  id: string;
  tradingPairId: string;
  symbol: string;
  exchange: Exchange;
  positionType: "long" | "short";
  entryPrice: number;
  currentPrice: number;
  quantity: number;
  leverage: number;
  roi?: number;
  unrealizedPnl?: number;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

// 거래 페어 관련 API 함수들
const tradingApi = {
  // 브라우저 쌍과 거래 페어를 한 번에 생성
  createTradingPairWithBrowsers: async (
    data: CreateTradingPairWithBrowsersVars
  ): Promise<TradingPairResponse> => {
    const response = await fetch(
      createApiUrl(API_CONFIG.ENDPOINTS.TRADING.PAIRS_WITH_BROWSERS),
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          createDto: {
            description: `${data.exchangeA.toUpperCase()}와 ${data.exchangeB.toUpperCase()} 간의 헷징 페어`,
            exchangeA: data.exchangeA,
            exchangeB: data.exchangeB,
            status: "active",
            isActive: true,
          },
          exchangeAUrl: data.exchangeAUrl,
          exchangeBUrl: data.exchangeBUrl,
          accountInfo: data.accountInfo,
        }),
      }
    );
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(
        errorData.message || "Failed to create trading pair with browsers"
      );
    }
    return response.json();
  },

  // 거래 페어 생성
  createTradingPair: async (
    data: CreateTradingPairVars
  ): Promise<TradingPairResponse> => {
    const response = await fetch(
      createApiUrl(API_CONFIG.ENDPOINTS.TRADING.PAIRS),
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: `${data.exchangeA.toUpperCase()}-${data.exchangeB.toUpperCase()}`,
          description: `${data.exchangeA.toUpperCase()}와 ${data.exchangeB.toUpperCase()} 간의 헷징 페어`,
          exchangeA: data.exchangeA,
          exchangeB: data.exchangeB,
          status: "inactive",
          isActive: false,
          accountInfo: data.accountInfo,
        }),
      }
    );
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || "Failed to create trading pair");
    }
    return response.json();
  },

  // 모든 거래 페어 조회
  getTradingPairs: async (): Promise<TradingPairResponse[]> => {
    const response = await fetch(
      createApiUrl(API_CONFIG.ENDPOINTS.TRADING.PAIRS)
    );
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || "Failed to fetch trading pairs");
    }
    return response.json();
  },

  // 마지막 거래 페어 조회
  getLastTradingPair: async (): Promise<
    SuccessResponse<TradingPairResponse | null>
  > => {
    const response = await fetch(
      createApiUrl(`${API_CONFIG.ENDPOINTS.TRADING.PAIRS}/last`)
    );
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || "Failed to fetch last trading pair");
    }
    return response.json();
  },

  // 거래 페어 ID로 조회
  getTradingPairById: async (id: string): Promise<TradingPairResponse> => {
    const response = await fetch(
      createApiUrl(`${API_CONFIG.ENDPOINTS.TRADING.PAIRS}/${id}`)
    );
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || "Failed to fetch trading pair");
    }
    return response.json();
  },

  // 거래 페어 업데이트
  updateTradingPair: async ({
    id,
    data,
  }: UpdateTradingPairVars): Promise<TradingPairResponse> => {
    const response = await fetch(
      createApiUrl(`${API_CONFIG.ENDPOINTS.TRADING.PAIRS}/${id}`),
      {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      }
    );
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || "Failed to update trading pair");
    }
    return response.json();
  },

  // 거래 페어 비활성화 (데이터 영구 보존)
  deleteTradingPair: async (id: string): Promise<DeleteTradingPairResponse> => {
    const response = await fetch(
      createApiUrl(`${API_CONFIG.ENDPOINTS.TRADING.PAIRS}/${id}`),
      {
        method: "DELETE",
      }
    );
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || "Failed to delete trading pair");
    }
    return response.json();
  },

  // 브라우저 계정 정보 갱신
  updateBrowserAccountInfo: async ({
    id,
    accountInfoA,
    accountInfoB,
  }: {
    id: string;
    accountInfoA?: { accountId: string; memo: string };
    accountInfoB?: { accountId: string; memo: string };
  }): Promise<TradingPairResponse> => {
    const response = await fetch(
      createApiUrl(`${API_CONFIG.ENDPOINTS.TRADING.PAIRS}/${id}/account-info`),
      {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          accountInfoA,
          accountInfoB,
        }),
      }
    );
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(
        errorData.message || "Failed to update browser account info"
      );
    }
    return response.json();
  },

  // 거래 페어 활성화
  activateTradingPair: async ({
    id,
    exchangeAUrl,
    exchangeBUrl,
    accountInfo,
  }: ActivateVars): Promise<TradingPairResponse> => {
    const response = await fetch(
      createApiUrl(`${API_CONFIG.ENDPOINTS.TRADING.PAIRS}/${id}/activate`),
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ exchangeAUrl, exchangeBUrl, accountInfo }),
      }
    );
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || "Failed to activate trading pair");
    }
    return response.json();
  },

  // 거래 페어 비활성화
  deactivateTradingPair: async (id: string): Promise<TradingPairResponse> => {
    const response = await fetch(
      createApiUrl(`${API_CONFIG.ENDPOINTS.TRADING.PAIRS}/${id}/deactivate`),
      {
        method: "POST",
      }
    );
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || "Failed to deactivate trading pair");
    }
    return response.json();
  },

  // 거래 페어 복구
  recoverTradingPairs: async (): Promise<TradingPairResponse[]> => {
    const response = await fetch(
      createApiUrl(API_CONFIG.ENDPOINTS.TRADING.RECOVER),
      {
        method: "POST",
      }
    );
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || "Failed to recover trading pairs");
    }
    return response.json();
  },

  // 자동 복구
  autoRecoverActivePairs: async (): Promise<{
    recoveredPairs: TradingPairResponse[];
    totalActivePairs: number;
  }> => {
    const response = await fetch(
      createApiUrl(API_CONFIG.ENDPOINTS.TRADING.PAIRS_AUTO_RECOVER),
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
      }
    );
    if (!response.ok) {
      throw new Error("Failed to auto recover active pairs");
    }
    const result = await response.json();
    return result.data;
  },

  // 활성 페어 상태 확인
  getActivePairsStatus: async (): Promise<{
    hasActivePairs: boolean;
    activePairsCount: number;
  }> => {
    const response = await fetch(
      createApiUrl(API_CONFIG.ENDPOINTS.TRADING.PAIRS_WITH_BROWSER_PROFILES)
    );
    if (!response.ok) {
      throw new Error("Failed to fetch active pairs status");
    }
    const result = await response.json();
    const pairs = result.data || [];
    const activePairs = pairs.filter(
      (pair: any) => pair.status === "active" && pair.isActive
    );

    return {
      hasActivePairs: activePairs.length > 0,
      activePairsCount: activePairs.length,
    };
  },

  // 거래 코인 생성
  createTradingCoin: async (
    data: CreateTradingCoinVars
  ): Promise<TradingCoinResponse> => {
    const response = await fetch(
      createApiUrl(API_CONFIG.ENDPOINTS.TRADING.COINS),
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          tradingPairId: data.tradingPairId,
          symbol: "BTC/USDT", // 기본 심볼, 필요시 수정
          exchange: data.exchange,
          positionType: data.positionType,
          entryPrice: parseFloat(data.entryPrice),
          currentPrice: parseFloat(data.entryPrice), // 초기에는 entryPrice와 동일
          quantity: parseFloat(data.quantity),
          leverage: parseFloat(data.leverage),
          isActive: true,
        }),
      }
    );
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || "Failed to create trading coin");
    }
    return response.json();
  },

  // 거래 페어의 모든 코인 조회
  getTradingCoinsByPairId: async (
    pairId: string
  ): Promise<TradingCoinResponse[]> => {
    const response = await fetch(
      createApiUrl(`${API_CONFIG.ENDPOINTS.TRADING.PAIRS}/${pairId}/coins`)
    );
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || "Failed to fetch trading coins");
    }
    return response.json();
  },

  // 거래 코인 업데이트
  updateTradingCoin: async ({
    id,
    data,
  }: UpdateTradingCoinVars): Promise<TradingCoinResponse> => {
    const response = await fetch(
      createApiUrl(`${API_CONFIG.ENDPOINTS.TRADING.COINS}/${id}`),
      {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      }
    );
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || "Failed to update trading coin");
    }
    return response.json();
  },

  // 거래 코인 비활성화 (데이터 영구 보존)
  deleteTradingCoin: async (id: string): Promise<void> => {
    const response = await fetch(
      createApiUrl(`${API_CONFIG.ENDPOINTS.TRADING.COINS}/${id}`),
      {
        method: "DELETE",
      }
    );
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || "Failed to delete trading coin");
    }
  },

  // 가격 업데이트
  updateCoinPrice: async ({
    id,
    currentPrice,
  }: UpdateCoinPriceVars): Promise<TradingCoinResponse> => {
    const response = await fetch(
      createApiUrl(`${API_CONFIG.ENDPOINTS.TRADING.COINS}/${id}/price`),
      {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ currentPrice }),
      }
    );
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || "Failed to update coin price");
    }
    return response.json();
  },
};

// 거래 페어 조회 훅
export const useTradingPairs = () => {
  return useQuery({
    queryKey: ["trading-pairs"],
    queryFn: tradingApi.getTradingPairs,
    staleTime: 1000 * 60 * 5, // 5분
    refetchInterval: 1000 * 30, // 30초마다 갱신
  });
};

// 마지막 거래 페어 조회 훅
export const useLastTradingPair = () => {
  return useQuery<SuccessResponse<TradingPairResponse | null>>({
    queryKey: ["last-trading-pair"],
    queryFn: tradingApi.getLastTradingPair,
    staleTime: 1000 * 60 * 5, // 5분
  });
};

// 거래 페어 ID로 조회 훅
export const useTradingPair = (id: string) => {
  return useQuery({
    queryKey: ["trading-pair", id],
    queryFn: () => tradingApi.getTradingPairById(id),
    enabled: !!id,
    staleTime: 1000 * 60 * 5,
    refetchInterval: 1000 * 30,
  });
};

// 브라우저 쌍과 거래 페어를 한 번에 생성하는 훅
export const useCreateTradingPairWithBrowsers = () => {
  const queryClient = useQueryClient();

  return useMutation<
    TradingPairResponse,
    Error,
    CreateTradingPairWithBrowsersVars
  >({
    mutationFn: tradingApi.createTradingPairWithBrowsers,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["trading-pairs"] });
    },
  });
};

// 거래 페어 생성 훅
export const useCreateTradingPair = () => {
  const queryClient = useQueryClient();

  return useMutation<TradingPairResponse, Error, CreateTradingPairVars>({
    mutationFn: tradingApi.createTradingPair,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["trading-pairs"] });
    },
  });
};

// 거래 페어 업데이트 훅
export const useUpdateTradingPair = () => {
  const queryClient = useQueryClient();

  return useMutation<TradingPairResponse, Error, UpdateTradingPairVars>({
    mutationFn: tradingApi.updateTradingPair,
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["trading-pairs"] });
      queryClient.invalidateQueries({
        queryKey: ["trading-pair", variables.id],
      });
    },
  });
};

// 거래 페어 비활성화 훅 (데이터 영구 보존)
export const useDeleteTradingPair = () => {
  const queryClient = useQueryClient();

  return useMutation<DeleteTradingPairResponse, Error, DeleteTradingPairVars>({
    mutationFn: tradingApi.deleteTradingPair,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["trading-pairs"] });
    },
  });
};

// 거래 페어 활성화 훅
export const useActivateTradingPair = () => {
  const queryClient = useQueryClient();

  return useMutation<TradingPairResponse, Error, ActivateVars>({
    mutationFn: tradingApi.activateTradingPair,
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["trading-pairs"] });
      queryClient.invalidateQueries({
        queryKey: ["trading-pair", variables.id],
      });
    },
  });
};

// 거래 페어 비활성화 훅
export const useDeactivateTradingPair = () => {
  const queryClient = useQueryClient();

  return useMutation<TradingPairResponse, Error, DeactivateVars>({
    mutationFn: tradingApi.deactivateTradingPair,
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["trading-pairs"] });
      queryClient.invalidateQueries({
        queryKey: ["trading-pair", variables],
      });
    },
  });
};

// 거래 페어 복구 훅
export const useRecoverTradingPairs = () => {
  const queryClient = useQueryClient();

  return useMutation<TradingPairResponse[], Error, void>({
    mutationFn: tradingApi.recoverTradingPairs,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["trading-pairs"] });
    },
  });
};

// 자동 복구 훅
export const useAutoRecoverActivePairs = () => {
  const queryClient = useQueryClient();

  return useMutation<
    { recoveredPairs: TradingPairResponse[]; totalActivePairs: number },
    Error,
    void
  >({
    mutationFn: tradingApi.autoRecoverActivePairs,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["trading-pairs"] });
    },
  });
};

// 활성 페어 상태 확인 훅
export const useActivePairsStatus = () => {
  const queryClient = useQueryClient();

  return useQuery<{ hasActivePairs: boolean; activePairsCount: number }>({
    queryKey: ["active-pairs-status"],
    queryFn: tradingApi.getActivePairsStatus,
    staleTime: 1000 * 60 * 5, // 5분
    refetchInterval: 1000 * 30, // 30초마다 갱신
  });
};

// 거래 코인 조회 훅
export const useTradingCoins = (pairId: string) => {
  return useQuery<TradingCoinResponse[]>({
    queryKey: ["trading-coins", pairId],
    queryFn: () => tradingApi.getTradingCoinsByPairId(pairId),
    enabled: !!pairId,
    staleTime: 1000 * 60 * 2, // 2분
    refetchInterval: 1000 * 15, // 15초마다 갱신
  });
};

// 거래 코인 생성 훅
export const useCreateTradingCoin = () => {
  const queryClient = useQueryClient();

  return useMutation<TradingCoinResponse, Error, CreateTradingCoinVars>({
    mutationFn: tradingApi.createTradingCoin,
    onSuccess: (data) => {
      queryClient.invalidateQueries({
        queryKey: ["trading-coins", data.tradingPairId],
      });
      queryClient.invalidateQueries({
        queryKey: ["trading-pair", data.tradingPairId],
      });
    },
  });
};

// 거래 코인 업데이트 훅
export const useUpdateTradingCoin = () => {
  const queryClient = useQueryClient();

  return useMutation<TradingCoinResponse, Error, UpdateTradingCoinVars>({
    mutationFn: tradingApi.updateTradingCoin,
    onSuccess: (data) => {
      queryClient.invalidateQueries({
        queryKey: ["trading-coins", data.tradingPairId],
      });
      queryClient.invalidateQueries({
        queryKey: ["trading-pair", data.tradingPairId],
      });
    },
  });
};

// 거래 코인 비활성화 훅 (데이터 영구 보존)
export const useDeleteTradingCoin = () => {
  const queryClient = useQueryClient();

  return useMutation<void, Error, DeleteTradingCoinVars>({
    mutationFn: tradingApi.deleteTradingCoin,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["trading-coins"] });
    },
  });
};

// 가격 업데이트 훅
export const useUpdateCoinPrice = () => {
  const queryClient = useQueryClient();

  return useMutation<TradingCoinResponse, Error, UpdateCoinPriceVars>({
    mutationFn: tradingApi.updateCoinPrice,
    onSuccess: (data) => {
      queryClient.invalidateQueries({
        queryKey: ["trading-coins", data.tradingPairId],
      });
      queryClient.invalidateQueries({
        queryKey: ["trading-pair", data.tradingPairId],
      });
    },
  });
};

// 브라우저 계정 정보 갱신 훅
export const useUpdateBrowserAccountInfo = () => {
  const queryClient = useQueryClient();

  return useMutation<
    TradingPairResponse,
    Error,
    {
      id: string;
      accountInfoA?: { accountId: string; memo: string };
      accountInfoB?: { accountId: string; memo: string };
    }
  >({
    mutationFn: tradingApi.updateBrowserAccountInfo,
    onSuccess: (data) => {
      queryClient.invalidateQueries({
        queryKey: ["trading-pair", data.id],
      });
      queryClient.invalidateQueries({
        queryKey: ["trading-pairs"],
      });
    },
  });
};
