# Meetingly

AI-powered video meeting platform where AI agents join live calls and automatically produce meeting summaries, searchable transcripts, and contextual post-call chat.

**Live:** https://meetingly-a.vercel.app
**Repo:** https://github.com/vanshikhaBhardwaj07/Meetingly

<!--
  TODO: add a screenshot of the app (dashboard or an active call) here.
  Easiest way: open this file on github.com, click the pencil to edit,
  and drag-and-drop an image straight into the text box — GitHub hosts
  it automatically and writes the markdown link for you.
-->
![Meetingly screenshot](./docs/screenshot.png)

## Features

- **Real-time AI agents** — custom agents join live video calls via the OpenAI Realtime API and hold speech-to-speech conversations during the meeting.
- **Automated summaries** — an event-driven Inngest pipeline ingests the call transcript after each meeting and generates a structured summary with GPT-4o.
- **Searchable transcripts** — full transcript search with highlighted matches.
- **Post-call chat** — a context-aware assistant grounded in the meeting summary, the agent's original instructions, and recent conversation history.
- **Subscription tiers** — free-tier usage limits (agents/meetings) enforced through tRPC middleware, with upgrades handled via Polar billing.
- **Authentication** — email/password plus Google and GitHub OAuth via Better Auth.

## Tech Stack

**Frontend:** TypeScript, Next.js 15 (App Router), React 19, Tailwind CSS v4, shadcn/ui
**API:** tRPC, Zod, TanStack Query
**Database:** PostgreSQL (Neon, serverless), Drizzle ORM
**Real-time:** Stream Video SDK (WebRTC), Stream Chat, OpenAI Realtime API
**Background jobs:** Inngest
**Auth:** Better Auth (email/password, Google OAuth, GitHub OAuth)
**Payments:** Polar
**Deployment:** Vercel

## Getting Started

### Prerequisites

You'll need accounts/API keys for: Neon (Postgres), Stream (Video + Chat), OpenAI, Google & GitHub OAuth apps, and Polar.

### Setup

```bash
npm install
```

Create a `.env` file with:

```
DATABASE_URL=
BETTER_AUTH_URL=http://localhost:3000
NEXT_PUBLIC_APP_URL=http://localhost:3000
GOOGLE_CLIENT_ID=
GOOGLE_CLIENT_SECRET=
GITHUB_CLIENT_ID=
GITHUB_CLIENT_SECRET=
NEXT_PUBLIC_STREAM_VIDEO_API_KEY=
STREAM_VIDEO_SECRET_KEY=
NEXT_PUBLIC_STREAM_CHAT_API_KEY=
STREAM_CHAT_SECRET_KEY=
OPENAI_API_KEY=
POLAR_ACCESS_TOKEN=
```

Push the database schema:

```bash
npm run db:push
```

Run the dev server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

> Video call webhooks (transcripts, recordings, summaries, chat) require a public URL. Use `npm run dev:webhook` (ngrok) alongside `npm run dev` and point your Stream webhook endpoint at the tunnel's `/api/webhook` URL.

## Deployment

Deployed on [Vercel](https://vercel.com). Push to `main` to deploy; pull requests get their own preview deployments automatically.
