# ⚡ SweatBet Quick Start

Get SweatBet running in 5 minutes!

## 🚀 Fastest Path to Live

### 1️⃣ Clone & Install (1 min)

```bash
git clone https://github.com/yourusername/sweatbet.git
cd sweatbet
npm install
```

### 2️⃣ Environment Setup (2 min)

```bash
cp .env.example .env.local
```

Edit `.env.local` and add:
- `NEXT_PUBLIC_NEYNAR_API_KEY` from [neynar.com](https://neynar.com)
- `NEXT_PUBLIC_STRAVA_CLIENT_ID` and `SECRET` from [strava.com/settings/api](https://www.strava.com/settings/api)

### 3️⃣ Run Dev Server (30 sec)

```bash
npm run dev
```

Open http://localhost:3000/?usernames=alice,bob&betId=1

### 4️⃣ Deploy to Vercel (1 min)

Click this button:

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/yourusername/sweatbet)

Add the same environment variables.

### 5️⃣ Deploy Contracts (30 sec)

```bash
# Add PRIVATE_KEY to .env
npm run deploy:alfajores
```

Copy the contract address to `.env.local` and redeploy on Vercel.

## 🎉 You're Live!

Share on Farcaster:
```
🏃💪 Join SweatBet! Bet 10 cUSD, run 5km, winners take all!
@friend1 @friend2 @friend3

https://your-app.vercel.app/?usernames=friend1,friend2,friend3&betId=1
```

## 📖 Full Guide

See [DEPLOYMENT_GUIDE.md](./DEPLOYMENT_GUIDE.md) for complete instructions.

## 🆘 Need Help?

- Check the [README.md](./README.md)
- Open an [issue](https://github.com/yourusername/sweatbet/issues)
- Ask in Farcaster dev channels

---

**Let's make fitness social again!** 💪🏃💰
