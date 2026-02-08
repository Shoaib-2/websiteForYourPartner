'use client';

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Heart } from 'lucide-react';

interface MessageRevealProps {
    message: string;
    isUnlocked: boolean;
    dayNumber: number;
}

export function MessageReveal({ message, isUnlocked, dayNumber }: MessageRevealProps) {
    return (
        <AnimatePresence>
            {isUnlocked && (
                <motion.div
                    initial={{ opacity: 0, scale: 0.8, rotateY: 90 }}
                    animate={{ opacity: 1, scale: 1, rotateY: 0 }}
                    exit={{ opacity: 0, scale: 0.8 }}
                    transition={{
                        duration: 0.8,
                        ease: [0.22, 1, 0.36, 1],
                        rotateY: { duration: 0.6 }
                    }}
                    className="relative mt-8"
                >
                    {/* Envelope Background */}
                    <div className="relative bg-gradient-to-br from-blush-100 to-cream rounded-2xl sm:rounded-3xl p-4 sm:p-6 md:p-8 shadow-lg border border-blush-200 overflow-hidden">
                        {/* Decorative Hearts */}
                        <motion.div
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            transition={{ delay: 0.5, duration: 0.3 }}
                            className="absolute top-4 right-4 text-coral"
                        >
                            <Heart className="w-6 h-6 fill-current" />
                        </motion.div>
                        <motion.div
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            transition={{ delay: 0.6, duration: 0.3 }}
                            className="absolute bottom-4 left-4 text-blush-300"
                        >
                            <Heart className="w-4 h-4 fill-current" />
                        </motion.div>

                        {/* Day Label */}
                        <motion.div
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.3 }}
                            className="text-center mb-4"
                        >
                            <span className="text-sm font-medium text-rose-gold uppercase tracking-wider">
                                Day {dayNumber} Message
                            </span>
                        </motion.div>

                        {/* Message */}
                        <motion.p
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.4, duration: 0.5 }}
                            className="text-center text-lg sm:text-xl md:text-2xl leading-relaxed text-charcoal"
                            style={{ fontFamily: 'var(--font-handwritten)' }}
                        >
                            {message}
                        </motion.p>

                        {/* Signature Line */}
                        <motion.div
                            initial={{ scaleX: 0 }}
                            animate={{ scaleX: 1 }}
                            transition={{ delay: 0.7, duration: 0.5 }}
                            className="mt-6 w-24 h-0.5 mx-auto bg-gradient-to-r from-transparent via-coral to-transparent"
                        />
                    </div>

                    {/* Glow Effect */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: [0, 0.5, 0] }}
                        transition={{ duration: 2, repeat: 2 }}
                        className="absolute inset-0 -z-10 blur-xl bg-coral/20 rounded-3xl"
                    />
                </motion.div>
            )}
        </AnimatePresence>
    );
}
