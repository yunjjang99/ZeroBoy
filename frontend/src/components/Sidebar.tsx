import React from 'react'
import {
    Home,
    BarChart3,
    FolderOpen,
    CreditCard,
    Users,
    Shield,
    Settings,
    HelpCircle
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

    const sidebarData: SidebarSection[] = [
        {
            title: 'OVERVIEW',
            items: [
                { icon: <Home size={20} />, label: t('common.dashboard'), id: 'dashboard', active: activeSection === 'dashboard' },
                { icon: <BarChart3 size={20} />, label: t('common.analytics'), id: 'analytics', active: activeSection === 'analytics' },
                { icon: <FolderOpen size={20} />, label: t('common.browser'), id: 'browser', active: activeSection === 'browser' }
            ]
        },
        {
            title: 'FINANCE',
            items: [
                { icon: <CreditCard size={20} />, label: t('common.transactions'), id: 'transactions', active: activeSection === 'transactions' },
                // { icon: <FileText size={20} />, label: t('common.invoices') },
                // { icon: <Payments size={20} />, label: t('common.payments') }
            ]
        },
        {
            title: 'TEAM',
            items: [
                { icon: <Users size={20} />, label: t('common.members'), id: 'members', active: activeSection === 'members' },
                { icon: <Shield size={20} />, label: t('common.permissions'), id: 'permissions', active: activeSection === 'permissions' },
                // { icon: <MessageCircle size={20} />, label: t('common.chat') },
                // { icon: <Calendar size={20} />, label: t('common.meetings') }
            ]
        }
    ]

    return (
        <div className="w-64 bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-700 h-screen flex flex-col">
            {/* Logo */}
            <div className="p-6 border-b border-gray-200 dark:border-gray-700 drag-region">
                <h1 className="text-xl font-bold text-gray-900 dark:text-white">ZeroBoy</h1>
                <p className="text-sm text-gray-600 dark:text-gray-400">Crypto Trading Bot</p>
            </div>

            {/* Navigation */}
            <nav className="flex-1 p-4 space-y-6 no-drag">
                {sidebarData.map((section, sectionIndex) => (
                    <div key={sectionIndex}>
                        <h3 className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-3">
                            {section.title}
                        </h3>
                        <ul className="space-y-2">
                            {section.items.map((item, itemIndex) => (
                                <li key={itemIndex}>
                                    <button
                                        onClick={() => onSectionChange(item.id)}
                                        className={`w-full flex items-center space-x-3 px-3 py-2 rounded-lg text-sm transition-colors ${item.active
                                            ? 'bg-blue-600 text-white'
                                            : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 hover:text-gray-900 dark:hover:text-white'
                                            }`}
                                    >
                                        {item.icon}
                                        <span>{item.label}</span>
                                    </button>
                                </li>
                            ))}
                        </ul>
                    </div>
                ))}
            </nav>

            {/* Bottom Navigation */}
            <div className="p-4 border-t border-gray-200 dark:border-gray-700 space-y-2 no-drag">
                <a
                    href="#"
                    className="flex items-center space-x-3 px-3 py-2 rounded-lg text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 hover:text-gray-900 dark:hover:text-white transition-colors"
                >
                    <Settings size={20} />
                    <span>{t('common.settings')}</span>
                </a>
                <a
                    href="#"
                    className="flex items-center space-x-3 px-3 py-2 rounded-lg text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 hover:text-gray-900 dark:hover:text-white transition-colors"
                >
                    <HelpCircle size={20} />
                    <span>{t('common.help')}</span>
                </a>
            </div>
        </div>
    )
}

export default Sidebar 