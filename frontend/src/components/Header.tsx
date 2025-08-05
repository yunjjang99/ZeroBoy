import React from 'react'
import { Bell, RefreshCw, ChevronDown } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import ThemeToggle from './ThemeToggle'
import LanguageToggle from './LanguageToggle'

const Header: React.FC = () => {
    const { t } = useTranslation()

    return (
        <header className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 px-6 py-4 flex items-center justify-between drag-region">
            {/* Breadcrumb */}
            <div className="flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-300">
                <span className="font-medium">ZeroBoy</span>
                <span>/</span>
                <span>{t('common.dashboard')}</span>
            </div>

            {/* Right side actions */}
            <div className="flex items-center space-x-4 no-drag">
                {/* Language Toggle */}
                <LanguageToggle />

                {/* Theme Toggle */}
                <ThemeToggle />

                {/* Notifications */}
                <button className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors dark:text-gray-300 dark:hover:text-white dark:hover:bg-gray-700">
                    <Bell size={20} />
                </button>

                {/* Refresh */}
                <button className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors dark:text-gray-300 dark:hover:text-white dark:hover:bg-gray-700">
                    <RefreshCw size={20} />
                </button>

                {/* User Profile */}
                <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center text-white text-sm font-medium">
                        U
                    </div>
                    <div className="flex items-center space-x-1">
                        <span className="text-sm font-medium text-gray-900 dark:text-white">{t('common.user')}</span>
                        <ChevronDown size={16} className="text-gray-500 dark:text-gray-400" />
                    </div>
                </div>
            </div>
        </header>
    )
}

export default Header 