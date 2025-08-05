import React from 'react'
import { Badge } from '@/components/ui/badge'
import { cn } from '@/lib/utils'

export type StatusType = "실행중" | "대기중" | "오류" | "Running" | "Waiting" | "Error"

interface StatusBadgeProps {
    status: StatusType
    className?: string
}

const statusStyles = {
    실행중: "bg-emerald-100 text-emerald-800 border-emerald-200 dark:bg-emerald-900/30 dark:text-emerald-300 dark:border-emerald-600",
    대기중: "bg-amber-100 text-amber-800 border-amber-200 dark:bg-amber-900/30 dark:text-amber-300 dark:border-amber-600",
    오류: "bg-red-100 text-red-800 border-red-200 dark:bg-red-900/30 dark:text-red-300 dark:border-red-600",
    Running: "bg-emerald-100 text-emerald-800 border-emerald-200 dark:bg-emerald-900/30 dark:text-emerald-300 dark:border-emerald-600",
    Waiting: "bg-amber-100 text-amber-800 border-amber-200 dark:bg-amber-900/30 dark:text-amber-300 dark:border-amber-600",
    Error: "bg-red-100 text-red-800 border-red-200 dark:bg-red-900/30 dark:text-red-300 dark:border-red-600",
}

export const StatusBadge = React.memo<StatusBadgeProps>(({ status, className }) => {
    return (
        <Badge
            variant="outline"
            className={cn("text-xs font-semibold", statusStyles[status], className)}
        >
            {status}
        </Badge>
    )
})

StatusBadge.displayName = 'StatusBadge' 