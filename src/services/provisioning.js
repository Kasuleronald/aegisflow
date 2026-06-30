import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import pg from 'pg';
import 'dotenv/config';
import { platformQuery, isUsingFallback } from '../db/platformDb.js';
import { getTenantPool } from '../db/tenantDb.js';
import dev from '../db/devFallback.js';
import { DEFAULT_ROLES } from '../config/defaultRoles.js';
import { MODULE_KEYS } from '../config/modules.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const TENANT_SCHEMA_SQL = fs.readFileSync(
  path.join(__dirname, '../db/migrations/tenant/001_init.sql'),
  'utf-8'
);

const { Client } = pg;

function slugify(name) {
  return name
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '_')
    .replace(/^_+|_+$/g, '');
}

/**
 * Physically creates a new Postgres database for a company. Requires an
 * admin connection with CREATE DATABASE privilege. This is the step that
 * gives "true separate database per company" isolation: the resulting
 * db_name is a completely distinct physical database, not just a schema.
 */
async function createPhysicalDatabase(dbName) {
  const adminClient = new Client({
    host: process.env.PG_ADMIN_HOST,
    port: process.env.PG_ADMIN_PORT,
    user: process.env.PG_ADMIN_USER,
    password: process.env.PG_ADMIN_PASSWORD,
    database: process.env.PG_ADMIN_DB,
  });

  try {
    await adminClient.connect();
    // Identifiers can't be parameterized — dbName is generated server-side
    // via slugify() above, never taken raw from user input, so this is safe.
    await adminClient.query(`CREATE DATABASE "${dbName}"`);
  } finally {
    try { await adminClient.end(); } catch (e) {}
  }
}

async function runTenantMigration(dbName) {
  const pool = getTenantPool(dbName);
  // If running in dev fallback, tenant schema is synthetic — skip SQL run.
  if (isUsingFallback()) return;
  await pool.query(TENANT_SCHEMA_SQL);
}

async function seedDefaultRoles(dbName) {
  const pool = getTenantPool(dbName);

  for (const role of DEFAULT_ROLES) {
    const { rows } = await pool.query(
      `INSERT INTO roles (name, description, is_system) VALUES ($1, $2, $3) RETURNING id`,
      [role.name, role.description, role.isSystem]
    );
    const roleId = rows[0].id;

    for (const moduleKey of MODULE_KEYS) {
      const perm = role.permissions[moduleKey] || { read: false, write: false, approve: false };
      await pool.query(
        `INSERT INTO permissions (role_id, module, can_read, can_write, can_approve)
         VALUES ($1, $2, $3, $4, $5)`,
        [roleId, moduleKey, perm.read, perm.write, perm.approve]
      );
    }
  }
}

/**
 * Full provisioning flow for a brand new company:
 *  1. Generate a unique db name from the company name
 *  2. Register it in the platform "companies" table
 *  3. Physically create the new database
 *  4. Run the tenant schema migration against it
 *  5. Seed default roles + permissions
 * Returns the created company record.
 */
export async function provisionCompany({ name, plan = 'trial' }) {
  const baseSlug = slugify(name);
  const slug = `${baseSlug}_${Date.now().toString(36)}`; // ensure uniqueness
  const dbName = `aegisflow_co_${slug}`;

  const { rows } = await platformQuery(
    `INSERT INTO companies (name, slug, db_name, plan, status)
     VALUES ($1, $2, $3, $4, 'active') RETURNING *`,
    [name, slug, dbName, plan]
  );
  const company = rows[0];

  try {
    if (isUsingFallback()) {
      // Dev fallback: no physical DB create or SQL migration; just ensure
      // tenant dataset exists and seed default roles.
      dev.getTenantPool(dbName); // create in-memory tenant
      await seedDefaultRoles(dbName);
    } else {
      await createPhysicalDatabase(dbName);
      await runTenantMigration(dbName);
      await seedDefaultRoles(dbName);
    }
  } catch (err) {
    // Roll back the platform-side record if provisioning failed partway,
    // so we don't end up with a "ghost" company pointing at a broken db.
    await platformQuery(`DELETE FROM companies WHERE id = $1`, [company.id]);
    throw err;
  }

  return company;
}
