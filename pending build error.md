
Batch 5 — Validation

Review

validate.ts

validate-create.ts

validate-close.ts

validate-opening-balance-source.ts

Replace DTO dependencies with dedicated validation input types where appropriate, so validation doesn't depend on UI models.

Batch 6 — API Routes

Review every Financial Year API.

/api/financial-years/*

Ensure all routes return DTOs only.

Never return Mongo documents directly.

Batch 7 — UI

Review

tabs/

forms/

details/

summary/

Ensure UI consumes only

FinancialYearDetails

FinancialYearSummary

ValidationResult

No Mongo-specific types should leak into UI components.

Batch 8 — Cleanup

Batch 9 — Standardize the Pattern



==============
