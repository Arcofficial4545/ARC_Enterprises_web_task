import { useState } from 'react'

const Contact = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  })
  const [submitted, setSubmitted] = useState(false)

  const handleChange = (e) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }))
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    setSubmitted(true)
    setTimeout(() => {
      setSubmitted(false)
      setFormData({ name: '', email: '', subject: '', message: '' })
    }, 3000)
  }

  return (
    <div className="pt-24 pb-16 px-4">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-5xl font-heading text-accent mb-8 text-center">Contact Us</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
          <div className="glass p-6 rounded-lg">
            <h3 className="text-2xl font-heading text-accent mb-4">Get in Touch</h3>
            <div className="space-y-4">
              <div>
                <p className="text-accent font-semibold">Email</p>
                <p className="text-cream">info@arcenterprises.com</p>
              </div>
              <div>
                <p className="text-accent font-semibold">Phone</p>
                <p className="text-cream">+1 (555) 123-4567</p>
              </div>
              <div>
                <p className="text-accent font-semibold">Address</p>
                <p className="text-cream">123 Learning Street<br />San Francisco, CA 94102</p>
              </div>
            </div>
          </div>

          <div className="glass p-6 rounded-lg">
            <h3 className="text-2xl font-heading text-accent mb-4">Business Hours</h3>
            <div className="space-y-2">
              <p className="text-cream">Monday - Friday: 9:00 AM - 6:00 PM</p>
              <p className="text-cream">Saturday: 10:00 AM - 4:00 PM</p>
              <p className="text-cream">Sunday: Closed</p>
              <p className="text-accent mt-4">24/7 Support Available Online</p>
            </div>
          </div>
        </div>

        <div className="glass p-8 rounded-lg">
          <h2 className="text-3xl font-heading text-accent mb-6">Send us a Message</h2>
          
          {submitted && (
            <div className="mb-6 p-4 bg-green-500 bg-opacity-20 border border-green-500 rounded text-green-400">
              Thank you for your message! We'll get back to you soon.
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div>
                <label className="block mb-2 font-medium text-cream">Name</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-2 rounded bg-secondary border border-accent text-cream focus:outline-none focus:ring-2 focus:ring-accent"
                />
              </div>
              <div>
                <label className="block mb-2 font-medium text-cream">Email</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-2 rounded bg-secondary border border-accent text-cream focus:outline-none focus:ring-2 focus:ring-accent"
                />
              </div>
            </div>
            <div className="mb-4">
              <label className="block mb-2 font-medium text-cream">Subject</label>
              <input
                type="text"
                name="subject"
                value={formData.subject}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 rounded bg-secondary border border-accent text-cream focus:outline-none focus:ring-2 focus:ring-accent"
              />
            </div>
            <div className="mb-6">
              <label className="block mb-2 font-medium text-cream">Message</label>
              <textarea
                name="message"
                value={formData.message}
                onChange={handleChange}
                required
                rows="6"
                className="w-full px-4 py-2 rounded bg-secondary border border-accent text-cream focus:outline-none focus:ring-2 focus:ring-accent"
              />
            </div>
            <button
              type="submit"
              className="px-8 py-3 bg-accent text-primary rounded-lg hover:opacity-90 transition duration-300 font-semibold"
            >
              Send Message
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}

export default Contact
