const CourseCard = ({ course, onEdit, onDelete }) => {
  return (
    <div className="glass rounded-lg overflow-hidden hover:scale-105 transition duration-300">
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
          {onEdit && onDelete && (
            <div className="flex gap-2">
              <button 
                onClick={() => onEdit(course)}
                className="px-4 py-2 glass rounded text-accent hover:bg-accent hover:text-primary transition"
              >
                Edit
              </button>
              <button 
                onClick={() => onDelete(course.id)}
                className="px-4 py-2 bg-accent text-primary rounded hover:opacity-90 transition"
              >
                Delete
              </button>
            </div>
          )}
          {!onEdit && !onDelete && (
            <button className="px-4 py-2 bg-accent text-primary rounded hover:opacity-90 transition">
              Enroll Now
            </button>
          )}
        </div>
      </div>
    </div>
  )
}

export default CourseCard
