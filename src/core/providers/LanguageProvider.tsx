'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import { LanguageIngestionService } from '../services/language-ingestion';
import { db } from '../store/db';

interface LanguageContextType {
    isReady: boolean;
    languageName: string | null;
    loadLanguage: (jsonString: string) => Promise<void>;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children }: { children: React.ReactNode }) {
    const [isReady, setIsReady] = useState(false);
    const [languageName, setLanguageName] = useState<string | null>(null);

    useEffect(() => {
        // Initialization check: is db populated?
        async function checkDb() {
            const count = await db.core_words.count();
            if (count > 0) {
                // Technically would fetch the language from a metadata store
                setLanguageName('Active Language'); 
                setIsReady(true);
            }
        }
        checkDb();
    }, []);

    const loadLanguage = async (jsonString: string) => {
        setIsReady(false);
        try {
            const data = JSON.parse(jsonString);
            await LanguageIngestionService.ingestLanguage(data);
            setLanguageName(data.language);
            setIsReady(true);
        } catch (error) {
            console.error('Failed to load language', error);
            setIsReady(false);
            throw error;
        }
    };

    return (
        <LanguageContext.Provider value={{ isReady, languageName, loadLanguage }}>
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
