import React, { useEffect, useState } from 'react'
import api from '../services/api.js'

export default function Companies() {
  const [companies, setCompanies] = useState([])
  const [roles, setRoles] = useState([])
  const [loading, setLoading] = useState(true)
  const [companyLoading, setCompanyLoading] = useState(false)
  const [userLoading, setUserLoading] = useState(false)
  const [error, setError] = useState(null)
  const [companyForm, setCompanyForm] = useState({ name: '', plan: 'starter', itAdminEmail: '', itAdminName: '', itAdminPassword: '' })
  const [userForm, setUserForm] = useState({ companyId: '', email: '', name: '', password: '', roleId: '' })

  useEffect(() => {
    loadCompanies()
  }, [])

  useEffect(() => {
    if (userForm.companyId) {
      loadRoles(userForm.companyId)
    } else {
      setRoles([])
      setUserForm((current) => ({ ...current, roleId: '' }))
    }
  }, [userForm.companyId])

  const loadCompanies = async () => {
    setLoading(true)
    setError(null)
    try {
      const result = await api.getCompanies()
      setCompanies(result)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const loadRoles = async (companyId) => {
    try {
      const result = await api.getCompanyRoles(companyId)
      setRoles(result)
      if (!result.some((role) => role.id === userForm.roleId)) {
        setUserForm((current) => ({ ...current, roleId: result[0]?.id || '' }))
      }
    } catch (err) {
      setError(err.message)
    }
  }

  const submitCompany = async (e) => {
    e.preventDefault()
    setCompanyLoading(true)
    setError(null)
    try {
      await api.createCompany(companyForm)
      setCompanyForm({ name: '', plan: 'starter', itAdminEmail: '', itAdminName: '', itAdminPassword: '' })
      loadCompanies()
    } catch (err) {
      setError(err.message)
    } finally {
      setCompanyLoading(false)
    }
  }

  const submitUser = async (e) => {
    e.preventDefault()
    setUserLoading(true)
    setError(null)
    try {
      await api.createCompanyUser(userForm.companyId, {
        email: userForm.email,
        name: userForm.name,
        password: userForm.password,
        roleId: userForm.roleId,
      })
      setUserForm((current) => ({ ...current, email: '', name: '', password: '' }))
    } catch (err) {
      setError(err.message)
    } finally {
      setUserLoading(false)
    }
  }

  return (
    <div className="page-card">
      <div className="page-header">
        <div>
          <div className="page-title">Platform Administration</div>
          <div className="page-subtitle">Create new companies, provision IT Admin accounts, and manage corporate onboarding.</div>
        </div>
      </div>

      {error && (
        <div className="alert-bar danger" style={{ marginBottom: 20 }}>
          <div>{error}</div>
        </div>
      )}

      <div className="card" style={{ marginBottom: 20 }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
          <div style={{ fontWeight: 600 }}>Existing companies</div>
          <span style={{ fontSize: 12, color: 'var(--text-muted)' }}>{companies.length} companies</span>
        </div>
        {loading ? (
          <div style={{ color: 'var(--text-muted)' }}>Loading companies…</div>
        ) : (
          <table className="table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Plan</th>
                <th>Status</th>
                <th>Created</th>
              </tr>
            </thead>
            <tbody>
              {companies.map((company) => (
                <tr key={company.id}>
                  <td>{company.name}</td>
                  <td>{company.plan}</td>
                  <td>{company.status}</td>
                  <td>{new Date(company.created_at).toLocaleDateString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      <div className="grid-2" style={{ gap: 20 }}>
        <div className="card">
          <div className="card-header">
            <div className="card-title">Create new company</div>
          </div>
          <form onSubmit={submitCompany}>
            <div className="form-group">
              <label className="form-label">Company name</label>
              <input
                className="form-input"
                value={companyForm.name}
                onChange={(e) => setCompanyForm((f) => ({ ...f, name: e.target.value }))}
                placeholder="KT-Petroleum"
                required
              />
            </div>
            <div className="form-group">
              <label className="form-label">Subscription plan</label>
              <select
                className="form-input"
                value={companyForm.plan}
                onChange={(e) => setCompanyForm((f) => ({ ...f, plan: e.target.value }))}
              >
                <option value="starter">Starter</option>
                <option value="growth">Growth</option>
                <option value="enterprise">Enterprise</option>
              </select>
            </div>
            <div className="form-group">
              <label className="form-label">IT Admin email</label>
              <input
                className="form-input"
                type="email"
                value={companyForm.itAdminEmail}
                onChange={(e) => setCompanyForm((f) => ({ ...f, itAdminEmail: e.target.value }))}
                placeholder="admin@company.com"
                required
              />
            </div>
            <div className="form-group">
              <label className="form-label">IT Admin name</label>
              <input
                className="form-input"
                value={companyForm.itAdminName}
                onChange={(e) => setCompanyForm((f) => ({ ...f, itAdminName: e.target.value }))}
                placeholder="IT Administrator"
              />
            </div>
            <div className="form-group">
              <label className="form-label">IT Admin password</label>
              <input
                className="form-input"
                type="password"
                value={companyForm.itAdminPassword}
                onChange={(e) => setCompanyForm((f) => ({ ...f, itAdminPassword: e.target.value }))}
                placeholder="Create a secure password"
                required
              />
            </div>
            <button type="submit" className="btn btn-primary" disabled={companyLoading} style={{ width: '100%', justifyContent: 'center' }}>
              {companyLoading ? 'Provisioning company…' : 'Create company'}
            </button>
          </form>
        </div>

        <div className="card">
          <div className="card-header">
            <div className="card-title">Invite user to company</div>
          </div>
          <form onSubmit={submitUser}>
            <div className="form-group">
              <label className="form-label">Company</label>
              <select
                className="form-input"
                value={userForm.companyId}
                onChange={(e) => setUserForm((f) => ({ ...f, companyId: e.target.value }))}
                required
              >
                <option value="">Select company</option>
                {companies.map((company) => (
                  <option key={company.id} value={company.id}>{company.name}</option>
                ))}
              </select>
            </div>
            <div className="form-group">
              <label className="form-label">User email</label>
              <input
                className="form-input"
                type="email"
                value={userForm.email}
                onChange={(e) => setUserForm((f) => ({ ...f, email: e.target.value }))}
                placeholder="user@company.com"
                required
              />
            </div>
            <div className="form-group">
              <label className="form-label">Full name</label>
              <input
                className="form-input"
                value={userForm.name}
                onChange={(e) => setUserForm((f) => ({ ...f, name: e.target.value }))}
                placeholder="Jane Doe"
                required
              />
            </div>
            <div className="form-group">
              <label className="form-label">Password</label>
              <input
                className="form-input"
                type="password"
                value={userForm.password}
                onChange={(e) => setUserForm((f) => ({ ...f, password: e.target.value }))}
                placeholder="Secure password"
                required
              />
            </div>
            <div className="form-group">
              <label className="form-label">Role</label>
              <select
                className="form-input"
                value={userForm.roleId}
                onChange={(e) => setUserForm((f) => ({ ...f, roleId: e.target.value }))}
                required
                disabled={!roles.length}
              >
                <option value="">Select a role</option>
                {roles.map((role) => (
                  <option key={role.id} value={role.id}>{role.name}</option>
                ))}
              </select>
            </div>
            <button type="submit" className="btn btn-primary" disabled={userLoading || !userForm.companyId} style={{ width: '100%', justifyContent: 'center' }}>
              {userLoading ? 'Inviting user…' : 'Invite user'}
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}
