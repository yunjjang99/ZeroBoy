import React from 'react'
import { useLanguage } from '../contexts/LanguageContext'

const LanguageToggle: React.FC = () => {
    const { language, toggleLanguage } = useLanguage()

    return (
        <button
            onClick={toggleLanguage}
            className="px-3 py-1 text-sm font-medium text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors dark:text-gray-300 dark:hover:text-white dark:hover:bg-gray-900"
            title={language === 'ko' ? 'Switch to English' : '한국어로 전환'}
        >
            {language === 'ko' ? 'EN' : 'KO'}
        </button>
    )
}

export default LanguageToggle 