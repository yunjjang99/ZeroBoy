import React, { useState } from 'react'
import { HedgingPairList, type HedgingPair } from './HedgingPairList'
import { ExchangePairSelector } from './ExchangePairSelector'
import { CreatePairForm } from './CreatePairForm'
import { useTranslation } from 'react-i18next'
import { Exchange } from '@/hooks/useTradingQueries'

interface ExchangeInfo {
  name: string
  logo: string
}

const TradingSection: React.FC = () => {
  const { t } = useTranslation()

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

  // 헷징 페어 데이터 (실제로는 API에서 받아옴)
  const [hedgingPairs, setHedgingPairs] = useState<HedgingPair[]>([
    {
      id: 'pair-btc-001',
      symbol: 'BTC/USDT',
      status: 'Running',
      longPosition: {
        exchange: Exchange.ORANGEX,
        entryPrice: 68500.5,
        markPrice: 68750.2,
        quantity: 0.5,
        leverage: 20,
        unrealizedPnl: 124.85
      },
      shortPosition: {
        exchange: Exchange.BYDFI,
        entryPrice: 68510.0,
        markPrice: 68755.5,
        quantity: 0.5,
        leverage: 20,
        unrealizedPnl: -122.75
      }
    },
    {
      id: 'pair-eth-002',
      symbol: 'ETH/USDT',
      status: 'Running',
      longPosition: {
        exchange: Exchange.BYDFI,
        entryPrice: 3450.0,
        markPrice: 3480.5,
        quantity: 10,
        leverage: 50,
        unrealizedPnl: 305.0
      },
      shortPosition: {
        exchange: Exchange.ORANGEX,
        entryPrice: 3451.2,
        markPrice: 3481.0,
        quantity: 10,
        leverage: 50,
        unrealizedPnl: -298.0
      }
    },
    {
      id: 'pair-sol-003',
      symbol: 'SOL/USDT',
      status: 'Waiting',
    },
    {
      id: 'pair-xrp-004',
      symbol: 'XRP/USDT',
      status: 'Error',
      longPosition: {
        exchange: Exchange.ORANGEX,
        entryPrice: 0.52,
        markPrice: 0.51,
        quantity: 10000,
        leverage: 10,
        unrealizedPnl: -100.0
      },
      shortPosition: {
        exchange: Exchange.BYDFI,
        entryPrice: 0.52,
        markPrice: 0.51,
        quantity: 10000,
        leverage: 10,
        unrealizedPnl: 100.0
      }
    }
  ])

  const handleSavePair = (newKeys: { keyA: Exchange; keyB: Exchange }) => {
    setActivePair(newKeys)
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

  const activePairInfo = {
    exchangeA: availableExchanges[activePair.keyA],
    exchangeB: availableExchanges[activePair.keyB],
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900 p-4 sm:p-6 lg:p-8">
      <div className="mx-auto max-w-screen-2xl">
        {/* 헤더 */}
        <header className="relative mb-8 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 p-6 text-center shadow-sm">
          <div className="absolute right-4 top-4">
            <ExchangePairSelector
              availableExchanges={availableExchanges}
              activeKeys={activePair}
              onSave={handleSavePair}
            />
          </div>
          <h1 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-slate-100">
            {t('trading.title')}
          </h1>
          <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">
            {t('trading.subtitle')}
          </p>
          <div className="mt-2 flex items-center justify-center gap-4">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 bg-gradient-to-br from-blue-500 to-blue-600 dark:from-blue-400 dark:to-blue-500 rounded-md flex items-center justify-center">
                <span className="text-white font-bold text-xs">
                  {activePairInfo.exchangeA.name.charAt(0)}
                </span>
              </div>
              <span className="font-semibold text-slate-900 dark:text-slate-100">{activePairInfo.exchangeA.name}</span>
            </div>
            <span className="text-lg font-bold text-slate-400 dark:text-slate-500">↔</span>
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 bg-gradient-to-br from-blue-500 to-blue-600 dark:from-blue-400 dark:to-blue-500 rounded-md flex items-center justify-center">
                <span className="text-white font-bold text-xs">
                  {activePairInfo.exchangeB.name.charAt(0)}
                </span>
              </div>
              <span className="font-semibold text-slate-900 dark:text-slate-100">{activePairInfo.exchangeB.name}</span>
            </div>
          </div>
        </header>

        {/* 거래소 상태 및 생성 폼 */}
        <CreatePairForm
          activePair={activePairInfo}
          onCreatePair={handleCreatePair}
        />

        {/* 헷징 페어 목록 */}
        <div className="mt-8">
          <HedgingPairList
            pairs={hedgingPairs}
            exchanges={availableExchanges}
            onDelete={handleDeletePair}
            onLaunchBrowser={handleLaunchBrowser}
          />
        </div>
      </div>
    </div>
  )
}

export default TradingSection 