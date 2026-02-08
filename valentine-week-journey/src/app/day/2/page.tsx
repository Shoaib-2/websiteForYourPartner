'use client';

import React from 'react';
import Day2Puzzle from '@/components/puzzles/Day2Puzzle';
import { PuzzleWrapper } from '@/components/puzzles/PuzzleWrapper';

export default function Day2Page() {
    return (
        <PuzzleWrapper dayNumber={2}>
            {({ onComplete }) => <Day2Puzzle onComplete={onComplete} />}
        </PuzzleWrapper>
    );
}