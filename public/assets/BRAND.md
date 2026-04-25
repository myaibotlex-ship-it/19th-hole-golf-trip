# The 19th Hole · Golf Trip Club — Brand Handoff

> **For Claude Code:** This document defines the visual + verbal system. Implement using `tokens.css` (CSS custom properties) as the single source of truth. Never hardcode hex values; always reference `var(--token-name)`.

---

## 1. Brand at a Glance

| Field | Value |
|---|---|
| Name | The 19th Hole |
| Subtitle | Golf Trip Club |
| Established | 2026 |
| Tagline (primary) | Lost Balls. Found Memories. |
| Tagline (secondary) | Good rounds. Great company. |
| Tagline (tertiary) | Any course. Every year. |
| Personality | Classic, warm, understated, members-only |
| Anti-personality | Sporty, aggressive, neon, corporate |

---

## 2. Logo System

Three lockups live in `/assets/`:

- `logo-primary.png` — full wordmark with flag-on-fairway mark. Hero placement, marketing.
- `logo-secondary.png` — circular badge. Stamps, merch, footer marks, social avatars on light bg.
- `logo-monogram.png` — "19" with flag and est. 2026. Favicons, app icons, embossed accents.

**Clear space:** minimum padding around any lockup = the cap-height of the "T" in "THE".
**Min size:** primary 160px wide; badge 64px; monogram 32px.
**Don't:** rotate, recolor, drop-shadow, place on busy photography without an ivory plate, stretch.

---

## 3. Color

All values in `tokens.css`. Use **semantic** roles in components, not core names.

### Core Palette

| Token | Hex | Role |
|---|---|---|
| `--color-forest` | `#1F3D2E` | Primary brand. Headlines, logo green. |
| `--color-navy` | `#132B45` | Deep support. Footers, formal contexts. |
| `--color-sand` | `#D8C8A6` | Warm neutral. Inset cards. |
| `--color-ivory` | `#F3EFE6` | Page background — the "paper". |
| `--color-gold` | `#CDA24E` | Accent. Rules, ornament, CTAs. |
| `--color-sage` | `#8CA28A` | Soft secondary. Tags, muted UI. |

### Usage Ratios (rough rule of thumb)
- Ivory: 60% · Forest: 25% · Sand/Sage: 10% · Gold: 5% (accent only — never a flood fill)

---

## 4. Typography

Three families, loaded from Google Fonts:

```html
<link href="https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;700;900&family=Montserrat:wght@500;600&family=Lora:wght@400;500;600&display=swap" rel="stylesheet">
```

| Family | Use | Token |
|---|---|---|
| Playfair Display | Display, headlines (often ALL CAPS at large size) | `--font-display` |
| Montserrat | Eyebrows, labels, smallcaps, UI buttons | `--font-eyebrow` |
| Lora | Body copy, longform | `--font-body` |

### Hierarchy

- Hero: Playfair Display 900, `--text-5xl`, line-height 1.05, tracking -0.02em
- H1: Playfair Display 700, `--text-3xl`
- H2: Playfair Display 700, `--text-2xl`
- Eyebrow: Montserrat 600, `--text-2xs`, ALL CAPS, tracking 0.16em
- Body: Lora 400, `--text-base`, line-height 1.6

---

## 5. Voice & Tone

Write like a witty member toasting the table — never like a brochure.

**Do:** short, declarative, evocative. Two-beat phrases. Specific verbs (toast, chase, found).
**Don't:** corporate hype, exclamation points, emoji, hashtag-think.

**Sample voice:**
- "A tradition among friends. Stories that last a lifetime."
- "Rooted in adventure. Built on camaraderie."
- "More than a trip. It's our tradition."

---

## 6. Imagery

**Subjects:** coastal courses at golden hour, vintage gear, friends mid-laugh, whiskey on the rocks, weathered duffels, single flag on the green.
**Treatment:** warm, slightly desaturated, film-grain feel. No stock-photo glossiness.
**Composition:** room to breathe; subjects sit in the lower or right third.

---

## 7. Components (Reference)

The brand-kit page (`brand-kit.html`) shows live-rendered examples for:

- Buttons (primary forest, ghost gold, link)
- Cards (paper card with hairline gold rule)
- Form inputs (underlined, no boxes)
- Tags / badges (sage, gold-outlined)
- Section dividers (centered gold flag glyph)
- Hero / page-header lockup

Match these patterns when building new screens.

---

## 8. Files

```
/assets/
  logo-primary.png
  logo-secondary.png
  logo-monogram.png
/tokens.css         ← single source of truth, import in app entry
/BRAND.md           ← this file
/brand-kit.html     ← visual reference (open in a browser)
```
