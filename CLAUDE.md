# AdsBoosters.pk

Single-page paid-ads landing page for a Pakistani performance ads agency, plus a lead-handling backend and admin panel. One audience: any business owner who wants more leads, sales or reach from ads and social media. No industry is targeted; the lead form records each lead's industry so the owners can see which one responds best. Traffic comes from Meta and Google ads, mostly on phones over mobile data. The page's one job is to start a WhatsApp chat, or capture a lead through the form.

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
- Motion (one system, see `app/globals.css`):
  - Animate `transform` and `opacity` only, plus `background-color`, `border-color`, `box-shadow` and `color` on hover. Never width, height, top, left or margin. The FAQ answer (`grid-template-rows` 0fr to 1fr) is the single allowed exception.
  - Ease `--ease-out`. Durations are tokens: `--dur-fast` 160ms (hover, press), `--dur-base` 300ms (colour changes), `--dur-reveal` 600ms (scroll reveals). Only the count-up (1600ms), the process line draw (800ms), the FAQ (250ms) and the ambient loops (hero drift, final CTA bar) run longer.
  - Hover rules live inside `@media (hover: hover) and (pointer: fine)` and have a matching `:focus-visible` state. Movement is also gated by `prefers-reduced-motion: no-preference`; with reduced motion nothing moves, colour changes stay, reveals show content at once and the count-up shows the final value.
  - Content is never hidden at rest. Reveals use `data-reveal` and `MotionController`, and CSS only hides content once JS has added `reveal-ready`. Never reveal the hero H1, the hero WhatsApp button or the form.
  - Small movement only: lifts 2 to 4px, reveals 12 to 16px, scale at most 1.02 (the icon badge hover is the one 1.06 exception). No bounce, spin or flash. No animation library.
- Headlines max 2 lines at 390px. The WhatsApp button must be visible in the first mobile screen.

## Commands

- install: `npm install`
- dev: `npm run dev`
- build: `npm run build` (needs `LEAD_NOTIFICATION_EMAIL` in production mode)
- lint: `npm run lint`
- typecheck: `npm run typecheck`
- unit tests: `npm test`
- e2e: `npx playwright install chromium`, then `npm run e2e` (builds with `build:e2e`, starts a fake sheet webhook on :4000)
- db migrate: `npm run db:migrate`

## Definition of done for any change

Typecheck, lint, unit tests and the e2e tests for the touched flow pass. Mobile (390px) and desktop (1440px) checked. No new console errors. Lighthouse mobile performance stays at 90 or above on the landing page.
