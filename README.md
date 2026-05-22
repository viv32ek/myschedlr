# MySchedlr

> Spec-driven monorepo — **update `specs/` first, then implement**.

## Structure
```
myschedlr/
├── specs/
│   ├── master.md          ← product spec (start here)
│   ├── api/openapi.yaml   ← API contract
│   ├── ui/components.md   ← UI component spec
│   └── mobile/screens.md  ← mobile screen spec
├── backend/               ← Node.js / Express
├── ui/                    ← React + Vite
├── mobile/                ← Flutter
└── docker-compose.yml
```

## Getting Started

### Backend
```bash
cd backend
cp .env.example .env
npm install
npm run dev        # http://localhost:4000
npm test
```

### UI
```bash
cd ui
cp .env.example .env
npm install
npm run dev        # http://localhost:3000
```

### Mobile
```bash
cd mobile
flutter pub get
flutter run
flutter test
```

### Docker (backend + ui)
```bash
cp backend/.env.example backend/.env
cp ui/.env.example ui/.env
docker-compose up
```

## Spec-Driven Workflow
1. Update `specs/master.md` with the feature
2. Add/update endpoints in `specs/api/openapi.yaml`
3. Update `specs/ui/components.md` or `specs/mobile/screens.md`
4. Implement — backend first, then UI/mobile against the contract
5. Write tests that validate the contract
