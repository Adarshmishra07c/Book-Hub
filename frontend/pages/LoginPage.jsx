import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import Field from '../components/Field'
import { useAuth } from '../context/AuthContext'
import { validators, runValidation, hasErrors } from '../utils/validators'

export default function LoginPage() {
  const navigate = useNavigate()
  const { login } = useAuth()

  const [form, setFormState] = useState({ email: '', password: '' })
  const [errors, setErrors] = useState({})
  const [loading, setLoading] = useState(false)
  const [serverError, setServerError] = useState('')

  const setField = (key) => (val) =>
    setFormState((f) => ({ ...f, [key]: val }))

  const handleSubmit = async () => {
    // 1. Run UI Validations (Format checks)
    const e = runValidation(form, {
      email: validators.email,
      password: validators.password,
    })

    setErrors(e)
    if (hasErrors(e)) return

    setLoading(true)
    setServerError('')

    try {
      const response = await fetch('http://localhost:3001/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      })

      const data = await response.json()

      if (response.ok) {
        // SUCCESS CASE
        const { token, ...userData } = data

        // Save to AuthContext + localStorage
        login(userData, token)

        // Navigate based on isAdmin role
        if (Boolean(data.isAdmin)) {
          navigate('/admin/dashboard')
        } else {
          navigate('/')
        }
      } else {
        // ERROR CASE: 404 (User not found) or 401 (Invalid email or password)
        // This 'data.message' comes directly from your updated backend controller
        setServerError(data.message || 'Login failed. Please try again.')
      }
    } catch (err) {
      // NETWORK CASE: Server is down
      setServerError('Server connection failed. Is your backend running?')
    } finally {
      setLoading(false)
    }
  }

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') handleSubmit()
  }

  return (
    <div className="auth-page">
      <div className="auth-split">
        <div className="auth-panel" aria-hidden="true">
          <div className="auth-panel-inner">
            <div className="auth-panel-logo" style={{ fontSize: '40px', marginBottom: '20px' }}>
              📚
            </div>
            <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: '3rem' }}>
              Welcome Back
            </h2>
            <p style={{ opacity: 0.8 }}>Your next great read is waiting.</p>
          </div>
        </div>

        <div className="auth-form-panel">
          <div className="auth-form-inner">
            <div className="auth-form-header" style={{ marginBottom: '30px' }}>
              <h1 style={{ fontFamily: "'Playfair Display', serif", fontSize: '2.5rem' }}>
                Sign In
              </h1>
              <p style={{ color: '#666' }}>
                New to BookHub?{' '}
                <Link to="/signup" style={{ color: '#D4A373', fontWeight: '700', textDecoration: 'none' }}>
                  Create account →
                </Link>
              </p>
            </div>

            {/* Error Display Section */}
            {serverError && (
              <div
                className="server-error"
                style={{
                  background: '#fff5f5',
                  color: '#c53030',
                  padding: '12px',
                  borderRadius: '8px',
                  marginBottom: '20px',
                  border: '1px solid #feb2b2',
                  fontSize: '14px',
                  fontWeight: '600',
                }}
              >
                {serverError}
              </div>
            )}

            <div
              className="auth-fields"
              onKeyDown={handleKeyDown}
              style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}
            >
              <Field
                label="Email Address"
                type="email"
                value={form.email}
                onChange={setField('email')}
                error={errors.email}
              />

              <Field
                label="Password"
                type="password"
                value={form.password}
                onChange={setField('password')}
                error={errors.password}
              />
            </div>

            <button
              className="btn-primary btn-full btn-auth"
              onClick={handleSubmit}
              disabled={loading}
              style={{
                width: '100%',
                padding: '14px',
                background: '#1a191e',
                color: 'white',
                border: 'none',
                borderRadius: '8px',
                fontWeight: '700',
                cursor: 'pointer',
                marginTop: '30px',
                transition: '0.3s',
              }}
            >
              {loading ? 'Processing...' : 'Sign In'}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}