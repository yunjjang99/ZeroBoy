import React from 'react'
import { cn } from '@/lib/utils'

interface ExchangeLogoProps {
    name: string
    size?: 'sm' | 'md' | 'lg'
    className?: string
}

const sizeClasses = {
    sm: 'w-6 h-6 text-xs',
    md: 'w-8 h-8 text-sm',
    lg: 'w-10 h-10 text-base'
}

export const ExchangeLogo = React.memo<ExchangeLogoProps>(({
    name,
    size = 'md',
    className
}) => {
    return (
        <div className={cn(
            "bg-gradient-to-br from-blue-500 to-blue-600 dark:from-blue-400 dark:to-blue-500 rounded-md flex items-center justify-center shadow-sm",
            sizeClasses[size],
            className
        )}>
            <span className="text-white font-bold">
                {name.charAt(0).toUpperCase()}
            </span>
        </div>
    )
})

ExchangeLogo.displayName = 'ExchangeLogo' 