import Dexie, { type Table } from 'dexie';

export interface CoreItem {
    id: string;
    normalized: string;
    rank: number;
    level: string; // A0, A1, A2, B1, B2, C1, C2
    pos: 'word' | 'phrase' | 'phoneme'; // Differentiates item types
    translation?: string;
    phase: 1 | 2 | 3;
    phonetic?: boolean;
    audioUrl?: string;
}

export interface Progress {
    wordId: string;
    status: 'new' | 'learning' | 'mastered';
    nextReview: number; // Timestamp for Spaced Repetition (SRS)
    interval: number;
    easeFactor: number;
}

export interface UserPersist {
    uid: string;
}

export class DeltaLeapDB extends Dexie {
    core_words!: Table<CoreItem>;
    progress!: Table<Progress>;
    user!: Table<UserPersist>;

    constructor() {
        super('DeltaLeapDB');
        this.version(2).stores({
            core_words: 'id, rank, level, normalized, pos, phase',
            progress: 'wordId, status, nextReview',
            user: 'uid'
        });
    }
}

export const db = new DeltaLeapDB();
