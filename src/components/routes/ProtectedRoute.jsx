import { Navigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'

const ProtectedRoute = ({ children }) => {
  const { currentUser, loading } = useAuth()

  if (loading) {
    return (
      <div className="pt-24 pb-16 px-4 text-center text-cream">
        <p className="text-lg">Checking authentication...</p>
      </div>
    )
  }

  if (!currentUser) {
    return <Navigate to="/auth/login" replace />
  }

  return children
}

export default ProtectedRoute
