# UI Component Spec

> Design prototypes live in [`specs/designs/ui/unauth/`](../designs/ui/unauth/README.md).
> Open the `.html` files in a browser for ground-truth visuals and interactions.
> The canonical design-token and component reference is [`specs/designs/ui/unauth/DESIGN-SPEC.md`](../designs/ui/unauth/DESIGN-SPEC.md).

---

## Pages

| Route | Component | Auth required | Status | Design |
|-------|-----------|---------------|--------|--------|
| `/` | `LandingPage` | No | planned | [Landing.html](../designs/ui/unauth/MySchedlr%20Landing.html) |
| `/login` | `SignInPage` | No | ✅ done | [Sign In.html](../designs/ui/unauth/MySchedlr%20Sign%20In.html) |
| `/signup` | `SignUpPage` | No | ✅ done | [Sign In.html](../designs/ui/unauth/MySchedlr%20Sign%20In.html) |
| `/forgot-password` | `ForgotPasswordPage` | No | planned | [Sign In.html](../designs/ui/unauth/MySchedlr%20Sign%20In.html) |
| `/verify` | `VerifyAccountPage` | No | planned | [Sign In.html](../designs/ui/unauth/MySchedlr%20Sign%20In.html) |
| `/dashboard` | `DashboardPage` | Yes | ✅ done | — |

> The auth pages share a single split-panel shell (`AuthShell`). Navigate between them via `?screen=signIn|signUp|forgot|verify|done`.

---

## Design Tokens (Sky / Friendly — chosen direction)

```ts
// Source: specs/designs/ui/unauth/landing-shared.jsx  SKY object
const SKY = {
  // surfaces
  bg:           '#fbf5ea',   // app / page background (warm cream)
  surface:      '#ffffff',   // cards, inputs, modals
  surfaceAlt:   '#f1ebdc',   // recessed surfaces, list backgrounds
  surfaceDeep:  '#0e1320',   // dark sections (multi-tenant band, footer)

  // ink
  ink:          '#1a1714',   // primary text
  inkSoft:      '#3d3833',   // secondary text
  muted:        '#7a7066',   // captions, meta, placeholders

  // accent — sky blue
  accent:       '#2f80ed',
  accentDeep:   '#1f5fc3',   // gradient end, pressed/hover state
  accentSoft:   '#d8e7fb',   // pills, focus halos, highlights
  accentInk:    '#ffffff',   // text on accent surfaces

  // borders
  line:         'rgba(26,23,20,0.10)',
  lineStrong:   'rgba(26,23,20,0.18)',

  // shape
  radiusCard:   12,          // containers, cards, dropdowns
  radiusButton: 14,          // buttons

  // elevation
  shadow:   '0 1px 2px rgba(26,23,20,0.05), 0 10px 30px rgba(47,128,237,0.07)',
  shadowLg: '0 4px 12px rgba(26,23,20,0.08), 0 32px 60px rgba(47,128,237,0.10)',
}
```

### Typography

| Role | Size | Weight | Letter-spacing | Line-height | Font |
|------|------|--------|----------------|-------------|------|
| Display / hero | clamp(48px, 6vw, 84px) | 700 | -0.038em | 0.96 | Manrope |
| Section title (h2) | clamp(34px, 4vw, 52px) | 700 | -0.028em | 1.05 | Manrope |
| Card title (h3) | 36px | 700 | -0.028em | 1.1 | Manrope |
| Feature title (h4) | 19px | 700 | -0.02em | — | Manrope |
| Body large | 17–19px | 500 | — | 1.55 | Manrope |
| Body | 14–15px | 500 | — | 1.5 | Manrope |
| Caption | 12.5px | 500 | — | 1.4 | Manrope |
| Eyebrow / mono label | 10.5–11px | 600 | 0.14em | — | JetBrains Mono, uppercase |

- `font-feature-settings: "ss01", "cv11"` on all Manrope text
- Stats / counts: `font-variant-numeric: tabular-nums`

### Spacing

- Container max-width: 1200px, 48px horizontal padding
- Section vertical padding: 120px default, 72px dense
- Hero: 64px top / 96px bottom
- Card padding: 20–32px
- Sibling gap steps: 8 / 12 / 16 / 24 / 32 / 48 / 64px

---

## Shared Components

### `Button` / `LButton` / `AuthButton`

| Variant | Background | Text | Border | Use |
|---------|-----------|------|--------|-----|
| `primary` | `accent` | white | none + accent glow | single most important action per surface |
| `primaryDark` | `ink` | white | none | dark section primary |
| `secondary` | `surface` | `ink` | 1px `lineStrong` | safe alternatives |
| `secondaryDark` | rgba(255,255,255,.08) | white | 1px rgba(255,255,255,.18) | secondary on dark surfaces |
| `ghost` | transparent | `inkSoft` | none | nav links, tertiary |

Sizes: `sm` (8/14px, 13px font) · `md` (12/20px, 15px font) · `lg` (16/28px, 16px font)

- Primary glow: `box-shadow: 0 6px 18px rgba(47,128,237,0.30)`
- Always full-width inside auth forms; auto-width on marketing pages
- One primary button maximum per surface

### `FormField`

- Stacked label (top) + input
- Label: 13px / weight 600
- Input: ~44px height (padding 12×14), `surface` bg, 1px `lineStrong` border
- Focus state: `accent` border + `0 0 0 3px accentSoft` halo
- Error state: `#dc2626` border + `0 0 0 3px rgba(220,38,38,0.12)` halo
- Supports prefix/suffix slot (e.g. `https://` … `.myschedlr.app`)
- Help text: 12px below input

### `PasswordField`

Extends `FormField`. Adds Show / Hide toggle on the right. Includes a live `PasswordStrength` indicator on the sign-up form.

### `TenantSelect`

Searchable school-picker dropdown. Replaces free-text tenant input.

- Closed: 2-letter avatar (8px radius, `accentSoft` bg, `accent` fg) + school name + `<sub>.myschedlr.app` beneath
- Open: popover (12px radius), search input at top, scrollable list of tenants
- Each row: avatar + school name + `subdomain · city · N students`; selected row shows accent checkmark
- Keyboard: ↑/↓ navigate, Enter select, Esc close
- Footer note: "Don't see your school? Ask your admin for the right subdomain."
- Sample data: 9 tenants (source: `auth-shared.jsx TENANTS`), "Recent" pill on Northwind

### `OTPInput`

- 6 individual character boxes, equal width, 8px gap, 56px height
- 22px tabular-nums, centered
- Auto-advances on type; Backspace clears + moves back; paste fills all boxes
- Filled: `accent` border; empty: `lineStrong` border; focused: accent halo

### `Pill` / `LPill`

| Tone | Background | Text | Use |
|------|-----------|------|-----|
| `accent` (default) | `accentSoft` | `accent` | feature labels, eyebrows |
| `surface` | white + `line` border | `inkSoft` | neutral tags |
| `deep` | white-tint | white | dark-section variant |

Padding: 6×12px · Font: 12px / 600

### `Navbar` (TopNav)

- Sticky, full-width
- Logo (Monogram + Wordmark) left; `Product`, `Features`, `How it works` center; `Sign in` (ghost) + `Get a demo` (primary) right
- On scroll past 16px: `background: rgba(251,245,234,0.85)` + `backdrop-filter: blur`

### Cards

- Default: `surface` bg, 1px `line` border, 12px radius, `shadow`
- Featured (e.g. pricing tier): `ink` bg, white text, `translateY(-12px)` + `shadowLg`

### `AuthShell`

Split-panel layout wrapping all auth screens (0.95fr left / 1.05fr right).

- **Left panel** (`bg` cream): radial accent halos, logo, hero copy ("Class is in session."), rotated peek card, status + copyright footer
- **Right panel** (white): context link top-right, centered form (max-width 440px), support + legal footer

---

## Auth Flow

All auth is handled client-side via `amazon-cognito-identity-js` (no Amplify overhead).

- `useAuth.js` — hook exposing `signIn`, `signUp`, `signOut`, `forgotPassword`, `confirmOTP`; exports a `userPool` singleton (`CognitoUserPool`)
- `PrivateRoute.jsx` — reads live Cognito session; redirects to `/login` if none
- `api.js` — attaches `Authorization: Bearer <access-token>` on every API request (auto-refreshes on expiry)

### Auth screens

| Screen | `?screen=` | Top-right link | Primary CTA | Fields | Next |
|--------|-----------|----------------|-------------|--------|------|
| Sign In | `signIn` | No account? Sign up | Sign in | TenantSelect, Email, PasswordField, "Keep me signed in", Forgot password? | → verify |
| Sign Up | `signUp` | Have an account? Sign in | Create account | TenantSelect, Full name, Email, PasswordField (+ strength) | → verify |
| Forgot password | `forgot` | Back to sign in | Send reset link | TenantSelect, Email | success state |
| Verify account | `verify` | Back to sign in | Verify & continue | OTPInput (6 digits) | → done |
| Done | `done` | — | Go to dashboard | success state | `/dashboard` |

Key behaviours:
- OTP code is "already sent" on Verify screen entry; resend cooldown = 45s
- Forgot success shows email in bold + tenant scope warning + Resend link
- Sign-up subtitle: "Your role and batch are assigned by your admin." No role picker in the form
- Roles are assigned server-side by the org admin, not user-selectable

---

## Brand

- **Wordmark**: `myschedlr.` lowercase, accent-colored period
- **Monogram**: 32×32 square (radiusCard), `accent` bg, two offset vertical bars (`accentInk`) — reads as a divided schedule slot
- **Tagline**: "Class is in session."

---

## State Management

Auth state: `useAuth` hook (React Context + `amazon-cognito-identity-js`). No global store yet — add Zustand/Redux when scheduling feature introduces shared non-auth state.
