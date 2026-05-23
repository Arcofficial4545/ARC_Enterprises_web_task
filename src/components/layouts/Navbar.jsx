import { Link, useNavigate } from 'react-router-dom'
import { useTheme } from '../../context/ThemeContext'
import { useAuth } from '../../context/AuthContext'

const Navbar = () => {
  const { theme, toggleTheme } = useTheme()
  const { currentUser, logout } = useAuth()
  const navigate = useNavigate()

  const handleLogout = async () => {
    try {
      await logout()
      navigate('/auth/login')
    } catch (err) {
      console.error('Failed to logout:', err)
    }
  }

  return (
    <nav className="glass fixed w-full z-50 top-0">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <Link to="/" className="text-2xl font-heading text-accent">
              ARC Enterprises
            </Link>
          </div>
          <div className="hidden md:flex space-x-8 items-center">
            <Link to="/" className="text-cream hover:text-accent transition duration-300">
              Home
            </Link>
            <Link to="/about" className="text-cream hover:text-accent transition duration-300">
              About
            </Link>
            <Link to="/contact" className="text-cream hover:text-accent transition duration-300">
              Contact
            </Link>
            <Link to="/courses" className="text-cream hover:text-accent transition duration-300">
              Courses
            </Link>
            {currentUser && (
              <>
                <Link to="/chat" className="text-cream hover:text-accent transition duration-300">
                  Chat
                </Link>
                <Link
                  to={currentUser.role === 'admin' ? '/dashboard/admin' : '/dashboard/user'}
                  className="text-cream hover:text-accent transition duration-300"
                >
                  {currentUser.role === 'admin' ? 'Admin Panel' : 'Dashboard'}
                </Link>
              </>
            )}
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium select-none">
                {theme === 'light' ? 'Dark Mode' : 'Light Mode'}
              </span>
              <button
                role="switch"
                aria-checked={theme === 'light'}
                onClick={toggleTheme}
                className="relative inline-flex items-center w-14 h-7 rounded-full transition-colors duration-300 focus:outline-none border border-solid"
              >
                <span className="inline-block w-5 h-5 rounded-full shadow-md transform transition-transform duration-300" />
              </button>
            </div>
          </div>
          <div className="flex space-x-4 items-center">
            {currentUser ? (
              <>
                <Link
                  to={currentUser.role === 'admin' ? '/dashboard/admin' : '/dashboard/user'}
                  className="text-cream text-sm hover:text-accent transition duration-300 hidden sm:inline"
                >
                  Welcome, <span className="font-semibold">{currentUser.displayName || currentUser.email.split('@')[0]}</span>
                </Link>
                <button
                  onClick={handleLogout}
                  className="px-4 py-2 glass rounded-lg text-accent hover:bg-accent hover:text-primary transition duration-300"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link to="/auth/login" className="px-4 py-2 text-cream hover:text-accent transition duration-300">
                  Sign In
                </Link>
                <Link to="/auth/register" className="px-4 py-2 glass rounded-lg text-accent hover:bg-accent hover:text-primary transition duration-300">
                  Sign Up
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  )
}

export default Navbar
