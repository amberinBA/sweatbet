# 🚀 SweatBet Deployment Guide

Complete step-by-step guide to get SweatBet live on Farcaster.

## Prerequisites

- Node.js 18+ installed
- A GitHub account
- A Vercel account (free)
- A Celo wallet with some CELO for gas (get from [faucet](https://faucet.celo.org/alfajores))
- Farcaster account

## Step 1: Get API Keys

### 1.1 Neynar API Key

1. Go to [neynar.com](https://neynar.com)
2. Sign up for a free account
3. Navigate to API Keys
4. Create a new API key
5. Copy the key (starts with `NEYNAR_...`)

### 1.2 Strava API Credentials

1. Go to [strava.com/settings/api](https://www.strava.com/settings/api)
2. Create a new application:
   - **Application Name**: SweatBet
   - **Category**: Social Fitness
   - **Website**: `https://your-domain.vercel.app` (update later)
   - **Authorization Callback Domain**: `your-domain.vercel.app`
3. Copy your **Client ID** and **Client Secret**

### 1.3 VLayer API Key (Already Provided)

✅ Already in `.env.example`: `snzfsu7faMU9WpfqAXDFEV1dyYNHSrlxloHnflOLNELhULHyASvl4etJUV`

## Step 2: Deploy Smart Contracts

### 2.1 Install Dependencies

```bash
npm install
```

### 2.2 Set Up Wallet

Create a `.env` file in the root:

```env
PRIVATE_KEY=your_wallet_private_key_without_0x
```

⚠️ **Security**: Never commit this file. It's already in `.gitignore`.

### 2.3 Get Test CELO

1. Visit [faucet.celo.org/alfajores](https://faucet.celo.org/alfajores)
2. Enter your wallet address
3. Receive test CELO and cUSD

### 2.4 Deploy to Alfajores (Testnet)

```bash
npm run deploy:alfajores
```

Expected output:
```
✅ BettingEscrow deployed to: 0xYourContractAddress
Add to your .env.local:
NEXT_PUBLIC_ESCROW_CONTRACT_ALFAJORES=0xYourContractAddress
```

### 2.5 Deploy to Celo Mainnet (When Ready)

```bash
npm run deploy:celo
```

⚠️ Make sure you have real CELO for gas fees!

## Step 3: Deploy Frontend to Vercel

### 3.1 Push to GitHub

```bash
git init
git add .
git commit -m "Initial commit: SweatBet"
git remote add origin https://github.com/yourusername/sweatbet.git
git push -u origin main
```

### 3.2 Deploy on Vercel

1. Go to [vercel.com](https://vercel.com)
2. Click "New Project"
3. Import your GitHub repository
4. Add Environment Variables:

```env
NEXT_PUBLIC_NEYNAR_API_KEY=your_neynar_key
NEXT_PUBLIC_VLAYER_API_KEY=snzfsu7faMU9WpfqAXDFEV1dyYNHSrlxloHnflOLNELhULHyASvl4etJUV
NEXT_PUBLIC_STRAVA_CLIENT_ID=your_strava_client_id
NEXT_PUBLIC_STRAVA_CLIENT_SECRET=your_strava_secret
NEXT_PUBLIC_ESCROW_CONTRACT_ALFAJORES=0xYourAlfajoresContract
NEXT_PUBLIC_ESCROW_CONTRACT_MAINNET=0xYourMainnetContract
NEXT_PUBLIC_CUSD_ALFAJORES=0xF194afDf50B03e69Bd7D057c1Aa9e10c9954E4C9
NEXT_PUBLIC_CUSD_MAINNET=0x765DE816845861e75A25fCA122bb6898B8B1282a
NEXT_PUBLIC_APP_URL=https://your-project.vercel.app
```

5. Click "Deploy"
6. Wait for deployment (1-2 minutes)
7. Copy your deployment URL: `https://sweatbet-xxx.vercel.app`

### 3.3 Update Strava Callback

1. Go back to [strava.com/settings/api](https://www.strava.com/settings/api)
2. Update **Authorization Callback Domain** to your Vercel domain (without `https://`)
3. Save

## Step 4: Test Your Deployment

### 4.1 Create Test Bet

On Alfajores testnet, interact with your contract:

```javascript
// Using Hardhat console or Remix
const escrow = await ethers.getContractAt("BettingEscrow", "0xYourContract");
const tx = await escrow.createBet(
  ethers.utils.parseEther("10"), // 10 cUSD
  5000, // 5km in meters
  Math.floor(Date.now() / 1000) + 7 * 24 * 60 * 60, // 7 days from now
  "Run"
);
const receipt = await tx.wait();
console.log("Bet ID:", receipt.events[0].args.betId);
```

### 4.2 Test Full Flow

1. Open your app with test parameters:
```
https://your-project.vercel.app/?usernames=alice,bob&betId=1
```

2. Connect Farcaster wallet
3. Join XMTP group
4. Place bet (approve + escrow)
5. Do a Strava workout
6. After deadline, prove workout
7. Claim winnings!

## Step 5: Register on Farcaster

### 5.1 Update Manifest

Edit `public/manifest.json`:

```json
{
  "frame": {
    "version": "1",
    "name": "SweatBet",
    "iconUrl": "https://your-project.vercel.app/icon.png",
    "splashImageUrl": "https://your-project.vercel.app/splash.png",
    "homeUrl": "https://your-project.vercel.app"
  }
}
```

### 5.2 Create Assets

You need to create:
- `public/icon.png` (512x512px) - App icon
- `public/splash.png` (1200x630px) - Splash screen

Design tips:
- Use purple (#9333ea) to pink (#ec4899) gradient
- Include 💪 or 🏃 emoji
- Bold, clear text

### 5.3 Submit to Farcaster

1. Go to [create.farcaster.xyz](https://create.farcaster.xyz)
2. Sign in with Farcaster
3. Click "New Mini App"
4. Fill in details:
   - **Name**: SweatBet
   - **Description**: "Bet on workouts with friends. Prove with Strava. Win with ZK."
   - **Icon URL**: `https://your-project.vercel.app/icon.png`
   - **Splash URL**: `https://your-project.vercel.app/splash.png`
   - **Home URL**: `https://your-project.vercel.app`
   - **Splash Color**: `#9333ea`
5. Submit
6. Wait for approval (usually 24-48 hours)

## Step 6: Go Live! 🎉

### 6.1 Create Your First Cast

```
🏃💪 Introducing SweatBet! 

Bet with friends on workout challenges.
Prove with Strava. Winners take all. 💰

@alice @bob @charlie - Ready to sweat?

[Open SweatBet]
https://your-project.vercel.app/?usernames=alice,bob,charlie&betId=1
```

### 6.2 Share URL Format

```
https://your-project.vercel.app/?usernames=user1,user2,user3&betId=YOUR_BET_ID
```

Parameters:
- `usernames`: Comma-separated Farcaster usernames
- `betId`: The bet ID from your smart contract

### 6.3 Monitor Activity

- Check XMTP groups in [xmtp.chat](https://xmtp.chat)
- Watch contract events on [alfajores.celoscan.io](https://alfajores.celoscan.io)
- Monitor casts for engagement

## Troubleshooting

### Contract Deployment Fails

- **Out of gas**: Increase gas limit in Hardhat config
- **Insufficient funds**: Get more CELO from faucet
- **Wrong network**: Double-check RPC URL

### XMTP Group Not Creating

- Ensure all addresses are valid Ethereum addresses
- Check that participants have XMTP enabled
- Verify network connectivity

### Strava OAuth Fails

- Confirm callback domain matches Vercel URL (no trailing slash)
- Check client ID/secret are correct
- Ensure redirect URI is properly formatted

### Proof Generation Fails

- Verify VLayer API key is correct
- Check that activity meets criteria (5km+, before deadline)
- Ensure Strava token hasn't expired

### Transaction Reverts

- **Insufficient allowance**: User needs to approve cUSD first
- **Already bet**: User already placed bet for this challenge
- **Deadline passed**: Can't bet after deadline
- **Wrong amount**: Bet amount must match challenge amount

## Maintenance

### Update Contract Address

If you redeploy the contract:

1. Update `.env.local`
2. Push to Vercel
3. Update old casts with new URL

### Monitor Protocol Fees

Check treasury balance:
```javascript
const balance = await cUSD.balanceOf(treasuryAddress);
console.log("Treasury:", ethers.utils.formatEther(balance), "cUSD");
```

### Upgrade to Mainnet

When ready for production:

1. Deploy contract to Celo mainnet
2. Update `NEXT_PUBLIC_ESCROW_CONTRACT_MAINNET`
3. Redeploy on Vercel
4. Test with small amounts first
5. Announce mainnet launch!

## Support

- **Issues**: [GitHub Issues](https://github.com/yourusername/sweatbet/issues)
- **Farcaster**: Tag @sweatbet
- **Discord**: Join Farcaster dev community

---

**Ready to make your friends sweat?** 💪🏃💰

Let's go! 🚀
