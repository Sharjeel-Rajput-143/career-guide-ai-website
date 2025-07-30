"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { 
  CheckCircle, 
  Clock, 
  FileText, 
  HelpCircle, 
  Brain, 
  Bot, 
  Sparkles, 
  Target,
  ArrowRight,
  RotateCcw,
  Zap,
  Code,
  Eye,
  Settings
} from "lucide-react"

interface PreviousAssessment {
  completedAt: string;
  personalityTraits?: Array<{ trait: string; score: number }>;
  skillsResults?: Array<{ skill: string; score: number }>;
  interactions?: Array<any>;
  chatGptGenerated?: boolean;
  errorFallback?: boolean;
}

export default function AssessmentStartPage(): React.ReactElement {
  const [selectedTab, setSelectedTab] = useState<string>("personality")
  const [previousResults, setPreviousResults] = useState<PreviousAssessment | null>(null)
  const [showPreviousResults, setShowPreviousResults] = useState<boolean>(false)
  const [showAdvancedFeatures, setShowAdvancedFeatures] = useState<boolean>(false)

  useEffect(() => {
    // Check for previous assessment results
    const storedAssessment: string | null = localStorage.getItem('personalityAssessment')
    if (storedAssessment) {
      try {
        const data: PreviousAssessment = JSON.parse(storedAssessment)
        setPreviousResults(data)
        setShowPreviousResults(true)
        
        // Show advanced features if user has used debug features before
        if (data.interactions && data.interactions.length > 0) {
          setShowAdvancedFeatures(true)
        }
      } catch (error) {
        console.error('Error parsing stored assessment:', error)
      }
    }
  }, [])

  const clearPreviousResults = (): void => {
    localStorage.removeItem('personalityAssessment')
    setPreviousResults(null)
    setShowPreviousResults(false)
  }

  const getPreviousResultsStatus = () => {
    if (!previousResults) return null
    
    const hasDebugData = previousResults.interactions && previousResults.interactions.length > 0
    const isAIGenerated = previousResults.chatGptGenerated && !previousResults.errorFallback
    
    return {
      hasDebugData,
      isAIGenerated,
      interactionCount: previousResults.interactions?.length || 0
    }
  }

  const previousStatus = getPreviousResultsStatus()

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-4xl mx-auto">
        {/* Previous Results Alert */}
        {showPreviousResults && previousResults && (
          <Alert className="mb-8 border-blue-200 bg-blue-50">
            <CheckCircle className="h-4 w-4" />
            <AlertDescription className="flex items-center justify-between">
              <div>
                <strong>Previous Assessment Found:</strong> Completed on{' '}
                {new Date(previousResults.completedAt).toLocaleDateString()}
                {previousResults.skillsResults && (
                  <div className="text-sm text-blue-700 mt-1">
                    Top skills: {previousResults.skillsResults?.slice(0, 3).map(s => s.skill).join(', ')}
                  </div>
                )}
                {previousStatus && (
                  <div className="flex gap-2 mt-2">
                    {previousStatus.isAIGenerated && (
                      <Badge variant="secondary" className="text-xs">
                        <Bot className="h-3 w-3 mr-1" />
                        AI Generated
                      </Badge>
                    )}
                  </div>
                )}
              </div>
              <div className="flex gap-2">
                <Button variant="outline" size="sm" asChild>
                  <Link href="/assessment/results">View Results</Link>
                </Button>
                <Button variant="ghost" size="sm" onClick={clearPreviousResults}>
                  <RotateCcw className="h-4 w-4 mr-1" />
                  Retake
                </Button>
              </div>
            </AlertDescription>
          </Alert>
        )}

        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4 flex items-center justify-center gap-3">
            <Brain className="h-10 w-10 text-indigo-600" />
            AI-Powered Career Assessment
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-6">
            Discover your ideal career path with our advanced AI system that adapts to your responses and provides 
            personalized recommendations based on your unique profile.
          </p>
          
          {/* AI Features Highlight */}
          <div className="flex flex-wrap justify-center gap-4">
            <Badge variant="secondary" className="flex items-center gap-2 px-4 py-2">
              <Bot className="h-4 w-4" />
              AI-Powered Analysis
            </Badge>
            <Badge variant="secondary" className="flex items-center gap-2 px-4 py-2">
              <Sparkles className="h-4 w-4" />
              Personalized Questions
            </Badge>
            <Badge variant="secondary" className="flex items-center gap-2 px-4 py-2">
              <Target className="h-4 w-4" />
              Smart Career Matching
            </Badge>
            <Badge variant="secondary" className="flex items-center gap-2 px-4 py-2">
              <Zap className="h-4 w-4" />
              Real Job Listings
            </Badge>
          </div>

          {/* Advanced Features Toggle */}
          {showAdvancedFeatures && (
            <div className="mt-6 p-4 bg-gray-50 rounded-lg border">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowAdvancedFeatures(!showAdvancedFeatures)}
                className="mb-3"
              >
                <Settings className="h-4 w-4 mr-2" />
                Advanced Features Available
              </Button>
              <div className="text-sm text-gray-600 space-y-2">
                <p>🐛 <strong>Debug Mode:</strong> See exactly how AI generates your career recommendations</p>
                <p>🔍 <strong>Prompt Transparency:</strong> View the prompts sent to ChatGPT and raw responses</p>
                <p>⚡ <strong>Performance Metrics:</strong> Track API response times and token usage</p>
              </div>
            </div>
          )}
        </div>

        {/* Assessment Overview */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <Card className="text-center">
            <CardContent className="pt-6">
              <Brain className="h-12 w-12 mx-auto mb-4 text-indigo-600" />
              <h3 className="font-semibold text-lg mb-2">AI-Enhanced Assessment</h3>
              <p className="text-gray-600 text-sm">
                Our AI adapts questions based on your responses for maximum accuracy
              </p>
            </CardContent>
          </Card>
          
          <Card className="text-center">
            <CardContent className="pt-6">
              <Target className="h-12 w-12 mx-auto mb-4 text-green-600" />
              <h3 className="font-semibold text-lg mb-2">Personalized Results</h3>
              <p className="text-gray-600 text-sm">
                Get career recommendations tailored specifically to your profile
              </p>
            </CardContent>
          </Card>
          
          <Card className="text-center">
            <CardContent className="pt-6">
              <Sparkles className="h-12 w-12 mx-auto mb-4 text-purple-600" />
              <h3 className="font-semibold text-lg mb-2">Actionable Insights</h3>
              <p className="text-gray-600 text-sm">
                Receive specific next steps and learning recommendations
              </p>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="personality" value={selectedTab} onValueChange={setSelectedTab} className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="personality" className="flex items-center gap-2">
              <Brain className="h-4 w-4" />
              AI Personality Assessment
            </TabsTrigger>
            <TabsTrigger value="skills" className="flex items-center gap-2">
              <Target className="h-4 w-4" />
              Skills Evaluation
            </TabsTrigger>
          </TabsList>

          <TabsContent value="personality" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-3">
                  <Brain className="h-6 w-6 text-indigo-600" />
                  AI-Enhanced Personality Assessment
                  <Badge className="bg-indigo-100 text-indigo-800">AI Powered</Badge>
                </CardTitle>
                <CardDescription>
                  Advanced personality profiling with intelligent question adaptation and optional debug features
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="flex items-start gap-4 p-4 bg-indigo-50 rounded-lg">
                      <Clock className="h-6 w-6 text-indigo-600 mt-1" />
                      <div>
                        <h3 className="font-medium">Time Required</h3>
                        <p className="text-gray-600">15-25 minutes (AI adapts to your pace)</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-4 p-4 bg-purple-50 rounded-lg">
                      <Bot className="h-6 w-6 text-purple-600 mt-1" />
                      <div>
                        <h3 className="font-medium">AI Features</h3>
                        <p className="text-gray-600">Smart question generation based on answers</p>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-start gap-4 p-4 bg-gray-50 rounded-lg">
                    <FileText className="h-6 w-6 text-indigo-600 mt-1" />
                    <div>
                      <h3 className="font-medium">What to Expect</h3>
                      <p className="text-gray-600 mb-3">
                        8-15 dynamic questions about your work preferences, leadership style, and problem-solving approach. 
                        Our AI generates personalized career recommendations based on your responses.
                      </p>
                      <div className="flex flex-wrap gap-2">
                        <Badge variant="outline">Work Style</Badge>
                        <Badge variant="outline">Team Dynamics</Badge>
                        <Badge variant="outline">Problem Solving</Badge>
                        <Badge variant="outline">Adaptability</Badge>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-start gap-4 p-4 bg-green-50 rounded-lg">
                    <CheckCircle className="h-6 w-6 text-green-600 mt-1" />
                    <div>
                      <h3 className="font-medium">AI-Generated Outcomes</h3>
                      <p className="text-gray-600">
                        Comprehensive personality profile with AI-powered career matching, personalized job recommendations, 
                        and learning pathways tailored to your unique traits.
                      </p>
                    </div>
                  </div>

                  {showAdvancedFeatures && (
                    <div className="flex items-start gap-4 p-4 bg-blue-50 rounded-lg border border-blue-200">
                      <Code className="h-6 w-6 text-blue-600 mt-1" />
                      <div>
                        <h3 className="font-medium">Debug Features Available</h3>
                        <p className="text-gray-600 mb-2">
                          Enable debug mode to see exactly how our AI generates your recommendations.
                        </p>
                        <div className="flex flex-wrap gap-2 text-xs">
                          <Badge variant="outline">See Raw Responses</Badge>
                          <Badge variant="outline">Track API Performance</Badge>
                          <Badge variant="outline">Token Usage Analytics</Badge>
                        </div>
                      </div>
                    </div>
                  )}

                  <div className="flex items-start gap-4 p-4 bg-yellow-50 rounded-lg">
                    <HelpCircle className="h-6 w-6 text-yellow-600 mt-1" />
                    <div>
                      <h3 className="font-medium">Tips for Best Results</h3>
                      <ul className="text-gray-600 space-y-1 text-sm">
                        <li>• Answer honestly based on your real experiences</li>
                        <li>• Take your time with each question</li>
                        <li>• Think about actual work situations you've been in</li>
                        {showAdvancedFeatures && (
                          <li>• Enable debug mode to understand AI decision-making</li>
                        )}
                      </ul>
                    </div>
                  </div>
                </div>
              </CardContent>
              <CardFooter className="flex justify-between">
                <Button variant="outline" onClick={() => setSelectedTab("skills")}>
                  Skip to Skills Assessment
                </Button>
                <Button asChild size="lg" className="flex items-center gap-2">
                  <Link href="/assessment/personality">
                    <Sparkles className="h-4 w-4" />
                    Begin AI Assessment
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                </Button>
              </CardFooter>
            </Card>
          </TabsContent>

          <TabsContent value="skills" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-3">
                  <Target className="h-6 w-6 text-green-600" />
                  Enhanced Skills Evaluation
                </CardTitle>
                <CardDescription>
                  Comprehensive skill assessment with AI-powered analysis and optional debug features
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="flex items-start gap-4 p-4 bg-green-50 rounded-lg">
                      <Clock className="h-6 w-6 text-green-600 mt-1" />
                      <div>
                        <h3 className="font-medium">Time Required</h3>
                        <p className="text-gray-600">20-30 minutes for comprehensive evaluation</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-4 p-4 bg-blue-50 rounded-lg">
                      <Target className="h-6 w-6 text-blue-600 mt-1" />
                      <div>
                        <h3 className="font-medium">Skills Covered</h3>
                        <p className="text-gray-600">8 core skills across multiple categories</p>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-start gap-4 p-4 bg-gray-50 rounded-lg">
                    <FileText className="h-6 w-6 text-indigo-600 mt-1" />
                    <div>
                      <h3 className="font-medium">Assessment Categories</h3>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-3">
                        <div>
                          <h4 className="font-medium text-sm text-blue-700">Technical</h4>
                          <p className="text-xs text-gray-600">Programming, Data Analysis, Tools</p>
                        </div>
                        <div>
                          <h4 className="font-medium text-sm text-green-700">Cognitive</h4>
                          <p className="text-xs text-gray-600">Problem Solving, Critical Thinking</p>
                        </div>
                        <div>
                          <h4 className="font-medium text-sm text-purple-700">Interpersonal</h4>
                          <p className="text-xs text-gray-600">Communication, Leadership</p>
                        </div>
                        <div>
                          <h4 className="font-medium text-sm text-orange-700">Personal</h4>
                          <p className="text-xs text-gray-600">Adaptability, Time Management</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-start gap-4 p-4 bg-green-50 rounded-lg">
                    <CheckCircle className="h-6 w-6 text-green-600 mt-1" />
                    <div>
                      <h3 className="font-medium">AI-Powered Analysis</h3>
                      <p className="text-gray-600">
                        Get detailed insights into your skill strengths, development areas, and personalized 
                        learning recommendations powered by our AI analysis engine.
                      </p>
                    </div>
                  </div>

                  {showAdvancedFeatures && (
                    <div className="flex items-start gap-4 p-4 bg-blue-50 rounded-lg border border-blue-200">
                      <Eye className="h-6 w-6 text-blue-600 mt-1" />
                      <div>
                        <h3 className="font-medium">Advanced Debug Features</h3>
                        <p className="text-gray-600 mb-2">
                          Enable debug mode to see how AI analyzes your skills and generates recommendations.
                        </p>
                        <div className="grid grid-cols-2 gap-2 text-xs">
                          <div>• View AI prompt construction</div>
                          <div>• See response parsing</div>
                          <div>• Track processing time</div>
                          <div>• Monitor token usage</div>
                        </div>
                      </div>
                    </div>
                  )}

                  <div className="flex items-start gap-4 p-4 bg-yellow-50 rounded-lg">
                    <HelpCircle className="h-6 w-6 text-yellow-600 mt-1" />
                    <div>
                      <h3 className="font-medium">Rating Guidelines</h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-2 text-sm">
                        <div className="space-y-1">
                          <div><strong>1-3:</strong> Beginner (Learning basics)</div>
                          <div><strong>4-5:</strong> Basic (Some experience)</div>
                        </div>
                        <div className="space-y-1">
                          <div><strong>6-7:</strong> Intermediate (Independent work)</div>
                          <div><strong>8-10:</strong> Advanced/Expert (Can teach others)</div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
              <CardFooter className="flex justify-between">
                <Button variant="outline" onClick={() => setSelectedTab("personality")}>
                  Back to Personality
                </Button>
                <Button asChild size="lg" className="flex items-center gap-2">
                  <Link href="/assessment/skills">
                    <Target className="h-4 w-4" />
                    Begin Skills Assessment
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                </Button>
              </CardFooter>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Enhanced CTA Section */}
        <div className="mt-12 p-8 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-lg text-center">
          <h3 className="text-2xl font-bold mb-4">Complete Both Assessments for Maximum AI Power</h3>
          <p className="text-lg mb-6 opacity-90">
            Our AI provides the most accurate career recommendations when it analyzes both your personality and skills data together.
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            <div className="bg-white/10 p-6 rounded-lg">
              <Bot className="h-8 w-8 mx-auto mb-3" />
              <h4 className="font-semibold mb-2">AI-Powered Matching</h4>
              <p className="text-sm opacity-90">
                Our advanced AI analyzes both assessments to find your perfect career match with high accuracy.
              </p>
            </div>
            <div className="bg-white/10 p-6 rounded-lg">
              <Sparkles className="h-8 w-8 mx-auto mb-3" />
              <h4 className="font-semibold mb-2">Complete Transparency</h4>
              <p className="text-sm opacity-90">
                {showAdvancedFeatures 
                  ? "Enable debug mode to see exactly how AI generates your personalized recommendations."
                  : "Get customized learning paths, real job listings, and ongoing AI career guidance."
                }
              </p>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Button size="lg" className="bg-white text-indigo-600 hover:bg-gray-100 flex items-center gap-2" asChild>
              <Link href="/assessment/personality">
                <Brain className="h-5 w-5" />
                Start Complete AI Assessment
                <ArrowRight className="h-5 w-5" />
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}