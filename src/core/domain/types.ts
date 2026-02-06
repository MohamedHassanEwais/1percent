export type CEFRLevel = 'A1' | 'A2' | 'B1' | 'B2' | 'C1' | 'C2' | 'N/A';
export type WordCategory = 'business' | 'academic' | 'travel' | 'core';

export interface VocabularyCard {
    id: string;             // Unique ID (e.g., "ambition_123")
    word: string;           // "Ambition"
    normalized: string;     // "ambition" (for search)
    rank: number;           // 1 to 3000 (The Order)

    // Content (The Assets)
    phonetic: string;       // "/æmˈbɪʃ.ən/"
    audioUrl: string;       // "https://cdn.../ambition.mp3"
    translation: string;    // "طموح"
    definition: string;     // English definition
    exampleSentence: string;// "She had a burning <highlight>ambition</highlight> to succeed."
    imageUrl?: string;      // Visual Mnemonic

    level: CEFRLevel;
    tags?: WordCategory[];
}

export interface ReviewLog {
    date: number;           // Timestamp
    rating: 1 | 2 | 3 | 4;  // 1: Again, 2: Hard, 3: Good, 4: Easy
    interval: number;       // The interval assigned after this review
}

export interface WordProgress {
    wordId: string;
    status: 'new' | 'learning' | 'review' | 'graduated';

    // SRS Factors (SM-2)
    interval: number;       // Days until next review
    easeFactor: number;     // Multiplier (starts at 2.5)
    repetitions: number;    // Consecutive correct answers
    nextReview: number;     // Timestamp (Unix)

    history: ReviewLog[];
}

export interface UserProfile {
    uid: string;
    displayName: string;
    email: string;
    photoURL?: string;

    // Gamification Stats
    totalXp: number;
    streakDays: number;
    lastStudyDate: string;  // ISO Date "2024-02-05"
    rankTitle: string;      // "Saye7" -> "Salek"
    starsUnlocked: number;  // Count of "Graduated" words
}
