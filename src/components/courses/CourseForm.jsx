import { useState, useEffect } from 'react'

const CourseForm = ({ course, onSubmit, onCancel }) => {
  const [formData, setFormData] = useState({
    name: '',
    category: 'fintech',
    price: '',
    instructor: '',
    duration: '',
    inStock: true
  })

  useEffect(() => {
    if (course) {
      setFormData(course)
    }
  }, [course])

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }))
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    onSubmit({
      ...formData,
      price: parseFloat(formData.price)
    })
    setFormData({
      name: '',
      category: 'fintech',
      price: '',
      instructor: '',
      duration: '',
      inStock: true
    })
  }

  return (
    <form onSubmit={handleSubmit} className="mb-8">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-4">
        <div>
          <label className="block mb-2 font-medium text-cream">Course Name</label>
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
          <label className="block mb-2 font-medium text-cream">Category</label>
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
          <label className="block mb-2 font-medium text-cream">Price</label>
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
          <label className="block mb-2 font-medium text-cream">Instructor</label>
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
          <label className="block mb-2 font-medium text-cream">Duration</label>
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
      <div className="flex gap-4">
        <button
          type="submit"
          className="px-6 py-2 bg-accent text-primary rounded hover:opacity-90 transition font-semibold"
        >
          {course ? 'Update Course' : 'Add Course'}
        </button>
        {course && onCancel && (
          <button
            type="button"
            onClick={onCancel}
            className="px-6 py-2 glass rounded text-accent hover:bg-accent hover:text-primary transition"
          >
            Cancel
          </button>
        )}
      </div>
    </form>
  )
}

export default CourseForm
