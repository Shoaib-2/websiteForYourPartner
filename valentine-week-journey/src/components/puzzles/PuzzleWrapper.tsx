'use client';

import React, { useState, useCallback, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Confetti } from '@/components/animations/Confetti';
import { MessageReveal } from '@/components/MessageReveal';
import { useJourney } from '@/context/JourneyContext';
import { DAY_MESSAGES, PUZZLE_INSTRUCTIONS } from '@/lib/constants';
import { getDayName, getDayEmoji } from '@/lib/utils';
import { DayIcon } from '@/components/ui/DayIcon';
import { Button } from '@/components/ui/Button';
import { ArrowLeft, RotateCcw, PartyPopper } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

interface PuzzleWrapperProps {
    dayNumber: number;
    children: (props: { onComplete: () => void }) => React.ReactNode;
}

export function PuzzleWrapper({ dayNumber, children }: PuzzleWrapperProps) {
    const [isCompleted, setIsCompleted] = useState(false);
    const [showConfetti, setShowConfetti] = useState(false);
    const { completeDay, unlockMessage, isDayCompleted, canAccess, isLoading } = useJourney();
    const router = useRouter();

    const handleComplete = useCallback(() => {
        if (isCompleted) return;

        setIsCompleted(true);
        setShowConfetti(true);
        completeDay(dayNumber);
        unlockMessage(`day${dayNumber}`);

        setTimeout(() => setShowConfetti(false), 3000);
    }, [dayNumber, completeDay, unlockMessage, isCompleted]);

    const alreadyCompleted = isDayCompleted(dayNumber);
    const canEnter = alreadyCompleted || canAccess(dayNumber);

    useEffect(() => {
        if (isLoading) return;
        if (!canEnter) {
            router.replace('/journey');
        }
    }, [isLoading, canEnter, router]);

    if (!isLoading && !canEnter) {
        return (
            <div className="min-h-screen px-3 sm:px-4 pb-4 sm:pb-8 pt-32 sm:pt-24 md:pt-28 flex items-center justify-center">
                <div className="glass-card p-6 text-center">
                    <p className="text-charcoal-light">Redirecting to your journey...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen px-3 sm:px-4 pb-4 sm:pb-8 pt-32 sm:pt-24 md:pt-28">
            <Confetti isActive={showConfetti} />

            {/* Header */}
            <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                className="max-w-2xl mx-auto mb-4 sm:mb-8"
            >
                <Link href="/journey" className="inline-block">
                    <Button variant="ghost" size="sm" className="mb-4 min-w-[44px] min-h-[44px]">
                        <ArrowLeft className="w-4 h-4" />
                        <span className="hidden sm:inline ml-2">Back to Journey</span>
                    </Button>
                </Link>

                <div className="text-center">
                    <motion.span
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        className="text-3xl sm:text-5xl mb-2 sm:mb-4 block"
                    >
                        <DayIcon day={dayNumber} className="w-12 h-12 sm:w-16 sm:h-16 text-coral mx-auto" />
                    </motion.span>
                    <h1 className="text-xl sm:text-3xl md:text-4xl font-bold text-charcoal mb-1 sm:mb-2" style={{ fontFamily: 'var(--font-display)' }}>
                        Day {dayNumber}: {getDayName(dayNumber)}
                    </h1>
                    <p className="text-sm sm:text-base text-charcoal-light">
                        {PUZZLE_INSTRUCTIONS[dayNumber]}
                    </p>
                </div>
            </motion.div>

            {/* Puzzle Content */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="max-w-3xl mx-auto"
            >
                {(isCompleted || alreadyCompleted) ? (
                    <div className="text-center">
                        <motion.div
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            className="inline-block p-6 bg-green-100 rounded-full mb-6"
                        >
                            <PartyPopper className="w-12 h-12 text-green-600" />
                        </motion.div>
                        <h2 className="text-2xl font-bold text-green-600 mb-4">
                            Puzzle Complete!
                        </h2>

                        <MessageReveal
                            message={DAY_MESSAGES[dayNumber]}
                            isUnlocked={true}
                            dayNumber={dayNumber}
                        />

                        <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center">
                            <Link href="/journey" className="inline-block">
                                <Button variant="primary">
                                    Continue Journey
                                </Button>
                            </Link>
                            {isCompleted && (
                                <Button
                                    variant="secondary"
                                    onClick={() => setIsCompleted(false)}
                                >
                                    <RotateCcw className="w-4 h-4" />
                                    Play Again
                                </Button>
                            )}
                        </div>
                    </div>
                ) : (
                    children({ onComplete: handleComplete })
                )}
            </motion.div>
        </div>
    );
}
