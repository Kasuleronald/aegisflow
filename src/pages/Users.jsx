import React from 'react'
import { useStore } from '../store/useStore.js'

export default function Users() {
  const { companyUsers } = useStore()

  return (
    <div className="page-card">
      <div className="page-header">
        <div>
          <div className="page-title">Company Users</div>
          <div className="page-subtitle">Manage users and assign roles inside your organisation.</div>
        </div>
      </div>
      <div className="card">
        <table className="table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Role</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {companyUsers.map(user => (
              <tr key={user.id}>
                <td>{user.name}</td>
                <td>{user.email}</td>
                <td>{user.role}</td>
                <td>{user.status}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
