import pg from 'pg';
import 'dotenv/config';
import dev from './devFallback.js';
import { isUsingFallback } from './platformDb.js';

const { Pool } = pg;

// Cache of live connection pools, keyed by db_name, so we don't
// re-open a new pool on every request. Pools are created lazily.
const tenantPools = new Map();

/**
 * Returns (and caches) a connection pool for a specific company's
 * physical database. This is the core of the "separate database per
 * company" isolation model: a request for Company A's data can NEVER
 * accidentally touch Company B's pool because they are entirely
 * separate pg.Pool instances pointed at separate databases.
 */
export function getTenantPool(dbName) {
  if (!dbName) {
    throw new Error('getTenantPool called without a dbName');
  }

  // If platform DB determined we are running in fallback mode, delegate
  // to the in-memory tenant adapter.
  if (isUsingFallback()) {
    return dev.getTenantPool(dbName);
  }

  if (tenantPools.has(dbName)) {
    return tenantPools.get(dbName);
  }

  const pool = new Pool({
    host: process.env.PG_APP_HOST,
    port: process.env.PG_APP_PORT,
    user: process.env.PG_APP_USER,
    password: process.env.PG_APP_PASSWORD,
    database: dbName,
    max: 5,
  });

  tenantPools.set(dbName, pool);
  return pool;
}

export async function tenantQuery(dbName, text, params) {
  const pool = getTenantPool(dbName);
  return pool.query(text, params);
}

// Optional: close idle pools for companies that haven't been used in a
// while, if running with many tenants. Not wired up by default.
export async function closeTenantPool(dbName) {
  const pool = tenantPools.get(dbName);
  if (pool) {
    await pool.end();
    tenantPools.delete(dbName);
  }
}
