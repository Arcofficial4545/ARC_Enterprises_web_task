import { createContext, useContext, useState } from 'react'
import { coursesDB } from '../data/courses'

const CourseContext = createContext()

export const useCourses = () => {
  const context = useContext(CourseContext)
  if (!context) {
    throw new Error('useCourses must be used within CourseProvider')
  }
  return context
}

export const CourseProvider = ({ children }) => {
  const [courses, setCourses] = useState([...coursesDB])

  const createCourse = (course) => {
    const newCourse = {
      id: courses.length > 0 ? Math.max(...courses.map(c => c.id)) + 1 : 1,
      ...course
    }
    setCourses(prev => [...prev, newCourse])
    return newCourse
  }

  const updateCourse = (id, updates) => {
    setCourses(prev => prev.map(course => 
      course.id === id ? { ...course, ...updates } : course
    ))
  }

  const deleteCourse = (id) => {
    setCourses(prev => prev.filter(course => course.id !== id))
  }

  const resetCourses = () => {
    setCourses([...coursesDB])
  }

  return (
    <CourseContext.Provider value={{ 
      courses, 
      createCourse, 
      updateCourse, 
      deleteCourse, 
      resetCourses 
    }}>
      {children}
    </CourseContext.Provider>
  )
}
