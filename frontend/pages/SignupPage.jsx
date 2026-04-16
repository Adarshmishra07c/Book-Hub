import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'

export default function SignupPage() {
  const [formData, setFormData] = useState({ username: '', email: '', password: '' })
  const [error, setError] = useState('')
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')

    // --- FRONTEND VALIDATION ---
    // This matches your Login Page requirement so users don't get locked out
    if (formData.password.length < 8) {
      setError('Password must be at least 8 characters long.')
      return
    }

    try {
      const response = await fetch('http://localhost:3001/api/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      })

      const data = await response.json()

      if (response.ok) {
        alert(`Welcome ${formData.username}! Account created.`)
        navigate('/login')
      } else {
        setError(data.message || 'Registration failed')
      }
    } catch (err) {
      setError('Server connection failed. Is your backend running?')
    }
  }

  return (
    <div className="auth-page">
      <div className="auth-split">
        {/* Left Side: Editorial Panel */}
        <div className="auth-panel">
          <div className="auth-panel-inner">
            <span className="auth-panel-logo">📚</span>
            <h2>Join the <em>Vault</em></h2>
            <p>Unlock exclusive access to our curated collection of literary masterpieces.</p>
            <div className="auth-panel-quotes">
              <div className="auth-quote">
                <p>"A room without books is like a body without a soul."</p>
                <footer>— Cicero</footer>
              </div>
            </div>
          </div>
        </div>

        {/* Right Side: Form Panel */}
        <div className="auth-form-panel">
          <div className="auth-form-inner">
            <header className="auth-form-header">
              <h1>Create <em>Free</em> Account</h1>
            </header>

            {/* Error Message Display */}
            {error && (
              <div className="server-error" style={{
                color: '#ff4d4d',
                backgroundColor: 'rgba(255, 77, 77, 0.1)',
                padding: '10px',
                borderRadius: '5px',
                marginBottom: '15px',
                fontSize: '14px',
                border: '1px solid rgba(255, 77, 77, 0.2)'
              }}>
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="auth-fields">
              <div className="input-group">
                <label>Full Name</label>
                <input
                  type="text"
                  className="search-input"
                  placeholder="Enter Your Name"
                  required
                  value={formData.username}
                  onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                />
              </div>

              <div className="input-group">
                <label>Email Address</label>
                <input
                  type="email"
                  className="search-input"
                  placeholder="name@example.com"
                  required
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                />
              </div>

              <div className="input-group">
                <label>Password</label>
                <input
                  type="password"
                  className="search-input"
                  placeholder="Min. 8 characters"
                  required
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                />
                <small style={{ color: '#888', fontSize: '12px', marginTop: '5px' }}>
                  Must be at least 8 characters.
                </small>
              </div>

              <button type="submit" className="btn-primary btn-auth">
                Create Account
              </button>
            </form>

            <div className="auth-divider">OR</div>
            <p style={{ textAlign: 'center' }}>
              Already a member? <Link to="/login" className="link-gold">Sign In</Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}