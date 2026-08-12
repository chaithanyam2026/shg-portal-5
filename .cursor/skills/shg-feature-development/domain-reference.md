# SHG Portal Domain Reference

## Feature modules

| Module | Path | Key concepts |
|--------|------|--------------|
| Financial Year | `src/features/financial-year/` | FY lifecycle, opening/closing balances, member assignment, committee |
| Meetings | `src/features/meetings/` | Attendance, payments, bank txns, income/expense, close |
| Members | `src/features/members/` | Member profile, passbook, attendance fines |
| Loans | `src/features/loans/` | Disbursement, repayment, fines, passbook |
| Reports | `src/features/reports/` | Registers, ledgers, print layouts |
| Auth | `src/features/auth/` | Roles: ADMIN, TREASURER, MEMBER; route permissions |

## Financial Year rules

- Name unique; start date before end date; no overlapping active periods
- States: `DRAFT`, `IN_PROGRESS`, `VALIDATED`, `APPROVED`, `CLOSED`
- Tabs: General, Members, Committee, Opening Accounts, Summary
- Create wizard can carry forward closing balances from prior closed FY
- Closing requires reconciliation; generates opening balances for next FY

## Meeting rules

- Belongs to active financial year
- Batches: CRUD → Attendance → Payments → Bank → Income → Expense → Summary → Close
- Close meeting redirects to meetings list

## Member balances (opening/closing)

Typical fields per member: savings, loan outstanding, fine outstanding, share capital, interest receivable.

## Auth & routes

- Route permissions in `src/features/auth/permissions.ts`
- Reports and settings restricted by role
- Use `getAllowedRoles()` for path-based access checks

## Docs index

| File | Contents |
|------|----------|
| `docs/prompt-fy` | Architecture principles, FY business rules, stack |
| `docs/batch-FY` | Financial year batch plan |
| `docs/batch-meet` | Meeting batch plan |
| `docs/batch-loan` | Loan batch plan |
| `docs/PLAN` | Reports module roadmap |
