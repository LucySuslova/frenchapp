import { useState } from 'react'
import { NavLink, Outlet } from 'react-router-dom'
import { Menu, X } from 'lucide-react'

const navItems = [
  { to: '/', label: 'Home', number: '01' },
  { to: '/grammar', label: 'Grammar', number: '02' },
  { to: '/vocabulary', label: 'Vocabulary', number: '03' },
  { to: '/reading', label: 'Reading', number: '04' },
  { to: '/writing', label: 'Writing', number: '05' },
  { to: '/listening', label: 'Listening', number: '06' },
  { to: '/dashboard', label: 'Progress', number: '07' },
  { to: '/review', label: 'Review', number: '08' },
  { to: '/conjugation', label: 'Conjugation', number: '09' },
  { to: '/saved-expressions', label: 'Saved', number: '10' },
  { to: '/settings', label: 'Settings', number: '11' },
]

function Layout() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  return (
    <div className="flex min-h-screen">
      {/* Desktop Sidebar */}
      <aside className="sidebar hidden md:flex">
        {/* Logo */}
        <div className="flex items-center gap-3 mb-14">
          <div className="w-2 h-2 rounded-full bg-blush" />
          <div>
            <h1 className="font-serif text-2xl text-black">Français</h1>
            <span className="text-micro text-grey uppercase">TCF Canada</span>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex flex-col">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) =>
                `nav-item ${isActive ? 'active' : ''}`
              }
            >
              <span>{item.label}</span>
              <span className="nav-number">{item.number}</span>
            </NavLink>
          ))}
        </nav>

        {/* Sidebar bottom */}
        <div className="mt-auto">
          <div className="sidebar-preview">
            <img
              src="https://i.pinimg.com/736x/1f/4d/f0/1f4df0a7d6aa24cae26ed94e8addb7a7.jpg"
              alt="Song Kang"
              className="w-full h-full object-cover"
            />
          </div>
          <p className="font-serif text-base italic text-stone leading-relaxed mb-3">
            "Every journey begins with a single word."
          </p>
          <p className="text-xs text-grey tracking-wide">— Song Kang</p>
        </div>
      </aside>

      {/* Mobile Header */}
      <div className="mobile-header">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-blush" />
          <h1 className="font-serif text-xl text-black">Français</h1>
        </div>
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="mobile-menu-btn"
        >
          {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Menu Overlay */}
      {mobileMenuOpen && (
        <>
          <div
            className="mobile-menu-overlay"
            onClick={() => setMobileMenuOpen(false)}
          />
          <div className="mobile-menu">
            <nav className="flex flex-col">
              {navItems.map((item) => (
                <NavLink
                  key={item.to}
                  to={item.to}
                  onClick={() => setMobileMenuOpen(false)}
                  className={({ isActive }) =>
                    `nav-item ${isActive ? 'active' : ''}`
                  }
                >
                  <span>{item.label}</span>
                  <span className="nav-number">{item.number}</span>
                </NavLink>
              ))}
            </nav>
          </div>
        </>
      )}

      {/* Main Content */}
      <main className="main-content">
        <Outlet />
      </main>
    </div>
  )
}

export default Layout
