'use client';

import React, { use, useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Heart, Lock } from 'lucide-react';
import { PuzzleWrapper } from '@/components/puzzles/PuzzleWrapper';
import { useJourney } from '@/context/JourneyContext';
import { Button } from '@/components/ui/Button';
import Link from 'next/link';
import dynamic from 'next/dynamic';

// Dynamic imports for puzzle components
const Day1Puzzle = dynamic(() => import('@/components/puzzles/Day1Puzzle'), { ssr: false });
const Day2Puzzle = dynamic(() => import('@/components/puzzles/Day2Puzzle'), { ssr: false });
const Day3Puzzle = dynamic(() => import('@/components/puzzles/Day3Puzzle'), { ssr: false });
const Day4Puzzle = dynamic(() => import('@/components/puzzles/Day4Puzzle'), { ssr: false });
const Day5Puzzle = dynamic(() => import('@/components/puzzles/Day5Puzzle'), { ssr: false });
const Day6Puzzle = dynamic(() => import('@/components/puzzles/Day6Puzzle'), { ssr: false });
const Day7Puzzle = dynamic(() => import('@/components/puzzles/Day7Puzzle'), { ssr: false });
const Day8Finale = dynamic(() => import('@/components/puzzles/Day8Finale'), { ssr: false });

const puzzleComponents: Record<number, React.ComponentType<{ onComplete: () => void }>> = {
    1: Day1Puzzle,
    2: Day2Puzzle,
    3: Day3Puzzle,
    4: Day4Puzzle,
    5: Day5Puzzle,
    6: Day6Puzzle,
    7: Day7Puzzle,
    8: Day8Finale
};

interface DayPageProps {
    params: Promise<{ number: string }>;
}

export default function DayPage({ params }: DayPageProps) {
    const { number } = use(params);
    const dayNumber = parseInt(number, 10);
    const { canAccess, isLoading } = useJourney();
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    // Validate day number
    if (isNaN(dayNumber) || dayNumber < 1 || dayNumber > 8) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-center">
                    <h1 className="text-2xl font-bold mb-4" style={{ color: '#4A4A4A' }}>Day not found</h1>
                    <Link href="/journey">
                        <Button>Back to Journey</Button>
                    </Link>
                </div>
            </div>
        );
    }

    if (!mounted || isLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                >
                    <Heart className="w-12 h-12" style={{ color: '#FF6B6B' }} />
                </motion.div>
            </div>
        );
    }

    // Check access
    if (!canAccess(dayNumber)) {
        return (
            <div className="min-h-screen flex items-center justify-center px-4">
                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="text-center glass-card p-8 max-w-md"
                >
                    <div className="w-20 h-20 mx-auto mb-6 rounded-full flex items-center justify-center" style={{ backgroundColor: '#f3f4f6' }}>
                        <Lock className="w-10 h-10" style={{ color: '#9ca3af' }} />
                    </div>
                    <h1 className="text-2xl font-bold mb-2" style={{ fontFamily: 'var(--font-display)', color: '#4A4A4A' }}>
                        This Day is Locked
                    </h1>
                    <p className="mb-6" style={{ color: '#6B6B6B' }}>
                        Complete Day {dayNumber - 1} first to unlock this puzzle!
                    </p>
                    <Link href="/journey">
                        <Button>
                            Back to Journey
                        </Button>
                    </Link>
                </motion.div>
            </div>
        );
    }

    const PuzzleComponent = puzzleComponents[dayNumber];

return (
        <PuzzleWrapper dayNumber={dayNumber}>
            {({ onComplete }) => <PuzzleComponent onComplete={onComplete} />}
        </PuzzleWrapper>
    );
}


