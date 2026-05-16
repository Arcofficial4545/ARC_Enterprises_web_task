import { calculateTotalPrice, hasAffordableCourses, areAllCoursesInStock } from '../../utils/filters'

const CourseStats = ({ courses }) => {
  const total = courses.length
  const totalPrice = calculateTotalPrice(courses)
  const hasAffordable = hasAffordableCourses(courses, 300)
  const allInStock = areAllCoursesInStock(courses)

  return (
    <div className="glass p-6 rounded-lg mb-8">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div>
          <p className="text-cream text-sm mb-1">Total Courses</p>
          <p className="text-accent text-2xl font-heading">{total}</p>
        </div>
        <div>
          <p className="text-cream text-sm mb-1">Total Value</p>
          <p className="text-accent text-2xl font-heading">${totalPrice}</p>
        </div>
        <div>
          <p className="text-cream text-sm mb-1">Affordable Options</p>
          <p className="text-accent text-2xl font-heading">{hasAffordable ? 'Yes' : 'No'}</p>
        </div>
        <div>
          <p className="text-cream text-sm mb-1">All Available</p>
          <p className="text-accent text-2xl font-heading">{allInStock ? 'Yes' : 'No'}</p>
        </div>
      </div>
    </div>
  )
}

export default CourseStats
