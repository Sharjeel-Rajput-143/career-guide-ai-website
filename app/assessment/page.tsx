import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { 
  CheckCircle, 
  Clock, 
  FileText, 
  HelpCircle, 
  Brain, 
  Bot, 
  Sparkles, 
  Target,
  Zap,
  ArrowRight,
  Users,
  TrendingUp,
  Award,
  Star
} from "lucide-react"

export default function AssessmentPage(): React.ReactElement {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-indigo-600 via-purple-600 to-indigo-800 text-white py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <div className="flex items-center justify-center gap-3 mb-6">
              <Brain className="h-12 w-12" />
              <h1 className="text-5xl font-bold">AI-Powered Career Assessments</h1>
            </div>
            <p className="text-xl opacity-90 mb-8">
              Discover your ideal career path with our advanced AI system that adapts to your responses and provides 
              hyper-personalized recommendations
            </p>
            
            {/* AI Features Highlight */}
            <div className="flex flex-wrap justify-center gap-4 mb-8">
              <Badge variant="secondary" className="bg-white/20 text-white border-white/30 px-4 py-2">
                <Bot className="h-4 w-4 mr-2" />
                AI-Adaptive Questions
              </Badge>
              <Badge variant="secondary" className="bg-white/20 text-white border-white/30 px-4 py-2">
                <Sparkles className="h-4 w-4 mr-2" />
                Smart Career Matching
              </Badge>
              <Badge variant="secondary" className="bg-white/20 text-white border-white/30 px-4 py-2">
                <Target className="h-4 w-4 mr-2" />
                Real Job Listings
              </Badge>
              <Badge variant="secondary" className="bg-white/20 text-white border-white/30 px-4 py-2">
                <Zap className="h-4 w-4 mr-2" />
                Instant Results
              </Badge>
            </div>

            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <Button asChild size="lg" className="bg-white text-indigo-600 hover:bg-gray-100">
                <Link href="/assessment/start">
                  Start AI Assessment
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
              <Button asChild size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-indigo-600">
                <Link href="#how-it-works">Learn How It Works</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-12 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 max-w-4xl mx-auto text-center">
            <div>
              <div className="text-3xl font-bold text-indigo-600 mb-2">95%</div>
              <div className="text-sm text-gray-600">AI Accuracy Rate</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-green-600 mb-2">50K+</div>
              <div className="text-sm text-gray-600">Assessments Completed</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-purple-600 mb-2">15 min</div>
              <div className="text-sm text-gray-600">Average Time</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-orange-600 mb-2">500+</div>
              <div className="text-sm text-gray-600">Career Paths</div>
            </div>
          </div>
        </div>
      </section>

      {/* Assessment Types */}
      <section id="how-it-works" className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Our AI-Enhanced Assessment Types</h2>
            <p className="text-lg text-gray-600">
              Experience the next generation of career assessment powered by artificial intelligence that learns and adapts to your unique profile.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
            <Card className="h-full flex flex-col border-2 hover:border-indigo-200 transition-colors">
              <CardHeader>
                <div className="flex items-center gap-3 mb-2">
                  <Brain className="h-8 w-8 text-indigo-600" />
                  <div>
                    <CardTitle className="text-xl">AI Personality Assessment</CardTitle>
                    <Badge className="bg-indigo-100 text-indigo-800 mt-1">AI Powered</Badge>
                  </div>
                </div>
                <CardDescription>
                  Advanced personality profiling with intelligent question adaptation and real-time insights
                </CardDescription>
              </CardHeader>
              <CardContent className="flex-grow">
                <div className="space-y-4">
                  <div className="flex items-start gap-4 p-4 bg-indigo-50 rounded-lg">
                    <Clock className="h-6 w-6 text-indigo-600 mt-1" />
                    <div>
                      <h3 className="font-medium">Smart Duration</h3>
                      <p className="text-gray-600">15-25 minutes (AI adapts to your response patterns)</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-4 p-4 bg-purple-50 rounded-lg">
                    <Bot className="h-6 w-6 text-purple-600 mt-1" />
                    <div>
                      <h3 className="font-medium">AI Features</h3>
                      <p className="text-gray-600">
                        Dynamic question generation, adaptive difficulty, and personalized follow-ups
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-4 p-4 bg-green-50 rounded-lg">
                    <Sparkles className="h-6 w-6 text-green-600 mt-1" />
                    <div>
                      <h3 className="font-medium">Advanced Outcomes</h3>
                      <p className="text-gray-600">
                        AI-generated personality insights, career matching, and personalized development plans
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
              <CardFooter>
                <Button asChild className="w-full bg-indigo-600 hover:bg-indigo-700">
                  <Link href="/assessment/personality">
                    <Brain className="mr-2 h-4 w-4" />
                    Start AI Personality Assessment
                  </Link>
                </Button>
              </CardFooter>
            </Card>

            <Card className="h-full flex flex-col border-2 hover:border-green-200 transition-colors">
              <CardHeader>
                <div className="flex items-center gap-3 mb-2">
                  <Target className="h-8 w-8 text-green-600" />
                  <div>
                    <CardTitle className="text-xl">Enhanced Skills Assessment</CardTitle>
                    <Badge className="bg-green-100 text-green-800 mt-1">AI Analytics</Badge>
                  </div>
                </div>
                <CardDescription>
                  Comprehensive skill evaluation with AI-powered gap analysis and learning recommendations
                </CardDescription>
              </CardHeader>
              <CardContent className="flex-grow">
                <div className="space-y-4">
                  <div className="flex items-start gap-4 p-4 bg-green-50 rounded-lg">
                    <Clock className="h-6 w-6 text-green-600 mt-1" />
                    <div>
                      <h3 className="font-medium">Comprehensive Duration</h3>
                      <p className="text-gray-600">20-30 minutes with real-time progress insights</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-4 p-4 bg-blue-50 rounded-lg">
                    <Target className="h-6 w-6 text-blue-600 mt-1" />
                    <div>
                      <h3 className="font-medium">8 Core Skills</h3>
                      <p className="text-gray-600">
                        Technical, cognitive, interpersonal, and personal skills with examples and guidance
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-4 p-4 bg-orange-50 rounded-lg">
                    <TrendingUp className="h-6 w-6 text-orange-600 mt-1" />
                    <div>
                      <h3 className="font-medium">AI Skill Analysis</h3>
                      <p className="text-gray-600">
                        Intelligent gap identification, strength mapping, and personalized learning paths
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
              <CardFooter>
                <Button asChild className="w-full bg-green-600 hover:bg-green-700">
                  <Link href="/assessment/skills">
                    <Target className="mr-2 h-4 w-4" />
                    Start Skills Assessment
                  </Link>
                </Button>
              </CardFooter>
            </Card>
          </div>
        </div>
      </section>

      {/* Combined Assessment */}
      <section className="py-16 bg-gradient-to-br from-indigo-50 to-purple-50">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <Card className="border-2 border-gradient-to-r from-indigo-200 to-purple-200">
              <CardHeader className="text-center">
                <div className="flex items-center justify-center gap-3 mb-4">
                  <Award className="h-8 w-8 text-indigo-600" />
                  <CardTitle className="text-2xl">Complete AI Career Assessment</CardTitle>
                </div>
                <CardDescription className="text-lg">
                  Unlock the full power of our AI by taking both assessments for maximum accuracy and personalization
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div className="flex items-start gap-4 p-6 bg-white rounded-lg border border-indigo-100">
                    <Bot className="h-8 w-8 text-indigo-600 mt-1" />
                    <div>
                      <h3 className="font-medium text-lg mb-2">Why Our AI Needs Both Assessments</h3>
                      <p className="text-gray-600 mb-4">
                        Our advanced AI system performs best when it can analyze both your personality traits and skill profile together. 
                        This comprehensive data allows for unprecedented accuracy in career matching and recommendations.
                      </p>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="bg-indigo-50 p-4 rounded-md">
                          <h4 className="font-medium text-indigo-700 mb-1">95% Accuracy</h4>
                          <p className="text-sm text-gray-600">
                            AI achieves 95% accuracy when analyzing both personality and skills
                          </p>
                        </div>
                        <div className="bg-purple-50 p-4 rounded-md">
                          <h4 className="font-medium text-purple-700 mb-1">Personalized Jobs</h4>
                          <p className="text-sm text-gray-600">
                            AI generates real job listings tailored to your complete profile
                          </p>
                        </div>
                        <div className="bg-green-50 p-4 rounded-md">
                          <h4 className="font-medium text-green-700 mb-1">Learning Paths</h4>
                          <p className="text-sm text-gray-600">
                            AI creates custom learning journeys based on your goals and gaps
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
              <CardFooter className="text-center">
                <Button asChild size="lg" className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700">
                  <Link href="/assessment/start">
                    <Sparkles className="mr-2 h-5 w-5" />
                    Start Complete AI Assessment
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Link>
                </Button>
              </CardFooter>
            </Card>
          </div>
        </div>
      </section>

      {/* Success Stories */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Success Stories</h2>
            <p className="text-lg text-gray-600">See how our AI-powered assessments have transformed careers</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            <Card className="text-center">
              <CardContent className="pt-6">
                <div className="w-16 h-16 bg-indigo-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl">👩‍💻</span>
                </div>
                <h4 className="font-semibold mb-2">Sarah M.</h4>
                <p className="text-sm text-gray-600 mb-3">Marketing → Software Developer</p>
                <p className="text-sm text-gray-600 mb-4">
                  "The AI assessment revealed my hidden analytical strengths. Within 8 months, I transitioned to software development with a 40% salary increase!"
                </p>
                <div className="flex justify-center">
                  <div className="flex text-yellow-400">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="h-4 w-4 fill-current" />
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="text-center">
              <CardContent className="pt-6">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl">👨‍🎓</span>
                </div>
                <h4 className="font-semibold mb-2">Mike R.</h4>
                <p className="text-sm text-gray-600 mb-3">Recent Graduate → Data Scientist</p>
                <p className="text-sm text-gray-600 mb-4">
                  "As a new graduate, I was confused about my direction. The AI assessment and personalized learning path helped me land my dream job!"
                </p>
                <div className="flex justify-center">
                  <div className="flex text-yellow-400">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="h-4 w-4 fill-current" />
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="text-center">
              <CardContent className="pt-6">
                <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl">👩‍💼</span>
                </div>
                <h4 className="font-semibold mb-2">Emma L.</h4>
                <p className="text-sm text-gray-600 mb-3">Teacher → UX Designer</p>
                <p className="text-sm text-gray-600 mb-4">
                  "The skills assessment identified my design thinking abilities. The AI-generated learning plan guided my transition perfectly!"
                </p>
                <div className="flex justify-center">
                  <div className="flex text-yellow-400">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="h-4 w-4 fill-current" />
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Frequently Asked Questions</h2>
            <p className="text-lg text-gray-600">Find answers to common questions about our AI-powered assessment process.</p>
          </div>

          <div className="max-w-3xl mx-auto space-y-6">
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <h3 className="text-xl font-semibold mb-2">How does the AI make assessments more accurate?</h3>
              <p className="text-gray-600">
                Our AI analyzes your response patterns, adapts questions in real-time, and uses machine learning to match your profile 
                with successful career outcomes. This results in 95% accuracy compared to 70% for traditional assessments.
              </p>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-sm">
              <h3 className="text-xl font-semibold mb-2">How long do the AI assessments take?</h3>
              <p className="text-gray-600">
                The AI personality assessment takes 15-25 minutes and adapts to your pace, while the skills assessment takes 20-30 
                minutes. The AI optimizes the experience for maximum insight in minimum time.
              </p>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-sm">
              <h3 className="text-xl font-semibold mb-2">Can I get new recommendations if my goals change?</h3>
              <p className="text-gray-600">
                Absolutely! Our AI continuously learns and can regenerate recommendations as you grow. You can retake assessments 
                or chat with our AI for updated guidance anytime.
              </p>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-sm">
              <h3 className="text-xl font-semibold mb-2">Is my data secure with AI processing?</h3>
              <p className="text-gray-600">
                Yes, we use enterprise-grade encryption and privacy protection. Your data is processed securely and never shared. 
                The AI only uses anonymized patterns to improve recommendations for all users.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-gradient-to-r from-indigo-700 via-purple-700 to-indigo-800 text-white">
        <div className="container mx-auto px-4 text-center">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-4xl font-bold mb-6">Ready to Discover Your AI-Powered Career Path?</h2>
            <p className="text-xl mb-8">
              Join over 50,000 professionals who have found their perfect career match with our cutting-edge AI assessment system.
            </p>
            
            <div className="flex flex-col sm:flex-row justify-center gap-4 mb-6">
              <Button asChild size="lg" className="bg-white text-indigo-700 hover:bg-gray-100">
                <Link href="/assessment/start">
                  <Brain className="mr-2 h-5 w-5" />
                  Start Free AI Assessment
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
            </div>
            
            <p className="text-sm opacity-75">
              ✨ Free assessment • No credit card required • AI results in 30 minutes • 95% accuracy guarantee
            </p>
          </div>
        </div>
      </section>
    </div>
  )
}