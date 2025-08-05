import React from 'react'
import { useTranslation } from 'react-i18next'

const AnalyticsPage: React.FC = () => {
    const { t } = useTranslation()

    return (
        <div className="space-y-6">
            <div className="text-center py-12">
                <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-100 mb-4">
                    분석 페이지
                </h2>
                <p className="text-slate-600 dark:text-slate-400">
                    거래 분석 및 통계 기능이 여기에 구현될 예정입니다.
                </p>
            </div>
        </div>
    )
}

export default AnalyticsPage 