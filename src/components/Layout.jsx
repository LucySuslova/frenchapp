import { useState } from 'react'
import { NavLink, Outlet } from 'react-router-dom'
import {
  Home,
  BookOpen,
  Languages,
  FileText,
  Headphones,
  PenTool,
  BarChart3,
  Table,
  Menu,
  X,
  RefreshCw,
  Settings
} from 'lucide-react'

const navItems = [
  { to: '/', icon: Home, label: 'Home' },
  { to: '/review', icon: RefreshCw, label: 'Review Mode' },
  { to: '/grammar', icon: BookOpen, label: 'Grammar' },
  { to: '/vocabulary', icon: Languages, label: 'Vocabulary' },
  { to: '/reading', icon: FileText, label: 'Reading' },
  { to: '/listening', icon: Headphones, label: 'Listening' },
  { to: '/writing', icon: PenTool, label: 'Writing' },
  { to: '/dashboard', icon: BarChart3, label: 'Dashboard' },
  { to: '/clb-table', icon: Table, label: 'CLB Reference' },
  { to: '/settings', icon: Settings, label: 'Settings' },
]

function Layout() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  return (
    <div className="flex min-h-screen">
      {/* Desktop Sidebar */}
      <aside className="hidden md:flex flex-col w-64 bg-white border-r border-border p-4">
        <div className="mb-8">
          <h1 className="font-display text-xl font-bold text-ink">TCF Canada</h1>
          <p className="text-sm text-ink-light">French Learning App</p>
        </div>
        <nav className="flex-1">
          <ul className="space-y-1">
            {navItems.map(({ to, icon: Icon, label }) => (
              <li key={to}>
                <NavLink
                  to={to}
                  className={({ isActive }) =>
                    `flex items-center gap-3 px-3 py-2 rounded-lg transition-colors ${
                      isActive
                        ? 'bg-bamboo text-white'
                        : 'text-ink hover:bg-sand'
                    }`
                  }
                >
                  <Icon size={20} />
                  <span>{label}</span>
                </NavLink>
              </li>
            ))}
          </ul>
        </nav>
        <div className="pt-4 border-t border-border">
          <p className="text-xs text-ink-light">Target: CLB 7+</p>
        </div>
      </aside>

      {/* Mobile Header */}
      <div className="md:hidden fixed top-0 left-0 right-0 bg-white border-b border-border z-50">
        <div className="flex items-center justify-between px-4 h-14">
          <h1 className="font-display font-bold text-ink">TCF Canada</h1>
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 text-ink hover:bg-sand rounded-lg"
          >
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu Overlay */}
      {mobileMenuOpen && (
        <div className="md:hidden fixed inset-0 z-40 bg-black/50" onClick={() => setMobileMenuOpen(false)}>
          <div className="absolute top-14 left-0 right-0 bg-white border-b border-border" onClick={e => e.stopPropagation()}>
            <nav className="p-4">
              <ul className="space-y-1">
                {navItems.map(({ to, icon: Icon, label }) => (
                  <li key={to}>
                    <NavLink
                      to={to}
                      onClick={() => setMobileMenuOpen(false)}
                      className={({ isActive }) =>
                        `flex items-center gap-3 px-3 py-2 rounded-lg transition-colors ${
                          isActive
                            ? 'bg-bamboo text-white'
                            : 'text-ink hover:bg-sand'
                        }`
                      }
                    >
                      <Icon size={20} />
                      <span>{label}</span>
                    </NavLink>
                  </li>
                ))}
              </ul>
            </nav>
          </div>
        </div>
      )}

      {/* Main Content */}
      <main className="flex-1 md:p-8 p-4 pt-18 md:pt-8 overflow-auto">
        <div className="max-w-4xl mx-auto">
          <Outlet />
        </div>
      </main>
    </div>
  )
}

export default Layout
