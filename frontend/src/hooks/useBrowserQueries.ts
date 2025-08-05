import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { puppeteerApi, fingerprintApi } from "../api/browserApi";
import type {
  LaunchBrowserRequest,
  ReopenBrowserRequest,
  SaveFingerprintRequest,
  UpdateSessionRequest,
} from "../types/api";

// Query Keys
export const browserQueryKeys = {
  all: ["browser"] as const,
  profiles: () => [...browserQueryKeys.all, "profiles"] as const,
  profile: (uuid: string) => [...browserQueryKeys.profiles(), uuid] as const,
  status: () => [...browserQueryKeys.all, "status"] as const,
};

// 브라우저 프로필 목록 조회
export const useProfiles = () => {
  return useQuery({
    queryKey: browserQueryKeys.profiles(),
    queryFn: fingerprintApi.getProfiles,
    staleTime: 30 * 1000, // 30초
  });
};

// 개별 브라우저 프로필 조회
export const useProfile = (uuid: string) => {
  return useQuery({
    queryKey: browserQueryKeys.profile(uuid),
    queryFn: () => fingerprintApi.getProfile(uuid),
    enabled: !!uuid,
    staleTime: 5 * 60 * 1000, // 5분
  });
};

// 브라우저 상태 조회
export const useBrowserStatus = () => {
  return useQuery({
    queryKey: browserQueryKeys.status(),
    queryFn: puppeteerApi.getBrowserStatus,
    staleTime: 10 * 1000, // 10초
    refetchInterval: 30 * 1000, // 30초마다 자동 갱신
  });
};

// 브라우저 실행 뮤테이션
export const useLaunchBrowser = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: LaunchBrowserRequest) =>
      puppeteerApi.launchBrowser(data),
    onSuccess: () => {
      // 브라우저 상태 캐시 무효화
      queryClient.invalidateQueries({ queryKey: browserQueryKeys.status() });
    },
    onError: (error) => {
      console.error("브라우저 실행 실패:", error);
    },
  });
};

// 브라우저 재생성 뮤테이션
export const useReopenBrowser = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: ReopenBrowserRequest) =>
      puppeteerApi.reopenBrowser(data),
    onSuccess: () => {
      // 브라우저 상태 캐시 무효화
      queryClient.invalidateQueries({ queryKey: browserQueryKeys.status() });
    },
    onError: (error) => {
      console.error("브라우저 재생성 실패:", error);
    },
  });
};

// 프로필 저장 뮤테이션
export const useSaveFingerprint = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: SaveFingerprintRequest) =>
      fingerprintApi.saveFingerprint(data),
    onSuccess: (uuid) => {
      // 프로필 목록 캐시 무효화
      queryClient.invalidateQueries({ queryKey: browserQueryKeys.profiles() });
      // 새로 생성된 프로필 캐시 무효화
      queryClient.invalidateQueries({
        queryKey: browserQueryKeys.profile(uuid),
      });
    },
    onError: (error) => {
      console.error("프로필 저장 실패:", error);
    },
  });
};

// 세션 업데이트 뮤테이션
export const useUpdateSession = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: UpdateSessionRequest) =>
      fingerprintApi.updateSession(data),
    onSuccess: (_, variables) => {
      // 해당 프로필 캐시 무효화
      queryClient.invalidateQueries({
        queryKey: browserQueryKeys.profile(variables.uuid),
      });
    },
    onError: (error) => {
      console.error("세션 업데이트 실패:", error);
    },
  });
};

// 프로필 삭제 뮤테이션
export const useDeleteProfile = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (uuid: string) => fingerprintApi.deleteProfile(uuid),
    onSuccess: (_, uuid) => {
      // 프로필 목록 캐시 무효화
      queryClient.invalidateQueries({ queryKey: browserQueryKeys.profiles() });
      // 삭제된 프로필 캐시 제거
      queryClient.removeQueries({ queryKey: browserQueryKeys.profile(uuid) });
    },
    onError: (error) => {
      console.error("프로필 삭제 실패:", error);
    },
  });
};
