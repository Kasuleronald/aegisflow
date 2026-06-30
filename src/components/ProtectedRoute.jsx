import React from 'react'
import { Navigate } from 'react-router-dom'
import { useStore } from '../store/useStore.js'

function hasReadPermission(user, moduleKey) {
  if (!user || !moduleKey) return false
  if (moduleKey === 'platform_admin') return user.type === 'platform_admin'
  return !!user.permissions?.some((perm) => perm.module === moduleKey && perm.can_read)
}

export default function ProtectedRoute({ children, moduleKey, platformOnly }) {
  const token = useStore(s => s.token)
  const user = useStore(s => s.user)
  if (!token || !user) return <Navigate to="/login" replace />
  if (platformOnly && user.type !== 'platform_admin') {
    return <Navigate to="/dashboard" replace />
  }
  if (moduleKey && !hasReadPermission(user, moduleKey)) {
    return <Navigate to="/dashboard" replace />
  }
  return children
}
