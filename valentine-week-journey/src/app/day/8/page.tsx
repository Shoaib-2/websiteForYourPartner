import Day8Puzzle from '@/components/puzzles/Day8Finale';
import { PuzzleWrapper } from '@/components/puzzles/PuzzleWrapper';

export default function Day8Page() {
    return (
        <PuzzleWrapper dayNumber={8}>
            {({ onComplete }) => <Day8Puzzle onComplete={onComplete} />}
        </PuzzleWrapper>
    );
}