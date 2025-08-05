import React from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { PlusCircle, CheckCircle2, XCircle, Activity } from 'lucide-react'
import { useTranslation } from 'react-i18next'

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
                <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-600 dark:from-blue-400 dark:to-blue-500 rounded-lg flex items-center justify-center shadow-sm">
                    <span className="text-white font-bold text-sm">{name.charAt(0)}</span>
                </div>
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

export function CreatePairForm({ activePair, onCreatePair }: CreatePairFormProps) {
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
            </CardContent>
        </Card>
    )
} 