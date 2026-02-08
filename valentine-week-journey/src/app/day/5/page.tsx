'use client';

import React from 'react';
import Day5Puzzle from '@/components/puzzles/Day5Puzzle';
import { PuzzleWrapper } from '@/components/puzzles/PuzzleWrapper';

export default function Day5Page() {
    return (
        <PuzzleWrapper dayNumber={5}>
            {({ onComplete }) => <Day5Puzzle onComplete={onComplete} />}
        </PuzzleWrapper>
    );
}