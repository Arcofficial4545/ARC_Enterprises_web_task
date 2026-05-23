import { createContext, useContext, useState, useEffect } from 'react'
import { 
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  updateProfile,
  signInWithPopup,
  sendPasswordResetEmail,
  deleteUser
} from 'firebase/auth'
import { doc, setDoc, getDoc, deleteDoc, serverTimestamp } from 'firebase/firestore'
import { auth, db, googleProvider } from '../firebase/config'

const AuthContext = createContext()

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider')
  }
  return context
}

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const signup = async (email, password, displayName, role = 'user') => {
    try {
      setError(null)
      const userCredential = await createUserWithEmailAndPassword(auth, email, password)
      const user = userCredential.user
      
      if (displayName) {
        await updateProfile(user, { displayName })
      }
      
      // Store user info in Firestore users collection
      await setDoc(doc(db, 'users', user.uid), {
        uid: user.uid,
        name: displayName || user.email.split('@')[0],
        email: user.email,
        role: role,
        createdAt: serverTimestamp()
      })
      
      return user
    } catch (err) {
      setError(err.message)
      throw err
    }
  }

  const login = async (email, password) => {
    try {
      setError(null)
      const userCredential = await signInWithEmailAndPassword(auth, email, password)
      return userCredential.user
    } catch (err) {
      setError(err.message)
      throw err
    }
  }

  const loginWithGoogle = async () => {
    try {
      setError(null)
      const result = await signInWithPopup(auth, googleProvider)
      const user = result.user
      
      // Check if user record exists in Firestore
      const userDocRef = doc(db, 'users', user.uid)
      const userDoc = await getDoc(userDocRef)
      
      if (!userDoc.exists()) {
        // Create new user profile document
        await setDoc(userDocRef, {
          uid: user.uid,
          name: user.displayName || user.email.split('@')[0],
          email: user.email,
          role: 'user', // Default role for social login
          createdAt: serverTimestamp()
        })
      }
      return user
    } catch (err) {
      setError(err.message)
      throw err
    }
  }

  const resetPassword = async (email) => {
    try {
      setError(null)
      await sendPasswordResetEmail(auth, email)
    } catch (err) {
      setError(err.message)
      throw err
    }
  }

  const deleteAccount = async () => {
    try {
      setError(null)
      const user = auth.currentUser
      if (!user) throw new Error('No user is currently logged in.')
      
      const uid = user.uid
      // Delete user document in Firestore users collection
      await deleteDoc(doc(db, 'users', uid))
      
      // Delete user authentication credentials
      await deleteUser(user)
    } catch (err) {
      setError(err.message)
      throw err
    }
  }

  const logout = async () => {
    try {
      setError(null)
      await signOut(auth)
    } catch (err) {
      setError(err.message)
      throw err
    }
  }

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        try {
          // Fetch user role from Firestore
          const userDoc = await getDoc(doc(db, 'users', user.uid))
          if (userDoc.exists()) {
            const userData = userDoc.data()
            setCurrentUser({
              ...user,
              displayName: userData.name || user.displayName,
              role: userData.role || 'user',
              createdAt: userData.createdAt
            })
          } else {
            // Fallback if auth exists but no doc yet
            setCurrentUser({
              ...user,
              role: 'user'
            })
          }
        } catch (err) {
          console.error("Error fetching user data from Firestore:", err)
          setCurrentUser({
            ...user,
            role: 'user'
          })
        }
      } else {
        setCurrentUser(null)
      }
      setLoading(false)
    })

    return unsubscribe
  }, [])

  const value = {
    currentUser,
    signup,
    login,
    loginWithGoogle,
    resetPassword,
    deleteAccount,
    logout,
    error,
    loading
  }

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  )
}
