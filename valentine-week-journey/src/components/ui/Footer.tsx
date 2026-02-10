'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Heart } from 'lucide-react';
import threadsIcon from '@/assets/threads-app-icon.svg';

export function Footer() {
    const currentYear = new Date().getFullYear();

    return (
        <motion.footer
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.5, duration: 0.8 }}
            className="absolute bottom-0 left-0 right-0 py-6 text-center z-10"
        >
            <div className="flex flex-col items-center justify-center gap-2 text-charcoal-light text-sm sm:text-base font-medium">
                <div className="flex items-center gap-1.5">
                    <span>Made by</span>
                    <span className="text-rose-gold font-bold">Shoaib</span>
                </div>

                <div className="flex items-center gap-1.5">
                    <span>Follow me on</span>
                    <Link
                        href="https://www.threads.com/@_shoaib_7"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center text-rose-gold font-bold hover:text-coral transition-colors"
                        aria-label="Follow me on Threads"
                    >
                        <span className="text-rose-gold font-bold inline-flex">
                            <Image
                                src={threadsIcon}
                                alt="Threads"
                                className="w-4 h-4"
                            />
                        </span>
                    </Link>
                </div>

                <div className="flex items-center gap-1.5 opacity-80 text-xs sm:text-sm">
                    <span>&copy; {currentYear} Love&apos;s Odyssey</span>
                    <span className="text-blush-300">•</span>
                    <motion.div
                        whileHover={{ scale: 1.5, rotate: [0, -10, 10, 0] }}
                        whileTap={{ scale: 0.9 }}
                        className="cursor-pointer text-coral"
                    >
                        <Heart className="w-4 h-4 fill-current" />
                    </motion.div>
                </div>
            </div>
        </motion.footer>
    );
}
