'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/Button';
import { PROMISE_STORY } from '@/lib/constants';

export default function Day5Puzzle({ onComplete }: { onComplete: () => void }) {
    const [answers, setAnswers] = useState<Record<string, string>>({});
    const [error, setError] = useState('');
    const [isChecking, setIsChecking] = useState(false);

    const handleInputChange = (blankId: string, value: string) => {
        setAnswers(prev => ({ ...prev, [blankId]: value }));
        setError('');
    };

    const checkAnswers = () => {
        setIsChecking(true);
        setError('');

        const allCorrect = PROMISE_STORY.blanks.every(blank =>
            answers[blank.id]?.toLowerCase().trim() === blank.answer.toLowerCase()
        );

        setTimeout(() => {
            if (allCorrect) {
                onComplete();
            } else {
                setError('Not quite right! Some words don\'t fit. Try again!');
                setIsChecking(false);
            }
        }, 500);
    };

    const allFilled = PROMISE_STORY.blanks.every(blank =>
        answers[blank.id]?.trim()
    );

    // Render the template with input fields
    const renderStory = () => {
        const parts = PROMISE_STORY.template.split(/(\{\{blank\d+\}\})/);

        return parts.map((part, index) => {
            const blankMatch = part.match(/\{\{(blank\d+)\}\}/);

            if (blankMatch) {
                const blankId = blankMatch[1];
                const blank = PROMISE_STORY.blanks.find(b => b.id === blankId);

                return (
                    <span key={index} className="inline-block mx-1">
                        <input
                            type="text"
                            value={answers[blankId] || ''}
                            onChange={(e) => handleInputChange(blankId, e.target.value)}
                            placeholder={blank?.hint}
                            className="w-20 sm:w-24 md:w-32 px-3 py-1 border-b-2 border-coral bg-transparent text-center focus:outline-none focus:border-rose-gold text-coral font-semibold text-base sm:text-lg touch-manipulation"
                        />
                    </span>
                );
            }

            return <span key={index}>{part}</span>;
        });
    };

    return (
        <div className="text-center max-w-2xl mx-auto w-full">
            <div className="glass-card w-full p-5 sm:p-6 mb-6">
                <p className="text-charcoal-light">
                    Fill in the blanks to complete this promise. The hints below each blank will help you!
                </p>
            </div>

            <div className="glass-card w-full p-6 sm:p-8 mb-6">
                <p
                    className="text-xl md:text-2xl leading-relaxed text-charcoal"
                    style={{ fontFamily: 'var(--font-handwritten)' }}
                >
                    {renderStory()}
                </p>
            </div>

            {/* Hints */}
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3 }}
                className="mb-6 space-y-2"
            >
                <p className="text-sm text-charcoal-light font-medium">Hints:</p>
                <div className="flex flex-wrap justify-center gap-3">
                    {PROMISE_STORY.blanks.map((blank, index) => (
                        <span
                            key={blank.id}
                            className="text-xs bg-blush-100 text-rose-gold px-3 py-1 rounded-full"
                        >
                            {index + 1}. {blank.hint}
                        </span>
                    ))}
                </div>
            </motion.div>

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
                onClick={checkAnswers}
                isLoading={isChecking}
                disabled={!allFilled}
                size="lg"
            >
                Complete Promise 🤞
            </Button>
        </div>
    );
}
