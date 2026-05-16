import { Link } from 'react-router-dom'

const Footer = () => {
  return (
    <footer className="glass py-12 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          <div>
            <h3 className="text-2xl font-heading text-accent mb-4">ARC Enterprises</h3>
            <p className="text-cream">Empowering professionals with world-class education</p>
          </div>
          <div>
            <h4 className="text-lg font-heading text-accent mb-4">Quick Links</h4>
            <ul className="space-y-2">
              <li><Link to="/" className="text-cream hover:text-accent transition">Home</Link></li>
              <li><Link to="/about" className="text-cream hover:text-accent transition">About</Link></li>
              <li><Link to="/contact" className="text-cream hover:text-accent transition">Contact</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="text-lg font-heading text-accent mb-4">Courses</h4>
            <ul className="space-y-2">
              <li><a href="#" className="text-cream hover:text-accent transition">FinTech</a></li>
              <li><a href="#" className="text-cream hover:text-accent transition">AI & ML</a></li>
              <li><a href="#" className="text-cream hover:text-accent transition">Cloud</a></li>
            </ul>
          </div>
          <div>
            <h4 className="text-lg font-heading text-accent mb-4">Legal</h4>
            <ul className="space-y-2">
              <li><a href="#" className="text-cream hover:text-accent transition">Privacy Policy</a></li>
              <li><a href="#" className="text-cream hover:text-accent transition">Terms of Service</a></li>
            </ul>
          </div>
        </div>
        <div className="border-t border-accent pt-8 text-center text-cream">
          <p>&copy; 2026 ARC Enterprises. All rights reserved.</p>
        </div>
      </div>
    </footer>
  )
}

export default Footer
