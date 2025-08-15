import { useEffect, useState } from 'react'
import { X, CheckCircle, AlertCircle, Info, AlertTriangle } from 'lucide-react'

export type ToastType = 'success' | 'error' | 'warning' | 'info'

interface ToastProps {
    id: string
    type: ToastType
    title?: string
    message: string
    duration?: number
    onClose: (id: string) => void
}

const Toast = ({
    id,
    type,
    title,
    message,
    duration = 5000,
    onClose
}: ToastProps) => {
    const [isVisible, setIsVisible] = useState(true)

    useEffect(() => {
        const timer = setTimeout(() => {
            setIsVisible(false)
            setTimeout(() => onClose(id), 300) // 애니메이션 완료 후 제거
        }, duration)

        return () => clearTimeout(timer)
    }, [id, duration, onClose])

    const getIcon = () => {
        switch (type) {
            case 'success':
                return <CheckCircle className="h-5 w-5 text-green-500" />
            case 'error':
                return <AlertCircle className="h-5 w-5 text-red-500" />
            case 'warning':
                return <AlertTriangle className="h-5 w-5 text-yellow-500" />
            case 'info':
            default:
                return <Info className="h-5 w-5 text-blue-500" />
        }
    }

    const getBorderColor = () => {
        switch (type) {
            case 'success':
                return 'border-l-green-500'
            case 'error':
                return 'border-l-red-500'
            case 'warning':
                return 'border-l-yellow-500'
            case 'info':
            default:
                return 'border-l-blue-500'
        }
    }

    return (
        <div
            className={`
        fixed top-4 right-4 z-50 w-80 bg-white dark:bg-black border-l-4 shadow-lg rounded-lg p-4
        transform transition-all duration-300 ease-in-out
        ${isVisible ? 'translate-x-0 opacity-100' : 'translate-x-full opacity-0'}
        ${getBorderColor()}
      `}
        >
            <div className="flex items-start gap-3">
                {getIcon()}
                <div className="flex-1 min-w-0">
                    {title && (
                        <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-1">
                            {title}
                        </h3>
                    )}
                    <p className="text-sm text-gray-600 dark:text-gray-300">
                        {message}
                    </p>
                </div>
                <button
                    onClick={() => {
                        setIsVisible(false)
                        setTimeout(() => onClose(id), 300)
                    }}
                    className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors flex-shrink-0"
                >
                    <X className="h-4 w-4" />
                </button>
            </div>
        </div>
    )
}

export default Toast 