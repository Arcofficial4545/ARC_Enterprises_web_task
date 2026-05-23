import { Routes, Route, Navigate } from 'react-router-dom'
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
import AllCourses from './pages/AllCourses'
import CreateCourse from './pages/CreateCourse'
import SingleCourse from './pages/SingleCourse'
import EditCourse from './pages/EditCourse'
import AdminDashboard from './pages/AdminDashboard'
import UserDashboard from './pages/UserDashboard'
import ChatPage from './pages/ChatPage'
import ProtectedRoute from './components/routes/ProtectedRoute'
import AdminRoute from './components/routes/AdminRoute'

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
              
              {/* Courses Catalogue (Public read) */}
              <Route path="/courses" element={<AllCourses />} />
              <Route path="/courses/:id" element={<SingleCourse />} />
              
              {/* Secured CRUD Routes */}
              <Route path="/courses/create" element={
                <ProtectedRoute>
                  <CreateCourse />
                </ProtectedRoute>
              } />
              <Route path="/courses/:id/edit" element={
                <ProtectedRoute>
                  <EditCourse />
                </ProtectedRoute>
              } />

              {/* Chat & Dashboard Pages (Secured) */}
              <Route path="/chat" element={
                <ProtectedRoute>
                  <ChatPage />
                </ProtectedRoute>
              } />
              <Route path="/dashboard/admin" element={
                <AdminRoute>
                  <AdminDashboard />
                </AdminRoute>
              } />
              <Route path="/dashboard/user" element={
                <ProtectedRoute>
                  <UserDashboard />
                </ProtectedRoute>
              } />

              {/* Manage redirect */}
              <Route path="/manage" element={
                <ProtectedRoute>
                  <Navigate to="/dashboard/user" replace />
                </ProtectedRoute>
              } />

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
