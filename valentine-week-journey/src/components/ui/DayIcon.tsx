import React from 'react';
import {
    Flower2,
    Gem,
    Gift,
    Smile,
    HeartHandshake,
    Users,
    Heart,
    Sparkles
} from 'lucide-react';

interface DayIconProps {
    day: number;
    className?: string;
}

export function DayIcon({ day, className = "w-6 h-6" }: DayIconProps) {
    const icons = {
        1: Flower2,        // Rose Day
        2: Gem,            // Propose Day (Ring)
        3: Gift,           // Chocolate Day
        4: Smile,          // Teddy Day
        5: HeartHandshake, // Promise Day
        6: Users,          // Hug Day
        7: Heart,          // Kiss Day
        8: Sparkles        // Valentine's Day
    };

    const Icon = icons[day as keyof typeof icons] || Heart;

    return <Icon className={className} />;
}
