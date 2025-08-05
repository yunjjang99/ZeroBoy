import React from 'react'
import { useTranslation } from 'react-i18next'

const MembersPage: React.FC = () => {
    const { t } = useTranslation()

    return (
        <div className="space-y-6">
            <div className="text-center py-12">
                <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-100 mb-4">
                    팀 멤버
                </h2>
                <p className="text-slate-600 dark:text-slate-400">
                    팀 멤버 관리 및 권한 설정이 여기에 구현될 예정입니다.
                </p>
            </div>
        </div>
    )
}

export default MembersPage 