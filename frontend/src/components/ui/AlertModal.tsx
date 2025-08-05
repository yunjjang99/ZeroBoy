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
                return 'bg-green-600 hover:bg-green-700'
            case 'error':
                return 'bg-red-600 hover:bg-red-700'
            case 'warning':
                return 'bg-yellow-600 hover:bg-yellow-700'
            case 'info':
            default:
                return 'bg-blue-600 hover:bg-blue-700'
        }
    }

    return (
        <div className="fixed inset-0 z-50 bg-black bg-opacity-50 flex items-center justify-center p-4">
            <div className="bg-white dark:bg-gray-800 text-gray-900 dark:text-white rounded-lg p-6 shadow-xl w-full max-w-sm animate-in fade-in-0 zoom-in-95 duration-200">
                <div className="flex items-start gap-3">
                    {getIcon()}
                    <div className="flex-1">
                        <div className="flex items-center justify-between mb-2">
                            <h2 className="text-lg font-semibold">{title}</h2>
                            {showCloseButton && (
                                <button
                                    onClick={onClose}
                                    className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
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