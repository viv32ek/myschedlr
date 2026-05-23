# Mobile Screen Spec

## Navigation Structure
```
Root (GoRouter)
├── Auth routes (unauthenticated)
│   ├── LoginScreen   (/login)   ← default redirect when not signed in
│   └── SignupScreen  (/signup)
└── App routes (authenticated — redirect to /login if no session)
    ├── HomeScreen    (/home)
    └── ProfileScreen (/profile) ← NOT YET IMPLEMENTED (v2)
```

Navigation uses **GoRouter** with an async `redirect` guard. On each navigation event the guard calls `Amplify.Auth.fetchAuthSession()` and redirects as follows:
- Unauthenticated user → `/home` or `/profile`: redirect to `/login`
- Authenticated user → `/login` or `/signup`: redirect to `/home`

## Screens
| Screen | Route | Auth | Status | Description |
|--------|-------|------|--------|-------------|
| `LoginScreen` | `/login` | No | ✅ done | Email + password sign-in via Amplify |
| `SignupScreen` | `/signup` | No | ✅ done | Name + email + password registration via Amplify |
| `HomeScreen` | `/home` | Yes | ✅ done | Main dashboard; logout button |
| `ProfileScreen` | `/profile` | Yes | ⏳ v2 | User profile — route exists in GoRouter; screen not yet built |

## Auth Integration
- Auth is handled by **Amplify Flutter** (`amplify_flutter` + `amplify_auth_cognito`)
- Amplify is initialised in `main.dart` using runtime config built from `flutter_dotenv` in `lib/config/amplify_config.dart`
- API calls attach the Cognito access token via `Amplify.Auth.fetchAuthSession()` → `CognitoAuthSession.userPoolTokensResult.value?.accessToken.raw`

## Platform Notes
- Minimum iOS: 14
- Minimum Android: API 26 (8.0)
- Flutter: 3.x
- Amplify Flutter: 1.x
