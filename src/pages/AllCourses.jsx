import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { collection, getDocs, deleteDoc, doc } from 'firebase/firestore'
import { db } from '../firebase/config'
import { withTimeout } from '../utils/firestoreHelpers'

const COLLECTION = 'courses'

const AllCourses = () => {
  const [courses, setCourses] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    fetchCourses()
  }, [])

  const fetchCourses = async () => {
    try {
      setLoading(true)
      const snapshot = await withTimeout(getDocs(collection(db, COLLECTION)))
      const items = snapshot.docs.map(d => ({ id: d.id, ...d.data() }))
      setCourses(items)
    } catch (err) {
      setError(err.message || 'Failed to load courses. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this course?')) return
    try {
      await withTimeout(deleteDoc(doc(db, COLLECTION, id)))
      setCourses(prev => prev.filter(c => c.id !== id))
    } catch (err) {
      alert(err.message || 'Failed to delete course. Please try again.')
    }
  }

  if (loading) {
    return (
      <div className="pt-24 pb-16 px-4">
        <div className="max-w-7xl mx-auto text-center">
          <p className="text-cream text-lg">Loading courses from Firestore...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="pt-24 pb-16 px-4">
        <div className="max-w-7xl mx-auto text-center">
          <p className="text-red-400 text-lg mb-4">{error}</p>
          <button
            onClick={fetchCourses}
            className="px-6 py-3 bg-accent text-primary rounded hover:opacity-90 transition font-semibold"
          >
            Retry
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="pt-24 pb-16 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-4xl font-heading text-accent">All Courses</h1>
          <Link
            to="/courses/create"
            className="px-6 py-2 bg-accent text-primary rounded hover:opacity-90 transition font-semibold"
          >
            + Add New Course
          </Link>
        </div>

        {courses.length === 0 ? (
          <div className="text-center py-16">
            <p className="text-cream text-lg mb-4">No courses in Firestore yet.</p>
            <Link
              to="/courses/create"
              className="px-6 py-3 bg-accent text-primary rounded hover:opacity-90 transition font-semibold"
            >
              Create Your First Course
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {courses.map(course => (
              <div key={course.id} className="glass rounded-lg overflow-hidden hover:scale-105 transition duration-300">
                <div className="h-48 bg-gradient-to-br from-accent to-secondary" />
                <div className="p-6">
                  <h3 className="text-2xl font-heading text-accent mb-2">{course.name}</h3>
                  <p className="text-cream mb-2">
                    <strong>Category:</strong> {course.category}
                  </p>
                  <p className="text-cream mb-2">
                    <strong>Instructor:</strong> {course.instructor}
                  </p>
                  <p className="text-cream mb-2">
                    <strong>Duration:</strong> {course.duration}
                  </p>
                  <p className="text-cream mb-4">
                    <strong>Status:</strong> {course.inStock ? 'Available' : 'Coming Soon'}
                  </p>
                  <div className="flex justify-between items-center">
                    <span className="text-accent font-semibold text-xl">${course.price}</span>
                    <div className="flex gap-2">
                      <Link
                        to={`/courses/${course.id}`}
                        className="px-4 py-2 glass rounded text-accent hover:bg-accent hover:text-primary transition"
                      >
                        View
                      </Link>
                      <button
                        onClick={() => handleDelete(course.id)}
                        className="px-4 py-2 bg-red-600 text-white rounded hover:opacity-90 transition"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export default AllCourses
