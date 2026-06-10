# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Artist landing page for "Robert Avery" — a contemporary visual artist. Built with Next.js 14 App Router, Tailwind CSS, TypeScript, and an AI chat widget powered by the Anthropic SDK.

## Commands

```bash
npm run dev      # Start development server (http://localhost:3000)
npm run build    # Production build
npm run lint     # Run ESLint
npm start        # Start production server
```

## Architecture

**Next.js App Router** structure — all pages and API routes live under `app/`.

- `app/page.tsx` — Server component that assembles all section components
- `app/layout.tsx` — Root layout with Google Fonts (Playfair Display + Inter) and global CSS
- `app/api/chat/route.ts` — POST endpoint streaming Anthropic Claude responses
- `components/` — One file per page section; most are client components (`'use client'`) using Intersection Observer for scroll animations

**Chat API flow:**
1. `ChatWidget.tsx` POSTs `{ messages }` to `/api/chat`
2. Route streams plain text chunks back using `client.messages.stream()` wrapped in a `ReadableStream`
3. Client reads the stream with `response.body.getReader()` and updates state incrementally

**Scroll animations:** Each component uses a local `IntersectionObserver` + `useState(visible)` to fade/slide in on scroll. No animation library needed.

## Key Design Tokens

All colors are inlined as hex values (no Tailwind config aliases used in JSX):
- Background: `#0A0A0A` / `#080808` (sections alternate)
- Gold accent: `#C9A84C` (primary), `#D4AF37` (hover)
- Text: `#F0EDE8` (primary), `#9CA3AF` (muted)
- Surface: `#111111` / `#141414` / `#1A1A1A`

Headings use `font-display` (Playfair Display); body uses `font-sans` (Inter).

## Environment Variables

Copy `.env.local.example` to `.env.local` and fill in:

```
ANTHROPIC_API_KEY=your_key_here
```

## Customization Points

- **Calendly URL**: `components/Booking.tsx` — change the `src` on the `<iframe>`
- **Artist name/bio**: `components/About.tsx`, `components/Hero.tsx`, `components/Footer.tsx`
- **Services & pricing**: `components/Services.tsx` — `services` array
- **Portfolio images**: `components/Portfolio.tsx` — `portfolioItems` array (currently uses picsum.photos placeholders)
- **AI assistant system prompt**: `app/api/chat/route.ts` — `SYSTEM_PROMPT` constant
- **Contact info**: `components/Contact.tsx` — `contactInfo` and `socialLinks` arrays

## Model

The chat API uses `claude-sonnet-4-6`. Prompt caching is enabled on the system prompt via `cache_control: { type: "ephemeral" }`.
