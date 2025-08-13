import type React from "react"
import type { FC } from "react"
import { Globe, Computer, Monitor, MapPin, Clock, RotateCw, Trash2, Link, Users, MessageSquare } from "lucide-react"
import { Exchange } from "@/hooks/useTradingQueries"

interface BrowserProfile {
    uuid: string;
    siteUrl: string;
    exchange: string;
    accountInfo?: { accountId: string; memo: string };
    isActive: boolean;
    lastActiveAt?: string;
}

interface TradingPairWithBrowserProfiles {
    pairId: string;
    pairName: string;
    exchangeA: Exchange;
    exchangeB: Exchange;
    status: string;
    createdAt: string;
    browserA?: BrowserProfile;
    browserB?: BrowserProfile;
}

interface BrowserStatus {
    uuid: string;
    isConnected: boolean;
    tabs: string[];
}

interface BrowserProfileCardProps {
    pair: TradingPairWithBrowserProfiles;
    browserStatuses?: BrowserStatus[];
    onReopen?: (uuid: string) => void;
    onDelete?: (pairId: string) => void; // 페어 ID를 받아서 페어와 연결된 브라우저 정보를 함께 삭제
}

export const BrowserProfileCard: FC<BrowserProfileCardProps> = ({
    pair,
    browserStatuses = [],
    onReopen,
    onDelete
}) => {
    const InfoItem = ({
        icon: Icon,
        label,
        value,
    }: { icon: React.ElementType; label: string; value: string | number }) => (
        <div className="flex items-start gap-2 sm:gap-3 min-w-0">
            <Icon className="h-3 w-3 sm:h-4 sm:w-4 text-gray-500 dark:text-gray-400 mt-0.5 sm:mt-1 flex-shrink-0" />
            <div className="min-w-0 flex-1">
                <p className="text-xs sm:text-sm font-medium text-gray-900 dark:text-gray-200 truncate">{value}</p>
                <p className="text-xs text-gray-600 dark:text-gray-400 truncate">{label}</p>
            </div>
        </div>
    )

    // 브라우저 상태 확인 함수
    const getBrowserStatus = (uuid: string) => {
        return browserStatuses.find(status => status.uuid === uuid);
    }

    const BrowserInfo = ({ browser, label, exchange }: { browser?: BrowserProfile; label: string; exchange: Exchange }) => {
        if (!browser) {
            return (
                <div className="flex items-center gap-2 p-2 bg-gray-50 dark:bg-gray-700 rounded border border-gray-200 dark:border-gray-600">
                    <Globe className="h-4 w-4 text-gray-400" />
                    <span className="text-sm text-gray-500 dark:text-gray-400">{label} - 연결되지 않음</span>
                </div>
            )
        }

        const browserStatus = getBrowserStatus(browser.uuid);
        const isConnected = browserStatus?.isConnected || false;

        return (
            <div className="p-3 bg-white dark:bg-gray-800 rounded border border-gray-200 dark:border-gray-600">
                <div className="flex items-center justify-between mb-2">
                    <h4 className="text-sm font-semibold text-gray-900 dark:text-white">{label}</h4>
                    <div className="flex items-center gap-2">
                        <span className={`px-2 py-1 text-xs rounded ${isConnected
                            ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300'
                            : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400'
                            }`}>
                            {isConnected ? '활성' : '비활성'}
                        </span>
                        <button
                            onClick={() => onReopen?.(browser.uuid)}
                            className="p-1.5 text-gray-500 dark:text-gray-400 hover:text-blue-500 dark:hover:text-blue-400 hover:bg-gray-100 dark:hover:bg-gray-700 rounded transition-colors"
                            title={`${label} 재생성`}
                        >
                            <RotateCw className="h-5 w-5" />
                        </button>
                    </div>
                </div>

                <div className="space-y-2">
                    <InfoItem icon={Globe} label="URL" value={browser.siteUrl} />
                    <InfoItem icon={Computer} label="거래소" value={exchange.toUpperCase()} />
                    {browser.accountInfo && (
                        <InfoItem icon={Users} label="계정" value={browser.accountInfo.accountId} />
                    )}
                    {browser.accountInfo?.memo && (
                        <InfoItem icon={MessageSquare} label="메모" value={browser.accountInfo.memo} />
                    )}
                    {browser.lastActiveAt && (
                        <InfoItem icon={Clock} label="마지막 활동" value={new Date(browser.lastActiveAt).toLocaleString("ko-KR")} />
                    )}
                    {browserStatus?.tabs && browserStatus.tabs.length > 0 && (
                        <div className="mt-2">
                            <p className="text-xs text-gray-600 dark:text-gray-400 mb-1">열린 탭</p>
                            <div className="space-y-1">
                                {browserStatus.tabs.map((tab, index) => (
                                    <p key={index} className="text-xs text-gray-700 dark:text-gray-300 truncate">
                                        {tab}
                                    </p>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            </div>
        )
    }

    return (
        <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 flex flex-col shadow-sm min-h-0">
            <div className="p-4">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 mb-4">
                    <h3 className="flex items-center gap-2 text-lg font-semibold text-gray-900 dark:text-white min-w-0">
                        <Link className="h-5 w-5 text-blue-500 dark:text-blue-400 flex-shrink-0" />
                        <span className="truncate">{pair.pairName}</span>
                    </h3>
                    <div className="flex items-center gap-2 flex-wrap">
                        <span className={`px-2 py-1 text-xs rounded border whitespace-nowrap ${pair.status === 'active'
                            ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 border-green-200 dark:border-green-600'
                            : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 border-gray-200 dark:border-gray-600'
                            }`}>
                            {pair.status === 'active' ? '활성' : '비활성'}
                        </span>
                        <span className="px-2 py-1 text-xs rounded border whitespace-nowrap bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 border-blue-200 dark:border-blue-600">
                            페어
                        </span>
                    </div>
                </div>

                <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                    생성일: {new Date(pair.createdAt).toLocaleString("ko-KR", {
                        year: 'numeric',
                        month: '2-digit',
                        day: '2-digit',
                        hour: '2-digit',
                        minute: '2-digit'
                    })}
                </p>

                <div className="border-t border-gray-200 dark:border-gray-700 my-4"></div>

                <div className="grid grid-cols-1 gap-4">
                    <BrowserInfo browser={pair.browserA} label="브라우저 A" exchange={pair.exchangeA} />
                    <BrowserInfo browser={pair.browserB} label="브라우저 B" exchange={pair.exchangeB} />
                </div>
            </div>

            <div className="flex justify-end gap-2 p-4 border-t border-gray-200 dark:border-gray-700">
                <button
                    onClick={() => onDelete?.(pair.pairId)}
                    className="p-2 text-gray-500 dark:text-gray-400 hover:text-red-500 dark:hover:text-red-400 hover:bg-gray-100 dark:hover:bg-gray-700 rounded transition-colors"
                    title="페어 및 연결된 브라우저 정보 삭제"
                >
                    <Trash2 className="h-4 w-4" />
                </button>
            </div>
        </div>
    )
} 