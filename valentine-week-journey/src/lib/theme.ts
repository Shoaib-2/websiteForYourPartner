import { DAY_THEMES } from './constants';

/**
 * Theme information for a specific day with enhanced properties
 */
export interface DayThemeInfo {
    dayNumber: number;
    primary: string;
    secondary: string;
    accent: string;
    /** Is today's actual date this day (Feb 7-14)? */
    isSpecialDay: boolean;
    /** Days 7-8 get extra visual effects */
    hasEnhancedEffects: boolean;
}

/**
 * Valentine color palette matching the landing page Tailwind config
 */
export const VALENTINE_COLORS = {
    coral: '#FF6B6B',
    coralDark: '#FF4757',
    roseGold: '#B76E79',
    blush100: '#FFF5F7',
    blush200: '#FFE5E5',
    blush300: '#FFB3C1',
    blush400: '#FF8FA3',
    lavender: '#D4A5A5',
    cream: '#FFF9F0',
    softWhite: '#FFFAFA',
} as const;

/**
 * Get theme info for a specific day number (1-8)
 */
export function getDayTheme(dayNumber: number): DayThemeInfo {
    const clampedDay = Math.max(1, Math.min(8, dayNumber));
    const theme = DAY_THEMES[clampedDay] || DAY_THEMES[1];
    
    // Check if today matches this Valentine week day (Feb 7-14)
    const today = new Date();
    const month = today.getMonth() + 1; // 0-indexed
    const date = today.getDate();
    const valentineDayNumber = month === 2 && date >= 7 && date <= 14 ? date - 6 : 0;
    
    return {
        dayNumber: clampedDay,
        primary: theme.primary,
        secondary: theme.secondary,
        accent: theme.accent,
        isSpecialDay: valentineDayNumber === clampedDay,
        hasEnhancedEffects: clampedDay >= 7,
    };
}

/**
 * Get theme for the current Valentine week day based on today's date
 */
export function getCurrentDayTheme(): DayThemeInfo {
    const today = new Date();
    const month = today.getMonth() + 1;
    const date = today.getDate();
    
    // Map Feb 7-14 to days 1-8
    if (month === 2 && date >= 7 && date <= 14) {
        return getDayTheme(date - 6);
    }
    
    // Default to day 1 if outside Valentine week
    return getDayTheme(1);
}
