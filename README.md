# MySchedlr

> Spec-driven monorepo — **update `specs/` first, then implement**.

## Architecture

```
               ┌─────────────┐
               │  CloudFront  │
               └──────┬──────┘
                      │ HTTPS
               ┌──────▼──────┐
               │   S3 Bucket  │  (React UI static assets)
               └─────────────┘

  Mobile (Flutter) ──┐
                     │ HTTPS
               ┌─────▼──────┐
               │     ALB     │
               └──────┬──────┘
               ┌──────▼──────┐
               │  ECS Fargate │  (Express API, 2+ tasks)
               └──────┬──────┘
               ┌──────▼──────┐
               │   DynamoDB  │
               └─────────────┘
```

## Structure
```
myschedlr/
├── specs/
│   ├── master.md          ← product spec (start here)
│   ├── api/openapi.yaml   ← API contract
│   ├── ui/components.md   ← UI component spec
│   └── mobile/screens.md  ← mobile screen spec
├── backend/               ← Node.js / Express + DynamoDB
├── ui/                    ← React + Vite → S3 + CloudFront
├── mobile/                ← Flutter
├── infra/                 ← AWS CDK (TypeScript)
│   ├── bin/app.ts         ← CDK app entry
│   └── lib/
│       ├── database-stack.ts   ← DynamoDB
│       ├── backend-stack.ts    ← ECS Fargate + ALB + ECR
│       └── ui-stack.ts         ← S3 + CloudFront
└── docker-compose.yml     ← local dev (includes DynamoDB Local)
```

## Getting Started

### Prerequisites
- Node.js 20, Docker, Flutter 3.x, AWS CLI, AWS CDK (`npm i -g aws-cdk`)

### Local Dev (Docker Compose)
```bash
cp backend/.env.example backend/.env   # set JWT_SECRET
cp ui/.env.example ui/.env
docker-compose up                       # starts DynamoDB Local + backend + ui
```

### Backend (standalone)
```bash
cd backend && npm install
cp .env.example .env   # set JWT_SECRET + DYNAMODB_ENDPOINT=http://localhost:8000
npm run dev            # http://localhost:4000/health
npm test
```

### UI
```bash
cd ui && npm install
cp .env.example .env
npm run dev            # http://localhost:3000
```

### Mobile
```bash
cd mobile && flutter pub get && flutter run
```

## Deployment (AWS CDK)

### One-time bootstrap
```bash
aws configure        # or use IAM role
cd infra && npm install
npx cdk bootstrap    # once per AWS account/region
```

### Deploy all stacks
```bash
# 1. Build UI
cd ui && npm run build

# 2. Build & push backend Docker image to ECR (first deploy: create ECR repo first)
cd infra && npx cdk deploy MyschedlrDatabase MyschedlrBackend

# 3. Deploy UI to S3 + CloudFront
npx cdk deploy MyschedlrUi
```

### GitHub Actions CD (automatic on push to main)
Add these secrets to the repo:
| Secret | Value |
|--------|-------|
| `AWS_DEPLOY_ROLE_ARN` | IAM role with CDK + ECR permissions |
| `VITE_API_URL` | ALB DNS name (from BackendStack output) |

## Spec-Driven Workflow
1. Update `specs/master.md` with the feature
2. Add/update endpoints in `specs/api/openapi.yaml`
3. Update `specs/ui/components.md` or `specs/mobile/screens.md`
4. Implement — backend first, then UI/mobile against the contract
5. Write tests that validate the contract

