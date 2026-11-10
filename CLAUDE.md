# Project constraints (Business Flow)
- Database: PostgreSQL only (Drizzle ORM, raw parameterised `sql` templates). No second database. Only env var: DATABASE_URL.
- All tenant tables carry `workspace_id` and RLS; tenant code MUST run through `withTenant()` (src/db/tenant.ts). `withSystem()` is for identity/worker only.
- Money = PostgreSQL NUMERIC + decimal.js. Never JS floats. Posted journals, stock movements, audit logs are append-only (DB triggers + revoked privileges).
- Every route is declared in src/server/routes/*.ts with a permission; handlers validate input with Zod. Errors are RFC 9457.
- Do not claim features that are not implemented (see BLOCKERS.md). No fake data, no dummy transactions.
