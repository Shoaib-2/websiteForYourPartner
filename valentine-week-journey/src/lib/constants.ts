// Day-specific messages - personalize these!
export const DAY_MESSAGES: Record<number, string> = {
  1: "Like a rose that blooms in the garden of love, our relationship grows more beautiful each day. You are my forever flower. 🌹",
  2: "Every moment with you feels like a proposal to spend eternity together. My heart chose you, and it would choose you again in every lifetime. 💍",
  3: "You're sweeter than all the chocolate in the world. Life with you is the most delicious adventure. 🍫",
  4: "You're my forever cuddle buddy, my comfort, my home. Like a teddy bear, you make everything better just by being there. 🧸",
  5: "I promise to love you through every sunrise and sunset, through every laugh and tear. You have my heart, always. 🤞",
  6: "Every hug from you feels like coming home. In your arms, I've found my safest place. 🤗",
  7: "Your love is the sweetest symphony, and every kiss writes a new verse in our story. 💋",
  8: "Happy Valentine's Day, my love! You are my greatest adventure, my deepest love, and my forever valentine. Every day with you is a celebration of love. ❤️"
};

// Puzzle instructions
export const PUZZLE_INSTRUCTIONS: Record<number, string> = {
  1: "Arrange the roses in the correct pattern to reveal your special message!",
  2: "Decode the secret message to unlock today's love note!",
  3: "Match all the pairs to reveal a sweet surprise!",
  4: "Find all the hidden hearts scattered across the screen!",
  5: "Complete the love story by filling in the blanks!",
  6: "Put the pieces together to complete the picture of love!",
  7: "Trace the path of love from start to finish!",
  8: "Congratulations! You've completed the journey of love!"
};

// Car colors
export const CAR_COLORS = {
  body: '#D32F2F',
  bodyAccent: '#E53935',
  roof: '#B71C1C',
  windows: '#1E88E5',
  wheels: '#1a1a1a',
  wheelRims: '#B0BEC5',
  wheelAccent: '#D32F2F'
} as const;

// Car physics constants
export const CAR_PHYSICS = {
  acceleration: 0.002,
  maxSpeed: 0.15,
  reverseMaxSpeed: 0.2,
  friction: 0.94,
  brakePower: 0.9,
  turnRate: 0.025
} as const;

// Day theme colors
export const DAY_THEMES: Record<number, { primary: string; secondary: string; accent: string }> = {
  1: { primary: '#FF6B6B', secondary: '#FFE5E5', accent: '#DC143C' }, // Rose red
  2: { primary: '#FFD700', secondary: '#FFF8DC', accent: '#B8860B' }, // Golden proposal
  3: { primary: '#8B4513', secondary: '#DEB887', accent: '#D2691E' }, // Chocolate brown
  4: { primary: '#DEB887', secondary: '#FFF8DC', accent: '#CD853F' }, // Teddy tan
  5: { primary: '#9370DB', secondary: '#E6E6FA', accent: '#8A2BE2' }, // Promise purple
  6: { primary: '#FFB6C1', secondary: '#FFF0F5', accent: '#FF69B4' }, // Hug pink
  7: { primary: '#FF1493', secondary: '#FFE4E1', accent: '#C71585' }, // Kiss magenta
  8: { primary: '#FF0000', secondary: '#FFE5E5', accent: '#B22222' }  // Valentine red
};

// Fill in the blank story for Day 5
export const PROMISE_STORY = {
  template: "I promise to always {{blank1}} you, to {{blank2}} with you through every {{blank3}}, and to make you {{blank4}} every single day.",
  blanks: [
    { id: 'blank1', hint: 'an action of affection', answer: 'love' },
    { id: 'blank2', hint: 'be by your side', answer: 'stand' },
    { id: 'blank3', hint: 'ups and downs', answer: 'storm' },
    { id: 'blank4', hint: 'a positive emotion', answer: 'smile' }
  ]
};

// Memory match items for Day 3
export const MEMORY_ITEMS = [
  { id: 1, emoji: '❤️', name: 'heart' },
  { id: 2, emoji: '💕', name: 'hearts' },
  { id: 3, emoji: '💖', name: 'sparkling-heart' },
  { id: 4, emoji: '💗', name: 'growing-heart' },
  { id: 5, emoji: '💘', name: 'cupid' },
  { id: 6, emoji: '💝', name: 'gift-heart' },
  { id: 7, emoji: '🌹', name: 'rose' },
  { id: 8, emoji: '🍫', name: 'chocolate' }
];

// Rose arrangement pattern for Day 1
export const ROSE_PATTERN = [
  { id: 1, color: 'red', position: 0 },
  { id: 2, color: 'pink', position: 1 },
  { id: 3, color: 'red', position: 2 },
  { id: 4, color: 'white', position: 3 },
  { id: 5, color: 'red', position: 4 }
];

// Cipher message for Day 2
export const CIPHER_MESSAGE = {
  encrypted: "L oryh brx zlwk doo pb khduw",
  original: "I love you with all my heart",
  shift: 3
};
