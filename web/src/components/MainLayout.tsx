import { NavLink, Outlet } from 'react-router-dom'

export function MainLayout() {
  return (
    <div className="app-shell">
      <Outlet />
      <nav className="tabs">
        <NavLink to="/" end>
          Profile
        </NavLink>
        <NavLink to="/share">QR Code</NavLink>
        <NavLink to="/scan">Scanner</NavLink>
      </nav>
    </div>
  )
}
