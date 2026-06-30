import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import pg from 'pg';
import 'dotenv/config';
import dev from './devFallback.js';
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const { Client } = pg;

async function main() {
  // 1. Create the platform database itself (if it doesn't exist yet)
  const adminClient = new Client({
    host: process.env.PG_ADMIN_HOST,
    port: process.env.PG_ADMIN_PORT,
    user: process.env.PG_ADMIN_USER,
    password: process.env.PG_ADMIN_PASSWORD,
    database: process.env.PG_ADMIN_DB,
  });
  try {
    await adminClient.connect();
  } catch (err) {
    console.warn('Postgres admin unreachable, skipping platform DB create and switching to dev fallback.');
    dev.initDevData();
    process.exit(0);
  }

  const dbName = process.env.PLATFORM_DB_NAME;
  const { rows } = await adminClient.query(`SELECT 1 FROM pg_database WHERE datname = $1`, [dbName]);
  if (!rows.length) {
    await adminClient.query(`CREATE DATABASE "${dbName}"`);
    console.log(`Created platform database "${dbName}"`);
  } else {
    console.log(`Platform database "${dbName}" already exists, skipping create.`);
  }
  await adminClient.end();

  // 2. Run the schema migration against it
  const platformClient = new Client({
    host: process.env.PG_APP_HOST,
    port: process.env.PG_APP_PORT,
    user: process.env.PG_APP_USER,
    password: process.env.PG_APP_PASSWORD,
    database: dbName,
  });
  await platformClient.connect();
  const sql = fs.readFileSync(
    path.join(__dirname, 'migrations/platform/001_init.sql'),
    'utf-8'
  );
  await platformClient.query(sql);
  await platformClient.end();

  console.log('Platform schema migration complete.');
}

main().catch((err) => {
  console.error('Migration failed:', err);
  process.exit(1);
});
