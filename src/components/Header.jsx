import { NavLink, useNavigate } from 'react-router-dom'
import { Map, Brain, BookOpen, Compass, Menu, X } from 'lucide-react'
import { useState } from 'react'
import { storage } from '../utils/storage'

const NAV = [
  { to: '/',         label: 'Home',             icon: Map },
  { to: '/routines', label: 'Thinking Routines', icon: Brain },
  { to: '/map',      label: 'My AI Map',         icon: Compass },
  { to: '/imagine',  label: 'IMAGINE',           icon: BookOpen },
]

export default function Header() {
  const [open, setOpen] = useState(false)
  const student = storage.getStudent()

  return (
    <header className="sticky top-0 z-50 bg-brand-950 text-white shadow-lg">
      <div className="max-w-6xl mx-auto px-4 flex items-center justify-between h-16">
        {/* Logo */}
        <NavLink to="/" className="flex items-center gap-2.5 font-bold text-lg tracking-tight">
          <span className="flex items-center justify-center w-9 h-9 rounded-xl bg-teal-500 text-white">
            <Map size={20} />
          </span>
          <span className="hidden sm:block">
            <span className="text-white">The Cognitive</span>{' '}
            <span className="text-teal-400">Map</span>
          </span>
        </NavLink>

        {/* Desktop nav */}
        <nav className="hidden md:flex items-center gap-1">
          {NAV.map(({ to, label, icon: Icon }) => (
            <NavLink
              key={to}
              to={to}
              end={to === '/'}
              className={({ isActive }) =>
                `flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium transition-colors duration-150 ${
                  isActive
                    ? 'bg-brand-700 text-white'
                    : 'text-slate-300 hover:text-white hover:bg-brand-800'
                }`
              }
            >
              <Icon size={15} />
              {label}
            </NavLink>
          ))}
        </nav>

        {/* Student name + mobile toggle */}
        <div className="flex items-center gap-3">
          {student?.name && (
            <span className="hidden sm:block text-sm text-slate-300">
              Hi, <span className="font-semibold text-teal-400">{student.name}</span>
            </span>
          )}
          <button
            className="md:hidden p-2 rounded-lg hover:bg-brand-800 transition-colors"
            onClick={() => setOpen(o => !o)}
            aria-label="Toggle menu"
          >
            {open ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>

      {/* Mobile nav */}
      {open && (
        <div className="md:hidden border-t border-brand-800 bg-brand-950 px-4 pb-4 pt-2 space-y-1">
          {NAV.map(({ to, label, icon: Icon }) => (
            <NavLink
              key={to}
              to={to}
              end={to === '/'}
              onClick={() => setOpen(false)}
              className={({ isActive }) =>
                `flex items-center gap-2 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                  isActive
                    ? 'bg-brand-700 text-white'
                    : 'text-slate-300 hover:text-white hover:bg-brand-800'
                }`
              }
            >
              <Icon size={16} />
              {label}
            </NavLink>
          ))}
        </div>
      )}
    </header>
  )
}
