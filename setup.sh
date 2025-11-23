#!/bin/bash

# SweatBet Setup Script
# Automates initial project setup

set -e

echo "🏃💪 SweatBet Setup Script"
echo "=========================="
echo ""

# Colors
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Check if .env.local exists
if [ -f .env.local ]; then
    echo -e "${YELLOW}⚠️  .env.local already exists${NC}"
    read -p "Overwrite? (y/N): " -n 1 -r
    echo
    if [[ ! $REPLY =~ ^[Yy]$ ]]; then
        echo "Keeping existing .env.local"
        exit 0
    fi
fi

echo -e "${GREEN}Creating .env.local from template...${NC}"
cp .env.example .env.local

echo ""
echo "📝 Please provide the following API keys:"
echo ""

# Neynar API Key
read -p "Neynar API Key (get from neynar.com): " neynar_key
if [ ! -z "$neynar_key" ]; then
    sed -i.bak "s/NEXT_PUBLIC_NEYNAR_API_KEY=.*/NEXT_PUBLIC_NEYNAR_API_KEY=$neynar_key/" .env.local
    echo -e "${GREEN}✓ Neynar API key added${NC}"
fi

# Strava Client ID
read -p "Strava Client ID (get from strava.com/settings/api): " strava_id
if [ ! -z "$strava_id" ]; then
    sed -i.bak "s/NEXT_PUBLIC_STRAVA_CLIENT_ID=.*/NEXT_PUBLIC_STRAVA_CLIENT_ID=$strava_id/" .env.local
    echo -e "${GREEN}✓ Strava Client ID added${NC}"
fi

# Strava Client Secret
read -p "Strava Client Secret: " strava_secret
if [ ! -z "$strava_secret" ]; then
    sed -i.bak "s/NEXT_PUBLIC_STRAVA_CLIENT_SECRET=.*/NEXT_PUBLIC_STRAVA_CLIENT_SECRET=$strava_secret/" .env.local
    echo -e "${GREEN}✓ Strava Client Secret added${NC}"
fi

# App URL
read -p "App URL (default: http://localhost:3000): " app_url
app_url=${app_url:-http://localhost:3000}
sed -i.bak "s|NEXT_PUBLIC_APP_URL=.*|NEXT_PUBLIC_APP_URL=$app_url|" .env.local
echo -e "${GREEN}✓ App URL set${NC}"

# Clean up backup files
rm -f .env.local.bak

echo ""
echo -e "${GREEN}✅ Setup complete!${NC}"
echo ""
echo "Next steps:"
echo "1. Install dependencies: ${YELLOW}npm install${NC}"
echo "2. Run dev server: ${YELLOW}npm run dev${NC}"
echo "3. Deploy contracts: ${YELLOW}npm run deploy:alfajores${NC}"
echo "4. Update contract addresses in .env.local"
echo "5. Deploy to Vercel"
echo ""
echo "📚 Read QUICKSTART.md for detailed instructions"
echo ""
