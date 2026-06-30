-- Platform (master) database schema.
-- This database is shared across all companies and only ever stores
-- metadata needed to route a login to the right tenant database —
-- never any company's operational data.

CREATE EXTENSION IF NOT EXISTS pgcrypto;

CREATE TABLE IF NOT EXISTS companies (
  id           UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name         VARCHAR(255) NOT NULL,
  slug         VARCHAR(100) NOT NULL UNIQUE,         -- e.g. "petronet-corp"
  db_name      VARCHAR(100) NOT NULL UNIQUE,         -- e.g. "aegisflow_co_petronet_corp"
  plan         VARCHAR(50)  NOT NULL DEFAULT 'trial', -- trial / monthly / annual
  status       VARCHAR(20)  NOT NULL DEFAULT 'active', -- active / suspended / cancelled
  subscription_renews_at TIMESTAMPTZ,
  created_at   TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS platform_admins (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email         VARCHAR(255) NOT NULL UNIQUE,
  password_hash VARCHAR(255) NOT NULL,
  name          VARCHAR(255) NOT NULL,
  created_at    TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Directory: the ONLY cross-tenant table that knows "this email belongs
-- to this company". Used purely to route login requests to the right
-- tenant database. No operational/business data lives here.
CREATE TABLE IF NOT EXISTS directory (
  email      VARCHAR(255) PRIMARY KEY,
  company_id UUID NOT NULL REFERENCES companies(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_directory_company ON directory(company_id);
