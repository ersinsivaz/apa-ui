'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { translations, LanguageCode, TranslationKey } from '@/lib/translations';

interface LanguageContextType {
    language: LanguageCode;
    setLanguage: (lang: LanguageCode) => void;
    t: (key: TranslationKey) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({
    children,
    initialLanguage = 'tr'
}: {
    children: React.ReactNode,
    initialLanguage?: LanguageCode
}) {
    const [language, setLanguage] = useState<LanguageCode>(initialLanguage);

    useEffect(() => {
        // Sync with HTML lang attribute
        document.documentElement.lang = language;
    }, [language]);

    const t = (key: TranslationKey): string => {
        return translations[language][key] || translations['en'][key] || key;
    };

    return (
        <LanguageContext.Provider value={{ language, setLanguage, t }}>
            {children}
        </LanguageContext.Provider>
    );
}

export function useTranslation() {
    const context = useContext(LanguageContext);
    if (context === undefined) {
        throw new Error('useTranslation must be used within a LanguageProvider');
    }
    return context;
}
