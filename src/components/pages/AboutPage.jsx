const About = () => {
  return (
    <div className="pt-24 pb-16 px-4">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-5xl font-heading text-accent mb-8 text-center">About ARC Enterprises</h1>
        
        <div className="glass p-8 rounded-lg mb-8">
          <h2 className="text-3xl font-heading text-accent mb-4">Our Mission</h2>
          <p className="text-cream mb-4">
            At ARC Enterprises, we believe in empowering professionals with world-class education that transforms careers and lives. Our mission is to bridge the gap between traditional education and the rapidly evolving demands of the modern workplace.
          </p>
          <p className="text-cream">
            We partner with industry experts and thought leaders to deliver cutting-edge courses in FinTech, AI, Cloud Computing, and more. Every course is designed with practical application in mind, ensuring our students gain skills they can immediately apply in their careers.
          </p>
        </div>

        <div className="glass p-8 rounded-lg mb-8">
          <h2 className="text-3xl font-heading text-accent mb-4">Our Story</h2>
          <p className="text-cream mb-4">
            Founded in 2020, ARC Enterprises emerged from a simple observation: the technology landscape was changing faster than traditional education could keep up. Our founders, veterans of the FinTech industry, recognized the need for accessible, high-quality training that could help professionals stay ahead of the curve.
          </p>
          <p className="text-cream">
            Today, we serve over 50,000 students worldwide, offering more than 200 courses across multiple disciplines. Our success is measured not in numbers, but in the career transformations and success stories of our students.
          </p>
        </div>

        <div className="glass p-8 rounded-lg">
          <h2 className="text-3xl font-heading text-accent mb-4">Our Values</h2>
          <ul className="space-y-4">
            <li className="text-cream">
              <strong className="text-accent">Excellence:</strong> We maintain the highest standards in course content and instruction.
            </li>
            <li className="text-cream">
              <strong className="text-accent">Accessibility:</strong> Quality education should be available to everyone, everywhere.
            </li>
            <li className="text-cream">
              <strong className="text-accent">Innovation:</strong> We continuously evolve our offerings to match industry trends.
            </li>
            <li className="text-cream">
              <strong className="text-accent">Community:</strong> Learning is better together. We foster a supportive learning environment.
            </li>
          </ul>
        </div>
      </div>
    </div>
  )
}

export default About
