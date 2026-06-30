import React from 'react'
import { useNavigate } from 'react-router-dom'
import {
  AreaChart, Area, BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, Legend
} from 'recharts'
import { useStore } from '../store/useStore.js'
import { mockChartData } from '../data/mockData.js'
import { formatCurrency, convertFromKES, getCurrency } from '../utils/currency.js'
import { Fuel, Truck, AlertTriangle, TrendingUp, ShieldAlert, Wrench, Activity } from 'lucide-react'

export default function Dashboard() {
  const { stations, fleet, alerts, maintenanceJobs, tankReadings, currency } = useStore()
  const navigate = useNavigate()
  const fmtKES = (v) => formatCurrency(v, currency)
  const sym = getCurrency(currency).symbol

  const operationalStations = stations.filter(s => s.status === 'operational').length
  const vehiclesInTransit = fleet.filter(v => v.status === 'in-transit').length
  const activeAlerts = alerts.filter(a => a.status === 'active').length
  const criticalAlerts = alerts.filter(a => a.severity === 'critical' && a.status === 'active').length
  const overdueJobs = maintenanceJobs.filter(j => j.status === 'overdue').length
  const anomalyTanks = tankReadings.filter(t => t.status === 'anomaly').length
  const totalMonthlySales = stations.reduce((s, st) => s + st.monthlySales, 0)

  const CustomTooltip = ({ active, payload, label }) => {
    if (!active || !payload) return null
    return (
      <div style={{ background: 'var(--bg-raised)', border: '1px solid var(--border-bright)', borderRadius: 8, padding: '10px 14px' }}>
        <div style={{ fontWeight: 600, marginBottom: 6, fontSize: 12 }}>{label}</div>
        {payload.map(p => (
          <div key={p.name} style={{ fontSize: 12, color: p.color, display: 'flex', gap: 8, justifyContent: 'space-between' }}>
            <span>{p.name}</span><span>{fmtKES(p.value)}</span>
          </div>
        ))}
      </div>
    )
  }

  return (
    <div className="animate-fadeIn">
      {/* Critical alert banner */}
      {criticalAlerts > 0 && (
        <div className="alert-bar danger" style={{ marginBottom: 20, cursor: 'pointer' }} onClick={() => navigate('/alerts')}>
          <AlertTriangle size={16} />
          <strong>{criticalAlerts} critical alert{criticalAlerts > 1 ? 's' : ''} require{criticalAlerts === 1 ? 's' : ''} immediate attention.</strong>
          <span style={{ marginLeft: 'auto', fontSize: 12, opacity: 0.8 }}>View Alerts →</span>
        </div>
      )}

      <div className="page-header">
        <div>
          <div className="page-title">Network Dashboard</div>
          <div className="page-subtitle">Real-time overview · {new Date().toLocaleDateString('en-KE', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</div>
        </div>
        <div style={{ display: 'flex', gap: 8 }}>
          <button className="btn btn-secondary btn-sm" onClick={() => navigate('/analytics')}>Full Analytics</button>
          <button className="btn btn-primary btn-sm" onClick={() => navigate('/reports')}>Generate Report</button>
        </div>
      </div>

      {/* KPI cards */}
      <div className="stats-grid" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', marginBottom: 24 }}>
        <StatCard icon={<Fuel size={18} />} iconBg="var(--accent-dim)" iconColor="var(--accent)"
          label="Stations Active" value={`${operationalStations}/${stations.length}`} change="+0 this week" changeGood />
        <StatCard icon={<Truck size={18} />} iconBg="rgba(34,211,160,0.12)" iconColor="var(--success)"
          label="Vehicles in Transit" value={vehiclesInTransit} change={`${fleet.length} total`} changeGood />
        <StatCard icon={<TrendingUp size={18} />} iconBg="rgba(129,140,248,0.12)" iconColor="var(--info)"
          label="Monthly Revenue" value={fmtKES(totalMonthlySales)} change="+8.2% vs last month" changeGood />
        <StatCard icon={<AlertTriangle size={18} />} iconBg="var(--warning-dim)" iconColor="var(--warning)"
          label="Active Alerts" value={activeAlerts} change={`${criticalAlerts} critical`} changeGood={false} />
        <StatCard icon={<ShieldAlert size={18} />} iconBg="var(--danger-dim)" iconColor="var(--danger)"
          label="Tank Anomalies" value={anomalyTanks} change="Needs investigation" changeGood={false} />
        <StatCard icon={<Wrench size={18} />} iconBg="var(--warning-dim)" iconColor="var(--warning)"
          label="Overdue Maintenance" value={overdueJobs} change={`${maintenanceJobs.filter(j => j.status === 'in-progress').length} in progress`} changeGood={overdueJobs === 0} />
      </div>

      {/* Charts row */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20, marginBottom: 24 }}>
        {/* Monthly sales chart */}
        <div className="card">
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
            <div style={{ fontWeight: 600, fontSize: 14 }}>Monthly Sales by Product</div>
            <span className="badge badge-info">7-month view</span>
          </div>
          <ResponsiveContainer width="100%" height={220}>
            <AreaChart data={mockChartData.monthlySales}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" />
              <XAxis dataKey="month" tick={{ fill: '#4a5578', fontSize: 11 }} axisLine={false} tickLine={false} />
              <YAxis tickFormatter={v => formatCurrency(v, currency)} tick={{ fill: '#4a5578', fontSize: 11 }} axisLine={false} tickLine={false} />
              <Tooltip content={<CustomTooltip />} />
              <Area type="monotone" dataKey="pms" stackId="1" stroke="#3d8ef0" fill="rgba(61,142,240,0.2)" name="PMS" />
              <Area type="monotone" dataKey="ago" stackId="1" stroke="#22d3a0" fill="rgba(34,211,160,0.15)" name="AGO" />
              <Area type="monotone" dataKey="dpk" stackId="1" stroke="#818cf8" fill="rgba(129,140,248,0.12)" name="DPK" />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Station performance */}
        <div className="card">
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
            <div style={{ fontWeight: 600, fontSize: 14 }}>Station Performance vs Target</div>
            <span className="badge badge-success">This Month</span>
          </div>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={mockChartData.stationPerformance} layout="vertical">
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" />
              <XAxis type="number" tickFormatter={v => formatCurrency(v, currency)} tick={{ fill: '#4a5578', fontSize: 10 }} axisLine={false} tickLine={false} />
              <YAxis dataKey="name" type="category" tick={{ fill: '#8b9cc4', fontSize: 11 }} axisLine={false} tickLine={false} width={65} />
              <Tooltip formatter={(v) => fmtKES(v)} contentStyle={{ background: 'var(--bg-raised)', border: '1px solid var(--border-bright)', borderRadius: 8 }} />
              <Bar dataKey="sales" name="Actual" fill="#3d8ef0" radius={[0,4,4,0]} />
              <Bar dataKey="target" name="Target" fill="rgba(255,255,255,0.1)" radius={[0,4,4,0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Bottom row */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 20 }}>
        {/* Recent alerts */}
        <div className="card" style={{ gridColumn: 'span 2' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 14 }}>
            <div style={{ fontWeight: 600, fontSize: 14 }}>Recent Alerts</div>
            <button className="btn btn-ghost btn-sm" onClick={() => navigate('/alerts')}>View all</button>
          </div>
          {alerts.slice(0, 5).map(alert => (
            <div key={alert.id} style={{ display: 'flex', alignItems: 'flex-start', gap: 12, padding: '10px 0', borderBottom: '1px solid var(--border)' }}>
              <div style={{ width: 8, height: 8, borderRadius: '50%', marginTop: 4, flexShrink: 0, background: alert.severity === 'critical' ? 'var(--danger)' : alert.severity === 'high' ? 'var(--warning)' : alert.severity === 'warning' ? 'var(--amber)' : 'var(--info)' }} />
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontSize: 13, fontWeight: 500, color: 'var(--text-primary)' }}>{alert.title}</div>
                <div style={{ fontSize: 11, color: 'var(--text-muted)', marginTop: 2, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{alert.message}</div>
              </div>
              <span className={`badge badge-${alert.severity === 'critical' ? 'danger' : alert.severity === 'high' ? 'warning' : 'info'}`}>{alert.severity}</span>
            </div>
          ))}
        </div>

        {/* Fleet status */}
        <div className="card">
          <div style={{ fontWeight: 600, fontSize: 14, marginBottom: 14 }}>Fleet Status</div>
          {[
            { label: 'In Transit', count: fleet.filter(v => v.status === 'in-transit').length, color: 'var(--success)' },
            { label: 'Loading', count: fleet.filter(v => v.status === 'loading').length, color: 'var(--accent)' },
            { label: 'Idle', count: fleet.filter(v => v.status === 'idle').length, color: 'var(--text-muted)' },
            { label: 'Delivered', count: fleet.filter(v => v.status === 'delivered').length, color: 'var(--info)' },
            { label: 'Maintenance', count: fleet.filter(v => v.status === 'maintenance').length, color: 'var(--warning)' },
          ].map(item => (
            <div key={item.label} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <div style={{ width: 8, height: 8, borderRadius: '50%', background: item.color }} />
                <span style={{ fontSize: 13, color: 'var(--text-secondary)' }}>{item.label}</span>
              </div>
              <span style={{ fontWeight: 700, fontSize: 14, color: item.color }}>{item.count}</span>
            </div>
          ))}
          <hr className="divider" />
          <button className="btn btn-secondary w-full" style={{ justifyContent: 'center', fontSize: 12 }} onClick={() => navigate('/fleet')}>
            View Fleet
          </button>
        </div>
      </div>
    </div>
  )
}

function StatCard({ icon, iconBg, iconColor, label, value, change, changeGood }) {
  return (
    <div className="stat-card">
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
        <div>
          <div className="stat-label">{label}</div>
          <div className="stat-value">{value}</div>
          <div className="stat-change" style={{ color: changeGood ? 'var(--success)' : 'var(--warning)' }}>{change}</div>
        </div>
        <div className="stat-icon" style={{ background: iconBg, color: iconColor }}>{icon}</div>
      </div>
    </div>
  )
}
