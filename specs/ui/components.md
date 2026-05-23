# UI Component Spec

## Pages
| Route | Component | Auth required | Status |
|-------|-----------|---------------|--------|
| `/` | `HomePage` | No | planned |
| `/login` | `LoginPage` | No | ✅ done |
| `/signup` | `SignupPage` | No | ✅ done |
| `/dashboard` | `DashboardPage` | Yes | ✅ done |

## Auth Flow
Auth is handled client-side via `amazon-cognito-identity-js` (no Amplify overhead).

- `useAuth.js` — central hook exposing `signIn(email, password)`, `signUp(email, password)`, `signOut()`; exports a `userPool` singleton (`CognitoUserPool`)
- `PrivateRoute.jsx` — wraps protected routes; calls `userPool.getCurrentUser().getSession()` to verify a live Cognito session; redirects to `/login` if none
- `api.js` — retrieves the Cognito access token via `getSession()` (auto-refreshes on expiry) and attaches it as `Authorization: Bearer <token>` on every API request

## Shared Components
- `Button` – primary / secondary / danger variants
- `Input` – text, email, password
- `Modal` – generic modal wrapper
- `Navbar` – top navigation bar

## Design Tokens
- **Primary color**: `#3B82F6`
- **Font**: Inter
- **Spacing scale**: 4px base

## State Management
Auth state is managed by the `useAuth` hook (React Context + `amazon-cognito-identity-js`). No global store (Zustand/Redux) is in use yet — add when scheduling feature introduces shared non-auth state.
