import { create } from 'zustand'
import { mockStations, mockFleet, mockTankReadings, mockMaintenanceJobs, mockContractors, mockSuppliers, mockAlerts, mockTransitLogs } from '../data/mockData.js'

export const useStore = create((set, get) => ({
  // Auth
  user: { name: 'Admin User', role: 'Super Admin', company: 'PetroNet Corp', avatar: 'AU' },
  
  // Core data
  stations: mockStations,
  fleet: mockFleet,
  tankReadings: mockTankReadings,
  maintenanceJobs: mockMaintenanceJobs,
  contractors: mockContractors,
  suppliers: mockSuppliers,
  alerts: mockAlerts,
  transitLogs: mockTransitLogs,
  
  // UI state
  sidebarOpen: true,
  activeModule: 'dashboard',

  // Currency (base data is stored in KES; this selects the display currency)
  currency: 'KES',
  setCurrency: (code) => set({ currency: code }),
  
  // Notifications
  notifications: mockAlerts.filter(a => a.status === 'active').slice(0, 5),
  
  // Actions
  toggleSidebar: () => set(s => ({ sidebarOpen: !s.sidebarOpen })),
  setModule: (mod) => set({ activeModule: mod }),
  
  addStation: (station) => set(s => ({ stations: [...s.stations, { ...station, id: `STA-${Date.now()}` }] })),
  updateStation: (id, data) => set(s => ({ stations: s.stations.map(st => st.id === id ? { ...st, ...data } : st) })),
  deleteStation: (id) => set(s => ({ stations: s.stations.filter(st => st.id !== id) })),
  
  addFleetVehicle: (v) => set(s => ({ fleet: [...s.fleet, { ...v, id: `VEH-${Date.now()}` }] })),
  updateFleetVehicle: (id, data) => set(s => ({ fleet: s.fleet.map(v => v.id === id ? { ...v, ...data } : v) })),
  
  addMaintenanceJob: (job) => set(s => ({ maintenanceJobs: [...s.maintenanceJobs, { ...job, id: `MNT-${Date.now()}`, createdAt: new Date().toISOString() }] })),
  updateMaintenanceJob: (id, data) => set(s => ({ maintenanceJobs: s.maintenanceJobs.map(j => j.id === id ? { ...j, ...data } : j) })),
  
  acknowledgeAlert: (id) => set(s => ({ alerts: s.alerts.map(a => a.id === id ? { ...a, status: 'acknowledged' } : a) })),
  dismissAlert: (id) => set(s => ({ alerts: s.alerts.filter(a => a.id !== id) })),
  
  addContractor: (c) => set(s => ({ contractors: [...s.contractors, { ...c, id: `CON-${Date.now()}` }] })),
  updateContractor: (id, data) => set(s => ({ contractors: s.contractors.map(c => c.id === id ? { ...c, ...data } : c) })),
  
  addSupplier: (sup) => set(s => ({ suppliers: [...s.suppliers, { ...sup, id: `SUP-${Date.now()}` }] })),
  updateSupplier: (id, data) => set(s => ({ suppliers: s.suppliers.map(s2 => s2.id === id ? { ...s2, ...data } : s2) })),
  
  importData: (type, rows) => {
    if (type === 'stations') set(s => ({ stations: [...s.stations, ...rows] }))
    if (type === 'fleet') set(s => ({ fleet: [...s.fleet, ...rows] }))
    if (type === 'tankReadings') set(s => ({ tankReadings: [...s.tankReadings, ...rows] }))
  },
}))
