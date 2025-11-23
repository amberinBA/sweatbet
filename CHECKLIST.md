# ✅ SweatBet Go-Live Checklist

Use this checklist to ensure everything is ready before launching on Farcaster.

## Pre-Launch (Development)

### Environment Setup
- [ ] Cloned repository
- [ ] Ran `npm install` successfully
- [ ] Created `.env.local` from `.env.example`
- [ ] Added Neynar API key
- [ ] Added Strava Client ID and Secret
- [ ] Set APP_URL (at least to localhost for testing)

### Local Testing
- [ ] `npm run dev` runs without errors
- [ ] Can access http://localhost:3000
- [ ] URL params work: `?usernames=test1,test2&betId=1`
- [ ] TypeScript compiles: `npx tsc --noEmit`
- [ ] No console errors in browser

### Contract Deployment (Testnet)
- [ ] Created wallet for deployment
- [ ] Got test CELO from [faucet.celo.org/alfajores](https://faucet.celo.org/alfajores)
- [ ] Added `PRIVATE_KEY` to `.env` (NOT .env.local!)
- [ ] Ran `npm run deploy:alfajores`
- [ ] Contract deployed successfully
- [ ] Copied contract address to `.env.local` as `NEXT_PUBLIC_ESCROW_CONTRACT_ALFAJORES`
- [ ] Verified contract on [alfajores.celoscan.io](https://alfajores.celoscan.io)
- [ ] Can view contract on explorer

### Integration Testing
- [ ] Created test bet using `scripts/create-bet.js`
- [ ] Noted bet ID for testing
- [ ] Connected Farcaster wallet (testnet)
- [ ] Joined XMTP group successfully
- [ ] Placed test bet (approved cUSD)
- [ ] Bet escrowed on-chain
- [ ] Connected Strava OAuth
- [ ] Selected test activity
- [ ] Generated ZK proof
- [ ] Submitted proof on-chain
- [ ] Viewed transaction on Celoscan

## Design Assets

### Icon (512x512px)
- [ ] Created `public/icon.png`
- [ ] Verified dimensions: 512x512px exactly
- [ ] PNG format with transparency (optional)
- [ ] File size < 500KB
- [ ] Uses brand colors (purple-pink gradient)
- [ ] Includes emoji or logo
- [ ] Readable at small sizes
- [ ] Tested on light and dark backgrounds

### Splash Screen (1200x630px)
- [ ] Created `public/splash.png`
- [ ] Verified dimensions: 1200x630px exactly
- [ ] PNG format
- [ ] File size < 1MB
- [ ] Uses brand gradient
- [ ] Includes app name "SweatBet"
- [ ] Includes tagline/description
- [ ] Emojis are clear (💪🏃💰)
- [ ] Text is readable

## Frontend Deployment

### GitHub
- [ ] Created GitHub repository
- [ ] Pushed code: `git push origin main`
- [ ] Repository is public (or private with Vercel access)
- [ ] README updated with your repo URL
- [ ] .env files are gitignored (security check)

### Vercel
- [ ] Connected GitHub to Vercel
- [ ] Imported SweatBet repository
- [ ] Added all environment variables:
  - [ ] `NEXT_PUBLIC_NEYNAR_API_KEY`
  - [ ] `NEXT_PUBLIC_VLAYER_API_KEY`
  - [ ] `NEXT_PUBLIC_STRAVA_CLIENT_ID`
  - [ ] `NEXT_PUBLIC_STRAVA_CLIENT_SECRET`
  - [ ] `NEXT_PUBLIC_ESCROW_CONTRACT_ALFAJORES`
  - [ ] `NEXT_PUBLIC_CUSD_ALFAJORES`
  - [ ] `NEXT_PUBLIC_APP_URL` (your-app.vercel.app)
- [ ] Deployment succeeded
- [ ] No build errors
- [ ] Can access deployed URL
- [ ] Test page loads correctly

### Strava Configuration
- [ ] Logged into [strava.com/settings/api](https://www.strava.com/settings/api)
- [ ] Updated Authorization Callback Domain to Vercel domain (without https://)
- [ ] Saved changes
- [ ] Tested OAuth flow from deployed app

## Farcaster Registration

### Manifest
- [ ] Updated `public/manifest.json` with your domain
- [ ] `iconUrl` points to your deployed icon.png
- [ ] `splashImageUrl` points to your splash.png
- [ ] `homeUrl` is your Vercel URL
- [ ] Manifest accessible at `your-domain.vercel.app/manifest.json`

### Registration
- [ ] Visited [create.farcaster.xyz](https://create.farcaster.xyz)
- [ ] Signed in with Farcaster account
- [ ] Clicked "New Mini App"
- [ ] Filled all required fields:
  - [ ] Name: SweatBet
  - [ ] Description: Clear, compelling
  - [ ] Icon URL: your-domain.vercel.app/icon.png
  - [ ] Splash URL: your-domain.vercel.app/splash.png
  - [ ] Home URL: your-domain.vercel.app
  - [ ] Splash Color: #9333ea
- [ ] Submitted application
- [ ] Received confirmation
- [ ] Awaiting approval (24-48 hours)

## Final Testing (Production)

### End-to-End Flow
- [ ] Opened deployed app with real usernames
- [ ] XMTP group created successfully
- [ ] Connected real Farcaster wallet
- [ ] Bet placement works on testnet
- [ ] Strava OAuth redirects correctly
- [ ] Activity list loads from Strava
- [ ] Proof generation completes
- [ ] Transaction confirms on-chain
- [ ] No errors in browser console
- [ ] Mobile view tested (responsive)
- [ ] Works in Warpcast app

### Performance
- [ ] Page loads in < 3 seconds
- [ ] No layout shift
- [ ] Images load properly
- [ ] Wallet connects quickly
- [ ] Transactions process smoothly

## Mainnet (When Ready)

### Contract Deployment
- [ ] Got real CELO for gas
- [ ] Ran `npm run deploy:celo`
- [ ] Verified mainnet contract
- [ ] Updated `.env.local` with mainnet address
- [ ] Redeployed to Vercel with mainnet vars

### Safety Checks
- [ ] Started with small bet amounts (10 cUSD)
- [ ] Tested with trusted friends first
- [ ] Monitored first few transactions
- [ ] Treasury receiving 2% fees correctly
- [ ] Payouts calculating correctly

## Launch Day

### First Cast
- [ ] Created engaging announcement cast
- [ ] Tagged 3-5 friends
- [ ] Included clear call-to-action
- [ ] Added Mini App link with params
- [ ] Posted at high-engagement time
- [ ] Shared in relevant channels

### Monitoring
- [ ] Watching for cast engagement
- [ ] Monitoring contract events on Celoscan
- [ ] Checking XMTP group activity
- [ ] Responding to questions quickly
- [ ] Tracking user feedback

### Support
- [ ] GitHub Issues enabled
- [ ] Ready to respond to bug reports
- [ ] Documentation links shared
- [ ] Community support channel ready

## Post-Launch (Week 1)

### Metrics to Track
- [ ] Number of unique users
- [ ] Total bets placed
- [ ] Total volume (cUSD)
- [ ] Completion rate (proofs submitted)
- [ ] Winner rate
- [ ] Cast engagement (likes/recasts)
- [ ] GitHub stars/forks

### Engagement
- [ ] Daily check-ins on activity
- [ ] Respond to all user questions
- [ ] Share winner celebrations
- [ ] Create follow-up casts
- [ ] Engage with community

### Improvements
- [ ] Collect user feedback
- [ ] Note feature requests
- [ ] Fix critical bugs ASAP
- [ ] Update documentation
- [ ] Plan next features

## Long-Term

### Growth
- [ ] Partner with fitness influencers
- [ ] Create weekly community challenges
- [ ] Share success stories
- [ ] Build referral system
- [ ] Expand to other platforms

### Development
- [ ] Add requested features
- [ ] Improve UX based on feedback
- [ ] Optimize gas costs
- [ ] Add more activity types
- [ ] Build admin dashboard

### Community
- [ ] Create Discord/Telegram
- [ ] Host AMAs
- [ ] Reward early adopters
- [ ] Build brand partnerships
- [ ] Contribute back to ecosystem

---

## 🚨 Critical Items (Don't Skip!)

1. ✅ Test FULL flow on testnet before mainnet
2. ✅ Double-check all environment variables
3. ✅ Verify contract on Celoscan
4. ✅ Update Strava callback URL
5. ✅ Create proper icon.png and splash.png
6. ✅ Test mobile view in Warpcast
7. ✅ Start with small bet amounts
8. ✅ Have support plan ready

---

## 📞 Need Help?

Stuck on a step? Check:
- [QUICKSTART.md](./QUICKSTART.md) for fast setup
- [DEPLOYMENT_GUIDE.md](./DEPLOYMENT_GUIDE.md) for detailed steps
- [PROJECT_STRUCTURE.md](./PROJECT_STRUCTURE.md) for code help
- GitHub Issues for technical problems

---

**Ready to launch?** Let's make fitness social! 🚀💪🏃
