import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { collection, getDocs, doc, updateDoc, deleteDoc } from 'firebase/firestore'
import { db } from '../firebase/config'
import { useAuth } from '../context/AuthContext'
import { useCourses } from '../context/CourseContext'

const AdminDashboard = () => {
  const { currentUser } = useAuth()
  const { courses, seedCourses } = useCourses()
  
  const [users, setUsers] = useState([])
  const [loadingUsers, setLoadingUsers] = useState(true)
  const [error, setError] = useState('')
  const [seedStatus, setSeedStatus] = useState('')

  useEffect(() => {
    fetchUsers()
  }, [])

  const fetchUsers = async () => {
    try {
      setLoadingUsers(true)
      const snapshot = await getDocs(collection(db, 'users'))
      const usersList = snapshot.docs.map(d => ({ id: d.id, ...d.data() }))
      setUsers(usersList)
    } catch (err) {
      console.error(err)
      setError('Failed to load users list.')
    } finally {
      setLoadingUsers(false)
    }
  }

  const handleToggleRole = async (userId, currentRole) => {
    const newRole = currentRole === 'admin' ? 'user' : 'admin'
    try {
      await updateDoc(doc(db, 'users', userId), { role: newRole })
      setUsers(prev => prev.map(u => u.id === userId ? { ...u, role: newRole } : u))
    } catch (err) {
      alert('Failed to update user role.')
    }
  }

  const handleDeleteUser = async (userId) => {
    if (!window.confirm('Are you sure you want to delete this user document? (This only deletes their profile record in Firestore)')) return
    try {
      await deleteDoc(doc(db, 'users', userId))
      setUsers(prev => prev.filter(u => u.id !== userId))
    } catch (err) {
      alert('Failed to delete user document.')
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

  const handleSeed = async (force = false) => {
    try {
      setSeedStatus('Seeding...')
      const seeded = await seedCourses(force)
      if (seeded) {
        setSeedStatus('Sample data successfully seeded!')
        fetchUsers() // Refresh list if a user was added
      } else {
        setSeedStatus('Database is already seeded.')
      }
    } catch (err) {
      setSeedStatus('Failed to seed: ' + err.message)
    }
  }

  // Calculate analytics
  const totalUsers = users.length
  const adminCount = users.filter(u => u.role === 'admin').length
  const normalCount = users.filter(u => u.role === 'user').length
  const totalCourses = courses.length
  
  const courseValuation = courses.reduce((acc, c) => acc + (parseFloat(c.price) || 0), 0)
  const averagePrice = totalCourses > 0 ? (courseValuation / totalCourses).toFixed(2) : 0

  const categories = courses.reduce((acc, c) => {
    acc[c.category] = (acc[c.category] || 0) + 1
    return acc
  }, {})

  return (
    <div className="pt-24 pb-16 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8 flex-wrap gap-4">
          <div>
            <h1 className="text-4xl font-heading text-accent">Admin Control Panel</h1>
            <p className="text-cream/80">Manage application users, courses, and review site-wide analytics.</p>
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => handleSeed(false)}
              className="px-4 py-2 glass text-accent rounded hover:bg-accent hover:text-primary transition font-semibold text-sm"
            >
              Seed Empty DB
            </button>
            <button
              onClick={() => handleSeed(true)}
              className="px-4 py-2 bg-red-600/30 text-red-200 border border-red-500/50 rounded hover:bg-red-600 hover:text-white transition font-semibold text-sm"
            >
              Reset & Force Seed
            </button>
          </div>
        </div>

        {seedStatus && (
          <div className="mb-6 p-3 bg-accent/20 border border-accent rounded text-accent text-sm">
            {seedStatus}
          </div>
        )}

        {/* Analytics Grid */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-10">
          <div className="glass p-6 rounded-lg">
            <h3 className="text-cream/60 text-sm mb-1 uppercase tracking-wider font-semibold">Total Registered Users</h3>
            <p className="text-4xl font-heading text-accent">{totalUsers}</p>
            <p className="text-xs text-cream/70 mt-2">
              <span className="text-accent font-semibold">{adminCount}</span> Admins / <span className="text-accent font-semibold">{normalCount}</span> Users
            </p>
          </div>
          <div className="glass p-6 rounded-lg">
            <h3 className="text-cream/60 text-sm mb-1 uppercase tracking-wider font-semibold">Total Catalog Courses</h3>
            <p className="text-4xl font-heading text-accent">{totalCourses}</p>
            <p className="text-xs text-cream/70 mt-2">Active listings in Firestore</p>
          </div>
          <div className="glass p-6 rounded-lg">
            <h3 className="text-cream/60 text-sm mb-1 uppercase tracking-wider font-semibold">Catalog Total Value</h3>
            <p className="text-4xl font-heading text-accent">${courseValuation}</p>
            <p className="text-xs text-cream/70 mt-2">Combined price of all listings</p>
          </div>
          <div className="glass p-6 rounded-lg">
            <h3 className="text-cream/60 text-sm mb-1 uppercase tracking-wider font-semibold">Average Course Price</h3>
            <p className="text-4xl font-heading text-accent">${averagePrice}</p>
            <p className="text-xs text-cream/70 mt-2">Valuation divided by listings</p>
          </div>
        </div>

        {/* Categories Breakdown */}
        <div className="glass p-6 rounded-lg mb-10">
          <h2 className="text-2xl font-heading text-accent mb-4">Course Categories Distribution</h2>
          <div className="flex gap-4 flex-wrap">
            {Object.keys(categories).map(cat => (
              <div key={cat} className="px-4 py-2 rounded bg-secondary border border-accent/30 text-cream text-sm">
                <span className="font-semibold text-accent uppercase">{cat}:</span> {categories[cat]}
              </div>
            ))}
            {Object.keys(categories).length === 0 && (
              <p className="text-cream/60 text-sm">No course categories found.</p>
            )}
          </div>
        </div>

        {/* User Management Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="glass p-6 rounded-lg">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-heading text-accent">User Directory</h2>
              <button onClick={fetchUsers} className="text-accent hover:underline text-sm font-semibold">Refresh</button>
            </div>
            
            {loadingUsers ? (
              <p className="text-cream/70">Loading users...</p>
            ) : error ? (
              <p className="text-red-400">{error}</p>
            ) : users.length === 0 ? (
              <p className="text-cream/60">No user documents found in Firestore.</p>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm">
                  <thead>
                    <tr className="border-b border-accent/20 text-accent font-semibold">
                      <th className="py-2">User Details</th>
                      <th className="py-2">Role</th>
                      <th className="py-2 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {users.map(u => (
                      <tr key={u.id} className="border-b border-accent/10 hover:bg-cream/5 transition">
                        <td className="py-3">
                          <p className="text-cream font-medium">{u.name}</p>
                          <p className="text-cream/60 text-xs">{u.email}</p>
                        </td>
                        <td className="py-3">
                          <span className={`px-2 py-0.5 rounded text-xs font-semibold ${u.role === 'admin' ? 'bg-accent text-primary' : 'bg-secondary text-cream border border-accent/40'}`}>
                            {u.role}
                          </span>
                        </td>
                        <td className="py-3 text-right">
                          <button
                            onClick={() => handleToggleRole(u.id, u.role)}
                            disabled={u.id === currentUser?.uid}
                            className="px-2.5 py-1 text-xs glass rounded text-accent hover:bg-accent hover:text-primary transition mr-1 disabled:opacity-50 disabled:cursor-not-allowed"
                          >
                            Toggle Role
                          </button>
                          <button
                            onClick={() => handleDeleteUser(u.id)}
                            disabled={u.id === currentUser?.uid}
                            className="px-2.5 py-1 text-xs bg-red-600/20 text-red-400 border border-red-500/30 rounded hover:bg-red-600 hover:text-white transition disabled:opacity-50 disabled:cursor-not-allowed"
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

          {/* Catalog Operations Section */}
          <div className="glass p-6 rounded-lg">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-heading text-accent">Global Course Catalog Management</h2>
              <Link to="/courses/create" className="text-accent hover:underline text-sm font-semibold">+ Add Course</Link>
            </div>
            
            {courses.length === 0 ? (
              <p className="text-cream/60 text-sm">No courses listed in Firestore.</p>
            ) : (
              <div className="max-h-[450px] overflow-y-auto pr-1">
                <table className="w-full text-left text-sm">
                  <thead>
                    <tr className="border-b border-accent/20 text-accent font-semibold">
                      <th className="py-2">Course Name</th>
                      <th className="py-2">Instructor</th>
                      <th className="py-2 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {courses.map(c => (
                      <tr key={c.id} className="border-b border-accent/10 hover:bg-cream/5 transition">
                        <td className="py-3">
                          <p className="text-cream font-medium">{c.name}</p>
                          <p className="text-cream/60 text-xs">${c.price} | {c.category}</p>
                        </td>
                        <td className="py-3 text-cream/70 text-xs">
                          {c.instructor}
                        </td>
                        <td className="py-3 text-right flex justify-end gap-1.5 items-center">
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
  )
}

export default AdminDashboard
