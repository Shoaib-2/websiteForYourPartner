'use client';

import React, { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Heart, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { useJourney } from '@/context/JourneyContext';
import { DAY_MESSAGES } from '@/lib/constants';
import { getDayName } from '@/lib/utils';
import { DayIcon } from '@/components/ui/DayIcon';

interface RibbonPoint {
    x: number;
    y: number;
}

const TOTAL_MESSAGES = 8;
const ROAD_VIEWPORT_WIDTH = 1200;
const ROAD_VIEWBOX_HEIGHT = 900;
const ROAD_LEFT_PADDING = 220;
const ROAD_STEP = 250;
const ROAD_EDGE_PADDING = 120;
const ROAD_PRIMARY_AMPLITUDE = 300;
const ROAD_SECONDARY_AMPLITUDE = 130;

const clamp = (value: number, min: number, max: number) => Math.min(Math.max(value, min), max);

const buildRibbonPath = (points: RibbonPoint[]) => {
    if (points.length < 2) return '';

    let d = `M ${points[0].x} ${points[0].y}`;
    for (let i = 0; i < points.length - 1; i++) {
        const start = points[i];
        const end = points[i + 1];
        const midX = (start.x + end.x) / 2;
        d += ` C ${midX} ${start.y} ${midX} ${end.y} ${end.x} ${end.y}`;
    }
    return d;
};

export default function Day8Finale({ onComplete }: { onComplete: () => void }) {
    const { progress } = useJourney();
    const [currentMessage, setCurrentMessage] = useState(0);
    const [finaleStarted, setFinaleStarted] = useState(false);
    const completeTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

    const activeIndex = Math.min(currentMessage, TOTAL_MESSAGES - 1);
    const revealedCount = Math.min(currentMessage + 1, TOTAL_MESSAGES);
    const ribbonProgress = revealedCount / TOTAL_MESSAGES;
    const roadWidth = ROAD_LEFT_PADDING + (TOTAL_MESSAGES - 1) * ROAD_STEP + 520;

    const anchorPoints: RibbonPoint[] = Array.from({ length: TOTAL_MESSAGES }, (_, index) => {
        const x = ROAD_LEFT_PADDING + index * ROAD_STEP;
        const yWavePrimary = Math.sin((index + 0.6) * 1.2) * ROAD_PRIMARY_AMPLITUDE;
        const yWaveSecondary = Math.sin((index + 0.3) * 2.15) * ROAD_SECONDARY_AMPLITUDE;
        const y = clamp(
            ROAD_VIEWBOX_HEIGHT / 2 + yWavePrimary + yWaveSecondary,
            ROAD_EDGE_PADDING,
            ROAD_VIEWBOX_HEIGHT - ROAD_EDGE_PADDING
        );
        return { x, y };
    });

    const ribbonPath = buildRibbonPath([
        { x: ROAD_LEFT_PADDING - 140, y: anchorPoints[0].y },
        ...anchorPoints,
        { x: roadWidth - 90, y: anchorPoints[anchorPoints.length - 1].y }
    ]);

    const currentAnchor = anchorPoints[activeIndex];
    const cameraOffsetX = clamp(
        currentAnchor.x - ROAD_VIEWPORT_WIDTH * 0.42,
        0,
        Math.max(0, roadWidth - ROAD_VIEWPORT_WIDTH)
    );

    useEffect(() => {
        if (!finaleStarted) return;

        if (currentMessage < TOTAL_MESSAGES) {
            const timer = setTimeout(() => {
                setCurrentMessage(prev => prev + 1);
            }, 2000);
            return () => clearTimeout(timer);
        }

        if (currentMessage >= TOTAL_MESSAGES && !completeTimeoutRef.current) {
            completeTimeoutRef.current = setTimeout(() => onComplete(), 5000);
        }
    }, [finaleStarted, currentMessage, onComplete]);

    useEffect(() => {
        return () => {
            if (completeTimeoutRef.current) {
                clearTimeout(completeTimeoutRef.current);
            }
        };
    }, []);

    const startFinale = () => {
        setCurrentMessage(0);
        if (completeTimeoutRef.current) {
            clearTimeout(completeTimeoutRef.current);
            completeTimeoutRef.current = null;
        }
        setFinaleStarted(true);
    };

    if (!finaleStarted) {
        return (
            <div className="text-center max-w-xl mx-auto w-full">
                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="glass-card w-full p-4 sm:p-8"
                >
                    <motion.div
                        animate={{ scale: [1, 1.1, 1] }}
                        transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
                        className="text-5xl sm:text-6xl mb-4 sm:mb-6 text-coral"
                    >
                        <Heart className="w-12 h-12 sm:w-16 sm:h-16 mx-auto fill-current" />
                    </motion.div>

                    <h2
                        className="text-2xl sm:text-3xl font-bold mb-3 sm:mb-4 gradient-text"
                        style={{ fontFamily: 'var(--font-display)' }}
                    >
                        Happy Valentine&apos;s Day!
                    </h2>

                    <p className="text-sm sm:text-base text-charcoal-light mb-5 sm:mb-6">
                        You&apos;ve completed the journey of love! Ready to see all the messages from the week?
                    </p>

                    <div className="flex items-center justify-center gap-2 text-sm text-rose-gold mb-6">
                        <Sparkles className="w-4 h-4" />
                        <span>{progress.completedDays.length} days completed</span>
                        <Sparkles className="w-4 h-4" />
                    </div>

                    <Button
                        onClick={startFinale}
                        size="md"
                        className="w-full max-w-[250px] sm:max-w-none sm:w-auto mx-auto px-4 sm:px-6 text-sm sm:text-base"
                    >
                        <Heart className="w-5 h-5 fill-current" />
                        Reveal All Messages
                    </Button>
                </motion.div>
            </div>
        );
    }

    return (
        <div className="w-full max-w-4xl mx-auto">
            <motion.h2
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-xl sm:text-2xl font-bold mb-4 sm:mb-6 text-center gradient-text"
                style={{ fontFamily: 'var(--font-display)' }}
            >
                Our Week of Love
            </motion.h2>

            <div className="relative h-[62vh] min-h-[360px] max-h-[680px] sm:h-[70vh] sm:min-h-[520px] sm:max-h-[760px] overflow-hidden rounded-[1.5rem] sm:rounded-[2rem] border border-white/40 bg-gradient-to-b from-cream/90 via-blush-100/80 to-white/80">
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(255,143,163,0.25),transparent_45%),radial-gradient(circle_at_80%_80%,rgba(255,107,107,0.2),transparent_50%)]" />

                <motion.svg
                    className="absolute inset-y-0 left-0"
                    style={{ width: roadWidth, height: '100%' }}
                    viewBox={`0 0 ${roadWidth} ${ROAD_VIEWBOX_HEIGHT}`}
                    preserveAspectRatio="none"
                    animate={{ x: -cameraOffsetX }}
                    transition={{ duration: 1, ease: 'easeInOut' }}
                    aria-hidden="true"
                >
                    <defs>
                        <linearGradient id="roadBase" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="0%" stopColor="#FDE1E7" />
                            <stop offset="100%" stopColor="#F8CDD6" />
                        </linearGradient>
                        <linearGradient id="roadActive" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="0%" stopColor="#FF6B6B" />
                            <stop offset="45%" stopColor="#FF8FA3" />
                            <stop offset="100%" stopColor="#FFE5E5" />
                        </linearGradient>
                    </defs>

                    <path
                        d={ribbonPath}
                        stroke="url(#roadBase)"
                        strokeWidth="24"
                        fill="none"
                        strokeLinecap="round"
                    />
                    <motion.path
                        d={ribbonPath}
                        stroke="url(#roadActive)"
                        strokeWidth="18"
                        fill="none"
                        strokeLinecap="round"
                        initial={{ pathLength: 0 }}
                        animate={{ pathLength: ribbonProgress }}
                        transition={{ duration: 0.8, ease: 'easeOut' }}
                    />
                    <motion.path
                        d={ribbonPath}
                        stroke="rgba(255,255,255,0.75)"
                        strokeWidth="4"
                        fill="none"
                        strokeLinecap="round"
                        strokeDasharray="14 14"
                        initial={{ pathLength: 0, strokeDashoffset: 0 }}
                        animate={{ pathLength: ribbonProgress, strokeDashoffset: [0, -70] }}
                        transition={{
                            pathLength: { duration: 0.8, ease: 'easeOut' },
                            strokeDashoffset: { duration: 2.8, repeat: Infinity, ease: 'linear' }
                        }}
                    />

                    {anchorPoints.map((point, index) => (
                        <circle
                            key={index}
                            cx={point.x}
                            cy={point.y}
                            r="9"
                            fill={index <= activeIndex ? '#FF8FA3' : '#FFE5E5'}
                            stroke="#FFFFFF"
                            strokeWidth="3"
                        />
                    ))}

                    <motion.circle
                        cx={currentAnchor.x}
                        cy={currentAnchor.y}
                        r="13"
                        fill="#FF6B6B"
                        stroke="#FFFFFF"
                        strokeWidth="4"
                        animate={{ cx: currentAnchor.x, cy: currentAnchor.y }}
                        transition={{ duration: 0.8, ease: 'easeInOut' }}
                    />
                </motion.svg>

                <div className="absolute inset-0 flex items-center justify-center px-4 sm:px-8">
                    <AnimatePresence mode="wait">
                        <motion.div
                            key={activeIndex}
                            initial={{ opacity: 0, x: 90, scale: 0.94 }}
                            animate={{ opacity: 1, x: 0, scale: 1 }}
                            exit={{ opacity: 0, x: -90, scale: 0.96 }}
                            transition={{ duration: 0.55, ease: 'easeOut' }}
                            className="glass-card w-full max-w-2xl p-4 sm:p-7 text-left shadow-2xl"
                        >
                            <div className="flex items-start gap-3 sm:gap-4">
                                <DayIcon day={activeIndex + 1} className="w-8 h-8 sm:w-10 sm:h-10 text-white flex-shrink-0" />
                                <div>
                                    <p className="text-sm text-coral font-medium mb-1">
                                        Day {activeIndex + 1}: {getDayName(activeIndex + 1)}
                                    </p>
                                    <p
                                        className="text-charcoal text-base sm:text-xl"
                                        style={{ fontFamily: 'var(--font-handwritten)' }}
                                    >
                                        {DAY_MESSAGES[activeIndex + 1]}
                                    </p>
                                </div>
                            </div>
                        </motion.div>
                    </AnimatePresence>
                </div>

                <div className="absolute bottom-3 sm:bottom-4 left-1/2 -translate-x-1/2 px-3 sm:px-4 py-1.5 rounded-full bg-white/70 text-rose-gold text-[11px] sm:text-sm font-medium whitespace-nowrap">
                    {Math.min(revealedCount, TOTAL_MESSAGES)} of {TOTAL_MESSAGES} messages revealed
                </div>
            </div>

            {currentMessage >= TOTAL_MESSAGES && (
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mt-8"
                >
                    <div className="glass-card w-full p-5 sm:p-6 bg-gradient-to-br from-blush-100 to-cream text-center">
                        <motion.div
                            animate={{ scale: [1, 1.16, 1] }}
                            transition={{ duration: 1.8, repeat: Infinity, ease: 'easeInOut' }}
                            className="text-coral mb-4"
                        >
                            <Heart className="w-12 h-12 mx-auto fill-current" />
                        </motion.div>
                        <p
                            className="text-lg sm:text-xl text-charcoal"
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
