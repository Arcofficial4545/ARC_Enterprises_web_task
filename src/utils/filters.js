export const filterByCategory = (courses, category) => {
  if (!category || category === 'all') return courses
  return courses.filter(course => course.category === category)
}

export const filterBySearch = (courses, searchTerm) => {
  if (!searchTerm) return courses
  const normalized = searchTerm.toLowerCase().trim()
  return courses.filter(course => 
    course.name.toLowerCase().includes(normalized)
  )
}

export const sortCoursesByPrice = (courses, ascending = true) => {
  return [...courses].sort((a, b) => 
    ascending ? a.price - b.price : b.price - a.price
  )
}

export const sortCoursesByName = (courses, ascending = true) => {
  return [...courses].sort((a, b) => {
    const nameA = a.name.toLowerCase()
    const nameB = b.name.toLowerCase()
    if (ascending) {
      return nameA < nameB ? -1 : nameA > nameB ? 1 : 0
    }
    return nameA > nameB ? -1 : nameA < nameB ? 1 : 0
  })
}

export const calculateTotalPrice = (courses) => {
  return courses.reduce((total, course) => total + course.price, 0)
}

export const hasAffordableCourses = (courses, maxPrice) => {
  return courses.some(course => course.price <= maxPrice)
}

export const areAllCoursesInStock = (courses) => {
  return courses.every(course => course.inStock === true)
}
