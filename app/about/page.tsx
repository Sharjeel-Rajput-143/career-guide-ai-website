import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Users, BarChart2, Briefcase } from "lucide-react"

export default function AboutPage() {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-indigo-600 to-indigo-800 text-white py-16 md:py-24">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-6">AI Based Career Path Advisor</h1>
            <p className="text-xl opacity-90 mb-8">
              We're on a mission to help students and professionals find their ideal career paths through AI-powered
              assessments and personalized guidance.
            </p>
            <Button asChild size="lg" className="bg-white text-indigo-700 hover:bg-gray-100">
              <Link href="/assessment/start">Start Your Journey</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Our Mission */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Our Mission</h2>
            <p className="text-lg text-gray-600">
              We believe everyone deserves a fulfilling career that aligns with their unique strengths, interests, and
              values. Our AI-powered platform makes personalized career guidance accessible to all.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            <div className="bg-gray-50 p-6 rounded-lg text-center">
              <div className="bg-indigo-100 p-3 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <Users className="h-8 w-8 text-indigo-700" />
              </div>
              <h3 className="text-xl font-semibold mb-3">Personalized Guidance</h3>
              <p className="text-gray-600">
                Tailored recommendations based on your unique personality traits, skills, and interests.
              </p>
            </div>

            <div className="bg-gray-50 p-6 rounded-lg text-center">
              <div className="bg-indigo-100 p-3 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <BarChart2 className="h-8 w-8 text-indigo-700" />
              </div>
              <h3 className="text-xl font-semibold mb-3">Data-Driven Insights</h3>
              <p className="text-gray-600">
                Career recommendations backed by real market data, industry trends, and proven psychological models.
              </p>
            </div>

            <div className="bg-gray-50 p-6 rounded-lg text-center">
              <div className="bg-indigo-100 p-3 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <Briefcase className="h-8 w-8 text-indigo-700" />
              </div>
              <h3 className="text-xl font-semibold mb-3">Actionable Resources</h3>
              <p className="text-gray-600">
                Connect with relevant courses, job opportunities, and mentors to help you achieve your career goals.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">How It Works</h2>
            <p className="text-lg text-gray-600">
              Our comprehensive approach combines psychological assessments, skills evaluation, and AI technology to
              provide you with personalized career guidance.
            </p>
          </div>

          <div className="max-w-4xl mx-auto">
            <div className="relative">
              {/* Timeline line */}
              <div className="absolute left-4 md:left-1/2 transform md:-translate-x-1/2 h-full w-0.5 bg-indigo-200"></div>

              {/* Timeline items */}
              <div className="space-y-12">
                {/* Step 1 */}
                <div className="relative flex flex-col md:flex-row items-center">
                  <div className="flex items-center justify-center w-8 h-8 rounded-full bg-indigo-600 text-white absolute left-0 md:left-1/2 transform md:-translate-x-1/2 z-10">
                    1
                  </div>
                  <div className="ml-12 md:ml-0 md:w-1/2 md:pr-8 md:text-right">
                    <h3 className="text-xl font-semibold mb-2">Complete Assessments</h3>
                    <p className="text-gray-600">
                      Take our scientifically validated personality and skills assessments to help us understand your
                      unique profile.
                    </p>
                  </div>
                  <div className="hidden md:block md:w-1/2 md:pl-8"></div>
                </div>

                {/* Step 2 */}
                <div className="relative flex flex-col md:flex-row items-center">
                  <div className="flex items-center justify-center w-8 h-8 rounded-full bg-indigo-600 text-white absolute left-0 md:left-1/2 transform md:-translate-x-1/2 z-10">
                    2
                  </div>
                  <div className="hidden md:block md:w-1/2 md:pr-8"></div>
                  <div className="ml-12 md:ml-0 md:w-1/2 md:pl-8">
                    <h3 className="text-xl font-semibold mb-2">AI Analysis</h3>
                    <p className="text-gray-600">
                      Our AI engine analyzes your results against career data and market trends to identify optimal
                      matches.
                    </p>
                  </div>
                </div>

                {/* Step 3 */}
                <div className="relative flex flex-col md:flex-row items-center">
                  <div className="flex items-center justify-center w-8 h-8 rounded-full bg-indigo-600 text-white absolute left-0 md:left-1/2 transform md:-translate-x-1/2 z-10">
                    3
                  </div>
                  <div className="ml-12 md:ml-0 md:w-1/2 md:pr-8 md:text-right">
                    <h3 className="text-xl font-semibold mb-2">Receive Recommendations</h3>
                    <p className="text-gray-600">
                      Get personalized career recommendations, along with insights into why they're a good match for
                      you.
                    </p>
                  </div>
                  <div className="hidden md:block md:w-1/2 md:pl-8"></div>
                </div>

                {/* Step 4 */}
                <div className="relative flex flex-col md:flex-row items-center">
                  <div className="flex items-center justify-center w-8 h-8 rounded-full bg-indigo-600 text-white absolute left-0 md:left-1/2 transform md:-translate-x-1/2 z-10">
                    4
                  </div>
                  <div className="hidden md:block md:w-1/2 md:pr-8"></div>
                  <div className="ml-12 md:ml-0 md:w-1/2 md:pl-8">
                    <h3 className="text-xl font-semibold mb-2">Access Resources</h3>
                    <p className="text-gray-600">
                      Explore tailored learning resources, job opportunities, and mentorship connections to help you
                      succeed.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Our Team */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Our Team</h2>
            <p className="text-lg text-gray-600">
              We're a diverse team of career experts, data scientists, and developers passionate about helping people
              find fulfilling careers.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            <div className="text-center">
              <div className="w-32 h-32 rounded-full bg-gray-200 mx-auto mb-4 overflow-hidden">
                <img
                  src="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1976&q=80"
                  alt="Team member"
                  className="w-full h-full object-cover"
                />
              </div>
              <h3 className="text-xl font-semibold">Dr. Sarah Johnson</h3>
              <p className="text-indigo-600">Career Psychologist</p>
              <p className="text-gray-600 mt-2">
                Expert in career development psychology with 15+ years of experience in assessment design.
              </p>
            </div>

            <div className="text-center">
              <div className="w-32 h-32 rounded-full bg-gray-200 mx-auto mb-4 overflow-hidden">
                <img
                  src="https://images.unsplash.com/photo-1560250097-0b93528c311a?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1974&q=80"
                  alt="Team member"
                  className="w-full h-full object-cover"
                />
              </div>
              <h3 className="text-xl font-semibold">Michael Chen</h3>
              <p className="text-indigo-600">AI Research Lead</p>
              <p className="text-gray-600 mt-2">
                Former Google AI researcher specializing in machine learning models for personalization.
              </p>
            </div>

            <div className="text-center">
              <div className="w-32 h-32 rounded-full bg-gray-200 mx-auto mb-4 overflow-hidden">
                <img
                  src="https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1974&q=80"
                  alt="Team member"
                  className="w-full h-full object-cover"
                />
              </div>
              <h3 className="text-xl font-semibold">Priya Patel</h3>
              <p className="text-indigo-600">Career Data Analyst</p>
              <p className="text-gray-600 mt-2">
                Specializes in analyzing employment trends and workforce development patterns.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Success Stories</h2>
            <p className="text-lg text-gray-600">
              Hear from users who found their ideal career paths with our AI-powered guidance.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <div className="flex items-center mb-4">
                <img
                  src="https://images.unsplash.com/photo-1500648767791-00dcc994a43e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1974&q=80"
                  alt="User avatar"
                  className="rounded-full h-16 w-16 mr-4 object-cover"
                />
                <div>
                  <h4 className="font-semibold text-lg">Alex Rivera</h4>
                  <p className="text-indigo-600">Software Engineer</p>
                </div>
              </div>
              <p className="text-gray-600">
                "I was stuck in a career I didn't enjoy. The assessment accurately identified my analytical strengths
                and suggested software engineering. After taking recommended courses, I landed my dream job within 6
                months!"
              </p>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-sm">
              <div className="flex items-center mb-4">
                <img
                  src="https://images.unsplash.com/photo-1580489944761-15a19d654956?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1961&q=80"
                  alt="User avatar"
                  className="rounded-full h-16 w-16 mr-4 object-cover"
                />
                <div>
                  <h4 className="font-semibold text-lg">Jamie Taylor</h4>
                  <p className="text-indigo-600">UX Designer</p>
                </div>
              </div>
              <p className="text-gray-600">
                "The career recommendations perfectly matched my creative and empathetic personality. The UX design path
                suggested was something I'd never considered, but it's been the perfect blend of creativity and
                technology."
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-indigo-700 text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-6">Ready to Discover Your Ideal Career?</h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto">
            Join thousands of students and professionals who have found their perfect career match with our AI-powered
            platform.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Button asChild size="lg" className="bg-white text-indigo-700 hover:bg-gray-100">
              <Link href="/assessment/start">Start Free Assessment</Link>
            </Button>
            <Button asChild size="lg" variant="outline" className="border-white text-white hover:bg-indigo-600">
              <Link href="/contact">Contact Us</Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  )
}
