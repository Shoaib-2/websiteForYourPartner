'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface HiddenHeart {
    id: number;
    x: number;
    y: number;
    found: boolean;
    size: number;
}

export default function Day4Puzzle({ onComplete }: { onComplete: () => void }) {
    const [hearts, setHearts] = useState<HiddenHeart[]>([]);
    const [foundCount, setFoundCount] = useState(0);
    const totalHearts = 8;

    useEffect(() => {
        // Generate random positions for hearts
        const generatedHearts: HiddenHeart[] = [];
        for (let i = 0; i < totalHearts; i++) {
            generatedHearts.push({
                id: i,
                x: 10 + Math.random() * 80, // percentage
                y: 10 + Math.random() * 80,
                found: false,
                size: Math.random() * 10 + 20 // 20-30px
            });
        }
        setHearts(generatedHearts);
    }, []);

    const handleHeartClick = useCallback((heartId: number) => {
        setHearts(prev => prev.map(h =>
            h.id === heartId ? { ...h, found: true } : h
        ));

        const newCount = foundCount + 1;
        setFoundCount(newCount);

        if (newCount >= totalHearts) {
            setTimeout(() => onComplete(), 500);
        }
    }, [foundCount, onComplete]);

    return (
        <div className="text-center">
            <div className="glass-card p-4 mb-6 inline-block">
                <p className="text-sm text-charcoal-light mb-1">Hearts Found</p>
                <p className="text-2xl font-bold text-coral">{foundCount} / {totalHearts}</p>
            </div>

            <div className="glass-card p-4 mb-4">
                <p className="text-charcoal-light text-sm">
                    🧸 The teddy bear has hidden hearts all over! Click on them to find them all!
                </p>
            </div>

            <div
                className="relative w-full aspect-video mx-auto rounded-2xl overflow-hidden"
                style={{
                    background: 'linear-gradient(135deg, #FFF5F7 0%, #FFE5E5 50%, #FFF9F0 100%)',
                    maxWidth: '600px'
                }}
            >
                {/* Background decorations */}
                <div className="absolute inset-0 opacity-20">
                    <div className="absolute top-10 left-10 text-6xl">🧸</div>
                    <div className="absolute bottom-10 right-10 text-4xl">🎀</div>
                    <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-8xl opacity-10">
                        🧸
                    </div>
                </div>

                {/* Hidden Hearts */}
                <AnimatePresence>
                    {hearts.map((heart) => (
                        <motion.button
                            key={heart.id}
                            initial={{ opacity: 0.3, scale: 0.8 }}
                            animate={{
                                opacity: heart.found ? 1 : 0.4,
                                scale: heart.found ? 1.2 : 1
                            }}
                            exit={{ scale: 1.5, opacity: 0 }}
                            whileHover={{ opacity: 1, scale: 1.1 }}
                            onClick={() => !heart.found && handleHeartClick(heart.id)}
                            className={`absolute transition-all cursor-pointer touch-manipulation select-none ${heart.found ? 'pointer-events-none' : ''
                                }`}
                            style={{
                                left: `${heart.x}%`,
                                top: `${heart.y}%`,
                                fontSize: heart.size,
                                transform: 'translate(-50%, -50%)'
                            }}
                            aria-label={`Heart ${heart.id + 1}`}
                        >
                            <motion.span
                                animate={heart.found ? {
                                    scale: [1, 1.3, 1],
                                } : {}}
                                transition={{ duration: 0.3 }}
                            >
                                {heart.found ? '❤️' : '💗'}
                            </motion.span>
                        </motion.button>
                    ))}
                </AnimatePresence>

                {/* Hint text */}
                {foundCount === 0 && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="absolute bottom-4 left-1/2 transform -translate-x-1/2 bg-white/80 px-4 py-2 rounded-full text-sm text-charcoal-light"
                    >
                        Look carefully for the hidden hearts! 👀
                    </motion.div>
                )}
            </div>
        </div>
    );
}
