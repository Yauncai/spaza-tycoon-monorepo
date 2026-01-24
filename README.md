# Spaza Tycoon

A React TypeScript conversion of the Spaza Tycoon Web3 Hustle Simulator game, built with Vite. Experience the vibrant world of South African township entrepreneurship with integrated Web3 features for NFT minting and blockchain interactions.

## Features

- **Exact UI Preservation**: Faithful recreation of the original HTML version's interface
- **TypeScript Integration**: Full type safety for robust development
- **React Hooks**: Modern state management with custom hooks
- **Tailwind CSS Styling**: Responsive and modern design system
- **Sound Effects**: Immersive audio using Tone.js
- **Weather Integration**: Real-time weather data via Open-Meteo API
- **Web3 Features**: 
  - Wallet connection and management
  - NFT minting and gallery
  - Gasless transactions
  - ERC-1155 token support
  - Smart wallet integration
- **Responsive Design**: Optimized for desktop and mobile devices
- **Fast Development**: Powered by Vite for rapid iteration

## Web3 Integration

This project includes comprehensive Web3 functionality for blockchain interactions. For detailed information about the Web3 features, including smart contracts, minting processes, and wallet integrations, see [WEB3_INTEGRATION.md](WEB3_INTEGRATION.md).

## Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd spaza-tycoon-monorepo
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Usage

- Connect your Web3 wallet to access NFT features
- Navigate through the game areas using the sidebar
- Mint NFTs, manage your collection, and interact with the shop
- Enjoy the immersive sound effects and weather updates

## Project Structure

```
src/
├── components/          # React components
│   ├── WalletGate.tsx  # Wallet connection overlay
│   ├── GlossaryModal.tsx # Slang dictionary modal
│   ├── Header.tsx      # Top navigation bar
│   ├── Sidebar.tsx     # Left sidebar navigation
│   ├── GameArea.tsx    # Main game interface
│   ├── NFTGallery.tsx  # NFT collection display
│   ├── MintLatjie.tsx  # NFT minting component
│   └── ...             # Other UI components
├── hooks/              # Custom React hooks
│   ├── useSound.ts     # Sound effects hook
│   ├── useWeather.ts   # Weather API hook
│   └── ...             # Web3-related hooks
├── types/              # TypeScript type definitions
│   └── index.ts        # Game interfaces and types
├── data/               # Game data constants
│   └── gameData.ts     # Characters, items, phrases
├── web3/               # Web3 integration
│   ├── config.ts       # Web3 configuration
│   ├── useNFTs.ts      # NFT management hook
│   ├── useGaslessMint.ts # Gasless minting hook
│   └── ...             # Other Web3 utilities
├── App.tsx             # Main app component
├── index.css           # Custom styles
└── main.tsx            # Vite entry point
```

## Available Scripts

- `npm run dev` - Runs the app in development mode with Vite
- `npm run build` - Builds the app for production
- `npm run preview` - Preview the production build locally

## Technologies Used

- **Frontend Framework**: React 18 with TypeScript
- **Build Tool**: Vite
- **Styling**: Tailwind CSS
- **Audio**: Tone.js
- **Weather API**: Open-Meteo
- **Web3 Libraries**: ethers.js, wagmi, and custom hooks for blockchain interactions
- **Development Tools**: ESLint, PostCSS

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the project
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Author

Yauncai - 2026
Nono140503 - 2026