import React from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import Layout from './components/layout/Layout.jsx'
import Dashboard from './pages/Dashboard.jsx'
import Stations from './pages/Stations.jsx'
import Fleet from './pages/Fleet.jsx'
import Tanks from './pages/Tanks.jsx'
import Maintenance from './pages/Maintenance.jsx'
import Contractors from './pages/Contractors.jsx'
import Suppliers from './pages/Suppliers.jsx'
import Analytics from './pages/Analytics.jsx'
import Alerts from './pages/Alerts.jsx'
import FraudDetection from './pages/FraudDetection.jsx'
import DataImport from './pages/DataImport.jsx'
import Reports from './pages/Reports.jsx'

export default function App() {
  return (
    <>
      <Toaster
        position="top-right"
        toastOptions={{
          style: {
            background: '#1a2234',
            color: '#f0f4ff',
            border: '1px solid rgba(255,255,255,0.1)',
            borderRadius: '10px',
            fontSize: '13px',
          }
        }}
      />
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Navigate to="/dashboard" replace />} />
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="stations" element={<Stations />} />
          <Route path="fleet" element={<Fleet />} />
          <Route path="tanks" element={<Tanks />} />
          <Route path="maintenance" element={<Maintenance />} />
          <Route path="contractors" element={<Contractors />} />
          <Route path="suppliers" element={<Suppliers />} />
          <Route path="analytics" element={<Analytics />} />
          <Route path="alerts" element={<Alerts />} />
          <Route path="fraud" element={<FraudDetection />} />
          <Route path="import" element={<DataImport />} />
          <Route path="reports" element={<Reports />} />
        </Route>
      </Routes>
    </>
  )
}
