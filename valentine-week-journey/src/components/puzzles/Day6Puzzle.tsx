'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

interface PuzzlePiece {
    id: number;
    currentPos: number;
    correctPos: number;
}

const GRID_WIDTH = 3;
const GRID_SIZE = GRID_WIDTH * GRID_WIDTH;

const PUZZLE_SVG = `
<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 300 300'>
  <defs>
    <linearGradient id='bg' x1='0' y1='0' x2='1' y2='1'>
      <stop offset='0%' stop-color='#FFF0F5'/>
      <stop offset='100%' stop-color='#FFB6C1'/>
    </linearGradient>
    <linearGradient id='heart' x1='0' y1='0' x2='1' y2='1'>
      <stop offset='0%' stop-color='#FF6B6B'/>
      <stop offset='100%' stop-color='#D94C5A'/>
    </linearGradient>
  </defs>
  <rect width='300' height='300' fill='url(#bg)'/>
  <circle cx='60' cy='60' r='6' fill='#FF8FA3'/>
  <circle cx='240' cy='55' r='5' fill='#FF8FA3'/>
  <circle cx='70' cy='245' r='5' fill='#FF8FA3'/>
  <circle cx='235' cy='235' r='6' fill='#FF8FA3'/>
  <path d='M150 85 C 135 60 100 55 80 80 C 55 110 70 155 110 185 C 130 205 150 220 150 220 C 150 220 170 205 190 185 C 230 155 245 110 220 80 C 200 55 165 60 150 85 Z' fill='url(#heart)' opacity='0.9'/>
  <path d='M150 95 C 140 70 110 68 95 88 C 78 110 88 140 120 165 C 135 178 150 190 150 190 C 150 190 165 178 180 165 C 212 140 222 110 205 88 C 190 68 160 70 150 95 Z' fill='none' stroke='#B76E79' stroke-width='4'/>
  <text x='150' y='265' text-anchor='middle' font-family='Georgia, serif' font-size='28' fill='#6B2F35' font-weight='700'>YOU + ME</text>
</svg>
`;

const PUZZLE_IMAGE = `url("data:image/svg+xml;utf8,${encodeURIComponent(PUZZLE_SVG)}")`;

export default function Day6Puzzle({ onComplete }: { onComplete: () => void }) {
    const [pieces, setPieces] = useState<PuzzlePiece[]>([]);
    const [selectedPiece, setSelectedPiece] = useState<number | null>(null);
    const [moves, setMoves] = useState(0);
    const [hasCompleted, setHasCompleted] = useState(false);

    useEffect(() => {
        const createShuffledPieces = () => {
            const positions = Array.from({ length: GRID_SIZE }, (_, i) => i);
            let shuffledPositions = [...positions];

            do {
                for (let i = shuffledPositions.length - 1; i > 0; i--) {
                    const j = Math.floor(Math.random() * (i + 1));
                    [shuffledPositions[i], shuffledPositions[j]] = [shuffledPositions[j], shuffledPositions[i]];
                }
            } while (shuffledPositions.every((pos, index) => pos === index));

            return positions.map((_, index) => ({
                id: index,
                currentPos: shuffledPositions[index],
                correctPos: index
            }));
        };

        setPieces(createShuffledPieces());
        setMoves(0);
        setSelectedPiece(null);
        setHasCompleted(false);
    }, []);

    const handlePieceClick = (pieceId: number) => {
        if (selectedPiece === null) {
            setSelectedPiece(pieceId);
            return;
        }

        if (selectedPiece === pieceId) {
            setSelectedPiece(null);
            return;
        }

        setPieces(prev => {
            const newPieces = prev.map(piece => ({ ...piece }));
            const piece1 = newPieces.find(p => p.id === selectedPiece)!;
            const piece2 = newPieces.find(p => p.id === pieceId)!;

            const tempPos = piece1.currentPos;
            piece1.currentPos = piece2.currentPos;
            piece2.currentPos = tempPos;

            return newPieces;
        });

        setMoves(prev => prev + 1);
        setSelectedPiece(null);
    };

    const getPieceAtPos = (pos: number) => pieces.find(p => p.currentPos === pos);

    useEffect(() => {
        if (pieces.length === 0 || hasCompleted) {
            return;
        }

        const isComplete = pieces.every(p => p.currentPos === p.correctPos);
        if (isComplete) {
            setHasCompleted(true);
            setTimeout(() => onComplete(), 400);
        }
    }, [pieces, hasCompleted, onComplete]);

    const getBackgroundPosition = (correctPos: number) => {
        const row = Math.floor(correctPos / GRID_WIDTH);
        const col = correctPos % GRID_WIDTH;
        const step = GRID_WIDTH - 1 || 1;
        const x = (col / step) * 100;
        const y = (row / step) * 100;
        return `${x}% ${y}%`;
    };

    const correctCount = pieces.filter(p => p.currentPos === p.correctPos).length;

    return (
        <div className="text-center w-full">
            <div className="glass-card p-4 mb-6">
                <p className="text-charcoal-light text-sm">
                    Put the pieces back together. Click two tiles to swap them, and use the preview as your guide.
                </p>
                <div className="mt-4 flex flex-col items-center justify-center gap-3 sm:flex-row sm:gap-5">
                    <div
                        className="w-16 h-16 rounded-xl border border-white/70 bg-white/70 shadow-inner"
                        style={{
                            backgroundImage: PUZZLE_IMAGE,
                            backgroundSize: '100% 100%',
                            backgroundPosition: 'center'
                        }}
                        aria-hidden="true"
                    />
                    <div className="text-xs text-charcoal-light text-center sm:text-left">
                        <p className="font-semibold text-charcoal">Goal Preview</p>
                        <p>Moves: {moves}</p>
                        <p>Placed: {correctCount}/{GRID_SIZE}</p>
                    </div>
                </div>
                {selectedPiece !== null && (
                    <p className="text-coral mt-2 text-sm">Tile selected! Click another tile to swap.</p>
                )}
            </div>

            <div className="w-full max-w-[280px] mx-auto">
                <div className="grid grid-cols-3 gap-1 p-2 sm:p-3 bg-white/50 rounded-2xl shadow-lg w-full aspect-square">
                    {Array.from({ length: GRID_SIZE }).map((_, pos) => {
                        const piece = getPieceAtPos(pos);
                        if (!piece) return null;

                        const isSelected = selectedPiece === piece.id;
                        const isCorrect = piece.currentPos === piece.correctPos;

                        return (
                            <motion.button
                                key={piece.id}
                                onClick={() => handlePieceClick(piece.id)}
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                animate={{
                                    scale: isSelected ? 1.08 : 1,
                                    boxShadow: isSelected
                                        ? '0 0 18px rgba(255, 107, 107, 0.45)'
                                        : isCorrect
                                            ? '0 0 12px rgba(183, 110, 121, 0.35)'
                                            : '0 4px 12px rgba(0,0,0,0.1)'
                                }}
                                className="w-full h-full rounded-lg flex items-center justify-center cursor-pointer transition-all touch-manipulation select-none overflow-hidden"
                                aria-label={isCorrect ? 'Correct tile' : 'Puzzle tile'}
                                style={{
                                    backgroundImage: PUZZLE_IMAGE,
                                    backgroundSize: `${GRID_WIDTH * 100}% ${GRID_WIDTH * 100}%`,
                                    backgroundPosition: getBackgroundPosition(piece.correctPos),
                                    backgroundRepeat: 'no-repeat',
                                    border: isSelected
                                        ? '3px solid #FF6B6B'
                                        : isCorrect
                                            ? '2px solid #B76E79'
                                            : '1px solid rgba(255,255,255,0.6)'
                                }}
                            >
                                <span className="sr-only">Puzzle tile</span>
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
                Like pieces of a puzzle, we fit together perfectly.
            </motion.p>
        </div>
    );
}
