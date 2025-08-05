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
        <div className="fixed inset-0 z-50 bg-black bg-opacity-50 flex items-center justify-center p-4">
            <div className="bg-white dark:bg-gray-800 text-gray-900 dark:text-white rounded-lg p-6 shadow-xl w-full max-w-md animate-in fade-in-0 zoom-in-95 duration-200">
                <div className="flex items-center justify-between mb-4">
                    <h2 className="text-lg font-semibold flex items-center gap-2">
                        <Globe className="h-5 w-5 text-blue-500" />
                        {title}
                    </h2>
                    <button
                        onClick={onClose}
                        className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
                    >
                        <X className="h-5 w-5" />
                    </button>
                </div>

                <form onSubmit={handleSubmit}>
                    <div className="mb-4">
                        <label htmlFor="url" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                            웹사이트 URL
                        </label>
                        <input
                            type="url"
                            id="url"
                            value={url}
                            onChange={(e) => setUrl(e.target.value)}
                            placeholder={placeholder}
                            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                            autoFocus
                            required
                        />
                    </div>

                    <div className="flex gap-3 justify-end">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-4 py-2 text-gray-700 dark:text-gray-300 bg-gray-200 dark:bg-gray-700 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
                        >
                            취소
                        </button>
                        <button
                            type="submit"
                            disabled={!url.trim()}
                            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-blue-400 disabled:cursor-not-allowed transition-colors"
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