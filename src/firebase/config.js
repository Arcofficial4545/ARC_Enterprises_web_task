import { initializeApp } from 'firebase/app'
import { getAuth } from 'firebase/auth'
import { getFirestore } from 'firebase/firestore'

const firebaseConfig = {
  apiKey: "AIzaSyCZTi2I9U1RJnvW8JvXBZtzvpOvrq90dMs",
  authDomain: "web-lab-a3ad9.firebaseapp.com",
  projectId: "web-lab-a3ad9",
  storageBucket: "web-lab-a3ad9.firebasestorage.app",
  messagingSenderId: "323174393347",
  appId: "1:323174393347:web:02d94f0536adf0b5069036",
  measurementId: "G-FQHZ0GQ2DX"
}

export const app = initializeApp(firebaseConfig)
export const auth = getAuth(app)
export const db = getFirestore(app)
