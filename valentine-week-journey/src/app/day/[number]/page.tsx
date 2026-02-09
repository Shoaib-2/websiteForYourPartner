import DayPageClient from './DayPageClient';

// Generate static paths for days 1-8
export function generateStaticParams() {
    return [1, 2, 3, 4, 5, 6, 7, 8].map((number) => ({
        number: number.toString(),
    }));
}

interface DayPageProps {
    params: Promise<{ number: string }>;
}

export default async function DayPage({ params }: DayPageProps) {
    const { number } = await params;
    const dayNumber = parseInt(number, 10);

    return <DayPageClient dayNumber={dayNumber} />;
}
