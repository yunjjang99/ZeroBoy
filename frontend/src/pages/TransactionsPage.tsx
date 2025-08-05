import React from 'react'
import { useTranslation } from 'react-i18next'

const TransactionsPage: React.FC = () => {
    const { t } = useTranslation()

    return (
        <div className="space-y-6">
            <div className="text-center py-12">
                <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-100 mb-4">
                    거래 내역
                </h2>
                <p className="text-slate-600 dark:text-slate-400">
                    거래 내역 및 상세 정보가 여기에 표시됩니다.
                </p>
            </div>
        </div>
    )
}

export default TransactionsPage 