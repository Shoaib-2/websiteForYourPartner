import Day7Puzzle from '@/components/puzzles/Day7Puzzle';
import { PuzzleWrapper } from '@/components/puzzles/PuzzleWrapper';

export default function Day7Page() {
    return (
        <PuzzleWrapper dayNumber={7}>
            {({ onComplete }) => <Day7Puzzle onComplete={onComplete} />}
        </PuzzleWrapper>
    );
}