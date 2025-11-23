# 🎨 SweatBet Branding Assets

You need to create the following images before registering on Farcaster:

## Icon (512x512px)

**File**: `public/icon.png`

**Design Specs**:
- Size: 512x512px
- Format: PNG with transparency
- Style: Bold, minimal
- Colors: Purple (#9333ea) to Pink (#ec4899) gradient
- Include: 💪 or 🏃 emoji overlaid on gradient
- Text: "SweatBet" in bold white Inter font

**Quick Create Options**:
1. **Figma**: Use gradient background + text + emoji
2. **Canva**: Search "app icon" templates, customize colors
3. **AI Generation**: "Create a fitness app icon with purple-pink gradient and running emoji"

## Splash Screen (1200x630px)

**File**: `public/splash.png`

**Design Specs**:
- Size: 1200x630px (standard social share size)
- Format: PNG
- Style: Eye-catching, explains the app
- Colors: Same gradient (Purple #9333ea → Pink #ec4899)
- Include:
  - Large "SweatBet" title
  - Tagline: "Bet on Workouts. Prove with Strava. Win Together."
  - Emojis: 💪 🏃 💰 🔒
  - Mini preview of chat interface (optional)

**Quick Create Options**:
1. **Figma**: Full-width gradient + centered text
2. **Canva**: Social media template, customize
3. **AI Generation**: "Create an app splash screen for a fitness betting app"

## Example Design (ASCII Art)

```
┌────────────────────────────────────────────┐
│  ICON (512x512)                            │
│                                            │
│     ┌────────────────────────────┐       │
│     │                            │       │
│     │   [Purple → Pink Gradient] │       │
│     │                            │       │
│     │          💪                 │       │
│     │                            │       │
│     │       SweatBet             │       │
│     │                            │       │
│     └────────────────────────────┘       │
│                                            │
└────────────────────────────────────────────┘

┌────────────────────────────────────────────────────────────┐
│  SPLASH (1200x630)                                         │
│                                                            │
│  ┌──────────────────────────────────────────────────────┐ │
│  │                                                      │ │
│  │         [Purple → Pink Gradient Background]         │ │
│  │                                                      │ │
│  │                  💪 SweatBet 🏃                      │ │
│  │                                                      │ │
│  │        Bet on Workouts • Prove with Strava          │ │
│  │              Winners Split the Pot 💰               │ │
│  │                                                      │ │
│  │                  [Get Started →]                     │ │
│  │                                                      │ │
│  └──────────────────────────────────────────────────────┘ │
│                                                            │
└────────────────────────────────────────────────────────────┘
```

## Color Palette

```css
--sweat-purple: #9333ea
--sweat-pink: #ec4899
--white: #ffffff
--black: #000000
```

## Fonts

- **Primary**: Inter Bold
- **Fallback**: System fonts (San Francisco, Roboto, Helvetica)

## Creating in Code (SVG → PNG)

If you want to generate programmatically:

```javascript
// icon.svg (then convert to PNG)
<svg width="512" height="512" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="grad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" style="stop-color:#9333ea;stop-opacity:1" />
      <stop offset="100%" style="stop-color:#ec4899;stop-opacity:1" />
    </linearGradient>
  </defs>
  <rect width="512" height="512" rx="100" fill="url(#grad)"/>
  <text x="256" y="300" font-family="Inter" font-weight="bold" 
        font-size="72" fill="white" text-anchor="middle">💪</text>
  <text x="256" y="380" font-family="Inter" font-weight="bold" 
        font-size="48" fill="white" text-anchor="middle">SweatBet</text>
</svg>
```

Convert to PNG using:
- Online: [cloudconvert.com](https://cloudconvert.com/svg-to-png)
- CLI: `inkscape icon.svg --export-png=icon.png -w 512 -h 512`
- Node: Use `sharp` library

## Testing Your Assets

Before uploading:
1. Check file sizes (< 1MB each)
2. Verify dimensions exactly
3. Test on both light/dark backgrounds
4. Preview in mobile/desktop
5. Ensure emojis render correctly

## Where to Upload

Once created, place in:
- `public/icon.png`
- `public/splash.png`

Then commit and push to trigger Vercel rebuild.

## Need Help?

- [Figma Community](https://www.figma.com/community) - Free templates
- [Canva](https://www.canva.com) - Easy design tool
- [DALL-E](https://openai.com/dall-e-3) - AI image generation
- [Midjourney](https://midjourney.com) - AI image generation

---

**Make it pop!** 🎨✨
