import type React from "react"
import type { FC } from "react"
import { Globe, Computer, Monitor, MapPin, Clock, RotateCw, Trash2 } from "lucide-react"
import type { BrowserProfile } from "../types/api"

interface BrowserProfileCardProps {
    profile: BrowserProfile
    onReopen?: (uuid: string) => void
    onDelete?: (uuid: string) => void
}

export const BrowserProfileCard: FC<BrowserProfileCardProps> = ({
    profile,
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

    return (
        <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 flex flex-col shadow-sm min-h-0">
            <div className="p-3 sm:p-4">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 mb-3">
                    <h3 className="flex items-center gap-2 text-base sm:text-lg font-semibold text-gray-900 dark:text-white min-w-0">
                        <Globe className="h-4 w-4 sm:h-5 sm:w-5 text-blue-500 dark:text-blue-400 flex-shrink-0" />
                        <span className="truncate">{profile.siteUrl}</span>
                    </h3>
                    <div className="flex items-center gap-1 sm:gap-2 flex-wrap">
                        <span className="px-2 py-1 text-xs rounded border whitespace-nowrap bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 border-gray-200 dark:border-gray-600">
                            프로필
                        </span>
                    </div>
                </div>
                <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 mb-3">
                    생성일: {new Date(profile.createdAt).toLocaleDateString("ko-KR")}
                </p>

                <div className="border-t border-gray-200 dark:border-gray-700 my-3"></div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 gap-y-4 sm:gap-y-6">
                    <InfoItem icon={MapPin} label="Public IP" value={profile.publicIp} />
                    <InfoItem icon={Computer} label="플랫폼" value={profile.platform} />
                    <InfoItem
                        icon={Monitor}
                        label="해상도"
                        value={`${profile.screenResolution.width}x${profile.screenResolution.height}`}
                    />
                    <InfoItem icon={Clock} label="시간대" value={profile.timezone} />
                </div>

                <div className="mt-4 sm:mt-6">
                    <p className="text-xs text-gray-600 dark:text-gray-400 mb-1">User Agent</p>
                    <p className="text-xs text-gray-700 dark:text-gray-300 break-words line-clamp-2 leading-relaxed">
                        {profile.userAgent || '정보 없음'}
                    </p>
                </div>
            </div>

            <div className="flex justify-end gap-1 sm:gap-2 p-3 sm:p-4 border-t border-gray-200 dark:border-gray-700">
                <button
                    onClick={() => onReopen?.(profile.uuid)}
                    className="p-1.5 sm:p-2 text-gray-500 dark:text-gray-400 hover:text-blue-500 dark:hover:text-blue-400 hover:bg-gray-100 dark:hover:bg-gray-700 rounded transition-colors"
                    title="프로필 재생성"
                >
                    <RotateCw className="h-3 w-3 sm:h-4 sm:w-4" />
                </button>
                <button
                    onClick={() => onDelete?.(profile.uuid)}
                    className="p-1.5 sm:p-2 text-gray-500 dark:text-gray-400 hover:text-red-500 dark:hover:text-red-400 hover:bg-gray-100 dark:hover:bg-gray-700 rounded transition-colors"
                    title="프로필 삭제"
                >
                    <Trash2 className="h-3 w-3 sm:h-4 sm:w-4" />
                </button>
            </div>
        </div>
    )
} 