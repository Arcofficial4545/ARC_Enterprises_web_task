import { createContext, useContext, useState, useEffect } from 'react'
import { collection, onSnapshot, query, orderBy, addDoc, getDocs, doc, deleteDoc, writeBatch } from 'firebase/firestore'
import { db } from '../firebase/config'
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
  const [courses, setCourses] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const q = query(collection(db, 'courses'), orderBy('createdAt', 'desc'))
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const items = snapshot.docs.map(d => ({
        id: d.id,
        ...d.data()
      }))
      setCourses(items)
      setLoading(false)
    }, (err) => {
      console.error("Firestore snapshot error:", err)
      setLoading(false)
    })

    return unsubscribe
  }, [])

  const seedCourses = async (force = false) => {
    try {
      const collectionRef = collection(db, 'courses')
      const snapshot = await getDocs(collectionRef)
      
      // Only seed if empty, or if forced
      if (snapshot.size === 0 || force) {
        // If forced, delete existing records first
        if (force && snapshot.size > 0) {
          const batch = writeBatch(db)
          snapshot.docs.forEach((docRef) => {
            batch.delete(docRef.ref)
          })
          await batch.commit()
        }

        // Add initial mock courses
        for (const course of coursesDB) {
          const { id, ...courseData } = course
          await addDoc(collectionRef, {
            ...courseData,
            createdAt: new Date(),
            userId: 'admin-seed',
            ownerEmail: 'admin@arc.com'
          })
        }
        return true
      }
      return false
    } catch (err) {
      console.error("Failed to seed courses:", err)
      throw err
    }
  }

  return (
    <CourseContext.Provider value={{ 
      courses, 
      loading,
      seedCourses
    }}>
      {children}
    </CourseContext.Provider>
  )
}
