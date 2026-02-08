'use client';

import Day6Puzzle from '@/components/puzzles/Day6Puzzle';
import { PuzzleWrapper } from '@/components/puzzles/PuzzleWrapper';

export default function Day6Page() {
    return (
        <PuzzleWrapper dayNumber={6}>
            {({ onComplete }) => <Day6Puzzle onComplete={onComplete} />}
        </PuzzleWrapper>
    );
}