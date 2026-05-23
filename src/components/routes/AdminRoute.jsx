import { Navigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'

const AdminRoute = ({ children }) => {
  const { currentUser, loading } = useAuth()

  if (loading) {
    return (
      <div className="pt-24 pb-16 px-4 text-center text-cream">
        <p className="text-lg">Checking authorizations...</p>
      </div>
    )
  }

  if (!currentUser) {
    return <Navigate to="/auth/login" replace />
  }

  if (currentUser.role !== 'admin') {
    return <Navigate to="/" replace />
  }

  return children
}

export default AdminRoute
