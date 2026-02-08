'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MEMORY_ITEMS } from '@/lib/constants';
import { shuffleArray } from '@/lib/utils';

interface Card {
    id: number;
    itemId: number;
    emoji: string;
    isFlipped: boolean;
    isMatched: boolean;
}

export default function Day3Puzzle({ onComplete }: { onComplete: () => void }) {
    const [cards, setCards] = useState<Card[]>([]);
    const [flippedCards, setFlippedCards] = useState<number[]>([]);
    const [moves, setMoves] = useState(0);
    const [isChecking, setIsChecking] = useState(false);

    useEffect(() => {
        // Create pairs of cards
        const cardPairs = MEMORY_ITEMS.flatMap((item, index) => [
            { id: index * 2, itemId: item.id, emoji: item.emoji, isFlipped: false, isMatched: false },
            { id: index * 2 + 1, itemId: item.id, emoji: item.emoji, isFlipped: false, isMatched: false }
        ]);
        setCards(shuffleArray(cardPairs));
    }, []);

    const handleCardClick = (cardId: number) => {
        if (isChecking) return;

        const card = cards.find(c => c.id === cardId);
        if (!card || card.isFlipped || card.isMatched) return;
        if (flippedCards.length >= 2) return;

        // Flip the card
        setCards(prev => prev.map(c =>
            c.id === cardId ? { ...c, isFlipped: true } : c
        ));

        const newFlipped = [...flippedCards, cardId];
        setFlippedCards(newFlipped);

        // Check for match when 2 cards are flipped
        if (newFlipped.length === 2) {
            setMoves(m => m + 1);
            setIsChecking(true);

            const [firstId, secondId] = newFlipped;
            const firstCard = cards.find(c => c.id === firstId);
            const secondCard = cards.find(c => c.id === secondId);

            if (firstCard && secondCard && firstCard.itemId === secondCard.itemId) {
                // Match found
                setTimeout(() => {
                    setCards(prev => prev.map(c =>
                        c.id === firstId || c.id === secondId
                            ? { ...c, isMatched: true }
                            : c
                    ));
                    setFlippedCards([]);
                    setIsChecking(false);

                    // Check for win
                    const allMatched = cards.every(c =>
                        c.isMatched || c.id === firstId || c.id === secondId
                    );
                    if (allMatched) {
                        setTimeout(() => onComplete(), 500);
                    }
                }, 500);
            } else {
                // No match
                setTimeout(() => {
                    setCards(prev => prev.map(c =>
                        c.id === firstId || c.id === secondId
                            ? { ...c, isFlipped: false }
                            : c
                    ));
                    setFlippedCards([]);
                    setIsChecking(false);
                }, 1000);
            }
        }
    };

    const matchedCount = cards.filter(c => c.isMatched).length / 2;

    return (
        <div className="text-center">
            <div className="glass-card p-4 mb-6 inline-flex gap-6">
                <div>
                    <p className="text-sm text-charcoal-light">Moves</p>
                    <p className="text-2xl font-bold text-coral">{moves}</p>
                </div>
                <div className="w-px bg-blush-200" />
                <div>
                    <p className="text-sm text-charcoal-light">Matched</p>
                    <p className="text-2xl font-bold text-green-600">{matchedCount}/{MEMORY_ITEMS.length}</p>
                </div>
            </div>

            <div className="grid grid-cols-4 gap-3 max-w-md mx-auto">
                {cards.map((card) => (
                    <motion.div
                        key={card.id}
                        onClick={() => handleCardClick(card.id)}
                        className="aspect-square cursor-pointer perspective-1000"
                        whileHover={{ scale: card.isMatched ? 1 : 1.05 }}
                        whileTap={{ scale: 0.95 }}
                    >
                        <motion.div
                            className="w-full h-full relative"
                            initial={false}
                            animate={{ rotateY: card.isFlipped || card.isMatched ? 180 : 0 }}
                            transition={{ duration: 0.4, ease: "easeInOut" }}
                            style={{ transformStyle: 'preserve-3d' }}
                        >
                            {/* Card Back */}
                            <div
                                className="absolute inset-0 rounded-xl bg-gradient-to-br from-coral to-rose-gold flex items-center justify-center shadow-md"
                                style={{ backfaceVisibility: 'hidden' }}
                            >
                                <span className="text-2xl text-white">💝</span>
                            </div>

                            {/* Card Front */}
                            <div
                                className={`absolute inset-0 rounded-xl flex items-center justify-center shadow-md ${card.isMatched ? 'bg-green-100' : 'bg-white'
                                    }`}
                                style={{
                                    backfaceVisibility: 'hidden',
                                    transform: 'rotateY(180deg)'
                                }}
                            >
                                <span className="text-3xl">{card.emoji}</span>
                            </div>
                        </motion.div>
                    </motion.div>
                ))}
            </div>
        </div>
    );
}
