# MySchedlr — Master Product Spec

## Overview
MySchedlr is a multi-tenant SaaS platform for education organizations. It lets admins manage schools, courses, and batches; faculty to schedule and deliver classes; and students to track their enrolled batches, classes, and test results. Each tenant (organization) gets fully isolated infrastructure (ECS service, DynamoDB tables, Cognito User Pool) — zero cross-tenant data access.

## Goals
- [x] Per-tenant infrastructure isolation (ECS + DynamoDB + Cognito)
- [x] AWS-native authentication via Cognito (no custom JWT)
- [ ] Enable education orgs to manage their entire academic calendar from a single platform
- [ ] Allow faculties to track hours taught and generate billing records automatically
- [ ] Give students a clear view of their schedule, attendance, and upcoming tests
- [ ] Support multi-school orgs where the same course catalog can be reused across schools

## Users & Roles
A user can hold **multiple roles simultaneously** (e.g. a person who is both an admin and a faculty member).

| Role | Description |
|------|-------------|
| `admin` | Platform administrator — sub-types and scoped permissions described below |
| `faculty` | Teacher — assigned to batches/subjects by admins; views schedule, takes attendance, logs chapter/unit coverage |
| `student` | Enrolled learner — always in a student group within a school; views batch schedule, attendance, and tests |

Roles are stored as a DynamoDB String Set (`SS`) so a user can hold multiple simultaneously. The backend reads roles from the DynamoDB profile (not from Cognito groups).

### Admin Sub-Types

The `adminType` field on the user record determines their admin tier:

| `adminType` | Who can assign | Description |
|-------------|----------------|-------------|
| `super_admin` | Platform ops only | Full tenant-level superpowers. Can configure anything, manage tenancy, and delegate access to any user. |
| `tenancy_admin` | Super admin | Access to tenancy configuration modules, controlled by the `tenancyAccess` set: `core` (catalog, schools, batches, scheduling) and/or `billing`. A user can hold both. |
| *(absent / null)* | — | No elevated admin privileges beyond any delegated scope grants they may hold. |

### Delegated Scope Access

Super admins and tenancy admins with `core` access can delegate scoped access to **any user** (regardless of their existing roles). A user can hold **multiple delegated grants simultaneously** across different scopes and scope IDs.

**RO is always the baseline** — a grant always includes full read access within the scope. Write permissions are explicitly granted on top:

| Scope | Write Permissions (granted individually on top of RO) |
|-------|-------------------------------------------------------|
| `course` | `edit_course` — edit any aspect of the course |
| | `manage_batches` — create/edit batches within the course |
| | `manage_schedules` — create/edit class schedules for batches in the course |
| `school` | `edit_school` — edit any aspect of the school |
| | `manage_batches` — create/edit batches within the school |
| | `manage_schedules` — create/edit class schedules for batches in the school |
| `batch` | `edit_batch` — edit any aspect of the batch |
| | `manage_schedules` — create/edit class schedules for the batch |

> Example: a user could hold RO on School A, `edit_course`+`manage_schedules` on Course B, and full RW on Batch C — all simultaneously.

### Faculty Capabilities
- View subjects they are assigned to
- View their class schedule
- Take attendance for their classes
- Log which chapters and units were covered in a class session (when `chapterLoggingEnabled` is on for the batch)

> Faculty are assigned to batches and subjects by admins — they cannot self-assign.

### Student Constraints
- Students must always belong to a **student group within a school** before they can be enrolled in a batch
- A student cannot exist in a batch without being a member of a school's student group

## Auth Architecture
Authentication is delegated entirely to **AWS Cognito**. There are no custom auth endpoints on the backend.

- One **Cognito User Pool per tenant** (matches per-tenant infrastructure isolation)
- Clients (UI, mobile) talk directly to Cognito for sign-up, sign-in, token refresh, and password reset
- The backend is a **pure resource server**: validates Cognito-issued JWT access tokens using `aws-jwt-verify`
- Token-to-tenant isolation is implicit: each ECS task is configured with its tenant's `COGNITO_USER_POOL_ID`, so tokens from other pools automatically fail verification
- User profiles (roles, name) are provisioned in DynamoDB via `POST /auth/provision` after first Cognito login; the `id` field maps to the Cognito `sub`

## Core Features
| Feature | Priority | Status |
|---------|----------|--------|
| Auth — sign up / sign in / sign out (Cognito) | P0 | ✅ done |
| Auth — token refresh (automatic via Amplify SDK) | P0 | ✅ done |
| Per-tenant CDK infra (ECS + DynamoDB + Cognito) | P0 | ✅ done |
| User profile provisioning (`POST /auth/provision`) | P0 | in-progress |
| Course catalog (courses → subjects → chapters → units) | P0 | planned |
| Schools & student groups | P0 | planned |
| Batch management (create batches, enroll students) | P0 | planned |
| Class scheduling (schedule classes in a batch, assign faculty) | P0 | planned |
| Two-tier configuration (deployment modules + tenant feature flags) | P0 | planned |
| Test scheduling | P1 | planned |
| Attendance tracking (per class, per student) | P1 | planned |
| Faculty billing (auto-calculate from hours taught) | P1 | planned |
| Admin billing (manual billing records for admin work) | P2 | planned |
| Faculty scoping (tag faculty to school / course / subject) | P2 | planned |
| Reports & dashboards | P3 | planned |

## Configuration
MySchedlr uses a two-tier configuration system.

### Tier 1 — Deployment feature modules (ops-controlled)
Set via environment variables on the ECS task at deploy time. Code gates entire feature surfaces — routing, models, and UI — behind these flags.

| Env var | Values | Default | Controls |
|---------|--------|---------|----------|
| `FEATURE_CORE` | `true` \| `false` | `true` (always) | Catalog, schools, batches, scheduling |
| `FEATURE_BILLING` | `true` \| `false` | `false` | Faculty + admin billing module |

### Tier 2 — Tenant feature flags (super-admin-controlled)
Fine-grained flags set by the org's super admin. Stored as tenant defaults and can be partially overridden at the course or batch level. Resolution order: **deployment → tenant defaults → course override → batch override** (later takes precedence).

| Flag | Type | Tenant default | Overridable at |
|------|------|----------------|----------------|
| `chaptersEnabled` | bool | `true` | course, batch |
| `unitsEnabled` | bool | `true` | course, batch |
| `attendanceEnabled` | bool | `true` | batch |
| `chapterLoggingEnabled` | bool | `false` | batch |
| `testsEnabled` | bool | `true` | batch |

> `unitsEnabled` requires `chaptersEnabled`. If `chaptersEnabled` is turned off, units are implicitly off too regardless of the `unitsEnabled` flag.

Full storage schema lives in `specs/backend/tables.md` under the **Configuration** section.

## Designs
Screen mockups (HTML) generated by Claude Code live in `specs/designs/`.
See [`specs/designs/README.md`](designs/README.md) for download instructions, naming conventions, and the current design index.

## Data Models
> High-level entities — DynamoDB table schemas live in `specs/backend/tables.md`

### Identity
- **User** – id (= Cognito `sub`), email, name, roles[] (`admin` | `faculty` | `student`, one or more), adminType (`super_admin` | `tenancy_admin` | null), tenancyAccess[] (`core` | `billing`, only when `adminType = tenancy_admin`), tenantId, createdAt
- **AdminGrant** – userId, scope (`course` | `school` | `batch`), scopeId, permissions[] (`edit_course` | `manage_batches` | `manage_schedules` | `edit_school` | `edit_batch`), grantedBy, grantedAt — one record per scoped delegation; a user may hold many

### Course Catalog (templates — reusable across schools; full tree stored as blob per course)
- **Course** – id, name, description, version, subjects[] (embedded tree), createdAt
- **Subject** *(embedded in Course blob)* – id, name, description, order, chapters[]
- **Chapter** *(embedded in Subject)* – id, name, description, order, units[]
- **Unit** *(embedded in Chapter)* – id, name, contentUrl, order

### Organization Structure
- **School** – id, name, address, createdAt
- **StudentGroup** – id, schoolId, name (e.g. "Grade 10 - A")
- **StudentGroupMembership** – groupId, studentId, joinedAt
- **FacultyAssignment** *(optional tagging)* – facultyId, scope (`org` | `school` | `course` | `subject`), scopeId

### Delivery
- **Batch** – id, courseId, schoolId, name, startDate, endDate, status (`upcoming` | `active` | `completed`)
- **BatchStudent** – batchId, studentId, enrolledAt
- **Class** – id, batchId, subjectId, facultyId, scheduledAt, durationMinutes, status (`scheduled` | `completed` | `cancelled`), notes
- **Test** – id, batchId, subjectId, scheduledAt, totalMarks, status (`scheduled` | `completed`)

### Tracking
- **Attendance** – classId, studentId, status (`present` | `absent` | `late`)
- **BillingRecord** – id, userId, role, description, hours, ratePerHour, amount, periodStart, periodEnd, status (`draft` | `submitted` | `approved` | `paid`)

## Out of Scope (v1)
- Video conferencing / live class links
- Automated payment processing
- Parent portal / notifications
- Mobile push notifications
- Password reset UI (handled by Cognito hosted UI)
