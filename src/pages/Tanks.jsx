import React, { useState } from 'react'
import { useStore } from '../store/useStore.js'
import { mockTransitLogs } from '../data/mockData.js'
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, ReferenceLine } from 'recharts'
import { AlertTriangle, TrendingDown, CheckCircle, Search } from 'lucide-react'
import { mockChartData } from '../data/mockData.js'

const TANK_STATUS = {
  normal: { label: 'Normal', cls: 'badge-success', color: 'var(--success)' },
  warning: { label: 'Warning', cls: 'badge-warning', color: 'var(--warning)' },
  critical: { label: 'Critical', cls: 'badge-danger', color: 'var(--danger)' },
  anomaly: { label: 'Anomaly', cls: 'badge-danger', color: 'var(--danger)' },
}

export default function Tanks() {
  const { tankReadings } = useStore()
  const [tab, setTab] = useState('readings')
  const [search, setSearch] = useState('')

  const filtered = tankReadings.filter(t => {
    const q = search.toLowerCase()
    return t.stationName.toLowerCase().includes(q) || t.product.toLowerCase().includes(q) || t.tankNo.toLowerCase().includes(q)
  })

  const totalVarianceLoss = tankReadings.reduce((s, t) => s + Math.abs(t.variance), 0)
  const anomalyTanks = tankReadings.filter(t => t.variancePct > 0.5).length
  const criticalTanks = tankReadings.filter(t => t.status === 'critical').length

  return (
    <div className="animate-fadeIn">
      <div className="page-header">
        <div>
          <div className="page-title">Tanks & Inventory</div>
          <div className="page-subtitle">Tank readings, losses, and transit reconciliation</div>
        </div>
      </div>

      {/* Stats */}
      <div className="stats-grid" style={{ marginBottom: 24 }}>
        <div className="stat-card">
          <div className="stat-label">Total Tanks Monitored</div>
          <div className="stat-value">{tankReadings.length}</div>
        </div>
        <div className="stat-card">
          <div className="stat-label">Variance Anomalies</div>
          <div className="stat-value" style={{ color: anomalyTanks > 0 ? 'var(--danger)' : 'var(--success)' }}>{anomalyTanks}</div>
          <div style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 4 }}>&gt;0.5% threshold</div>
        </div>
        <div className="stat-card">
          <div className="stat-label">Total Daily Variance</div>
          <div className="stat-value">{totalVarianceLoss.toLocaleString()} L</div>
        </div>
        <div className="stat-card">
          <div className="stat-label">Critical Low Tanks</div>
          <div className="stat-value" style={{ color: criticalTanks > 0 ? 'var(--danger)' : 'var(--success)' }}>{criticalTanks}</div>
        </div>
      </div>

      <div className="tab-bar">
        {[['readings','Tank Readings'],['transit','Transit Logs'],['variance','Variance Chart']].map(([k,l]) => (
          <button key={k} className={`tab-btn ${tab === k ? 'active' : ''}`} onClick={() => setTab(k)}>{l}</button>
        ))}
      </div>

      {tab === 'readings' && (
        <>
          <div style={{ position: 'relative', marginBottom: 16, maxWidth: 380 }}>
            <Search size={14} style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
            <input style={{ paddingLeft: 34 }} placeholder="Search tanks…" value={search} onChange={e => setSearch(e.target.value)} />
          </div>
          <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
            <table className="data-table">
              <thead>
                <tr>
                  <th>Station</th><th>Tank</th><th>Product</th><th>Capacity</th>
                  <th>Level</th><th>Level %</th><th>Opening</th><th>Received</th>
                  <th>Sales</th><th>Variance</th><th>Var%</th><th>Status</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map(t => {
                  const levelPct = Math.round((t.currentLevel / t.capacity) * 100)
                  const varColor = t.variancePct > 1.5 ? 'var(--danger)' : t.variancePct > 0.5 ? 'var(--warning)' : 'var(--success)'
                  return (
                    <tr key={t.id}>
                      <td>{t.stationName}</td>
                      <td style={{ fontFamily: 'var(--font-mono)', fontWeight: 700 }}>{t.tankNo}</td>
                      <td><span style={{ fontFamily: 'var(--font-mono)', color: 'var(--accent)', fontWeight: 700 }}>{t.product}</span></td>
                      <td style={{ fontFamily: 'var(--font-mono)' }}>{t.capacity.toLocaleString()}L</td>
                      <td>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                          <div className="progress-bar" style={{ width: 48 }}>
                            <div className="progress-fill" style={{ width: `${levelPct}%`, background: levelPct < 20 ? 'var(--danger)' : levelPct < 40 ? 'var(--warning)' : 'var(--success)' }} />
                          </div>
                          <span style={{ fontFamily: 'var(--font-mono)', fontSize: 12 }}>{t.currentLevel.toLocaleString()}L</span>
                        </div>
                      </td>
                      <td style={{ fontFamily: 'var(--font-mono)' }}>{levelPct}%</td>
                      <td style={{ fontFamily: 'var(--font-mono)', fontSize: 12 }}>{t.openingStock.toLocaleString()}</td>
                      <td style={{ fontFamily: 'var(--font-mono)', fontSize: 12, color: t.received > 0 ? 'var(--success)' : '' }}>{t.received > 0 ? `+${t.received.toLocaleString()}` : '—'}</td>
                      <td style={{ fontFamily: 'var(--font-mono)', fontSize: 12 }}>{t.salesVolume.toLocaleString()}</td>
                      <td style={{ fontFamily: 'var(--font-mono)', fontSize: 12, color: varColor, fontWeight: 600 }}>
                        {t.variance > 0 ? '+' : ''}{t.variance}L
                      </td>
                      <td style={{ fontFamily: 'var(--font-mono)', fontSize: 12, color: varColor }}>{t.variancePct.toFixed(2)}%</td>
                      <td><span className={`badge ${TANK_STATUS[t.status]?.cls}`}>{TANK_STATUS[t.status]?.label}</span></td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        </>
      )}

      {tab === 'transit' && (
        <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
          <table className="data-table">
            <thead>
              <tr><th>Vehicle</th><th>Route</th><th>Product</th><th>Loaded (L)</th><th>Delivered (L)</th><th>Loss (L)</th><th>Loss %</th><th>Driver</th><th>Status</th><th>Flagged</th></tr>
            </thead>
            <tbody>
              {mockTransitLogs.map(t => (
                <tr key={t.id} style={{ background: t.flagged ? 'rgba(239,68,68,0.04)' : '' }}>
                  <td>
                    <div style={{ fontFamily: 'var(--font-mono)', fontWeight: 700, color: 'var(--accent)' }}>{t.plate}</div>
                    <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>{t.depDate} → {t.arrDate}</div>
                  </td>
                  <td style={{ fontSize: 12 }}>{t.route}</td>
                  <td style={{ fontFamily: 'var(--font-mono)', color: 'var(--info)' }}>{t.product}</td>
                  <td style={{ fontFamily: 'var(--font-mono)' }}>{t.loadedQty.toLocaleString()}</td>
                  <td style={{ fontFamily: 'var(--font-mono)' }}>{t.deliveredQty.toLocaleString()}</td>
                  <td style={{ fontFamily: 'var(--font-mono)', color: t.transitLoss > 500 ? 'var(--danger)' : 'var(--warning)' }}>-{t.transitLoss}</td>
                  <td style={{ fontFamily: 'var(--font-mono)', color: t.lossPct > 1 ? 'var(--danger)' : t.lossPct > 0.5 ? 'var(--warning)' : 'var(--success)' }}>{t.lossPct.toFixed(2)}%</td>
                  <td>{t.driver}</td>
                  <td>
                    <span className={`badge ${t.status === 'completed' ? 'badge-muted' : t.status === 'investigating' ? 'badge-warning' : 'badge-info'}`}>{t.status}</span>
                  </td>
                  <td>
                    {t.flagged
                      ? <span className="badge badge-danger"><AlertTriangle size={10} />Flagged</span>
                      : <span className="badge badge-success"><CheckCircle size={10} />Clear</span>}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {tab === 'variance' && (
        <div className="card">
          <div style={{ fontWeight: 600, marginBottom: 4 }}>Tank Variance by Station</div>
          <div style={{ fontSize: 12, color: 'var(--text-muted)', marginBottom: 20 }}>Acceptable threshold: 0.5%. Bars above the red line require investigation.</div>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={mockChartData.tankVariance}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" />
              <XAxis dataKey="station" tick={{ fill: '#8b9cc4', fontSize: 12 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: '#4a5578', fontSize: 11 }} axisLine={false} tickLine={false} unit="%" />
              <Tooltip formatter={v => `${v}%`} contentStyle={{ background: 'var(--bg-raised)', border: '1px solid var(--border-bright)', borderRadius: 8 }} />
              <ReferenceLine y={0.5} stroke="var(--danger)" strokeDasharray="4 4" label={{ value: 'Limit 0.5%', fill: 'var(--danger)', fontSize: 11 }} />
              <Bar dataKey="variance" fill="#3d8ef0" radius={[4,4,0,0]}
                label={{ position: 'top', fill: '#8b9cc4', fontSize: 10, formatter: v => `${v}%` }}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}
    </div>
  )
}
