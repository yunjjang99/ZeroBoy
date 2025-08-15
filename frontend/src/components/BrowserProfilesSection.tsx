import React, { useState } from 'react'
import { Plus, Globe, Loader2, AlertCircle, Link } from 'lucide-react'
import { BrowserProfileCard } from './BrowserProfileCard'
import { useTradingPairsWithBrowserProfiles, useLaunchBrowser, useReopenBrowser, useBrowserStatuses } from '../hooks/useBrowserQueries'
import { useDeleteTradingPair } from '../hooks/useTradingQueries'
import { useAlert } from '../contexts/AlertContext'
import UrlInputModal from './UrlInputModal'
import { useQueryClient } from '@tanstack/react-query'

const BrowserProfilesSection: React.FC = () => {
    const [creating, setCreating] = useState(false)
    const [showUrlModal, setShowUrlModal] = useState(false)

    // Query Client 가져오기
    const queryClient = useQueryClient()

    // Tanstack Query 훅들 사용
    const { data: pairs = [], isLoading, error } = useTradingPairsWithBrowserProfiles()
    const { data: browserStatusesData = { count: 0, statuses: [] } } = useBrowserStatuses()
    const launchBrowserMutation = useLaunchBrowser()
    const reopenBrowserMutation = useReopenBrowser()
    const deleteTradingPairMutation = useDeleteTradingPair()

    // Alert 시스템 사용
    const { showAlert, showConfirm, showToast } = useAlert()

    // 브라우저 상태 데이터 추출
    const browserStatuses = browserStatusesData.statuses || []

    const handleCreateProfile = async (url: string) => {
        setCreating(true)
        try {
            const result = await launchBrowserMutation.mutateAsync({ url })
            showToast(`브라우저가 생성되었습니다. UUID: ${result.uuid}`, {
                type: 'success',
                title: '성공',
                duration: 3000
            })
            // 프로필 목록 쿼리 무효화하여 자동 갱신
            queryClient.invalidateQueries({ queryKey: ['browser', 'trading-pairs-with-profiles'] })
        } catch (error) {
            console.error('프로필 생성 실패:', error)
            showAlert('프로필 생성에 실패했습니다.', {
                type: 'error',
                title: '오류'
            })
        } finally {
            setCreating(false)
        }
    }

    const handleReopenProfile = async (uuid: string) => {
        try {
            const result = await reopenBrowserMutation.mutateAsync({ uuid })

            // 이미 실행 중인 브라우저인지 확인
            if (result.isAlreadyRunning) {
                showToast(`이미 실행 중인 브라우저입니다. 페이지 제목: ${result.title}`, {
                    type: 'info',
                    title: '알림',
                    duration: 3000
                })
            } else {
                showToast(`브라우저가 재생성되었습니다. 페이지 제목: ${result.title}`, {
                    type: 'success',
                    title: '성공',
                    duration: 3000
                })
            }

            // 프로필 목록 쿼리 무효화하여 활성 상태 업데이트
            queryClient.invalidateQueries({ queryKey: ['browser', 'trading-pairs-with-profiles'] })
        } catch (error) {
            console.error('프로필 재생성 실패:', error)
            showAlert('프로필 재생성에 실패했습니다.', {
                type: 'error',
                title: '오류'
            })
        }
    }

    const handleDeleteProfile = async (pairId: string) => {
        showConfirm('정말로 이 거래 페어를 삭제하시겠습니까? 브라우저 쌍도 함께 삭제됩니다.', async () => {
            try {
                await deleteTradingPairMutation.mutateAsync(pairId)
                showToast('거래 페어가 삭제되었습니다.', {
                    type: 'success',
                    title: '성공',
                    duration: 3000
                })
                // 프로필 목록 쿼리 무효화하여 자동 갱신
                queryClient.invalidateQueries({ queryKey: ['browser', 'trading-pairs-with-profiles'] })
            } catch (error) {
                console.error('거래 페어 삭제 실패:', error)
                showAlert('거래 페어 삭제에 실패했습니다.', {
                    type: 'error',
                    title: '오류'
                })
            }
        }, {
            type: 'danger',
            title: '거래 페어 삭제',
            confirmText: '삭제',
            cancelText: '취소'
        })
    }

    if (isLoading) {
        return (
            <div className="flex items-center justify-center h-48 sm:h-64">
                <Loader2 className="h-6 w-6 sm:h-8 sm:w-8 animate-spin text-blue-500 dark:text-blue-400" />
            </div>
        )
    }

    if (error) {
        return (
            <div className="p-3 sm:p-6 bg-white dark:bg-black rounded-lg shadow-sm">
                <div className="text-center py-8 sm:py-12">
                    <div className="text-red-500 dark:text-red-400 mb-3 sm:mb-4">
                        <AlertCircle className="h-8 w-8 sm:h-12 sm:w-12 mx-auto" />
                    </div>
                    <h3 className="text-base sm:text-lg font-semibold text-gray-900 dark:text-white mb-2">오류가 발생했습니다</h3>
                    <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400">
                        거래 페어 정보를 불러오는 중 문제가 발생했습니다.
                        {error instanceof Error && (
                            <span className="block mt-2 text-xs sm:text-sm text-red-500 dark:text-red-400">
                                {error.message}
                            </span>
                        )}
                    </p>
                    <button
                        onClick={() => window.location.reload()}
                        className="mt-3 sm:mt-4 px-3 py-2 sm:px-4 sm:py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm sm:text-base"
                    >
                        다시 시도
                    </button>
                </div>
            </div>
        )
    }

    return (
        <div className="p-3 sm:p-6">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-0 mb-4 sm:mb-6">
                <div className="flex items-center gap-2 sm:gap-3">
                    <Link className="h-5 w-5 sm:h-6 sm:w-6 text-blue-500 dark:text-blue-400" />
                    <h2 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white">거래 페어 브라우저 관리</h2>
                </div>
            </div>

            {pairs.length === 0 ? (
                <div className="text-center py-8 sm:py-12">
                    <Link className="h-8 w-8 sm:h-12 sm:w-12 text-gray-400 dark:text-gray-500 mx-auto mb-3 sm:mb-4" />
                    <h3 className="text-base sm:text-lg font-medium text-gray-700 dark:text-gray-300 mb-2">거래 페어가 없습니다</h3>
                    <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400">새로운 거래 페어를 생성해보세요.</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 lg:gap-6">
                    {pairs.map((pair) => (
                        <BrowserProfileCard
                            key={pair.pairId}
                            pair={pair}
                            onReopen={handleReopenProfile}
                            onDelete={handleDeleteProfile}
                            browserStatuses={browserStatuses}
                        />
                    ))}
                </div>
            )}

            {/* URL 입력 모달 */}
            <UrlInputModal
                isOpen={showUrlModal}
                onClose={() => setShowUrlModal(false)}
                onConfirm={handleCreateProfile}
            />
        </div>
    )
}

export default BrowserProfilesSection 