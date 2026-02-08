'use client';

import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Volume2, VolumeX } from 'lucide-react';
import { getBackgroundMusic } from '@/lib/audio';

export function Navbar() {
    const [isMusicPlaying, setIsMusicPlaying] = React.useState(false);

    React.useEffect(() => {
        // Check initial state
        const music = getBackgroundMusic();
        setIsMusicPlaying(music.getIsPlaying());
    }, []);

    const handleMusicToggle = async () => {
        const music = getBackgroundMusic();
        const isPlaying = await music.toggle();
        setIsMusicPlaying(isPlaying);
    };

    return (
        <motion.nav
            initial={{ y: -100 }}
            animate={{ y: 0 }}
            transition={{ duration: 0.6, ease: 'easeOut' }}
            className="fixed top-0 left-0 right-0 z-50 px-4 py-3 sm:py-4 flex items-center justify-center pointer-events-none"
        >
            <div className="bg-white/70 backdrop-blur-md border border-white/40 shadow-sm rounded-full px-5 py-2 flex items-center gap-3 pointer-events-auto">
                <Link href="/" className="flex items-center gap-3 hover:opacity-80 transition-opacity">
                    <div className="relative w-8 h-8 sm:w-10 sm:h-10 rounded-full overflow-hidden border-2 border-rose-gold/20 shadow-sm flex items-center justify-center bg-blush-100">
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 24 24"
                            fill="#FF6F61"
                            stroke="#B76E79"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            className="w-5 h-5 sm:w-6 sm:h-6"
                        >
                            <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z" />
                        </svg>
                    </div>
                    <span
                        className="text-lg sm:text-xl font-bold bg-gradient-to-r from-coral to-rose-gold bg-clip-text text-transparent"
                        style={{ fontFamily: 'var(--font-display)' }}
                    >
                        Love&apos;s Odyssey
                    </span>
                </Link>
            </div>
        </motion.nav>
    );
}
