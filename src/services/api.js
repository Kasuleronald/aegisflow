const API_BASE = '' // assume same origin; backend runs on PORT 4000

let token = null

// initialize from localStorage if present
try {
  const stored = localStorage.getItem('aegisflow_token')
  if (stored) token = stored
} catch (e) {
  // localStorage may be unavailable in some environments
}

function setToken(t) {
  token = t
}

async function request(path, options = {}) {
  const headers = options.headers || {}
  if (token) headers['Authorization'] = `Bearer ${token}`
  headers['Content-Type'] = headers['Content-Type'] || 'application/json'

  const res = await fetch(`/api${path}`, { ...options, headers })
  if (!res.ok) {
    try {
      const err = await res.json()
      throw new Error(err.error || res.statusText)
    } catch (e) {
      throw new Error(res.statusText)
    }
  }
  return res.json()
}

export default {
  setToken,
  login: (email, password) => request('/auth/login', { method: 'POST', body: JSON.stringify({ email, password }) }),
  getCurrentUser: () => request('/users/me'),
  getUsers: () => request('/users'),
  createUser: (u) => request('/users', { method: 'POST', body: JSON.stringify(u) }),
  getRoles: () => request('/roles'),
  getHrEmployees: () => request('/hr/employees'),
  getFinanceInvoices: () => request('/finance/invoices'),
  getProcurementOrders: () => request('/procurement/orders'),
  getComplianceCases: () => request('/compliance/cases'),
  provisionCompany: (data) => request('/companies', { method: 'POST', body: JSON.stringify(data) }),
  getCompanies: () => request('/companies'),
  getCompanyRoles: (companyId) => request(`/companies/${companyId}/roles`),
  createCompanyUser: (companyId, data) => request(`/companies/${companyId}/users`, { method: 'POST', body: JSON.stringify(data) }),
}
