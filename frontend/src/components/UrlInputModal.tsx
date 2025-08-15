import React, { useState, useEffect } from 'react'
import { X, Globe } from 'lucide-react'

interface UrlInputModalProps {
    isOpen: boolean
    onClose: () => void
    onConfirm: (url: string) => void
    title?: string
    placeholder?: string
}

const UrlInputModal: React.FC<UrlInputModalProps> = ({
    isOpen,
    onClose,
    onConfirm,
    title = '새 브라우저 프로필 생성',
    placeholder = 'https://example.com'
}) => {
    const [url, setUrl] = useState('')

    useEffect(() => {
        if (isOpen) {
            setUrl('')
        }
    }, [isOpen])

    useEffect(() => {
        const onEsc = (e: KeyboardEvent) => e.key === 'Escape' && onClose()
        if (isOpen) document.addEventListener('keydown', onEsc)
        return () => document.removeEventListener('keydown', onEsc)
    }, [isOpen, onClose])

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        if (url.trim()) {
            onConfirm(url.trim())
            onClose()
        }
    }

    // handleConfirm 함수는 form submit에서 사용되므로 제거

    if (!isOpen) return null

    return (
        <div className="fixed inset-0 z-50 bg-black/60 dark:bg-black/80 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4">
            <div className="bg-white dark:bg-black text-gray-900 dark:text-gray-100 rounded-xl p-4 sm:p-6 shadow-2xl w-full max-w-sm sm:max-w-md animate-in fade-in-0 zoom-in-95 duration-200 border border-gray-200 dark:border-gray-800">
                <div className="flex items-center justify-between mb-3 sm:mb-4">
                    <h2 className="text-base sm:text-lg font-semibold flex items-center gap-2 text-gray-900 dark:text-gray-100">
                        <Globe className="h-4 w-4 sm:h-5 sm:w-5 text-blue-500" />
                        <span className="truncate">{title}</span>
                    </h2>
                    <button
                        onClick={onClose}
                        className="text-gray-400 hover:text-gray-600 dark:text-gray-500 dark:hover:text-gray-300 transition-colors flex-shrink-0"
                    >
                        <X className="h-4 w-4 sm:h-5 sm:w-5" />
                    </button>
                </div>

                <form onSubmit={handleSubmit}>
                    <div className="mb-3 sm:mb-4">
                        <label htmlFor="url" className="block text-xs sm:text-sm font-medium text-gray-700 dark:text-gray-300 mb-1 sm:mb-2">
                            웹사이트 URL
                        </label>
                        <input
                            type="url"
                            id="url"
                            value={url}
                            onChange={(e) => setUrl(e.target.value)}
                            placeholder={placeholder}
                            className="w-full px-2 py-2 sm:px-3 sm:py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 text-sm sm:text-base"
                            autoFocus
                            required
                        />
                    </div>

                    <div className="flex gap-2 sm:gap-3 justify-end">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-3 py-2 sm:px-4 sm:py-2 text-gray-700 dark:text-gray-300 bg-gray-200 dark:bg-gray-700 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors text-sm sm:text-base"
                        >
                            취소
                        </button>
                        <button
                            type="submit"
                            disabled={!url.trim()}
                            className="px-3 py-2 sm:px-4 sm:py-2 bg-blue-600 dark:bg-blue-500 text-white rounded-lg hover:bg-blue-700 dark:hover:bg-blue-600 disabled:bg-blue-400 dark:disabled:bg-blue-600 disabled:cursor-not-allowed transition-colors text-sm sm:text-base"
                        >
                            생성
                        </button>
                    </div>
                </form>
            </div>
        </div>
    )
}

export default UrlInputModal 