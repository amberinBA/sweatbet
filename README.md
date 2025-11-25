# 💪 SweatBet - Group Betting on Strava Workouts

**The viral group-chat betting app that feels like iMessage + Venmo + Strava had a baby on Farcaster.**

SweatBet is a Farcaster Mini App where groups can bet on completing workout challenges together. Prove your workouts with ZK proofs from Strava via VLayer TLSNotary, all happening inside an XMTP group chat with on-chain escrow on Celo.

## 🎯 Features

- **🚀 Launch from Farcaster**: Embedded Mini App URL in any cast
- **💬 Group Chat Experience**: Auto-creates XMTP group with everyone tagged
- **💰 On-Chain Betting**: Escrow smart contract on Celo with cUSD
- **🏃 Strava Integration**: OAuth + VLayer ZK proofs (hide GPS, keep distance/time)
- **🎉 Auto Payouts**: Winners automatically paid after deadline + proof verification
- **📱 Mobile-First**: Beautiful gradient UI optimized for Warpcast

## 🛠️ Tech Stack

- **Frontend**: Next.js 14 (App Router) + TypeScript + Tailwind CSS
- **Wallet**: Farcaster Frame SDK + wagmi + viem + OnchainKit
- **Messaging**: XMTP React SDK (full group chat)
- **Blockchain**: Celo Sepolia (testnet) + Celo Mainnet
- **Proofs**: VLayer Web Prover (TLSNotary)
- **Social**: Neynar API (username → address resolution)
- **Fitness**: Strava OAuth v3

## 🎉 Deployed Version

- **Live App**: https://sweatbet-sigma.vercel.app
- **Contract (Sepolia)**: `0xFe225414c1288CC0678806fC1B358a99b1317b83`
- **USDC (Sepolia)**: `0x01C5C0122039549AD1493B8220cABEdD739BC44E`
- **GitHub**: https://github.com/amberinBA/sweatbet

## 📦 Quick Start

### 1. Clone and Install

```bash
git clone https://github.com/yourusername/sweatbet.git
cd sweatbet
npm install
```

### 2. Set Up Environment Variables

Copy `.env.example` to `.env.local`:

```bash
cp .env.example .env.local
```

Fill in the required keys:

```env
# Get from https://neynar.com
NEXT_PUBLIC_NEYNAR_API_KEY=your_neynar_key

# Get from https://www.strava.com/settings/api
NEXT_PUBLIC_STRAVA_CLIENT_ID=1def7e7b-f0d4-4121-b006-b25b83317cc
NEXT_PUBLIC_STRAVA_CLIENT_SECRET=your_strava_secret

# Deploy contracts (see step 3)
NEXT_PUBLIC_ESCROW_CONTRACT_ALFAJORES=0x...
NEXT_PUBLIC_ESCROW_CONTRACT_MAINNET=0x...

# Your deployed app URL
NEXT_PUBLIC_APP_URL=https://sweatbet.vercel.app
```

### 3. Deploy Smart Contracts

#### Install Foundry (if not installed)

```bash
curl -L https://foundry.paradigm.xyz | bash
foundryup
```

#### Deploy to Celo Alfajores Testnet

```bash
cd contracts

# Get Alfajores cUSD faucet: https://faucet.celo.org/alfajores

forge create BettingEscrow \
  --rpc-url https://alfajores-forno.celo-testnet.org \
  --private-key YOUR_PRIVATE_KEY \
  --constructor-args 0xF194afDf50B03e69Bd7D057c1Aa9e10c9954E4C9 YOUR_TREASURY_ADDRESS

# Save the deployed contract address to .env.local
```

#### Deploy to Celo Mainnet

```bash
forge create BettingEscrow \
  --rpc-url https://forno.celo.org \
  --private-key YOUR_PRIVATE_KEY \
  --constructor-args 0x765DE816845861e75A25fCA122bb6898B8B1282a YOUR_TREASURY_ADDRESS
```

### 4. Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

### 5. Test with URL Parameters

```
http://localhost:3000/?usernames=doss,adityaxx,0x123&betId=1
```

## 🚀 Deploy to Vercel

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/yourusername/sweatbet&env=NEXT_PUBLIC_NEYNAR_API_KEY,NEXT_PUBLIC_STRAVA_CLIENT_ID,NEXT_PUBLIC_STRAVA_CLIENT_SECRET,NEXT_PUBLIC_ESCROW_CONTRACT_ALFAJORES,NEXT_PUBLIC_ESCROW_CONTRACT_MAINNET)

1. Click "Deploy"
2. Add environment variables
3. Deploy!
4. Copy your deployment URL

## 📝 Register on Farcaster

### Manual Registration

1. Go to [create.farcaster.xyz](https://create.farcaster.xyz)
2. Fill in app details:
   - **Name**: SweatBet
   - **Icon URL**: `https://your-domain.vercel.app/icon.png`
   - **Home URL**: `https://your-domain.vercel.app`
   - **Splash Image**: `https://your-domain.vercel.app/splash.png`
   - **Splash Color**: `#9333ea`
3. Submit and get your Mini App URL

### Pre-filled Manifest

Use the included `public/manifest.json` (update domain):

```json
{
  "frame": {
    "version": "1",
    "name": "SweatBet",
    "iconUrl": "https://your-domain.vercel.app/icon.png",
    "homeUrl": "https://your-domain.vercel.app"
  }
}
```

## 🎮 How to Use

### As an Organizer

1. **Create a Bet**:
   ```
   Create new bet on contract with target distance, deadline, and bet amount
   ```

2. **Share Farcaster Cast**:
   ```
   🏃 SweatBet Challenge! 💪
   
   Bet 10 cUSD → Run 5km by Sunday
   Winners split the pot! 💰
   
   @alice @bob @charlie - you in?
   
   [SweatBet Mini App]
   https://sweatbet.app/?usernames=alice,bob,charlie&betId=123
   ```

### As a Participant

1. **Open Mini App** from the cast
2. **Auto-join XMTP group** with other participants
3. **Click "BET 10 cUSD"** to approve + escrow your bet
4. **Complete your workout** before deadline
5. **Click "PROVE WORKOUT"**:
   - Connect Strava
   - Select qualifying activity
   - Generate ZK proof (hides GPS data)
   - Submit on-chain
6. **Automatic payout** after deadline - winners split the pot!

### In-Chat Commands

Type in the XMTP group chat:

- `!bet` - Place your bet
- `!prove` - Start proof flow
- Regular messages work too!

## 🧪 Testing Flow (2 Accounts)

### Account A (Alice)

```bash
# 1. Get Alfajores cUSD from faucet
# 2. Create bet on contract
# 3. Share cast with Mini App URL
# 4. Open app and join XMTP group
# 5. Place bet (approve + escrow cUSD)
# 6. Do a 5km+ Strava run
# 7. After deadline, prove workout
```

### Account B (Bob)

```bash
# 1. Get Alfajores cUSD from faucet
# 2. Click Mini App URL from Alice's cast
# 3. Auto-join XMTP group
# 4. Place bet
# 5. Do a 5km+ Strava run
# 6. After deadline, prove workout
```

### Both Winners?

- Contract splits pool minus 2% fee
- Each gets 49% of total pot
- Auto-announced in group chat

### One Winner Only?

- Winner gets 98% of pot (2% protocol fee)
- Loser's bet goes to winner
- Announced with celebration emojis 🎉

## 🏗️ Architecture

```
┌─────────────────────────────────────────────────────────┐
│                   Farcaster Cast                        │
│  "🏃 SweatBet Challenge - Run 5km, win 💰"             │
│  [Mini App URL with ?usernames=alice,bob&betId=1]       │
└──────────────────┬──────────────────────────────────────┘
                   │
                   ▼
┌─────────────────────────────────────────────────────────┐
│              SweatBet Mini App (Next.js)                 │
│  • Parse URL params (usernames, betId)                   │
│  • Resolve usernames → addresses (Neynar)                │
│  • Connect Farcaster wallet (wagmi)                      │
└──────────────────┬──────────────────────────────────────┘
                   │
                   ▼
┌─────────────────────────────────────────────────────────┐
│           XMTP Group Chat Component                      │
│  • Auto-create group with all participants               │
│  • Show challenge details (distance, deadline, pot)      │
│  • Listen for commands (!bet, !prove)                    │
│  • Real-time message streaming                           │
└──────────────────┬──────────────────────────────────────┘
                   │
      ┌────────────┼────────────┐
      ▼            ▼            ▼
┌──────────┐ ┌──────────┐ ┌──────────────┐
│   Celo   │ │  Strava  │ │    VLayer    │
│ Contract │ │  OAuth   │ │  TLSNotary   │
│          │ │          │ │              │
│ • Escrow │ │ • Get    │ │ • Generate   │
│ • Verify │ │   token  │ │   ZK proof   │
│ • Payout │ │ • Fetch  │ │ • Compress   │
│          │ │   runs   │ │   proof      │
└──────────┘ └──────────┘ └──────────────┘
```

## 📄 Smart Contract Functions

### BettingEscrow.sol

```solidity
// Create new bet challenge
createBet(betAmount, targetDistance, deadline, activityType)

// Participant places bet
placeBet(betId)

// Submit ZK proof from VLayer
submitZKProof(betId, zkProof, claimedDistance)

// Claim winnings
claimWinnings(betId)

// View bet details
getBetDetails(betId)
```

### Key Features

- ✅ Escrow with cUSD (ERC-20)
- ✅ 2% protocol fee to treasury
- ✅ ZK proof verification
- ✅ Automatic winner calculation
- ✅ Split payouts among winners
- ✅ Reentrancy protection
- ✅ Ownable (treasury updates)

## 🔐 Security & Privacy

### VLayer ZK Proofs

- **Public**: Distance, time, activity type, date
- **Private**: GPS coordinates, map data, segments, personal stats
- **How**: TLSNotary proves Strava response without revealing sensitive data

### Smart Contract

- OpenZeppelin security libraries
- ReentrancyGuard on payouts
- No admin control over user funds
- Open source & auditable

## 🎨 Design System

### Colors

- Purple: `#9333ea` (`sweat-purple`)
- Pink: `#ec4899` (`sweat-pink`)
- Gradient: `from-sweat-purple to-sweat-pink`

### Emojis

- 💪 Challenge/strength
- 🏃 Running/proving
- 💰 Money/betting
- 🔒 Escrow/locked
- 🎉 Winner/celebration
- ⏱️ Time/deadline
- 📏 Distance
- 👥 Participants

### Typography

- Font: Inter (bold for headings)
- Mobile-first responsive

## 🤝 Contributing

Pull requests welcome! For major changes, please open an issue first.

## 📜 License

MIT

## 🔗 Links

- [Farcaster Docs](https://docs.farcaster.xyz/)
- [XMTP Docs](https://xmtp.org/docs)
- [Celo Docs](https://docs.celo.org/)
- [VLayer Docs](https://docs.vlayer.xyz/)
- [Strava API](https://developers.strava.com/)
- [Neynar API](https://docs.neynar.com/)

## 💡 Ideas for Enhancement

- [ ] Support multiple activity types (Ride, Swim, Hike)
- [ ] Recurring weekly challenges
- [ ] Leaderboards
- [ ] Team vs team betting
- [ ] Custom bet amounts per person
- [ ] NFT badges for winners
- [ ] Integration with Apple Health / Google Fit
- [ ] Group video celebrations

---

**Built with 💜 for the Farcaster community**

Ready to make your friends sweat? 🏃💦
