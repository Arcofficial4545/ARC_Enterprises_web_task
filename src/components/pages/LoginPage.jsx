import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'

const LoginPage = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [isForgot, setIsForgot] = useState(false)
  const [resetEmail, setResetEmail] = useState('')
  const [resetSuccess, setResetSuccess] = useState('')
  const [resetLoading, setResetLoading] = useState(false)

  const { login, loginWithGoogle, resetPassword } = useAuth()
  const navigate = useNavigate()

  const handleChange = (e) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    try {
      setError('')
      setLoading(true)
      await login(formData.email, formData.password)
      navigate('/')
    } catch (err) {
      setError('Failed to sign in. Please check your credentials.')
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  const handleGoogleSignIn = async () => {
    try {
      setError('')
      setLoading(true)
      await loginWithGoogle()
      navigate('/')
    } catch (err) {
      setError('Google Sign-In failed. Please try again.')
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  const handlePasswordReset = async (e) => {
    e.preventDefault()
    if (!resetEmail) return

    try {
      setError('')
      setResetSuccess('')
      setResetLoading(true)
      await resetPassword(resetEmail)
      setResetSuccess('Password reset link sent to your email!')
    } catch (err) {
      setError(err.message || 'Failed to send password reset email.')
      console.error(err)
    } finally {
      setResetLoading(false)
    }
  }

  return (
    <div className="pt-24 pb-16 px-4">
      <div className="max-w-md mx-auto">
        <div className="glass p-8 rounded-lg">
          <h1 className="text-4xl font-heading text-accent mb-6 text-center">
            {isForgot ? 'Reset Password' : 'Sign In'}
          </h1>
          
          {error && (
            <div className="mb-4 p-3 bg-red-500/20 border border-red-500 rounded text-red-500 text-sm">
              {error}
            </div>
          )}

          {resetSuccess && (
            <div className="mb-4 p-3 bg-green-500/20 border border-green-500 rounded text-green-400 text-sm">
              {resetSuccess}
            </div>
          )}

          {isForgot ? (
            <form onSubmit={handlePasswordReset}>
              <div className="mb-6">
                <label className="block mb-2 font-medium text-cream">Email Address</label>
                <input
                  type="email"
                  value={resetEmail}
                  onChange={(e) => setResetEmail(e.target.value)}
                  required
                  disabled={resetLoading}
                  className="w-full px-4 py-2 rounded bg-secondary border border-accent text-cream focus:outline-none focus:ring-2 focus:ring-accent disabled:opacity-50"
                  placeholder="Enter your email"
                />
              </div>
              <button
                type="submit"
                disabled={resetLoading}
                className="w-full px-8 py-3 bg-accent text-primary rounded-lg hover:opacity-90 transition duration-300 font-semibold disabled:opacity-50 disabled:cursor-not-allowed mb-4"
              >
                {resetLoading ? 'Sending Link...' : 'Send Reset Link'}
              </button>
              <button
                type="button"
                onClick={() => setIsForgot(false)}
                className="w-full py-2 text-cream hover:text-accent transition duration-300 text-sm"
              >
                Back to Sign In
              </button>
            </form>
          ) : (
            <>
              <form onSubmit={handleSubmit} className="mb-4">
                <div className="mb-4">
                  <label className="block mb-2 font-medium text-cream">Email</label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    disabled={loading}
                    className="w-full px-4 py-2 rounded bg-secondary border border-accent text-cream focus:outline-none focus:ring-2 focus:ring-accent disabled:opacity-50"
                  />
                </div>
                <div className="mb-2">
                  <label className="block mb-2 font-medium text-cream">Password</label>
                  <input
                    type="password"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    required
                    disabled={loading}
                    className="w-full px-4 py-2 rounded bg-secondary border border-accent text-cream focus:outline-none focus:ring-2 focus:ring-accent disabled:opacity-50"
                  />
                </div>
                <div className="text-right mb-6">
                  <button
                    type="button"
                    onClick={() => setIsForgot(true)}
                    className="text-sm text-accent hover:underline"
                  >
                    Forgot Password?
                  </button>
                </div>
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full px-8 py-3 bg-accent text-primary rounded-lg hover:opacity-90 transition duration-300 font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? 'Signing In...' : 'Sign In'}
                </button>
              </form>

              <div className="relative flex py-4 items-center">
                <div className="flex-grow border-t border-accent/20"></div>
                <span className="flex-shrink mx-4 text-cream/60 text-sm">or</span>
                <div className="flex-grow border-t border-accent/20"></div>
              </div>

              <button
                type="button"
                onClick={handleGoogleSignIn}
                disabled={loading}
                className="w-full flex items-center justify-center px-8 py-3 glass rounded-lg text-cream hover:bg-cream/10 transition duration-300 font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24">
                  <path
                    fill="currentColor"
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                    style={{ fill: '#4285F4' }}
                  />
                  <path
                    fill="currentColor"
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                    style={{ fill: '#34A853' }}
                  />
                  <path
                    fill="currentColor"
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                    style={{ fill: '#FBBC05' }}
                  />
                  <path
                    fill="currentColor"
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                    style={{ fill: '#EA4335' }}
                  />
                </svg>
                Sign in with Google
              </button>

              <p className="text-cream text-center mt-6">
                Don't have an account?{' '}
                <Link to="/auth/register" className="text-accent hover:underline">
                  Sign Up
                </Link>
              </p>
            </>
          )}
        </div>
      </div>
    </div>
  )
}

export default LoginPage
