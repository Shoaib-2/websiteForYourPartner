'use client';

import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface Heart {
    id: number;
    x: number;
    size: number;
    duration: number;
    delay: number;
    opacity: number;
}

interface HeartParticlesProps {
    count?: number;
    colors?: string[];
}

export function HeartParticles({
    count = 15,
    colors = ['#FFB3C1', '#FF6B6B', '#D4A5A5', '#FF8FA3']
}: HeartParticlesProps) {
    const [hearts, setHearts] = useState<Heart[]>([]);

    useEffect(() => {
        const generatedHearts: Heart[] = [];
        for (let i = 0; i < count; i++) {
            generatedHearts.push({
                id: i,
                x: Math.random() * 100,
                size: Math.random() * 15 + 10,
                duration: Math.random() * 10 + 15,
                delay: Math.random() * 10,
                opacity: Math.random() * 0.4 + 0.2
            });
        }
        setHearts(generatedHearts);
    }, [count]);

    return (
        <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
            <AnimatePresence>
                {hearts.map((heart) => (
                    <motion.div
                        key={heart.id}
                        initial={{
                            x: `${heart.x}vw`,
                            y: '110vh',
                            rotate: 0
                        }}
                        animate={{
                            y: '-10vh',
                            rotate: [0, 10, -10, 0]
                        }}
                        transition={{
                            duration: heart.duration,
                            delay: heart.delay,
                            repeat: Infinity,
                            ease: "linear",
                            rotate: {
                                duration: 3,
                                repeat: Infinity,
                                ease: "easeInOut"
                            }
                        }}
                        style={{
                            position: 'absolute',
                            fontSize: heart.size,
                            opacity: heart.opacity,
                            color: colors[Math.floor(Math.random() * colors.length)]
                        }}
                    >
                        ❤
                    </motion.div>
                ))}
            </AnimatePresence>
        </div>
    );
}
