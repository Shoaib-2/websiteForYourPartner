'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Heart, Sparkles, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { HeartParticles } from '@/components/ui/HeartParticles';

export default function HomePage() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return null;
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4 py-12 relative overflow-hidden">
      <HeartParticles count={20} />

      {/* Hero Content */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
        className="text-center relative z-10 max-w-2xl"
      >
        {/* Decorative Hearts */}
        <motion.div
          initial={{ scale: 0, rotate: -15 }}
          animate={{ scale: 1, rotate: -15 }}
          transition={{ delay: 0.3, duration: 0.5, type: "spring" }}
          className="absolute -top-8 -left-4 text-blush-300"
        >
          <Heart className="w-8 h-8 fill-current" />
        </motion.div>
        <motion.div
          initial={{ scale: 0, rotate: 15 }}
          animate={{ scale: 1, rotate: 15 }}
          transition={{ delay: 0.4, duration: 0.5, type: "spring" }}
          className="absolute -top-4 -right-2 text-coral"
        >
          <Heart className="w-6 h-6 fill-current" />
        </motion.div>

        {/* Main Title */}
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.6 }}
          className="text-3xl sm:text-4xl md:text-6xl lg:text-7xl font-bold mb-4 sm:mb-6"
          style={{ fontFamily: 'var(--font-display)' }}
        >
          <span className="gradient-text">Valentine&apos;s Week</span>
          <br />
          <span className="text-charcoal">Journey</span>
        </motion.h1>

        {/* Subtitle */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5, duration: 0.6 }}
          className="text-sm sm:text-lg md:text-xl text-charcoal-light mb-3 sm:mb-4 px-2"
        >
          8 days. 8 puzzles. 8 messages written just for you.
        </motion.p>

        {/* Dates */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.6, duration: 0.5 }}
          className="inline-flex items-center gap-1 sm:gap-2 bg-blush-100 px-3 sm:px-4 py-1.5 sm:py-2 rounded-full text-rose-gold font-medium mb-6 sm:mb-8 text-xs sm:text-base"
        >
          <Sparkles className="w-3 h-3 sm:w-4 sm:h-4" />
          February 7 - 14, 2026
          <Sparkles className="w-3 h-3 sm:w-4 sm:h-4" />
        </motion.div>

        {/* CTA Button */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8, duration: 0.5 }}
        >
          <Link href="/journey">
            <Button size="lg" className="group">
              Begin Our Journey
              <ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-1" />
            </Button>
          </Link>
        </motion.div>

        {/* Tagline */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1, duration: 0.6 }}
          className="mt-8 text-sm text-charcoal-light italic"
          style={{ fontFamily: 'var(--font-handwritten)', fontSize: '1.25rem' }}
        >
          &ldquo;Every puzzle unlocks a piece of my heart&rdquo; 💕
        </motion.p>
      </motion.div>

      {/* Bottom Decoration */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.2, duration: 0.8 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2"
      >
        <div className="flex items-center gap-2 text-blush-300">
          <div className="w-12 h-px bg-gradient-to-r from-transparent to-blush-300" />
          <Heart className="w-4 h-4 fill-current floating" />
          <div className="w-12 h-px bg-gradient-to-l from-transparent to-blush-300" />
        </div>
      </motion.div>
    </div>
  );
}
