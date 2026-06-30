# AegisFlow Server — Multi-Tenant ERP Backend

True separate-database-per-company architecture: every subscribed
company gets its own physical PostgreSQL database. There is no shared
table of business data anywhere — a bug or bad query in one company's
session can never touch another company's rows, because the
connection itself is pointed at a different database.

## How it fits together

```
Platform DB (aegisflow_platform)
 ├─ companies        (name, db_name, plan, status)
 ├─ platform_admins  (you)
 └─ directory        (email -> company_id)   <- routing table only

Company DB #1 (aegisflow_co_petronet_corp)
 ├─ roles, permissions
 ├─ users
 └─ audit_log
 (+ module tables added later: hr_employees, fleet_vehicles, etc.)

Company DB #2 (aegisflow_co_shell_uganda)
 ├─ roles, permissions
 ├─ users
 └─ audit_log
 ... fully separate database, same schema shape
```

## One-time setup

1. `cp .env.example .env` and fill in your Postgres admin credentials.
   The admin user needs `CREATE DATABASE` privilege — this is what lets
   the platform spin up a brand new physical database every time you
   add a company.
2. `npm install`
3. `npm run migrate:platform` — creates the platform database and its
   tables (companies, platform_admins, directory).
4. `npm run seed:admin` — creates your platform admin login from the
   `BOOTSTRAP_ADMIN_*` values in `.env`.
5. `npm run dev`

## Day-to-day flow

**Adding a new subscribing company (you, as platform admin):**

```
POST /companies
Authorization: Bearer <your platform admin token>
{
  "name": "PetroNet Corp",
  "plan": "annual",
  "itAdminEmail": "it@petronet.com",
  "itAdminName": "Jane IT",
  "itAdminPassword": "temporaryPassword123"
}
```

This single call: creates a brand new physical Postgres database for
PetroNet Corp, runs the schema migration into it, seeds all the
default roles (IT Admin, Finance Manager, Fleet Manager, HR Manager,
etc.) with sensible default permissions, creates PetroNet's first user
(their IT Admin), and registers that email in the platform directory
so they can log in.

**IT Admin then logs in and manages their own company:**

```
POST /auth/login            { email, password }       -> JWT
GET  /users                 (list users in MY company)
POST /users                 (add a new employee + assign a role)
GET  /roles                 (see all roles + permission matrices)
POST /roles                 (create a custom role, e.g. "Regional Auditor")
PATCH /roles/:id/permissions (adjust what a role can see/do per module)
```

Every one of these routes pulls `dbName` straight out of the caller's
JWT (set at login time from the directory lookup) — there's no
`companyId` parameter a client could tamper with to see another
company's data, because the connection pool itself is scoped per
database.

## Adding a new module (e.g. HR)

1. Add a migration file under `src/db/migrations/tenant/` with the new
   tables (e.g. `hr_employees`), and run it against existing company
   databases (a small migration runner script, not yet built — flag if
   you want this next).
2. Add routes under `src/routes/hr.routes.js`, gated with
   `requirePermission('hr', 'write')` etc.
3. The module already exists in the permission system
   (`src/config/modules.js`) and every company's roles already have a
   row for it, defaulted to no access except where seeded.

## Security notes for production

- Use a unique Postgres role/password per tenant database for stronger
  isolation, instead of one shared `PG_APP_USER` (current setup is
  functionally isolated by database, but a leaked admin credential
  could still reach every database — per-tenant credentials close that
  gap).
- Put the admin-only `/companies` routes behind an extra layer (IP
  allowlist, 2FA) since they can create/suspend any company.
- Rotate `JWT_SECRET` and keep `.env` out of version control.
