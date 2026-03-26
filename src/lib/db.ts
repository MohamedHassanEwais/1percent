import Dexie, { Table } from 'dexie';

export interface CoreWord {
  id: string; 
  packId: string; // Max 1000 items per pack
  rank: number;
  level: string; 
  normalized: string;
  pos: 'word' | 'phrase' | 'phoneme'; 
}

export interface Progress {
  wordId: string;
  status: 'new' | 'learning' | 'mastered';
  nextReview: number; 
  comprehensionScore: number; 
}

export interface UserState {
  uid: string;
  xp: number;
  streak: number;
  lastStudyDate: number;
  maxUnlockedLevel: string;
}

export class DeltaLeapDB extends Dexie {
  core_words!: Table<CoreWord>;
  progress!: Table<Progress>;
  user!: Table<UserState>;

  constructor() {
    super('DeltaLeapDB');
    this.version(1).stores({
      core_words: 'id, packId, rank, level, normalized, pos', 
      progress: 'wordId, status, nextReview',
      user: 'uid'
    });
  }

  async getSmartMixSession(): Promise<Progress[]> {
    const now = Date.now();
    const SESSION_LIMIT = 7; // STRICT RULE: Never exceed 7 items per session
    
    const dueReviews = await this.progress
      .where('nextReview')
      .belowOrEqual(now)
      .toArray();

    let session: Progress[] = [...dueReviews];

    if (session.length < SESSION_LIMIT) {
      const needed = SESSION_LIMIT - session.length;
      const newItems = await this.progress
        .where('status')
        .equals('new')
        .limit(needed)
        .toArray(); 

      session = [...session, ...newItems];
    }

    const finalSession = session.slice(0, SESSION_LIMIT);
    for (let i = finalSession.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [finalSession[i], finalSession[j]] = [finalSession[j], finalSession[i]];
    }

    return finalSession;
  }

  async checkLevelProgression(currentLevelWordsCount: number, masteredWordsCount: number): Promise<boolean> {
    const COMPREHENSION_THRESHOLD = 0.95; // MUST have exactly 95% mastery
    
    if (currentLevelWordsCount === 0) return false;
    
    const masteryPercentage = masteredWordsCount / currentLevelWordsCount;
    return masteryPercentage >= COMPREHENSION_THRESHOLD;
  }
}

export const db = new DeltaLeapDB();
