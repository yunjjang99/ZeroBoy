import React, { useState } from 'react'
import { Plus, Globe, Loader2, AlertCircle } from 'lucide-react'
import { BrowserProfileCard } from './BrowserProfileCard'
import { useProfiles, useLaunchBrowser, useReopenBrowser, useDeleteProfile } from '../hooks/useBrowserQueries'
import { useAlert } from '../contexts/AlertContext'
import UrlInputModal from './UrlInputModal'

const BrowserProfilesSection: React.FC = () => {
    const [creating, setCreating] = useState(false)
    const [showUrlModal, setShowUrlModal] = useState(false)

    // Tanstack Query 훅들 사용
    const { data: profiles = [], isLoading, error } = useProfiles()
    const launchBrowserMutation = useLaunchBrowser()
    const reopenBrowserMutation = useReopenBrowser()
    const deleteProfileMutation = useDeleteProfile()

    // Alert 시스템 사용
    const { showAlert, showConfirm, showToast } = useAlert()

    const handleCreateProfile = async (url: string) => {
        setCreating(true)
        try {
            const result = await launchBrowserMutation.mutateAsync({ url })
            showToast(`브라우저가 생성되었습니다. UUID: ${result.uuid}`, {
                type: 'success',
                title: '성공',
                duration: 3000
            })
        } catch (error) {
            console.error('프로필 생성 실패:', error)
            showAlert('프로필 생성에 실패했습니다.', {
                type: 'error',
                title: '오류'
            })
        } finally {
            setCreating(false)
        }
    }

    const handleReopenProfile = async (uuid: string) => {
        try {
            const result = await reopenBrowserMutation.mutateAsync({ uuid })
            showToast(`브라우저가 재생성되었습니다. 페이지 제목: ${result.title}`, {
                type: 'success',
                title: '성공',
                duration: 3000
            })
        } catch (error) {
            console.error('프로필 재생성 실패:', error)
            showAlert('프로필 재생성에 실패했습니다.', {
                type: 'error',
                title: '오류'
            })
        }
    }

    const handleDeleteProfile = async (uuid: string) => {
        showConfirm('정말로 이 프로필을 삭제하시겠습니까?', async () => {
            try {
                await deleteProfileMutation.mutateAsync(uuid)
                showToast('프로필이 삭제되었습니다.', {
                    type: 'success',
                    title: '성공',
                    duration: 3000
                })
            } catch (error) {
                console.error('프로필 삭제 실패:', error)
                showAlert('프로필 삭제에 실패했습니다.', {
                    type: 'error',
                    title: '오류'
                })
            }
        }, {
            type: 'danger',
            title: '프로필 삭제',
            confirmText: '삭제',
            cancelText: '취소'
        })
    }

    if (isLoading) {
        return (
            <div className="flex items-center justify-center h-64">
                <Loader2 className="h-8 w-8 animate-spin text-blue-500 dark:text-blue-400" />
            </div>
        )
    }

    if (error) {
        return (
            <div className="p-6 bg-white dark:bg-gray-800 rounded-lg shadow-sm">
                <div className="text-center py-12">
                    <div className="text-red-500 dark:text-red-400 mb-4">
                        <AlertCircle className="h-12 w-12 mx-auto" />
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">오류가 발생했습니다</h3>
                    <p className="text-gray-600 dark:text-gray-400">
                        브라우저 프로필을 불러오는 중 문제가 발생했습니다.
                        {error instanceof Error && (
                            <span className="block mt-2 text-sm text-red-500 dark:text-red-400">
                                {error.message}
                            </span>
                        )}
                    </p>
                    <button
                        onClick={() => window.location.reload()}
                        className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                    >
                        다시 시도
                    </button>
                </div>
            </div>
        )
    }

    return (
        <div className="p-6">
            <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                    <Globe className="h-6 w-6 text-blue-500 dark:text-blue-400" />
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white">브라우저 프로필</h2>
                </div>
                <button
                    onClick={() => setShowUrlModal(true)}
                    disabled={creating || launchBrowserMutation.isPending}
                    className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-800 text-white rounded-lg transition-colors"
                >
                    {(creating || launchBrowserMutation.isPending) ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                        <Plus className="h-4 w-4" />
                    )}
                    새 프로필 생성
                </button>
            </div>

            {profiles.length === 0 ? (
                <div className="text-center py-12">
                    <Globe className="h-12 w-12 text-gray-400 dark:text-gray-500 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-700 dark:text-gray-300 mb-2">프로필이 없습니다</h3>
                    <p className="text-gray-600 dark:text-gray-400">새로운 브라우저 프로필을 생성해보세요.</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {profiles.map((profile) => (
                        <BrowserProfileCard
                            key={profile.uuid}
                            profile={profile}
                            onReopen={handleReopenProfile}
                            onDelete={handleDeleteProfile}
                        />
                    ))}
                </div>
            )}

            {/* URL 입력 모달 */}
            <UrlInputModal
                isOpen={showUrlModal}
                onClose={() => setShowUrlModal(false)}
                onConfirm={handleCreateProfile}
            />
        </div>
    )
}

export default BrowserProfilesSection 