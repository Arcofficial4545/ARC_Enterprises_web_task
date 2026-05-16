import { useState } from 'react'
import { useCourses } from '../../context/CourseContext'

const EnrollmentCalculator = () => {
  const { courses } = useCourses()
  const [selectedCourses, setSelectedCourses] = useState([])
  const [showCheckout, setShowCheckout] = useState(false)

  const availableCourses = courses.filter(course => course.inStock)

  const addCourse = (course) => {
    if (!selectedCourses.find(c => c.id === course.id)) {
      setSelectedCourses(prev => [...prev, { ...course, quantity: 1 }])
    }
  }

  const removeCourse = (courseId) => {
    setSelectedCourses(prev => prev.filter(c => c.id !== courseId))
  }

  const incrementQuantity = (courseId) => {
    setSelectedCourses(prev => prev.map(c => 
      c.id === courseId ? { ...c, quantity: c.quantity + 1 } : c
    ))
  }

  const decrementQuantity = (courseId) => {
    setSelectedCourses(prev => prev.map(c => 
      c.id === courseId && c.quantity > 1 ? { ...c, quantity: c.quantity - 1 } : c
    ))
  }

  const resetCalculator = () => {
    setSelectedCourses([])
    setShowCheckout(false)
  }

  const handleCheckout = () => {
    setShowCheckout(true)
  }

  const confirmEnrollment = () => {
    alert(`Enrollment confirmed!\n\nTotal: $${total.toFixed(2)}\nCourses: ${courseCount}\n\nThank you for enrolling with ARC Enterprises!`)
    resetCalculator()
  }

  const subtotal = selectedCourses.reduce((sum, course) => sum + (course.price * course.quantity), 0)
  const courseCount = selectedCourses.reduce((sum, course) => sum + course.quantity, 0)
  
  const getDiscount = () => {
    if (courseCount >= 5) return 0.20
    if (courseCount >= 3) return 0.15
    if (courseCount >= 2) return 0.10
    return 0
  }

  const discount = getDiscount()
  const discountAmount = subtotal * discount
  const total = subtotal - discountAmount

  return (
    <div className="glass p-8 rounded-lg">
      <h2 className="text-4xl font-heading text-accent mb-6">Enrollment Calculator</h2>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div>
          <h3 className="text-2xl font-heading text-accent mb-4">Available Courses</h3>
          <div className="space-y-3 max-h-96 overflow-y-auto pr-2">
            {availableCourses.length === 0 ? (
              <p className="text-cream">No courses available</p>
            ) : (
              availableCourses.map(course => (
                <div key={course.id} className="glass p-4 rounded flex justify-between items-center">
                  <div>
                    <p className="text-cream font-semibold">{course.name}</p>
                    <p className="text-accent text-sm">${course.price}</p>
                  </div>
                  <button
                    onClick={() => addCourse(course)}
                    disabled={selectedCourses.find(c => c.id === course.id)}
                    className="px-4 py-2 bg-accent text-primary rounded hover:opacity-90 transition disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Add
                  </button>
                </div>
              ))
            )}
          </div>
        </div>

        <div>
          <h3 className="text-2xl font-heading text-accent mb-4">Selected Courses</h3>
          <div className="space-y-3 mb-6">
            {selectedCourses.length === 0 ? (
              <p className="text-cream">No courses selected</p>
            ) : (
              selectedCourses.map(course => (
                <div key={course.id} className="glass p-4 rounded">
                  <div className="flex justify-between items-start mb-2">
                    <div className="flex-1">
                      <p className="text-cream font-semibold">{course.name}</p>
                      <p className="text-accent text-sm">${course.price} per enrollment</p>
                    </div>
                    <button
                      onClick={() => removeCourse(course.id)}
                      className="text-accent hover:text-cream transition"
                    >
                      Remove
                    </button>
                  </div>
                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => decrementQuantity(course.id)}
                      disabled={course.quantity <= 1}
                      className="w-8 h-8 glass rounded flex items-center justify-center text-accent hover:bg-accent hover:text-primary transition disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      -
                    </button>
                    <span className="text-cream w-12 text-center">{course.quantity}</span>
                    <button
                      onClick={() => incrementQuantity(course.id)}
                      className="w-8 h-8 glass rounded flex items-center justify-center text-accent hover:bg-accent hover:text-primary transition"
                    >
                      +
                    </button>
                    <span className="text-cream ml-auto">${(course.price * course.quantity).toFixed(2)}</span>
                  </div>
                </div>
              ))
            )}
          </div>

          <div className="glass p-6 rounded space-y-3">
            <div className="flex justify-between text-cream">
              <span>Subtotal ({courseCount} enrollments)</span>
              <span>${subtotal.toFixed(2)}</span>
            </div>
            {discount > 0 && (
              <div className="flex justify-between text-accent">
                <span>Bulk Discount ({(discount * 100).toFixed(0)}%)</span>
                <span>-${discountAmount.toFixed(2)}</span>
              </div>
            )}
            <div className="border-t border-accent pt-3 flex justify-between text-accent text-xl font-semibold">
              <span>Total</span>
              <span>${total.toFixed(2)}</span>
            </div>
            {courseCount >= 2 && (
              <p className="text-sm text-cream mt-2">
                {courseCount >= 5 ? 'Maximum discount applied!' : 
                 courseCount >= 3 ? 'Add 2 more for 20% off!' : 
                 'Add 1 more for 15% off!'}
              </p>
            )}
          </div>

          <div className="flex gap-3 mt-6">
            <button
              onClick={resetCalculator}
              disabled={selectedCourses.length === 0}
              className="flex-1 px-6 py-3 glass rounded text-accent hover:bg-accent hover:text-primary transition disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Reset
            </button>
            <button
              onClick={handleCheckout}
              disabled={selectedCourses.length === 0}
              className="flex-1 px-6 py-3 bg-accent text-primary rounded hover:opacity-90 transition disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Proceed to Checkout
            </button>
          </div>
        </div>
      </div>

      <div className="mt-6 glass p-4 rounded">
        <h4 className="text-accent font-semibold mb-2">Bulk Enrollment Discounts</h4>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-cream">
          <div>2+ enrollments: 10% off</div>
          <div>3+ enrollments: 15% off</div>
          <div>5+ enrollments: 20% off</div>
        </div>
      </div>

      {showCheckout && (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4">
          <div className="glass p-8 rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <h3 className="text-3xl font-heading text-accent mb-6">Checkout Summary</h3>
            
            <div className="space-y-4 mb-6">
              <h4 className="text-xl font-heading text-accent">Enrolled Courses</h4>
              {selectedCourses.map(course => (
                <div key={course.id} className="glass p-4 rounded flex justify-between items-center">
                  <div>
                    <p className="text-cream font-semibold">{course.name}</p>
                    <p className="text-accent text-sm">Quantity: {course.quantity}</p>
                  </div>
                  <p className="text-accent font-semibold">${(course.price * course.quantity).toFixed(2)}</p>
                </div>
              ))}
            </div>

            <div className="glass p-6 rounded space-y-3 mb-6">
              <div className="flex justify-between text-cream">
                <span>Subtotal</span>
                <span>${subtotal.toFixed(2)}</span>
              </div>
              {discount > 0 && (
                <div className="flex justify-between text-accent">
                  <span>Bulk Discount ({(discount * 100).toFixed(0)}%)</span>
                  <span>-${discountAmount.toFixed(2)}</span>
                </div>
              )}
              <div className="border-t border-accent pt-3 flex justify-between text-accent text-2xl font-semibold">
                <span>Total Amount</span>
                <span>${total.toFixed(2)}</span>
              </div>
            </div>

            <div className="glass p-4 rounded mb-6">
              <p className="text-cream text-sm">
                By confirming, you agree to enroll in {courseCount} course{courseCount > 1 ? 's' : ''} with ARC Enterprises. 
                You will receive access credentials via email within 24 hours.
              </p>
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => setShowCheckout(false)}
                className="flex-1 px-6 py-3 glass rounded text-accent hover:bg-accent hover:text-primary transition"
              >
                Go Back
              </button>
              <button
                onClick={confirmEnrollment}
                className="flex-1 px-6 py-3 bg-accent text-primary rounded hover:opacity-90 transition"
              >
                Confirm Enrollment
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default EnrollmentCalculator
