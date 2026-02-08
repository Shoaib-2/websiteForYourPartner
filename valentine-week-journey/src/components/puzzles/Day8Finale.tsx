'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Heart, Download, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { useJourney } from '@/context/JourneyContext';
import { DAY_MESSAGES } from '@/lib/constants';
import { getDayName } from '@/lib/utils';
import { DayIcon } from '@/components/ui/DayIcon';

export default function Day8Finale({ onComplete }: { onComplete: () => void }) {
    const { progress } = useJourney();
    const [showMessages, setShowMessages] = useState(false);
    const [currentMessage, setCurrentMessage] = useState(0);
    const [finaleStarted, setFinaleStarted] = useState(false);

    useEffect(() => {
        if (finaleStarted && currentMessage < 8) {
            const timer = setTimeout(() => {
                setCurrentMessage(prev => prev + 1);
            }, 2000);
            return () => clearTimeout(timer);
        } else if (finaleStarted && currentMessage >= 8) {
            setTimeout(() => onComplete(), 1000);
        }
    }, [finaleStarted, currentMessage, onComplete]);

    const startFinale = () => {
        setFinaleStarted(true);
        setShowMessages(true);
    };

    if (!finaleStarted) {
        return (
            <div className="text-center max-w-xl mx-auto">
                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="glass-card p-8"
                >
                    <motion.div
                        animate={{
                            scale: [1, 1.1, 1],
                        }}
                        transition={{
                            duration: 2,
                            repeat: Infinity,
                            ease: "easeInOut"
                        }}
                        className="text-6xl mb-6 text-coral"
                    >
                        <Heart className="w-16 h-16 mx-auto fill-current" />
                    </motion.div>

                    <h2
                        className="text-3xl font-bold mb-4 gradient-text"
                        style={{ fontFamily: 'var(--font-display)' }}
                    >
                        Happy Valentine&apos;s Day!
                    </h2>

                    <p className="text-charcoal-light mb-6">
                        You&apos;ve completed the journey of love! Ready to see all the messages from the week?
                    </p>

                    <div className="flex items-center justify-center gap-2 text-sm text-rose-gold mb-6">
                        <Sparkles className="w-4 h-4" />
                        <span>{progress.completedDays.length} days completed</span>
                        <Sparkles className="w-4 h-4" />
                    </div>

                    <Button onClick={startFinale} size="lg">
                        <Heart className="w-5 h-5 fill-current" />
                        Reveal All Messages
                    </Button>
                </motion.div>
            </div>
        );
    }

    return (
        <div className="text-center max-w-2xl mx-auto">
            <motion.h2
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-2xl font-bold mb-8 gradient-text"
                style={{ fontFamily: 'var(--font-display)' }}
            >
                Our Week of Love ❤️
            </motion.h2>

            <div className="space-y-4">
                <AnimatePresence>
                    {Array.from({ length: Math.min(currentMessage + 1, 8) }).map((_, index) => {
                        const dayNum = index + 1;
                        return (
                            <motion.div
                                key={dayNum}
                                initial={{ opacity: 0, x: -50, scale: 0.9 }}
                                animate={{ opacity: 1, x: 0, scale: 1 }}
                                transition={{
                                    delay: index * 0.1,
                                    duration: 0.5,
                                    type: "spring"
                                }}
                                className="glass-card p-4 text-left"
                            >
                                <div className="flex items-start gap-4">
                                    <div className="text-2xl flex-shrink-0">
                                        <DayIcon day={dayNum} className="w-8 h-8 text-white mx-auto" />
                                    </div>
                                    <div>
                                        <p className="text-sm text-coral font-medium mb-1">
                                            Day {dayNum}: {getDayName(dayNum)}
                                        </p>
                                        <p
                                            className="text-charcoal"
                                            style={{ fontFamily: 'var(--font-handwritten)', fontSize: '1.1rem' }}
                                        >
                                            {DAY_MESSAGES[dayNum]}
                                        </p>
                                    </div>
                                </div>
                            </motion.div>
                        );
                    })}
                </AnimatePresence>
            </div>

            {currentMessage >= 8 && (
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mt-8"
                >
                    <div className="glass-card p-6 bg-gradient-to-br from-blush-100 to-cream">
                        <motion.div
                            animate={{
                                scale: [1, 1.2, 1],
                            }}
                            transition={{
                                duration: 1.5,
                                repeat: Infinity,
                                ease: "easeInOut"
                            }}
                            className="text-4xl mb-4 text-coral"
                        >
                            <Sparkles className="w-12 h-12 mx-auto" />
                        </motion.div>
                        <p
                            className="text-xl text-charcoal"
                            style={{ fontFamily: 'var(--font-handwritten)' }}
                        >
                            Thank you for being my forever Valentine. Here&apos;s to many more adventures together!
                        </p>
                    </div>
                </motion.div>
            )}
        </div>
    );
}
