# MySchedlr

> Spec-driven monorepo — **update `specs/` first, then implement**.

## Architecture

```
  acme.myschedlr.com          betacorp.myschedlr.com
        │                              │
  ┌─────▼──────────────────────────────▼─────┐
  │           ALB  (shared)                   │
  │  host: acme.*  ──►  ECS Service (acme)    │
  │  host: betacorp.* ─► ECS Service (betacorp)│
  └──────────────────────────────────────────-┘
         │                         │
  ┌──────▼──────┐           ┌──────▼──────┐
  │  DynamoDB   │           │  DynamoDB   │
  │ acme-users  │           │betacorp-users│  ← complete data silo
  └─────────────┘           └─────────────┘

  CloudFront (acme)        CloudFront (betacorp)
       │                          │
  S3 acme-ui               S3 betacorp-ui       ← separate UI per tenant
```

**Multi-tenancy model: table-per-tenant silo**
- Each tenant's data is in its own DynamoDB table — zero cross-tenant data access
- Same Docker image runs in separate ECS services per tenant
- JWT `tid` claim is validated against the active tenant to prevent token cross-use
- Adding a tenant = one entry in `infra/tenants.json` + `cdk deploy`

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
│   ├── tenants.json       ← add/remove tenants here
│   ├── bin/app.ts         ← CDK app entry (loops over tenants)
│   └── lib/
│       ├── shared-stack.ts     ← VPC, ECS Cluster, ECR, ALB (shared)
│       └── tenant-stack.ts     ← DynamoDB + ECS Service + S3/CloudFront (per tenant)
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
# 1. Build UI (repeat per tenant with appropriate VITE_TENANT_ID)
cd ui && VITE_TENANT_ID=acme npm run build

# 2. Deploy shared infra first
cd infra && npx cdk deploy MyschedlrShared

# 3. Deploy each tenant (or --all to deploy everything)
npx cdk deploy MyschedlrTenant-acme MyschedlrTenant-betacorp
# or: npx cdk deploy --all
```

### Adding a new tenant
1. Add an entry to `infra/tenants.json`
2. Run `cd infra && npx cdk deploy MyschedlrTenant-<newid>`
3. Build + deploy the UI with `VITE_TENANT_ID=<newid>`

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

