import React, { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { PlusCircle, CheckCircle2, XCircle, TrendingUp, Activity } from 'lucide-react'
import { HedgingPairCard, type HedgingPair } from './HedgingPairCard'
import { ExchangePairSelector } from './ExchangePairSelector'
import { useTranslation } from 'react-i18next'

interface ExchangeInfo {
  name: string
  logo: string
}

interface ExchangeStatus {
  isLoggedIn: boolean
  isConnected: boolean
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

const TradingSection: React.FC = () => {
  const { t } = useTranslation()

  // 거래소 정보
  const availableExchanges: { [key: string]: ExchangeInfo } = {
    binance: { name: 'Binance', logo: '/exchanges/binance.png' },
    bybit: { name: 'Bybit', logo: '/exchanges/bybit.png' },
    okx: { name: 'OKX', logo: '/exchanges/okx.png' },
    upbit: { name: 'Upbit', logo: '/exchanges/upbit.png' },
    bithumb: { name: 'Bithumb', logo: '/exchanges/bithumb.png' },
  }

  // 현재 활성 거래소 페어
  const [activePair, setActivePair] = useState({
    keyA: 'binance',
    keyB: 'bybit'
  })

  // 거래소 상태 (실제로는 API에서 받아옴)
  const exchangeStatuses: { [key: string]: ExchangeStatus } = {
    binance: { isLoggedIn: true, isConnected: true },
    bybit: { isLoggedIn: false, isConnected: true },
    okx: { isLoggedIn: true, isConnected: false },
    upbit: { isLoggedIn: false, isConnected: false },
    bithumb: { isLoggedIn: true, isConnected: true },
  }

  // 헷징 페어 데이터 (실제로는 API에서 받아옴)
  const [hedgingPairs, setHedgingPairs] = useState<HedgingPair[]>([
    {
      id: '1',
      symbol: 'BTC/USDT',
      status: t('trading.status.running'),
      longPosition: {
        exchange: 'binance',
        entryPrice: 45000,
        markPrice: 45200,
        quantity: 0.1,
        leverage: 10,
        unrealizedPnl: 20.0
      },
      shortPosition: {
        exchange: 'bybit',
        entryPrice: 45000,
        markPrice: 44800,
        quantity: 0.1,
        leverage: 10,
        unrealizedPnl: 20.0
      }
    },
    {
      id: '2',
      symbol: 'ETH/USDT',
      status: t('trading.status.waiting'),
      longPosition: {
        exchange: 'binance',
        entryPrice: 2800,
        markPrice: 2820,
        quantity: 1.0,
        leverage: 5,
        unrealizedPnl: 20.0
      },
      shortPosition: {
        exchange: 'bybit',
        entryPrice: 2800,
        markPrice: 2780,
        quantity: 1.0,
        leverage: 5,
        unrealizedPnl: 20.0
      }
    },
    {
      id: '3',
      symbol: 'SOL/USDT',
      status: t('trading.status.error'),
      longPosition: {
        exchange: 'binance',
        entryPrice: 100,
        markPrice: 98,
        quantity: 10,
        leverage: 20,
        unrealizedPnl: -20.0
      }
    }
  ])

  const handleSavePair = (newKeys: { keyA: string; keyB: string }) => {
    setActivePair(newKeys)
    // 실제로는 API 호출하여 거래소 페어 설정
  }

  const handleCreatePair = () => {
    // 새 헷징 페어 생성 로직
    console.log('새 헷징 페어 생성')
  }

  const handleDeletePair = (pairId: string) => {
    setHedgingPairs(prev => prev.filter(pair => pair.id !== pairId))
  }

  const handleLaunchBrowser = (pairId: string) => {
    // 브라우저 실행 로직
    console.log(`브라우저 실행: ${pairId}`)
  }

  return (
    <div className="p-3 sm:p-6 space-y-6 bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800 min-h-screen">
      {/* 헤더 */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-0">
        <div className="flex items-center gap-3 sm:gap-4">
          <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 dark:from-blue-400 dark:to-blue-500 rounded-xl flex items-center justify-center shadow-lg">
            <TrendingUp className="text-white h-6 w-6" />
          </div>
          <div>
            <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-slate-100">
              {t('trading.title')}
            </h2>
            <p className="text-slate-600 dark:text-slate-400 text-sm sm:text-base">
              {t('trading.subtitle')}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <ExchangePairSelector
            availableExchanges={availableExchanges}
            activeKeys={activePair}
            onSave={handleSavePair}
          />
          <Button
            onClick={handleCreatePair}
            className="flex items-center gap-2 px-4 py-2 sm:px-6 sm:py-3 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 dark:from-blue-500 dark:to-blue-600 dark:hover:from-blue-600 dark:hover:to-blue-700 text-white rounded-xl transition-all duration-200 shadow-lg hover:shadow-xl text-sm sm:text-base font-semibold"
          >
            <PlusCircle className="h-4 w-4 sm:h-5 sm:w-5" />
            <span className="hidden sm:inline">{t('trading.hedgingPairs.createNew')}</span>
            <span className="sm:hidden">{t('trading.hedgingPairs.createNewShort')}</span>
          </Button>
        </div>
      </div>

      {/* 거래소 상태 */}
      <Card className="border-0 shadow-xl bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm">
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
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <StatusDisplay
              name={availableExchanges[activePair.keyA].name}
              {...exchangeStatuses[activePair.keyA]}
            />
            <StatusDisplay
              name={availableExchanges[activePair.keyB].name}
              {...exchangeStatuses[activePair.keyB]}
            />
          </div>
        </CardContent>
      </Card>

      {/* 헷징 페어 목록 */}
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <h3 className="text-xl font-bold text-slate-900 dark:text-slate-100">
              {t('trading.hedgingPairs.title')}
            </h3>
            <div className="px-3 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 rounded-full text-sm font-medium">
              {t('trading.hedgingPairs.total', { count: hedgingPairs.length })}
            </div>
          </div>
        </div>

        {hedgingPairs.length === 0 ? (
          <Card className="border-0 shadow-xl bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm">
            <CardContent className="flex flex-col items-center justify-center py-16">
              <div className="w-20 h-20 bg-gradient-to-br from-slate-100 to-slate-200 dark:from-slate-700 dark:to-slate-600 rounded-full flex items-center justify-center mb-6 shadow-lg">
                <PlusCircle className="h-10 w-10 text-slate-400 dark:text-slate-500" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 dark:text-slate-100 mb-3">
                {t('trading.hedgingPairs.noPairs')}
              </h3>
              <p className="text-slate-600 dark:text-slate-400 text-center mb-6 max-w-md">
                {t('trading.hedgingPairs.noPairsDesc')}
              </p>
              <Button
                onClick={handleCreatePair}
                className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 dark:from-blue-500 dark:to-blue-600 dark:hover:from-blue-600 dark:hover:to-blue-700 text-white px-6 py-3 rounded-xl shadow-lg hover:shadow-xl transition-all duration-200"
              >
                <PlusCircle className="mr-2 h-5 w-5" />
                {t('trading.hedgingPairs.createFirst')}
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
            {hedgingPairs.map((pair) => (
              <HedgingPairCard
                key={pair.id}
                pair={pair}
                exchanges={availableExchanges}
                onDelete={handleDeletePair}
                onLaunchBrowser={handleLaunchBrowser}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export default TradingSection 