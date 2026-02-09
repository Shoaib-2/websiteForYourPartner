'use client';

import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import {
    getProgress,
    markDayComplete,
    unlockMessage as unlockMessageStorage,
    canAccessDay,
    type ProgressData
} from '@/lib/storage';
import { getCurrentDayTheme, type DayThemeInfo } from '@/lib/theme';

interface JourneyContextType {
    progress: ProgressData;
    isLoading: boolean;
    completeDay: (dayNumber: number) => void;
    unlockMessage: (messageId: string) => void;
    canAccess: (dayNumber: number) => boolean;
    isDayCompleted: (dayNumber: number) => boolean;
    refreshProgress: () => void;
    getCurrentTheme: () => DayThemeInfo;
}

const JourneyContext = createContext<JourneyContextType | undefined>(undefined);

export function JourneyProvider({ children }: { children: React.ReactNode }) {
    const [progress, setProgress] = useState<ProgressData>({
        version: '1.0',
        currentDay: 1,
        completedDays: [],
        puzzleProgress: {},
        unlockedMessages: [],
        startDate: new Date().toISOString(),
        lastVisit: new Date().toISOString()
    });
    const [isLoading, setIsLoading] = useState(true);
    const [serverUnlockedDay, setServerUnlockedDay] = useState<number | null>(null);

    const syncUnlockedCookie = useCallback(async (completedDay: number) => {
        try {
            const response = await fetch('/api/progress', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ dayCompleted: completedDay })
            });

            if (!response.ok) {
                return;
            }

            const data = await response.json() as { unlocked?: number };
            if (typeof data.unlocked === 'number') {
                setServerUnlockedDay(Math.max(1, Math.min(8, Math.floor(data.unlocked))));
            }
        } catch (error) {
            console.error('Error syncing progress cookie:', error);
        }
    }, []);

    const fetchServerProgress = useCallback(async () => {
        try {
            const response = await fetch('/api/progress', { method: 'GET', cache: 'no-store' });
            if (!response.ok) {
                return;
            }
            const data = await response.json() as { unlocked?: number };
            if (typeof data.unlocked === 'number') {
                setServerUnlockedDay(Math.max(1, Math.min(8, Math.floor(data.unlocked))));
            }
        } catch (error) {
            console.error('Error fetching server progress:', error);
        }
    }, []);

    useEffect(() => {
        const loadProgress = () => {
            const savedProgress = getProgress();
            setProgress(savedProgress);
            setIsLoading(false);
        };

        loadProgress();
        void fetchServerProgress();
    }, [fetchServerProgress]);

    const refreshProgress = useCallback(() => {
        const savedProgress = getProgress();
        setProgress(savedProgress);
    }, []);

    const completeDay = useCallback((dayNumber: number) => {
        markDayComplete(dayNumber);
        refreshProgress();
        void syncUnlockedCookie(dayNumber);
    }, [refreshProgress, syncUnlockedCookie]);

    const unlockMessage = useCallback((messageId: string) => {
        unlockMessageStorage(messageId);
        refreshProgress();
    }, [refreshProgress]);

    const canAccess = useCallback((dayNumber: number) => {
        const localAllowed = canAccessDay(dayNumber, progress.completedDays);
        const serverAllowed = serverUnlockedDay === null ? true : dayNumber <= serverUnlockedDay;
        return localAllowed && serverAllowed;
    }, [progress.completedDays, serverUnlockedDay]);

    const isDayCompleted = useCallback((dayNumber: number) => {
        return progress.completedDays.includes(dayNumber);
    }, [progress.completedDays]);

    const getCurrentTheme = useCallback(() => {
        return getCurrentDayTheme();
    }, []);

    return (
        <JourneyContext.Provider
            value={{
                progress,
                isLoading,
                completeDay,
                unlockMessage,
                canAccess,
                isDayCompleted,
                refreshProgress,
                getCurrentTheme
            }}
        >
            {children}
        </JourneyContext.Provider>
    );
}

export function useJourney() {
    const context = useContext(JourneyContext);
    if (context === undefined) {
        throw new Error('useJourney must be used within a JourneyProvider');
    }
    return context;
}
