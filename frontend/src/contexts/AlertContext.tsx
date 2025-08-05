import React, { createContext, useContext, useState, useCallback, ReactNode } from 'react'
import AlertModal, { AlertType } from '../components/ui/AlertModal'
import ConfirmModal, { ConfirmType } from '../components/ui/ConfirmModal'
import Toast, { ToastType } from '../components/ui/Toast'

interface AlertState {
    isOpen: boolean
    title: string
    message: string
    type: AlertType
    showCloseButton: boolean
}

interface ConfirmState {
    isOpen: boolean
    title: string
    message: string
    type: ConfirmType
    confirmText: string
    cancelText: string
    showCloseButton: boolean
    onConfirm: () => void
}

interface ToastItem {
    id: string
    type: ToastType
    title?: string
    message: string
    duration: number
}

interface AlertContextType {
    // Alert Modal
    showAlert: (message: string, options?: {
        title?: string
        type?: AlertType
        showCloseButton?: boolean
    }) => void

    // Confirm Modal
    showConfirm: (message: string, onConfirm: () => void, options?: {
        title?: string
        type?: ConfirmType
        confirmText?: string
        cancelText?: string
        showCloseButton?: boolean
    }) => void

    // Toast
    showToast: (message: string, options?: {
        type?: ToastType
        title?: string
        duration?: number
    }) => void
}

const AlertContext = createContext<AlertContextType | undefined>(undefined)

export const useAlert = () => {
    const context = useContext(AlertContext)
    if (!context) {
        throw new Error('useAlert must be used within an AlertProvider')
    }
    return context
}

interface AlertProviderProps {
    children: ReactNode
}

export const AlertProvider: React.FC<AlertProviderProps> = ({ children }) => {
    const [alertState, setAlertState] = useState<AlertState>({
        isOpen: false,
        title: '알림',
        message: '',
        type: 'info',
        showCloseButton: true
    })

    const [confirmState, setConfirmState] = useState<ConfirmState>({
        isOpen: false,
        title: '확인',
        message: '',
        type: 'warning',
        confirmText: '확인',
        cancelText: '취소',
        showCloseButton: true,
        onConfirm: () => { }
    })

    const [toasts, setToasts] = useState<ToastItem[]>([])

    const showAlert = useCallback((message: string, options: any = {}) => {
        setAlertState({
            isOpen: true,
            title: options.title || '알림',
            message,
            type: options.type || 'info',
            showCloseButton: options.showCloseButton ?? true
        })
    }, [])

    const showConfirm = useCallback((message: string, onConfirm: () => void, options: any = {}) => {
        setConfirmState({
            isOpen: true,
            title: options.title || '확인',
            message,
            type: options.type || 'warning',
            confirmText: options.confirmText || '확인',
            cancelText: options.cancelText || '취소',
            showCloseButton: options.showCloseButton ?? true,
            onConfirm
        })
    }, [])

    const showToast = useCallback((message: string, options: any = {}) => {
        const id = Date.now().toString()
        const newToast: ToastItem = {
            id,
            type: options.type || 'info',
            title: options.title,
            message,
            duration: options.duration || 5000
        }

        setToasts(prev => [...prev, newToast])
    }, [])

    const closeAlert = useCallback(() => {
        setAlertState(prev => ({ ...prev, isOpen: false }))
    }, [])

    const closeConfirm = useCallback(() => {
        setConfirmState(prev => ({ ...prev, isOpen: false }))
    }, [])

    const removeToast = useCallback((id: string) => {
        setToasts(prev => prev.filter(toast => toast.id !== id))
    }, [])

    const value: AlertContextType = {
        showAlert,
        showConfirm,
        showToast
    }

    return (
        <AlertContext.Provider value={value}>
            {children}

            {/* Alert Modal */}
            <AlertModal
                isOpen={alertState.isOpen}
                onClose={closeAlert}
                title={alertState.title}
                message={alertState.message}
                type={alertState.type}
                showCloseButton={alertState.showCloseButton}
            />

            {/* Confirm Modal */}
            <ConfirmModal
                isOpen={confirmState.isOpen}
                onClose={closeConfirm}
                onConfirm={confirmState.onConfirm}
                title={confirmState.title}
                message={confirmState.message}
                type={confirmState.type}
                confirmText={confirmState.confirmText}
                cancelText={confirmState.cancelText}
                showCloseButton={confirmState.showCloseButton}
            />

            {/* Toast Container */}
            <div className="fixed top-4 right-4 z-50 space-y-2">
                {toasts.map((toast, index) => (
                    <div
                        key={toast.id}
                        style={{ transform: `translateY(${index * 80}px)` }}
                    >
                        <Toast
                            id={toast.id}
                            type={toast.type}
                            title={toast.title}
                            message={toast.message}
                            duration={toast.duration}
                            onClose={removeToast}
                        />
                    </div>
                ))}
            </div>
        </AlertContext.Provider>
    )
} 