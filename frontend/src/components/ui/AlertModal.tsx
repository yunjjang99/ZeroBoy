import { useEffect } from 'react'
import { X, AlertCircle, CheckCircle, Info, AlertTriangle } from 'lucide-react'

export type AlertType = 'success' | 'error' | 'warning' | 'info'

interface AlertModalProps {
    isOpen: boolean
    onClose: () => void
    title?: string
    message: string
    type?: AlertType
    showCloseButton?: boolean
}

const AlertModal = ({
    isOpen,
    onClose,
    title = '알림',
    message,
    type = 'info',
    showCloseButton = true
}: AlertModalProps) => {
    useEffect(() => {
        const onEsc = (e: KeyboardEvent) => e.key === 'Escape' && onClose()
        if (isOpen) document.addEventListener('keydown', onEsc)
        return () => document.removeEventListener('keydown', onEsc)
    }, [isOpen, onClose])

    if (!isOpen) return null

    const getIcon = () => {
        switch (type) {
            case 'success':
                return <CheckCircle className="h-6 w-6 text-green-500" />
            case 'error':
                return <AlertCircle className="h-6 w-6 text-red-500" />
            case 'warning':
                return <AlertTriangle className="h-6 w-6 text-yellow-500" />
            case 'info':
            default:
                return <Info className="h-6 w-6 text-blue-500" />
        }
    }

    const getButtonColor = () => {
        switch (type) {
            case 'success':
                return 'bg-green-600 hover:bg-green-700 dark:bg-green-500 dark:hover:bg-green-600'
            case 'error':
                return 'bg-red-600 hover:bg-red-700 dark:bg-red-500 dark:hover:bg-red-600'
            case 'warning':
                return 'bg-yellow-600 hover:bg-yellow-700 dark:bg-yellow-500 dark:hover:bg-yellow-600'
            case 'info':
            default:
                return 'bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600'
        }
    }

    return (
        <div className="fixed inset-0 z-50 bg-black/60 dark:bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
            <div className="bg-white dark:bg-black text-gray-900 dark:text-gray-100 rounded-xl p-6 shadow-2xl w-full max-w-sm animate-in fade-in-0 zoom-in-95 duration-200 border border-gray-200 dark:border-gray-800">
                <div className="flex items-start gap-3">
                    {getIcon()}
                    <div className="flex-1">
                        <div className="flex items-center justify-between mb-2">
                            <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">{title}</h2>
                            {showCloseButton && (
                                <button
                                    onClick={onClose}
                                    className="text-gray-400 hover:text-gray-600 dark:text-gray-500 dark:hover:text-gray-300 transition-colors"
                                >
                                    <X className="h-5 w-5" />
                                </button>
                            )}
                        </div>
                        <p className="text-gray-600 dark:text-gray-300 mb-4">{message}</p>
                        <div className="text-right">
                            <button
                                className={`text-white px-4 py-2 rounded-lg transition-colors ${getButtonColor()}`}
                                onClick={onClose}
                            >
                                확인
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default AlertModal 