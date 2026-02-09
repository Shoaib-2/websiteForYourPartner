'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/Button';
import { CIPHER_MESSAGE } from '@/lib/constants';
import { MailOpen } from 'lucide-react';

export default function Day2Puzzle({ onComplete }: { onComplete: () => void }) {
    const [guess, setGuess] = useState('');
    const [isChecking, setIsChecking] = useState(false);
    const [error, setError] = useState('');
    const [hint, setHint] = useState(false);

    const checkAnswer = () => {
        setIsChecking(true);
        setError('');

        const normalized = guess.toLowerCase().trim();
        const answer = CIPHER_MESSAGE.original.toLowerCase();

        setTimeout(() => {
            if (normalized === answer) {
                onComplete();
            } else {
                setError('That\'s not quite right. Try again!');
                setIsChecking(false);
            }
        }, 500);
    };

    return (
        <div className="text-center max-w-xl mx-auto w-full">
            <div className="glass-card w-full p-5 sm:p-6 mb-6">
                <p className="text-charcoal-light mb-4">
                    I&apos;ve encoded a special message just for you!
                    Each letter has been shifted by {CIPHER_MESSAGE.shift} positions in the alphabet.
                </p>
                <p className="text-sm text-rose-gold mb-2">
                    Hint: A becomes D, B becomes E, and so on...
                </p>
            </div>

            <div className="glass-card w-full p-6 sm:p-8 mb-6">
                <p className="text-xs uppercase tracking-wide text-charcoal-light mb-2">
                    Encrypted Message
                </p>
                <p
                    className="text-2xl md:text-3xl font-bold text-coral"
                    style={{ fontFamily: 'var(--font-display)', letterSpacing: '2px' }}
                >
                    {CIPHER_MESSAGE.encrypted}
                </p>
            </div>

            {hint && (
                <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    className="glass-card w-full p-4 mb-6 bg-blush-100"
                >
                    <p className="text-sm text-charcoal-light">
                        💡 The message starts with &quot;I&quot; and is about my feelings for you!
                    </p>
                </motion.div>
            )}

            <div className="mb-6">
                <input
                    type="text"
                    value={guess}
                    onChange={(e) => setGuess(e.target.value)}
                    placeholder="Type the decoded message..."
                    className="w-full px-6 py-4 rounded-xl border-2 border-blush-200 focus:border-coral focus:outline-none text-center text-lg transition-colors touch-manipulation"
                    onKeyDown={(e) => e.key === 'Enter' && checkAnswer()}
                />
            </div>

            {error && (
                <motion.p
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-red-500 mb-4"
                >
                    {error}
                </motion.p>
            )}

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button
                    onClick={checkAnswer}
                    isLoading={isChecking}
                    size="lg"
                >
                    Decode Message <MailOpen className="ml-2 w-4 h-4 inline" />
                </Button>
                {!hint && (
                    <Button
                        variant="secondary"
                        onClick={() => setHint(true)}
                    >
                        Need a Hint?
                    </Button>
                )}
            </div>
        </div>
    );
}
