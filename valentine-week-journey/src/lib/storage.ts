export const STORAGE_KEYS = {
  PROGRESS: 'valentine_journey_progress',
  VERSION: 'valentine_journey_version'
} as const;

export const STORAGE_VERSION = '1.0';

export interface ProgressData {
  version: string;
  currentDay: number;
  completedDays: number[];
  puzzleProgress: Record<string, {
    completed: boolean;
    attempts: number;
    score?: number;
    completedAt?: string;
  }>;
  unlockedMessages: string[];
  startDate: string;
  lastVisit: string;
}

const getDefaultProgress = (): ProgressData => ({
  version: STORAGE_VERSION,
  currentDay: 1,
  completedDays: [],
  puzzleProgress: {},
  unlockedMessages: [],
  startDate: new Date().toISOString(),
  lastVisit: new Date().toISOString()
});

export const getProgress = (): ProgressData => {
  if (typeof window === 'undefined') {
    return getDefaultProgress();
  }
  
  try {
    const stored = localStorage.getItem(STORAGE_KEYS.PROGRESS);
    if (!stored) {
      return getDefaultProgress();
    }
    
    const data = JSON.parse(stored) as ProgressData;
    
    // Validate version
    if (data.version !== STORAGE_VERSION) {
      return getDefaultProgress();
    }
    
    return {
      ...getDefaultProgress(),
      ...data,
      lastVisit: new Date().toISOString()
    };
  } catch (error) {
    console.error('Error reading progress:', error);
    return getDefaultProgress();
  }
};

export const saveProgress = (progress: Partial<ProgressData>): void => {
  if (typeof window === 'undefined') return;
  
  try {
    const current = getProgress();
    const updated: ProgressData = {
      ...current,
      ...progress,
      version: STORAGE_VERSION,
      lastVisit: new Date().toISOString()
    };
    
    localStorage.setItem(STORAGE_KEYS.PROGRESS, JSON.stringify(updated));
  } catch (error) {
    console.error('Error saving progress:', error);
  }
};

export const markDayComplete = (dayNumber: number): void => {
  const progress = getProgress();
  
  if (!progress.completedDays.includes(dayNumber)) {
    progress.completedDays.push(dayNumber);
    progress.completedDays.sort((a, b) => a - b);
  }
  
  progress.puzzleProgress[`day${dayNumber}`] = {
    completed: true,
    attempts: (progress.puzzleProgress[`day${dayNumber}`]?.attempts || 0) + 1,
    score: 100,
    completedAt: new Date().toISOString()
  };
  
  if (dayNumber < 8) {
    progress.currentDay = Math.max(progress.currentDay, dayNumber + 1);
  }
  
  saveProgress(progress);
};

export const unlockMessage = (messageId: string): void => {
  const progress = getProgress();
  
  if (!progress.unlockedMessages.includes(messageId)) {
    progress.unlockedMessages.push(messageId);
    saveProgress(progress);
  }
};

export const canAccessDay = (dayNumber: number, completedDays: number[]): boolean => {
  if (dayNumber === 1) return true;
  return completedDays.includes(dayNumber - 1);
};

export const resetProgress = (): void => {
  if (typeof window === 'undefined') return;
  
  try {
    localStorage.removeItem(STORAGE_KEYS.PROGRESS);
  } catch (error) {
    console.error('Error resetting progress:', error);
  }
};
