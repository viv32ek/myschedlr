# Mobile Screen Spec

## Navigation Structure
```
Root
├── Auth Stack
│   ├── LoginScreen
│   └── SignUpScreen
└── App Stack (authenticated)
    ├── HomeScreen
    └── ProfileScreen
```

## Screens
| Screen | Route | Auth | Description |
|--------|-------|------|-------------|
| `LoginScreen` | `/login` | No | Email + password login |
| `SignUpScreen` | `/signup` | No | User registration |
| `HomeScreen` | `/home` | Yes | Main dashboard |
| `ProfileScreen` | `/profile` | Yes | User profile |

## Platform Notes
- Minimum iOS: 14
- Minimum Android: API 26 (8.0)
- Flutter version: 3.x
