# Love's Odyssey: Valentine's Week Journey

Love isn't easy. It's effort, persistence, figuring things out together, and enjoying the process along the way.  
This project is a playful reflection of that idea.

## Overview

Love's Odyssey is an 8-day interactive Valentine's Week experience. Each day unlocks a new puzzle and a new message. It is designed for couples to sit together, solve together, and celebrate the small wins that make relationships meaningful.

## Why it exists

Relationships thrive when two people choose to show up, work through challenges, and enjoy the wins together.  
This app mirrors that: you solve puzzles day by day, unlock memories and messages, and move forward together.

## Product experience

1. Open the site and start the journey.
2. Complete each day's puzzle to unlock the next.
3. Read the message together and move to the next day.

## System design

The app uses a hybrid client and server model:

- Client side state handles moment-to-moment interactions and animations.
- A signed progress cookie on the server prevents skipping ahead and keeps progress consistent.
- A lightweight API endpoint updates and reads progress state.

### Core flows

- Enter day page
  - If the day is locked, redirect to Journey.
  - If unlocked, render puzzle.
- Complete puzzle
  - Update local storage.
  - Call progress API to advance signed cookie.
  - Unlock message and show celebration.

### Security model

- Progress cookie is signed server-side.
- Client storage is treated as optimistic UI, not the source of truth.
- Middleware gates access to locked days.

## Architecture

```
src/
  app/                  App Router pages
    day/                Day routes
    journey/            3D journey experience
    api/progress/       Progress API endpoint
  components/
    puzzles/            Day puzzle components
    journey3d/          3D scene and controls
    ui/                 Buttons, navbar, footer, etc.
  context/              Journey state management
  lib/                  Constants and helpers
  assets/               SVG and static assets
```

## Key modules

- `src/context/JourneyContext.tsx`
  - Central state for progress, messages, and access.
- `src/lib/progressCookie.ts`
  - Cookie signing and validation helpers.
- `src/app/api/progress/route.ts`
  - Progress API for unlocking days.
- `src/middleware.ts`
  - Route guard for locked day pages.
- `src/components/puzzles/`
  - All puzzle implementations by day.
- `src/components/journey3d/`
  - 3D scene, car controls, and map.

## Data model

Local progress:

```ts
{
  version: "1.0",
  currentDay: number,
  completedDays: number[],
  puzzleProgress: Record<string, unknown>,
  unlockedMessages: string[],
  startDate: string,
  lastVisit: string
}
```

Server progress:

- Signed cookie storing the current unlocked day.

## Deployment

The project deploys on Vercel. Use `vercel.json` for build and install commands.

## Analytics

Google tag is injected in the app layout to track page views and engagement.

## Development

```bash
npm install
npm run dev
```

Open `http://localhost:3000` in your browser.

## Tech stack

- Next.js (App Router)
- React
- Tailwind CSS
- Framer Motion
- Three.js

## License

Personal project. All rights reserved.
