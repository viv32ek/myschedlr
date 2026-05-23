# MySchedlr — Master Product Spec

## Overview
MySchedlr is a multi-tenant SaaS platform for education organizations. It lets admins manage schools, courses, and batches; faculty to schedule and deliver classes; and students to track their enrolled batches, classes, and test results. Each tenant (organization) is fully siloed — zero cross-tenant data access.

## Goals
- [ ] Enable education orgs to manage their entire academic calendar from a single platform
- [ ] Allow faculties to track hours taught and generate billing records automatically
- [ ] Give students a clear view of their schedule, attendance, and upcoming tests
- [ ] Support multi-school orgs where the same course catalog can be reused across schools

## Users & Roles
A user can hold **multiple roles simultaneously** (e.g. a person who is both an admin and a faculty member).

| Role | Description |
|------|-------------|
| `admin` | Org-level admin — manages schools, courses, batches, faculty, billing |
| `faculty` | Teacher — can be scoped to the whole org or tagged to specific schools/courses/subjects |
| `student` | Enrolled learner — views their batch schedule, attendance, and tests |

## Core Features
| Feature | Priority | Status |
|---------|----------|--------|
| Auth (sign up / login / refresh) | P0 | in-progress |
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

## Data Models
> High-level entities — DynamoDB table schemas live in `specs/backend/tables.md`

### Identity
- **User** – id, email, name, roles[] (`admin` | `faculty` | `student`, one or more), createdAt

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
