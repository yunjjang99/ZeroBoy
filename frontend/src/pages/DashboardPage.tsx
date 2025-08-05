import React from 'react'
import AccountsSection from '@/components/AccountsSection'
import TransactionsSection from '@/components/TransactionsSection'
import EventsSection from '@/components/EventsSection'
import { useTranslation } from 'react-i18next'

const DashboardPage: React.FC = () => {
    const { t } = useTranslation()

    return (
        <div className="space-y-6">
            {/* Chart Section - Full Width */}
            <div className="mb-6">
                {/* 차트 컴포넌트가 여기에 들어갈 예정 */}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
                {/* Accounts Section */}
                <div className="lg:col-span-1">
                    <AccountsSection />
                </div>

                {/* Transactions Section */}
                <div className="lg:col-span-1">
                    <TransactionsSection />
                </div>
            </div>

            {/* Events Section */}
            <div className="mb-6">
                <EventsSection />
            </div>
        </div>
    )
}

export default DashboardPage 