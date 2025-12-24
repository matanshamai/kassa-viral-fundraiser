# Frontend

React dashboard for the viral fundraiser platform. Shows donation forms, referral links, and multi-level impact analytics.

## Tech Stack

- **React 19 + TypeScript** - Type-safe component development
- **Vite** - Fast build tool with HMR
- **Tailwind CSS v4** - Utility-first styling
- **Custom components** - No external UI library

## Architecture

Component structure:
```
src/
├── components/
│   ├── auth/Login.tsx           # Username login with referral capture
│   ├── dashboard/
│   │   ├── Dashboard.tsx        # Main layout
│   │   ├── DonationForm.tsx     # Donation submission
│   │   ├── ReferralShare.tsx    # Link generation + copy
│   │   ├── ImpactSummary.tsx    # User stats
│   │   └── ReferralTree.tsx     # Multi-level breakdown
│   └── common/
│       └── CollapsibleCard.tsx  # Reusable card component
├── config/api.ts                # Backend endpoint config
├── types/index.ts               # TypeScript types
└── utils/formatters.ts          # Number formatting
```

### Design Decisions

**URL-based referral tracking** - Referral links use `?ref=userId` query param. Simple, shareable, works without backend changes.

**Collapsible tree view** - Summary shows each referral level in an expandable card. Keeps UI clean when trees get deep.

**No state library** - App is simple enough for React hooks. Avoids Redux/Zustand overhead.

**Type-safe API calls** - Centralized config and typed responses prevent runtime errors.

## Features

- Username-only login (creates account if new)
- Captures referrer from URL on signup
- Donation form with validation
- Referral link generation and copy-to-clipboard
- Impact summary showing:
  - Your total donations
  - Total referrals count
  - Total raised by your network
- Per-level breakdown:
  - Level 1 = people you referred
  - Level 2 = people they referred
  - etc.
  - Shows user count and total $ per level

## Setup

Requires backend running on `http://localhost:3000`.

```bash
bun install
bun run dev       # Starts on http://localhost:5173
```

## Build

```bash
bun run build     # Output to dist/
bun run preview   # Preview production build
```

## UX Notes

- Responsive design (mobile-first with Tailwind)
- Cards collapse/expand to manage info density
- Copy button shows success feedback
- Average donation calculated per level
