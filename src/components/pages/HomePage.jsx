import { Link } from 'react-router-dom'
import { useCourses } from '../../context/CourseContext'
import CourseCard from '../courses/CourseCard'
import EnrollmentCalculator from '../courses/EnrollmentCalculator'

const Home = () => {
  const { courses } = useCourses()
  const featuredCourses = courses.slice(0, 3)

  return (
    <div className="pt-16">
      {/* Hero Section */}
      <section className="pt-32 pb-20 px-4 relative overflow-hidden">
        <div className="absolute inset-0 bg-secondary opacity-50" />
        <div className="max-w-7xl mx-auto relative z-10">
          <div className="text-center">
            <h1 className="text-5xl md:text-7xl font-heading text-accent mb-6">
              Transform Your Future
            </h1>
            <p className="text-xl md:text-2xl text-cream mb-8 max-w-3xl mx-auto">
              Master cutting-edge skills with industry-leading courses designed for tomorrow's professionals
            </p>
            <div className="flex justify-center space-x-4">
              <Link to="/contact" className="px-8 py-3 bg-accent text-primary rounded-lg hover:opacity-90 transition duration-300 font-semibold">
                Get Started
              </Link>
              <Link to="/about" className="px-8 py-3 glass rounded-lg text-cream hover:text-accent transition duration-300">
                Learn More
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="glass p-6 rounded-lg text-center">
              <div className="text-4xl font-heading text-accent mb-2">50K+</div>
              <div className="text-cream">Active Students</div>
            </div>
            <div className="glass p-6 rounded-lg text-center">
              <div className="text-4xl font-heading text-accent mb-2">200+</div>
              <div className="text-cream">Expert Courses</div>
            </div>
            <div className="glass p-6 rounded-lg text-center">
              <div className="text-4xl font-heading text-accent mb-2">95%</div>
              <div className="text-cream">Success Rate</div>
            </div>
            <div className="glass p-6 rounded-lg text-center">
              <div className="text-4xl font-heading text-accent mb-2">24/7</div>
              <div className="text-cream">Support</div>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Courses */}
      <section className="py-16 px-4 bg-secondary">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-4xl font-heading text-accent text-center mb-12">Featured Courses</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {featuredCourses.map(course => (
              <CourseCard key={course.id} course={course} />
            ))}
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-16 px-4">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-4xl font-heading text-accent text-center mb-12">Why Choose ARC</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              { num: '01', title: 'Industry Experts', desc: 'Learn from professionals with real-world experience' },
              { num: '02', title: 'Lifetime Access', desc: 'Access course materials anytime, anywhere, forever' },
              { num: '03', title: 'Certification', desc: 'Earn recognized certificates upon completion' },
              { num: '04', title: 'Hands-on Projects', desc: 'Build real-world projects for your portfolio' },
              { num: '05', title: 'Community Support', desc: 'Join thousands of learners in our community' },
              { num: '06', title: 'Career Services', desc: 'Get job placement assistance and career guidance' }
            ].map(feature => (
              <div key={feature.num} className="glass p-6 rounded-lg">
                <div className="text-accent text-3xl mb-4">{feature.num}</div>
                <h3 className="text-xl font-heading text-accent mb-2">{feature.title}</h3>
                <p className="text-cream">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-16 px-4 bg-secondary">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-4xl font-heading text-accent text-center mb-12">Student Success Stories</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="glass p-8 rounded-lg">
              <p className="text-cream mb-4">
                "ARC Enterprises transformed my career. The FinTech course gave me the skills to land my dream job at a leading bank."
              </p>
              <div className="flex items-center">
                <div className="w-12 h-12 bg-accent rounded-full mr-4" />
                <div>
                  <div className="text-accent font-semibold">Sarah Johnson</div>
                  <div className="text-cream text-sm">FinTech Analyst</div>
                </div>
              </div>
            </div>
            <div className="glass p-8 rounded-lg">
              <p className="text-cream mb-4">
                "The AI course was comprehensive and practical. I built three projects that impressed my employers during interviews."
              </p>
              <div className="flex items-center">
                <div className="w-12 h-12 bg-accent rounded-full mr-4" />
                <div>
                  <div className="text-accent font-semibold">Michael Chen</div>
                  <div className="text-cream text-sm">ML Engineer</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Enrollment Calculator Section */}
      <section className="py-16 px-4">
        <div className="max-w-7xl mx-auto">
          <EnrollmentCalculator />
        </div>
      </section>

      {/* Pricing Section */}
      <section className="py-16 px-4 bg-secondary">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-4xl font-heading text-accent text-center mb-12">Flexible Pricing Plans</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { name: 'Starter', price: 99, features: ['Access to 5 courses', 'Basic support', 'Certificate of completion'] },
              { name: 'Professional', price: 199, features: ['Unlimited course access', 'Priority support', 'Career services'], featured: true },
              { name: 'Enterprise', price: 499, features: ['Team access (10 users)', 'Dedicated support', 'Custom training'] }
            ].map(plan => (
              <div key={plan.name} className={`glass p-8 rounded-lg ${plan.featured ? 'border-2 border-accent' : ''}`}>
                <h3 className="text-2xl font-heading text-accent mb-4">{plan.name}</h3>
                <div className="text-4xl font-heading text-accent mb-6">
                  ${plan.price}<span className="text-lg text-cream">/month</span>
                </div>
                <ul className="space-y-3 mb-8">
                  {plan.features.map(feature => (
                    <li key={feature} className="text-cream">{feature}</li>
                  ))}
                </ul>
                <button className={`w-full py-3 rounded-lg transition ${plan.featured ? 'bg-accent text-primary hover:opacity-90' : 'glass text-accent hover:bg-accent hover:text-primary'}`}>
                  Choose Plan
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl font-heading text-accent mb-6">Ready to Start Your Journey?</h2>
          <p className="text-xl text-cream mb-8">
            Join thousands of professionals advancing their careers with ARC Enterprises
          </p>
          <Link to="/auth/register" className="inline-block px-8 py-3 bg-accent text-primary rounded-lg hover:opacity-90 transition duration-300 font-semibold">
            Start Learning Today
          </Link>
        </div>
      </section>
    </div>
  )
}

export default Home
