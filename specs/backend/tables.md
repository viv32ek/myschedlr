# MySchedlr — DynamoDB Table Spec

## Conventions
- All tables follow the per-tenant silo naming pattern: `myschedlr-{tenantId}-{table}`
- `pk` = partition key (string), `sk` = sort key (string) on every table
- Prefixes like `USER#`, `COURSE#` make item types queryable within a partition
- `#METADATA` sort key holds the canonical item attributes
- `createdAt` / `updatedAt` are ISO-8601 strings

### ID Scheme — Prefixed NanoID
All entity IDs are generated with `nanoid(12)` (URL-safe alphabet, ~71 bits of entropy) and prefixed by entity type. This makes IDs human-readable and self-describing in logs, URLs, and support tickets.

| Prefix | Entity | Example |
|--------|--------|---------|
| `usr_` | User (all roles) | `usr_V1StGXR8_Z5j` |
| `crs_` | Course | `crs_9mNpQrKj2wX` |
| `sub_` | Subject (embedded) | `sub_3xY7wZnKpLm` |
| `chp_` | Chapter (embedded) | `chp_pLm7wZnK3xY` |
| `unt_` | Unit (embedded) | `unt_nK3xYpLm7wZ` |
| `sch_` | School | `sch_Qr9mNpKj2wX` |
| `grp_` | StudentGroup | `grp_7wZnK3xYpLm` |
| `bat_` | Batch | `bat_Kj2wX9mNpQr` |
| `cls_` | Class | `cls_ZnK3xYpLm7w` |
| `tst_` | Test | `tst_YpLm7wZnK3x` |
| `bil_` | BillingRecord | `bil_m7wZnK3xYpL` |

> Generate with: `const { nanoid } = require('nanoid'); const id = prefix + nanoid(12);`

---

## Table: `myschedlr-{tenantId}-users`
> Identity store for all roles. Existing table — extended with `role` values `faculty` and `student`.

### Key Design
| pk | sk | Purpose |
|----|----|---------|
| `USER#{email}` | `#METADATA` | Primary user record (look up by email) |

### GSIs
| Index | pk | sk | Purpose |
|-------|----|----|---------|
| `id-index` | `id` | — | Look up user by ID (used in JWT `sub` resolution) |

### Item Attributes
| Attribute | Type | Notes |
|-----------|------|-------|
| `pk` | String | `USER#{email}` |
| `sk` | String | `#METADATA` |
| `id` | String (`usr_*`) | Stable user ID, referenced across all tables |
| `email` | String | Unique within tenant |
| `name` | String | Display name |
| `role` | String | `admin` \| `faculty` \| `student` |
| `passwordHash` | String | bcrypt hash — never returned in API responses |
| `createdAt` | String (ISO-8601) | |
| `tenantId` | String | Denormalized for safety |

### Access Patterns
| Pattern | Operation |
|---------|-----------|
| Login by email | `GetItem` pk=`USER#{email}`, sk=`#METADATA` |
| Resolve JWT sub to user | `Query` `id-index`, pk=`{id}` |
| List all users (admin) | `Scan` (low cardinality expected) |

---

## Table: `myschedlr-{tenantId}-catalog`
> Course catalog. Each course item embeds its full subject/chapter/unit tree as a JSON blob.
> One item type — no individual subject, chapter, or unit rows.

### Key Design
| pk | sk | Item type |
|----|----|-----------|
| `COURSE#{courseId}` | `#METADATA` | Course record with embedded tree |

### GSIs
None required.

### Item Attributes — Course
| Attribute | Type | Notes |
|-----------|------|-------|
| `pk` | String | `COURSE#{id}` |
| `sk` | String | `#METADATA` |
| `id` | String (`crs_*`) | | Incremented on every write — used for optimistic locking |
| `subjects` | List\<Subject\> | Full tree embedded (see schema below) |
| `createdAt` | String | |
| `updatedAt` | String | |

#### Embedded `Subject` schema
```json
{
  "id": "sub_3xY7wZnKpLm",
  "name": "string",
  "description": "string",
  "order": 1,
  "chapters": [
    {
      "id": "chp_pLm7wZnK3xY",
      "name": "string",
      "description": "string",
      "order": 1,
      "units": [
        {
          "id": "unt_nK3xYpLm7wZ",
          "name": "string",
          "contentUrl": "string (optional)",
          "order": 1
        }
      ]
    }
  ]
}
```

> **Note on item size**: DynamoDB enforces a 400KB per-item limit. For typical catalogs (20 subjects x 10 chapters x 10 units with name + URL per unit) this stays well under 50KB. If units need to store large inline text, keep `contentUrl` in the blob and store full content in S3.

### Write pattern — optimistic locking
All mutations (add/edit/delete subject, chapter, or unit) follow this pattern:
1. `GetItem` to fetch the current course item and its `version`
2. Modify the `subjects` array in application memory
3. `PutItem` with `ConditionExpression: "version = :v"` — increments `version` by 1
4. On `ConditionalCheckFailedException`, retry from step 1

### Access Patterns
| Pattern | Operation |
|---------|-----------|
| List all courses (names only) | `Scan` with `ProjectionExpression: id, name, description` |
| Get full course tree | `GetItem` pk=`COURSE#{id}`, sk=`#METADATA` |
| Add / edit / delete subject, chapter, or unit | Fetch blob → mutate in memory → `PutItem` with version check |

---

## Table: `myschedlr-{tenantId}-org`
> Schools, student groups, group memberships, and faculty assignments.

### Key Design
| pk | sk | Item type |
|----|----|-----------|
| `SCHOOL#{schoolId}` | `#METADATA` | School record |
| `SCHOOL#{schoolId}` | `GROUP#{groupId}` | Student group under a school |
| `GROUP#{groupId}` | `#METADATA` | Student group record |
| `GROUP#{groupId}` | `STUDENT#{studentId}` | Student membership in a group |
| `FACULTY#{facultyId}` | `ORG` | Faculty scoped to entire org |
| `FACULTY#{facultyId}` | `SCHOOL#{schoolId}` | Faculty scoped to a school |
| `FACULTY#{facultyId}` | `COURSE#{courseId}` | Faculty scoped to a course |
| `FACULTY#{facultyId}` | `SUBJECT#{subjectId}` | Faculty scoped to a subject |

### GSIs
| Index | pk | sk | Purpose |
|-------|----|----|---------|
| `entity-id-index` | `entityId` | `entityType` | Look up school or group by ID |
| `student-groups-index` | `studentId` | `sk` | Find all groups a student belongs to |

### Item Attributes — School
| Attribute | Type | Notes |
|-----------|------|-------|
| `pk` | String | `SCHOOL#{id}` |
| `sk` | String | `#METADATA` |
| `entityId` | String (`sch_*`) | `schoolId`, used by GSI |
| `entityType` | String | `school` |
| `name` | String | |
| `address` | String | |
| `createdAt` | String | |
| `updatedAt` | String | |

### Item Attributes — StudentGroup
| Attribute | Type | Notes |
|-----------|------|-------|
| `pk` | String | `SCHOOL#{schoolId}` (child row) or `GROUP#{id}` (own row) |
| `sk` | String | `GROUP#{id}` or `#METADATA` |
| `entityId` | String (`grp_*`) | `groupId` |
| `entityType` | String | `group` |
| `schoolId` | String (`sch_*`) | |
| `name` | String | e.g. "Grade 10 - A" |
| `createdAt` | String | |

### Item Attributes — StudentGroupMembership
| Attribute | Type | Notes |
|-----------|------|-------|
| `pk` | String | `GROUP#{groupId}` |
| `sk` | String | `STUDENT#{studentId}` |
| `groupId` | String (`grp_*`) | |
| `studentId` | String (`usr_*`) | |
| `joinedAt` | String | |

### Item Attributes — FacultyAssignment
| Attribute | Type | Notes |
|-----------|------|-------|
| `pk` | String | `FACULTY#{facultyId}` |
| `sk` | String | `ORG` \| `SCHOOL#{id}` \| `COURSE#{id}` \| `SUBJECT#{id}` |
| `facultyId` | String (`usr_*`) | |
| `scope` | String | `org` \| `school` \| `course` \| `subject` |
| `scopeId` | String | ID of the scoped entity (`sch_*`, `crs_*`, or `sub_*`; null for org) |
| `assignedAt` | String | |

### Access Patterns
| Pattern | Operation |
|---------|-----------|
| List all schools | `Scan` |
| Get school by ID | `GetItem` pk=`SCHOOL#{id}`, sk=`#METADATA` |
| List groups in a school | `Query` pk=`SCHOOL#{id}`, sk begins_with `GROUP#` |
| Get group by ID | `GetItem` pk=`GROUP#{id}`, sk=`#METADATA` |
| List students in a group | `Query` pk=`GROUP#{id}`, sk begins_with `STUDENT#` |
| List groups a student is in | `Query` `student-groups-index`, pk=`{studentId}` |
| List all assignments for a faculty | `Query` pk=`FACULTY#{id}` |
| Find faculty assigned to a course | `Scan` with filter (or add inverse GSI if needed) |

---

## Table: `myschedlr-{tenantId}-batches`
> Batch delivery: batch metadata, enrolled students, scheduled classes and tests.

### Key Design
| pk | sk | Item type |
|----|----|-----------|
| `BATCH#{batchId}` | `#METADATA` | Batch record |
| `BATCH#{batchId}` | `STUDENT#{studentId}` | Student enrolled in batch |
| `BATCH#{batchId}` | `CLASS#{classId}` | Class scheduled in batch |
| `BATCH#{batchId}` | `TEST#{testId}` | Test scheduled in batch |

### GSIs
| Index | pk | sk | Purpose |
|-------|----|----|---------|
| `school-batches-index` | `schoolId` | `startDate` | List all batches for a school, sorted by start date |
| `course-batches-index` | `courseId` | `startDate` | List all batches for a course |
| `faculty-classes-index` | `facultyId` | `scheduledAt` | List all classes assigned to a faculty, sorted by time |
| `student-batches-index` | `studentId` | `sk` | List all batches a student is enrolled in |

### Item Attributes — Batch
| Attribute | Type | Notes |
|-----------|------|-------|
| `pk` | String | `BATCH#{id}` |
| `sk` | String | `#METADATA` |
| `id` | String (`bat_*`) | |
| `courseId` | String (`crs_*`) | Used by GSI |
| `schoolId` | String (`sch_*`) | Used by GSI |
| `name` | String | e.g. "Physics 2025 — Batch A" |
| `startDate` | String (ISO date) | Used as GSI sort key |
| `endDate` | String (ISO date) | |
| `status` | String | `upcoming` \| `active` \| `completed` |
| `createdAt` | String | |
| `updatedAt` | String | |

### Item Attributes — BatchStudent
| Attribute | Type | Notes |
|-----------|------|-------|
| `pk` | String | `BATCH#{batchId}` |
| `sk` | String | `STUDENT#{studentId}` |
| `batchId` | String (`bat_*`) | |
| `studentId` | String (`usr_*`) | Used by `student-batches-index` |
| `enrolledAt` | String | |

### Item Attributes — Class
| Attribute | Type | Notes |
|-----------|------|-------|
| `pk` | String | `BATCH#{batchId}` |
| `sk` | String | `CLASS#{classId}` |
| `id` | String (`cls_*`) | `classId` |
| `batchId` | String (`bat_*`) | |
| `subjectId` | String (`sub_*`) | Catalog reference |
| `subjectName` | String | Denormalized from catalog blob at scheduling time — avoids re-fetching the course for display |
| `facultyId` | String (`usr_*`) | Used by `faculty-classes-index` |
| `scheduledAt` | String (ISO-8601) | Used by GSI sort key |
| `durationMinutes` | Number | |
| `status` | String | `scheduled` \| `completed` \| `cancelled` |
| `notes` | String | Optional |
| `createdAt` | String | |

### Item Attributes — Test
| Attribute | Type | Notes |
|-----------|------|-------|
| `pk` | String | `BATCH#{batchId}` |
| `sk` | String | `TEST#{testId}` |
| `id` | String (`tst_*`) | `testId` |
| `batchId` | String (`bat_*`) | |
| `subjectId` | String (`sub_*`) | |
| `scheduledAt` | String (ISO-8601) | |
| `totalMarks` | Number | |
| `status` | String | `scheduled` \| `completed` |
| `createdAt` | String | |

### Access Patterns
| Pattern | Operation |
|---------|-----------|
| Get batch details | `GetItem` pk=`BATCH#{id}`, sk=`#METADATA` |
| List batches for a school | `Query` `school-batches-index`, pk=`{schoolId}` |
| List batches for a course | `Query` `course-batches-index`, pk=`{courseId}` |
| List students in a batch | `Query` pk=`BATCH#{id}`, sk begins_with `STUDENT#` |
| List batches a student is in | `Query` `student-batches-index`, pk=`{studentId}` |
| List classes in a batch | `Query` pk=`BATCH#{id}`, sk begins_with `CLASS#` |
| List tests in a batch | `Query` pk=`BATCH#{id}`, sk begins_with `TEST#` |
| List classes for a faculty | `Query` `faculty-classes-index`, pk=`{facultyId}` |

---

## Table: `myschedlr-{tenantId}-attendance`
> Per-student, per-class attendance records.

### Key Design
| pk | sk | Item type |
|----|----|-----------|
| `CLASS#{classId}` | `STUDENT#{studentId}` | Attendance record |

### GSIs
| Index | pk | sk | Purpose |
|-------|----|----|---------|
| `student-attendance-index` | `studentId` | `classId` | All attendance records for a student |

### Item Attributes
| Attribute | Type | Notes |
|-----------|------|-------|
| `pk` | String | `CLASS#{classId}` |
| `sk` | String | `STUDENT#{studentId}` |
| `classId` | String (`cls_*`) | Used by GSI |
| `studentId` | String (`usr_*`) | Used by GSI |
| `batchId` | String (`bat_*`) | Denormalized for filtering |
| `status` | String | `present` \| `absent` \| `late` |
| `markedAt` | String (ISO-8601) | When attendance was recorded |
| `markedBy` | String (`usr_*`) | Faculty userId who recorded it |

### Access Patterns
| Pattern | Operation |
|---------|-----------|
| Mark / update attendance for a class | `PutItem` / `UpdateItem` pk=`CLASS#{classId}`, sk=`STUDENT#{studentId}` |
| Get attendance for a specific class | `Query` pk=`CLASS#{classId}` |
| Get all attendance for a student | `Query` `student-attendance-index`, pk=`{studentId}` |
| Get attendance for a student in a batch | `Query` `student-attendance-index`, pk=`{studentId}`, filter `batchId = {batchId}` |

---

## Table: `myschedlr-{tenantId}-billing`
> Billing records for faculty (hours taught) and admins (manual entries).

### Key Design
| pk | sk | Item type |
|----|----|-----------|
| `USER#{userId}` | `BILLING#{billingId}` | Billing record for a user |

### GSIs
| Index | pk | sk | Purpose |
|-------|----|----|---------|
| `period-index` | `userId` | `periodStart` | List records by billing period |
| `status-index` | `status` | `periodStart` | Admin view: all pending/submitted records |

### Item Attributes
| Attribute | Type | Notes |
|-----------|------|-------|
| `pk` | String | `USER#{userId}` |
| `sk` | String | `BILLING#{billingId}` |
| `id` | String (`bil_*`) | `billingId` |
| `userId` | String (`usr_*`) | |
| `role` | String | `faculty` \| `admin` |
| `description` | String | What the billing is for |
| `hours` | Number | Hours worked/taught |
| `ratePerHour` | Number | Rate in base currency units |
| `amount` | Number | `hours × ratePerHour` (stored for immutability) |
| `periodStart` | String (ISO date) | Used as GSI sort key |
| `periodEnd` | String (ISO date) | |
| `classIds` | List\<String\> | Optional: classes this billing covers (faculty) |
| `status` | String | `draft` \| `submitted` \| `approved` \| `paid` |
| `createdAt` | String | |
| `updatedAt` | String | |

### Access Patterns
| Pattern | Operation |
|---------|-----------|
| List all billing records for a user | `Query` pk=`USER#{userId}` |
| List records for a user in a period | `Query` pk=`USER#{userId}`, sk between `BILLING#` range, filter by `periodStart` |
| List all submitted records (admin) | `Query` `status-index`, pk=`submitted` |
| Update billing status | `UpdateItem` pk, sk — update `status`, `updatedAt` |

---

## Naming Summary
| Table (per tenant) | Purpose |
|--------------------|---------|
| `myschedlr-{tid}-users` | Identity — all roles |
| `myschedlr-{tid}-catalog` | Courses with embedded subject/chapter/unit tree (blob per course) |
| `myschedlr-{tid}-org` | Schools, student groups, faculty assignments |
| `myschedlr-{tid}-batches` | Batches, enrolled students, classes, tests |
| `myschedlr-{tid}-attendance` | Class attendance per student |
| `myschedlr-{tid}-billing` | Billing records (faculty + admin) |
