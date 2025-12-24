# Viral Fundraiser Platform

A full-stack web app that tracks donations through a viral referral system. Users can refer friends, make donations, and see their network's impact broken down by referral levels.

[Full Demo Video on Loom](https://www.loom.com/share/e33a969fff924fbc8885ade1cb02aba1)

## Quick Start

```bash
# Clone the repo
git clone <repository-url>
cd kassa-viral-fundraiser

# Backend setup
cd backend
bun install
bun run db:push
bun run db:seed        # Optional: adds test data
bun run dev            # Starts on http://localhost:3000

# Frontend setup (in a new terminal)
cd frontend
bun install
bun run dev            # Starts on http://localhost:5173
```

Open [http://localhost:5173](http://localhost:5173) and log in with any username.

## System Overview

### Architecture

Monorepo with separate backend (Express API) and frontend (React SPA). Backend handles auth, donations, and referral tree queries. Frontend is a responsive dashboard for donations and analytics.

### Tech Stack

**Backend:**

- Express + TypeScript for the API
- Prisma ORM for type-safe database access
- SQLite for local file-based persistence (per assignment requirements)
- Bun runtime for speed and native TypeScript support

**Frontend:**

- React 19 + TypeScript
- Vite for fast builds and HMR
- Tailwind CSS for styling
- No component library (custom built)

### Database Design

**User model** uses a self-referential relationship (`referrerId` points to another User). This allows unlimited referral depth without knowing the tree structure ahead of time.

**Donation model** is a simple one-to-many with User, tracking amount and timestamp.

Both foreign keys are indexed for query performance. The summary endpoint uses a recursive CTE to traverse the entire referral tree and aggregate donations by level.

### Key Design Decisions

**Why SQLite + Prisma?**

- Assignment required local persistence
- SQLite is zero-config and file-based (perfect for demos)
- Prisma gives type safety, migrations, and auto-generated client
- Can be later replaced by Postgres & Sequalize with minimal changes

**Why self-referential User model?**

- Supports arbitrarily deep referral trees
- Single table keeps schema simple
- Efficient with proper indexes

**Why recursive CTE for summary?**

- SQL handles tree traversal efficiently
- Single query instead of N+1 queries
- Aggregates by level in the database
- Can be paired with a caching layer later if scale demands it

## Features

- Username-only auth (creates user if doesn't exist)
- Referral tracking via URL parameter (`?ref=userId`)
- Multi-donation support per user
- Summary view showing:
  - User's total donations
  - Per-level breakdown (level 1 = direct referrals, level 2 = their referrals, etc.)
  - Total aggregated data of the entire tree (total referrals, total amount donated by them)
- Optimistic UI updates on donation for faster performance

## Further Documentation

- [Backend README](backend/README.md) - API endpoints, database schema, architecture decisions
- [Frontend README](frontend/README.md) - Component structure, state management, UI patterns

## Future Enhancements

**Features:**

- Notifications for new referrals (email and/or notification drawer in app)
- Entire tree visualizer using a chart library
- Multi campaign management
- Leaderboard (Who's your most earning referrer, with their descendants taken into account)
- Event driven UI updates (update summary if one of my descendants donated)
- Dark mode toggle (dark mode always wins)

**Auth & Security:**

- Proper authentication (probably stateless with JWT token)
- Option to auth using a third party IdP like Google
- Rate limiting and input validation
- Hashing referral codes instead of using user ID to avoid sensitive data leak

**Data & Scale:**

- Migrate to PostgreSQL for production
- Add caching layer (Redis) for summary queries

**Code Quality:**

- Tests - Unit, integration, E2E tests
- CI/CD pipeline
- Error tracking (Sentry)
- Analytics & logging engine (PostHog)

**Performance:**

- Pagination for large referral trees
- Lazy loading of deep tree levels
