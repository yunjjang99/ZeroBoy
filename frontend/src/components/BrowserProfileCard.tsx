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
        <div className="flex items-start gap-3">
            <Icon className="h-4 w-4 text-gray-500 dark:text-gray-400 mt-1" />
            <div>
                <p className="text-sm font-medium text-gray-900 dark:text-gray-200">{value}</p>
                <p className="text-xs text-gray-600 dark:text-gray-400">{label}</p>
            </div>
        </div>
    )

    return (
        <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 flex flex-col shadow-sm">
            <div className="p-4">
                <div className="flex items-center justify-between mb-2">
                    <h3 className="flex items-center gap-2 text-lg font-semibold text-gray-900 dark:text-white">
                        <Globe className="h-5 w-5 text-blue-500 dark:text-blue-400" />
                        {profile.siteUrl}
                    </h3>
                    <span className={`px-2 py-1 text-xs rounded border ${(profile.isActive ?? false)
                        ? 'bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-300 border-green-200 dark:border-green-700'
                        : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 border-gray-200 dark:border-gray-600'
                        }`}>
                        {(profile.isActive ?? false) ? '활성' : '비활성'}
                    </span>
                </div>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                    생성일: {new Date(profile.createdAt).toLocaleDateString("ko-KR")}
                </p>

                <div className="border-t border-gray-200 dark:border-gray-700 my-4"></div>

                <div className="grid grid-cols-2 gap-x-4 gap-y-6">
                    <InfoItem icon={MapPin} label="Public IP" value={profile.publicIp} />
                    <InfoItem icon={Computer} label="플랫폼" value={profile.platform} />
                    <InfoItem
                        icon={Monitor}
                        label="해상도"
                        value={`${profile.screenResolution.width}x${profile.screenResolution.height}`}
                    />
                    <InfoItem icon={Clock} label="시간대" value={profile.timezone} />
                </div>

                <div className="mt-6">
                    <p className="text-xs text-gray-600 dark:text-gray-400 mb-1">User Agent</p>
                    <p className="text-xs text-gray-700 dark:text-gray-300 break-all line-clamp-2">
                        {profile.userAgent || '정보 없음'}
                    </p>
                </div>
            </div>

            <div className="flex justify-end gap-2 p-4 border-t border-gray-200 dark:border-gray-700">
                <button
                    onClick={() => onReopen?.(profile.uuid)}
                    className="p-2 text-gray-500 dark:text-gray-400 hover:text-blue-500 dark:hover:text-blue-400 hover:bg-gray-100 dark:hover:bg-gray-700 rounded transition-colors"
                    title="프로필 재생성"
                >
                    <RotateCw className="h-4 w-4" />
                </button>
                <button
                    onClick={() => onDelete?.(profile.uuid)}
                    className="p-2 text-gray-500 dark:text-gray-400 hover:text-red-500 dark:hover:text-red-400 hover:bg-gray-100 dark:hover:bg-gray-700 rounded transition-colors"
                    title="프로필 삭제"
                >
                    <Trash2 className="h-4 w-4" />
                </button>
            </div>
        </div>
    )
} 