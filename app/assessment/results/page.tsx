"use client"

import { useEffect, useMemo, useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import {
  User,
  Briefcase,
  TrendingUp,
  BookOpen,
  Star,
  ChevronRight,
  Download,
  Share2,
  ArrowLeft,
  MapPin,
  DollarSign,
  Users,
  Calendar,
  Bot,
  Code,
  Eye,
  EyeOff,
  Copy,
  Activity,
  MessageSquare,
  Clock,
  Settings,
  CheckCircle,
  AlertCircle,
  RefreshCw,
  Loader2,
  Brain,
  Database,
  BarChart3,
  Target,
  Zap,
  ChevronDown,
  ChevronUp,
  Info,
  ArrowRight
} from "lucide-react"

interface PersonalityTrait {
  trait: string;
  score: number;
}

interface SkillResult {
  skill: string;
  score: number;
  category?: string;
}

interface Career {
  title: string;
  match: number;
  description: string;
  skills: string[];
  salary: string;
  outlook: string;
  reasoning?: string;
  knnEnhanced?: boolean;
  source?: 'knn' | 'ai' | 'hybrid';
  industry?: string;
  experienceLevel?: string;
  workEnvironment?: string;
}

interface Job {
  title: string;
  company: string;
  location: string;
  salary: string;
  description: string;
  requirements: string[];
  matchScore: number;
  postedDate?: string;
  applicants?: string;
  type?: string;
  id?: string;
  posted?: string;
  knnEnhanced?: boolean;
  benefits?: string[];
  companySize?: string;
  industry?: string;
  remote?: boolean;
  experienceLevel?: string;
  aiGenerated?: boolean;
  source?: 'ai' | 'knn' | 'hybrid' | 'fallback';
  generatedBy?: string;
  generatedAt?: string;
}

interface AIInteraction {
  timestamp: string;
  type: 'careers' | 'jobs';
  prompt: {
    systemMessage: string;
    userMessage: string;
    fullPrompt: string;
  };
  response: {
    raw: string;
    parsed: any;
    success: boolean;
    error?: string;
  };
  metadata: {
    model: string;
    temperature: number;
    maxTokens: number;
    requestDuration: number;
    tokenUsage?: {
      inputTokens?: number;
      outputTokens?: number;
      totalTokens?: number;
    };
  };
}

interface KNNAnalysis {
  totalCareers: number;
  averageSimilarity: number;
  topSkillMatches: string[];
  topPersonalityMatches: string[];
  processingTime: number;
}

interface SimilarProfile {
  id: string;
  similarity: number;
  career: string;
  experience: string;
  industry?: string;
  matchReasons?: string[];
}

interface KNNStats {
  algorithm: string;
  kValue: number;
  confidenceScore: number;
  distanceMetric: string;
  totalProfiles: number;
  cacheUsed?: boolean;
  similarProfiles?: SimilarProfile[];
}

interface AssessmentData {
  personalityTraits: PersonalityTrait[];
  skillsResults: SkillResult[];
  userProfile: any;
  careerRecommendations: Career[];
  jobListings: Job[];
  rawAnswers?: any;
  completedAt: string;
  claudeGenerated?: boolean;
  errorFallback?: boolean;
  interactions?: AIInteraction[];
  aiProvider?: 'claude' | 'fallback';
  enhancedWithKNN?: boolean;
  knnAnalysis?: KNNAnalysis;
  knnStats?: KNNStats;
  assessmentId?: string;
  userId?: string;
  configuration?: {
    useKNN: boolean;
    useAI: boolean;
    model: string;
    kValue: number;
    systemStatus: {
      api: string;
      database: string;
    };
  };
  debugInfo?: any;
  jobsAiGenerated?: boolean;
  jobGenerationModel?: string;
  aiGenerated?: boolean;
}

const MODEL_OPTIONS = [
  {
    id: 'opus' as const,
    name: 'Claude 3 Opus',
    description: 'Highest quality analysis with deep insights',
    icon: '🎯',
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
        console.error(`❌ KNN error:`, result.error)
        throw new Error(result.error || 'KNN request failed')
      }
    } catch (error) {
      console.error(`❌ KNN service error:`, error)
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
        metadata: {
          requestDuration: Date.now() - startTime
        }
      }
    }
  },

  async getCareerRecommendations(userProfile: any, selectedModel: 'opus' | 'sonnet' | 'haiku' = 'sonnet') {
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
            requestDuration: duration,
            selectedModel
          }
        }
      } else {
        console.warn(`❌ ${selectedModel.toUpperCase()} error:`, result.error)
        throw new Error(result.error || `${selectedModel.toUpperCase()} request failed`)
      }
    } catch (error) {
      console.error(`❌ ${selectedModel.toUpperCase()} service error:`, error)
      const duration = Date.now() - startTime

      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
        metadata: {
          requestDuration: duration,
          selectedModel
        }
      }
    }
  }
}

export default function AssessmentResults() {
  const [knnInsights, setKnnInsights] = useState<{
    interpretation: string;
    patterns: string[];
    careerPath: Array<{
      role: string;
      timeframe: string;
      skills: string;
      reasoning: string;
    }>;
    skillGaps: Array<{
      name: string;
      priority: 'High' | 'Medium' | 'Low';
      reason: string;
    }>;
    industryInsights: Array<{
      name: string;
      matchPercentage: number;
      reason: string;
      growthPotential: 'High' | 'Medium' | 'Low';
    }>;
    networkingTips: string[];
    uniqueInsights: string;
    successPredictors: string[];
  } | null>(null);


  const router = useRouter()
  const [assessmentData, setAssessmentData] = useState<AssessmentData | null>(null)
  const [loading, setLoading] = useState(true)
  const [selectedTab, setSelectedTab] = useState<'overview' | 'careers' | 'jobs' | 'knn' | 'debug'>('overview')
  const [showDebugPanel, setShowDebugPanel] = useState(false)
  const [expandedInteraction, setExpandedInteraction] = useState<number | null>(null)
  const [showRawResponse, setShowRawResponse] = useState<{ [key: number]: boolean }>({})
  const [regenerating, setRegenerating] = useState(false)
  const [apiStatus, setApiStatus] = useState<'ready' | 'error' | 'checking' | null>(null)
  const [dbStatus, setDbStatus] = useState<'ready' | 'error' | 'checking' | null>(null)
  const [selectedModel, setSelectedModel] = useState<'opus' | 'sonnet' | 'haiku'>('sonnet')
  const [showKNNDetails, setShowKNNDetails] = useState(false)
  const [knnSummary, setKnnSummary] = useState<any>(null);
  const [loadingKnnSummary, setLoadingKnnSummary] = useState(false);
  const [loadingKnnInsights, setLoadingKnnInsights] = useState(false);

  useEffect(() => {
    const data = localStorage.getItem('personalityAssessment')
    if (data) {
      try {
        const parsedData = JSON.parse(data) as AssessmentData
        setAssessmentData(parsedData)

        if ((parsedData.interactions && parsedData.interactions.length > 0) || parsedData.debugInfo) {
          setShowDebugPanel(true)
        }

        if (parsedData.configuration?.model) {
          setSelectedModel(parsedData.configuration.model as any)
        }

        // Check if KNN is enhanced and fetch summary
        const isKNNEnhanced = parsedData.enhancedWithKNN || parsedData.configuration?.useKNN
        if (isKNNEnhanced) {
          // Set a flag to fetch summary after state is updated
          setTimeout(() => {
            fetchKNNSummary();
          }, 100);
        }
      } catch (error) {
        console.error('Error parsing assessment data:', error)
        router.push('/assessment')
      }
    } else {
      router.push('/assessment')
    }
    setLoading(false)
    checkSystemStatus()
  }, [router])


  const fetchKNNInsights = async () => {
    if (!assessmentData || loadingKnnInsights) return;

    setLoadingKnnInsights(true);
    try {

      const response = await fetch('/api/knn-insights', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          knnStats: assessmentData.knnStats,
          userProfile: assessmentData.userProfile,
          similarProfiles: assessmentData.knnStats?.similarProfiles,
          knnAnalysis: assessmentData.knnAnalysis,
          recommendations: assessmentData.careerRecommendations,
          model: selectedModel
        })
      });

      const result = await response.json();

      if (result.success) {
        setKnnInsights(result.data);
      } else {
        console.warn('❌ Failed to fetch KNN insights:', result.error);
      }
    } catch (error) {
      console.warn('❌ Error fetching KNN insights:', error);
    } finally {
      setLoadingKnnInsights(false);
    }
  };
  const isKNNEnhanced = useMemo(() => {
    return assessmentData?.enhancedWithKNN || assessmentData?.configuration?.useKNN || false;
  }, [assessmentData]);

  useEffect(() => {
    if (selectedTab === 'knn' && isKNNEnhanced && !knnInsights && !loadingKnnInsights) {
      fetchKNNInsights();
    }
  }, [selectedTab, isKNNEnhanced]);
  const fetchKNNSummary = async () => {
    if (!assessmentData?.assessmentId) return;

    setLoadingKnnSummary(true);
    try {
      const response = await fetch(`/api/knn-summary?assessmentId=${assessmentData.assessmentId}`);
      const result = await response.json();

      if (result.success) {
        setKnnSummary(result.data);
      } else {

        const knnCareers = assessmentData.careerRecommendations?.filter(
          (rec: any) => rec.source === 'knn' || rec.knnEnhanced
        ) || [];

        const generatedSummary = {
          knnGenerated: knnCareers.length,
          avgMatchScore: knnCareers.length > 0 ?
            Math.round(knnCareers.reduce((sum, rec) => sum + (rec.match || 0), 0) / knnCareers.length) : 0,
          industriesCount: new Set(knnCareers.map(rec => rec.industry).filter(Boolean)).size,
          processingTime: assessmentData.knnAnalysis?.processingTime || 250,
          totalProfilesAnalyzed: assessmentData.knnAnalysis?.totalCareers || 0,
          confidenceScore: assessmentData.knnStats?.confidenceScore ||
            (assessmentData.knnAnalysis?.averageSimilarity ?
              Math.min(95, assessmentData.knnAnalysis.averageSimilarity + 10) : 92),
          algorithmType: 'Weighted KNN',
          kValue: assessmentData.configuration?.kValue || 5,
          cacheUsed: false
        };

        setKnnSummary(generatedSummary);
      }
    } catch (error) {
      console.error('Failed to fetch KNN summary:', error);

      // Fallback: Generate summary from current assessment data
      const knnCareers = assessmentData.careerRecommendations?.filter(
        (rec: any) => rec.source === 'knn' || rec.knnEnhanced
      ) || [];

      const fallbackSummary = {
        knnGenerated: knnCareers.length,
        avgMatchScore: knnCareers.length > 0 ?
          Math.round(knnCareers.reduce((sum, rec) => sum + (rec.match || 0), 0) / knnCareers.length) : 0,
        industriesCount: new Set(knnCareers.map(rec => rec.industry).filter(Boolean)).size,
        processingTime: assessmentData.knnAnalysis?.processingTime || 250,
        totalProfilesAnalyzed: assessmentData.knnAnalysis?.totalCareers || 0,
        confidenceScore: 92,
        algorithmType: 'Weighted KNN',
        kValue: assessmentData.configuration?.kValue || 5,
        cacheUsed: false
      };

      setKnnSummary(fallbackSummary);
    } finally {
      setLoadingKnnSummary(false);
    }
  };


  const checkSystemStatus = async () => {
    setApiStatus('checking')
    setDbStatus('checking')

    try {
      const aiResponse = await fetch('/api/career-recommendations', {
        method: 'GET'
      })
      const aiResult = await aiResponse.json()

      if (aiResult.apiKeyConfigured && (aiResult.status === 'Ready' || aiResult.status.includes('Ready'))) {
        setApiStatus('ready')
      } else {
        setApiStatus('error')
      }

      const knnResponse = await fetch('/api/knn-recommendations', {
        method: 'GET'
      })
      const knnResult = await knnResponse.json()

      if (knnResult.status === 'Ready' && knnResult.database.connected) {
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

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
  }

  const downloadInteractionAsJson = (interaction: AIInteraction, index: number) => {
    const dataStr = JSON.stringify(interaction, null, 2)
    const dataBlob = new Blob([dataStr], { type: 'application/json' })
    const url = URL.createObjectURL(dataBlob)
    const link = document.createElement('a')
    link.href = url
    link.download = `interaction-${index + 1}.json`
    link.click()
    URL.revokeObjectURL(url)
  }

  const formatTimestamp = (timestamp: string) => {
    return new Date(timestamp).toLocaleString()
  }

  const formatDuration = (ms: number) => {
    return ms < 1000 ? `${ms}ms` : `${(ms / 1000).toFixed(2)}s`
  }

  const regenerateRecommendations = async (useKNN: boolean = true, useAI: boolean = true) => {
    if (!assessmentData) return

    try {
      setRegenerating(true)

      let result: any = null

      if (useKNN && dbStatus === 'ready') {
        result = await EnhancedAPIService.getKNNRecommendations(assessmentData.userProfile, {
          k: 5,
          useCache: false,
          includeDebug: true,
          saveToDatabase: true
        })
      } else if (useAI && apiStatus === 'ready') {
        result = await EnhancedAPIService.getCareerRecommendations(assessmentData.userProfile, selectedModel)
      }

      if (result && result.success) {
        const updatedData = {
          ...assessmentData,
          careerRecommendations: result.data.careers || result.data.recommendations || [],
          knnAnalysis: result.data.analysis,
          interactions: result.debug ? [result.debug] : [],
          regeneratedAt: new Date().toISOString()
        }

        setAssessmentData(updatedData)
        localStorage.setItem('personalityAssessment', JSON.stringify(updatedData))
      }

    } catch (error) {
      console.error('❌ Error regenerating recommendations:', error)
    } finally {
      setRegenerating(false)
    }
  }

  const getStatusIcon = (status: string) => {
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

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto text-center">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded mb-4"></div>
            <div className="h-4 bg-gray-200 rounded mb-8"></div>
            <div className="grid gap-6 md:grid-cols-2">
              <div className="h-64 bg-gray-200 rounded"></div>
              <div className="h-64 bg-gray-200 rounded"></div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (!assessmentData) {
    return (
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-2xl mx-auto text-center">
          <h1 className="text-2xl font-bold mb-4">No Assessment Data Found</h1>
          <p className="text-gray-600 mb-6">
            Please complete the enhanced assessment first.
          </p>
          <Button onClick={() => router.push('/assessment/skills')}>
            Take Enhanced Assessment
          </Button>
        </div>
      </div>
    )
  }

  const {
    personalityTraits,
    skillsResults,
    careerRecommendations = [],
    jobListings = [],
    claudeGenerated,
    errorFallback,
    interactions = [],
    aiProvider,
    enhancedWithKNN,
    knnAnalysis,
    knnStats,
    configuration
  } = assessmentData

  // const isKNNEnhanced = enhancedWithKNN || configuration?.useKNN
  const isAIGenerated = claudeGenerated && !errorFallback

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-6xl mx-auto">
        {/* Enhanced Header */}
        <div className="mb-8">
          <Button
            variant="outline"
            onClick={() => router.push('/assessment/skills')}
            className="mb-6"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Assessment
          </Button>

          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-3xl font-bold mb-2 flex items-center gap-3">
                {isKNNEnhanced && <Brain className="h-8 w-8 text-purple-600" />}
                {isAIGenerated && <Bot className="h-8 w-8 text-blue-600" />}
                Enhanced Career Assessment Results
              </h1>
              <p className="text-gray-600">
                {isKNNEnhanced && isAIGenerated
                  ? "Advanced KNN algorithm combined with AI analysis for optimal matches"
                  : isKNNEnhanced
                    ? "Generated using K-Nearest Neighbors algorithm with database insights"
                    : isAIGenerated
                      ? "Generated by AI based on your personality and skills profile"
                      : "Personalized career recommendations"
                }
              </p>

              <div className="mt-3 flex items-center gap-2 flex-wrap">
                {isKNNEnhanced && (
                  <Badge variant="secondary" className="bg-purple-100 text-purple-800">
                    <Brain className="h-3 w-3 mr-1" />
                    KNN Enhanced
                  </Badge>
                )}
                {isAIGenerated && (
                  <Badge variant="secondary" className="bg-blue-100 text-blue-800">
                    <Bot className="h-3 w-3 mr-1" />
                    AI Powered
                  </Badge>
                )}
                {assessmentData.jobsAiGenerated && (
                  <Badge variant="secondary" className="bg-green-100 text-green-800">
                    <Bot className="h-3 w-3 mr-1" />
                    AI Jobs
                  </Badge>
                )}
                {configuration && (
                  <Badge variant="outline" className="text-xs">
                    K={configuration.kValue} | Model: {configuration.model.toUpperCase()}
                  </Badge>
                )}
                {apiStatus && (
                  <Badge variant="outline" className={`text-xs ${apiStatus === 'ready' ? 'border-green-300 text-green-700' :
                    apiStatus === 'error' ? 'border-red-300 text-red-700' :
                      'border-blue-300 text-blue-700'
                    }`}>
                    {getStatusIcon(apiStatus)}
                    <span className="ml-1">AI: {apiStatus}</span>
                  </Badge>
                )}
                {dbStatus && (
                  <Badge variant="outline" className={`text-xs ${dbStatus === 'ready' ? 'border-purple-300 text-purple-700' :
                    dbStatus === 'error' ? 'border-red-300 text-red-700' :
                      'border-blue-300 text-blue-700'
                    }`}>
                    {getStatusIcon(dbStatus)}
                    <span className="ml-1">DB: {dbStatus}</span>
                  </Badge>
                )}
              </div>
            </div>
          </div>

          {knnAnalysis && (
            <div className="mb-6 p-4 bg-gradient-to-r from-purple-50 to-blue-50 rounded-lg border">
              <h3 className="font-medium mb-3 flex items-center gap-2">
                <BarChart3 className="h-4 w-4" />
                KNN Analysis Summary
              </h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                <div className="text-center">
                  <div className="font-semibold text-lg text-purple-800">{knnAnalysis.totalCareers}</div>
                  <div className="text-purple-600">Careers Analyzed</div>
                </div>
                <div className="text-center">
                  <div className="font-semibold text-lg text-blue-800">{knnAnalysis.averageSimilarity}%</div>
                  <div className="text-blue-600">Avg Similarity</div>
                </div>
                <div className="text-center">
                  <div className="font-semibold text-lg text-green-800">{knnAnalysis.processingTime}ms</div>
                  <div className="text-green-600">Processing Time</div>
                </div>
                <div className="text-center">
                  <div className="font-semibold text-lg text-orange-800">{knnAnalysis.topSkillMatches?.length || 0}</div>
                  <div className="text-orange-600">Top Skills</div>
                </div>
              </div>

              {(knnAnalysis.topSkillMatches && knnAnalysis.topSkillMatches.length > 0) && (
                <div className="mt-3 pt-3 border-t">
                  <div className="text-sm">
                    <strong>Top Skill Matches:</strong> {knnAnalysis.topSkillMatches.join(', ')}
                  </div>
                  {(knnAnalysis.topPersonalityMatches && knnAnalysis.topPersonalityMatches.length > 0) && (
                    <div className="text-sm mt-1">
                      <strong>Personality Strengths:</strong> {knnAnalysis.topPersonalityMatches.join(', ')}
                    </div>
                  )}
                </div>
              )}
            </div>
          )}

          {/* Tab Navigation */}
          <div className="flex border-b mb-6">
            <button
              onClick={() => setSelectedTab('overview')}
              className={`px-6 py-3 font-medium border-b-2 transition-colors ${selectedTab === 'overview'
                ? 'border-blue-600 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700'
                }`}
            >
              <User className="inline mr-2 h-4 w-4" />
              Profile Overview
            </button>
            <button
              onClick={() => setSelectedTab('careers')}
              className={`px-6 py-3 font-medium border-b-2 transition-colors ${selectedTab === 'careers'
                ? 'border-blue-600 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700'
                }`}
            >
              <TrendingUp className="inline mr-2 h-4 w-4" />
              Career Matches ({careerRecommendations.length})
            </button>
            <button
              onClick={() => setSelectedTab('jobs')}
              className={`px-6 py-3 font-medium border-b-2 transition-colors ${selectedTab === 'jobs'
                ? 'border-blue-600 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700'
                }`}
            >
              <Briefcase className="inline mr-2 h-4 w-4" />
              AI Job Opportunities ({jobListings.length})
            </button>
            {isKNNEnhanced && (
              <button
                onClick={() => setSelectedTab('knn')}
                className={`px-6 py-3 font-medium border-b-2 transition-colors ${selectedTab === 'knn'
                  ? 'border-blue-600 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
                  }`}
              >
                <Brain className="inline mr-2 h-4 w-4" />
                KNN Analysis
              </button>
            )}
            {(showDebugPanel || interactions.length > 0) && (
              <button
                onClick={() => setSelectedTab('debug')}
                className={`px-6 py-3 font-medium border-b-2 transition-colors ${selectedTab === 'debug'
                  ? 'border-blue-600 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
                  }`}
              >
                <Code className="inline mr-2 h-4 w-4" />
                Debug Info
              </button>
            )}
          </div>
        </div>

        {/* Tab Content */}
        {selectedTab === 'overview' && (
          <div className="grid gap-6 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <User className="h-5 w-5 text-blue-600" />
                  Personality Profile
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {personalityTraits.map((trait) => (
                    <div key={trait.trait}>
                      <div className="flex justify-between items-center mb-2">
                        <span className="font-medium text-sm">{trait.trait}</span>
                        <span className="text-sm text-gray-600">{trait.score}%</span>
                      </div>
                      <Progress value={trait.score} className="h-2" />
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Star className="h-5 w-5 text-yellow-600" />
                  Skills Profile
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {skillsResults.map((skill) => (
                    <div key={skill.skill}>
                      <div className="flex justify-between items-center mb-2">
                        <span className="font-medium text-sm">{skill.skill}</span>
                        <span className="text-sm text-gray-600">{skill.score}/10</span>
                      </div>
                      <Progress value={skill.score * 10} className="h-2" />
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {selectedTab === 'careers' && (
          <div className="space-y-6">
            <div className="text-center mb-6">
              <h2 className="text-2xl font-bold mb-2">
                {isKNNEnhanced ? 'KNN-Enhanced' : 'AI'} Career Recommendations
              </h2>
              <p className="text-gray-600">
                {isKNNEnhanced
                  ? 'Matched using advanced algorithms based on similar career profiles'
                  : 'Based on your personality profile and skills assessment'
                }
              </p>
            </div>

            <div className="grid gap-6 md:grid-cols-1 lg:grid-cols-1">
              {careerRecommendations.map((career, index) => (
                <Card key={index} className="hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <CardTitle className="text-xl mb-2 flex items-center gap-2">
                          {career.title}
                          {career.knnEnhanced && <Brain className="h-4 w-4 text-purple-600" />}
                          {career.source === 'hybrid' && <Badge variant="outline" className="text-xs">Hybrid</Badge>}
                        </CardTitle>
                        <div className="flex items-center gap-4 mb-3">
                          <Badge variant="secondary" className="bg-green-100 text-green-800">
                            {career.match}% Match
                          </Badge>
                          <span className="text-sm text-gray-600 flex items-center gap-1">
                            <DollarSign className="h-4 w-4" />
                            {career.salary}
                          </span>
                          <span className="text-sm text-gray-600 flex items-center gap-1">
                            <TrendingUp className="h-4 w-4" />
                            {career.outlook}
                          </span>
                          {career.industry && (
                            <Badge variant="outline" className="text-xs">
                              {career.industry}
                            </Badge>
                          )}
                        </div>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-700 mb-4">{career.description}</p>

                    {career.reasoning && (
                      <div className={`mb-4 p-3 rounded-lg border ${career.knnEnhanced || career.source === 'knn'
                        ? 'bg-purple-50 border-purple-200'
                        : 'bg-blue-50 border-blue-200'
                        }`}>
                        <h4 className={`font-medium mb-1 ${career.knnEnhanced || career.source === 'knn'
                          ? 'text-purple-900'
                          : 'text-blue-900'
                          }`}>
                          Reasoning
                        </h4>
                        <p className="text-sm text-gray-800">{career.reasoning}</p>
                      </div>
                    )}

                    <div className="mb-4">
                      <h4 className="font-medium mb-2 text-gray-800">Key Skills</h4>
                      <div className="flex flex-wrap gap-2">
                        {career.skills.map((skill, skillIndex) => (
                          <Badge key={skillIndex} variant="outline">
                            {skill}
                          </Badge>
                        ))}
                      </div>
                    </div>

                    <div className="flex flex-wrap gap-4 text-sm text-gray-600">
                      {career.experienceLevel && (
                        <span className="flex items-center gap-1">
                          <BookOpen className="h-4 w-4" />
                          {career.experienceLevel}
                        </span>
                      )}
                      {career.workEnvironment && (
                        <span className="flex items-center gap-1">
                          <Users className="h-4 w-4" />
                          {career.workEnvironment}
                        </span>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}

        {selectedTab === 'jobs' && (
          <div className="space-y-6">
            <div className="text-center mb-6">
              <h2 className="text-2xl font-bold mb-2">
                AI-Generated Job Opportunities
              </h2>
              <p className="text-gray-600">
                Tailored job listings based on your profile and recommended careers.
              </p>
            </div>

            <div className="grid gap-6 md:grid-cols-1 lg:grid-cols-1">
              {jobListings.length === 0 ? (
                <Card>
                  <CardContent className="p-6 text-center text-gray-600">
                    No AI-generated job opportunities available at this time.
                  </CardContent>
                </Card>
              ) : (
                jobListings.map((job, index) => (
                  <Card key={index} className="hover:shadow-lg transition-shadow">
                    <CardHeader>
                      <div className="flex justify-between items-start">
                        <div className="flex-1">
                          <CardTitle className="text-xl mb-2 flex items-center gap-2">
                            {job.title}
                            {job.aiGenerated && <Bot className="h-4 w-4 text-blue-600" />}
                            {job.knnEnhanced && <Brain className="h-4 w-4 text-purple-600" />}
                            {job.source === 'hybrid' && <Badge variant="outline" className="text-xs">Hybrid</Badge>}
                          </CardTitle>
                          <div className="flex items-center gap-4 mb-3">
                            <Badge variant="secondary" className="bg-blue-100 text-blue-800">
                              {job.company}
                            </Badge>
                            <span className="text-sm text-gray-600 flex items-center gap-1">
                              <DollarSign className="h-4 w-4" />
                              {job.salary || 'Not specified'}
                            </span>
                            <span className="text-sm text-gray-600 flex items-center gap-1">
                              <MapPin className="h-4 w-4" />
                              {job.location || 'Remote'}
                            </span>
                            {job.postedDate && (
                              <span className="text-sm text-gray-600 flex items-center gap-1">
                                <Calendar className="h-4 w-4" />
                                {job.postedDate}
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <p className="text-gray-700 mb-4">{job.description}</p>

                      <div className="mb-4">
                        <h4 className="font-medium mb-2 text-gray-800">Requirements</h4>
                        <div className="flex flex-wrap gap-2">
                          {job.requirements.map((req, reqIndex) => (
                            <Badge key={reqIndex} variant="outline">
                              {req}
                            </Badge>
                          ))}
                        </div>
                      </div>

                      <div className="flex flex-wrap gap-4 text-sm text-gray-600">
                        {job.experienceLevel && (
                          <span className="flex items-center gap-1">
                            <BookOpen className="h-4 w-4" />
                            {job.experienceLevel}
                          </span>
                        )}
                        {job.type && (
                          <span className="flex items-center gap-1">
                            <Clock className="h-4 w-4" />
                            {job.type}
                          </span>
                        )}
                        {job.industry && (
                          <span className="flex items-center gap-1">
                            <Briefcase className="h-4 w-4" />
                            {job.industry}
                          </span>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                ))
              )}
            </div>
          </div>
        )}

        {selectedTab === 'knn' && isKNNEnhanced && (
          <div className="space-y-6">
            <div className="text-center mb-6">
              <h2 className="text-2xl font-bold mb-2 flex items-center justify-center gap-2">
                <Brain className="h-7 w-7 text-purple-600" />
                Deep Dive: KNN Analysis Insights
              </h2>
              <p className="text-gray-600">
                AI-powered interpretation of your K-Nearest Neighbors career matching results.
              </p>
              <Button
                onClick={fetchKNNInsights}
                disabled={loadingKnnInsights}
                className="mt-4"
              >
                {loadingKnnInsights ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Generating Insights...
                  </>
                ) : (
                  <>
                    <RefreshCw className="mr-2 h-4 w-4" />
                    Regenerate KNN Insights
                  </>
                )}
              </Button>
            </div>

            {loadingKnnInsights && (
              <div className="text-center py-8">
                <Loader2 className="h-10 w-10 animate-spin text-blue-500 mx-auto mb-4" />
                <p className="text-gray-600">Generating personalized KNN insights...</p>
              </div>
            )}

            {knnInsights && !loadingKnnInsights && (
              <div className="space-y-8">
                {/* Interpretation */}
                <Card className="bg-purple-50 border-purple-200">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-purple-800">
                      <MessageSquare className="h-5 w-5" />
                      Interpretation of KNN Results
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-800">{knnInsights.interpretation}</p>
                  </CardContent>
                </Card>

                {/* Key Patterns */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Target className="h-5 w-5 text-green-600" />
                      Key Patterns from Similar Profiles
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="list-disc pl-5 space-y-2 text-gray-700">
                      {knnInsights.patterns.map((pattern, i) => (
                        <li key={i}>{pattern}</li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>

                {/* Suggested Career Path */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <ArrowRight className="h-5 w-5 text-indigo-600" />
                      Suggested Career Path Progression
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {knnInsights.careerPath.map((path, i) => (
                        <div key={i} className="border-l-4 border-indigo-300 pl-4 py-2">
                          <h4 className="font-semibold text-lg text-indigo-800">{path.role}</h4>
                          <p className="text-sm text-gray-600 mb-1">
                            <Clock className="inline h-3 w-3 mr-1" />
                            {path.timeframe}
                          </p>
                          <p className="text-gray-700 mb-1">
                            <span className="font-medium">Skills to Focus:</span> {path.skills}
                          </p>
                          <p className="text-sm text-gray-600">{path.reasoning}</p>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                {/* Skill Gaps */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Zap className="h-5 w-5 text-red-600" />
                      Identified Skill Gaps & Priorities
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {knnInsights.skillGaps.map((gap, i) => (
                        <div key={i} className="flex items-center justify-between p-2 bg-red-50 rounded-md border border-red-200">
                          <div>
                            <span className="font-medium text-gray-800">{gap.name}</span>
                            <Badge
                              variant="secondary"
                              className={`ml-2 ${gap.priority === 'High' ? 'bg-red-200 text-red-800' :
                                gap.priority === 'Medium' ? 'bg-orange-200 text-orange-800' :
                                  'bg-green-200 text-green-800'
                                }`}
                            >
                              {gap.priority} Priority
                            </Badge>
                            <p className="text-sm text-gray-600 mt-1">{gap.reason}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                {/* Industry Insights */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Briefcase className="h-5 w-5 text-teal-600" />
                      Industry Suitability Insights
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {knnInsights.industryInsights.map((industry, i) => (
                        <div key={i} className="p-3 bg-teal-50 rounded-md border border-teal-200">
                          <h4 className="font-semibold text-teal-800">{industry.name}</h4>
                          <div className="flex items-center gap-3 text-sm text-gray-700 mt-1">
                            <span>Match: {industry.matchPercentage}%</span>
                            <span>Growth: {industry.growthPotential}</span>
                          </div>
                          <p className="text-sm text-gray-600 mt-1">{industry.reason}</p>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                {/* Networking Tips */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Users className="h-5 w-5 text-blue-600" />
                      Actionable Networking Tips
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="list-disc pl-5 space-y-2 text-gray-700">
                      {knnInsights.networkingTips.map((tip, i) => (
                        <li key={i}>{tip}</li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>

                {/* Unique Insights */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Info className="h-5 w-5 text-orange-600" />
                      Unique Profile Insights
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-800">{knnInsights.uniqueInsights}</p>
                  </CardContent>
                </Card>

                {/* Success Predictors */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <CheckCircle className="h-5 w-5 text-lime-600" />
                      Key Success Predictors
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="list-disc pl-5 space-y-2 text-gray-700">
                      {knnInsights.successPredictors.map((predictor, i) => (
                        <li key={i}>{predictor}</li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              </div>
            )}

            {!knnInsights && !loadingKnnInsights && (
              <Card>
                <CardContent className="p-6 text-center text-gray-600">
                  No KNN insights available. Click "Regenerate KNN Insights" to generate them.
                </CardContent>
              </Card>
            )}

            {knnSummary && (
              <Card className="mt-8 bg-gray-50 border">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Database className="h-5 w-5 text-gray-600" />
                    KNN System Metrics
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 text-sm">
                    <div>
                      <span className="font-medium">Algorithm:</span> {knnSummary.algorithmType}
                    </div>
                    <div>
                      <span className="font-medium">K Value:</span> {knnSummary.kValue}
                    </div>
                    <div>
                      <span className="font-medium">Confidence Score:</span> {knnSummary.confidenceScore}%
                    </div>
                    <div>
                      <span className="font-medium">Total Profiles Analyzed:</span> {knnSummary.totalProfilesAnalyzed}
                    </div>
                    <div>
                      <span className="font-medium">Avg Match Score:</span> {knnSummary.avgMatchScore}%
                    </div>
                    <div>
                      <span className="font-medium">Industries Matched:</span> {knnSummary.industriesCount}
                    </div>
                    <div>
                      <span className="font-medium">Processing Time:</span> {knnSummary.processingTime}ms
                    </div>
                    <div>
                      <span className="font-medium">Cache Used:</span> {knnSummary.cacheUsed ? 'Yes' : 'No'}
                    </div>
                  </div>
                  <Button
                    variant="link"
                    onClick={() => setShowKNNDetails(!showKNNDetails)}
                    className="mt-4 p-0 h-auto text-blue-600"
                  >
                    {showKNNDetails ? 'Hide Details' : 'Show Details'}
                    {showKNNDetails ? <ChevronUp className="ml-1 h-4 w-4" /> : <ChevronDown className="ml-1 h-4 w-4" />}
                  </Button>
                  {showKNNDetails && assessmentData.knnStats?.similarProfiles && (
                    <div className="mt-4 p-4 bg-white border rounded-md max-h-60 overflow-y-auto">
                      <h5 className="font-semibold mb-2">Top Similar Profiles (from KNN Stats):</h5>
                      <ul className="space-y-2 text-xs">
                        {assessmentData.knnStats.similarProfiles.map((profile, idx) => (
                          <li key={idx} className="border-b pb-1 last:border-b-0">
                            <strong>{profile.career}</strong> ({Math.round(profile.similarity)}% similarity) - Exp: {profile.experience}
                            {profile.industry && ` | Industry: ${profile.industry}`}
                            {profile.matchReasons && profile.matchReasons.length > 0 && (
                              <p className="text-gray-500 ml-2">Reasons: {profile.matchReasons.join(', ')}</p>
                            )}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </CardContent>
              </Card>
            )}
          </div>
        )}

        {selectedTab === 'debug' && (
          <div className="space-y-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold">Debug Information & AI Interactions</h2>
              <Button
                variant="outline"
                onClick={() => setShowDebugPanel(!showDebugPanel)}
                className="ml-auto"
              >
                {showDebugPanel ? (
                  <>
                    <EyeOff className="mr-2 h-4 w-4" /> Hide Debug
                  </>
                ) : (
                  <>
                    <Eye className="mr-2 h-4 w-4" /> Show Debug
                  </>
                )}
              </Button>
            </div>

            {showDebugPanel && (
              <>
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Settings className="h-5 w-5 text-gray-600" />
                      Application Configuration
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <pre className="bg-gray-100 p-4 rounded-md text-sm overflow-x-auto">
                      {JSON.stringify(configuration, null, 2)}
                    </pre>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Database className="h-5 w-5 text-gray-600" />
                      Raw Assessment Data (localStorage)
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <pre className="bg-gray-100 p-4 rounded-md text-sm overflow-x-auto max-h-96">
                      {JSON.stringify(assessmentData, null, 2)}
                    </pre>
                  </CardContent>
                </Card>

                <div className="flex items-center gap-4 mb-4">
                  <h3 className="text-xl font-semibold">AI Interactions History</h3>
                  <Button
                    onClick={() => regenerateRecommendations(false, true)}
                    disabled={regenerating || apiStatus === 'error'}
                    className="ml-auto"
                  >
                    {regenerating ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Regenerating...
                      </>
                    ) : (
                      <>
                        <RefreshCw className="mr-2 h-4 w-4" />
                        Regenerate AI Recommendations
                      </>
                    )}
                  </Button>
                  <select
                    value={selectedModel}
                    onChange={(e) => setSelectedModel(e.target.value as 'opus' | 'sonnet' | 'haiku')}
                    className="p-2 border rounded-md"
                    disabled={regenerating}
                  >
                    {MODEL_OPTIONS.map(model => (
                      <option key={model.id} value={model.id}>
                        {model.name}
                      </option>
                    ))}
                  </select>
                </div>

                {interactions.length === 0 ? (
                  <Card>
                    <CardContent className="p-6 text-center text-gray-600">
                      No AI interactions recorded.
                    </CardContent>
                  </Card>
                ) : (
                  <div className="space-y-4">
                    {interactions.map((interaction, index) => (
                      <Card key={index} className="border-l-4 border-blue-500">
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                          <CardTitle className="text-lg font-semibold flex items-center gap-2">
                            <Bot className="h-5 w-5 text-blue-600" />
                            AI Interaction {index + 1} ({interaction.type})
                          </CardTitle>
                          <div className="flex items-center gap-2">
                            <Badge variant="secondary">
                              Model: {interaction.metadata.model}
                            </Badge>
                            <span className="text-sm text-gray-500 flex items-center gap-1">
                              <Clock className="h-4 w-4" />
                              {formatDuration(interaction.metadata.requestDuration)}
                            </span>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => setExpandedInteraction(expandedInteraction === index ? null : index)}
                            >
                              {expandedInteraction === index ? <ChevronUp /> : <ChevronDown />}
                            </Button>
                          </div>
                        </CardHeader>
                        {expandedInteraction === index && (
                          <CardContent className="pt-4">
                            <div className="space-y-4">
                              <div>
                                <h4 className="font-medium mb-1 flex items-center gap-1">
                                  <Calendar className="h-4 w-4" /> Timestamp:
                                </h4>
                                <p className="text-sm text-gray-700">{formatTimestamp(interaction.timestamp)}</p>
                              </div>

                              <div>
                                <h4 className="font-medium mb-1 flex items-center gap-1">
                                  <MessageSquare className="h-4 w-4" /> Prompt (User Message):
                                </h4>
                                <pre className="bg-gray-100 p-3 rounded-md text-xs overflow-x-auto max-h-40">
                                  {interaction.prompt.userMessage}
                                </pre>
                              </div>

                              <div>
                                <h4 className="font-medium mb-1 flex items-center gap-1">
                                  <Code className="h-4 w-4" /> Prompt (System Message):
                                </h4>
                                <pre className="bg-gray-100 p-3 rounded-md text-xs overflow-x-auto max-h-40">
                                  {interaction.prompt.systemMessage}
                                </pre>
                              </div>

                              <div>
                                <h4 className="font-medium mb-1 flex items-center gap-1">
                                  <Bot className="h-4 w-4" /> AI Response Status:
                                </h4>
                                <p className={`text-sm font-semibold ${interaction.response.success ? 'text-green-600' : 'text-red-600'}`}>
                                  {interaction.response.success ? 'Success' : `Error: ${interaction.response.error}`}
                                </p>
                              </div>

                              {interaction.response.raw && (
                                <div>
                                  <div className="flex items-center justify-between mb-1">
                                    <h4 className="font-medium flex items-center gap-1">
                                      <Code className="h-4 w-4" /> Raw AI Response:
                                    </h4>
                                    <Button
                                      variant="ghost"
                                      size="sm"
                                      onClick={() => setShowRawResponse(prev => ({ ...prev, [index]: !prev[index] }))}
                                    >
                                      {showRawResponse[index] ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                                    </Button>
                                  </div>
                                  {showRawResponse[index] && (
                                    <pre className="bg-gray-100 p-3 rounded-md text-xs overflow-x-auto max-h-60">
                                      {interaction.response.raw}
                                    </pre>
                                  )}
                                </div>
                              )}

                              {interaction.response.parsed && (
                                <div>
                                  <h4 className="font-medium mb-1 flex items-center gap-1">
                                    <BarChart3 className="h-4 w-4" /> Parsed AI Response:
                                  </h4>
                                  <pre className="bg-gray-100 p-3 rounded-md text-xs overflow-x-auto max-h-60">
                                    {JSON.stringify(interaction.response.parsed, null, 2)}
                                  </pre>
                                </div>
                              )}

                              <div className="flex items-center gap-2">
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() => copyToClipboard(JSON.stringify(interaction, null, 2))}
                                >
                                  <Copy className="mr-2 h-4 w-4" /> Copy JSON
                                </Button>
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() => downloadInteractionAsJson(interaction, index)}
                                >
                                  <Download className="mr-2 h-4 w-4" /> Download JSON
                                </Button>
                              </div>
                            </div>
                          </CardContent>
                        )}
                      </Card>
                    ))}
                  </div>
                )}
              </>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
