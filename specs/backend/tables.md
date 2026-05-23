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
| `id` | String (`usr_*`) | Maps to Cognito `sub` — used in JWT resolution via `id-index` |
| `email` | String | Unique within tenant |
| `name` | String | Display name |
| `roles` | String Set | One or more of: `admin`, `faculty`, `student` — stored as a DynamoDB SS (String Set) |
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
> TBD — will cover schools, student groups, group memberships, faculty assignments, and tenant config.

---

## Table: `myschedlr-{tenantId}-batches`
> TBD — will cover batch metadata, enrolled students, scheduled classes and tests.

---

## Table: `myschedlr-{tenantId}-attendance`
> TBD — will cover per-student, per-class attendance records.

---

## Table: `myschedlr-{tenantId}-billing`
> TBD — will cover billing records for faculty (hours taught) and admins.

---

## Configuration

### Tier 1 — Deployment feature modules
Controlled via ECS environment variables. No database storage. The backend reads these at startup and gates entire feature surfaces (routes, models, middleware).

| Env var | Default | Controls |
|---------|---------|----------|
| `FEATURE_CORE` | `true` | Catalog, schools, batches, scheduling (always on) |
| `FEATURE_BILLING` | `false` | Faculty + admin billing module |

### Tier 2 — Tenant feature flags
Super admin sets tenant-level defaults. Courses and batches can partially override.

#### Resolution order
```
deployment env  →  tenant defaults  →  course overrides  →  batch overrides
```
Later in the chain takes precedence. Overrides are **partial maps** — only keys present in the override are applied; missing keys fall back to the previous layer.

#### Feature flags
| Flag | Type | Tenant default | Notes |
|------|------|----------------|-------|
| `chaptersEnabled` | bool | `true` | Enables chapter-level grouping within subjects |
| `unitsEnabled` | bool | `true` | Enables units within chapters; ignored if `chaptersEnabled` is false |
| `attendanceEnabled` | bool | `true` | Enables per-class attendance tracking in a batch |
| `chapterLoggingEnabled` | bool | `false` | Faculty can log which chapters were covered per class |
| `testsEnabled` | bool | `true` | Enables test scheduling in a batch |

#### Storage — tenant defaults
Stored as a special item in the `myschedlr-{tenantId}-org` table.

| pk | sk | Purpose |
|----|----|---------|
| `TENANT` | `CONFIG` | Tenant-level feature flag defaults |

Item attributes:
| Attribute | Type | Notes |
|-----------|------|-------|
| `pk` | String | `TENANT` |
| `sk` | String | `CONFIG` |
| `chaptersEnabled` | Boolean | |
| `unitsEnabled` | Boolean | |
| `attendanceEnabled` | Boolean | |
| `chapterLoggingEnabled` | Boolean | |
| `testsEnabled` | Boolean | |
| `updatedAt` | String | |
| `updatedBy` | String (`usr_*`) | Super admin who last changed this |

#### Storage — course-level overrides
Stored as a `featureOverrides` map attribute on the Course item in the `catalog` table.

```json
// On COURSE#{id} / #METADATA item — partial map, only overridden keys present
"featureOverrides": {
  "chaptersEnabled": false,
  "unitsEnabled": false
}
```

Overridable flags at course level: `chaptersEnabled`, `unitsEnabled`.

#### Storage — batch-level overrides
Stored as a `featureOverrides` map attribute on the Batch item in the `batches` table.

```json
// On BATCH#{id} / #METADATA item — partial map, only overridden keys present
"featureOverrides": {
  "attendanceEnabled": true,
  "chapterLoggingEnabled": true,
  "testsEnabled": false
}
```

Overridable flags at batch level: `attendanceEnabled`, `chapterLoggingEnabled`, `testsEnabled`.

#### Config resolution — backend service helper
```js
// Returns the effective FeatureFlags for a given batch context
async function resolveFeatures(tenantId, courseId, batchId) {
  const defaults = { chaptersEnabled: true, unitsEnabled: true,
                     attendanceEnabled: true, chapterLoggingEnabled: false, testsEnabled: true };
  const tenantCfg  = await getTenantConfig(tenantId);        // TENANT / CONFIG item
  const courseItem = await getCourse(tenantId, courseId);    // featureOverrides map or {}
  const batchItem  = await getBatch(tenantId, batchId);      // featureOverrides map or {}

  const merged = {
    ...defaults,
    ...tenantCfg,
    ...(courseItem.featureOverrides ?? {}),
    ...(batchItem.featureOverrides  ?? {}),
  };

  // Implicit dependency: units require chapters
  if (!merged.chaptersEnabled) merged.unitsEnabled = false;

  return merged;
}
```

---

## Naming Summary
| Table (per tenant) | Purpose |
|--------------------|---------|
| `myschedlr-{tid}-users` | Identity — all roles |
| `myschedlr-{tid}-catalog` | Courses with embedded subject/chapter/unit tree (blob per course) |
| `myschedlr-{tid}-org` | TBD |
| `myschedlr-{tid}-batches` | TBD |
| `myschedlr-{tid}-attendance` | TBD |
| `myschedlr-{tid}-billing` | TBD |
