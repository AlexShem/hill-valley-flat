'use client';

import React, {createContext, useContext, useState, useEffect} from 'react';
import {translations, Language} from '@/lib/translations';

// Create a proper type for the translations structure
type TranslationStructure = typeof translations.en;

interface LanguageContextType {
    language: Language;
    setLanguage: (lang: Language) => void;
    t: TranslationStructure;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({children}: { children: React.ReactNode }) {
    const [language, setLanguage] = useState<Language>('en');

    useEffect(() => {
        // Detect browser language on first load
        const browserLang = navigator.language.split('-')[0] as Language;
        if (['en', 'fr', 'ru'].includes(browserLang)) {
            setLanguage(browserLang);
        }
    }, []);

    const contextValue: LanguageContextType = {
        language,
        setLanguage,
        t: translations[language]
    };

    return (
        <LanguageContext.Provider value={contextValue}>
            {children}
        </LanguageContext.Provider>
    );
}

export function useLanguage() {
    const context = useContext(LanguageContext);
    if (context === undefined) {
        throw new Error('useLanguage must be used within a LanguageProvider');
    }
    return context;
}