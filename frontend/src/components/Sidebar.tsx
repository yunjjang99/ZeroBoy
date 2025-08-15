import React from 'react'
import { Link, useLocation } from 'react-router-dom'
import {
    Home,
    BarChart3,
    FolderOpen,
    CreditCard,
    Users,
    Shield,
    Settings,
    HelpCircle,
    TrendingUp
} from 'lucide-react'
import { useTranslation } from 'react-i18next'

interface SidebarItem {
    icon: React.ReactNode
    label: string
    active?: boolean
    id: string
}

interface SidebarSection {
    title: string
    items: SidebarItem[]
}

interface SidebarProps {
    onSectionChange: (sectionId: string) => void
    activeSection: string
}

const Sidebar: React.FC<SidebarProps> = ({ onSectionChange, activeSection }) => {
    const { t } = useTranslation()
    const location = useLocation()

    const sidebarData: SidebarSection[] = [
        {
            title: 'OVERVIEW',
            items: [
                { icon: <Home size={20} />, label: t('common.dashboard'), id: 'dashboard', active: location.pathname === '/dashboard' },
                { icon: <BarChart3 size={20} />, label: t('common.analytics'), id: 'analytics', active: location.pathname === '/analytics' },
                { icon: <FolderOpen size={20} />, label: t('common.browser'), id: 'browser', active: location.pathname === '/browser' }
            ]
        },
        {
            title: 'TRADING',
            items: [
                { icon: <TrendingUp size={20} />, label: t('trading.title'), id: 'trading', active: location.pathname === '/trading' }
            ]
        },
        {
            title: 'FINANCE',
            items: [
                { icon: <CreditCard size={20} />, label: t('common.transactions'), id: 'transactions', active: location.pathname === '/transactions' },
                // { icon: <FileText size={20} />, label: t('common.invoices') },
                // { icon: <Payments size={20} />, label: t('common.payments') }
            ]
        },
        {
            title: 'TEAM',
            items: [
                { icon: <Users size={20} />, label: t('common.members'), id: 'members', active: location.pathname === '/members' },
                { icon: <Shield size={20} />, label: t('common.permissions'), id: 'permissions', active: location.pathname === '/permissions' },
                // { icon: <MessageCircle size={20} />, label: t('common.chat') },
                // { icon: <Calendar size={20} />, label: t('common.meetings') }
            ]
        }
    ]

    return (
        <div className="w-48 sm:w-64 bg-theme-bg-sidebar border-r border-theme-border-primary h-screen flex flex-col">
            {/* Logo */}
            <div className="p-3 sm:p-6 border-b border-theme-border-primary drag-region">
                <h1 className="text-lg sm:text-xl font-bold text-theme-text-primary truncate">ZeroBoy</h1>
                <p className="text-xs sm:text-sm text-theme-text-tertiary truncate">Crypto Trading Bot</p>
            </div>

            {/* Navigation */}
            <nav className="flex-1 p-2 sm:p-4 space-y-4 sm:space-y-6 no-drag">
                {sidebarData.map((section, sectionIndex) => (
                    <div key={sectionIndex}>
                        <h3 className="text-xs font-semibold text-theme-text-muted uppercase tracking-wider mb-2 sm:mb-3 px-1">
                            {section.title}
                        </h3>
                        <ul className="space-y-1 sm:space-y-2">
                            {section.items.map((item, itemIndex) => (
                                <li key={itemIndex}>
                                    <Link
                                        to={`/${item.id}`}
                                        className={`w-full flex items-center space-x-2 sm:space-x-3 px-2 py-1.5 sm:px-3 sm:py-2 rounded-lg text-xs sm:text-sm transition-colors ${item.active
                                            ? 'bg-blue-600 text-white'
                                            : 'text-theme-text-secondary hover:bg-theme-hover-bg hover:text-theme-text-primary'
                                            }`}
                                    >
                                        <div className="flex-shrink-0">
                                            {React.cloneElement(item.icon as React.ReactElement, {
                                                size: window.innerWidth < 640 ? 16 : 20
                                            } as any)}
                                        </div>
                                        <span className="truncate">{item.label}</span>
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>
                ))}
            </nav>

            {/* Bottom Navigation */}
            <div className="p-4 border-t border-theme-border-primary space-y-2 no-drag">
                <Link
                    to="/settings"
                    className="flex items-center space-x-3 px-3 py-2 rounded-lg text-sm text-theme-text-secondary hover:bg-theme-hover-bg hover:text-theme-text-primary transition-colors"
                >
                    <Settings size={20} />
                    <span>{t('common.settings')}</span>
                </Link>
                <Link
                    to="/help"
                    className="flex items-center space-x-3 px-3 py-2 rounded-lg text-sm text-theme-text-secondary hover:bg-theme-hover-bg hover:text-theme-text-primary transition-colors"
                >
                    <HelpCircle size={20} />
                    <span>{t('common.help')}</span>
                </Link>
            </div>
        </div>
    )
}

export default Sidebar 