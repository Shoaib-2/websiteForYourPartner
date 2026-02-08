'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

interface PuzzlePiece {
    id: number;
    currentPos: number;
    correctPos: number;
}

export default function Day6Puzzle({ onComplete }: { onComplete: () => void }) {
    const [pieces, setPieces] = useState<PuzzlePiece[]>([]);
    const [selectedPiece, setSelectedPiece] = useState<number | null>(null);
    const gridSize = 9; // 3x3 grid

    useEffect(() => {
        // Create shuffled pieces
        const initialPieces: PuzzlePiece[] = Array.from({ length: gridSize }, (_, i) => ({
            id: i,
            currentPos: i,
            correctPos: i
        }));

        // Shuffle positions
        const shuffled = [...initialPieces];
        for (let i = shuffled.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [shuffled[i].currentPos, shuffled[j].currentPos] = [shuffled[j].currentPos, shuffled[i].currentPos];
        }

        setPieces(shuffled);
    }, []);

    const handlePieceClick = (pieceId: number) => {
        if (selectedPiece === null) {
            setSelectedPiece(pieceId);
        } else {
            // Swap pieces
            setPieces(prev => {
                const newPieces = [...prev];
                const piece1 = newPieces.find(p => p.id === selectedPiece)!;
                const piece2 = newPieces.find(p => p.id === pieceId)!;

                const tempPos = piece1.currentPos;
                piece1.currentPos = piece2.currentPos;
                piece2.currentPos = tempPos;

                return newPieces;
            });

            setSelectedPiece(null);

            // Check if puzzle is complete
            setTimeout(() => {
                const isComplete = pieces.every(p => p.currentPos === p.correctPos) ||
                    pieces.every(p =>
                        pieces.find(op => op.id === p.id)?.currentPos === p.correctPos
                    );

                // Recheck with updated state
                setPieces(current => {
                    const allCorrect = current.every(p => p.currentPos === p.correctPos);
                    if (allCorrect) {
                        setTimeout(() => onComplete(), 300);
                    }
                    return current;
                });
            }, 100);
        }
    };

    // Get piece at position
    const getPieceAtPos = (pos: number) => pieces.find(p => p.currentPos === pos);

    // Check if complete
    useEffect(() => {
        if (pieces.length > 0) {
            const isComplete = pieces.every(p => p.currentPos === p.correctPos);
            if (isComplete) {
                setTimeout(() => onComplete(), 500);
            }
        }
    }, [pieces, onComplete]);

    // Get gradient color for each piece based on its correct position
    const getGradientForPiece = (correctPos: number) => {
        const colors = [
            ['#FFB3C1', '#FF8FA3'], // top-left
            ['#FF8FA3', '#FF6B6B'], // top-center
            ['#FF6B6B', '#D4A5A5'], // top-right
            ['#FFE5E5', '#FFB3C1'], // middle-left
            ['#FF6B6B', '#B76E79'], // center (heart)
            ['#FFB3C1', '#FFE5E5'], // middle-right
            ['#D4A5A5', '#FF6B6B'], // bottom-left
            ['#FF6B6B', '#FF8FA3'], // bottom-center
            ['#FF8FA3', '#FFB3C1'], // bottom-right
        ];
        return colors[correctPos] || ['#FFB3C1', '#FF8FA3'];
    };

    return (
        <div className="text-center">
            <div className="glass-card p-4 mb-6">
                <p className="text-charcoal-light text-sm">
                    🤗 Put the pieces back together! Click two pieces to swap them.
                </p>
                {selectedPiece !== null && (
                    <p className="text-coral mt-2 text-sm">Piece selected! Click another to swap.</p>
                )}
            </div>

            <div className="inline-block">
                <div
                    className="grid gap-1 p-2 bg-white/50 rounded-2xl shadow-lg"
                    style={{
                        gridTemplateColumns: 'repeat(3, 1fr)',
                        width: '280px',
                        height: '280px'
                    }}
                >
                    {Array.from({ length: gridSize }).map((_, pos) => {
                        const piece = getPieceAtPos(pos);
                        if (!piece) return null;

                        const gradient = getGradientForPiece(piece.correctPos);
                        const isSelected = selectedPiece === piece.id;
                        const isCenter = piece.correctPos === 4;

                        return (
                            <motion.button
                                key={piece.id}
                                onClick={() => handlePieceClick(piece.id)}
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                animate={{
                                    scale: isSelected ? 1.1 : 1,
                                    boxShadow: isSelected
                                        ? '0 0 20px rgba(255, 107, 107, 0.5)'
                                        : '0 4px 15px rgba(0,0,0,0.1)'
                                }}
                                className="rounded-lg flex items-center justify-center cursor-pointer transition-all"
                                style={{
                                    background: `linear-gradient(135deg, ${gradient[0]}, ${gradient[1]})`,
                                    border: isSelected ? '3px solid #FF6B6B' : '1px solid rgba(255,255,255,0.5)'
                                }}
                            >
                                <span className="text-2xl">
                                    {isCenter ? '❤️' : '💕'}
                                </span>
                            </motion.button>
                        );
                    })}
                </div>
            </div>

            <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
                className="mt-6 text-sm text-charcoal-light"
                style={{ fontFamily: 'var(--font-handwritten)' }}
            >
                Like pieces of a puzzle, we fit together perfectly 🧩
            </motion.p>
        </div>
    );
}
