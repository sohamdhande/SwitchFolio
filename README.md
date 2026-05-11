# Switchfolio

**Headless portfolio CMS for developers.**

Control what recruiters see without touching your code. Switch views instantly. No redeployment. Ever.

---

## What is Switchfolio?

Switchfolio is a **headless CMS purpose-built for developer portfolios**. Instead of hardcoding your project list into your portfolio site, you manage everything through a dashboard and consume the data via a lightweight SDK or REST API.

### The Problem

Every time you apply for a different role — frontend, ML, full-stack — you want to highlight different projects. But your portfolio is static. Reordering or hiding projects means editing code, redeploying, and hoping you remember to revert it later.

### The Solution

Switchfolio decouples your **project data** from your **portfolio design**:

1. **Sign up** — we auto-provision your first view and API key instantly.
2. **Add your projects once** — title, description, tech stack, links, and images.
3. **Create "views"** — curated subsets tailored for each audience (e.g., `frontend-interviews`, `ml-roles`, `hackathon-showcase`).
4. **Toggle & reorder** — show, hide, and drag-to-rank projects per view.
5. **Fetch via SDK** — your portfolio reads from Switchfolio's API. Changes reflect instantly, no rebuild needed.

```
┌─────────────┐       ┌─────────────┐       ┌─────────────┐
│  Dashboard  │──────▶│  REST API   │──────▶│  Your Site  │
│  Manage     │       │ /v1/projects│       │  Portfolio   │
│  views      │       │             │       │             │
└─────────────┘       └─────────────┘       └─────────────┘
```

## Features

- **Instant Updates** — Change your view, see it live in seconds. No redeployment, no waiting.
- **Multiple Views** — Frontend roles, ML roles, hackathons — one codebase, infinite audiences.
- **Zero Design Impact** — We never touch your portfolio design. You own every pixel.
- **Drag-and-Drop Ordering** — Reorder projects within a view using drag-and-drop (powered by dnd-kit + LexoRank).
- **API Key Management** — Generate and manage scoped API keys from the dashboard.
- **Rate Limiting** — Optional Upstash Redis-based rate limiting on the public API.
- **Drop-in SDKs** — First-party React hook and vanilla JS client available on npm.
- **Built-in Docs** — Interactive integration guide with copy-paste code snippets.

## Tech Stack

| Layer        | Technology                               |
| ------------ | ---------------------------------------- |
| Framework    | Next.js 14 (App Router)                  |
| Database     | Neon (Serverless Postgres) + Prisma 7    |
| Auth         | Clerk                                    |
| Ordering     | dnd-kit + LexoRank                       |
| Rate Limiting| Upstash Redis                            |
| UI           | Tailwind CSS + shadcn/ui + Radix UI      |
| SDKs         | `@switchfolio/react` · `@switchfolio/vanilla` |
| Deployment   | Vercel (region-locked to `iad1`)         |

## Project Structure

```
switchfolio/
├── prisma/
│   └── schema.prisma          # Data models: User, Project, View, ProjectsOnViews, ApiKey
├── packages/
│   ├── react/                  # @switchfolio/react — useSwitchfolio() hook
│   └── vanilla/                # @switchfolio/vanilla — Switchfolio.load() client
├── src/
│   ├── app/
│   │   ├── page.tsx            # Landing page
│   │   ├── guide/              # Interactive integration docs
│   │   ├── sign-in/            # Clerk sign-in
│   │   ├── sign-up/            # Clerk sign-up
│   │   ├── dashboard/
│   │   │   ├── page.tsx        # Dashboard home — project list
│   │   │   ├── projects/       # Project CRUD
│   │   │   ├── views/          # View management + drag-and-drop ordering
│   │   │   └── settings/       # API key management
│   │   └── api/
│   │       ├── keys/           # Internal API key endpoints
│   │       ├── projects/       # Internal project CRUD endpoints
│   │       ├── views/          # Internal view endpoints
│   │       └── v1/projects/    # Public API — consumed by SDKs
│   ├── components/             # UI components (dashboard, guide, shadcn/ui)
│   ├── lib/                    # Utilities: db client, auth helpers, LexoRank, API key hashing
│   ├── types/                  # Shared TypeScript types
│   └── middleware.ts           # Clerk auth middleware (public routes: /, /api/v1/*, /guide/*)
├── vercel.json                 # Region lock + function config
└── package.json                # Monorepo root (npm workspaces)
```

## Getting Started

### Prerequisites

- Node.js 18+
- A [Neon](https://neon.tech) database (free tier works)
- A [Clerk](https://clerk.com) application (free tier works)
- *(Optional)* An [Upstash Redis](https://upstash.com) instance for rate limiting

### Setup

1. **Clone the repository and install dependencies:**
   ```bash
   git clone https://github.com/sohamdhande/SwitchFolio.git
   cd SwitchFolio
   npm install
   ```

2. **Set up environment variables:**
   ```bash
   cp .env.example .env.local
   ```
   Fill in `.env.local` with your credentials:
   ```env
   DATABASE_URL=                              # Neon pooled connection string
   DIRECT_URL=                                # Neon direct connection string
   NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=         # Clerk publishable key
   CLERK_SECRET_KEY=                          # Clerk secret key
   NEXT_PUBLIC_APP_URL=http://localhost:3000   # App URL

   # Optional — rate limiting is disabled if not set
   UPSTASH_REDIS_REST_URL=
   UPSTASH_REDIS_REST_TOKEN=
   ```

3. **Run database migrations:**
   ```bash
   npx prisma migrate dev
   ```

4. **Start the development server:**
   ```bash
   npm run dev
   ```

5. Open [http://localhost:3000](http://localhost:3000) and sign up.

## Integration

Use the drop-in SDKs to fetch your portfolio data from any frontend.

### React / Next.js

```bash
npm install @switchfolio/react
```

```tsx
import { useSwitchfolio } from '@switchfolio/react'

export default function Projects() {
  const { data, loading, error, refetch } = useSwitchfolio({
    apiKey: process.env.NEXT_PUBLIC_SWITCHFOLIO_KEY,
    username: 'your-username',
    viewSlug: 'frontend-interviews',
  })

  if (loading) return <div>Loading...</div>
  if (error) return <div>Error: {error}</div>

  return data.map(project => (
    <ProjectCard key={project.id} project={project} />
  ))
}
```

### Vanilla JS / Any Framework

```bash
npm install @switchfolio/vanilla
```

```js
import Switchfolio from '@switchfolio/vanilla'

const { projects } = await Switchfolio.load({
  apiKey: 'sf_xxxxxxxxxxxx',
  username: 'your-username',
  viewSlug: 'frontend-interviews',
})

projects.forEach(p => console.log(p.title))
```

### Raw Fetch

No SDK needed — call the API directly:

```bash
curl "https://switchfolio.app/api/v1/projects?user=your-username&view=frontend-interviews" \
  -H "Authorization: Bearer sf_xxxxxxxxxxxx"
```

## API Reference

### `GET /api/v1/projects`

Returns an ordered list of visible projects for a given user and view.

| Parameter | Type   | Required | Description              |
| --------- | ------ | -------- | ------------------------ |
| `user`    | string | ✅       | Switchfolio username     |
| `view`    | string | ✅       | View slug                |

**Headers:**
```
Authorization: Bearer <api_key>
```

**Response:** `200 OK`
```json
[
  {
    "id": "clxyz...",
    "title": "My Project",
    "description": "A cool thing I built",
    "techStack": ["React", "Node.js"],
    "repoUrl": "https://github.com/...",
    "liveUrl": "https://...",
    "imageUrl": "https://...",
    "createdAt": "2026-01-15T00:00:00.000Z"
  }
]
```

## Deployment

1. Push to GitHub.
2. Import the repo on [Vercel](https://vercel.com).
3. Add all environment variables from `.env.example`.
4. Deploy.

> **Note:** The Vercel region is locked to `iad1` (US East) to co-locate with Neon for minimal latency.

## License

MIT

---

Built by [Soham Dhande](https://github.com/sohamdhande)
