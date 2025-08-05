import React from 'react'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Play, Settings, Trash2, TrendingUp, TrendingDown } from 'lucide-react'
import { cn } from '@/lib/utils'
import { useTranslation } from 'react-i18next'
import { StatusBadge, type StatusType } from '@/components/common/StatusBadge'
import { ExchangeLogo } from '@/components/common/ExchangeLogo'
import { PnlDisplay } from '@/components/common/PnlDisplay'
import { Exchange } from '@/hooks/useTradingQueries'

// 데이터 타입 정의
export interface Position {
    exchange: Exchange
    entryPrice: number
    markPrice: number
    quantity: number
    leverage: number
    unrealizedPnl: number
}

export interface HedgingPair {
    id: string
    symbol: string
    status: StatusType
    longPosition?: Position
    shortPosition?: Position
}

// 포지션 정보를 표시하는 작은 컴포넌트
const PositionCell = ({
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
            <div className="text-sm text-slate-500 dark:text-slate-400">
                {t('trading.position.noInfo')}
            </div>
        )
    }

    const pnlColor = position.unrealizedPnl >= 0 ? "text-emerald-600 dark:text-emerald-400" : "text-red-600 dark:text-red-400"
    const typeColor = type === "LONG" ? "text-emerald-600 dark:text-emerald-400" : "text-red-600 dark:text-red-400"

    return (
        <div className="flex flex-col gap-2">
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                    <ExchangeLogo name={exchangeInfo.name} size="sm" className="bg-gradient-to-br from-slate-500 to-slate-600 dark:from-slate-400 dark:to-slate-500" />
                    <span className="text-sm font-semibold text-slate-900 dark:text-slate-100">{exchangeInfo.name}</span>
                </div>
                <div className={cn("px-2 py-1 rounded text-xs font-bold", type === "LONG" ? "bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300" : "bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300")}>
                    {type === "LONG" ? <TrendingUp className="h-3 w-3" /> : <TrendingDown className="h-3 w-3" />}
                </div>
            </div>
            <div className="text-sm space-y-2">
                <div className="flex justify-between items-center">
                    <span className="text-slate-600 dark:text-slate-400 font-medium">{t('trading.position.entryPrice')}:</span>
                    <span className="font-mono text-slate-900 dark:text-slate-100 font-semibold text-base">
                        {position.entryPrice.toLocaleString()}
                    </span>
                </div>
                <div className="flex justify-between items-center">
                    <span className="text-slate-600 dark:text-slate-400 font-medium">{t('trading.position.markPrice')}:</span>
                    <span className="font-mono text-blue-600 dark:text-blue-400 font-semibold text-base">
                        {position.markPrice.toLocaleString()}
                    </span>
                </div>
                <div className="flex justify-between items-center">
                    <span className="text-slate-600 dark:text-slate-400 font-medium">{t('trading.position.quantity')}:</span>
                    <span className="font-mono text-slate-900 dark:text-slate-100 font-semibold text-base">
                        {position.quantity.toLocaleString()}
                    </span>
                </div>
                <div className="flex justify-between items-center">
                    <span className="text-slate-600 dark:text-slate-400 font-medium">{t('trading.position.unrealizedPnl')}:</span>
                    <PnlDisplay value={position.unrealizedPnl} size="lg" />
                </div>
            </div>
        </div>
    )
}

// 메인 리스트 컴포넌트
export const HedgingPairList: React.FC<{
    pairs: HedgingPair[]
    exchanges: { [key in Exchange]: { name: string; logo: string } }
    onDelete?: (pairId: string) => void
    onLaunchBrowser?: (pairId: string) => void
}> = ({ pairs, exchanges, onDelete, onLaunchBrowser }) => {
    const { t } = useTranslation()

    return (
        <Card className="border-0 shadow-xl bg-white dark:bg-slate-900">
            <Table>
                <TableHeader>
                    <TableRow className="border-slate-200 dark:border-slate-700">
                        <TableHead className="w-[150px] text-slate-900 dark:text-slate-100 font-semibold">{t('trading.hedgingPairs.title')}</TableHead>
                        <TableHead className="w-[100px] text-slate-900 dark:text-slate-100 font-semibold">{t('common.status')}</TableHead>
                        <TableHead className="text-slate-900 dark:text-slate-100 font-semibold">{t('trading.position.long')}</TableHead>
                        <TableHead className="text-slate-900 dark:text-slate-100 font-semibold">{t('trading.position.short')}</TableHead>
                        <TableHead className="w-[120px] text-right text-slate-900 dark:text-slate-100 font-semibold">{t('trading.position.unrealizedPnl')}</TableHead>
                        <TableHead className="w-[150px] text-center text-slate-900 dark:text-slate-100 font-semibold">{t('common.actions')}</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {pairs.map((pair) => {
                        const totalPnl = (pair.longPosition?.unrealizedPnl ?? 0) + (pair.shortPosition?.unrealizedPnl ?? 0)
                        const totalPnlColor = totalPnl >= 0 ? "text-emerald-600 dark:text-emerald-400" : "text-red-600 dark:text-red-400"

                        return (
                            <TableRow key={pair.id} className="border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800/50">
                                <TableCell className="font-bold text-lg text-slate-900 dark:text-slate-100">{pair.symbol}</TableCell>
                                <TableCell>
                                    <StatusBadge status={pair.status} />
                                </TableCell>
                                <TableCell>
                                    {pair.longPosition ? (
                                        <PositionCell
                                            position={pair.longPosition}
                                            exchangeInfo={exchanges[pair.longPosition.exchange]}
                                            type="LONG"
                                        />
                                    ) : (
                                        <div className="text-sm text-slate-500 dark:text-slate-400">
                                            {t('trading.position.noLongPosition')}
                                        </div>
                                    )}
                                </TableCell>
                                <TableCell>
                                    {pair.shortPosition ? (
                                        <PositionCell
                                            position={pair.shortPosition}
                                            exchangeInfo={exchanges[pair.shortPosition.exchange]}
                                            type="SHORT"
                                        />
                                    ) : (
                                        <div className="text-sm text-slate-500 dark:text-slate-400">
                                            {t('trading.position.noShortPosition')}
                                        </div>
                                    )}
                                </TableCell>
                                <TableCell className="text-right">
                                    <PnlDisplay value={totalPnl} size="lg" />
                                </TableCell>
                                <TableCell className="text-center">
                                    <div className="flex items-center justify-center gap-2">
                                        <Button
                                            variant="ghost"
                                            size="icon"
                                            className="h-8 w-8 text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-slate-100 hover:bg-slate-100 dark:hover:bg-slate-800"
                                            onClick={() => onLaunchBrowser?.(pair.id)}
                                        >
                                            <Play className="h-4 w-4" />
                                        </Button>
                                        <Button
                                            variant="ghost"
                                            size="icon"
                                            className="h-8 w-8 text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-slate-100 hover:bg-slate-100 dark:hover:bg-slate-800"
                                        >
                                            <Settings className="h-4 w-4" />
                                        </Button>
                                        <Button
                                            variant="ghost"
                                            size="icon"
                                            className="h-8 w-8 text-red-600 dark:text-red-400 hover:text-red-700 dark:hover:text-red-300 hover:bg-red-50 dark:hover:bg-red-900/20"
                                            onClick={() => onDelete?.(pair.id)}
                                        >
                                            <Trash2 className="h-4 w-4" />
                                        </Button>
                                    </div>
                                </TableCell>
                            </TableRow>
                        )
                    })}
                </TableBody>
            </Table>
        </Card>
    )
} 