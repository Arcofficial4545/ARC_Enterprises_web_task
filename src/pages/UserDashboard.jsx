import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { useCourses } from '../context/CourseContext'
import { doc, deleteDoc } from 'firebase/firestore'
import { db } from '../firebase/config'

const UserDashboard = () => {
  const { currentUser, resetPassword, deleteAccount } = useAuth()
  const { courses } = useCourses()
  const navigate = useNavigate()

  const [message, setMessage] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  // Filter courses created by this user
  const userCourses = courses.filter(c => c.userId === currentUser?.uid)
  const totalUserCourses = userCourses.length
  const userCoursesValuation = userCourses.reduce((acc, c) => acc + (parseFloat(c.price) || 0), 0)

  const handlePasswordReset = async () => {
    try {
      setMessage('')
      setError('')
      setLoading(true)
      await resetPassword(currentUser.email)
      setMessage('Password reset email sent successfully!')
    } catch (err) {
      setError(err.message || 'Failed to send password reset email.')
    } finally {
      setLoading(false)
    }
  }

  const handleDeleteAccount = async () => {
    const doubleConfirm = window.confirm(
      'WARNING: Are you sure you want to permanently delete your account? This will delete your Firestore profile document and your login credentials. This action cannot be undone!'
    )
    if (!doubleConfirm) return

    try {
      setError('')
      setLoading(true)
      await deleteAccount()
      navigate('/auth/login')
    } catch (err) {
      setError(err.message || 'Failed to delete account. You may need to log out and log back in to perform this sensitive action.')
    } finally {
      setLoading(false)
    }
  }

  const handleDeleteCourse = async (courseId) => {
    if (!window.confirm('Are you sure you want to delete this course?')) return
    try {
      await deleteDoc(doc(db, 'courses', courseId))
    } catch (err) {
      alert('Failed to delete course.')
    }
  }

  return (
    <div className="pt-24 pb-16 px-4">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-4xl font-heading text-accent mb-8">My Dashboard</h1>

        {message && (
          <div className="mb-6 p-3 bg-green-500/20 border border-green-500 rounded text-green-400 text-sm">
            {message}
          </div>
        )}

        {error && (
          <div className="mb-6 p-3 bg-red-500/20 border border-red-500 rounded text-red-400 text-sm">
            {error}
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* User Profile Card */}
          <div className="glass p-6 rounded-lg h-fit">
            <div className="flex items-center gap-4 mb-6">
              <div className="w-16 h-16 bg-accent rounded-full flex items-center justify-center text-primary text-3xl font-heading font-semibold">
                {currentUser?.displayName ? currentUser.displayName[0].toUpperCase() : currentUser?.email[0].toUpperCase()}
              </div>
              <div>
                <h2 className="text-2xl font-heading text-accent">{currentUser?.displayName || 'User Profile'}</h2>
                <span className="px-2 py-0.5 rounded text-xs font-semibold bg-secondary text-cream border border-accent/40 uppercase">
                  {currentUser?.role}
                </span>
              </div>
            </div>

            <div className="space-y-3 text-sm text-cream border-t border-accent/20 pt-4 mb-6">
              <p><strong>Email:</strong> {currentUser?.email}</p>
              <p>
                <strong>Account Status:</strong> Active
              </p>
            </div>

            <div className="border-t border-accent/20 pt-4 space-y-3">
              <button
                onClick={handlePasswordReset}
                disabled={loading}
                className="w-full px-4 py-2.5 glass text-accent rounded hover:bg-accent hover:text-primary transition font-semibold text-sm disabled:opacity-50"
              >
                Send Password Reset Email
              </button>
              <button
                onClick={handleDeleteAccount}
                disabled={loading}
                className="w-full px-4 py-2.5 bg-red-600/20 text-red-400 border border-red-500/30 rounded hover:bg-red-600 hover:text-white transition font-semibold text-sm disabled:opacity-50"
              >
                Delete My Account
              </button>
            </div>
          </div>

          {/* User Analytics and User's Courses */}
          <div className="lg:col-span-2 space-y-8">
            {/* User Analytics Stats */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="glass p-6 rounded-lg">
                <h3 className="text-cream/60 text-sm mb-1 uppercase tracking-wider font-semibold">My Courses Created</h3>
                <p className="text-4xl font-heading text-accent">{totalUserCourses}</p>
                <p className="text-xs text-cream/70 mt-2">Courses added by your account in Firestore</p>
              </div>
              <div className="glass p-6 rounded-lg">
                <h3 className="text-cream/60 text-sm mb-1 uppercase tracking-wider font-semibold">Total Valuation</h3>
                <p className="text-4xl font-heading text-accent">${userCoursesValuation}</p>
                <p className="text-xs text-cream/70 mt-2">Combined price value of your courses</p>
              </div>
            </div>

            {/* User's Courses List */}
            <div className="glass p-6 rounded-lg">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-heading text-accent">Manage My Courses</h2>
                <Link
                  to="/courses/create"
                  className="px-4 py-1.5 bg-accent text-primary rounded hover:opacity-90 transition font-semibold text-sm"
                >
                  + Add New Course
                </Link>
              </div>

              {userCourses.length === 0 ? (
                <div className="text-center py-10">
                  <p className="text-cream/60 text-sm mb-4">You have not created any courses in Firestore yet.</p>
                  <Link
                    to="/courses/create"
                    className="text-accent hover:underline text-sm font-semibold"
                  >
                    Create your first course now
                  </Link>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-sm">
                    <thead>
                      <tr className="border-b border-accent/20 text-accent font-semibold">
                        <th className="py-2">Course Name</th>
                        <th className="py-2">Category</th>
                        <th className="py-2">Price</th>
                        <th className="py-2 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {userCourses.map(c => (
                        <tr key={c.id} className="border-b border-accent/10 hover:bg-cream/5 transition">
                          <td className="py-3 font-medium text-cream">{c.name}</td>
                          <td className="py-3 text-cream/70 uppercase text-xs">{c.category}</td>
                          <td className="py-3 text-accent font-semibold">${c.price}</td>
                          <td className="py-3 text-right flex justify-end gap-2 items-center">
                            <Link
                              to={`/courses/${c.id}`}
                              className="px-2.5 py-1 text-xs glass rounded text-accent hover:bg-accent hover:text-primary transition"
                            >
                              View
                            </Link>
                            <Link
                              to={`/courses/${c.id}/edit`}
                              className="px-2.5 py-1 text-xs glass rounded text-cream hover:bg-cream/10 transition"
                            >
                              Edit
                            </Link>
                            <button
                              onClick={() => handleDeleteCourse(c.id)}
                              className="px-2.5 py-1 text-xs bg-red-600/20 text-red-400 border border-red-500/30 rounded hover:bg-red-600 hover:text-white transition"
                            >
                              Delete
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default UserDashboard
