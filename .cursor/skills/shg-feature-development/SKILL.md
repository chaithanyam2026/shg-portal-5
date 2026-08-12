---
name: shg-feature-development
description: Implements SHG Portal features using vertical-slice batch development — domain, validation, model, services, API, UI, pages. Use when adding or extending Financial Year, Meeting, Member, Loan, Report, or Auth features, or when the user references batches, docs/prompt-fy, or docs/batch-* plans.
---

# SHG Feature Development

## Before starting

1. Read existing code in the target feature (`src/features/{feature}/`)
2. Check `docs/` for batch plans (`batch-FY`, `batch-meet`, `batch-loan`, `PLAN`, `prompt-fy`)
3. Confirm business rules with domain files — do not invent FY/meeting/loan rules

## Vertical slice order

Complete each layer before the next. Project must compile after every batch.

| Step | Deliverable | Location |
|------|-------------|----------|
| 1 | Types, enums, pure logic | `src/features/{feature}/domain/` |
| 2 | Zod schemas | `src/features/{feature}/validation.ts` |
| 3 | Mongoose model | `src/models/{Model}.ts` |
| 4 | Service functions | `src/features/{feature}/services/*.ts` |
| 5 | API routes | `src/app/api/{resource}/` |
| 6 | UI components | `src/features/{feature}/ui/` |
| 7 | Dashboard pages | `src/app/(dashboard)/` |
| 8 | Navigation | `src/lib/navigation/dashboard-navigation.ts` |

## Batch sizing

Split large features into compilable batches (see `docs/batch-meet` pattern):

```
Batch N Part 1 — Domain & Model
Batch N Part 2 — Services
Batch N Part 3 — API
Batch N Part 4 — UI
Batch N Part 5 — Page
Batch N Part 6 — Integration
```

Prefer one concern per PR-sized batch (e.g. "Attendance Register Service" not "all of Reports").

## Service checklist

- [ ] `connectMongo()` called in async entry points
- [ ] Input parsed with Zod schema from `validation.ts`
- [ ] Business rules validated before write (reuse domain helpers)
- [ ] Complex builders in `services/internal/`, not exported
- [ ] Return plain objects via mapper functions, not raw Mongoose docs
- [ ] Export new public functions from `services/index.ts`

## UI checklist

- [ ] Mobile-first MUI layout
- [ ] No business logic — delegate to API or server-side service calls
- [ ] Forms use react-hook-form + zodResolver
- [ ] Loading, error, and empty states handled
- [ ] Success feedback (Snackbar) and sensible navigation after save/close

## SHG domain quick reference

See [domain-reference.md](domain-reference.md) for status enums, key entities, and cross-feature rules.

## When stuck

- Mirror the nearest completed feature (Financial Year is the reference implementation)
- Financial Year statuses: `DRAFT → IN_PROGRESS → VALIDATED → APPROVED → CLOSED`
- Only one active financial year; closed years are read-only
- Meetings belong to a financial year; closing a meeting redirects to list
