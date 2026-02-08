'use client';

import React from 'react';
import Day4Puzzle from '@/components/puzzles/Day4Puzzle';
import { PuzzleWrapper } from '@/components/puzzles/PuzzleWrapper';

export default function Day4Page() {
    return (
        <PuzzleWrapper dayNumber={4}>
            {({ onComplete }) => <Day4Puzzle onComplete={onComplete} />}
        </PuzzleWrapper>
    );
}