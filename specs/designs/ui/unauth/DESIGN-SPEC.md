# MySchedlr — Design Spec

Spec-form description of the design captured in this folder. Pair with the
HTML prototypes (open in browser) for ground truth. Use this file directly as
context for Copilot / Cursor / spec-driven workflows.

---

## 1. Brand

- **Name**: MySchedlr (wordmark: `myschedlr.` lowercase, accent-colored period)
- **Tagline**: "Class is in session."
- **Voice**: friendly, confident, student-leaning. Plain English over jargon.
  Avoid corporate-speak. Avoid emoji.
- **Monogram**: 32×32 square (theme radius), background = accent, two offset
  vertical bars inside (11px and 19px from left, 3.4×18 and 3.4×11) in the
  accent-ink color. Reads as a divided time block / schedule slot.

---

## 2. Tokens (Sky / Friendly — the chosen direction)

```ts
const SKY = {
  // surfaces
  bg:           '#fbf5ea',   // app / page background (warm cream)
  surface:      '#ffffff',   // cards, inputs, primary surface
  surfaceAlt:   '#f1ebdc',   // recessed surfaces, list bg
  surfaceDeep:  '#0e1320',   // dark sections (multi-tenant, footer)

  // ink
  ink:          '#1a1714',   // primary text
  inkSoft:      '#3d3833',   // secondary text
  muted:        '#7a7066',   // tertiary text, captions, meta

  // accent — sky blue
  accent:       '#2f80ed',
  accentDeep:   '#1f5fc3',   // gradient end, hover
  accentSoft:   '#d8e7fb',   // pills, hovers, highlight under "session"
  accentInk:    '#ffffff',   // text on accent surfaces

  // lines
  line:         'rgba(26,23,20,0.10)',
  lineStrong:   'rgba(26,23,20,0.18)',

  // shape
  radiusCard:   12,
  radiusButton: 14,

  // shadow
  shadow:       '0 1px 2px rgba(26,23,20,0.05), 0 10px 30px rgba(47,128,237,0.07)',
  shadowLg:     '0 4px 12px rgba(26,23,20,0.08), 0 32px 60px rgba(47,128,237,0.10)',
}
```

### Typography
- **Family**: `Manrope` (weights 400, 500, 600, 700, 800) for everything; `JetBrains Mono` (500, 600) for code, eyebrow labels, subdomains, stat suffixes, timestamps.
- **Features**: `font-feature-settings: "ss01", "cv11"`
- **Scale** (px):
  - Display (hero): clamp(48, 6vw, 84) · weight 700 · letter-spacing -0.038em · line-height 0.96
  - Section title (h2): clamp(34, 4vw, 52) · 700 · -0.028em · 1.05
  - Card title (h3): 36 · 700 · -0.028em · 1.1
  - Feature title (h4): 19 · 700 · -0.02em
  - Body large: 17–19 · 500 · 1.55
  - Body: 14–15 · 500 · 1.5
  - Caption: 12.5 · 500 · 1.4
  - Eyebrow / mono label: 10.5–11 · 600 · uppercase · 0.14em letter-spacing · JetBrains Mono

### Spacing
- Container max-width: 1200px, 48px horizontal padding
- Section vertical padding: 120px default, 72px dense
- Hero vertical padding: 64px top / 96px bottom
- Card padding: 20–32px
- Gap between siblings: 8 / 12 / 16 / 24 / 32 / 48 / 64 (use these only)

### Shape & elevation
- **Containers**: 12px radius, 1px solid `line`
- **Buttons**: 14px radius
- **Pills / chips**: full-rounded (`999px`)
- **Shadows**: prefer the two-token `shadow` / `shadowLg` rather than ad-hoc values

---

## 3. Components

### Buttons (`LButton` / `AuthButton`)
| Kind | Background | Text | Border | Use |
|---|---|---|---|---|
| primary | `accent` | white | none + accent glow | the single most important action |
| primaryDark | `ink` | white | none | dark surfaces, on-accent contrast |
| secondary | `surface` | `ink` | 1px `lineStrong` | safe alternative actions |
| secondaryDark | rgba(255,255,255,.08) | white | 1px rgba(255,255,255,.18) | secondary on dark surfaces |
| ghost | transparent | `inkSoft` | none | tertiary, nav |

- Sizes: sm (`8/14`, 13px), md (`12/20`, 15px), lg (`16/28`, 16px)
- Primary glow: `0 6px 18px rgba(47,128,237,0.30)`
- Always full-width inside auth forms; auto-width on marketing pages
- Single primary per surface

### Form fields (`FormField`)
- Stacked label (top) + input (bottom). Label: 13/600. Help text: 12 below input.
- Input height: ~44px (padding 12×14). Background: `surface`. Border 1px `lineStrong`.
- Focus: border becomes `accent`, halo `0 0 0 3px accentSoft`
- Error: border `#dc2626`, halo `0 0 0 3px rgba(220,38,38,0.12)`
- Prefix / suffix supported (e.g. `https://` … `.myschedlr.app`)
- Password field auto-adds Show / Hide toggle

### TenantSelect
Searchable dropdown replacing free-text tenant input.
- Closed state: 2-letter avatar (8px radius, `accentSoft` bg, `accent` fg) + school name + `<sub>.myschedlr.app` underneath
- Open: popover (12px radius, 12px shadow), search input at top, scrollable list
- Each row: avatar + school name + meta (`subdomain.myschedlr.app · city · N students`); selected gets accent check
- Keyboard: ↑/↓ to navigate, Enter to pick, Esc to close
- Footer: muted message ("Don't see your school? Ask your admin for the right subdomain.")
- Sample data: 9 tenants in `auth-shared.jsx#TENANTS`, "Recent" pill on Northwind

### OTPInput
- 6 individual character boxes, equal-width, gap 8px, height 56px
- 22px tabular-nums, centered
- Auto-advances on type, Backspace clears + moves back, paste fills all
- Filled boxes: border `accent`; empty: border `lineStrong`
- Focused box gets the accent halo

### Pills (`LPill`)
- `accent` tone (default): `accentSoft` bg, `accent` fg, accent dot
- `surface`: white bg with `line` border
- `deep`: dark-section variant (white-on-white-tint)
- 6×12 padding, 12px font, 600 weight

### Cards
- Background: `surface`; border: 1px `line`; radius 12; shadow: `shadow`
- Featured card (e.g. Pro pricing tier): `ink` bg, white text, lifted via `translateY(-12px)` + `shadowLg`

---

## 4. Pages & flows

### Landing page (`MySchedlr Landing.html`)

Section order:
1. **Sticky nav** — logo + nav links (`Product`, `Features`, `How it works`) + `Sign in` (ghost) + `Get a demo` (primary). Backgrounds becomes `rgba(251,245,234,0.85)` + blur on scroll past 16px.
2. **Hero**
   - Eyebrow pill: "Built for multi-tenant edu orgs"
   - Headline (clamp 48–84): "Class is in" / "**session**." — "session" has a `accentSoft` block-highlight, period in accent
   - Subheadline: 19px, 500 weight, references "zero cross-tenant spillover"
   - CTAs: `Start free for 30 days →` (links to sign-up), `▶ Watch 2-min tour` (no-op)
   - Below CTAs: avatar stack (4 placeholder colors) + "Trusted by 84+ schools across India & SEA" + 4 placeholder school names
   - Right column: a calendar-week peek (5 day columns, color-coded subject chips) with a "Next class" floating card overlapping, both with slight rotations
3. **Trust bar** — 4-column stats (`12,000+ classes/week`, `4,200 faculty`, `84 schools`, `99.98% uptime`) bordered top + bottom
4. **Three roles. One school OS.**
   - Eyebrow `Product`, centered title + subtitle
   - Pill tab switcher (Admin / Faculty / Student), Student default
   - Left: per-role copy + 4 bullets + "See [role] demo" secondary CTA
   - Right: per-role mini-screenshot in a window-chrome frame
5. **Features grid** — 6 features × 3-col × 2-row. Each card: 42×42 icon tile (`accentSoft` bg) + title + 1-line description + monospace index in top-right
6. **Multi-tenant by design** — dark band (`surfaceDeep`)
   - Centered title + subtitle
   - 3 tenant cards side by side (Northwind, Harbor, Kaveri) with color-coded avatars, names, subdomains, student / faculty counts, "isolated" pill
   - SVG dashed connector lines descending into a central "myschedlr platform" pill (accent bg, white text)
   - Below: 3 supporting feature cards (subdomain, isolation, admin controls)
7. **Big CTA** — gradient card (accent → accentDeep), decorative tilted monograms, "Bring your school online / Your first batch live in seven days." + inline email signup form + secondary "Or talk to sales" + trust strip (no card · 30-day · free onboarding)
8. **Footer** — dark, 5-column: brand+tagline+socials, then `Product`, `For` (audiences), `Company`, `Legal`. Bottom strip: copyright + status indicator

### Auth flow (`MySchedlr Sign In.html`)

**Shell** — Split layout (0.95fr / 1.05fr).
- Left = brand panel: cream bg (`SKY.bg`), radial halos top-left + bottom-right, logo top, hero copy mid (reused "Class is in session."), peek card (rotated -1°), bottom footer with status + copyright.
- Right = form panel: white bg, top-right context link (changes per screen), centered form (max-width 440), bottom footer with `Unable to sign in? Contact support` + `Terms & Privacy`.

**Screens** (all URL-routable via `?screen={signIn|signUp|forgot|verify|done}`):

| Screen | Top-right link | Primary CTA | Fields | Next |
|---|---|---|---|---|
| Sign In | `No account? Sign up` | "Sign in" | TenantSelect, Email, PasswordField, "Keep me signed in" check, "Forgot password?" inline | → Verify |
| Sign Up | `Have an account? Sign in` | "Create account" | TenantSelect, Full name, Email with school, PasswordField (with live strength meter) | → Verify |
| Forgot | `← Back to sign in` | "Send reset link" | TenantSelect, Email | → success state ("Check your inbox.") |
| Verify | `← Back to sign in` | "Verify & continue" | OTPInput (6 digits) | → Done |
| Done | — | "Go to dashboard" | (success) | external |

Key behaviours:
- Verify: code is "already sent" on screen entry. Resend cooldown starts at 45s. Email-only, no method picker.
- Forgot success: shows email in bold + tenant scope warning + Resend link
- Sign-up subtitle: "Your role and batch are assigned by your admin." (no role picker in form)
- Roles assigned server-side; not selectable client-side

---

## 5. Multi-tenant rules (informs the UX)

- One tenant = one school / coaching center / institute. Subdomain at `<sub>.myschedlr.app`
- Tenants are siloed at the database, cache, and audit-log layer (row-level security)
- Per-tenant: roles & permissions, retention, SSO config, branding, data residency
- Cross-tenant queries return zero rows by construction
- Org admin never sees another tenant's data

### Roles
- **Admin** — operator. Console for batches, faculty, students, calendars, dashboards.
- **Faculty** — teacher. Today view, attendance, materials, grading.
- **Student** — learner. Schedule, materials, tests, scores, streak.

---

## 6. Content guidelines

- Headlines are short, balanced, declarative. Use `text-wrap: balance`.
- Body copy uses `text-wrap: pretty` for nicer rags.
- Stats and counts use `font-variant-numeric: tabular-nums` and slightly tighter letter-spacing.
- Mono labels (eyebrows, subdomains, IDs) are always uppercase with 0.14em letter-spacing.
- Avoid filler. Avoid emoji.
- Decision-maker / parent surfaces lean editorial; student surfaces lean warm.

---

## 7. Things explicitly **not** in this prototype

- Real backend / auth (all submits are mock setTimeouts)
- SSO providers (removed by request)
- Tenant creation flow (removed by request — admins create tenants out-of-band)
- Role picker on signup (assigned by admin)
- Pricing page (defined but not rendered)
- In-product dashboards beyond the mini-screenshots in the roles section
- Mobile responsive breakpoints (designed at desktop widths first)
