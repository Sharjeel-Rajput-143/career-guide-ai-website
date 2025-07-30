"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Switch } from "@/components/ui/switch"
import { 
  ArrowLeft, 
  ArrowRight, 
  Loader2, 
  Bot, 
  Code, 
  Settings, 
  CheckCircle, 
  AlertCircle, 
  Brain,
  Database,
  Activity,
  Target,
  BarChart3,
  Users
} from "lucide-react"

// Enhanced AI Service with KNN support and AI Job Generation
const EnhancedAPIService = {
  async getKNNRecommendations(userProfile: any, options: any) {
    const startTime = Date.now()
    
    try {
      
      const response = await fetch('/api/knn-recommendations', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userProfile,
          options
        })
      })

      const result = await response.json()
      const duration = Date.now() - startTime

      if (result.success) {
        return {
          success: true,
          data: result.data,
          metadata: {
            ...result.metadata,
            requestDuration: duration
          }
        }
      } else {
        console.warn('⚠️ KNN service returned error:', result.error)
        return {
          success: false,
          error: result.error,
          metadata: { requestDuration: duration }
        }
      }
    } catch (error) {
      console.error('❌ KNN service error:', error)
      return {
        success: false,
        error: error instanceof Error ? error.message : 'KNN service unavailable',
        metadata: {
          requestDuration: Date.now() - startTime
        }
      }
    }
  },

  async getCareerRecommendations(userProfile: any, selectedModel: string = 'sonnet') {
    const startTime = Date.now()
    
    try {
      
      const response = await fetch('/api/career-recommendations', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          personalityTraits: userProfile.personalityTraits,
          skillsResults: userProfile.skillsResults,
          preferences: userProfile.preferences,
          experience: userProfile.experience,
          careerGoals: userProfile.careerGoals,
          model: selectedModel
        })
      })

      const result = await response.json()
      const duration = Date.now() - startTime

      if (result.success) {
        return {
          success: true,
          data: result.data,
          metadata: {
            ...result.metadata,
            requestDuration: duration
          }
        }
      } else {
        console.warn('⚠️ AI service returned error:', result.error)
        return {
          success: false,
          error: result.error,
          metadata: { requestDuration: duration }
        }
      }
    } catch (error) {
      console.error('❌ AI service error:', error)
      return {
        success: false,
        error: error instanceof Error ? error.message : 'AI service unavailable',
        metadata: {
          requestDuration: Date.now() - startTime
        }
      }
    }
  },

  async generateJobListings(careerTitles: string[], userProfile: any, selectedModel: string = 'sonnet') {
    const startTime = Date.now()
    
    try {
      
      const response = await fetch('/api/job-recommendations', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          careerTitles: careerTitles,
          userProfile: {
            personalityTraits: userProfile.personalityTraits,
            skillsResults: userProfile.skillsResults,
            preferences: userProfile.preferences,
            experience: userProfile.experience
          },
          numberOfJobs: 8, // Increased for better variety
          model: selectedModel
        })
      })

      if (!response.ok) {
        console.warn('⚠️ AI job generation failed, no jobs will be included')
        return {
          success: false,
          data: { jobs: [] },
          metadata: {
            model: selectedModel,
            requestDuration: Date.now() - startTime,
            aiGenerated: false
          }
        }
      }

      const result = await response.json()
      const duration = Date.now() - startTime
      
      if (result.success && result.data.jobs) {
        return {
          success: true,
          data: { 
            jobs: result.data.jobs.map((job: any) => ({
              ...job,
              aiGenerated: true,
              source: 'ai',
              generatedBy: job.generatedBy || `Claude ${selectedModel.toUpperCase()}`,
              generatedAt: new Date().toISOString()
            }))
          },
          metadata: {
            ...result.metadata,
            requestDuration: duration,
            aiGenerated: true
          }
        }
      } else {
        console.warn('⚠️ Invalid AI job response')
        return {
          success: false,
          data: { jobs: [] },
          metadata: {
            model: selectedModel,
            requestDuration: duration,
            aiGenerated: false
          }
        }
      }

    } catch (error) {
      console.error('❌ Error generating AI jobs:', error)
      return {
        success: false,
        data: { jobs: [] },
        metadata: {
          model: selectedModel,
          requestDuration: Date.now() - startTime,
          error: error instanceof Error ? error.message : 'Unknown error',
          aiGenerated: false
        }
      }
    }
  },

  // NEW: Check database statistics for KNN insights
  async getKNNStatistics() {
    try {
      const response = await fetch('/api/knn-recommendations', {
        method: 'GET'
      })
      const result = await response.json()
      return result
    } catch (error) {
      console.warn('Could not fetch KNN statistics:', error)
      return null
    }
  }
}

// Enhanced personality questions for better KNN feature extraction
const personalityQuestions = [
  {
    id: 1,
    question: "I prefer working in teams rather than individually.",
    trait: "Extraversion",
    knnWeight: 1.2, // Higher weight for KNN algorithm
    options: [
      { value: "1", label: "Strongly Disagree" },
      { value: "2", label: "Disagree" },
      { value: "3", label: "Neutral" },
      { value: "4", label: "Agree" },
      { value: "5", label: "Strongly Agree" },
    ],
  },
  {
    id: 2,
    question: "I enjoy solving complex problems that require analytical thinking.",
    trait: "Analytical Thinking",
    knnWeight: 1.5, // Critical for career matching
    options: [
      { value: "1", label: "Strongly Disagree" },
      { value: "2", label: "Disagree" },
      { value: "3", label: "Neutral" },
      { value: "4", label: "Agree" },
      { value: "5", label: "Strongly Agree" },
    ],
  },
  {
    id: 3,
    question: "I prefer having a structured routine rather than a flexible schedule.",
    trait: "Adaptability",
    reverse: true,
    knnWeight: 1.0,
    options: [
      { value: "1", label: "Strongly Disagree" },
      { value: "2", label: "Disagree" },
      { value: "3", label: "Neutral" },
      { value: "4", label: "Agree" },
      { value: "5", label: "Strongly Agree" },
    ],
  },
  {
    id: 4,
    question: "I enjoy taking leadership roles in group settings.",
    trait: "Leadership",
    knnWeight: 1.3, // Important for management careers
    options: [
      { value: "1", label: "Strongly Disagree" },
      { value: "2", label: "Disagree" },
      { value: "3", label: "Neutral" },
      { value: "4", label: "Agree" },
      { value: "5", label: "Strongly Agree" },
    ],
  },
  {
    id: 5,
    question: "I prefer creative tasks over technical ones.",
    trait: "Creativity",
    knnWeight: 1.2,
    options: [
      { value: "1", label: "Strongly Disagree" },
      { value: "2", label: "Disagree" },
      { value: "3", label: "Neutral" },
      { value: "4", label: "Agree" },
      { value: "5", label: "Strongly Agree" },
    ],
  },
  {
    id: 6,
    question: "I feel energized when working with large groups of people.",
    trait: "Extraversion",
    knnWeight: 1.1,
    options: [
      { value: "1", label: "Strongly Disagree" },
      { value: "2", label: "Disagree" },
      { value: "3", label: "Neutral" },
      { value: "4", label: "Agree" },
      { value: "5", label: "Strongly Agree" },
    ],
  },
  {
    id: 7,
    question: "I enjoy learning new technologies and staying updated with trends.",
    trait: "Adaptability",
    knnWeight: 1.4, // Key for tech careers
    options: [
      { value: "1", label: "Strongly Disagree" },
      { value: "2", label: "Disagree" },
      { value: "3", label: "Neutral" },
      { value: "4", label: "Agree" },
      { value: "5", label: "Strongly Agree" },
    ],
  },
  {
    id: 8,
    question: "I prefer detailed instructions over general guidelines.",
    trait: "Analytical Thinking",
    knnWeight: 1.0,
    options: [
      { value: "1", label: "Strongly Disagree" },
      { value: "2", label: "Disagree" },
      { value: "3", label: "Neutral" },
      { value: "4", label: "Agree" },
      { value: "5", label: "Strongly Agree" },
    ],
  },
  {
    id: 9,
    question: "I often come up with innovative solutions to problems.",
    trait: "Creativity",
    knnWeight: 1.3,
    options: [
      { value: "1", label: "Strongly Disagree" },
      { value: "2", label: "Disagree" },
      { value: "3", label: "Neutral" },
      { value: "4", label: "Agree" },
      { value: "5", label: "Strongly Agree" },
    ],
  },
  {
    id: 10,
    question: "I am comfortable making decisions that affect others.",
    trait: "Leadership",
    knnWeight: 1.2,
    options: [
      { value: "1", label: "Strongly Disagree" },
      { value: "2", label: "Disagree" },
      { value: "3", label: "Neutral" },
      { value: "4", label: "Agree" },
      { value: "5", label: "Strongly Agree" },
    ],
  },
  // Additional questions for better KNN feature space
  {
    id: 11,
    question: "I work better under pressure and tight deadlines.",
    trait: "Stress Tolerance",
    knnWeight: 1.1,
    options: [
      { value: "1", label: "Strongly Disagree" },
      { value: "2", label: "Disagree" },
      { value: "3", label: "Neutral" },
      { value: "4", label: "Agree" },
      { value: "5", label: "Strongly Agree" },
    ],
  },
  {
    id: 12,
    question: "I enjoy helping others solve their problems.",
    trait: "Service Orientation",
    knnWeight: 1.2,
    options: [
      { value: "1", label: "Strongly Disagree" },
      { value: "2", label: "Disagree" },
      { value: "3", label: "Neutral" },
      { value: "4", label: "Agree" },
      { value: "5", label: "Strongly Agree" },
    ],
  },
]

export default function PersonalityAssessment() {
  const router = useRouter()
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [answers, setAnswers] = useState<Record<number, string>>({})
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [apiStatus, setApiStatus] = useState<'ready' | 'error' | 'checking' | null>(null)
  const [dbStatus, setDbStatus] = useState<'ready' | 'error' | 'checking' | null>(null)
  const [selectedModel, setSelectedModel] = useState<'opus' | 'sonnet' | 'haiku'>('sonnet')
  const [knnStats, setKnnStats] = useState<any>(null)
  
  // Enhanced options
  const [useKNN, setUseKNN] = useState(true)
  const [useAI, setUseAI] = useState(true)
  const [kValue, setKValue] = useState(5)
  const [includeDebug, setIncludeDebug] = useState(false)

  const totalQuestions = personalityQuestions.length
  const progress = ((currentQuestion + 1) / totalQuestions) * 100

  useEffect(() => {
    // Check system status and load KNN stats on component mount
    checkSystemStatus()
    loadKNNStatistics()
  }, [])

  const checkSystemStatus = async () => {
    setApiStatus('checking')
    setDbStatus('checking')
    
    try {
      // Check AI API status
      const aiResponse = await fetch('/api/career-recommendations', {
        method: 'GET'
      })
      const aiResult = await aiResponse.json()
      
      if (aiResult.apiKeyConfigured && (aiResult.status === 'Ready' || aiResult.status.includes('Ready'))) {
        setApiStatus('ready')
      } else {
        setApiStatus('error')
      }

      // Check KNN/Database status
      const knnResponse = await fetch('/api/knn-recommendations', {
        method: 'GET'
      })
      const knnResult = await knnResponse.json()
      
      if (knnResult.status === 'Ready' && knnResult.database?.connected) {
        setDbStatus('ready')
      } else {
        setDbStatus('error')
      }

    } catch (error) {
      setApiStatus('error')
      setDbStatus('error')
      console.error('System status check failed:', error)
    }
  }

  const loadKNNStatistics = async () => {
    try {
      const stats = await EnhancedAPIService.getKNNStatistics()
      if (stats) {
        setKnnStats(stats)
      }
    } catch (error) {
      console.warn('Could not load KNN statistics:', error)
    }
  }

  const handleAnswer = (value: string) => {
    setAnswers({
      ...answers,
      [personalityQuestions[currentQuestion].id]: value,
    })
  }

  const goToNextQuestion = () => {
    if (currentQuestion < totalQuestions - 1) {
      setCurrentQuestion(currentQuestion + 1)
    }
  }

  const goToPreviousQuestion = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1)
    }
  }

  // Enhanced personality analysis with KNN weights for better feature extraction
  const analyzePersonality = (responses: Record<number, string>) => {
    const traits = {
      Extraversion: [],
      'Analytical Thinking': [],
      Creativity: [],
      Leadership: [],
      Adaptability: [],
      'Stress Tolerance': [],
      'Service Orientation': [],
    } as { [key: string]: number[] }

    // Calculate weighted scores for KNN feature space
    personalityQuestions.forEach(question => {
      const response = responses[question.id]
      if (response) {
        let score = parseInt(response)
        
        // Handle reverse scoring
        if (question.reverse) {
          score = 6 - score
        }
        
        // Apply KNN weight for more important traits
        const weight = (question as any).knnWeight || 1.0
        
        // Map score to percentage (1-5 -> 20-100) with weight applied
        const baseScore = ((score - 1) / 4) * 80 + 20
        const weightedScore = Math.min(100, baseScore * weight)
        
        if (traits[question.trait]) {
          traits[question.trait].push(weightedScore)
        }
      }
    })

    // Calculate final weighted averages
    const finalTraits: { [key: string]: number } = {}
    Object.keys(traits).forEach(trait => {
      if (traits[trait].length > 0) {
        finalTraits[trait] = Math.round(
          traits[trait].reduce((sum, score) => sum + score, 0) / traits[trait].length
        )
      } else {
        finalTraits[trait] = 50 // Default neutral score
      }
    })
    return finalTraits
  }

  // Enhanced skills derivation with better mapping for KNN
  const deriveSkillsFromPersonality = (personalityScores: any) => {
    return [
      { 
        skill: "Problem Solving", 
        score: Math.min(Math.round(personalityScores['Analytical Thinking'] / 10), 10), 
        category: "Cognitive" 
      },
      { 
        skill: "Communication", 
        score: Math.min(Math.round((personalityScores['Extraversion'] + personalityScores['Service Orientation']) / 20), 10), 
        category: "Interpersonal" 
      },
      { 
        skill: "Leadership", 
        score: Math.min(Math.round(personalityScores['Leadership'] / 10), 10), 
        category: "Interpersonal" 
      },
      { 
        skill: "Creativity", 
        score: Math.min(Math.round(personalityScores['Creativity'] / 10), 10), 
        category: "Cognitive" 
      },
      { 
        skill: "Adaptability", 
        score: Math.min(Math.round(personalityScores['Adaptability'] / 10), 10), 
        category: "Personal" 
      },
      { 
        skill: "Technical Aptitude", 
        score: Math.min(Math.round((personalityScores['Analytical Thinking'] + personalityScores['Adaptability']) / 20), 10), 
        category: "Technical" 
      },
      { 
        skill: "Data Analysis", 
        score: Math.min(Math.round(personalityScores['Analytical Thinking'] / 10), 10), 
        category: "Technical" 
      },
      { 
        skill: "Project Management", 
        score: Math.min(Math.round((personalityScores['Leadership'] + personalityScores['Analytical Thinking'] + personalityScores['Stress Tolerance']) / 30), 10), 
        category: "Organizational" 
      },
    ]
  }

  const handleSubmit = async () => {
    setIsSubmitting(true)

    try {
      
      // Enhanced personality analysis with KNN weights
      const personalityScores = analyzePersonality(answers)
      
      // Prepare enhanced user profile with better KNN feature mapping
      const personalityTraits = Object.entries(personalityScores).map(([trait, score]) => ({
        trait,
        score
      }))

      // Enhanced skills derivation
      const skillsResults = deriveSkillsFromPersonality(personalityScores)

      const userProfile = {
        personalityTraits,
        skillsResults,
        preferences: {
          workEnvironment: personalityScores['Extraversion'] > 60 ? "Team-oriented" : "Independent",
          industry: personalityScores['Analytical Thinking'] > 60 ? "Technology" : "General",
          location: "Remote"
        },
        experience: "Entry Level",
        careerGoals: "Find a career that matches my personality and skills using KNN analysis"
      }

      let careerRecommendations: any[] = []
      let jobListings: any[] = []
      let enhancedResults: any = null
      let interactions: any[] = []

      // Priority 1: Get KNN recommendations if enabled and available
      if (useKNN && dbStatus === 'ready') {
        
        try {
          const knnResult = await EnhancedAPIService.getKNNRecommendations(userProfile, {
            k: kValue,
            useCache: false, // Always fresh for assessment
            includeDebug,
            saveToDatabase: true
          })

          if (knnResult?.success) {
            enhancedResults = knnResult
            careerRecommendations = knnResult.data.careers || knnResult.data.recommendations || []
            
            // Add KNN interaction for debug
            if (includeDebug) {
              interactions.push({
                timestamp: new Date().toISOString(),
                type: 'careers',
                method: 'knn',
                success: true,
                duration: knnResult.metadata?.requestDuration || 0,
                results: careerRecommendations.length
              })
            }
          } else {
            console.warn('⚠️ KNN recommendations failed:', knnResult.error)
          }
        } catch (error) {
          console.warn('⚠️ KNN service unavailable:', error)
        }
      }

      // Priority 2: Get AI recommendations if enabled and (KNN failed OR we want hybrid approach)
      if (useAI && apiStatus === 'ready' && (careerRecommendations.length < 3 || (useKNN && careerRecommendations.length > 0))) {
        
        try {
          const aiResult = await EnhancedAPIService.getCareerRecommendations(userProfile, selectedModel)
          
          if (aiResult?.success) {
            const aiCareers = aiResult.data.careers || []
            
            if (careerRecommendations.length === 0) {
              // Pure AI mode
              careerRecommendations = aiCareers.map((c: any) => ({
                ...c,
                knnEnhanced: false,
                source: 'ai'
              }))
            } else {
              // Hybrid mode: merge AI with KNN (avoid duplicates)
              const existingTitles = new Set(careerRecommendations.map(c => c.title.toLowerCase()))
              const newAiCareers = aiCareers
                .filter((c: any) => !existingTitles.has(c.title.toLowerCase()))
                .map((c: any) => ({
                  ...c,
                  knnEnhanced: false,
                  source: 'hybrid'
                }))
              
              careerRecommendations = [...careerRecommendations, ...newAiCareers]
            }
            
            // Add AI interaction for debug
            if (includeDebug) {
              interactions.push({
                timestamp: new Date().toISOString(),
                type: 'careers',
                method: 'ai',
                model: selectedModel,
                success: true,
                duration: aiResult.metadata?.requestDuration || 0,
                results: aiCareers.length
              })
            }
          }
        } catch (error) {
          console.warn('⚠️ AI recommendations failed:', error)
        }
      }

      // Sort by match score for best results first
      careerRecommendations.sort((a: any, b: any) => (b.match || 0) - (a.match || 0))

      // Generate AI-powered job listings based on career recommendations
      if (careerRecommendations.length > 0) {
        const careerTitles = careerRecommendations.slice(0, 6).map((career: any) => career.title)
        
        const jobResult = await EnhancedAPIService.generateJobListings(careerTitles, userProfile, selectedModel)
        jobListings = jobResult.data.jobs || []
        
        // Add job generation interaction for debug
        if (includeDebug && jobListings.length > 0) {
          interactions.push({
            timestamp: new Date().toISOString(),
            type: 'jobs',
            method: 'ai',
            model: selectedModel,
            success: jobResult.success,
            duration: jobResult.metadata?.requestDuration || 0,
            results: jobListings.length
          })
        }
      }

      // Enhanced assessment data with comprehensive tracking
      const assessmentData = {
        personalityTraits,
        skillsResults,
        userProfile,
        careerRecommendations,
        jobListings,
        rawAnswers: answers,
        completedAt: new Date().toISOString(),
        
        // KNN specific tracking
        enhancedWithKNN: useKNN && dbStatus === 'ready' && careerRecommendations.some(c => c.source === 'knn'),
        knnAnalysis: enhancedResults?.data?.analysis,
        knnStats: {
          algorithm: 'Weighted KNN',
          kValue,
          totalProfiles: knnStats?.metrics?.totalAssessments || 0,
          cacheUsed: enhancedResults?.metadata?.cacheUsed || false,
          distanceMetric: 'Euclidean with personality weights'
        },
        
        // AI specific tracking
        claudeGenerated: useAI && apiStatus === 'ready' && careerRecommendations.some(c => c.source === 'ai' || c.source === 'hybrid'),
        aiProvider: 'claude' as const,
        
        // Assessment metadata
        assessmentId: enhancedResults?.data?.assessmentId || `assessment_${Date.now()}`,
        userId: enhancedResults?.data?.userId,
        errorFallback: careerRecommendations.length === 0,
        
        // Configuration tracking
        configuration: {
          useKNN,
          useAI,
          model: selectedModel,
          kValue,
          systemStatus: {
            api: apiStatus || 'unknown',
            database: dbStatus || 'unknown'
          }
        },
        
        // Job generation tracking
        jobsAiGenerated: jobListings.some(job => job.aiGenerated),
        jobGenerationModel: selectedModel,
        aiGenerated: true,
        
        // Debug information
        debugInfo: includeDebug ? {
          interactions,
          knnResult: enhancedResults?.debug,
          questionWeights: personalityQuestions.map(q => ({ 
            id: q.id, 
            trait: q.trait, 
            weight: (q as any).knnWeight || 1.0 
          })),
          systemStats: knnStats
        } : undefined,
        
        // Enhanced interactions tracking
        interactions: includeDebug ? interactions : []
      }

      // Save to localStorage
      localStorage.setItem('personalityAssessment', JSON.stringify(assessmentData))

      // Navigate to results
      if (careerRecommendations.length > 0) {
        router.push("/assessment/results")
      } else {
        router.push("/assessment/skills")
      }

    } catch (error) {
      console.warn('❌ Error during enhanced assessment:', error)
      
      // Fallback: save basic assessment and redirect to skills
      const personalityScores = analyzePersonality(answers)
      const personalityTraits = Object.entries(personalityScores).map(([trait, score]) => ({
        trait,
        score
      }))

      const fallbackData = {
        personalityTraits,
        skillsResults: deriveSkillsFromPersonality(personalityScores),
        userProfile: { personalityTraits },
        careerRecommendations: [],
        jobListings: [],
        rawAnswers: answers,
        completedAt: new Date().toISOString(),
        enhancedWithKNN: false,
        claudeGenerated: false,
        errorFallback: true,
        error: error instanceof Error ? error.message : 'Assessment processing failed',
        configuration: {
          useKNN,
          useAI,
          model: selectedModel,
          kValue,
          systemStatus: {
            api: apiStatus || 'error',
            database: dbStatus || 'error'
          }
        },
        jobsAiGenerated: false,
        jobGenerationModel: null,
        aiGenerated: false,
        aiProvider: 'fallback' as const
      }

      localStorage.setItem('personalityAssessment', JSON.stringify(fallbackData))
      router.push("/assessment/skills")
      
    } finally {
      setIsSubmitting(false)
    }
  }

  const currentQuestionData = personalityQuestions[currentQuestion]
  const currentAnswer = answers[currentQuestionData.id] || ""
  const isLastQuestion = currentQuestion === totalQuestions - 1

  const getStatusIcon = (status: any) => {
    switch (status) {
      case 'ready':
        return <CheckCircle className="h-4 w-4 text-green-600" />
      case 'error':
        return <AlertCircle className="h-4 w-4 text-red-600" />
      case 'checking':
        return <Activity className="h-4 w-4 animate-spin text-blue-600" />
      default:
        return null
    }
  }

  // Calculate current personality insights for real-time feedback
  const getCurrentInsights = () => {
    if (Object.keys(answers).length < 3) return null
    
    const currentScores = analyzePersonality(answers)
    const topTraits = Object.entries(currentScores)
      .sort(([,a], [,b]) => b - a)
      .slice(0, 2)
      .map(([trait]) => trait)
    
    return {
      dominantTraits: topTraits,
      progress: Object.keys(answers).length,
      knnReadiness: Object.keys(answers).length >= 8 ? 'Ready' : 'Partial'
    }
  }

  const insights = getCurrentInsights()

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-2xl mx-auto">
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-2xl font-bold mb-2 flex items-center gap-2">
                <Brain className="h-5 w-5 text-purple-600" />
                <Bot className="h-5 w-5 text-blue-600" />
                Enhanced KNN Personality Assessment
              </h1>
              <p className="text-gray-600">
                Advanced personality analysis using KNN algorithm and AI for personalized career matching.
              </p>
            </div>
          </div>

          {/* Enhanced System Status Panel */}
          <div className="mb-6 p-4 bg-gradient-to-r from-purple-50 to-blue-50 rounded-lg border">
            <h3 className="font-medium mb-3 flex items-center gap-2">
              <Settings className="h-4 w-4" />
              System Status & KNN Configuration
            </h3>
            
            {/* Status Row with KNN Statistics */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div className="flex items-center justify-between p-3 bg-white rounded-lg border">
                <div className="flex items-center gap-2">
                  <Bot className="h-4 w-4 text-blue-600" />
                  <span className="font-medium">AI Service</span>
                </div>
                <div className="flex items-center gap-2">
                  {getStatusIcon(apiStatus)}
                  <span className={`text-sm ${
                    apiStatus === 'ready' ? 'text-green-600' : 
                    apiStatus === 'error' ? 'text-red-600' : 'text-blue-600'
                  }`}>
                    {apiStatus === 'ready' ? 'Ready' : apiStatus === 'error' ? 'Error' : 'Checking'}
                  </span>
                </div>
              </div>

              <div className="flex items-center justify-between p-3 bg-white rounded-lg border">
                <div className="flex items-center gap-2">
                  <Database className="h-4 w-4 text-purple-600" />
                  <span className="font-medium">KNN Database</span>
                  {knnStats?.metrics?.totalAssessments && (
                    <Badge variant="outline" className="text-xs">
                      {knnStats.metrics.totalAssessments} profiles
                    </Badge>
                  )}
                </div>
                <div className="flex items-center gap-2">
                  {getStatusIcon(dbStatus)}
                  <span className={`text-sm ${
                    dbStatus === 'ready' ? 'text-green-600' : 
                    dbStatus === 'error' ? 'text-red-600' : 'text-blue-600'
                  }`}>
                    {dbStatus === 'ready' ? 'Ready' : dbStatus === 'error' ? 'Error' : 'Checking'}
                  </span>
                </div>
              </div>
            </div>

            {/* KNN Statistics Display */}
            {knnStats?.metrics && (
              <div className="mb-4 p-3 bg-white rounded-lg border">
                <h4 className="font-medium mb-2 flex items-center gap-2">
                  <BarChart3 className="h-4 w-4 text-purple-600" />
                  KNN Database Statistics
                </h4>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                  <div className="text-center">
                    <div className="font-semibold text-purple-800">{knnStats.metrics.totalAssessments || 0}</div>
                    <div className="text-purple-600 text-xs">Total Profiles</div>
                  </div>
                  <div className="text-center">
                    <div className="font-semibold text-blue-800">{knnStats.metrics.avgProcessingTime || 0}ms</div>
                    <div className="text-blue-600 text-xs">Avg Process Time</div>
                  </div>
                  <div className="text-center">
                    <div className="font-semibold text-green-800">{knnStats.metrics.cacheHitRate || 0}%</div>
                    <div className="text-green-600 text-xs">Cache Hit Rate</div>
                  </div>
                  <div className="text-center">
                    <div className="font-semibold text-orange-800">{knnStats.metrics.topCareers?.length || 0}</div>
                    <div className="text-orange-600 text-xs">Top Careers</div>
                  </div>
                </div>
              </div>
            )}

            {/* Enhanced Configuration Options */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {/* KNN Toggle */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Brain className="h-4 w-4 text-purple-600" />
                  <span className="text-sm font-medium">KNN</span>
                </div>
                <Switch 
                  checked={useKNN} 
                  onCheckedChange={setUseKNN}
                  disabled={dbStatus !== 'ready'}
                />
              </div>

              {/* AI Toggle */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Bot className="h-4 w-4 text-blue-600" />
                  <span className="text-sm font-medium">AI</span>
                </div>
                <Switch 
                  checked={useAI} 
                  onCheckedChange={setUseAI}
                  disabled={apiStatus !== 'ready'}
                />
              </div>

              {/* K Value Selection */}
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium">K-Value:</span>
                <select
                  value={kValue}
                  onChange={(e) => setKValue(parseInt(e.target.value))}
                  className="px-2 py-1 border rounded text-sm"
                  disabled={!useKNN || dbStatus !== 'ready'}
                >
                  <option value={3}>3 (Fast)</option>
                  <option value={5}>5 (Balanced)</option>
                  <option value={7}>7 (Accurate)</option>
                  <option value={10}>10 (Comprehensive)</option>
                </select>
              </div>

              {/* AI Model Selection */}
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium">Model:</span>
                <select
                  value={selectedModel}
                  onChange={(e) => setSelectedModel(e.target.value as any)}
                  className="px-2 py-1 border rounded text-sm"
                  disabled={!useAI || apiStatus !== 'ready'}
                >
                  <option value="haiku">🚀 Haiku (Fast)</option>
                  <option value="sonnet">⚡ Sonnet (Balanced)</option>
                  <option value="opus">🎯 Opus (Premium)</option>
                </select>
              </div>
            </div>

            {/* Advanced Debug Option */}
            <div className="mt-4 pt-3 border-t">
              <label className="flex items-center gap-2 text-sm">
                <Switch 
                  checked={includeDebug}
                  onCheckedChange={setIncludeDebug}
                />
                <Code className="h-3 w-3" />
                Include Debug Information & Detailed Analytics
              </label>
            </div>
          </div>
          
          {/* Progress Section */}
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-gray-500">
              Question {currentQuestion + 1} of {totalQuestions}
            </span>
            <div className="flex items-center gap-2">
              {insights && (
                <Badge variant="outline" className="text-xs">
                  KNN: {insights.knnReadiness}
                </Badge>
              )}
              <span className="text-sm font-medium">{Math.round(progress)}%</span>
            </div>
          </div>
          <Progress value={progress} className="h-2" />
        </div>

        {/* Question Card */}
        <Card>
          <CardHeader>
            <CardTitle className="text-xl flex items-center justify-between">
              <span>{currentQuestionData.question}</span>
              <div className="flex items-center gap-2">
                <Badge variant="outline" className="text-xs">
                  {currentQuestionData.trait}
                </Badge>
                {(currentQuestionData as any).knnWeight > 1.0 && (
                  <Badge variant="secondary" className="text-xs bg-purple-100 text-purple-800">
                    <Target className="h-3 w-3 mr-1" />
                    KNN Key
                  </Badge>
                )}
              </div>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <RadioGroup value={currentAnswer} onValueChange={handleAnswer} className="space-y-3">
              {currentQuestionData.options.map((option) => (
                <div key={option.value} className="flex items-center space-x-2 p-2 rounded-md hover:bg-gray-50">
                  <RadioGroupItem value={option.value} id={`option-${option.value}`} />
                  <Label htmlFor={`option-${option.value}`} className="flex-grow cursor-pointer">
                    {option.label}
                  </Label>
                </div>
              ))}
            </RadioGroup>
          </CardContent>
          <CardFooter className="flex justify-between">
            <Button variant="outline" onClick={goToPreviousQuestion} disabled={currentQuestion === 0}>
              <ArrowLeft className="mr-2 h-4 w-4" />
              Previous
            </Button>

            {isLastQuestion ? (
              <Button 
                onClick={handleSubmit} 
                disabled={!currentAnswer || isSubmitting || (apiStatus === 'error' && dbStatus === 'error')}
                className="min-w-[200px]"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    {useKNN && useAI 
                      ? 'Processing KNN + AI...' 
                      : useKNN 
                        ? 'Running KNN Analysis...'
                        : 'Generating AI Results...'
                    }
                  </>
                ) : (
                  <>
                    {useKNN && useAI ? (
                      <>
                        <Brain className="mr-2 h-4 w-4" />
                        <Bot className="mr-2 h-4 w-4" />
                        Get Enhanced Results
                      </>
                    ) : useKNN ? (
                      <>
                        <Brain className="mr-2 h-4 w-4" />
                        Get KNN Results
                      </>
                    ) : useAI ? (
                      <>
                        <Bot className="mr-2 h-4 w-4" />
                        Get AI Results
                      </>
                    ) : (
                      'Complete Assessment'
                    )}
                  </>
                )}
              </Button>
            ) : (
              <Button onClick={goToNextQuestion} disabled={!currentAnswer}>
                Next
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            )}
          </CardFooter>
        </Card>

        {/* Enhanced Footer with Real-time Insights */}
        <div className="mt-6 text-center text-sm text-gray-500">
          <p>Answer honestly for the most accurate KNN-enhanced personality analysis and career recommendations.</p>
          
          {/* Real-time Progress Insights */}
          {insights && (
            <div className="mt-4 p-3 bg-gradient-to-r from-purple-50 to-blue-50 rounded-lg border">
              <div className="flex items-center justify-center gap-2 mb-2">
                <Users className="h-4 w-4 text-purple-600" />
                <span className="font-medium text-purple-800">KNN Analysis Preview</span>
              </div>
              <p className="text-gray-700 text-sm mb-2">
                <strong>Emerging Traits:</strong> {insights.dominantTraits.join(', ')}
              </p>
              <p className="text-gray-600 text-xs">
                Progress: {insights.progress}/{totalQuestions} questions • 
                KNN Readiness: {insights.knnReadiness} • 
                {knnStats?.metrics?.totalAssessments && (
                  <>Database: {knnStats.metrics.totalAssessments} profiles available</>
                )}
              </p>
            </div>
          )}

          {/* System Status Messages */}
          {(apiStatus === 'error' && dbStatus === 'error') && (
            <div className="mt-4 p-3 bg-red-50 rounded-lg border border-red-200">
              <div className="flex items-center justify-center gap-2 mb-2">
                <AlertCircle className="h-4 w-4 text-red-600" />
                <span className="font-medium text-red-800">Services Unavailable</span>
              </div>
              <p className="text-red-700 text-sm">
                Both AI and KNN services are unavailable. Assessment will proceed to skills evaluation.
              </p>
            </div>
          )}

          {apiStatus === 'error' && dbStatus === 'ready' && (
            <div className="mt-4 p-3 bg-blue-50 rounded-lg border border-blue-200">
              <div className="flex items-center justify-center gap-2 mb-2">
                <Brain className="h-4 w-4 text-blue-600" />
                <span className="font-medium text-blue-800">KNN Mode Active</span>
              </div>
              <p className="text-blue-700 text-sm">
                Using advanced KNN algorithm with {knnStats?.metrics?.totalAssessments || 0} career profiles for data-driven matching.
              </p>
            </div>
          )}

          {apiStatus === 'ready' && dbStatus === 'error' && (
            <div className="mt-4 p-3 bg-green-50 rounded-lg border border-green-200">
              <div className="flex items-center justify-center gap-2 mb-2">
                <Bot className="h-4 w-4 text-green-600" />
                <span className="font-medium text-green-800">AI Mode Active</span>
              </div>
              <p className="text-green-700 text-sm">
                Using Claude {selectedModel.toUpperCase()} for intelligent career analysis and personalized recommendations.
              </p>
            </div>
          )}

          {apiStatus === 'ready' && dbStatus === 'ready' && (
            <div className="mt-4 p-3 bg-purple-50 rounded-lg border border-purple-200">
              <div className="flex items-center justify-center gap-2 mb-2">
                <Brain className="h-4 w-4 text-purple-600" />
                <Bot className="h-4 w-4 text-blue-600" />
                <span className="font-medium text-purple-800">Enhanced Mode Ready</span>
              </div>
              <p className="text-purple-700 text-sm">
                Optimal setup: KNN algorithm + Claude {selectedModel.toUpperCase()} AI for the most accurate career matching.
              </p>
            </div>
          )}

          {/* Enhanced Configuration Summary */}
          <div className="mt-4 p-3 bg-gray-50 rounded-lg border">
            <div className="flex flex-wrap justify-center gap-2">
              <Badge variant="outline" className={useKNN ? 'border-purple-300 text-purple-700' : 'border-gray-300'}>
                <Brain className="h-3 w-3 mr-1" />
                KNN: {useKNN ? `ON (K=${kValue})` : 'OFF'}
              </Badge>
              <Badge variant="outline" className={useAI ? 'border-blue-300 text-blue-700' : 'border-gray-300'}>
                <Bot className="h-3 w-3 mr-1" />
                AI: {useAI ? selectedModel.toUpperCase() : 'OFF'}
              </Badge>
              {knnStats?.metrics?.totalAssessments && (
                <Badge variant="outline" className="border-purple-300 text-purple-700">
                  <Database className="h-3 w-3 mr-1" />
                  {knnStats.metrics.totalAssessments} Profiles
                </Badge>
              )}
              {includeDebug && (
                <Badge variant="outline" className="border-orange-300 text-orange-700">
                  <Code className="h-3 w-3 mr-1" />
                  Debug Mode
                </Badge>
              )}
            </div>
          </div>

          {/* Question-specific KNN Weight Indicator */}
          {(currentQuestionData as any).knnWeight > 1.0 && (
            <div className="mt-4 p-2 bg-purple-50 rounded-lg border border-purple-200">
              <div className="flex items-center justify-center gap-2">
                <Target className="h-3 w-3 text-purple-600" />
                <span className="text-purple-800 text-xs font-medium">
                  High KNN Impact Question (Weight: {(currentQuestionData as any).knnWeight}x)
                </span>
              </div>
              <p className="text-purple-700 text-xs mt-1">
                This question significantly influences your KNN career matching results.
              </p>
            </div>
          )}

          {/* Next Steps Preview */}
          {isLastQuestion && (
            <div className="mt-4 p-3 bg-blue-50 rounded-lg border border-blue-200">
              <p className="text-blue-800 text-sm font-medium mb-1">Next Steps:</p>
              <p className="text-blue-700 text-xs">
                {useKNN && dbStatus === 'ready' 
                  ? `KNN will analyze your profile against ${knnStats?.metrics?.totalAssessments || 'multiple'} career profiles for optimal matching.`
                  : 'Complete skills assessment for comprehensive career analysis.'
                }
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}