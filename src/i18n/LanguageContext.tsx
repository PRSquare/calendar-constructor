import React, { createContext, useContext, useState } from 'react';
import type { ReactNode } from 'react';
import type { Translation } from './translations';
import { translations } from './translations';

interface LanguageContextType {
    language: string;
    setLanguage: (lang: string) => void;
    t: Translation;
    availableLanguages: { code: string; name: string; nativeName: string }[];
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

// Detect browser language and return supported language code
const detectBrowserLanguage = (): string => {
    // Get browser language
    const browserLang = navigator.language || navigator.languages?.[0] || 'en';

    // Extract language code (e.g., 'en-US' -> 'en', 'ru-RU' -> 'ru')
    const langCode = browserLang.split('-')[0].toLowerCase();

    // Return supported language or fallback to English
    return translations[langCode] ? langCode : 'en';
};

export const availableLanguages = [
    { code: 'en', name: 'English', nativeName: 'English' },
    { code: 'ru', name: 'Russian', nativeName: 'Русский' }
];

interface LanguageProviderProps {
    children: ReactNode;
}

export const LanguageProvider: React.FC<LanguageProviderProps> = ({ children }) => {
    // Initialize with detected language or fallback to English
    const [language, setLanguageState] = useState<string>(() => {
        // Try to get saved language from localStorage first
        const savedLang = localStorage.getItem('calendar-language');
        if (savedLang && translations[savedLang]) {
            return savedLang;
        }
        // Otherwise detect browser language
        return detectBrowserLanguage();
    });

    const setLanguage = (lang: string) => {
        if (translations[lang]) {
            setLanguageState(lang);
            localStorage.setItem('calendar-language', lang);
        }
    };

    const t = translations[language] || translations.en;

    const value: LanguageContextType = {
        language,
        setLanguage,
        t,
        availableLanguages
    };

    return (
        <LanguageContext.Provider value={value}>
            {children}
        </LanguageContext.Provider>
    );
};

export const useLanguage = (): LanguageContextType => {
    const context = useContext(LanguageContext);
    if (!context) {
        throw new Error('useLanguage must be used within a LanguageProvider');
    }
    return context;
};