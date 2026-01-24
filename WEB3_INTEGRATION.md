# Spaza Tycoon - Web3 Integration Guide

## Overview

This document outlines the Web3 features integrated into Spaza Tycoon on Base Sepolia, using Coinbase SDK, OnchainKit, wagmi, and viem.

## Features Implemented

### 1. Smart Wallet Auth (Login Screen)

**File:** `src/components/LoginScreen.tsx`

**Hooks:** `src/web3/useSmartWallet.ts`

**Features:**
- Full-screen neubrutalist login overlay
- "Login with Passkey" button powered by Coinbase Smart Wallet SDK
- Automatic wallet creation and connection
- Persisted wallet state in app
- Blocks game until wallet is connected

**How it works:**
1. User clicks "Login with Passkey"
2. Coinbase SDK creates or connects Smart Wallet using biometric/passkey
3. Once connected, LoginScreen disappears and game starts

### 2. Basename Resolution (Identity Header)

**File:** `src/components/Header.tsx`

**Hooks:** `src/web3/useBasename.ts`

**Features:**
- Resolves connected wallet address to Basename (e.g., user.base.eth)
- Displays avatar if available, otherwise gradient avatar
- Gradient colors based on wallet address hash
- Shows in header next to balance

**Dependency:** Requires active wagmi connection and useAccount hook

### 3. NFT Gallery (Stash/Inventory)

**File:** `src/components/NFTGallery.tsx` + `src/components/Sidebar.tsx`

**Hooks:** `src/web3/useNFTs.ts`

**Features:**
- New "Stash" tab in sidebar
- Fetches user's NFTs on Base Sepolia
- Displays "Latjie", "Lepara", "Grootman" characters
- Responsive grid layout matching game aesthetic
- Loading and error states

**Integration:** Click "Stash" button in sidebar to view inventory

### 4. Gasless Minting (Recruit Screen)

**File:** `src/components/GaslessMintPanel.tsx`

**Hooks:** `src/web3/useGaslessMint.ts`

**Features:**
- New "Recruit" tab in sidebar
- "Mint Latjie", "Mint Lepara", "Mint Grootman" buttons
- Sponsored gas via Coinbase Paymaster
- Success/error feedback
- Loading state with spinner

**Integration:** Click "Recruit" button in sidebar to mint characters

## Web3 Setup

### Configuration Files

**`src/web3/config.ts`**
- Wagmi configuration for Base Sepolia
- HTTP transport setup

**`src/main.tsx`**
- WagmiProvider wrapper for entire app
- QueryClientProvider for data fetching

## API References

### useSmartWallet()
```ts
const { wallet, loading, error, connectWallet, disconnect, isConnected } = useSmartWallet()
```

### useBasename()
```ts
const { basenameData, loading, resolveBasename, getDisplayName, getAvatarGradient } = useBasename()
```

### useNFTs()
```ts
const { nfts, loading, error, fetchNFTs } = useNFTs()
```

### useGaslessMint()
```ts
const { mintCharacter, isPending, isSuccess, error, hash, mintedTokenId } = useGaslessMint()
```

## Important Notes

### Paymaster Integration
The gasless minting currently uses a mock contract address. To enable true sponsored transactions:

1. Deploy or use existing NFT contract on Base Sepolia
2. Configure Coinbase Paymaster in `useGaslessMint.ts`
3. Update contract address and ABI

### NFT Fetching
NFT gallery uses Zora API. For production, consider:
- Alchemy API
- Reservoir Protocol
- Custom contract queries

### Basenames API
Basename resolution uses basenames.domains API. Ensure this domain is accessible or use OnchainKit's built-in resolver.

## Next Steps

1. **Deploy Contracts**: Create or deploy NFT contract for character minting
2. **Setup Paymaster**: Configure Coinbase Paymaster for gas sponsorship
3. **Test Network**: Switch from Base Sepolia to Base mainnet
4. **Update APIs**: Replace mock API calls with production endpoints

## Styling Consistency

All Web3 components maintain the game's aesthetic:
- Neubrutalist design (thick borders, bold fonts)
- Yellow/black color scheme
- Material Symbols icons
- Responsive Tailwind layouts

## Troubleshooting

### Smart Wallet not connecting
- Check browser supports WebAuthn
- Clear browser cache and cookies
- Try different device/passkey

### Basenames not resolving
- Verify user has a Basename registered
- Check API endpoint is accessible
- Fallback to address display

### NFTs not loading
- Verify wallet address has NFTs on Base Sepolia
- Check API rate limits
- Ensure correct contract addresses in filters

### Minting not working
- Verify contract deployed and ABI correct
- Check Paymaster is configured
- Ensure sufficient balance (shouldn't be needed with gas sponsorship)
