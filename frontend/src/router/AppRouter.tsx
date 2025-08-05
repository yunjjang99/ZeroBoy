import React from 'react'
import { HashRouter, Routes, Route, Navigate } from 'react-router-dom'
import MainLayout from '@/layouts/MainLayout'
import DashboardPage from '@/pages/DashboardPage'
import BrowserPage from '@/pages/BrowserPage'
import TradingPage from '@/pages/TradingPage'
import AnalyticsPage from '@/pages/AnalyticsPage'
import TransactionsPage from '@/pages/TransactionsPage'
import MembersPage from '@/pages/MembersPage'
import PermissionsPage from '@/pages/PermissionsPage'
import SettingsPage from '@/pages/SettingsPage'
import HelpPage from '@/pages/HelpPage'

const AppRouter: React.FC = () => {
    return (
        <HashRouter>
            <Routes>
                <Route path="/" element={<MainLayout />}>
                    <Route index element={<Navigate to="/dashboard" replace />} />
                    <Route path="dashboard" element={<DashboardPage />} />
                    <Route path="browser" element={<BrowserPage />} />
                    <Route path="trading" element={<TradingPage />} />
                    <Route path="analytics" element={<AnalyticsPage />} />
                    <Route path="transactions" element={<TransactionsPage />} />
                    <Route path="members" element={<MembersPage />} />
                    <Route path="permissions" element={<PermissionsPage />} />
                    <Route path="settings" element={<SettingsPage />} />
                    <Route path="help" element={<HelpPage />} />
                </Route>
            </Routes>
        </HashRouter>
    )
}

export default AppRouter 