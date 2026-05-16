import { Link } from 'react-router-dom'

export default function PageNotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-primary">
      <div className="text-center px-4">
        <h1 className="text-9xl font-heading font-bold text-accent mb-4">404</h1>
        <h2 className="text-3xl font-heading text-cream mb-6">Page Not Found</h2>
        <p className="text-cream/70 mb-8 max-w-md mx-auto">
          The page you're looking for doesn't exist or has been moved.
        </p>
        <Link 
          to="/" 
          className="inline-block bg-accent text-primary px-8 py-3 rounded-lg font-semibold hover:bg-accent/90 transition-colors"
        >
          Go Back Home
        </Link>
      </div>
    </div>
  )
}
