import { create } from 'zustand'
import api from '../services/api.js'
import { MODULE_KEYS } from '../config/modules.js'
import { mockStations, mockFleet, mockTankReadings, mockMaintenanceJobs, mockContractors, mockSuppliers, mockAlerts, mockTransitLogs, mockHrEmployees, mockFinanceInvoices, mockProcurementOrders, mockComplianceCases, mockUsers, mockRoles } from '../data/mockData.js'

const TOKEN_KEY = 'aegisflow_token'
const USER_KEY = 'aegisflow_user'

export const useStore = create((set, get) => ({
  // Auth
  token: localStorage.getItem(TOKEN_KEY) || null,
  user: JSON.parse(localStorage.getItem(USER_KEY) || 'null') || { name: 'Admin User', role: 'Super Admin', company: 'PetroNet Corp', avatar: 'AU' },

  // Core data
  stations: mockStations,
  fleet: mockFleet,
  tankReadings: mockTankReadings,
  maintenanceJobs: mockMaintenanceJobs,
  contractors: mockContractors,
  suppliers: mockSuppliers,
  alerts: mockAlerts,
  transitLogs: mockTransitLogs,
  hrEmployees: mockHrEmployees,
  financeInvoices: mockFinanceInvoices,
  procurementOrders: mockProcurementOrders,
  complianceCases: mockComplianceCases,
  companyUsers: mockUsers,
  companyRoles: mockRoles,

  // UI state
  sidebarOpen: true,
  activeModule: 'dashboard',

  // Currency
  currency: 'USD',
  setCurrency: (code) => set({ currency: code }),

  // Actions
  toggleSidebar: () => set(s => ({ sidebarOpen: !s.sidebarOpen })),
  setModule: (mod) => set({ activeModule: mod }),

  // Authentication helpers
  setAuth: (token, user) => {
    if (token) {
      localStorage.setItem(TOKEN_KEY, token)
      api.setToken(token)
    } else {
      localStorage.removeItem(TOKEN_KEY)
      api.setToken(null)
    }
    if (user) {
      localStorage.setItem(USER_KEY, JSON.stringify(user))
    } else {
      localStorage.removeItem(USER_KEY)
    }
    set({ token, user })
  },

  login: async (email, password) => {
    const res = await api.login(email, password)
    if (!res) throw new Error('Login failed')
    const { token, user } = res
    api.setToken(token)

    const permissions =
      user.type === 'platform_admin'
        ? MODULE_KEYS.map((module) => ({ module, can_read: true, can_write: true, can_approve: true }))
        : user?.permissions || []

    const mergedUser = {
      ...user,
      permissions,
    }
    get().setAuth(token, mergedUser)
    return res
  },

  logout: () => {
    get().setAuth(null, null)
    set({ token: null, user: null })
  },

  acknowledgeAlert: (id) => set((state) => ({
    alerts: state.alerts.map((alert) =>
      alert.id === id && alert.status === 'active'
        ? { ...alert, status: 'acknowledged' }
        : alert
    ),
  })),

  dismissAlert: (id) => set((state) => ({
    alerts: state.alerts.map((alert) =>
      alert.id === id && alert.status === 'active'
        ? { ...alert, status: 'dismissed' }
        : alert
    ),
  })),

  // Fetch tenant-scoped data from backend; fall back to mock data on error.
  fetchCompanyData: async () => {
    const user = get().user
    if (!user || user.type !== 'company_user') return

    const defaults = {
      companyUsers: mockUsers,
      companyRoles: mockRoles,
      hrEmployees: mockHrEmployees,
      financeInvoices: mockFinanceInvoices,
      procurementOrders: mockProcurementOrders,
      complianceCases: mockComplianceCases,
    }

    const canRead = (module) =>
      user.permissions?.some((perm) => perm.module === module && perm.can_read)

    const results = await Promise.allSettled([
      canRead('admin') ? api.getUsers() : Promise.resolve(null),
      canRead('admin') ? api.getRoles() : Promise.resolve(null),
      canRead('hr') ? api.getHrEmployees() : Promise.resolve(null),
      canRead('finance') ? api.getFinanceInvoices() : Promise.resolve(null),
      canRead('procurement') ? api.getProcurementOrders() : Promise.resolve(null),
      canRead('compliance') ? api.getComplianceCases() : Promise.resolve(null),
    ])

    set({
      companyUsers: results[0].status === 'fulfilled' && results[0].value ? results[0].value : defaults.companyUsers,
      companyRoles: results[1].status === 'fulfilled' && results[1].value ? results[1].value : defaults.companyRoles,
      hrEmployees: results[2].status === 'fulfilled' && results[2].value ? results[2].value : defaults.hrEmployees,
      financeInvoices: results[3].status === 'fulfilled' && results[3].value ? results[3].value : defaults.financeInvoices,
      procurementOrders: results[4].status === 'fulfilled' && results[4].value ? results[4].value : defaults.procurementOrders,
      complianceCases: results[5].status === 'fulfilled' && results[5].value ? results[5].value : defaults.complianceCases,
    })
  },

  // Company admin actions
  provisionCompany: async (data) => {
    const res = await api.provisionCompany(data)
    return res
  },

  createUser: async (user) => {
    const res = await api.createUser(user)
    return res
  },
}))
