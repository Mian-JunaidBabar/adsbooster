# AdsBoosters.pk Redesign Plan

Reference: influx.pk screenshots (`reference1.png` to `reference9.png`). The site stays single-page. Decisions: bright brand-blue accent (no orange), pure CSS spring motion (no animation library), custom inline SVG motifs, plus two new sections (trust strip and "Sound familiar?" pain cards).

## 1. Audit summary

**What we have now** (`app/page.tsx`, 567 lines, server-rendered with client islands; `app/globals.css`, 1,953 lines of vanilla CSS with tokens in `:root`; all copy in `lib/content.ts`):
- Header: a sticky paper-coloured bar, nav pills (`NavPills`) and a WhatsApp button.
- Hero: left-aligned copy only, over a 50%-opacity world-map image and two blurred shapes. There is no visual on the right, so the desktop view looks empty.
- Results: SS Traders. Banner, 3 count-up stats, 2 screenshots in a lightbox (`ResultShots`), a quote that is hidden while it's a placeholder, and a WhatsApp CTA.
- Then services (4 cards), process (4 steps), a stats band and testimonials (both hidden because they're empty), pricing (2 plans, "Custom quote"), FAQ (`FaqItem`, grid-rows accordion), audit (`LeadForm`) and the footer.
- Palette: navy `#0f2b4c`, blue `#246c9c`, cyan `#5bb8e0` on `#f6f7f5`. It's correct but muted. The CTAs don't stand out, and the sections all look alike (white card on grey).
- Type: Plus Jakarta Sans. Barlow Condensed is loaded as `--font-barlow`, but `--font-label` points at "Barlow Semi Condensed", so the label font is never applied.
- Gaps: `design/DESIGN.md`, `design/tokens.css` and `design/reference/` are named in CLAUDE.md but don't exist. There are no Playwright specs in the repo yet.

**What the references do well (and we'll adopt):**
1. A floating white header card with a soft shadow, and one solid high-contrast CTA pill.
2. In the hero, a pill badge, then a big H1 whose last line is in the accent colour. Two **floating stat cards** sit on the right, overlapping and slightly offset, each with a chip ("✓ $9.97 cost per conversion").
3. A **trust strip**: 4 columns, each with a tiny uppercase coloured label over one line of bold copy, separated by hairlines.
4. Eyebrows use a short accent rule ("— SOUND FAMILIAR?").
5. **Pain cards**: a tinted icon square, a quoted problem as the title, one line of body text, and a "Fix it with X →" link.
6. Service cards: white, 16px radius, 1px warm border, almost no shadow until hover, and an accent link at the bottom.
7. The case study is a two-tone panel: a light story side with big coloured numbers, and a dark card holding the real screenshot.
8. FAQ: separate bordered cards, a circled +/− icon, and the open question in the accent colour.
9. Final CTA: a dark rounded panel with a white form card inside it.
10. Generous whitespace, and a warm off-white page background.

**What changes:**
- **Brand:** the brighter "boost blue" becomes the one CTA colour. Navy is for ink and the dark panels, and the background warms up to soft paper.
- **Layout:** the hero gets a right-hand column of floating cards with SVG motifs. On mobile those cards go below the CTA, so WhatsApp stays in the first screen.
- **New sections:** the trust strip (facts already in our FAQ) and "Sound familiar?" (3 pain cards).
- **Results** become a case-study panel. **Audit** becomes the dark panel with the form card.
- **Motion:** the same MotionController system, with a spring easing token added.
- **Removed:** the world-map hero background and the blurred shapes. This also saves a priority image and helps LCP.

**What stays (hard rules):** WhatsApp green only on WhatsApp buttons; no invented stats or testimonials (hidden blocks stay hidden); the hero H1, hero WhatsApp button and form are never reveal-hidden; headlines are at most 2 lines at 390px; Lighthouse mobile is 90 or more; `LeadForm` logic, the API, the Zod schema and tracking are untouched.

## 2. Phases (each phase ships on its own and passes its check before the next starts)

**Phase 1: Tokens, fonts and base primitives**
- Replace the `:root` tokens in `app/globals.css` with the palette in §3. Keep the token names that existing CSS uses (`--ink`, `--navy`, `--surface`, `--line`, `--wa` and so on) so nothing else breaks, and add `--boost*`, `--sun`, `--paper-warm`, the shadow scale, the radius scale, `--ease-spring` and `--ease-spring-soft`.
- Fonts in `app/layout.tsx`: keep Plus Jakarta Sans (400/500/700/800) for both display and body. Drop Barlow Condensed (it's unused because of the name mismatch). That removes one font request.
- Restyle the shared primitives: `.primary-button` (boost blue pill, press scale 0.97), `.secondary-button` (white pill with border), `.whatsapp-button` (unchanged hue), `.eyebrow` (accent rule, then a tiny uppercase label), the base `.content-card` (white, `--radius-lg`, `--shadow-sm`), and the section heading scale.
- Update CLAUDE.md and AGENTS.md: point "Sources of truth" at `REDESIGN_PLAN.md`, and change the motion rule to allow `--ease-spring` (overshoot at most 2%, transform only).
- Check: typecheck, lint and build pass, and screenshots at 390px and 1440px show the new colours with the layout unchanged.

**Phase 2: Header and hero with floating cards**
- Header: a floating white bar (radius, `--shadow-md`, inset from the edges on desktop). The logo uses `logo.webp` without the black filter hack. Nav pills become text links with a boost-blue active underline. On the right, a phone link and the WhatsApp pill.
- Hero, two columns at 1025px and up:
  - Left: a pill badge (`hero.eyebrow`), then the H1, whose last phrase is wrapped in `<span class="accent">`. Then the subline, the checklist with blue checks, the WhatsApp CTA, the reply line and the proof link.
  - Right: `HeroCards`, a server component. It shows 2 floating stat cards using only the real SS Traders numbers from `content.results.stats` (123K views, 99% new people), each with a chip, plus the inline SVG `PhoneChatMotif` (a phone showing a WhatsApp-style lead bubble in brand colours, not green).
- Remove `hero-map` and the `hero-shapes`.
- Mobile: one column. The cards go after the CTA and are smaller, overlapping and slightly rotated.
- Check: the WhatsApp button is visible at 390×844 and the H1 is at most 2 lines. The LCP element is the H1.

**Phase 3: Trust strip and "Sound familiar?"**
- Add `content.trust` to `lib/content.ts`, built only from existing facts:
  - CONTRACT: "Month to month, no lock-in"
  - OWNERSHIP: "Ad accounts, pixel and pages stay yours"
  - AD SPEND: "Paid directly to Google and Meta"
  - REPLIES: "Within 15 minutes, 10am–8pm"
- The trust strip is a full-width white band with 4 columns and hairline dividers. On mobile it becomes a 2×2 grid.
- Add `content.pains`, 3 cards, each linking to its service anchor or a WhatsApp prefill:
  - "We boost posts but no one messages." → Fix it with Meta Ads
  - "Customers search for us and find competitors." → Fix it with Google Ads
  - "Our page has gone quiet." → Fix it with social media management
- Add the `ThinkingMotif` SVG next to the heading on desktop only.
- Check: 390px and 1440px screenshots, and the links resolve.

**Phase 4: Results, services, process, pricing, FAQ, audit and footer**
- Results become the case-study panel. On the left, the story with the 3 count-up stats in large boost/navy numbers. On the right, a dark navy card that holds the `ResultShots` screenshots. The quote and CTA logic stay as they are.
- Services: restyle as reference-style cards with a tinted icon square and an accent "cue" link. The 4-up grid becomes 2×2 at tablet and 1 column on mobile.
- Process: numbered steps on a dashed connector line (keep the existing 800ms line draw).
- Pricing: 2 cards, the first one highlighted with a boost border and a "Most chosen" label only if the client confirms it (otherwise neither is highlighted).
- FAQ: separate bordered cards, a circled +/− icon, and the open question in boost blue. `FaqItem` behaviour stays the same.
- Audit: a dark navy rounded panel. Copy and checks on the left, the white `LeadForm` card on the right, and the `MegaphoneMotif` SVG peeking from the corner on desktop.
- Footer: navy-deep background with the same columns, restyled.
- Check: the full-page screenshots at 390px and 1440px match the plan, and a manual form submit still shows the server-confirmed success state.

**Phase 5: Emil Kowalski motion and polish**
- Motion tokens:
  - `--ease-spring: linear(0, 0.25 8%, 0.6 18%, 0.9 30%, 1.015 42%, 1.01 55%, 1)`, about 500ms, for transforms
  - `--ease-out` stays for opacity and colour
- Interactions, all inside the hover/pointer and `no-preference` media queries, each with a matching `:focus-visible` state:
  - Cards lift 3px and their shadow moves from sm to md.
  - Buttons lift 2px on hover and scale to 0.97 on `:active` (160ms).
  - The arrow in the link cue slides 3px.
  - The icon badge scales to 1.06.
  - Nav underline grows with `scaleX`.
- Hero floating cards: entrance with a 12px rise, a staggered fade and the spring easing. After that, an ambient drift of ±4px over 6–8s, offset per card, paused offscreen through the existing `data-pause-offscreen`.
- Reveals: the existing `data-reveal` system, 14px, with spring easing and a 70ms stagger.
- Reduced motion: no movement, content shown at once, final count-up values.
- Polish pass: spacing rhythm (sections 96px desktop, 64px mobile), contrast check, and an axe run.
- Check: Lighthouse mobile 90 or more, no CLS from the cards (they have fixed aspect boxes), no console errors, and the reduced-motion screenshot is identical at rest.

## 3. Design system pulled from the references

**Colour palette** (the reference's structure, with our brand hues):

| Token | Hex | Use |
|---|---|---|
| `--ink` | `#0B1220` | Headlines, body strong |
| `--ink-soft` | `#3B4558` | Body copy |
| `--muted` | `#6B7385` | Captions, small print |
| `--paper` | `#F7F8FC` | Page background (soft, slightly cool cream) |
| `--paper-warm` | `#FFF9F2` | Hero and pain section wash (the reference's warmth) |
| `--surface` | `#FFFFFF` | Cards, header, form |
| `--line` | `#E6E9F0` | Card borders, dividers |
| `--navy` | `#0F2B4C` | Logo navy, secondary text accents |
| `--navy-deep` | `#0A1A30` | Dark panels (results screenshot card, audit, footer) |
| `--boost` | `#1F5FFF` | **Primary CTA**, accent H1 phrase, links, active nav |
| `--boost-hover` | `#1A4FDB` | CTA hover |
| `--boost-tint` | `#EAF0FF` | Icon squares, chips, badge background |
| `--sky` | `#5BB8E0` | Decorative only (SVG motifs, logo swoosh echo). Never text on white |
| `--sun` | `#FFB020` | Small highlights in SVG motifs and star marks only |
| `--wa` / `--wa-hover` | `#147A3F` / `#178F47` | WhatsApp buttons only (unchanged) |
| `--danger` | `#C8372D` | Form errors |

Contrast: white on `--boost` must be at least 4.5:1, so check it in Phase 1 and darken to `#1A56F0` if it falls short. `--ink-soft` on `--paper` must be at least 7:1.

**Shadows:**
- `--shadow-sm`: `0 1px 2px rgb(11 18 32/.04), 0 2px 8px rgb(11 18 32/.04)`
- `--shadow-md`: `0 8px 24px -8px rgb(15 43 76/.14)` (floating cards and header)
- `--shadow-cta`: `0 10px 24px -10px rgb(31 95 255/.55)`

**Radii:** `--radius-sm` 8px (inputs), `--radius-md` 12px (chips and icon squares), `--radius-lg` 16px (cards), `--radius-xl` 24px (panels), `--radius-pill` 999px.

**Type** (Plus Jakarta Sans):
- H1: `clamp(2.25rem, 1.4rem + 3.6vw, 3.5rem)`, weight 800, letter-spacing -0.03em
- H2: `clamp(1.75rem, 1.2rem + 2vw, 2.5rem)`, weight 800
- H3: 1.125rem, weight 700
- Body: 1rem / 1.65
- Eyebrow: 0.75rem, weight 700, letter-spacing 0.12em, uppercase, colour boost

**Spacing:** Tailwind's 4px scale. Container 1200px. Section padding `py-24` desktop and `py-16` mobile. Card padding 24px (`p-6`), grid gaps 20 to 24px.

**Components:**

| Component | Source ref | Where it lives |
|---|---|---|
| Floating header bar | ref 1 | `page.tsx` header + CSS |
| Pill badge (hero eyebrow) | ref 1 | CSS `.badge` |
| Accent-phrase H1 | ref 1 | `page.tsx` `<span class="accent">` |
| Floating stat card + chip | ref 1 | new `components/HeroCards.tsx` (server) |
| Trust strip | ref 2 | `page.tsx` + `content.trust` |
| Eyebrow with rule | refs 2, 5, 8 | CSS `.eyebrow` |
| Pain card | ref 2 | `page.tsx` + `content.pains` |
| Icon square (tinted) | refs 2–4 | CSS `.icon-wrap` (restyled) |
| Service card with cue link | ref 3 | existing `ServiceCard` restyled |
| Case-study panel + dark screenshot card | ref 5 | results section restyle, `ResultShots` reused |
| FAQ card with circled +/− | ref 8 | `FaqItem` markup tweak + CSS |
| Dark CTA panel + white form card | ref 9 | audit section restyle, `LeadForm` unchanged |
| SVG motifs: `PhoneChatMotif`, `ThinkingMotif`, `MegaphoneMotif` | refs 2, 5, 9 (character vibe) | new `components/motifs.tsx`, inline SVG, `aria-hidden` |

Not adopted: Google-reviews widget (no real reviews), ROI calculator (the user declined), sectors grid (the audience is general), and orange.

## 4. Files touched across all phases
- `app/globals.css`: tokens and the restyle (the bulk of the work)
- `app/page.tsx`: hero markup, two new sections, section wrappers
- `app/layout.tsx`: drop Barlow
- `lib/content.ts`: add `trust` and `pains`, plus an accent phrase for the hero headline
- New: `components/HeroCards.tsx`, `components/motifs.tsx`
- `components/FaqItem.tsx`: icon markup only
- `CLAUDE.md` and `AGENTS.md`: sources of truth and the spring rule (Phase 1)
- Reused as they are: `MotionController`, `CountUp`, `ResultShots`, `LeadForm`, `StickyWhatsApp`, `WhatsAppTracking`, `lib/whatsapp.ts`, `isPlaceholder` and the `getComplete*` helpers

## 5. Verification for every phase
`npm run typecheck && npm run lint && npm test && npm run build`. Then Playwright screenshots of `/` at 390×844 and 1440×900, including a reduced-motion run, using the `run` skill. Then Lighthouse mobile on the production build, which must score 90 or more. No console errors.
