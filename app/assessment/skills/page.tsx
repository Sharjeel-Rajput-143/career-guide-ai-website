"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Slider } from "@/components/ui/slider"
import { Badge } from "@/components/ui/badge"
import { Switch } from "@/components/ui/switch"
import { 
  ArrowLeft, 
  ArrowRight, 
  Loader2, 
  Target, 
  TrendingUp, 
  Bot, 
  Code, 
  AlertCircle, 
  CheckCircle,
  Brain,
  Database,
  Settings
} from "lucide-react"

interface SkillQuestion {
  id: number;
  skill: string;
  description: string;
  category: string;
  examples: string[];
}

interface PersonalityTrait {
  trait: string;
  score: number;
}

interface KNNOptions {
  useKNN: boolean;
  useAI: boolean;
  k: number;
  useCache: boolean;
  includeDebug: boolean;
  saveToDatabase: boolean;
}

export default function EnhancedSkillsAssessment() {
  const router = useRouter()
  const [currentSkill, setCurrentSkill] = useState<number>(0)
  const [ratings, setRatings] = useState<Record<number, number>>({})
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false)
  const [personalityData, setPersonalityData] = useState<any>(null)
  const [selectedModel, setSelectedModel] = useState<'opus' | 'sonnet' | 'haiku'>('sonnet')
  const [apiStatus, setApiStatus] = useState<'checking' | 'ready' | 'error'>('checking')
  const [dbStatus, setDbStatus] = useState<'checking' | 'ready' | 'error'>('checking')
  const [knnSummary, setKnnSummary] = useState<any>(null);
  const [loadingKnnSummary, setLoadingKnnSummary] = useState(false);

  // KNN Configuration
  const [knnOptions, setKnnOptions] = useState<KNNOptions>({
    useKNN: true,
    useAI: true,
    k: 5,
    useCache: true,
    includeDebug: false,
    saveToDatabase: true
  })

  const skillsQuestions: SkillQuestion[] = [
    {
      id: 1,
      skill: "Problem Solving",
      description: "Ability to identify issues and find effective solutions",
      category: "Cognitive",
      examples: ["Debugging code", "Finding root causes", "Creative solutions"],
    },
    {
      id: 2,
      skill: "Communication",
      description: "Ability to convey information clearly and effectively",
      category: "Interpersonal",
      examples: ["Presentations", "Written reports", "Team discussions"],
    },
    {
      id: 3,
      skill: "Technical Aptitude",
      description: "Ability to understand and work with technology",
      category: "Technical",
      examples: ["Software tools", "Programming", "System analysis"],
    },
    {
      id: 4,
      skill: "Leadership",
      description: "Ability to guide and influence others towards a goal",
      category: "Interpersonal",
      examples: ["Team management", "Decision making", "Mentoring"],
    },
    {
      id: 5,
      skill: "Creativity",
      description: "Ability to generate innovative ideas and solutions",
      category: "Cognitive",
      examples: ["Design thinking", "Brainstorming", "Innovation"],
    },
    {
      id: 6,
      skill: "Data Analysis",
      description: "Ability to interpret and extract insights from data",
      category: "Technical",
      examples: ["Excel/Spreadsheets", "Statistical analysis", "Visualization"],
    },
    {
      id: 7,
      skill: "Project Management",
      description: "Ability to plan, organize and execute projects",
      category: "Organizational",
      examples: ["Timeline planning", "Resource allocation", "Risk management"],
    },
    {
      id: 8,
      skill: "Adaptability",
      description: "Ability to adjust to new situations and changes",
      category: "Personal",
      examples: ["Learning new tools", "Changing priorities", "Remote work"],
    },
  ]

  const MODEL_OPTIONS = [
    {
      id: 'opus' as const,
      name: 'Claude 3 Opus',
      description: 'Highest quality analysis with deep insights',
      icon: '�',
      speed: 1,
      quality: 5,
      cost: 'High' as const
    },
    {
      id: 'sonnet' as const, 
      name: 'Claude 3.5 Sonnet',
      description: 'Balanced performance and cost-effectiveness',
      icon: '⚡',
      speed: 3,
      quality: 4,
      cost: 'Medium' as const
    },
    {
      id: 'haiku' as const,
      name: 'Claude 3.5 Haiku', 
      description: 'Fastest responses with good accuracy',
      icon: '🚀',
      speed: 5,
      quality: 3,
      cost: 'Low' as const
    }
  ]

  useEffect(() => {
    // Load personality assessment data
    const storedPersonality = localStorage.getItem('personalityAssessment')
    if (storedPersonality) {
      const data = JSON.parse(storedPersonality)
      setPersonalityData(data)
    }
    
    checkSystemStatus()
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
      console.warn('System status check failed:', error)
    }
  }

  const handleRating = (value: number[]): void => {
    setRatings({
      ...ratings,
      [skillsQuestions[currentSkill].id]: value[0],
    })
  }

  const goToNextSkill = (): void => {
    if (currentSkill < skillsQuestions.length - 1) {
      setCurrentSkill(currentSkill + 1)
    }
  }

  const goToPreviousSkill = (): void => {
    if (currentSkill > 0) {
      setCurrentSkill(currentSkill - 1)
    }
  }

  const analyzeSkillProfile = () => {
    const skillsByCategory: { [category: string]: any[] } = {}
    const topSkills: any[] = []
    const skillGaps: any[] = []

    Object.entries(ratings).forEach(([skillId, rating]) => {
      const skillData = skillsQuestions.find(s => s.id === parseInt(skillId))
      if (skillData) {
        const skillInfo = {
          skill: skillData.skill,
          score: rating,
          category: skillData.category
        }

        if (!skillsByCategory[skillData.category]) {
          skillsByCategory[skillData.category] = []
        }
        skillsByCategory[skillData.category].push(skillInfo)

        if (rating >= 7) {
          topSkills.push(skillInfo)
        } else if (rating < 5) {
          skillGaps.push(skillInfo)
        }
      }
    })

    return {
      skillsByCategory,
      topSkills: topSkills.sort((a, b) => b.score - a.score),
      skillGaps: skillGaps.sort((a, b) => a.score - b.score),
      averageScore: Object.values(ratings).reduce((sum: number, r: number) => sum + r, 0) / Object.values(ratings).length
    }
  }

  const handleSubmit = async (): Promise<void> => {
    setIsSubmitting(true)
  
    try {
      const skillsAnalysis = analyzeSkillProfile()
  
      const skillsResults = skillsQuestions.map(skill => ({
        skill: skill.skill,
        score: ratings[skill.id] || 5,
        category: skill.category
      }))
  
      const technicalAptitudeSkill = skillsResults.find(s => s.skill === "Technical Aptitude")
      const technicalScore = technicalAptitudeSkill?.score || 5
      
      const completeUserProfile = {
        personalityTraits: personalityData?.personalityTraits || [
          { trait: "Extraversion", score: 65 },
          { trait: "Analytical Thinking", score: 82 },
          { trait: "Creativity", score: 70 },
          { trait: "Leadership", score: 75 },
          { trait: "Adaptability", score: 68 },
        ],
        skillsResults: skillsResults,
        preferences: {
          workEnvironment: skillsAnalysis.averageScore > 6 ? "Team-oriented" : "Independent",
          industry: technicalScore > 6 ? "Technology" : "General",
          location: "Remote"
        },
        experience: skillsAnalysis.averageScore > 7 ? "Mid Level" : "Entry Level",
        careerGoals: "Find a career that matches my skills and personality",
        skillsAnalysis: skillsAnalysis,
        model: selectedModel
      }
  
      let careerRecommendations: any[] = []
      let enhancedResults: any = null
      let interactions: any[] = []
      let finalKnnStats: any = null // Declare a variable to hold the final knnStats

      // Priority 1: Get KNN recommendations if enabled and available
      if (knnOptions.useKNN && dbStatus === 'ready') {
        
        try {
          const knnResponse = await fetch('/api/knn-recommendations', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              userProfile: completeUserProfile,
              options: {
                k: knnOptions.k,
                useCache: knnOptions.useCache,
                includeDebug: knnOptions.includeDebug,
                saveToDatabase: knnOptions.saveToDatabase
              }
            })
          })
  
          const knnResultJson = await knnResponse.json()
          
          if (knnResultJson.success) {
            enhancedResults = knnResultJson
            careerRecommendations = knnResultJson.data.careers || knnResultJson.data.recommendations || []
            
            // Populate finalKnnStats from the KNN result
            finalKnnStats = {
              algorithm: 'Weighted KNN',
              kValue: knnOptions.k,
              totalProfiles: enhancedResults.data.analysis?.totalCareers || 0, // Use actual total careers from KNN analysis
              cacheUsed: enhancedResults.metadata?.cacheUsed || false,
              distanceMetric: 'Euclidean with personality weights',
              similarProfiles: enhancedResults.debug?.knnResults?.map((r:any) => ({
                id: r.career.id,
                similarity: r.similarity,
                career: r.career.title,
                experience: r.career.experienceLevel,
                industry: r.career.industry,
                matchReasons: r.matchReasons
              })) || []
            };
            
            // Add KNN interaction for debug
            if (knnOptions.includeDebug) {
              interactions.push({
                timestamp: new Date().toISOString(),
                type: 'careers',
                method: 'knn',
                success: true,
                duration: enhancedResults.metadata?.requestDuration || 0,
                results: careerRecommendations.length
              })
            }
          } else {
            console.warn('⚠️ KNN recommendations failed:', knnResultJson.error)
          }
        } catch (error) {
          console.warn('⚠️ KNN service unavailable:', error)
        }
      }

      // Priority 2: Get AI recommendations if enabled and (KNN failed OR we want hybrid approach)
      if (knnOptions.useAI && apiStatus === 'ready' && (careerRecommendations.length < 3 || (knnOptions.useKNN && careerRecommendations.length > 0))) {
        
        try {
          const aiResponse = await fetch('/api/career-recommendations', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              personalityTraits: completeUserProfile.personalityTraits,
              skillsResults: completeUserProfile.skillsResults,
              preferences: completeUserProfile.preferences,
              experience: completeUserProfile.experience,
              careerGoals: completeUserProfile.careerGoals,
              model: selectedModel
            })
          })
  
          const aiResult = await aiResponse.json()
          
          if (aiResult.success) {
            const aiCareers = aiResult.data.careers || []
            const existingTitles = new Set(careerRecommendations.map(c => c.title.toLowerCase()))
            const newAiCareers = aiCareers
              .filter((c: any) => !existingTitles.has(c.title.toLowerCase()))
              .map((c: any) => ({
                ...c,
                knnEnhanced: false,
                source: 'hybrid' // Mark as hybrid if KNN was also used
              }))
            
            careerRecommendations = [...careerRecommendations, ...newAiCareers]
            
            // Add AI interaction for debug
            if (knnOptions.includeDebug) {
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
      
      // If KNN was not used or failed, and AI was not used or failed, ensure finalKnnStats is initialized
      if (!finalKnnStats) {
        finalKnnStats = {
          algorithm: 'Weighted KNN',
          kValue: knnOptions.k,
          totalProfiles: 0, // Default to 0 if no KNN run
          cacheUsed: false,
          distanceMetric: 'Euclidean with personality weights',
          similarProfiles: []
        };
      }

      // Sort by match score for best results first
      careerRecommendations.sort((a: any, b: any) => (b.match || 0) - (a.match || 0))

      // Generate AI-powered job listings based on career recommendations
      let jobListings: any[] = []; // Initialize jobListings here
      if (careerRecommendations.length > 0) {
        const careerTitles = careerRecommendations.slice(0, 6).map((career: any) => career.title)
        
        const jobResult = await generateJobListings(careerTitles, completeUserProfile)
        jobListings = jobResult.map((job: any) => ({
          ...job,
          aiGenerated: true,
          source: 'ai',
          generatedBy: job.generatedBy || `Claude ${selectedModel.toUpperCase()}`,
          generatedAt: new Date().toISOString()
        }))
      
        
        // Add job generation interaction for debug
        if (knnOptions.includeDebug && jobListings.length > 0) {
          interactions.push({
            timestamp: new Date().toISOString(),
            type: 'jobs',
            method: 'ai',
            model: selectedModel,
            success: true, // Assuming generateJobListings throws on failure
            duration: 0, // You might want to add duration tracking here
            results: jobListings.length
          })
        }
      }

      // Enhanced assessment data with comprehensive tracking
      const assessmentData = {
        personalityTraits: completeUserProfile.personalityTraits,
        skillsResults: completeUserProfile.skillsResults,
        userProfile: completeUserProfile,
        careerRecommendations,
        jobListings: jobListings, // Populate jobListings here
        rawAnswers: ratings, // Use ratings for skills assessment answers
        completedAt: new Date().toISOString(),
        
        // KNN specific tracking
        enhancedWithKNN: knnOptions.useKNN && dbStatus === 'ready' && careerRecommendations.some(c => c.source === 'knn'),
        knnAnalysis: enhancedResults?.data?.analysis || null, // Ensure it's null if not available
        knnStats: finalKnnStats, // Use the populated finalKnnStats
        
        // AI specific tracking
        claudeGenerated: knnOptions.useAI && apiStatus === 'ready' && careerRecommendations.some(c => c.source === 'ai' || c.source === 'hybrid'),
        aiProvider: 'claude' as const,
        
        // Assessment metadata
        assessmentId: enhancedResults?.data?.assessmentId || `assessment_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        userId: enhancedResults?.data?.userId || `user_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        errorFallback: careerRecommendations.length === 0,
        
        // Configuration tracking
        configuration: {
          useKNN: knnOptions.useKNN,
          useAI: knnOptions.useAI,
          model: selectedModel,
          kValue: knnOptions.k,
          systemStatus: {
            api: apiStatus || 'unknown',
            database: dbStatus || 'unknown'
          }
        },
        
        // Job generation tracking (will be updated after job generation)
        jobsAiGenerated: jobListings.length > 0, // Set based on generatedJobs
        jobGenerationModel: selectedModel,
        aiGenerated: true,
        
        // Debug information
        debugInfo: knnOptions.includeDebug ? {
          interactions,
          knnResult: enhancedResults?.debug,
          questionWeights: skillsQuestions.map(q => ({ // Changed to skillsQuestions
            id: q.id, 
            skill: q.skill, 
            // No specific KNN weight for skills questions in this component, so default
            weight: 1.0 
          })),
          systemStats: knnSummary // Use knnSummary from state, or fetch if not available
        } : undefined,
        
        // Enhanced interactions tracking
        interactions: knnOptions.includeDebug ? interactions : []
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
      console.error('❌ Error during enhanced assessment:', error)
      // Use a custom message box instead of alert
      // alert(`Enhanced Assessment Failed: ${error instanceof Error ? error.message : 'Unknown error'}. Please try again.`)
      
      // Fallback: save basic assessment and redirect to skills
      const personalityTraits = personalityData?.personalityTraits || [
        { trait: "Extraversion", score: 50 }, // Default if personality data is missing
        { trait: "Analytical Thinking", score: 50 },
        { trait: "Creativity", score: 50 },
        { trait: "Leadership", score: 50 },
        { trait: "Adaptability", score: 50 },
      ];

      const fallbackData = {
        personalityTraits,
        skillsResults: skillsQuestions.map(skill => ({ // Use default ratings if not available
          skill: skill.skill,
          score: ratings[skill.id] || 5,
          category: skill.category
        })),
        userProfile: { 
          personalityTraits,
          skillsResults: skillsQuestions.map(skill => ({
            skill: skill.skill,
            score: ratings[skill.id] || 5,
            category: skill.category
          })),
          preferences: { workEnvironment: "Independent", industry: "General", location: "Remote" },
          experience: "Entry Level",
          careerGoals: "Find a career that matches my skills and personality"
        },
        careerRecommendations: [],
        jobListings: [],
        rawAnswers: ratings,
        completedAt: new Date().toISOString(),
        enhancedWithKNN: false,
        claudeGenerated: false,
        errorFallback: true,
        error: error instanceof Error ? error.message : 'Assessment processing failed',
        configuration: {
          useKNN: knnOptions.useKNN,
          useAI: knnOptions.useAI,
          model: selectedModel,
          kValue: knnOptions.k,
          systemStatus: {
            api: apiStatus || 'error',
            database: dbStatus || 'error'
          }
        },
        jobsAiGenerated: false,
        jobGenerationModel: null,
        aiGenerated: false,
        aiProvider: 'fallback' as const,
        knnAnalysis: null, // Ensure these are null on fallback
        knnStats: null, // Ensure these are null on fallback
        debugInfo: knnOptions.includeDebug ? {
          interactions: [],
          knnResult: null,
          questionWeights: skillsQuestions.map(q => ({ id: q.id, skill: q.skill, weight: 1.0 })),
          systemStats: null
        } : undefined,
        interactions: knnOptions.includeDebug ? [] : []
      }

      localStorage.setItem('personalityAssessment', JSON.stringify(fallbackData))
      router.push("/assessment/results") // Redirect to results page even on error to show fallback
      
    } finally {
      setIsSubmitting(false)
    }
  }

  const generateJobListings = async (careerTitles: string[], userProfile: any) => {
    try {
      
      // Call the AI job recommendations API
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
          numberOfJobs: 8, // Request 8 diverse jobs
          model: selectedModel // Use the same model as career recommendations
        })
      })
  
      if (!response.ok) {
        const errorData = await response.json()
        console.error('❌ AI job generation failed:', errorData)
        throw new Error(`AI job generation failed: ${response.status}`)
      }
  
      const result = await response.json()
      
      if (result.success && result.data.jobs) {
        return result.data.jobs.map((job: any) => ({
          id: job.id,
          title: job.title,
          company: job.company,
          location: job.location,
          type: job.type || 'Full-time',
          salary: job.salary,
          description: job.description,
          requirements: job.requirements,
          benefits: job.benefits || [],
          matchScore: job.matchScore,
          posted: job.posted,
          applicants: job.applicants,
          companySize: job.companySize,
          industry: job.industry,
          remote: job.remote,
          experienceLevel: job.experienceLevel,
          aiGenerated: true,
          source: 'ai',
          generatedBy: job.generatedBy
        }))
      } else {
        console.error('❌ Invalid AI job response:', result)
        throw new Error('Invalid response from AI job service')
      }
  
    } catch (error) {
      console.error('❌ Error generating AI jobs:', error)
      // Since you don't want fallback, we'll return empty array or throw error
      throw new Error(`Failed to generate AI jobs: ${error instanceof Error ? error.message : 'Unknown error'}`)
    }
  }

  const currentSkillData = skillsQuestions[currentSkill]
  const currentRating = ratings[currentSkillData.id] || 5
  const isLastSkill = currentSkill === skillsQuestions.length - 1
  const progress = ((currentSkill + 1) / skillsQuestions.length) * 100

  const getRatingLabel = (rating: number): string => {
    if (rating <= 2) return "Beginner"
    if (rating <= 4) return "Basic"
    if (rating <= 6) return "Intermediate"
    if (rating <= 8) return "Advanced"
    return "Expert"
  }

  const getRatingColor = (rating: number): string => {
    if (rating <= 3) return "text-red-600 bg-red-50"
    if (rating <= 5) return "text-yellow-600 bg-yellow-50"
    if (rating <= 7) return "text-blue-600 bg-blue-50"
    return "text-green-600 bg-green-50"
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'ready':
        return <CheckCircle className="h-4 w-4 text-green-600" />
      case 'error':
        return <AlertCircle className="h-4 w-4 text-red-600" />
      case 'checking':
        return <Loader2 className="h-4 w-4 animate-spin text-blue-600" />
      default:
        return null
    }
  }

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-2xl font-bold mb-2 flex items-center gap-2">
                <Brain className="h-5 w-5 text-purple-600" />
                Enhanced KNN + AI Skills Assessment
              </h1>
              <p className="text-gray-600">
                Advanced career matching using K-Nearest Neighbors algorithm with database persistence and AI analysis
              </p>
            </div>
          </div>

          {/* System Status Panel */}
          <div className="mb-6 p-4 bg-gradient-to-r from-purple-50 to-blue-50 rounded-lg border">
            <h3 className="font-medium mb-3 flex items-center gap-2">
              <Settings className="h-4 w-4" />
              System Status & Configuration
            </h3>
            
            {/* Status Row */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div className="flex items-center justify-between p-3 bg-white rounded-lg border">
                <div className="flex items-center gap-2">
                  <Bot className="h-4 w-4 text-blue-600" />
                  <span className="font-medium">AI</span>
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
                  <span className="font-medium">KNN</span>
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

            {/* Configuration Options */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {/* KNN Toggle */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Brain className="h-4 w-4 text-purple-600" />
                  <span className="text-sm font-medium">KNN</span>
                </div>
                <Switch 
                  checked={knnOptions.useKNN} 
                  onCheckedChange={(checked) => setKnnOptions(prev => ({ ...prev, useKNN: checked }))}
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
                  checked={knnOptions.useAI} 
                  onCheckedChange={(checked) => setKnnOptions(prev => ({ ...prev, useAI: checked }))}
                  disabled={apiStatus !== 'ready'}
                />
              </div>

              {/* K Value */}
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium">K:</span>
                <select
                  value={knnOptions.k}
                  onChange={(e) => setKnnOptions(prev => ({ ...prev, k: parseInt(e.target.value) }))}
                  className="px-2 py-1 border rounded text-sm"
                  disabled={!knnOptions.useKNN || dbStatus !== 'ready'}
                >
                  <option value={3}>3</option>
                  <option value={5}>5</option>
                  <option value={7}>7</option>
                  <option value={10}>10</option>
                </select>
              </div>

              {/* AI Model */}
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium">Model:</span>
                <select
                  value={selectedModel}
                  onChange={(e) => setSelectedModel(e.target.value as any)}
                  className="px-2 py-1 border rounded text-sm"
                  disabled={!knnOptions.useAI || apiStatus !== 'ready'}
                >
                  {MODEL_OPTIONS.map((model) => (
                    <option key={model.id} value={model.id}>
                      {model.icon} {model.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Advanced Options */}
            <div className="mt-4 pt-3 border-t">
              <div className="flex items-center gap-6">
                <label className="flex items-center gap-2 text-sm">
                  <Switch 
                    checked={knnOptions.useCache}
                    onCheckedChange={(checked) => setKnnOptions(prev => ({ ...prev, useCache: checked }))}
                  />
                  Use Cache
                </label>
                <label className="flex items-center gap-2 text-sm">
                  <Switch 
                    checked={knnOptions.saveToDatabase}
                    onCheckedChange={(checked) => setKnnOptions(prev => ({ ...prev, saveToDatabase: checked }))}
                  />
                  Save to DB
                </label>
                {/* <label className="flex items-center gap-2 text-sm">
                  <Switch 
                    checked={knnOptions.includeDebug}
                    onCheckedChange={(checked) => setKnnOptions(prev => ({ ...prev, includeDebug: checked }))}
                  />
                  Debug Mode
                </label> */}
              </div>
            </div>
          </div>

          {/* Progress */}
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-gray-500">
              Skill {currentSkill + 1} of {skillsQuestions.length}
            </span>
            <span className="text-sm font-medium">{Math.round(progress)}%</span>
          </div>
          <Progress value={progress} className="h-2" />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Assessment Card */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <div className="flex justify-between items-start mb-4">
                  <div className="flex-1">
                    <CardTitle className="text-xl mb-2 flex items-center gap-3">
                      <Target className="h-6 w-6 text-indigo-600" />
                      {currentSkillData.skill}
                    </CardTitle>
                    <p className="text-gray-600 mb-3">{currentSkillData.description}</p>
                    <Badge variant="outline" className="text-xs">
                      {currentSkillData.category}
                    </Badge>
                  </div>
                </div>

                {/* Examples */}
                {currentSkillData.examples && (
                  <div className="mb-6 p-4 bg-gray-50 rounded-lg">
                    <h4 className="font-medium mb-2">Examples include:</h4>
                    <div className="flex flex-wrap gap-2">
                      {currentSkillData.examples.map((example, index) => (
                        <span 
                          key={index}
                          className="text-sm px-3 py-1 bg-white border rounded-full text-gray-700"
                        >
                          {example}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </CardHeader>

              <CardContent className="pt-6">
                <div className="space-y-8">
                  <div>
                    <div className="flex justify-between items-center mb-4">
                      <p className="font-medium">Rate your current proficiency level:</p>
                      <div className={`px-3 py-1 rounded-full text-sm font-medium ${getRatingColor(currentRating)}`}>
                        {currentRating}/10 - {getRatingLabel(currentRating)}
                      </div>
                    </div>
                    
                    <Slider
                      value={[currentRating]}
                      min={1}
                      max={10}
                      step={1}
                      onValueChange={handleRating}
                      className="mb-6"
                    />
                    
                    <div className="flex justify-between text-sm text-gray-500">
                      <span>Beginner (1-2)</span>
                      <span>Basic (3-4)</span>
                      <span>Intermediate (5-6)</span>
                      <span>Advanced (7-8)</span>
                      <span>Expert (9-10)</span>
                    </div>
                  </div>

                  {/* Skill level descriptions */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                    <div className="p-3 border rounded-lg">
                      <h5 className="font-medium text-gray-800 mb-1">Beginner (1-4)</h5>
                      <p className="text-gray-600">Limited experience, learning basics</p>
                    </div>
                    <div className="p-3 border rounded-lg">
                      <h5 className="font-medium text-gray-800 mb-1">Intermediate (5-6)</h5>
                      <p className="text-gray-600">Some experience, can work independently</p>
                    </div>
                    <div className="p-3 border rounded-lg">
                      <h5 className="font-medium text-gray-800 mb-1">Advanced (7-8)</h5>
                      <p className="text-gray-600">Strong skills, can teach others</p>
                    </div>
                    <div className="p-3 border rounded-lg">
                      <h5 className="font-medium text-gray-800 mb-1">Expert (9-10)</h5>
                      <p className="text-gray-600">Mastery level, industry recognition</p>
                    </div>
                  </div>
                </div>
              </CardContent>

              <CardFooter className="flex justify-between">
                <Button variant="outline" onClick={goToPreviousSkill} disabled={currentSkill === 0}>
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  Previous
                </Button>

                {isLastSkill ? (
                  <Button 
                    onClick={handleSubmit} 
                    disabled={isSubmitting || (apiStatus === 'error' && dbStatus === 'error')}
                    className="min-w-[200px]"
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        {knnOptions.includeDebug 
                          ? 'Processing KNN + AI...' 
                          : 'Generating AI Results....'
                        }
                      </>
                    ) : (
                      <>
                        {knnOptions.useKNN && knnOptions.useAI ? (
                          <>
                            <Brain className="mr-2 h-4 w-4" />
                            <Bot className="mr-2 h-4 w-4" />
                            Get KNN + AI Results
                          </>
                        ) : knnOptions.useKNN ? (
                          <>
                            <Brain className="mr-2 h-4 w-4" />
                            Get KNN Results
                          </>
                        ) : knnOptions.useAI ? (
                          <>
                            <Bot className="mr-2 h-4 w-4" />
                            Get AI Results
                          </>
                        ) : (
                          'Get Results'
                        )}
                      </>
                    )}
                  </Button>
                ) : (
                  <Button onClick={goToNextSkill}>
                    Next Skill
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                )}
              </CardFooter>
            </Card>
          </div>

          {/* Enhanced Sidebar */}
          <div className="space-y-6">
            {/* System Status */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">System Status</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className={`p-3 rounded-lg border ${
                    apiStatus === 'ready' ? 'bg-green-50 border-green-200' : 
                    apiStatus === 'error' ? 'bg-red-50 border-red-200' : 
                    'bg-gray-50 border-gray-200'
                  }`}>
                    <div className="flex items-center gap-2 mb-1">
                      <Bot className="h-4 w-4" />
                      {getStatusIcon(apiStatus)}
                      <span className={`font-medium text-sm ${
                        apiStatus === 'ready' ? 'text-green-900' : 
                        apiStatus === 'error' ? 'text-red-900' : 
                        'text-gray-600'
                      }`}>
                        AI Provider: Claude {selectedModel.toUpperCase()}
                      </span>
                    </div>
                    {apiStatus === 'error' && (
                      <p className="text-xs text-red-700 mt-1">
                        ⚠️ API key not configured
                      </p>
                    )}
                  </div>
                  
                  <div className={`p-3 rounded-lg border ${
                    dbStatus === 'ready' ? 'bg-purple-50 border-purple-200' : 
                    dbStatus === 'error' ? 'bg-red-50 border-red-200' : 
                    'bg-gray-50 border-gray-200'
                  }`}>
                    <div className="flex items-center gap-2 mb-1">
                      <Database className="h-4 w-4" />
                      {getStatusIcon(dbStatus)}
                      <span className={`font-medium text-sm ${
                        dbStatus === 'ready' ? 'text-purple-900' : 
                        dbStatus === 'error' ? 'text-red-900' : 
                        'text-gray-600'
                      }`}>
                        KNN Database
                      </span>
                    </div>
                    {dbStatus === 'error' && (
                      <p className="text-xs text-red-700 mt-1">
                        ⚠️ Database connection error
                      </p>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}