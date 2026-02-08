'use client';

import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Lock, Check, ChevronRight } from 'lucide-react';
import { useJourney } from '@/context/JourneyContext';
import { getDayName, getDayDate } from '@/lib/utils';
import { DayIcon } from '@/components/ui/DayIcon';
import { cn } from '@/lib/utils';

interface TimelineProps {
    onDayClick?: (dayNumber: number) => void;
}

export function Timeline({ onDayClick }: TimelineProps) {
    const { canAccess, isDayCompleted } = useJourney();

    const days = Array.from({ length: 8 }, (_, i) => i + 1);

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.1,
                delayChildren: 0.2
            }
        }
    };

    const itemVariants = {
        hidden: { opacity: 0, x: -30 },
        visible: { opacity: 1, x: 0 }
    };

    return (
        <motion.div
            className="relative max-w-lg mx-auto"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
        >
            {/* Vertical Line - responsive positioning */}
            <div className="absolute left-3 sm:left-6 top-0 bottom-0 w-0.5 bg-gradient-to-b from-blush-300 via-coral to-rose-gold" />

            <div className="space-y-3 sm:space-y-4">
                {days.map((day) => {
                    const accessible = canAccess(day);
                    const completed = isDayCompleted(day);

                    return (
                        <motion.div
                            key={day}
                            variants={itemVariants}
                            className="relative min-h-[60px] sm:min-h-[80px]" // Ensure height for absolute positioning
                        >
                            {/* Day Icon - Positioned absolutely on the line */}
                            <div className="absolute left-0 top-1/2 -translate-y-1/2 z-20">
                                {accessible ? (
                                    <Link href={`/day/${day}`} onClick={() => onDayClick?.(day)}>
                                        <div className={cn(
                                            'w-6 h-6 sm:w-12 sm:h-12 rounded-full flex items-center justify-center shadow-md transition-transform hover:scale-110',
                                            completed
                                                ? 'bg-green-500 text-white'
                                                : 'bg-gradient-to-br from-coral to-rose-gold text-white'
                                        )}>
                                            {completed ? <Check className="w-3 h-3 sm:w-6 sm:h-6" /> : <DayIcon day={day} className="w-3 h-3 sm:w-6 sm:h-6" />}
                                        </div>
                                    </Link>
                                ) : (
                                    <div className="w-6 h-6 sm:w-12 sm:h-12 rounded-full flex items-center justify-center bg-gray-300 text-gray-500 shadow">
                                        <Lock className="w-3 h-3 sm:w-5 sm:h-5" />
                                    </div>
                                )}
                            </div>

                            {/* Content Card */}
                            <div className="pl-8 sm:pl-16 w-full">
                                {accessible ? (
                                    <Link
                                        href={`/day/${day}`}
                                        onClick={() => onDayClick?.(day)}
                                        className="block group"
                                    >
                                        <motion.div
                                            whileHover={{ scale: 1.02, x: 5 }}
                                            whileTap={{ scale: 0.98 }}
                                            className={cn(
                                                'flex items-center gap-2 sm:gap-4 p-2 sm:p-4 rounded-lg sm:rounded-2xl transition-all',
                                                'bg-white/80 backdrop-blur-sm border',
                                                completed
                                                    ? 'border-green-300 shadow-md'
                                                    : 'border-blush-200 group-hover:border-coral group-hover:shadow-lg'
                                            )}
                                        >
                                            <div className="flex-1 min-w-0">
                                                <div className="flex items-center gap-2 mb-0.5">
                                                    <span className="text-[10px] sm:text-sm font-medium text-coral">
                                                        {getDayDate(day)}
                                                    </span>
                                                </div>
                                                <h3 className="text-xs sm:text-lg font-semibold text-charcoal truncate">
                                                    Day {day}: {getDayName(day)}
                                                </h3>
                                            </div>

                                            <ChevronRight className="w-4 h-4 sm:w-5 sm:h-5 text-coral flex-shrink-0 opacity-50 group-hover:opacity-100 transition-opacity" />
                                        </motion.div>
                                    </Link>
                                ) : (
                                    <div className="flex items-center gap-2 sm:gap-4 p-2 sm:p-4 rounded-lg sm:rounded-2xl bg-gray-100/80 border border-gray-200 opacity-60">
                                        <div className="flex-1 min-w-0">
                                            <span className="text-[10px] sm:text-sm text-gray-400 block mb-0.5">
                                                {getDayDate(day)}
                                            </span>
                                            <h3 className="text-xs sm:text-lg font-semibold text-gray-400 truncate">
                                                Day {day}: {getDayName(day)}
                                            </h3>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </motion.div>
                    );
                })}
            </div>
        </motion.div>
    );
}
