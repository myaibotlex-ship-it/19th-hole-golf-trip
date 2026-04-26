# PROJECT_SNAPSHOT.md — The 19th Hole Golf Trip Site
> Generated 2026-04-25. Snapshot of `main` at commit `dc711c9`.

---

## 1. Stack & Versions

| Layer | Package | Version |
|---|---|---|
| Framework | next | 16.2.4 |
| UI Library | react / react-dom | 19.2.4 |
| Language | typescript | ^5 |
| CSS | tailwindcss | ^4 (CSS-first, `@import "tailwindcss"`) |
| PostCSS | @tailwindcss/postcss | ^4 |
| Linting | eslint + eslint-config-next | ^9 / 16.2.4 |
| Runtime | Node.js | v22.22.2 |
| Package manager | npm | — |
| Hosting | Vercel (auto-deploy from `main`) | — |
| Domain | golftripboyz.com | — |

No `vercel.json`, no `.nvmrc`, no `engines` field in `package.json`.

**Next.js 16 key difference:** Middleware is now `src/proxy.ts` (not `middleware.ts`). Export name is `proxy()`, not `middleware()`. This is a breaking change in v16.

---

## 2. Project Structure

```
19th-hole-golf-trip/
├── public/
│   ├── images/
│   │   └── hero-black-desert.jpg
│   ├── assets/
│   │   ├── assets/
│   │   │   ├── logo-primary.png
│   │   │   ├── logo-secondary.png
│   │   │   └── logo-monogram.png
│   │   ├── tokens.css          ← brand token source of truth
│   │   └── BRAND.md
│   └── robots.txt              ← Disallow: / (private site)
├── src/
│   ├── proxy.ts                ← Next.js 16 auth gate (NOT middleware.ts)
│   └── app/
│       ├── layout.tsx
│       ├── page.tsx            ← homepage
│       ├── globals.css         ← design tokens + utility classes
│       ├── favicon.ico
│       ├── api/
│       │   ├── login/route.ts
│       │   └── logout/route.ts
│       ├── login/page.tsx
│       ├── itinerary/page.tsx
│       ├── rsvp/page.tsx
│       ├── tasks/page.tsx
│       ├── scores/page.tsx
│       ├── gallery/page.tsx
│       ├── merch/page.tsx
│       └── components/
│           ├── Navigation.tsx
│           ├── Footer.tsx
│           ├── PageHeader.tsx
│           └── ThemeProvider.tsx
├── .env.example                ← SITE_PASSWORD= (only env var)
├── CLAUDE.md → AGENTS.md      ← auto-commit rules, Next.js 16 notes
└── package.json
```

---

## 3. Routes & Pages

| Route | File | Type | Description |
|---|---|---|---|
| `/` | `app/page.tsx` | Client | Photo hero, trip stats strip, live countdown |
| `/itinerary` | `app/itinerary/page.tsx` | Server | Lodging cards + 4-day golf schedule |
| `/rsvp` | `app/rsvp/page.tsx` | Server | Static confirmed roster of 8 |
| `/tasks` | `app/tasks/page.tsx` | Client | Interactive checklist with localStorage |
| `/scores` | `app/scores/page.tsx` | Client | Scorecard grid with localStorage |
| `/gallery` | `app/gallery/page.tsx` | Client | Photo lightbox with client-side upload |
| `/merch` | `app/merch/page.tsx` | Server | 8 products, no cart/checkout |
| `/login` | `app/login/page.tsx` | Client | Branded auth page |
| `/api/login` | `app/api/login/route.ts` | API | POST — rate-limited password check |
| `/api/logout` | `app/api/logout/route.ts` | API | GET — clears cookie, redirects to /login |

All routes except `/login`, `/api/login`, and `/api/logout` are behind the auth gate in `src/proxy.ts`.

---

## 4. Components

### `Navigation.tsx` (Server component)
Compact 68px header. Monogram logo (`logo-monogram.png`, 36×36) + "The 19th Hole" Playfair Display wordmark. Nav links: Home, Itinerary, RSVP, Tasks, Scores, Gallery, Merch. Theme toggle (light/dark) on the right.

### `Footer.tsx` (Server component)
Forest green background. Two-column: monogram + wordmark left, closing quote right. Meta row with "Sign Out" link to `/api/logout`. Sign Out uses `.footer-sign-out` CSS class for hover effect (server component — no event handlers).

### `PageHeader.tsx` (Server component)
Reusable. Props: `eyebrow: string`, `title: string`, `subtitle: string`. Renders a branded section header with gold rule ornament.

### `ThemeProvider.tsx` (Client component)
Wraps the entire app. Reads/writes `theme` from localStorage, applies `.dark` or `.light` class to `<html>`. `suppressHydrationWarning` on `<html>` to prevent SSR mismatch.

---

## 5. Data & Content

All data is hardcoded in component files — no database, no CMS.

### Trip Overview
- **Dates:** June 3–7, 2026
- **Location:** St. George, Utah
- **Group:** 8 players, all confirmed and paid

### Attendees (rsvp/page.tsx)
Dan Rackley (Captain), David McClain, Ryan Blake, Casey Costa, Ryan Roth, Grant Anderson, Casper Heuckroth, Eric Mehrten

### Lodging (itinerary/page.tsx)
| Property | Check-in | Check-out | Notes |
|---|---|---|---|
| Black Desert Resort | Wed Jun 3 | Thu Jun 4 | 4 rooms, 2 queens — $1,489.76 paid by Dan |
| House Rental | Wed Jun 3 | Sat Jun 6 | Full group — $2,971.93 paid by Dan |

Group splits first night (some at Resort, rest at house). Everyone at house from Jun 4.

### Golf Schedule (itinerary/page.tsx)
| Day | Course | Tee Times | Cost | Status |
|---|---|---|---|---|
| Wed Jun 3 AM | Black Desert Golf Course | 1:12 PM · 1:24 PM | $350/person | Confirmed |
| Thu Jun 4 AM | The Ledges Golf Club | 8:00 AM · 8:10 AM | $1,033.34 prepaid by Dan | Confirmed |
| Thu Jun 4 PM | Coral Canyon Golf Course | TBD | TBD | **Pending** — booking opens Mar 4, 2026 |
| Fri Jun 5 AM | Wolf Creek Golf Club | 10:00 AM · 10:10 AM | $225/person at course | Confirmed |
| Sat Jun 6 AM | Sand Hollow Golf Course | 7:42 AM · 7:53 AM | $1,066 total at course | Confirmed |
| Sat Jun 6 PM | Copper Rock Golf Course | TBD | TBD | **Pending** — not yet booked |

### Open Tasks (tasks/page.tsx)
Stored in localStorage key `19th-hole-tasks-v2`. Initial state:
1. Book Coral Canyon tee time (Dan · Golf · opens Mar 4, 2026)
2. Book Copper Rock tee time — Sat Jun 6 afternoon (Dan · Golf · not yet available)
3. Collect remaining payments (Dan · Budget · pending final course bookings)

### Scores (scores/page.tsx)
8 players × 6 rounds grid. Stored in localStorage key `19th-hole-scores-utah`. Net score formula: `net = gross - round(handicap × roundsPlayed / 6)`.

### Homepage Stats (page.tsx)
| Stat | Label |
|---|---|
| 6 | ROUNDS — Across 4 days of desert golf |
| 8 | DUDES — Captain: Dan Rackley |
| 4 | NIGHTS — Black Desert Resort + private house |
| $0 | OUTSTANDING — Group settled in advance |

Countdown targets `2026-06-03T20:12:00Z` (first tee time, Black Desert).

---

## 6. Integrations & Third-Party Services

**None.** The site has zero third-party integrations:
- No analytics (no GA, no Plausible, no Vercel Analytics)
- No payment processing
- No database (Supabase, PlanetScale, etc.)
- No CMS
- No email (SendGrid, Resend, etc.)
- No feature flags

Only external dependency is Vercel for hosting and Google Fonts (loaded via `next/font/google` — no external script tags).

---

## 7. Auth / Access Control

The entire site (except login/logout routes) is protected by a shared trip password.

### How it works

**`src/proxy.ts`** — Next.js 16 proxy (replaces middleware.ts):
```ts
export function proxy(request: NextRequest) { ... }
export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon\\.ico|robots\\.txt|images/|assets/|api/).*)" ],
};
```
- Checks for cookie `gh19_auth=valid`
- Redirects to `/login?redirect=<pathname>` if missing
- Public paths: `/login`, `/api/login`, `/api/logout`

**`src/app/api/login/route.ts`** — POST handler:
- In-memory rate limiter: 10 attempts per IP per 5 minutes
- Constant-time compare via `crypto.timingSafeEqual` (checks lengths first to avoid throw)
- Sets cookie: `gh19_auth=valid`, httpOnly, secure in prod, sameSite lax, maxAge 30 days
- Fails open (allows access) if `SITE_PASSWORD` env var is not set (logs a warning)

**`src/app/api/logout/route.ts`** — GET handler:
- Clears cookie (`maxAge: 0`)
- Redirects to `/login`

**`src/app/login/page.tsx`** — Branded login page:
- Uses `Suspense` wrapper around `LoginForm` (required for `useSearchParams()`)
- Post-login uses `window.location.href` (hard reload) not `router.push()` — ensures proxy sees fresh cookie

**Environment variable:**
```
SITE_PASSWORD=<shared password>
```
Set in Vercel dashboard. Local dev uses `.env.local` (gitignored). `.env.example` is committed.

---

## 8. Styling & Brand

### Token System
All design values live in `public/assets/tokens.css` (source of truth) and are mirrored in `src/app/globals.css`. Never hardcode hex values — always use CSS custom properties.

### Core Palette
| Token | Value | Role |
|---|---|---|
| `--color-forest` | `#1F3D2E` | Primary dark green |
| `--color-gold` | `#CDA24E` | Accent / highlight |
| `--color-ivory` | `#F3EFE6` | Light background |
| `--color-sand` | `#D8C8A6` | Warm neutral |
| `--color-sage` | `#8CA28A` | Muted green |
| `--color-navy` | `#132B45` | Dark blue (unused currently) |

### Typography
- **Display** (`--font-display`): Playfair Display (400/700/900) — headlines, hero
- **Eyebrow** (`--font-eyebrow`): Montserrat (500/600/700) — labels, tags, caps
- **Body** (`--font-body`): Lora (400/500/600/700) — body copy, notes

### Utility Classes (globals.css)
`.eyebrow`, `.gold-rule`, `.gold-rule-ornament`, `.card`, `.section`, `.container-base/.narrow/.wide`, `.tag` (+ `.tag-sage/.gold/.forest/.sand`), `.btn-primary/.gold/.ghost/.ghost-light/.link`, `.brand-table`, `.footer-sign-out`

### Dark Mode
Triggered by `prefers-color-scheme: dark` or `.dark` class on `<html>` (via ThemeProvider). "After Hours at the Clubhouse" palette — deep forest greens.

### Paper Texture
`body::before` — fixed, full-screen dotted radial gradient overlay (z-index: 0, pointer-events: none). Creates subtle paper feel.

---

## 9. Recent Git History

```
dc711c9  Add auto-commit workflow rules to CLAUDE.md
57d9b99  fix: remove Ivins and Hurricane from location taglines
8f01f71  feat: password-gate site with shared trip password
5cc2fd7  chore: trigger Vercel deploy
b3e7e97  feat: photo-led hero, real Utah trip data, compact monogram nav
a197df3  feat: implement brand kit design — footer, buttons, tags, texture, ornament
d2230b3  Exact CSV data integration: Dates/names/tee times/flights/costs/tasks
93b9e45  Sleek redesign: Logo fixes, no emojis, professional polish
9b4e23e  Integrate real CSV data + flights
27d2253  Brand kit redesign + merch page
```

---

## 10. Known Gaps / TODOs

No `TODO` or `FIXME` comments exist anywhere in the source code.

**Functional gaps:**
- **Coral Canyon & Copper Rock** not booked — tee times show "Pending" on Itinerary page; tasks exist in Tasks page
- **Merch page** has 8 products but no cart, no checkout, no order collection mechanism — buttons are decorative
- **Gallery page** shows brand asset placeholders, not real trip photos; client-side upload writes to `URL.createObjectURL` (memory only — doesn't persist)
- **Scores page** uses localStorage — scores are per-device, not shared across the group
- **Tasks page** uses localStorage — task state is per-device
- **No server-side state** — scores/tasks can't be seen by others in real time
- **No email notifications** — no mechanism to alert attendees of changes
- **Rate limiter is in-memory** — resets on server restart / each Vercel function cold start; not distributed

**Non-blocking notes:**
- `SITE_PASSWORD` not set → site fails open (auth bypassed) with a console warning
- `robots.txt` blocks all crawlers (`Disallow: /`)
- No `og:image` or social meta tags
