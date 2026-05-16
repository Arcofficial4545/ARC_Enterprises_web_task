import { useState, useEffect, useRef } from 'react'
import { Link, useParams, useNavigate } from 'react-router-dom'
import { doc, getDoc, updateDoc, serverTimestamp } from 'firebase/firestore'
import { db } from '../firebase/config'
import { withTimeout } from '../utils/firestoreHelpers'

const COLLECTION = 'courses'

const EditCourse = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const dataLoaded = useRef(false)

  const [formData, setFormData] = useState({
    name: '',
    category: 'fintech',
    price: '',
    instructor: '',
    duration: '',
    inStock: true
  })
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [submitting, setSubmitting] = useState(false)
  const [submitError, setSubmitError] = useState(null)

  useEffect(() => {
    if (!id) return
    const fetchCourse = async () => {
      try {
        const ref = doc(db, COLLECTION, id)
        const snapshot = await withTimeout(getDoc(ref))
        if (!snapshot.exists()) {
          setError('Course not found.')
        } else if (!dataLoaded.current) {
          const data = snapshot.data()
          setFormData({
            name: data.name || '',
            category: data.category || 'fintech',
            price: data.price || '',
            instructor: data.instructor || '',
            duration: data.duration || '',
            inStock: data.inStock !== undefined ? data.inStock : true
          })
          dataLoaded.current = true
        }
      } catch (err) {
        setError(err.message || 'Failed to load course. Please try again.')
      } finally {
        setLoading(false)
      }
    }
    fetchCourse()
  }, [id])

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSubmitError(null)

    if (!formData.name.trim() || !formData.instructor.trim() || !formData.duration.trim()) {
      setSubmitError('Please fill in all required fields.')
      return
    }

    setSubmitting(true)
    try {
      await withTimeout(updateDoc(doc(db, COLLECTION, id), {
        name: formData.name.trim(),
        category: formData.category,
        price: parseFloat(formData.price) || 0,
        instructor: formData.instructor.trim(),
        duration: formData.duration.trim(),
        inStock: formData.inStock,
        updatedAt: serverTimestamp()
      }))
      navigate(`/courses/${id}`)
    } catch (err) {
      setSubmitError(err.message || 'Failed to update course. Please try again.')
    } finally {
      setSubmitting(false)
    }
  }

  if (loading) {
    return (
      <div className="pt-24 pb-16 px-4">
        <div className="max-w-3xl mx-auto text-center">
          <p className="text-cream text-lg">Loading course...</p>
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

  return (
    <div className="pt-24 pb-16 px-4">
      <div className="max-w-3xl mx-auto">
        <div className="glass p-8 rounded-lg">
          <h1 className="text-4xl font-heading text-accent mb-2">Edit Course</h1>
          <p className="text-cream mb-6">Update the course details below.</p>

          {submitError && (
            <div className="mb-4 p-3 rounded-lg text-red-400 border border-red-400">
              {submitError}
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div>
                <label className="block mb-2 font-medium text-cream">Course Name *</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-2 rounded bg-secondary border border-accent text-cream focus:outline-none focus:ring-2 focus:ring-accent"
                />
              </div>
              <div>
                <label className="block mb-2 font-medium text-cream">Category *</label>
                <select
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-2 rounded bg-secondary border border-accent text-cream focus:outline-none focus:ring-2 focus:ring-accent"
                >
                  <option value="fintech">FinTech</option>
                  <option value="ai">AI & ML</option>
                  <option value="cloud">Cloud</option>
                  <option value="data">Data Science</option>
                  <option value="security">Security</option>
                  <option value="web">Web Development</option>
                  <option value="mobile">Mobile Development</option>
                  <option value="marketing">Marketing</option>
                </select>
              </div>
              <div>
                <label className="block mb-2 font-medium text-cream">Price ($) *</label>
                <input
                  type="number"
                  name="price"
                  value={formData.price}
                  onChange={handleChange}
                  min="0"
                  step="1"
                  required
                  className="w-full px-4 py-2 rounded bg-secondary border border-accent text-cream focus:outline-none focus:ring-2 focus:ring-accent"
                />
              </div>
              <div>
                <label className="block mb-2 font-medium text-cream">Instructor *</label>
                <input
                  type="text"
                  name="instructor"
                  value={formData.instructor}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-2 rounded bg-secondary border border-accent text-cream focus:outline-none focus:ring-2 focus:ring-accent"
                />
              </div>
              <div>
                <label className="block mb-2 font-medium text-cream">Duration *</label>
                <input
                  type="text"
                  name="duration"
                  value={formData.duration}
                  onChange={handleChange}
                  placeholder="e.g., 12 weeks"
                  required
                  className="w-full px-4 py-2 rounded bg-secondary border border-accent text-cream focus:outline-none focus:ring-2 focus:ring-accent"
                />
              </div>
              <div className="flex items-center">
                <label className="flex items-center gap-2 text-cream cursor-pointer">
                  <input
                    type="checkbox"
                    name="inStock"
                    checked={formData.inStock}
                    onChange={handleChange}
                    className="w-5 h-5"
                  />
                  Available
                </label>
              </div>
            </div>
            <div className="flex gap-3">
              <button
                type="submit"
                disabled={submitting}
                className="px-6 py-3 bg-accent text-primary rounded hover:opacity-90 transition font-semibold disabled:opacity-50"
              >
                {submitting ? 'Updating...' : 'Update Course'}
              </button>
              <Link
                to={`/courses/${id}`}
                className="px-6 py-3 glass rounded text-accent hover:bg-accent hover:text-primary transition font-semibold text-center"
              >
                Cancel
              </Link>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}

export default EditCourse
