import bcrypt from 'bcryptjs';
import { DEFAULT_ROLES } from '../config/defaultRoles.js';
import { MODULE_KEYS } from '../config/modules.js';

// Very small in-memory DB used only for local dev when Postgres isn't
// available. It implements a tiny subset of queries used by the app so
// you can run the backend/UI without installing Postgres.

let nextId = 1;
const platform = {
  platform_admins: [],
  companies: [],
  directory: [],
};

const tenants = new Map();

function id() { return nextId++; }

export function initDevData() {
  // Ensure we have the bootstrap platform admin
  if (!platform.platform_admins.length) {
    const password_hash = bcrypt.hashSync('changeme123', 8);
    platform.platform_admins.push({ id: id(), name: 'Platform Admin', email: 'you@aegisflow.com', password_hash });
  }

  // Ensure KT-Petroleum and its IT admin exist in dev fallback for local testing.
  if (!platform.companies.some((c) => c.name === 'KT-Petroleum')) {
    const dbName = 'aegisflow_co_kt_petroleum_dev';
    const company = {
      id: id(),
      name: 'KT-Petroleum',
      slug: 'kt-petroleum',
      plan: 'trial',
      status: 'active',
      subscription_renews_at: null,
      created_at: new Date().toISOString(),
      db_name: dbName,
    };
    platform.companies.push(company);
    platform.directory.push({ id: id(), email: 'kasule@kt-petroleum.com', company_id: company.id });

    const tenant = makeTenant(dbName);
    const roleMap = new Map();
    for (const role of DEFAULT_ROLES) {
      const roleId = id();
      tenant.roles.push({ id: roleId, name: role.name, is_system: true, description: role.description });
      roleMap.set(role.name, roleId);
      for (const moduleKey of MODULE_KEYS) {
        const perm = role.permissions[moduleKey] || { read: false, write: false, approve: false };
        tenant.permissions.push({ id: id(), role_id: roleId, module: moduleKey, can_read: perm.read, can_write: perm.write, can_approve: perm.approve });
      }
    }

    const adminHash = bcrypt.hashSync('adminpass', 10);
    tenant.users.push({ id: id(), email: 'kasule@kt-petroleum.com', password_hash: adminHash, name: 'Kasule', role_id: roleMap.get('IT Admin'), status: 'active', created_at: new Date().toISOString() });
    const users = [
      { email: 'md@democo.local', name: 'Managing Director', role: 'Managing Director', pwd: 'mdpass' },
      { email: 'finance@democo.local', name: 'Finance Manager', role: 'Finance Manager', pwd: 'finpass' },
      { email: 'hr@democo.local', name: 'HR Manager', role: 'HR Manager', pwd: 'hrpass' },
      { email: 'fleet@democo.local', name: 'Fleet Manager', role: 'Fleet Manager', pwd: 'fleetpass' },
      { email: 'maint@democo.local', name: 'Maintenance Manager', role: 'Maintenance Manager', pwd: 'maintpass' },
      { email: 'procure@democo.local', name: 'Procurement Manager', role: 'Procurement Manager', pwd: 'procurepass' },
      { email: 'station@democo.local', name: 'Station Manager', role: 'Station Manager', pwd: 'stationpass' },
      { email: 'compliance@democo.local', name: 'Compliance Manager', role: 'Compliance & Fraud Manager', pwd: 'complpass' },
      { email: 'user@democo.local', name: 'Regular User', role: 'User', pwd: 'userpass' },
    ];

    for (const u of users) {
      const password_hash = bcrypt.hashSync(u.pwd, 10);
      tenant.users.push({ id: id(), email: u.email, password_hash, name: u.name, role_id: roleMap.get(u.role), status: 'active', created_at: new Date().toISOString() });
      platform.directory.push({ id: id(), email: u.email, company_id: company.id });
    }
  }
}

function makeTenant(dbName) {
  if (tenants.has(dbName)) return tenants.get(dbName);
  const t = {
    roles: [ { id: 1, name: 'IT Admin', is_system: true }, { id: 2, name: 'User', is_system: false } ],
    users: [],
    permissions: [],
    hr_employees: [],
    finance_invoices: [],
    procurement_orders: [],
    compliance_cases: [],
  };
  tenants.set(dbName, t);
  return t;
}

export async function platformQuery(text, params=[]) {
  const q = (text||'').trim().toLowerCase();

  // platform admin lookup
  if (q.startsWith('select * from platform_admins where email')) {
    const email = params[0];
    const rows = platform.platform_admins.filter(a => a.email === email);
    return { rows };
  }

  // directory lookup used by login
  if (q.includes('from directory') && q.includes('join companies')) {
    const email = params[0];
    const entry = platform.directory.find(d => d.email === email);
    if (!entry) return { rows: [] };
    const company = platform.companies.find(c => c.id === entry.company_id);
    if (!company) return { rows: [] };
    return { rows: [ { company_id: company.id, db_name: company.db_name, status: company.status || 'active', company_name: company.name } ] };
  }

  // list companies
  if (q.startsWith('select id, name, slug')) {
    return { rows: platform.companies.slice().reverse() };
  }

  // insert company (simplified) - handle different param orders used
  if (q.startsWith('insert into companies')) {
    // Known callsites use either (name, plan) or (name, slug, db_name, plan)
    let name = params[0] || `Company ${id()}`;
    let plan = 'free';
    let dbName = `tenant_${nextId}`;
    if (params.length === 1 || params.length === 2) {
      plan = params[1] || 'free';
    } else if (params.length >= 4) {
      // params: [name, slug, db_name, plan]
      name = params[0];
      dbName = params[2];
      plan = params[3] || 'free';
    }
    const comp = { id: id(), name, slug: name.toLowerCase().replace(/\s+/g,'-'), plan, status: 'active', subscription_renews_at: null, created_at: new Date().toISOString(), db_name: dbName };
    platform.companies.push(comp);
    // provision a tenant dataset
    makeTenant(comp.db_name);
    return { rows: [comp] };
  }

  // update companies status
  if (q.startsWith('update companies set status')) {
    const status = params[0];
    const idParam = params[1];
    const comp = platform.companies.find(c => String(c.id) === String(idParam));
    if (!comp) return { rows: [] };
    comp.status = status;
    return { rows: [comp] };
  }

  // insert into directory
  if (q.startsWith('insert into directory')) {
    const email = params[0];
    const companyId = params[1];
    platform.directory.push({ id: id(), email, company_id: companyId });
    return { rows: [] };
  }

  // fallback: return empty
  return { rows: [] };
}

export function getTenantPool(dbName) {
  const t = makeTenant(dbName);
  return {
    async query(text, params=[]) {
      const q = (text||'').trim().toLowerCase();
      // find role id
      if (q.startsWith("select id from roles where name")) {
        const name = params[0];
        const role = t.roles.find(r => r.name === name && r.is_system === true);
        return { rows: role ? [ { id: role.id } ] : [] };
      }
      if (q.startsWith('select id from roles where id') || (q.includes('from roles') && q.includes('where id ='))) {
        const idParam = params[0];
        const role = t.roles.find(r => String(r.id) === String(idParam));
        return { rows: role ? [ { id: role.id } ] : [] };
      }

      if (q.startsWith('insert into users')) {
        const email = params[0];
        const password_hash = params[1];
        const name = params[2];
        const role_id = params[3];
        const user = { id: id(), email, password_hash, name, role_id, status: 'active', created_at: new Date().toISOString() };
        t.users.push(user);
        return { rows: [user] };
      }

      if (q.startsWith('insert into roles')) {
        // INSERT INTO roles (name, description, is_system) VALUES ($1,$2,$3) RETURNING id
        const name = params[0];
        const description = params[1];
        const is_system = params[2];
        const role = { id: id(), name, description, is_system };
        t.roles.push(role);
        return { rows: [ { id: role.id } ] };
      }

      if (q.startsWith('select * from roles')) {
        // return roles with some default columns
        const rows = t.roles.map(r => ({ id: r.id, name: r.name, description: r.description || null, is_system: !!r.is_system, created_at: new Date().toISOString() }));
        return { rows };
      }

      if (q.startsWith('insert into permissions')) {
        // INSERT INTO permissions (role_id, module, can_read, can_write, can_approve)
        const role_id = params[0];
        const module = params[1];
        const can_read = params[2];
        const can_write = params[3];
        const can_approve = params[4];
        t.permissions.push({ id: id(), role_id, module, can_read, can_write, can_approve });
        return { rows: [] };
      }

      if (q.startsWith('select * from permissions') || q.startsWith('select module, can_read, can_write, can_approve from permissions')) {
        const rows = t.permissions.map(p => ({ id: p.id, role_id: p.role_id, module: p.module, can_read: p.can_read, can_write: p.can_write, can_approve: p.can_approve }));
        return { rows };
      }

      if (q.includes('from users') && q.includes('where u.email')) {
        const email = params[0];
        const user = t.users.find(u => u.email === email);
        if (!user) return { rows: [] };
        const role = t.roles.find(r => r.id === user.role_id) || {};
        return { rows: [ { ...user, role_name: role.name } ] };
      }

      if (q.startsWith('select u.id, u.email') || q.startsWith('select u.id, u.email, u.name')) {
        const rows = t.users.map(u => ({ id: u.id, email: u.email, name: u.name, status: u.status, created_at: u.created_at, role_id: u.role_id, role_name: (t.roles.find(r=>r.id===u.role_id)||{}).name }));
        return { rows };
      }

      if (q.startsWith('select u.id, u.email, u.name, r.id as role_id')) {
        const rows = t.users.map(u => ({ id: u.id, email: u.email, name: u.name, status: u.status, created_at: u.created_at, role_id: u.role_id, role_name: (t.roles.find(r=>r.id===u.role_id)||{}).name }));
        return { rows };
      }

      if (q.startsWith('select u.id, u.email, u.name, r.id as role_id, r.name as role_name')) {
        const rows = t.users.map(u => ({ id: u.id, email: u.email, name: u.name, status: u.status, created_at: u.created_at, role_id: u.role_id, role_name: (t.roles.find(r=>r.id===u.role_id)||{}).name }));
        return { rows };
      }

      if (q.startsWith("select u.id, u.email, u.name, r.id as role_id, r.name as role_name from users u left join roles r")) {
        const rows = t.users.map(u => ({ id: u.id, email: u.email, name: u.name, status: u.status, created_at: u.created_at, role_id: u.role_id, role_name: (t.roles.find(r=>r.id===u.role_id)||{}).name }));
        return { rows };
      }

      if (q.startsWith('select u.id, u.email, u.name, r.id as role_id, r.name as role_name where u.id')) {
        const idParam = params[0];
        const u = t.users.find(x => String(x.id) === String(idParam));
        if (!u) return { rows: [] };
        const perms = t.permissions.filter(p => p.role_id === u.role_id);
        return { rows: [u], permRows: perms };
      }

      // permissions
      if (q.startsWith('select module, can_read, can_write, can_approve from permissions')) {
        const role_id = params[0];
        const rows = t.permissions.filter(p => p.role_id === role_id).map(p => ({ module: p.module, can_read: p.can_read, can_write: p.can_write, can_approve: p.can_approve }));
        return { rows };
      }

      // fallback
      return { rows: [] };
    }
  };
}

export default { platformQuery, getTenantPool, initDevData };

export function debugState() {
  return { platform: { ...platform }, tenants: Array.from(tenants.entries()).map(([k,v])=>({ dbName: k, roles: v.roles.length, users: v.users.length })) };
}
