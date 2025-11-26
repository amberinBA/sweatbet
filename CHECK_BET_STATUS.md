# Why Your Bets Are Failing

## Root Cause: Bet ID 1 Doesn't Exist Yet! ❌

The contract is deployed, but **no bets have been created yet**. You need to call `createBet()` first.

## Quick Fix: Create Bet ID 1

### Option 1: Using Block Explorer (Easiest)

1. Go to contract: https://explorer.celo.org/alfajores/address/0xFe225414c1288CC0678806fC1B358a99b1317b83
2. Click "Write Contract" tab
3. Connect your wallet (must be contract owner)
4. Call `createBet()` with:
   ```
   _betAmount: 1000000000000000000  (1 USDC)
   _targetDistance: 5000             (5 km)
   _deadline: 1735920000             (Jan 3, 2025 or pick your date)
   _activityType: "Run"
   ```
5. Confirm transaction
6. Wait for confirmation
7. Bet ID 1 is now created!

### Option 2: Using Cast (CLI)

```bash
# Install Foundry if needed
curl -L https://foundry.paradigm.xyz | bash

# Create bet
cast send 0xFe225414c1288CC0678806fC1B358a99b1317b83 \
  "createBet(uint256,uint256,uint256,string)" \
  1000000000000000000 \
  5000 \
  $(($(date +%s) + 604800)) \
  "Run" \
  --rpc-url https://alfajores-forno.celo-testnet.org \
  --private-key YOUR_PRIVATE_KEY
```

### Option 3: Using Web3 Console

Open browser console on your app and run:

```javascript
// Assuming you have wagmi/viem loaded
const { writeContract } = useWriteContract();

await writeContract({
  address: '0xFe225414c1288CC0678806fC1B358a99b1317b83',
  abi: BETTING_ESCROW_ABI,
  functionName: 'createBet',
  args: [
    BigInt('1000000000000000000'), // 1 USDC
    BigInt(5000),                  // 5 km
    BigInt(Math.floor(Date.now() / 1000) + 604800), // 7 days from now
    'Run'
  ]
});
```

## Why Participants Don't Show

Participants array is empty because:
1. Bet doesn't exist yet, OR
2. Nobody has placed a bet yet

After creating the bet and someone calls `placeBet(1)`, they'll appear in the participants list.

## Expected Flow

1. ✅ Contract deployed: `0xFe225414c1288CC0678806fC1B358a99b1317b83`
2. ❌ **CREATE BET** (You need to do this!)
3. ✅ Users approve USDC
4. ✅ Users place bets
5. ✅ Participants show up
6. ✅ Users prove workouts
7. ✅ Winners claim

## Check if Bet Exists

Try reading from contract:

```bash
# Using cast
cast call 0xFe225414c1288CC0678806fC1B358a99b1317b83 \
  "getBetDetails(uint256)" 1 \
  --rpc-url https://alfajores-forno.celo-testnet.org
```

If it returns zeros/empty, bet doesn't exist yet.

## After Creating Bet

1. Refresh app: https://sweatbet-sigma.vercel.app/?betId=1
2. You should see bet details populated from contract
3. Place bet should work
4. Participants will show after betting

---

**TL;DR**: Run `createBet()` on the contract first, then betting will work!
