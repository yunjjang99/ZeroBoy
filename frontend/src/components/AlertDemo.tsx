import React from 'react'
import { useAlert } from '../contexts/AlertContext'

const AlertDemo: React.FC = () => {
    const { showAlert, showConfirm, showToast } = useAlert()

    return (
        <div className="p-6 bg-white dark:bg-gray-800 rounded-lg shadow-sm">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Alert 시스템 데모</h2>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {/* Alert Modal 테스트 */}
                <div className="space-y-3">
                    <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-300">Alert Modal</h3>
                    <div className="space-y-2">
                        <button
                            onClick={() => showAlert('정보 메시지입니다.', { type: 'info', title: '정보' })}
                            className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                        >
                            Info Alert
                        </button>
                        <button
                            onClick={() => showAlert('성공 메시지입니다.', { type: 'success', title: '성공' })}
                            className="w-full px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                        >
                            Success Alert
                        </button>
                        <button
                            onClick={() => showAlert('경고 메시지입니다.', { type: 'warning', title: '경고' })}
                            className="w-full px-4 py-2 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700 transition-colors"
                        >
                            Warning Alert
                        </button>
                        <button
                            onClick={() => showAlert('오류 메시지입니다.', { type: 'error', title: '오류' })}
                            className="w-full px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                        >
                            Error Alert
                        </button>
                    </div>
                </div>

                {/* Confirm Modal 테스트 */}
                <div className="space-y-3">
                    <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-300">Confirm Modal</h3>
                    <div className="space-y-2">
                        <button
                            onClick={() => showConfirm('정말로 이 작업을 수행하시겠습니까?', () => {
                                showToast('작업이 완료되었습니다.', { type: 'success' })
                            }, { type: 'info', title: '확인' })}
                            className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                        >
                            Info Confirm
                        </button>
                        <button
                            onClick={() => showConfirm('이 작업은 되돌릴 수 없습니다. 계속하시겠습니까?', () => {
                                showToast('작업이 완료되었습니다.', { type: 'success' })
                            }, { type: 'warning', title: '주의' })}
                            className="w-full px-4 py-2 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700 transition-colors"
                        >
                            Warning Confirm
                        </button>
                        <button
                            onClick={() => showConfirm('이 작업은 매우 위험합니다. 정말로 계속하시겠습니까?', () => {
                                showToast('위험한 작업이 완료되었습니다.', { type: 'warning' })
                            }, { type: 'danger', title: '위험', confirmText: '계속', cancelText: '취소' })}
                            className="w-full px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                        >
                            Danger Confirm
                        </button>
                    </div>
                </div>

                {/* Toast 테스트 */}
                <div className="space-y-3">
                    <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-300">Toast</h3>
                    <div className="space-y-2">
                        <button
                            onClick={() => showToast('정보 토스트 메시지입니다.', { type: 'info', title: '정보' })}
                            className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                        >
                            Info Toast
                        </button>
                        <button
                            onClick={() => showToast('성공 토스트 메시지입니다.', { type: 'success', title: '성공' })}
                            className="w-full px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                        >
                            Success Toast
                        </button>
                        <button
                            onClick={() => showToast('경고 토스트 메시지입니다.', { type: 'warning', title: '경고' })}
                            className="w-full px-4 py-2 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700 transition-colors"
                        >
                            Warning Toast
                        </button>
                        <button
                            onClick={() => showToast('오류 토스트 메시지입니다.', { type: 'error', title: '오류' })}
                            className="w-full px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                        >
                            Error Toast
                        </button>
                        <button
                            onClick={() => showToast('긴 토스트 메시지입니다. 이 메시지는 자동으로 사라집니다.', {
                                type: 'info',
                                title: '긴 메시지',
                                duration: 8000
                            })}
                            className="w-full px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
                        >
                            Long Toast (8초)
                        </button>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default AlertDemo 