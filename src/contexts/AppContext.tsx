"use client";

import React, { createContext, useContext, useState, useEffect } from 'react';

/**
 * Uygulama geneli context - Dark mode ve dil yönetimi için
 */

type Language = 'tr' | 'en';
type Theme = 'dark' | 'light';

interface AppContextType {
    language: Language;
    setLanguage: (lang: Language) => void;
    theme: Theme;
    setTheme: (theme: Theme) => void;
    toggleTheme: () => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export function AppProvider({ children }: { children: React.ReactNode }) {
    // localStorage'dan tema ve dil tercihlerini yükle
    const [theme, setThemeState] = useState<Theme>(() => {
        if (typeof window !== 'undefined') {
            const saved = localStorage.getItem('theme') as Theme;
            return saved || 'dark';
        }
        return 'dark';
    });

    const [language, setLanguageState] = useState<Language>(() => {
        if (typeof window !== 'undefined') {
            const saved = localStorage.getItem('language') as Language;
            return saved || 'tr';
        }
        return 'tr';
    });

    // Tema değiştiğinde localStorage'a kaydet ve DOM'a uygula
    useEffect(() => {
        localStorage.setItem('theme', theme);
        if (theme === 'dark') {
            document.documentElement.classList.add('dark');
            document.documentElement.classList.remove('light');
        } else {
            document.documentElement.classList.add('light');
            document.documentElement.classList.remove('dark');
        }
    }, [theme]);

    // Dil değiştiğinde localStorage'a kaydet
    useEffect(() => {
        localStorage.setItem('language', language);
    }, [language]);

    const setTheme = (newTheme: Theme) => {
        setThemeState(newTheme);
    };

    const toggleTheme = () => {
        setThemeState(prev => prev === 'dark' ? 'light' : 'dark');
    };

    const setLanguage = (lang: Language) => {
        setLanguageState(lang);
    };

    return (
        <AppContext.Provider value={{ theme, setTheme, toggleTheme, language, setLanguage }}>
            {children}
        </AppContext.Provider>
    );
}

export function useApp() {
    const context = useContext(AppContext);
    if (context === undefined) {
        throw new Error('useApp must be used within AppProvider');
    }
    return context;
}

