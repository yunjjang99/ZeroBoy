import React, { useState, useEffect } from 'react'
import { Outlet, useLocation } from 'react-router-dom'
import Sidebar from '@/components/Sidebar'
import Header from '@/components/Header'
// import { useTranslation } from 'react-i18next'

const MainLayout: React.FC = () => {
    const [_, setPlatform] = useState<string>('')
    const [activeSection, setActiveSection] = useState<string>('dashboard')
    const location = useLocation()
    // const { i18n } = useTranslation()

    useEffect(() => {
        // 플랫폼 감지
        if (window.electron) {
            setPlatform('electron')
        } else {
            setPlatform('web')
        }
    }, [])

    useEffect(() => {
        // URL 경로에 따라 활성 섹션 설정
        const path = location.pathname
        if (path === '/') {
            setActiveSection('dashboard')
        } else if (path === '/browser') {
            setActiveSection('browser')
        } else if (path === '/trading') {
            setActiveSection('trading')
        } else if (path === '/analytics') {
            setActiveSection('analytics')
        } else if (path === '/transactions') {
            setActiveSection('transactions')
        } else if (path === '/members') {
            setActiveSection('members')
        } else if (path === '/permissions') {
            setActiveSection('permissions')
        } else if (path === '/settings') {
            setActiveSection('settings')
        } else if (path === '/help') {
            setActiveSection('help')
        }
    }, [location.pathname])

    return (
        <div className="flex h-screen bg-theme-bg-secondary">
            {/* Sidebar */}
            <Sidebar onSectionChange={() => { }} activeSection={activeSection} />

            {/* Main Content */}
            <div className="flex-1 flex flex-col overflow-hidden">
                {/* Header */}
                <Header />

                {/* Main Content Area */}
                <main className="flex-1 overflow-y-auto p-6 no-drag">
                    <Outlet />
                </main>
            </div>
        </div>
    )
}

export default MainLayout 