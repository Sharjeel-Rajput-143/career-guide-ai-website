import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ArrowRight, BarChart2, Briefcase, Users } from "lucide-react"

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <header className="bg-gradient-to-r from-purple-700 to-indigo-800 text-white">
        <div className="container mx-auto px-4 py-16 md:py-24">
          <div className="flex flex-col md:flex-row items-center justify-between gap-12">
            <div className="md:w-1/2 space-y-6">
              <h1 className="text-4xl md:text-5xl font-bold leading-tight">Discover Your Ideal Career Path with AI</h1>
              <p className="text-lg md:text-xl opacity-90">
                Our AI-powered platform analyzes your personality, skills, and market trends to recommend the perfect
                career path for you.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 pt-4">
                <Button asChild size="lg" className="bg-white text-indigo-800 hover:bg-gray-100">
                  <Link href="/assessment/start">Start Assessment</Link>
                </Button>
                <Button asChild variant="outline" size="lg" className="border-white text-white hover:bg-white/10">
                  <Link href="/about">Learn More</Link>
                </Button>
              </div>
            </div>
            <div className="md:w-1/2">
              <img
                src="https://images.unsplash.com/photo-1552664730-d307ca884978?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80"
                alt="Career guidance illustration"
                className="rounded-lg shadow-xl w-full h-auto"
              />
            </div>
          </div>
        </div>
      </header>

      {/* Features Section */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">How It Works</h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-white p-6 rounded-lg shadow-md flex flex-col items-center text-center">
              <div className="bg-indigo-100 p-3 rounded-full mb-4">
                <Users className="h-8 w-8 text-indigo-700" />
              </div>
              <h3 className="text-xl font-semibold mb-3">Personality Assessment</h3>
              <p className="text-gray-600 mb-4">
                Take our comprehensive personality test to understand your traits, preferences, and work style.
              </p>
              <img
                src="https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80"
                alt="Personality assessment"
                className="w-full h-48 object-cover rounded-md mt-auto"
              />
            </div>
            <div className="bg-white p-6 rounded-lg shadow-md flex flex-col items-center text-center">
              <div className="bg-indigo-100 p-3 rounded-full mb-4">
                <BarChart2 className="h-8 w-8 text-indigo-700" />
              </div>
              <h3 className="text-xl font-semibold mb-3">Skills Evaluation</h3>
              <p className="text-gray-600 mb-4">
                Identify your strengths, weaknesses, and areas for improvement through our skill assessment.
              </p>
              <img
                src="https://images.unsplash.com/photo-1434030216411-0b793f4b4173?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80"
                alt="Skills evaluation"
                className="w-full h-48 object-cover rounded-md mt-auto"
              />
            </div>
            <div className="bg-white p-6 rounded-lg shadow-md flex flex-col items-center text-center">
              <div className="bg-indigo-100 p-3 rounded-full mb-4">
                <Briefcase className="h-8 w-8 text-indigo-700" />
              </div>
              <h3 className="text-xl font-semibold mb-3">AI Recommendations</h3>
              <p className="text-gray-600 mb-4">
                Receive personalized career recommendations based on your profile and current market trends.
              </p>
              <img
                src="https://images.unsplash.com/photo-1551288049-bebda4e38f71?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80"
                alt="AI recommendations"
                className="w-full h-48 object-cover rounded-md mt-auto"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row items-center gap-12">
            <div className="md:w-1/2">
              <img
                src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2071&q=80"
                alt="Career benefits illustration"
                className="rounded-lg shadow-lg w-full h-auto"
              />
            </div>
            <div className="md:w-1/2 space-y-6">
              <h2 className="text-3xl font-bold">Why Choose Our Platform?</h2>
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <div className="bg-indigo-100 p-1 rounded-full mt-1">
                    <ArrowRight className="h-5 w-5 text-indigo-700" />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold">Data-Driven Insights</h3>
                    <p className="text-gray-600">
                      Our recommendations are based on real market data and proven psychological models.
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="bg-indigo-100 p-1 rounded-full mt-1">
                    <ArrowRight className="h-5 w-5 text-indigo-700" />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold">Personalized Resources</h3>
                    <p className="text-gray-600">
                      Get tailored course recommendations, job listings, and mentorship opportunities.
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="bg-indigo-100 p-1 rounded-full mt-1">
                    <ArrowRight className="h-5 w-5 text-indigo-700" />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold">Future-Proof Guidance</h3>
                    <p className="text-gray-600">
                      Stay ahead with recommendations that consider emerging industries and future trends.
                    </p>
                  </div>
                </div>
              </div>
              <Button asChild className="mt-4">
                <Link href="/register">Create Free Account</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">Success Stories</h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-white p-6 rounded-lg shadow-md">
              <div className="flex items-center mb-4">
                <img
                  src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1974&q=80"
                  alt="User avatar"
                  className="rounded-full h-12 w-12 mr-4 object-cover"
                />
                <div>
                  <h4 className="font-semibold">Sarah Johnson</h4>
                  <p className="text-gray-500 text-sm">Software Engineer</p>
                </div>
              </div>
              <p className="text-gray-600">
                "The assessment accurately identified my strengths in logical thinking and problem-solving. The
                recommended tech career path was spot on, and the suggested courses helped me transition into software
                engineering."
              </p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-md">
              <div className="flex items-center mb-4">
                <img
                  src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1974&q=80"
                  alt="User avatar"
                  className="rounded-full h-12 w-12 mr-4 object-cover"
                />
                <div>
                  <h4 className="font-semibold">Michael Chen</h4>
                  <p className="text-gray-500 text-sm">UX Designer</p>
                </div>
              </div>
              <p className="text-gray-600">
                "I was stuck in a career I didn't enjoy. This platform helped me discover my passion for design and user
                experience. The career switch has been life-changing!"
              </p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-md">
              <div className="flex items-center mb-4">
                <img
                  src="https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1974&q=80"
                  alt="User avatar"
                  className="rounded-full h-12 w-12 mr-4 object-cover"
                />
                <div>
                  <h4 className="font-semibold">Priya Patel</h4>
                  <p className="text-gray-500 text-sm">Data Scientist</p>
                </div>
              </div>
              <p className="text-gray-600">
                "The AI recommendations were incredibly accurate. I was able to leverage my analytical skills and
                transition into data science. The resource recommendations were invaluable."
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-indigo-800 text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-6">Ready to Find Your Ideal Career Path?</h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto">
            Join thousands of students and professionals who have discovered their perfect career match with our
            AI-powered platform.
          </p>
          <Button asChild size="lg" className="bg-white text-indigo-800 hover:bg-gray-100">
            <Link href="/assessment/start">Start Free Assessment</Link>
          </Button>
        </div>
      </section>
    </div>
  )
}
