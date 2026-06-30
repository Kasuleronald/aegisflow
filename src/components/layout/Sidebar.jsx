import React from 'react'
import { NavLink, useLocation } from 'react-router-dom'
import { useStore } from '../../store/useStore.js'
import {
  LayoutDashboard, Fuel, Truck, Database, Wrench,
  HardHat, Package, BarChart3, Bell, ShieldAlert,
  Upload, FileText, ChevronLeft, ChevronRight, Zap
} from 'lucide-react'

const NAV = [
  { label: 'Overview', items: [
    { path: '/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
    { path: '/alerts', icon: Bell, label: 'Alerts', badge: 'alerts' },
    { path: '/analytics', icon: BarChart3, label: 'Analytics' },
  ]},
  { label: 'Operations', items: [
    { path: '/stations', icon: Fuel, label: 'Stations' },
    { path: '/fleet', icon: Truck, label: 'Fleet' },
    { path: '/tanks', icon: Database, label: 'Tanks & Inventory' },
    { path: '/maintenance', icon: Wrench, label: 'Maintenance' },
  ]},
  { label: 'Compliance', items: [
    { path: '/fraud', icon: ShieldAlert, label: 'Fraud Detection' },
    { path: '/contractors', icon: HardHat, label: 'Contractors' },
    { path: '/suppliers', icon: Package, label: 'Suppliers' },
  ]},
  { label: 'Data', items: [
    { path: '/import', icon: Upload, label: 'Import Data' },
    { path: '/reports', icon: FileText, label: 'Reports' },
  ]},
]

export default function Sidebar() {
  const { sidebarOpen, toggleSidebar, alerts } = useStore()
  const activeAlerts = alerts.filter(a => a.status === 'active').length

  return (
    <aside style={{
      position: 'fixed',
      left: 0, top: 0, bottom: 0,
      width: 'var(--sidebar-width)',
      background: 'var(--bg-surface)',
      borderRight: '1px solid var(--border)',
      display: 'flex',
      flexDirection: 'column',
      transform: sidebarOpen ? 'translateX(0)' : 'translateX(-100%)',
      transition: 'transform 0.25s ease',
      zIndex: 50,
      overflowY: 'auto',
      overflowX: 'hidden',
    }}>
      {/* Logo */}
      <div style={{ padding: '20px 20px 16px', borderBottom: '1px solid var(--border)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{ width: 34, height: 34, borderRadius: 10, background: 'linear-gradient(135deg, #3d8ef0, #818cf8)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Zap size={18} color="white" fill="white" />
          </div>
          <div>
            <div style={{ fontWeight: 700, fontSize: 16, letterSpacing: '-0.02em', color: 'var(--text-primary)' }}>AegisFlow</div>
            <div style={{ fontSize: 10, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>Petrol Intelligence</div>
          </div>
        </div>
        <button onClick={toggleSidebar} className="btn btn-ghost" style={{ padding: '4px', borderRadius: 6 }}>
          <ChevronLeft size={16} />
        </button>
      </div>

      {/* Nav groups */}
      <nav style={{ flex: 1, padding: '12px 10px' }}>
        {NAV.map(group => (
          <div key={group.label} style={{ marginBottom: 20 }}>
            <div style={{ fontSize: 10, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.1em', color: 'var(--text-muted)', padding: '0 10px', marginBottom: 6 }}>
              {group.label}
            </div>
            {group.items.map(item => (
              <NavLink
                key={item.path}
                to={item.path}
                style={({ isActive }) => ({
                  display: 'flex',
                  alignItems: 'center',
                  gap: 10,
                  padding: '8px 10px',
                  borderRadius: 8,
                  fontSize: 13,
                  fontWeight: 500,
                  textDecoration: 'none',
                  color: isActive ? 'var(--text-primary)' : 'var(--text-secondary)',
                  background: isActive ? 'var(--bg-raised)' : 'transparent',
                  marginBottom: 2,
                  transition: 'all 0.15s ease',
                  position: 'relative',
                })}
              >
                {({ isActive }) => (
                  <>
                    {isActive && (
                      <div style={{ position: 'absolute', left: 0, top: '20%', bottom: '20%', width: 3, background: 'var(--accent)', borderRadius: '0 2px 2px 0' }} />
                    )}
                    <item.icon size={16} color={isActive ? 'var(--accent)' : 'currentColor'} />
                    <span style={{ flex: 1 }}>{item.label}</span>
                    {item.badge === 'alerts' && activeAlerts > 0 && (
                      <span style={{ background: 'var(--danger)', color: 'white', fontSize: 10, fontWeight: 700, padding: '1px 6px', borderRadius: 999, minWidth: 18, textAlign: 'center' }}>
                        {activeAlerts}
                      </span>
                    )}
                  </>
                )}
              </NavLink>
            ))}
          </div>
        ))}
      </nav>

      {/* User footer */}
      <div style={{ padding: '14px 16px', borderTop: '1px solid var(--border)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{ width: 32, height: 32, borderRadius: '50%', background: 'var(--accent-dim)', border: '1px solid var(--accent)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 11, fontWeight: 700, color: 'var(--accent)' }}>AU</div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-primary)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>Admin User</div>
            <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>Super Admin</div>
          </div>
        </div>
      </div>
    </aside>
  )
}
