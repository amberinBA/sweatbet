# 📁 SweatBet Project Structure

Complete overview of the codebase organization.

## Directory Tree

```
sweatbet/
├── app/                          # Next.js App Router
│   ├── layout.tsx               # Root layout with providers
│   ├── page.tsx                 # Main app entry (group chat)
│   ├── prove/                   # Proof submission flow
│   │   └── page.tsx            # Activity selection & proof generation
│   ├── api/                     # API routes
│   │   └── strava/
│   │       └── callback/
│   │           └── route.ts    # Strava OAuth callback
│   ├── globals.css             # Global styles (Tailwind)
│   └── providers.tsx           # Wagmi + React Query providers
│
├── components/                  # React components
│   └── XMTPGroupChat.tsx       # Full XMTP group chat with betting UI
│
├── lib/                         # Core utilities & business logic
│   ├── wagmi.ts                # Wagmi config with Farcaster connector
│   ├── contracts.ts            # Contract ABIs & helpers
│   ├── vlayer-prover.ts        # VLayer ZK proof generation
│   └── neynar.ts               # Farcaster username resolution
│
├── contracts/                   # Smart contracts
│   └── BettingEscrow.sol       # Main betting escrow contract
│
├── scripts/                     # Deployment & utility scripts
│   ├── deploy.js               # Hardhat deployment script
│   └── create-bet.js           # Helper to create new bets
│
├── public/                      # Static assets
│   ├── manifest.json           # Farcaster Mini App manifest
│   ├── icon.png               # App icon (512x512) [YOU CREATE]
│   └── splash.png             # Splash screen (1200x630) [YOU CREATE]
│
├── .env.example                # Environment variables template
├── .env.local                  # Your local environment (gitignored)
├── .gitignore                  # Git ignore rules
├── package.json                # Dependencies & scripts
├── tsconfig.json              # TypeScript configuration
├── next.config.js             # Next.js configuration
├── tailwind.config.js         # Tailwind CSS configuration
├── postcss.config.js          # PostCSS configuration
├── hardhat.config.js          # Hardhat configuration
├── vercel.json                # Vercel deployment config
│
├── README.md                   # Main project documentation
├── QUICKSTART.md              # 5-minute setup guide
├── DEPLOYMENT_GUIDE.md        # Complete deployment walkthrough
├── BRANDING.md                # Design asset specifications
└── PROJECT_STRUCTURE.md       # This file
```

## Key Files Explained

### Frontend Core

#### `app/page.tsx`
- **Purpose**: Main entry point for the Mini App
- **Responsibilities**:
  - Parse URL parameters (`?usernames=...&betId=...`)
  - Resolve usernames to addresses via Neynar
  - Initialize Farcaster wallet connection
  - Render XMTP group chat
  - Handle bet placement and proof submission
- **URL Format**: `/?usernames=alice,bob&betId=1`

#### `components/XMTPGroupChat.tsx`
- **Purpose**: Complete chat interface with betting
- **Features**:
  - Auto-create XMTP group from URL params
  - Real-time message streaming
  - Challenge header with stats
  - Bet and Prove action buttons
  - Command parsing (`!bet`, `!prove`)
- **State**: Manages messages, participants, bet status

#### `app/prove/page.tsx`
- **Purpose**: Workout proof submission flow
- **Steps**:
  1. Receive Strava OAuth token from callback
  2. Fetch recent activities
  3. Filter for qualifying workouts (5km+)
  4. Generate ZK proof via VLayer
  5. Submit proof to smart contract
  6. Redirect back to chat

### Smart Contract

#### `contracts/BettingEscrow.sol`
- **Purpose**: On-chain escrow and verification
- **Key Functions**:
  - `createBet()`: Initialize new challenge
  - `placeBet()`: Deposit cUSD to escrow
  - `submitZKProof()`: Submit VLayer proof
  - `claimWinnings()`: Winners collect payouts
  - `getBetDetails()`: View bet status
- **Features**:
  - ERC-20 cUSD support
  - 2% protocol fee
  - ZK proof verification
  - Winner calculation & payout splitting
  - Reentrancy protection

### Libraries

#### `lib/vlayer-prover.ts`
- **Purpose**: Strava integration + ZK proof generation
- **Functions**:
  - `getStravaAuthUrl()`: Generate OAuth URL
  - `exchangeStravaCode()`: Get access token
  - `getRecentActivities()`: Fetch Strava workouts
  - `generateZKProof()`: Create TLSNotary proof
  - `findQualifyingActivity()`: Filter by criteria
- **Privacy**: Redacts GPS data, keeps distance/time/type

#### `lib/neynar.ts`
- **Purpose**: Farcaster API integration
- **Functions**:
  - `resolveUsernames()`: Convert usernames to addresses
  - `getUserByFid()`: Fetch user by Farcaster ID
  - `getUserByAddress()`: Lookup by Ethereum address
  - `publishCast()`: Post to Farcaster (for winner announcements)

#### `lib/contracts.ts`
- **Purpose**: Contract interaction helpers
- **Exports**:
  - `BETTING_ESCROW_ABI`: Contract interface
  - `ERC20_ABI`: cUSD token interface
  - `formatCUSD()`: Display amounts
  - `parseCUSD()`: Parse input amounts
  - `getContractAddresses()`: Get addresses by chain

#### `lib/wagmi.ts`
- **Purpose**: Web3 configuration
- **Setup**:
  - Farcaster Mini App connector
  - Celo Alfajores (testnet)
  - Celo mainnet
  - HTTP transports

### API Routes

#### `app/api/strava/callback/route.ts`
- **Method**: GET
- **Purpose**: OAuth callback handler
- **Flow**:
  1. Receive `code` and `state` (betId) from Strava
  2. Exchange code for access token
  3. Redirect to `/prove` with token

### Configuration Files

#### `package.json`
- **Scripts**:
  - `npm run dev`: Development server
  - `npm run build`: Production build
  - `npm run deploy:alfajores`: Deploy to testnet
  - `npm run deploy:celo`: Deploy to mainnet

#### `hardhat.config.js`
- **Networks**:
  - Alfajores (testnet): Chain ID 44787
  - Celo (mainnet): Chain ID 42220
- **Features**: Contract verification on Celoscan

#### `vercel.json`
- **Settings**:
  - Build command: `npm run build`
  - CORS headers for manifest.json
  - Region optimization

## Data Flow

### 1. Launch Flow
```
Farcaster Cast
    ↓
User clicks Mini App URL
    ↓
app/page.tsx parses params
    ↓
Neynar resolves usernames → addresses
    ↓
XMTPGroupChat creates/joins group
    ↓
User sees challenge UI + chat
```

### 2. Betting Flow
```
User clicks "BET" button
    ↓
app/page.tsx calls handleBet()
    ↓
1. Approve cUSD (ERC20)
    ↓
2. Call placeBet() on contract
    ↓
Contract emits BetPlaced event
    ↓
XMTP: "!bet" message sent to group
    ↓
UI updates: hasBet = true
```

### 3. Proof Flow
```
User clicks "PROVE" button
    ↓
Redirect to Strava OAuth
    ↓
User authorizes app
    ↓
Callback → app/api/strava/callback
    ↓
Redirect to app/prove with token
    ↓
Load Strava activities
    ↓
User selects qualifying workout
    ↓
generateZKProof() via VLayer
    ↓
submitZKProof() to contract
    ↓
Contract emits ProofSubmitted event
    ↓
XMTP: "@user proved 5.7km!" message
    ↓
Redirect back to chat
```

### 4. Payout Flow
```
Deadline passes
    ↓
Winners click "CLAIM"
    ↓
Contract calculates payout
    ↓
(Total pool - 2% fee) / winner count
    ↓
cUSD transferred to winners
    ↓
XMTP: "🎉 Winners paid!" message
```

## State Management

### Frontend State
- **Wagmi**: Wallet connection, chain state, contract calls
- **React Query**: Async data fetching & caching
- **XMTP SDK**: Message history & streaming
- **React State**: UI state (loading, errors, modals)

### On-Chain State
- **Bet struct**: All challenge data
- **Mappings**: User participation & proofs
- **Events**: Audit trail of all actions

## Security Considerations

### Smart Contract
- ✅ ReentrancyGuard on payouts
- ✅ Access control (Ownable)
- ✅ SafeERC20 for token transfers
- ✅ Input validation on all functions
- ✅ Events for transparency

### Frontend
- ✅ Environment variables for secrets
- ✅ Client-side validation
- ✅ Transaction error handling
- ✅ Rate limiting on API routes
- ✅ CORS configuration

### Privacy (VLayer)
- ✅ GPS data redacted from proofs
- ✅ Only distance/time/type exposed
- ✅ TLSNotary verification
- ✅ No PII in proofs

## Environment Variables

### Required
```env
NEXT_PUBLIC_NEYNAR_API_KEY        # Farcaster username resolution
NEXT_PUBLIC_STRAVA_CLIENT_ID      # Strava OAuth
NEXT_PUBLIC_STRAVA_CLIENT_SECRET  # Strava OAuth
NEXT_PUBLIC_ESCROW_CONTRACT_*     # Deployed contract addresses
```

### Optional
```env
NEXT_PUBLIC_APP_URL               # For OAuth callbacks
PRIVATE_KEY                       # For contract deployment (server only)
```

## Testing

### Local Development
```bash
npm run dev
# Open http://localhost:3000/?usernames=test1,test2&betId=1
```

### Contract Testing
```bash
npx hardhat test                  # Run unit tests
npx hardhat coverage              # Check coverage
```

### Integration Testing
1. Deploy to Alfajores testnet
2. Create test bet with `create-bet.js`
3. Test full flow with 2+ accounts
4. Verify on Celoscan explorer

## Deployment Checklist

- [ ] Update `.env.local` with all keys
- [ ] Deploy contracts to Alfajores
- [ ] Test full flow on testnet
- [ ] Create icon.png and splash.png
- [ ] Push to GitHub
- [ ] Deploy to Vercel
- [ ] Update Strava callback URL
- [ ] Register on create.farcaster.xyz
- [ ] Share first cast!

## Next Steps

1. **Read**: [QUICKSTART.md](./QUICKSTART.md) for 5-min setup
2. **Deploy**: Follow [DEPLOYMENT_GUIDE.md](./DEPLOYMENT_GUIDE.md)
3. **Brand**: Create assets per [BRANDING.md](./BRANDING.md)
4. **Learn**: Check [README.md](./README.md) for features

---

**Ready to build?** Let's make fitness social! 💪🏃
