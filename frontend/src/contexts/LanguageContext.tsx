import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import { useTranslation } from 'react-i18next'

type Language = 'ko' | 'en'

interface LanguageContextType {
    language: Language
    setLanguage: (lang: Language) => void
    toggleLanguage: () => void
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined)

export const useLanguage = () => {
    const context = useContext(LanguageContext)
    if (context === undefined) {
        throw new Error('useLanguage must be used within a LanguageProvider')
    }
    return context
}

interface LanguageProviderProps {
    children: ReactNode
}

export const LanguageProvider: React.FC<LanguageProviderProps> = ({ children }) => {
    const { i18n } = useTranslation()
    const [language, setLanguageState] = useState<Language>(() => {
        // 로컬 스토리지에서 언어 가져오기
        const savedLanguage = localStorage.getItem('language') as Language
        return savedLanguage || 'ko'
    })

    const setLanguage = (lang: Language) => {
        setLanguageState(lang)
        i18n.changeLanguage(lang)
        localStorage.setItem('language', lang)
    }

    const toggleLanguage = () => {
        const newLang = language === 'ko' ? 'en' : 'ko'
        setLanguage(newLang)
    }

    useEffect(() => {
        // 초기 언어 설정
        i18n.changeLanguage(language)
    }, [i18n, language])

    const value = {
        language,
        setLanguage,
        toggleLanguage
    }

    return (
        <LanguageContext.Provider value={value}>
            {children}
        </LanguageContext.Provider>
    )
} 