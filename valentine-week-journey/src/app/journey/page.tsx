'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { ArrowLeft, Home, List, Car, Heart } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Timeline } from '@/components/ui/Timeline';
import { useJourney } from '@/context/JourneyContext';
import dynamic from 'next/dynamic';

// Dynamic import for 3D scene
const RoadScene = dynamic(
    () => import('@/components/journey3d/RoadScene').then(mod => ({ default: mod.RoadScene })),
    {
        ssr: false,
        loading: () => (
            <div className="w-full h-full flex items-center justify-center bg-gradient-to-b from-sky-100 to-green-100">
                <div className="text-center">
                    <motion.div
                        animate={{ x: [-20, 20, -20] }}
                        transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
                        className="text-6xl"
                    >
                        <Car size={64} className="text-primary" />
                    </motion.div>
                    <p className="mt-4 text-charcoal-light">Loading 3D journey...</p>
                </div>
            </div>
        )
    }
);

export default function JourneyPage() {
    const [mounted, setMounted] = useState(false);
    const [showTimeline, setShowTimeline] = useState(false);
    const { progress, isLoading } = useJourney();

    useEffect(() => {
        setMounted(true);
    }, []);

    if (!mounted || isLoading) {
        return (
            <div className="h-screen flex items-center justify-center bg-gradient-to-b from-sky-100 to-green-100">
                <motion.div
                    animate={{ x: [-20, 20, -20] }}
                    transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
                    className="text-6xl"
                >
                    <Car size={64} className="text-primary" />
                </motion.div>
            </div>
        );
    }

    const completedCount = progress.completedDays.length;

    return (
        <div className="h-screen w-screen overflow-hidden relative">
            {/* Full Screen 3D Scene */}
            <div className="absolute inset-0">
                <RoadScene />
            </div>

            {/* Overlay UI */}
            <div className="absolute inset-0 pointer-events-none">
                {/* Top Bar */}
                <div className="absolute top-16 sm:top-20 left-0 right-0 p-2 sm:p-4 pointer-events-auto">
                    <div className="flex items-center justify-between gap-1 sm:gap-2 flex-nowrap">
                        <Link href="/" className="flex-shrink-0">
                            <Button variant="ghost" size="sm" className="bg-white/80 backdrop-blur-sm p-1.5 sm:p-2 min-w-[44px] min-h-[44px]">
                                <ArrowLeft className="w-3 h-3 sm:w-4 sm:h-4" />
                                <Home className="w-3 h-3 sm:w-4 sm:h-4 sm:ml-1" />
                            </Button>
                        </Link>

                        {/* Title */}
                        <motion.h1
                            initial={{ opacity: 0, y: -20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="text-sm sm:text-base md:text-xl lg:text-2xl xl:text-3xl font-bold text-charcoal bg-white/80 backdrop-blur-sm px-2 sm:px-3 md:px-4 py-1 sm:py-2 rounded-full truncate flex-shrink-0 min-w-0"
                            style={{ fontFamily: 'var(--font-display)' }}
                        >
                            Our Love Journey
                        </motion.h1>

                        {/* Toggle Timeline */}
                        <Button
                            variant="ghost"
                            size="sm"
                            className="bg-white/80 backdrop-blur-sm p-1.5 sm:p-2 min-w-[44px] min-h-[44px] flex-shrink-0"
                            onClick={() => setShowTimeline(!showTimeline)}
                        >
                            <List className="w-3 h-3 sm:w-4 sm:h-4" />
                        </Button>
                    </div>
                </div>

                {/* Bottom Progress Bar - positioned above mobile controls on touch devices */}
                <div className="absolute bottom-[calc(env(safe-area-inset-bottom)+15rem)] sm:bottom-[calc(env(safe-area-inset-bottom)+14rem)] md:bottom-[calc(env(safe-area-inset-bottom)+12rem)] lg:bottom-8 xl:bottom-4 left-0 right-0 p-2 sm:p-4 pointer-events-auto">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="glass-card p-2 sm:p-4 max-w-xs sm:max-w-md md:max-w-lg mx-auto"
                    >
                        <div className="flex items-center justify-between mb-1 sm:mb-2 text-[10px] sm:text-sm">
                            <span className="text-charcoal-light">Next: Day {Math.min(completedCount + 1, 8)}</span>
                            <span className="font-semibold text-coral">{completedCount}/8 Complete</span>
                            <span className="text-charcoal-light">{progress.unlockedMessages.length} <Heart className="w-3 h-3 inline text-primary fill-primary" /></span>
                        </div>
                        <div className="h-1.5 sm:h-2 bg-blush-100 rounded-full overflow-hidden">
                            <motion.div
                                initial={{ width: 0 }}
                                animate={{ width: `${(completedCount / 8) * 100}%` }}
                                transition={{ delay: 0.5, duration: 0.8, ease: "easeOut" }}
                                className="h-full bg-gradient-to-r from-coral to-rose-gold"
                            />
                        </div>
                        <p className="hidden sm:block text-center mt-2 text-sm text-charcoal-light">
                            Click on a day sign to start that puzzle!
                            <span className="inline-flex items-center gap-1 ml-2 align-bottom">
                                <Car className="w-4 h-4" />
                                <Heart className="w-4 h-4 text-primary fill-primary" />
                            </span>
                        </p>
                    </motion.div>
                </div>

                {/* Side Timeline Panel */}
                {showTimeline && (
                    <motion.div
                        initial={{ x: 300, opacity: 0 }}
                        animate={{ x: 0, opacity: 1 }}
                        exit={{ x: 300, opacity: 0 }}
                        className="absolute right-0 top-28 sm:top-36 bottom-36 sm:bottom-20 w-64 sm:w-80 p-2 sm:p-4 pointer-events-auto overflow-y-auto"
                    >
                        <div className="glass-card p-2 sm:p-4 h-full overflow-y-auto">
                            <h2 className="text-sm sm:text-lg font-bold mb-2 sm:mb-4 text-charcoal">Day List</h2>
                            <Timeline />
                        </div>
                    </motion.div>
                )}
            </div>
        </div>
    );
}
