'use client';

import React from 'react';
import Day1Puzzle from '@/components/puzzles/Day1Puzzle';
import { PuzzleWrapper } from '@/components/puzzles/PuzzleWrapper';

export default function Day1Page() {
    return (
        <PuzzleWrapper dayNumber={1}>
            {({ onComplete }) => <Day1Puzzle onComplete={onComplete} />}
        </PuzzleWrapper>
    );
}