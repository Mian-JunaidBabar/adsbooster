# AdsBoosters.pk

Single-page paid-ads landing page for a Pakistani performance ads agency, plus a lead-handling backend and admin panel. Audiences: health clinics, overseas visa consultants, other local businesses. Traffic comes from Meta and Google ads, mostly on phones over mobile data. The page's one job is to start a WhatsApp chat, or capture a lead through the form or a booked call.

## Sources of truth

- `design/DESIGN.md` and `design/tokens.css`: the visual system. Follow them exactly.
- `design/reference/landing.source.html`, `design-system-components.js`, and the two screenshots: the approved design. The page must match the screenshots at 1440px and 390px.
- If the code and the design disagree, the design wins, unless the design is broken (see the known issues in the kickoff prompt).

## Stack

Next.js (App Router) + TypeScript strict + Tailwind or CSS variables from tokens.css + Supabase (Postgres, Auth) + Vercel. Zod for all validation. Vitest + Playwright for tests.

## Working rules

1. Think before coding. State assumptions. If something is ambiguous, ask once, then proceed with the most reasonable reading.
2. Simplicity first. The minimum code that solves the problem. No speculative features, no abstractions for a single use, no config nobody asked for.
3. Surgical changes. Touch only what the task needs. Match the existing style. Do not refactor or reformat unrelated code. Remove only the dead code your own change created.
4. Goal-driven. Turn each task into a check that can pass or fail (a test, a build, a screenshot comparison), then loop until it passes. Say what you verified and what you could not.
5. Never invent client data. Stats, testimonials, prices and logos come from the admin, and the public page hides any block that has no real content.
6. Never claim a message or event was sent unless the server confirmed it.

## Security and data

- Supabase service-role key is server-only. Never import it in a client component or expose it via `NEXT_PUBLIC_`.
- Row Level Security is on for every table. The anon role has no access to lead data. Public writes go through server routes only.
- Validate every input with Zod on the server, even when the client already validated.
- Never log phone numbers, names or full request bodies. Log ids.
- Verify signatures on every webhook. Rate limit every public endpoint.

## Design guardrails (from DESIGN.md)

- WhatsApp green is used only on WhatsApp buttons.
- No purple gradients, glassmorphism, emoji icons, stock photos, or fake counters.
- Motion: ease-out only, transform and opacity only, max 400ms, respect prefers-reduced-motion.
- Headlines max 2 lines at 390px. The WhatsApp button must be visible in the first mobile screen.

## Commands

Fill these in during Phase 0 once the project exists: install, dev, build, lint, typecheck, test, e2e, db migrate.

## Definition of done for any change

Typecheck, lint, unit tests and the e2e tests for the touched flow pass. Mobile (390px) and desktop (1440px) checked. No new console errors. Lighthouse mobile performance stays at 90 or above on the landing page.

<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->
