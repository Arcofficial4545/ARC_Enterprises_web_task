import { Routes, Route } from 'react-router-dom'
import { ThemeProvider } from './context/ThemeContext'
import { CourseProvider } from './context/CourseContext'
import { AuthProvider } from './context/AuthContext'
import Navbar from './components/layouts/Navbar'
import Footer from './components/layouts/Footer'
import HomePage from './components/pages/HomePage'
import AboutPage from './components/pages/AboutPage'
import ContactPage from './components/pages/ContactPage'
import LoginPage from './components/pages/LoginPage'
import RegisterPage from './components/pages/RegisterPage'
import PageNotFound from './components/pages/PageNotFound'
import CourseManagement from './pages/CourseManagement'
import AllCourses from './pages/AllCourses'
import CreateCourse from './pages/CreateCourse'
import SingleCourse from './pages/SingleCourse'
import EditCourse from './pages/EditCourse'

function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <CourseProvider>
          <div className="min-h-screen bg-primary text-cream">
            <Navbar />
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/about" element={<AboutPage />} />
              <Route path="/contact" element={<ContactPage />} />
              <Route path="/auth/login" element={<LoginPage />} />
              <Route path="/auth/register" element={<RegisterPage />} />
              <Route path="/manage" element={<CourseManagement />} />
              <Route path="/courses" element={<AllCourses />} />
              <Route path="/courses/create" element={<CreateCourse />} />
              <Route path="/courses/:id" element={<SingleCourse />} />
              <Route path="/courses/:id/edit" element={<EditCourse />} />
              <Route path="*" element={<PageNotFound />} />
            </Routes>
            <Footer />
          </div>
        </CourseProvider>
      </AuthProvider>
    </ThemeProvider>
  )
}

export default App
