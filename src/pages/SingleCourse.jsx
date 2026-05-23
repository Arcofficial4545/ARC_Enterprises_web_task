import { useState, useEffect } from 'react'
import { Link, useParams, useNavigate } from 'react-router-dom'
import { doc, getDoc, deleteDoc } from 'firebase/firestore'
import { db } from '../firebase/config'
import { withTimeout } from '../utils/firestoreHelpers'
import { useAuth } from '../context/AuthContext'

const COLLECTION = 'courses'

const SingleCourse = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const { currentUser } = useAuth()
  const [course, setCourse] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    if (!id) return
    const fetchCourse = async () => {
      try {
        const ref = doc(db, COLLECTION, id)
        const snapshot = await withTimeout(getDoc(ref))
        if (!snapshot.exists()) {
          setError('Course not found.')
        } else {
          setCourse({ id: snapshot.id, ...snapshot.data() })
        }
      } catch (err) {
        setError(err.message || 'Failed to load course. Please try again.')
      } finally {
        setLoading(false)
      }
    }
    fetchCourse()
  }, [id])

  const handleDelete = async () => {
    if (!currentUser) {
      navigate('/auth/login')
      return
    }
    const isOwner = course?.userId === currentUser.uid
    const isAdmin = currentUser.role === 'admin'
    if (!isOwner && !isAdmin) {
      alert('Unauthorized. You do not have permission to delete this course.')
      return
    }

    if (!window.confirm('Are you sure you want to delete this course?')) return
    try {
      await withTimeout(deleteDoc(doc(db, COLLECTION, id)))
      navigate('/courses')
    } catch (err) {
      alert(err.message || 'Failed to delete course. Please try again.')
    }
  }

  if (loading) {
    return (
      <div className="pt-24 pb-16 px-4">
        <div className="max-w-3xl mx-auto text-center">
          <p className="text-cream text-lg">Loading course details...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="pt-24 pb-16 px-4">
        <div className="max-w-3xl mx-auto text-center">
          <p className="text-red-400 text-lg mb-4">{error}</p>
          <Link
            to="/courses"
            className="px-6 py-3 bg-accent text-primary rounded hover:opacity-90 transition font-semibold"
          >
            Back to Courses
          </Link>
        </div>
      </div>
    )
  }

  if (!course) return null

  return (
    <div className="pt-24 pb-16 px-4">
      <div className="max-w-3xl mx-auto">
        <div className="glass rounded-lg overflow-hidden">
          <div className="h-56 bg-gradient-to-br from-accent to-secondary" />
          <div className="p-8">
            <h1 className="text-4xl font-heading text-accent mb-4">{course.name}</h1>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              <div className="glass p-4 rounded-lg">
                <p className="text-sm text-accent mb-1">Category</p>
                <p className="text-cream text-lg">{course.category}</p>
              </div>
              <div className="glass p-4 rounded-lg">
                <p className="text-sm text-accent mb-1">Price</p>
                <p className="text-cream text-lg">${course.price}</p>
              </div>
              <div className="glass p-4 rounded-lg">
                <p className="text-sm text-accent mb-1">Instructor</p>
                <p className="text-cream text-lg">{course.instructor}</p>
              </div>
              <div className="glass p-4 rounded-lg">
                <p className="text-sm text-accent mb-1">Duration</p>
                <p className="text-cream text-lg">{course.duration}</p>
              </div>
              <div className="glass p-4 rounded-lg">
                <p className="text-sm text-accent mb-1">Status</p>
                <p className="text-cream text-lg">{course.inStock ? 'Available' : 'Coming Soon'}</p>
              </div>
              {course.createdAt && (
                <div className="glass p-4 rounded-lg">
                  <p className="text-sm text-accent mb-1">Created</p>
                  <p className="text-cream text-lg">
                    {course.createdAt.toDate ? course.createdAt.toDate().toLocaleDateString() : 'N/A'}
                  </p>
                </div>
              )}
            </div>

            {course.updatedAt && (
              <p className="text-sm text-cream mb-4">
                Last updated: {course.updatedAt.toDate ? course.updatedAt.toDate().toLocaleDateString() : 'N/A'}
              </p>
            )}

            <div className="flex gap-3 mt-6">
              {currentUser && (currentUser.role === 'admin' || currentUser.uid === course.userId) && (
                <>
                  <Link
                    to={`/courses/${id}/edit`}
                    className="px-6 py-2 bg-accent text-primary rounded hover:opacity-90 transition font-semibold"
                  >
                    Edit
                  </Link>
                  <button
                    onClick={handleDelete}
                    className="px-6 py-2 bg-red-600 text-white rounded hover:opacity-90 transition font-semibold"
                  >
                    Delete
                  </button>
                </>
              )}
              <Link
                to="/courses"
                className="px-6 py-2 glass rounded text-accent hover:bg-accent hover:text-primary transition font-semibold"
              >
                Back to Courses
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default SingleCourse
