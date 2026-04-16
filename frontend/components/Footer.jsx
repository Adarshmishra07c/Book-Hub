import { NavLink } from 'react-router-dom'

export default function Footer() {
  const year = new Date().getFullYear()
  return (
    <footer className="footer">
      <div className="footer-inner">
        <div className="footer-brand">
          <span className="logo-text">
            Book<em>Hub</em>
          </span>
          <p>Your world-class digital library. Read more, everywhere.</p>
        </div>

        <nav className="footer-nav" aria-label="Footer navigation">
          <p className="footer-nav-heading">Navigate</p>
          {[
            ['/', 'Home'],
            ['/store', 'Browse Books'],
            ['/about', 'About Us'],
            ['/login', 'Sign In'],
            ['/signup', 'Create Account'],
          ].map(([to, label]) => (
            <NavLink key={to} to={to} className="footer-link">
              {label}
            </NavLink>
          ))}
        </nav>

        <div className="footer-info">
          <p className="footer-nav-heading">Contact</p>
          <p>Adarsh@bookhub.com</p>
          <p>Support: Mon–Fri, 9am–6pm IST</p>
          <div className="footer-socials">
            {['𝕏', 'in', '📘'].map((s) => (
              <span key={s} className="social-icon">{s}</span>
            ))}
          </div>
        </div>
      </div>

      <div className="footer-bottom">
        <span>© {year} BookHub. All rights reserved.</span>
        <span>Made with ♥ for readers everywhere</span>
      </div>
    </footer>
  )
}
