# MySchedlr — Master Product Spec

## Overview
MySchedlr is a multi-tenant SaaS scheduling application built on AWS. Each tenant gets fully isolated infrastructure (ECS service, DynamoDB table, Cognito User Pool). Users within a tenant can schedule and manage appointments/events.

## Goals
- [x] Per-tenant infrastructure isolation (ECS + DynamoDB + Cognito)
- [x] AWS-native authentication via Cognito (no custom JWT)
- [ ] Core scheduling CRUD (create, read, update, delete appointments)
- [ ] Calendar views (day / week / month)
- [ ] Notifications (email/push) for upcoming appointments

## Users & Roles
| Role | Description |
|------|-------------|
| `admin` | Manages tenant resources; can CRUD all schedules |
| `user` | Standard authenticated user; manages own schedules |

Roles are managed as Cognito User Pool Groups. The backend reads the role from the `cognito:groups` claim in the access token.

## Auth Architecture
Authentication is delegated entirely to **AWS Cognito**. There are no custom auth endpoints on the backend.

- One **Cognito User Pool per tenant** (matches per-tenant infrastructure isolation)
- Clients (UI, mobile) talk directly to Cognito for sign-up, sign-in, token refresh, and password reset
- The backend is a **pure resource server**: it validates Cognito-issued JWT access tokens using `aws-jwt-verify`
- Token-to-tenant isolation is implicit: each ECS task is configured with its tenant's `COGNITO_USER_POOL_ID`, so tokens from other pools automatically fail verification
- User profiles are **lazy-provisioned** in DynamoDB on first `GET /users/me`; identity fields (email, name) remain in Cognito

## Core Features
| Feature | Priority | Status |
|---------|----------|--------|
| Auth — sign up / sign in / sign out | P0 | ✅ done |
| Auth — token refresh (automatic via SDK) | P0 | ✅ done |
| User profile (lazy-provisioned from Cognito sub) | P0 | ✅ done |
| Per-tenant CDK infra (ECS + DynamoDB + Cognito) | P0 | ✅ done |
| Scheduling CRUD | P1 | planned |
| Calendar views | P1 | planned |
| Mobile ProfileScreen | P2 | planned (v2) |
| Notifications | P2 | planned |

## Data Models
> High-level entities — detailed schemas live in `specs/api/openapi.yaml`

- **User** – `id` (= Cognito `sub`), `role`, `tenantId`, `createdAt`
  - `email` and `name` are identity fields owned by Cognito; they are **not** stored in DynamoDB
  - DynamoDB key: `pk = USER#<cognitoSub>` (no GSI needed)
- *(Appointment, Schedule — to be defined when scheduling feature is specced)*

## Out of Scope (v1)
- Mobile `ProfileScreen` — listed in `specs/mobile/screens.md` but deferred to v2
- Password reset UI (handled by Cognito hosted UI or a future custom flow)
- Multi-role users (a user belongs to exactly one Cognito group)
