# Backend

Express API for the viral fundraiser platform.

## Database Schema

```prisma
model User {
  id         Int      @id @default(autoincrement())
  username   String   @unique
  referrerId Int?
  referrer   User?    @relation("Referrals", fields: [referrerId])
  referrals  User[]   @relation("Referrals")
  donations  Donation[]
}

model Donation {
  id        Int      @id @default(autoincrement())
  amount    Float
  userId    Int
  user      User     @relation(fields: [userId])
  createdAt DateTime @default(now())
}
```

Self-referential User model supports unlimited referral depth. `referrerId` is set once at signup and never changes. Foreign keys are indexed for performance.

## API Endpoints

### POST /auth/login

Creates new user or returns existing one.

**Request:**

```json
{
  "username": "alice",
  "referrerId": 5 // optional
}
```

**Response:**

```json
{
  "id": 1,
  "username": "alice",
  "referrerId": 5
}
```

### POST /donations

Records a donation.

**Request:**

```json
{
  "userId": 1,
  "amount": 50
}
```

**Response:**

```json
{
  "userId": 1,
  "amount": 50 // Actual value inserted, used for optimistic UI update
}
```

### GET /summary/:userId

Gets donation summary with referral tree breakdown.

**Response:**

```json
{
  "userId": 1,
  "userTotal": 150.0,
  "levels": [
    {
      "level": 1,
      "userCount": 3,
      "total": 275.0
    },
    {
      "level": 2,
      "userCount": 8,
      "total": 420.0
    }
  ]
}
```

Uses recursive CTE to traverse tree and aggregate by level. Much faster than application-level recursion, avoids N+1 queries.

## Setup

```bash
bun install
bun run db:push    # Syncs schema to SQLite
bun run db:seed    # Optional: adds test data
bun run dev        # Starts on port 3000
```

## Scripts

- `bun run dev` - Run with hot reload
- `bun run db:push` - Sync schema to database
- `bun run db:seed` - Add test data (8 users, 3 levels)
- `bun run db:seed:advanced` - Add 1000+ users for stress testing
- `bun run db:reset` - Clear all data
