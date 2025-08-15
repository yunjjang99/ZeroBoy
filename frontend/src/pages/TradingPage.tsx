import React, { useState, useEffect } from 'react'
import { HedgingPairList, type HedgingPair } from '@/components/HedgingPairList'
import { ExchangePairSelector } from '@/components/ExchangePairSelector'
import { CreatePairForm } from '@/components/CreatePairForm'
import AccountInfoModal from '@/components/AccountInfoModal'
import { useTranslation } from 'react-i18next'
import { useTradingPairs, useCreateTradingPairWithBrowsers, useActivateTradingPair, useDeactivateTradingPair, useDeleteTradingPair, useRecoverTradingPairs, useAutoRecoverActivePairs, useActivePairsStatus, useLastTradingPair, useUpdateTradingPair, Exchange } from '@/hooks/useTradingQueries'
import { useAlert } from '@/contexts/AlertContext'

interface ExchangeInfo {
    name: string
    logo: string
}

const TradingPage: React.FC = () => {
    const { t } = useTranslation()
    const { showToast, showAlert, showConfirm } = useAlert()

    // 거래소 정보 (Exchange enum 기반)
    const availableExchanges: { [key in Exchange]: ExchangeInfo } = {
        [Exchange.ORANGEX]: { name: 'OrangeX', logo: '/exchanges/orangex.png' },
        [Exchange.BYDFI]: { name: 'Bydfi', logo: '/exchanges/bydfi.png' },
        [Exchange.BINANCE]: { name: 'Binance', logo: '/exchanges/binance.png' },
    }

    // 현재 활성 거래소 페어
    const [activePair, setActivePair] = useState({
        keyA: Exchange.ORANGEX,
        keyB: Exchange.BYDFI
    })

    // 계정 정보 모달 상태
    const [isAccountModalOpen, setIsAccountModalOpen] = useState(false)

    // API 훅들
    const { data: tradingPairs, isLoading, error } = useTradingPairs()
    const { data: activePairsStatus } = useActivePairsStatus()
    const { data: lastTradingPair } = useLastTradingPair()
    const autoRecoverMutation = useAutoRecoverActivePairs()
    const updateTradingPairMutation = useUpdateTradingPair()

    // 백엔드 응답 구조에서 실제 데이터 추출
    const tradingPairsList = tradingPairs || []
    const createTradingPairMutation = useCreateTradingPairWithBrowsers()
    const activateTradingPairMutation = useActivateTradingPair()
    const deactivateTradingPairMutation = useDeactivateTradingPair()
    const deleteTradingPairMutation = useDeleteTradingPair()
    const recoverTradingPairsMutation = useRecoverTradingPairs()

    // 앱 시작 시 자동 복구 실행 (한 번만)
    useEffect(() => {
        const performAutoRecover = async () => {
            try {
                // sessionStorage를 사용하여 현재 세션에서 한 번만 실행되도록 체크
                const hasCheckedRecovery = sessionStorage.getItem('hasCheckedRecovery')

                if (!hasCheckedRecovery) {
                    console.log(lastTradingPair, "lastTradingPair")
                    // 마지막 페어가 있고, 상태가 inactive가 아닌 경우 사용자에게 확인
                    if (lastTradingPair?.data && lastTradingPair.data.status !== 'inactive') {
                        // 사용자에게 복구 여부 확인
                        showConfirm(
                            `${lastTradingPair.data.description}이(가) ${lastTradingPair.data.status} 상태입니다. 복구하시겠습니까?`,
                            async () => {
                                // 사용자가 복구를 선택한 경우
                                try {
                                    const result = await autoRecoverMutation.mutateAsync()
                                    if (result.totalActivePairs > 0) {
                                        showToast(`페어가 복구되었습니다.`, {
                                            type: 'success',
                                            title: '자동 복구 완료',
                                            duration: 3000
                                        })
                                    }
                                } catch (error) {
                                    console.error('복구 실패:', error)
                                }
                            },
                            {
                                type: 'warning',
                                title: '거래 페어 복구 확인',
                                confirmText: '복구',
                                cancelText: '비활성화',
                            }
                        )

                        // 사용자가 취소를 선택한 경우 (비활성화)
                        const handleCancel = async () => {
                            try {
                                await updateTradingPairMutation.mutateAsync({
                                    id: lastTradingPair.data.id,
                                    data: { status: 'inactive', isActive: false }
                                })
                                showToast('마지막 거래 페어가 비활성화되었습니다.', {
                                    type: 'info',
                                    title: '페어 비활성화',
                                    duration: 3000
                                })
                            } catch (error) {
                                console.error('비활성화 실패:', error)
                            }
                        }

                        // 취소 버튼 클릭 시 비활성화 실행
                        setTimeout(() => {
                            // 모달이 닫힌 후 비활성화 실행
                            handleCancel()
                        }, 100)
                    } else {
                        // 마지막 페어가 없거나 이미 inactive 상태인 경우 기존 복구 로직 실행
                        const result = await autoRecoverMutation.mutateAsync()
                        if (result.totalActivePairs > 0) {
                            showToast(`${result.totalActivePairs}개의 활성 페어가 복구되었습니다.`, {
                                type: 'success',
                                title: '자동 복구 완료',
                                duration: 3000
                            })
                        }
                    }

                    // 복구 체크 완료 표시 (현재 세션 동안 한 번만 실행)
                    sessionStorage.setItem('hasCheckedRecovery', 'true')
                }
            } catch (error) {
                console.error('자동 복구 실패:', error)
                // 자동 복구 실패는 사용자에게 알리지 않음 (앱 시작 시이므로)
            }
        }

        // lastTradingPair가 로드된 후에만 실행
        if (lastTradingPair !== undefined) {
            performAutoRecover()
        }
    }, [lastTradingPair]) // lastTradingPair 의존성 추가

    // API 데이터를 컴포넌트 형식으로 변환
    const hedgingPairs: HedgingPair[] = Array.isArray(tradingPairsList) ? tradingPairsList.map(pair => ({
        id: pair.id,
        symbol: pair.name,
        status: pair.status === 'active' ? 'Running' :
            pair.status === 'inactive' ? 'Waiting' :
                pair.status === 'error' ? 'Error' : 'Waiting',
        longPosition: pair.tradingCoins?.find(coin => coin.positionType === 'long') ? {
            exchange: pair.tradingCoins.find(coin => coin.positionType === 'long')!.exchange,
            entryPrice: pair.tradingCoins.find(coin => coin.positionType === 'long')!.entryPrice,
            markPrice: pair.tradingCoins.find(coin => coin.positionType === 'long')!.currentPrice,
            quantity: pair.tradingCoins.find(coin => coin.positionType === 'long')!.quantity,
            leverage: pair.tradingCoins.find(coin => coin.positionType === 'long')!.leverage,
            unrealizedPnl: pair.tradingCoins.find(coin => coin.positionType === 'long')!.unrealizedPnl || 0
        } : undefined,
        shortPosition: pair.tradingCoins?.find(coin => coin.positionType === 'short') ? {
            exchange: pair.tradingCoins.find(coin => coin.positionType === 'short')!.exchange,
            entryPrice: pair.tradingCoins.find(coin => coin.positionType === 'short')!.entryPrice,
            markPrice: pair.tradingCoins.find(coin => coin.positionType === 'short')!.currentPrice,
            quantity: pair.tradingCoins.find(coin => coin.positionType === 'short')!.quantity,
            leverage: pair.tradingCoins.find(coin => coin.positionType === 'short')!.leverage,
            unrealizedPnl: pair.tradingCoins.find(coin => coin.positionType === 'short')!.unrealizedPnl || 0
        } : undefined
    })) : []

    const handleSavePair = (newKeys: { keyA: Exchange; keyB: Exchange }) => {
        setActivePair(newKeys)
    }

    const handleCreatePair = () => {
        setIsAccountModalOpen(true)
    }

    const handleAccountInfoConfirm = async (accountInfo: any) => {
        try {
            setIsAccountModalOpen(false)

            // 기존 활성 페어가 있는지 확인 (배열인지 확인)
            const activePairs = Array.isArray(tradingPairsList)
                ? tradingPairsList.filter(pair => pair.status === 'active' && pair.isActive)
                : []
            if (activePairs.length > 0) {
                showToast('기존 활성 페어가 비활성화됩니다.', {
                    type: 'info',
                    title: '알림',
                    duration: 3000
                })
            }

            // 거래소별 URL 매핑
            const exchangeUrls: { [key in Exchange]: string } = {
                [Exchange.ORANGEX]: 'https://www.orangex.com',
                [Exchange.BYDFI]: 'https://www.bydfi.com',
                [Exchange.BINANCE]: 'https://www.binance.com',
            }

            const exchangeAUrl = exchangeUrls[activePair.keyA]
            const exchangeBUrl = exchangeUrls[activePair.keyB]

            // 브라우저 쌍과 거래 페어를 한 번에 생성
            const newPair = await createTradingPairMutation.mutateAsync({
                exchangeA: activePair.keyA,
                exchangeB: activePair.keyB,
                exchangeAUrl,
                exchangeBUrl,
                accountInfo: accountInfo
            })

            showToast('새 거래 페어가 생성되었습니다.', {
                type: 'success',
                title: '생성 완료',
                duration: 3000
            })
        } catch (error) {
            console.error('거래 페어 생성 실패:', error)
            showAlert('거래 페어 생성에 실패했습니다.', {
                type: 'error',
                title: '생성 실패'
            })
        }
    }

    const handleDeletePair = async (pairId: string) => {
        try {
            await deleteTradingPairMutation.mutateAsync(pairId)
            showToast('거래 페어가 삭제되었습니다.', {
                type: 'success',
                title: '삭제 완료',
                duration: 3000
            })
        } catch (error) {
            console.error('거래 페어 삭제 실패:', error)
            showAlert('거래 페어 삭제에 실패했습니다.', {
                type: 'error',
                title: '삭제 실패'
            })
        }
    }

    const handleLaunchBrowser = async (pairId: string, accountInfo?: any) => {
        try {
            const pair = Array.isArray(tradingPairsList)
                ? tradingPairsList.find(p => p.id === pairId)
                : null
            if (!pair) {
                throw new Error('거래 페어를 찾을 수 없습니다.')
            }

            // 기존 활성 페어가 있는지 확인 (현재 페어 제외)
            const otherActivePairs = Array.isArray(tradingPairsList)
                ? tradingPairsList.filter(p =>
                    p.id !== pairId && p.status === 'active' && p.isActive
                )
                : []
            if (otherActivePairs.length > 0) {
                showToast('기존 활성 페어가 비활성화됩니다.', {
                    type: 'info',
                    title: '알림',
                    duration: 3000
                })
            }

            // 거래소별 URL 매핑
            const exchangeUrls: { [key in Exchange]: string } = {
                [Exchange.ORANGEX]: 'https://www.orangex.com',
                [Exchange.BYDFI]: 'https://www.bydfi.com',
                [Exchange.BINANCE]: 'https://www.binance.com',
            }

            const exchangeAUrl = exchangeUrls[pair.exchangeA]
            const exchangeBUrl = exchangeUrls[pair.exchangeB]

            await activateTradingPairMutation.mutateAsync({
                id: pairId,
                exchangeAUrl,
                exchangeBUrl,
                accountInfo: accountInfo // 계정 정보 전달
            })

            showToast('브라우저 쌍이 활성화되었습니다.', {
                type: 'success',
                title: '활성화 완료',
                duration: 3000
            })
        } catch (error) {
            console.error('브라우저 활성화 실패:', error)
            showAlert('브라우저 활성화에 실패했습니다.', {
                type: 'error',
                title: '활성화 실패'
            })
        }
    }

    const activePairInfo = {
        exchangeA: availableExchanges[activePair.keyA],
        exchangeB: availableExchanges[activePair.keyB],
    }

    // 로딩 상태 처리
    if (isLoading) {
        return (
            <div className="min-h-screen bg-theme-bg-secondary p-4 sm:p-6 lg:p-8">
                <div className="mx-auto max-w-screen-2xl">
                    <div className="flex items-center justify-center h-64">
                        <div className="text-lg text-theme-text-tertiary">
                            {t('common.loading')}...
                        </div>
                    </div>
                </div>
            </div>
        )
    }

    // 에러 상태 처리
    if (error) {
        return (
            <div className="min-h-screen bg-theme-bg-secondary p-4 sm:p-6 lg:p-8">
                <div className="mx-auto max-w-screen-2xl">
                    <div className="flex items-center justify-center h-64">
                        <div className="text-lg text-red-600 dark:text-red-400">
                            {t('common.error')}: {error.message}
                        </div>
                    </div>
                </div>
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-theme-bg-secondary p-4 sm:p-6 lg:p-8">
            <div className="mx-auto max-w-screen-2xl">
                {/* 헤더 */}
                <header className="relative mb-8 rounded-lg border border-theme-border-primary bg-theme-bg-card p-6 text-center shadow-sm">
                    <div className="absolute right-4 top-4">
                        <ExchangePairSelector
                            availableExchanges={availableExchanges}
                            activeKeys={activePair}
                            onSave={handleSavePair}
                        />
                    </div>
                    <h1 className="text-3xl font-bold tracking-tight text-theme-text-primary">
                        {t('trading.title')}
                    </h1>
                    <p className="mt-1 text-sm text-theme-text-tertiary">
                        {t('trading.subtitle')}
                    </p>
                    <div className="mt-2 flex items-center justify-center gap-4">
                        <div className="flex items-center gap-2">
                            <div className="w-6 h-6 bg-gradient-to-br from-blue-500 to-blue-600 dark:from-blue-400 dark:to-blue-500 rounded-md flex items-center justify-center">
                                <span className="text-white font-bold text-xs">
                                    {activePairInfo.exchangeA.name.charAt(0)}
                                </span>
                            </div>
                            <span className="font-semibold text-theme-text-primary">{activePairInfo.exchangeA.name}</span>
                        </div>
                        <span className="text-lg font-bold text-theme-text-muted">↔</span>
                        <div className="flex items-center gap-2">
                            <div className="w-6 h-6 bg-gradient-to-br from-blue-500 to-blue-600 dark:from-blue-400 dark:to-blue-500 rounded-md flex items-center justify-center">
                                <span className="text-white font-bold text-xs">
                                    {activePairInfo.exchangeB.name.charAt(0)}
                                </span>
                            </div>
                            <span className="font-semibold text-theme-text-primary">{activePairInfo.exchangeB.name}</span>
                        </div>
                    </div>
                </header>

                {/* 거래소 상태 및 생성 폼 */}
                <CreatePairForm
                    activePair={activePairInfo}
                    onCreatePair={handleCreatePair}
                    hasActivePairs={activePairsStatus?.hasActivePairs}
                    activePairsCount={activePairsStatus?.activePairsCount}
                />

                {/* 헷징 페어 목록 */}
                <div className="mt-8">
                    <HedgingPairList
                        pairs={hedgingPairs}
                        exchanges={availableExchanges}
                        onDelete={handleDeletePair}
                    // onLaunchBrowser={handleLaunchBrowser}
                    />
                </div>

                {/* 계정 정보 모달 */}
                <AccountInfoModal
                    isOpen={isAccountModalOpen}
                    onClose={() => setIsAccountModalOpen(false)}
                    onConfirm={handleAccountInfoConfirm}
                    exchangeA={availableExchanges[activePair.keyA].name}
                    exchangeB={availableExchanges[activePair.keyB].name}
                />
            </div>
        </div>
    )
}

export default TradingPage 