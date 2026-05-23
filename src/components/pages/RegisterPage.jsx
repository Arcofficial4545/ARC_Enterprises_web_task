import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'

const RegisterPage = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    role: 'user'
  })
  const [errors, setErrors] = useState({})
  const [loading, setLoading] = useState(false)
  const { signup } = useAuth()
  const navigate = useNavigate()

  const handleChange = (e) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }))
    if (errors[e.target.name]) {
      setErrors(prev => ({ ...prev, [e.target.name]: '' }))
    }
  }

  const validate = () => {
    const newErrors = {}
    
    if (!formData.name.trim()) {
      newErrors.name = 'Name is required'
    }
    
    if (!formData.email.includes('@')) {
      newErrors.email = 'Invalid email address'
    }
    
    if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters'
    }
    
    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match'
    }
    
    return newErrors
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    const newErrors = validate()
    
    if (Object.keys(newErrors).length === 0) {
      try {
        setLoading(true)
        await signup(formData.email, formData.password, formData.name, formData.role)
        navigate('/')
      } catch (err) {
        setErrors({ submit: 'Failed to create account. Email may already be in use.' })
        console.error(err)
      } finally {
        setLoading(false)
      }
    } else {
      setErrors(newErrors)
    }
  }

  return (
    <div className="pt-24 pb-16 px-4">
      <div className="max-w-md mx-auto">
        <div className="glass p-8 rounded-lg">
          <h1 className="text-4xl font-heading text-accent mb-6 text-center">Sign Up</h1>
          
          {errors.submit && (
            <div className="mb-4 p-3 bg-red-500/20 border border-red-500 rounded text-red-500 text-sm">
              {errors.submit}
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label className="block mb-2 font-medium text-cream">Full Name</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                disabled={loading}
                className={`w-full px-4 py-2 rounded bg-secondary border ${errors.name ? 'border-red-500' : 'border-accent'} text-cream focus:outline-none focus:ring-2 focus:ring-accent disabled:opacity-50`}
              />
              {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name}</p>}
            </div>
            <div className="mb-4">
              <label className="block mb-2 font-medium text-cream">Email</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                disabled={loading}
                className={`w-full px-4 py-2 rounded bg-secondary border ${errors.email ? 'border-red-500' : 'border-accent'} text-cream focus:outline-none focus:ring-2 focus:ring-accent disabled:opacity-50`}
              />
              {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
            </div>
            <div className="mb-4">
              <label className="block mb-2 font-medium text-cream">Password</label>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                required
                disabled={loading}
                className={`w-full px-4 py-2 rounded bg-secondary border ${errors.password ? 'border-red-500' : 'border-accent'} text-cream focus:outline-none focus:ring-2 focus:ring-accent disabled:opacity-50`}
              />
              {errors.password && <p className="text-red-500 text-sm mt-1">{errors.password}</p>}
            </div>
            <div className="mb-4">
              <label className="block mb-2 font-medium text-cream">Confirm Password</label>
              <input
                type="password"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                required
                disabled={loading}
                className={`w-full px-4 py-2 rounded bg-secondary border ${errors.confirmPassword ? 'border-red-500' : 'border-accent'} text-cream focus:outline-none focus:ring-2 focus:ring-accent disabled:opacity-50`}
              />
              {errors.confirmPassword && <p className="text-red-500 text-sm mt-1">{errors.confirmPassword}</p>}
            </div>
            <div className="mb-6">
              <label className="block mb-2 font-medium text-cream">Select Role</label>
              <select
                name="role"
                value={formData.role}
                onChange={handleChange}
                disabled={loading}
                className="w-full px-4 py-2 rounded bg-secondary border border-accent text-cream focus:outline-none focus:ring-2 focus:ring-accent disabled:opacity-50"
              >
                <option value="user">Normal User</option>
                <option value="admin">Administrator</option>
              </select>
              <p className="text-xs text-accent mt-1">Admin role grants control over all courses and users.</p>
            </div>
            <button
              type="submit"
              disabled={loading}
              className="w-full px-8 py-3 bg-accent text-primary rounded-lg hover:opacity-90 transition duration-300 font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Creating Account...' : 'Sign Up'}
            </button>
          </form>

          <p className="text-cream text-center mt-6">
            Already have an account?{' '}
            <Link to="/auth/login" className="text-accent hover:underline">
              Sign In
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}

export default RegisterPage
