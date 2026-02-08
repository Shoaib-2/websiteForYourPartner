import { clsx, type ClassValue } from "clsx";

export function cn(...inputs: ClassValue[]) {
  return clsx(inputs);
}

// Date utilities
export const START_DATE = new Date('2026-02-07T00:00:00');
export const END_DATE = new Date('2026-02-14T23:59:59');

export const getCurrentDayNumber = (): number => {
  const today = new Date();
  const diffTime = today.getTime() - START_DATE.getTime();
  const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24)) + 1;
  return Math.min(Math.max(diffDays, 0), 8);
};

export const isWithinValentineWeek = (): boolean => {
  const today = new Date();
  return today >= START_DATE && today <= END_DATE;
};

export const getDayName = (dayNumber: number): string => {
  const dayNames: Record<number, string> = {
    1: "Rose Day",
    2: "Propose Day",
    3: "Chocolate Day",
    4: "Teddy Day",
    5: "Promise Day",
    6: "Hug Day",
    7: "Kiss Day",
    8: "Valentine's Day"
  };
  return dayNames[dayNumber] || "Day";
};

export const getDayDate = (dayNumber: number): string => {
  const dates: Record<number, string> = {
    1: "February 7",
    2: "February 8",
    3: "February 9",
    4: "February 10",
    5: "February 11",
    6: "February 12",
    7: "February 13",
    8: "February 14"
  };
  return dates[dayNumber] || "";
};

export const getDayEmoji = (dayNumber: number): string => {
  const emojis: Record<number, string> = {
    1: "🌹",
    2: "💍",
    3: "🍫",
    4: "🧸",
    5: "🤞",
    6: "🤗",
    7: "💋",
    8: "❤️"
  };
  return emojis[dayNumber] || "💕";
};

// Caesar cipher for Day 2 puzzle
export const caesarCipher = (text: string, shift: number): string => {
  return text
    .split('')
    .map(char => {
      if (char.match(/[a-z]/i)) {
        const code = char.charCodeAt(0);
        const isUpperCase = code >= 65 && code <= 90;
        const base = isUpperCase ? 65 : 97;
        return String.fromCharCode(((code - base + shift) % 26 + 26) % 26 + base);
      }
      return char;
    })
    .join('');
};

// Shuffle array (Fisher-Yates)
export const shuffleArray = <T>(array: T[]): T[] => {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
};

// Generate random positions for hidden hearts
export const generateRandomPositions = (count: number, containerWidth: number, containerHeight: number) => {
  const positions = [];
  for (let i = 0; i < count; i++) {
    positions.push({
      x: Math.random() * (containerWidth - 40),
      y: Math.random() * (containerHeight - 40),
      id: i
    });
  }
  return positions;
};
