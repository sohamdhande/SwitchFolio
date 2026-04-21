# Switchfolio

**Headless portfolio CMS for developers.**

Control what recruiters see without touching your code. Switch views instantly. No redeployment. Ever.

## Features
- **Instant Updates**: Change your view, see it live in seconds.
- **Multiple Views**: Frontend roles, ML roles, hackathons — one codebase.
- **Zero Design Impact**: We never touch your portfolio design.

## Tech Stack
- **Framework**: Next.js 14 (App Router)
- **Database**: Neon (Serverless Postgres) + Prisma 7
- **Auth**: Clerk
- **Ordering**: dnd-kit + LexoRank
- **UI**: Tailwind CSS + shadcn/ui

## Getting Started

1. Clone the repository and install dependencies:
   ```bash
   npm install
   ```

2. Set up environment variables:
   ```bash
   cp .env.example .env.local
   ```
   Fill in `.env.local` with your database and Clerk keys.

3. Run database migrations:
   ```bash
   npx prisma migrate dev
   ```

4. Start the development server:
   ```bash
   npm run dev
   ```

## Integration

Use our drop-in SDK to integrate your portfolio data into your frontend.

### React / Next.js
```bash
npm install @switchfolio/react
```

```tsx
import { useSwitchfolio } from '@switchfolio/react'

export default function Projects() {
  const { data, loading, error } = useSwitchfolio({
    apiKey: process.env.NEXT_PUBLIC_SWITCHFOLIO_KEY,
    username: 'your-username',
    viewSlug: 'frontend-interviews'
  })
  
  if (loading) return <div>Loading...</div>
  
  return data.map(project => (
    <ProjectCard key={project.id} project={project} />
  ))
}
```

## Deployment
Push to GitHub → Import on Vercel → Add env vars → Deploy.
*Note: Vercel region is locked to `iad1` (co-located with Neon US-East).*
