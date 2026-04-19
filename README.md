# Switchfolio

Headless portfolio CMS for developers.

## Stack
- Next.js 14 App Router
- Neon (Serverless Postgres) + Prisma 7
- Clerk Auth
- dnd-kit + LexoRank
- Tailwind CSS + shadcn/ui

## Getting Started

```bash
npm install
cp .env.example .env.local
# fill in .env.local
npx prisma migrate dev
npm run dev
```

## SDK Usage

```tsx
import { useSwitchfolio } from '@switchfolio/react'

const { data, loading } = useSwitchfolio({
  apiKey: 'sk_live_xxxx',
  username: 'your-username',
  viewSlug: 'frontend-interviews'
})
```

## Deploy
Push to GitHub → import on Vercel → add env vars → deploy.
Vercel region is locked to iad1 (co-located with Neon US-East).
