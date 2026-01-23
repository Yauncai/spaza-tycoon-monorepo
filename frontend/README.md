# Spaza Tycoon React + Vite

A React TypeScript conversion of the Spaza Tycoon Web3 Hustle Simulator game, built with Vite.

## Setup Instructions

1. Install dependencies:
```bash
npm install
```

2. Start the development server:
```bash
npm run dev
```

3. Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

## Features

- Exact UI preservation from original HTML version
- TypeScript for type safety
- React hooks for state management
- Tailwind CSS for styling
- Tone.js for sound effects
- Weather API integration
- Responsive design
- Fast development with Vite

## Project Structure

```
src/
├── components/          # React components
│   ├── WalletGate.tsx  # Wallet connection overlay
│   ├── GlossaryModal.tsx # Slang dictionary modal
│   ├── Header.tsx      # Top navigation bar
│   ├── Sidebar.tsx     # Left sidebar navigation
│   └── GameArea.tsx    # Main game interface
├── hooks/              # Custom React hooks
│   ├── useSound.ts     # Sound effects hook
│   └── useWeather.ts   # Weather API hook
├── types/              # TypeScript type definitions
│   └── index.ts        # Game interfaces
├── data/               # Game data constants
│   └── gameData.ts     # Characters, items, phrases
├── App.tsx             # Main app component
├── index.css           # Custom styles
└── main.tsx            # Vite entry point
```

## Available Scripts

- `npm run dev` - Runs the app in development mode with Vite
- `npm run build` - Builds the app for production
- `npm run preview` - Preview the production build

## Technologies Used

- React 18
- TypeScript
- Vite
- Tailwind CSS
- Tone.js
- Open-Meteo Weather API