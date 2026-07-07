import React from 'react';
import { NavLink } from 'react-router-dom';

const links = [
  { to: '/', label: 'Home' },
  { to: '/dashboard', label: 'Dashboard' },
  { to: '/scan', label: 'Scan' },
  { to: '/reports', label: 'Reports' },
  { to: '/login', label: 'Login' },
];

export default function Navbar() {
  return (
    <nav className="app-nav">
      <div className="brand">VulnGuard</div>
      <div className="nav-links">
        {links.map((link) => (
          <NavLink key={link.to} to={link.to} className={({ isActive }) => isActive ? 'active' : ''}>
            {link.label}
          </NavLink>
        ))}
      </div>
    </nav>
  );
}
