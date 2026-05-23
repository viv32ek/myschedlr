# MySchedlr — DynamoDB Table Spec

## Conventions
- All tables follow the per-tenant silo naming pattern: `myschedlr-{tenantId}-{table}`
- `pk` = partition key (string), `sk` = sort key (string) on every table
- Prefixes like `USER#`, `COURSE#` make item types queryable within a partition
- `#METADATA` sort key holds the canonical item attributes
- All IDs are UUIDs unless noted
- `createdAt` / `updatedAt` are ISO-8601 strings

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
| `id-index` | `id` | — | Look up user by UUID (used in JWT `sub` resolution) |

### Item Attributes
| Attribute | Type | Notes |
|-----------|------|-------|
| `pk` | String | `USER#{email}` |
| `sk` | String | `#METADATA` |
| `id` | String (UUID) | Stable user ID, referenced across all tables |
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
| `id` | String (UUID) | |
| `name` | String | |
| `description` | String | |
| `version` | Number | Incremented on every write — used for optimistic locking |
| `subjects` | List\<Subject\> | Full tree embedded (see schema below) |
| `createdAt` | String | |
| `updatedAt` | String | |

#### Embedded `Subject` schema
```json
{
  "id": "<uuid>",
  "name": "string",
  "description": "string",
  "order": 1,
  "chapters": [
    {
      "id": "<uuid>",
      "name": "string",
      "description": "string",
      "order": 1,
      "units": [
        {
          "id": "<uuid>",
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
| `entity-id-index` | `entityId` | `entityType` | Look up school or group by UUID |
| `student-groups-index` | `studentId` | `sk` | Find all groups a student belongs to |

### Item Attributes — School
| Attribute | Type | Notes |
|-----------|------|-------|
| `pk` | String | `SCHOOL#{id}` |
| `sk` | String | `#METADATA` |
| `entityId` | String (UUID) | `schoolId`, used by GSI |
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
| `entityId` | String (UUID) | `groupId` |
| `entityType` | String | `group` |
| `schoolId` | String (UUID) | |
| `name` | String | e.g. "Grade 10 - A" |
| `createdAt` | String | |

### Item Attributes — StudentGroupMembership
| Attribute | Type | Notes |
|-----------|------|-------|
| `pk` | String | `GROUP#{groupId}` |
| `sk` | String | `STUDENT#{studentId}` |
| `groupId` | String (UUID) | |
| `studentId` | String (UUID) | |
| `joinedAt` | String | |

### Item Attributes — FacultyAssignment
| Attribute | Type | Notes |
|-----------|------|-------|
| `pk` | String | `FACULTY#{facultyId}` |
| `sk` | String | `ORG` \| `SCHOOL#{id}` \| `COURSE#{id}` \| `SUBJECT#{id}` |
| `facultyId` | String (UUID) | |
| `scope` | String | `org` \| `school` \| `course` \| `subject` |
| `scopeId` | String (UUID) | ID of the scoped entity (null for org) |
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
| `id` | String (UUID) | |
| `courseId` | String (UUID) | Used by GSI |
| `schoolId` | String (UUID) | Used by GSI |
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
| `batchId` | String (UUID) | |
| `studentId` | String (UUID) | Used by `student-batches-index` |
| `enrolledAt` | String | |

### Item Attributes — Class
| Attribute | Type | Notes |
|-----------|------|-------|
| `pk` | String | `BATCH#{batchId}` |
| `sk` | String | `CLASS#{classId}` |
| `id` | String (UUID) | `classId` |
| `batchId` | String (UUID) | |
| `subjectId` | String (UUID) | Catalog reference |
| `subjectName` | String | Denormalized from catalog blob at scheduling time — avoids re-fetching the course for display |
| `facultyId` | String (UUID) | Used by `faculty-classes-index` |
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
| `id` | String (UUID) | `testId` |
| `batchId` | String (UUID) | |
| `subjectId` | String (UUID) | |
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
| `classId` | String (UUID) | Used by GSI |
| `studentId` | String (UUID) | Used by GSI |
| `batchId` | String (UUID) | Denormalized for filtering |
| `status` | String | `present` \| `absent` \| `late` |
| `markedAt` | String (ISO-8601) | When attendance was recorded |
| `markedBy` | String (UUID) | Faculty userId who recorded it |

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
| `id` | String (UUID) | `billingId` |
| `userId` | String (UUID) | |
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
