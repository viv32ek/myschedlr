# MySchedlr — Design Reference

This folder contains the **design prototypes** for MySchedlr, a multi-tenant
SaaS for education organizations. The artifacts are HTML/React-via-Babel
prototypes intended as **visual + behavioural specification** for development
— not as production code.

Open any `.html` file directly in a browser to view (needs internet for the
Google Fonts and React/Babel CDNs).

---

## Artifacts

| File | What it is |
|---|---|
| `MySchedlr Landing.html` | Full marketing landing page in the Sky / Friendly theme. Sticky nav, hero, stats strip, role tabs, features grid, multi-tenant architecture section, big CTA, footer. |
| `MySchedlr Sign In.html` | Interactive auth flow — Sign In, Sign Up, Forgot Password, Verify Account (email OTP), and the signed-in success state. Routed via `?screen=…` so any screen is deep-linkable. |
| `MySchedlr Theme.html` | Theme-exploration canvas — four direction options (Bright Optimist, Editorial Calm, Dark Focus, Soft Pop) and a "Bright + Blue" sub-explore. Kept for reference; the Sky / Friendly direction was chosen. |

---

## Design system summary

- **Direction**: Sky / Friendly — warm cream surfaces with sky-blue accent
- **Typeface**: Manrope across the board (Google Fonts); JetBrains Mono for code/labels
- **Anchor palette** (Sky / Friendly tokens — see `landing-shared.jsx` `SKY`):
  - `bg` `#fbf5ea` · `surface` `#ffffff` · `surfaceAlt` `#f1ebdc` · `surfaceDeep` `#0e1320`
  - `ink` `#1a1714` · `inkSoft` `#3d3833` · `muted` `#7a7066`
  - `accent` `#2f80ed` · `accentDeep` `#1f5fc3` · `accentSoft` `#d8e7fb`
  - `radiusCard` 12px · `radiusButton` 14px
- **Shape language**: mixed — sharp/low-radius containers (`12px`), softer rounded buttons (`14px`), full-pill chips
- **Brand mark**: a "schedule slot" monogram (filled square + two offset vertical bars) plus the lowercase wordmark `myschedlr.` with the period in accent

---

## File map

### Shared
- `theme-tokens.jsx` — `Monogram`, `Wordmark`, `ThemeFrame`, four theme objects (`THEMES.bright`, `.editorial`, `.dark`, `.soft`)
- `tweaks-panel.jsx` — reusable in-prototype tweaks panel + control primitives (`TweaksPanel`, `TweakSlider`, `TweakColor`, `TweakRadio`, `TweakSelect`, `TweakToggle`, …)
- `design-canvas.jsx` — pan/zoom design canvas used by the theme exploration

### Landing page
- `landing-shared.jsx` — Sky token object (`SKY`), `LContainer`, `LSection`, `LButton`, `LPill`, `LEyebrow`, `LCardLabel`, `scrollToId`
- `landing-top.jsx` — `TopNav` (sticky, frosts on scroll), `Hero` (calendar peek + next-class card), `TrustBar` (stats strip)
- `landing-roles.jsx` — `RolesSection` (Admin / Faculty / Student tabs with per-role mini-screenshots), `MultiTenantSection` (isolation diagram)
- `landing-bottom.jsx` — `FeaturesSection` (6-tile grid), `BigCTA` (gradient card + email form), `Footer` (5-column dark)
- `landing-app.jsx` — composes the above + a small Tweaks panel
- *(`PricingSection` is defined in `landing-bottom.jsx` but not currently rendered)*

### Auth flow
- `auth-shared.jsx` — `AuthShell` (split layout), `FormField`, `PasswordField`, `TenantSelect` (searchable school dropdown), `OTPInput`, `AuthButton`, `TextLink`, `OrDivider`
- `auth-screens.jsx` — `SignInScreen`, `SignUpScreen`, `ForgotPasswordScreen`, `VerifyAccountScreen`, `DoneScreen`; helper `Segmented`, `Checkbox`, `PasswordStrength`
- `auth-app.jsx` — state machine + URL routing + Tweaks panel

### Canvas exploration (reference only)
- `app.jsx`, `landing-hero.jsx`, `student-dashboard.jsx`, `style-tile.jsx` — used by `MySchedlr Theme.html`

---

## User flows captured

### 1. Landing → Sign Up → Verify → Signed in
1. Hit `MySchedlr Landing.html`; click **Get a demo** or **Start free for 30 days** in the hero
2. Lands on `MySchedlr Sign In.html?screen=signUp` — Sign Up form (school dropdown, name, email, password)
3. Submit → routes to **Verify Account** (`?screen=verify`)
4. Email OTP code is "already sent" on screen entry; 45s resend cooldown
5. Enter 6-digit code → routes to **Done** (`?screen=done`)

### 2. Returning user
1. Hit `MySchedlr Sign In.html` (or click **Sign in** from landing nav)
2. School picker → email → password → submit → Verify → Done

### 3. Forgot password
1. From Sign In, click **Forgot password?** → `?screen=forgot`
2. School + email → submit → confirmation state ("Check your inbox.")

### 4. Contact support escape hatch
Every auth screen footer shows **Unable to sign in? Contact support** linked to `mailto:support@myschedlr.app`.

---

## Multi-tenant model (as represented in the prototype)

- Each tenant gets a subdomain: `<sub>.myschedlr.app`
- Sample tenants live in `auth-shared.jsx` `TENANTS` array (name + sub + city + student count)
- Sign-in / Sign-up always require selecting a tenant first
- Roles (Student / Faculty / Admin) are NOT picked at sign-up — they're assigned server-side by the admin

---

## How to use with Copilot

1. Open the HTML files in the browser to internalize the visual direction and interactions
2. Read `landing-shared.jsx` `SKY` and `theme-tokens.jsx` `THEMES` to lift exact design tokens
3. Reference component files (e.g. `auth-shared.jsx` for form patterns) when writing your specs
4. Treat the React-via-Babel structure as **markup spec only** — your real codebase can use any framework

---

## Tweaks panels

Every prototype has a **Tweaks** toggle in the host toolbar. Opening it reveals
last-mile live controls — accent shade, button radius, screen navigation for
the auth flow, etc. Useful for verifying alternatives quickly during review.
