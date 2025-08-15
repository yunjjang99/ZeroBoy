import React from 'react'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Play, Settings, Trash2, ArrowRightLeft, TrendingUp, TrendingDown } from 'lucide-react'
import { cn } from '@/lib/utils'
import { useTranslation } from 'react-i18next'

export interface Position {
  exchange: string
  entryPrice: number
  markPrice: number
  quantity: number
  leverage: number
  unrealizedPnl: number
}

export interface HedgingPair {
  id: string
  symbol: string
  status: "실행중" | "대기중" | "오류"
  longPosition?: Position
  shortPosition?: Position
}

const statusStyles = {
  실행중: "bg-gradient-to-r from-emerald-100 to-emerald-200 text-emerald-800 border-emerald-300 dark:from-emerald-900/30 dark:to-emerald-800/30 dark:text-emerald-300 dark:border-emerald-600",
  대기중: "bg-gradient-to-r from-amber-100 to-amber-200 text-amber-800 border-amber-300 dark:from-amber-900/30 dark:to-amber-800/30 dark:text-amber-300 dark:border-amber-600",
  오류: "bg-gradient-to-r from-red-100 to-red-200 text-red-800 border-red-300 dark:from-red-900/30 dark:to-red-800/30 dark:text-red-300 dark:border-red-600",
  Running: "bg-gradient-to-r from-emerald-100 to-emerald-200 text-emerald-800 border-emerald-300 dark:from-emerald-900/30 dark:to-emerald-800/30 dark:text-emerald-300 dark:border-emerald-600",
  Waiting: "bg-gradient-to-r from-amber-100 to-amber-200 text-amber-800 border-amber-300 dark:from-amber-900/30 dark:to-amber-800/30 dark:text-amber-300 dark:border-amber-600",
  Error: "bg-gradient-to-r from-red-100 to-red-200 text-red-800 border-red-300 dark:from-red-900/30 dark:to-red-800/30 dark:text-red-300 dark:border-red-600",
}

const DetailItem = ({
  label,
  value,
  valueClassName
}: {
  label: string;
  value: React.ReactNode;
  valueClassName?: string
}) => (
  <div className="flex items-baseline justify-between text-sm">
    <span className="text-theme-text-tertiary font-medium">{label}</span>
    <span className={cn("font-mono font-semibold", valueClassName)}>{value}</span>
  </div>
)

const PositionPanel = ({
  position,
  exchangeInfo,
  type,
}: {
  position: Position
  exchangeInfo?: { name: string; logo: string }
  type: "LONG" | "SHORT"
}) => {
  const { t } = useTranslation()

  if (!exchangeInfo) {
    return (
      <div className="flex h-full items-center justify-center rounded-lg border border-slate-200 dark:border-slate-600 bg-slate-50 dark:bg-slate-800 p-4 text-sm text-slate-500 dark:text-slate-400">
        {t('trading.position.noInfo')}
      </div>
    )
  }

  const pnlColor = position.unrealizedPnl > 0 ? "text-emerald-600 dark:text-emerald-400" : "text-red-600 dark:text-red-400"
  const typeColor = type === "LONG" ? "text-emerald-600 dark:text-emerald-400" : "text-red-600 dark:text-red-400"
  const typeBgColor = type === "LONG" ? "bg-emerald-50 dark:bg-emerald-900/20" : "bg-red-50 dark:bg-red-900/20"

  return (
    <div className={cn("rounded-xl border border-theme-border-primary bg-theme-bg-card p-4 shadow-sm hover:shadow-md transition-all duration-200", typeBgColor)}>
      <div className="mb-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-gradient-to-br from-slate-500 to-slate-600 dark:from-slate-400 dark:to-slate-500 rounded-lg flex items-center justify-center shadow-sm">
            <span className="text-white font-bold text-xs">
              {exchangeInfo.name.charAt(0)}
            </span>
          </div>
          <span className="font-semibold text-theme-text-primary">{exchangeInfo.name}</span>
        </div>
        <div className={cn("px-2 py-1 rounded-md text-xs font-bold", type === "LONG" ? "bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300" : "bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300")}>
          {type === "LONG" ? <TrendingUp className="h-3 w-3" /> : <TrendingDown className="h-3 w-3" />}
        </div>
      </div>
      <div className="space-y-3">
        <DetailItem label={t('trading.position.entryPrice')} value={position.entryPrice.toLocaleString()} />
        <DetailItem label={t('trading.position.markPrice')} value={position.markPrice.toLocaleString()} valueClassName="text-blue-600 dark:text-blue-400" />
        <DetailItem label={t('trading.position.quantity')} value={position.quantity.toLocaleString()} />
        <DetailItem
          label={t('trading.position.unrealizedPnl')}
          value={`${position.unrealizedPnl >= 0 ? "+" : ""}${position.unrealizedPnl.toFixed(2)}`}
          valueClassName={pnlColor}
        />
      </div>
    </div>
  )
}

export const HedgingPairCard: React.FC<{
  pair: HedgingPair
  exchanges: { [key: string]: { name: string; logo: string } }
  onDelete?: (pairId: string) => void
  onLaunchBrowser?: (pairId: string) => void
}> = ({ pair, exchanges, onDelete, onLaunchBrowser }) => {
  const { t } = useTranslation()

  return (
    <Card className="flex flex-col border-0 shadow-xl bg-theme-bg-card/90 backdrop-blur-sm hover:shadow-2xl transition-all duration-300">
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <CardTitle className="text-xl font-bold text-theme-text-primary">{pair.symbol}</CardTitle>
          <Badge className={cn("text-xs font-semibold px-3 py-1", statusStyles[pair.status])}>
            {pair.status}
          </Badge>
        </div>
        <CardDescription className="text-theme-text-tertiary">ID: {pair.id}</CardDescription>
      </CardHeader>
      <CardContent className="flex-grow">
        <div className="grid grid-cols-[1fr_auto_1fr] items-center gap-4">
          {pair.longPosition ? (
            <PositionPanel
              position={pair.longPosition}
              exchangeInfo={exchanges[pair.longPosition.exchange]}
              type="LONG"
            />
          ) : (
            <div className="flex h-full items-center justify-center rounded-lg border border-theme-border-primary bg-theme-bg-tertiary p-4 text-sm text-theme-text-muted">
              {t('trading.position.noLongPosition')}
            </div>
          )}
          <div className="flex items-center justify-center">
            <div className="w-8 h-8 bg-gradient-to-br from-slate-400 to-slate-500 dark:from-slate-500 dark:to-slate-600 rounded-full flex items-center justify-center shadow-sm">
              <ArrowRightLeft className="h-4 w-4 text-white" />
            </div>
          </div>
          {pair.shortPosition ? (
            <PositionPanel
              position={pair.shortPosition}
              exchangeInfo={exchanges[pair.shortPosition.exchange]}
              type="SHORT"
            />
          ) : (
            <div className="flex h-full items-center justify-center rounded-lg border border-theme-border-primary bg-theme-bg-tertiary p-4 text-sm text-theme-text-muted">
              {t('trading.position.noShortPosition')}
            </div>
          )}
        </div>
      </CardContent>
      <CardFooter className="flex justify-between bg-gradient-to-r from-theme-bg-tertiary to-theme-bg-secondary px-6 py-4 rounded-b-xl">
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="icon"
            className="border-theme-border-primary text-theme-text-secondary hover:bg-theme-hover-bg"
          >
            <Settings className="h-4 w-4" />
          </Button>
          <Button
            variant="destructive"
            size="icon"
            onClick={() => onDelete?.(pair.id)}
            className="bg-red-500 hover:bg-red-600 dark:bg-red-600 dark:hover:bg-red-700"
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
        <Button
          onClick={() => onLaunchBrowser?.(pair.id)}
          className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 dark:from-blue-500 dark:to-blue-600 dark:hover:from-blue-600 dark:hover:to-blue-700 text-white shadow-lg hover:shadow-xl transition-all duration-200"
        >
          <Play className="mr-2 h-4 w-4" />
          {t('trading.actions.launchBrowser')}
        </Button>
      </CardFooter>
    </Card>
  )
} 