import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { addDoc, collection, serverTimestamp } from 'firebase/firestore'
import { db } from '../firebase/config'
import { withTimeout } from '../utils/firestoreHelpers'

const COLLECTION = 'courses'

const CreateCourse = () => {
  const navigate = useNavigate()

  const [formData, setFormData] = useState({
    name: '',
    category: 'fintech',
    price: '',
    instructor: '',
    duration: '',
    inStock: true
  })
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState(null)

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError(null)

    if (!formData.name.trim() || !formData.instructor.trim() || !formData.duration.trim()) {
      setError('Please fill in all required fields.')
      return
    }

    setSubmitting(true)
    try {
      await withTimeout(addDoc(collection(db, COLLECTION), {
        name: formData.name.trim(),
        category: formData.category,
        price: parseFloat(formData.price) || 0,
        instructor: formData.instructor.trim(),
        duration: formData.duration.trim(),
        inStock: formData.inStock,
        createdAt: serverTimestamp()
      }))
      navigate('/courses')
    } catch (err) {
      setError(err.message || 'Failed to create course. Please try again.')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="pt-24 pb-16 px-4">
      <div className="max-w-3xl mx-auto">
        <div className="glass p-8 rounded-lg">
          <h1 className="text-4xl font-heading text-accent mb-6">Create New Course</h1>
          <p className="text-cream mb-6">Fill out the form below to add a new course to Firestore.</p>

          {error && (
            <div className="mb-4 p-3 rounded-lg text-red-400 border border-red-400">
              {error}
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
            <button
              type="submit"
              disabled={submitting}
              className="px-6 py-3 bg-accent text-primary rounded hover:opacity-90 transition font-semibold disabled:opacity-50"
            >
              {submitting ? 'Creating...' : 'Create Course'}
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}

export default CreateCourse
