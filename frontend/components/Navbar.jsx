import { useState } from 'react'
import { NavLink, useNavigate, useLocation } from 'react-router-dom' // Added useLocation
import { useCart } from '../context/CartContext'
import { useAuth } from '../context/AuthContext'

export default function Navbar() {
  const navigate = useNavigate()
  const location = useLocation() // Get current path
  const { cartCount } = useCart()
  const { user, isAdmin, logout } = useAuth()
  const [menuOpen, setMenuOpen] = useState(false)

  const close = () => setMenuOpen(false)
  
  const handleLogout = () => {
    logout()
    navigate('/')
    close()
  }

  // Logic to determine if we show Admin-specific links
  const isAdminPage = location.pathname.startsWith('/admin')
  const displayName = user?.username || "User";
  const firstName = displayName.split(' ')[0];

  return (
    <nav className="navbar" role="navigation">
      <div className="nav-container">
        {/* Logo Section - Redirects based on context */}
        <NavLink 
          to={isAdminPage ? "/admin/dashboard" : "/"} 
          className="nav-logo" 
          onClick={close}
        >
          <span className="logo-mark">📚</span>
          <span className="logo-text">Book<em>Hub</em></span>
        </NavLink>

        {/* Navigation Links */}
        <div className={`nav-links ${menuOpen ? 'nav-open' : ''}`}>
          
          {isAdminPage && isAdmin ? (
            /* ADMIN SPECIFIC LINKS */
            <>
              <NavLink to="/admin/dashboard" className="nav-link" onClick={close}>Dashboard</NavLink>
              <NavLink to="/admin/add-book" className="nav-link" onClick={close}>Add Book</NavLink>
              <NavLink to="/admin/manage-books" className="nav-link" onClick={close}>Manage Books</NavLink>
              <NavLink to="/" className="nav-link exit-admin" onClick={close}>Exit Admin</NavLink>
            </>
          ) : (
            /* STANDARD USER LINKS */
            <>
              <NavLink to="/" end className="nav-link" onClick={close}>Home</NavLink>
              <NavLink to="/store" className="nav-link" onClick={close}>Browse</NavLink>
              {isAdmin && (
                <NavLink to="/admin/dashboard" className="nav-link admin-highlight" onClick={close}>
                  🛡️ Admin
                </NavLink>
              )}
              <NavLink to="/about" className="nav-link" onClick={close}>About</NavLink>
            </>
          )}

          {/* Auth Section - Always Visible */}
          {user ? (
            <div className="nav-auth-group">
              <span className="nav-user-badge">
                {isAdmin ? "👑 " : "👤 "}
                {firstName}
              </span>
              <button className="nav-link logout-btn" onClick={handleLogout}>Logout</button>
            </div>
          ) : (
            <>
              <NavLink to="/login" className="nav-link" onClick={close}>Sign In</NavLink>
              <NavLink to="/signup" className="btn-nav-signup" onClick={close}>Get Started</NavLink>
            </>
          )}
        </div>

        {/* Right Side Actions */}
        <div className="nav-right">
          {/* Only show cart on non-admin pages */}
          {!isAdminPage && (
            <NavLink to="/cart" className="cart-icon-btn" aria-label="Cart">
              <span className="cart-icon">🛒</span>
              {cartCount > 0 && <span className="cart-badge">{cartCount}</span>}
            </NavLink>
          )}
          
          <button 
            className="hamburger" 
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label="Menu"
          >
            <span className={`ham-line ${menuOpen ? 'ham-open' : ''}`} />
            <span className={`ham-line ${menuOpen ? 'ham-open' : ''}`} />
            <span className={`ham-line ${menuOpen ? 'ham-open' : ''}`} />
          </button>
        </div>
      </div>

      {menuOpen && <div className="nav-backdrop" onClick={close} />}
    </nav>
  )
}