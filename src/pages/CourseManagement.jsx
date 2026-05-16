import { useState, useMemo } from 'react'
import { useCourses } from '../context/CourseContext'
import CourseForm from '../components/courses/CourseForm'
import CourseCard from '../components/courses/CourseCard'
import CourseFilters from '../components/courses/CourseFilters'
import CourseStats from '../components/courses/CourseStats'
import { filterByCategory, filterBySearch, sortCoursesByPrice, sortCoursesByName } from '../utils/filters'

const CourseManagement = () => {
  const { courses, createCourse, updateCourse, deleteCourse } = useCourses()
  const [editingCourse, setEditingCourse] = useState(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [category, setCategory] = useState('all')
  const [sortBy, setSortBy] = useState('name-asc')

  const filteredCourses = useMemo(() => {
    let result = [...courses]
    
    result = filterByCategory(result, category)
    result = filterBySearch(result, searchTerm)
    
    if (sortBy === 'price-asc') {
      result = sortCoursesByPrice(result, true)
    } else if (sortBy === 'price-desc') {
      result = sortCoursesByPrice(result, false)
    } else if (sortBy === 'name-asc') {
      result = sortCoursesByName(result, true)
    } else if (sortBy === 'name-desc') {
      result = sortCoursesByName(result, false)
    }
    
    return result
  }, [courses, searchTerm, category, sortBy])

  const handleSubmit = (courseData) => {
    if (editingCourse) {
      updateCourse(editingCourse.id, courseData)
      setEditingCourse(null)
    } else {
      createCourse(courseData)
    }
  }

  const handleEdit = (course) => {
    setEditingCourse(course)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const handleDelete = (id) => {
    if (window.confirm('Are you sure you want to delete this course?')) {
      deleteCourse(id)
    }
  }

  const handleCancel = () => {
    setEditingCourse(null)
  }

  return (
    <div className="pt-24 pb-16 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="glass p-8 rounded-lg mb-8">
          <h2 className="text-4xl font-heading text-accent mb-6">
            {editingCourse ? 'Edit Course' : 'Course Management Dashboard'}
          </h2>
          <CourseForm 
            course={editingCourse} 
            onSubmit={handleSubmit}
            onCancel={editingCourse ? handleCancel : null}
          />
        </div>

        <CourseFilters
          searchTerm={searchTerm}
          category={category}
          sortBy={sortBy}
          onSearchChange={setSearchTerm}
          onCategoryChange={setCategory}
          onSortChange={setSortBy}
        />

        <CourseStats courses={filteredCourses} />

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredCourses.length === 0 ? (
            <p className="text-cream text-center col-span-full">No courses found</p>
          ) : (
            filteredCourses.map(course => (
              <CourseCard
                key={course.id}
                course={course}
                onEdit={handleEdit}
                onDelete={handleDelete}
              />
            ))
          )}
        </div>
      </div>
    </div>
  )
}

export default CourseManagement
