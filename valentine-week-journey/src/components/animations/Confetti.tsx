'use client';

import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface ConfettiPiece {
    id: number;
    x: number;
    color: string;
    size: number;
    rotation: number;
}

interface ConfettiProps {
    isActive: boolean;
    duration?: number;
    colors?: string[];
}

export function Confetti({
    isActive,
    duration = 3000,
    colors = ['#FF6B6B', '#FFB3C1', '#FFD700', '#FF8FA3', '#D4A5A5', '#B76E79']
}: ConfettiProps) {
    const [pieces, setPieces] = useState<ConfettiPiece[]>([]);

    useEffect(() => {
        if (isActive) {
            const newPieces: ConfettiPiece[] = [];
            for (let i = 0; i < 50; i++) {
                newPieces.push({
                    id: i,
                    x: Math.random() * 100,
                    color: colors[Math.floor(Math.random() * colors.length)],
                    size: Math.random() * 10 + 5,
                    rotation: Math.random() * 360
                });
            }
            setPieces(newPieces);

            const timeout = setTimeout(() => {
                setPieces([]);
            }, duration);

            return () => clearTimeout(timeout);
        }
    }, [isActive, duration, colors]);

    return (
        <AnimatePresence>
            {pieces.length > 0 && (
                <div className="fixed inset-0 pointer-events-none z-50 overflow-hidden">
                    {pieces.map((piece) => (
                        <motion.div
                            key={piece.id}
                            initial={{
                                x: `${piece.x}vw`,
                                y: '-5vh',
                                rotate: 0,
                                opacity: 1
                            }}
                            animate={{
                                y: '110vh',
                                rotate: piece.rotation + 720,
                                opacity: [1, 1, 0]
                            }}
                            exit={{ opacity: 0 }}
                            transition={{
                                duration: 2 + Math.random() * 2,
                                ease: "easeOut"
                            }}
                            style={{
                                position: 'absolute',
                                width: piece.size,
                                height: piece.size,
                                backgroundColor: piece.color,
                                borderRadius: Math.random() > 0.5 ? '50%' : '2px'
                            }}
                        />
                    ))}
                </div>
            )}
        </AnimatePresence>
    );
}
