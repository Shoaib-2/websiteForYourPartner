'use client';

import React, { useState } from 'react';
import { motion, Reorder } from 'framer-motion';
import { Button } from '@/components/ui/Button';
import { ROSE_PATTERN } from '@/lib/constants';
import { shuffleArray } from '@/lib/utils';

interface RoseItem {
    id: number;
    color: string;
    position: number;
}

const roseColors: Record<string, string> = {
    red: '#DC143C',
    pink: '#FF69B4',
    white: '#FFF0F5'
};

export default function Day1Puzzle({ onComplete }: { onComplete: () => void }) {
    const [roses, setRoses] = useState<RoseItem[]>(() =>
        shuffleArray([...ROSE_PATTERN])
    );
    const [isChecking, setIsChecking] = useState(false);
    const [error, setError] = useState('');

    const checkPattern = () => {
        setIsChecking(true);
        setError('');

        // Check if roses are in correct order by position
        const isCorrect = roses.every((rose, index) => rose.position === index);

        setTimeout(() => {
            if (isCorrect) {
                onComplete();
            } else {
                setError('Not quite right! Try arranging the roses in a different pattern.');
                setIsChecking(false);
            }
        }, 500);
    };

    return (
        <div className="text-center">
            <div className="glass-card p-6 mb-6">
                <p className="text-charcoal-light mb-4">
                    Arrange the roses in the correct pattern: 🌹 Red - Pink - Red - White - Red 🌹
                </p>
                <p className="text-sm text-rose-gold">
                    Drag and drop the roses to reorder them
                </p>
            </div>

            <Reorder.Group
                axis="x"
                values={roses}
                onReorder={setRoses}
                className="mx-auto flex w-full max-w-lg items-center justify-start gap-4 overflow-x-auto px-2 py-8"
                style={{ touchAction: 'pan-y', WebkitOverflowScrolling: 'touch' }}
            >
                {roses.map((rose) => (
                    <Reorder.Item
                        key={rose.id}
                        value={rose}
                        className="flex-shrink-0 cursor-grab active:cursor-grabbing touch-manipulation"
                    >
                        <motion.div
                            whileHover={{ scale: 1.1, rotate: 5 }}
                            whileTap={{ scale: 0.95 }}
                            className="w-20 h-20 md:w-24 md:h-24 rounded-2xl flex items-center justify-center shadow-lg select-none"
                            style={{
                                backgroundColor: roseColors[rose.color],
                                boxShadow: `0 8px 30px ${roseColors[rose.color]}40`
                            }}
                        >
                            <span className="text-3xl md:text-4xl select-none">🌹</span>
                        </motion.div>
                    </Reorder.Item>
                ))}
            </Reorder.Group>

            {error && (
                <motion.p
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-red-500 mb-4"
                >
                    {error}
                </motion.p>
            )}

            <Button
                onClick={checkPattern}
                isLoading={isChecking}
                size="lg"
            >
                Check Pattern
            </Button>
        </div>
    );
}
