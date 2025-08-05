import React from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { PlusCircle, CheckCircle2, XCircle, Activity, AlertTriangle } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { ExchangeLogo } from '@/components/common/ExchangeLogo'

interface ExchangeInfo {
    name: string
    logo: string
}

interface CreatePairFormProps {
    activePair: {
        exchangeA: ExchangeInfo
        exchangeB: ExchangeInfo
    }
    onCreatePair: () => void
    hasActivePairs?: boolean
    activePairsCount?: number
}

const StatusDisplay = ({
    name,
    isLoggedIn,
    isConnected,
}: { name: string; isLoggedIn: boolean; isConnected: boolean }) => {
    const { t } = useTranslation()

    return (
        <div className="flex items-center justify-between rounded-lg bg-gradient-to-r from-slate-50 to-slate-100 dark:from-slate-800 dark:to-slate-700 border border-slate-200 dark:border-slate-600 p-4 shadow-sm hover:shadow-md transition-all duration-200">
            <div className="flex items-center gap-3">
                <ExchangeLogo name={name} size="lg" className="bg-gradient-to-br from-blue-500 to-blue-600 dark:from-blue-400 dark:to-blue-500" />
                <span className="font-semibold text-slate-900 dark:text-slate-100">{name}</span>
            </div>
            <div className="flex items-center gap-4">
                <div className="flex items-center gap-2" title={t('trading.exchangeStatus.loginStatus')}>
                    {isLoggedIn ? (
                        <CheckCircle2 className="h-5 w-5 text-emerald-500 dark:text-emerald-400" />
                    ) : (
                        <XCircle className="h-5 w-5 text-red-500 dark:text-red-400" />
                    )}
                    <span className="text-sm font-medium text-slate-700 dark:text-slate-300">
                        {isLoggedIn ? t('trading.exchangeStatus.loggedIn') : t('trading.exchangeStatus.loggedOut')}
                    </span>
                </div>
                <div className="flex items-center gap-2" title={t('trading.exchangeStatus.networkStatus')}>
                    {isConnected ? (
                        <CheckCircle2 className="h-5 w-5 text-emerald-500 dark:text-emerald-400" />
                    ) : (
                        <XCircle className="h-5 w-5 text-red-500 dark:text-red-400" />
                    )}
                    <span className="text-sm font-medium text-slate-700 dark:text-slate-300">
                        {isConnected ? t('trading.exchangeStatus.connected') : t('trading.exchangeStatus.disconnected')}
                    </span>
                </div>
            </div>
        </div>
    )
}

export function CreatePairForm({ activePair, onCreatePair, hasActivePairs = false, activePairsCount = 0 }: CreatePairFormProps) {
    const { t } = useTranslation()

    // 실제 애플리케이션에서는 API를 통해 상태를 받아옵니다.
    const exchangeAStatus = { isLoggedIn: true, isConnected: true }
    const exchangeBStatus = { isLoggedIn: false, isConnected: true }

    return (
        <Card className="border-0 shadow-xl bg-white dark:bg-slate-900">
            <CardHeader className="pb-4">
                <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-gradient-to-br from-emerald-500 to-emerald-600 dark:from-emerald-400 dark:to-emerald-500 rounded-lg flex items-center justify-center">
                        <Activity className="text-white h-4 w-4" />
                    </div>
                    <div>
                        <CardTitle className="text-xl font-bold text-slate-900 dark:text-slate-100">
                            {t('trading.exchangeStatus.title')}
                        </CardTitle>
                        <CardDescription className="text-slate-600 dark:text-slate-400">
                            {t('trading.exchangeStatus.description')}
                        </CardDescription>
                    </div>
                </div>
            </CardHeader>
            <CardContent className="space-y-6">
                {hasActivePairs ? (
                    // 활성 페어가 있는 경우 - 거래 진행 중 표시
                    <div className="text-center py-8">
                        <div className="flex items-center justify-center gap-3 mb-4">
                            <AlertTriangle className="h-8 w-8 text-amber-500 dark:text-amber-400" />
                            <div>
                                <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100">
                                    현재 거래 진행 중
                                </h3>
                                <p className="text-sm text-slate-600 dark:text-slate-400">
                                    {activePairsCount}개의 활성 페어가 실행 중입니다.
                                </p>
                            </div>
                        </div>
                        <div className="bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-700 rounded-lg p-4">
                            <p className="text-sm text-amber-700 dark:text-amber-300">
                                새로운 페어를 생성하려면 기존 활성 페어를 먼저 비활성화해야 합니다.
                            </p>
                        </div>
                    </div>
                ) : (
                    // 활성 페어가 없는 경우 - 거래소 상태 표시
                    <>
                        <div className="text-center mb-4">
                            <p className="text-sm text-slate-600 dark:text-slate-400 mb-2">
                                아직 활성화된 거래소가 없습니다.
                            </p>
                        </div>
                        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                            <StatusDisplay name={activePair.exchangeA.name} {...exchangeAStatus} />
                            <StatusDisplay name={activePair.exchangeB.name} {...exchangeBStatus} />
                        </div>
                        <div className="flex justify-center pt-4">
                            <Button
                                size="lg"
                                className="w-full max-w-sm text-base bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 dark:from-blue-500 dark:to-blue-600 dark:hover:from-blue-600 dark:hover:to-blue-700 text-white shadow-lg hover:shadow-xl transition-all duration-200"
                                onClick={onCreatePair}
                            >
                                <PlusCircle className="mr-2 h-5 w-5" />
                                {t('trading.hedgingPairs.createNew')}
                            </Button>
                        </div>
                    </>
                )}
            </CardContent>
        </Card>
    )
} 