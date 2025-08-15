import React from 'react'
import { Bell, RefreshCw, ChevronDown } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import ThemeToggle from './ThemeToggle'
import LanguageToggle from './LanguageToggle'

const Header: React.FC = () => {
    const { t } = useTranslation()

    return (
        <header className="bg-theme-bg-header border-b border-theme-border-primary px-6 py-4 flex items-center justify-between drag-region">
            {/* Breadcrumb */}
            <div className="flex items-center space-x-2 text-sm text-theme-text-tertiary">
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
                <button className="p-2 text-theme-text-tertiary hover:text-theme-text-primary hover:bg-theme-hover-bg rounded-lg transition-colors">
                    <Bell size={20} />
                </button>

                {/* Refresh */}
                <button className="p-2 text-theme-text-tertiary hover:text-theme-text-primary hover:bg-theme-hover-bg rounded-lg transition-colors">
                    <RefreshCw size={20} />
                </button>

                {/* User Profile */}
                <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center text-white text-sm font-medium">
                        U
                    </div>
                    <div className="flex items-center space-x-1">
                        <span className="text-sm font-medium text-theme-text-primary">{t('common.user')}</span>
                        <ChevronDown size={16} className="text-theme-text-muted" />
                    </div>
                </div>
            </div>
        </header>
    )
}

export default Header 