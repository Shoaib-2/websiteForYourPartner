'use client';

import React from 'react';
import { motion, type HTMLMotionProps } from 'framer-motion';
import { cn } from '@/lib/utils';

interface CardProps extends HTMLMotionProps<"div"> {
    variant?: 'default' | 'glass' | 'elevated';
    children: React.ReactNode;
}

export function Card({
    children,
    variant = 'default',
    className,
    ...props
}: CardProps) {
    const variants = {
        default: `
      bg-white/90 backdrop-blur-sm
      border border-blush-200/50
      shadow-soft
    `,
        glass: `
      bg-white/70 backdrop-blur-lg
      border border-white/30
      shadow-lg
    `,
        elevated: `
      bg-white
      border border-blush-200
      shadow-medium
    `
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
            className={cn(
                'rounded-2xl p-6',
                variants[variant],
                className
            )}
            {...props}
        >
            {children}
        </motion.div>
    );
}
