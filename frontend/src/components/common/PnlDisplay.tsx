import React from 'react'
import { cn } from '@/lib/utils'

interface PnlDisplayProps {
    value: number
    size?: 'sm' | 'md' | 'lg'
    showSign?: boolean
    className?: string
}

const sizeClasses = {
    sm: 'text-sm',
    md: 'text-base',
    lg: 'text-lg'
}

export const PnlDisplay = React.memo<PnlDisplayProps>(({
    value,
    size = 'md',
    showSign = true,
    className
}) => {
    const isPositive = value >= 0
    const pnlColor = isPositive
        ? "text-emerald-600 dark:text-emerald-400"
        : "text-red-600 dark:text-red-400"

    return (
        <span className={cn(
            "font-mono font-bold",
            sizeClasses[size],
            pnlColor,
            className
        )}>
            {showSign && isPositive ? "+" : ""}{value.toFixed(2)}
        </span>
    )
})

PnlDisplay.displayName = 'PnlDisplay' 