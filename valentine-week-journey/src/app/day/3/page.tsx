'use client';

import React from 'react';
import Day3Puzzle from '@/components/puzzles/Day3Puzzle';
import { PuzzleWrapper } from '@/components/puzzles/PuzzleWrapper';

export default function Day3Page() {
    return (
        <PuzzleWrapper dayNumber={3}>
            {({ onComplete }) => <Day3Puzzle onComplete={onComplete} />}
        </PuzzleWrapper>
    );
}