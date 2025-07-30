// app/api/job-recommendations/route.ts
// AI-powered job listings generation

import { NextRequest, NextResponse } from 'next/server'

const CLAUDE_API_KEY = process.env.CLAUDE_API_KEY
const CLAUDE_API_URL = 'https://api.anthropic.com/v1/messages'

// Model configurations
const MODEL_CONFIGS = {
  'opus': {
    name: 'claude-3-opus-20240229',
    maxTokens: 4000,
    temperature: 0.3,
    description: 'Highest quality job generation with detailed descriptions'
  },
  'sonnet': {
    name: 'claude-3-5-sonnet-20241022', 
    maxTokens: 5000,
    temperature: 0.4,
    description: 'Balanced job generation with good variety'
  },
  'haiku': {
    name: 'claude-3-5-haiku-20241022',
    maxTokens: 3000, 
    temperature: 0.5,
    description: 'Fast job generation with creative variety'
  }
}

interface JobRequest {
  careerTitles: string[]
  userProfile: {
    personalityTraits: Array<{ trait: string; score: number }>
    skillsResults: Array<{ skill: string; score: number; category?: string }>
    preferences: {
      workEnvironment: string
      industry: string
      location: string
    }
    experience: string
  }
  numberOfJobs?: number
  model?: 'opus' | 'sonnet' | 'haiku'
}

export async function POST(request: NextRequest) {
  let jobRequest: JobRequest | null = null
  
  try {
    // Enhanced API key validation
    if (!CLAUDE_API_KEY) {
      console.error('❌ CLAUDE_API_KEY not configured for job recommendations')
      return NextResponse.json(
        { 
          error: 'AI job service not configured. Please set CLAUDE_API_KEY environment variable.',
          success: false,
          fallback: true
        },
        { status: 500 }
      )
    }

    // Parse and validate request body
    jobRequest = await request.json()
    
    const selectedModel = jobRequest?.model || 'sonnet'
    const modelConfig = MODEL_CONFIGS[selectedModel]
    const numberOfJobs = jobRequest?.numberOfJobs || 8

    if (!jobRequest?.careerTitles || !jobRequest.userProfile) {
      return NextResponse.json(
        { error: 'Missing required data: careerTitles and userProfile are required' },
        { status: 400 }
      )
    }

    // Enhanced system message for job generation
    const getJobSystemMessage = (model: string) => {
      let baseMessage = `You are an expert recruitment consultant with deep knowledge of current job markets, salary trends, and industry requirements. Generate realistic, diverse job listings based on career recommendations and user profiles.

CRITICAL: You must return your response as a valid JSON object with exactly this structure:
{
  "jobs": [
    {
      "id": "unique_job_id",
      "title": "Specific Job Title",
      "company": "Realistic Company Name",
      "location": "City, State/Country",
      "type": "Full-time/Part-time/Contract/Remote",
      "salary": "$XX,XXX - $XXX,XXX",
      "description": "Detailed job description with responsibilities and what makes this role exciting",
      "requirements": ["Specific requirement 1", "Specific requirement 2", "Specific requirement 3"],
      "benefits": ["Benefit 1", "Benefit 2", "Benefit 3"],
      "matchScore": 85,
      "posted": "X days ago",
      "applicants": "XX applicants",
      "companySize": "50-200 employees",
      "industry": "Technology/Healthcare/Finance/etc",
      "remote": true/false,
      "experienceLevel": "Entry/Mid/Senior"
    }
  ]
}

Generate diverse, realistic jobs from different companies and industries. Use current market salary data and make each job unique and compelling.`

      if (model === 'opus') {
        return baseMessage + `\n\nAs Claude Opus, create highly detailed, sophisticated job listings with nuanced requirements and exceptional attention to market realities. Focus on premium positions with detailed growth paths.`
      } else if (model === 'haiku') {
        return baseMessage + `\n\nAs Claude Haiku, create diverse, well-structured job listings efficiently. Focus on clear, practical job descriptions with good variety.`
      } else {
        return baseMessage + `\n\nCreate well-balanced, realistic job listings with good diversity in companies, industries, and requirements.`
      }
    }

    const systemMessage = getJobSystemMessage(selectedModel)

    // Build comprehensive user message
    const userMessage = `Generate ${numberOfJobs} realistic job listings based on these career recommendations and user profile:

**Career Recommendations:**
${jobRequest.careerTitles.map((career, index) => `${index + 1}. ${career}`).join('\n')}

**User Profile:**
- **Location Preference:** ${jobRequest.userProfile.preferences.location}
- **Industry Interest:** ${jobRequest.userProfile.preferences.industry}
- **Work Environment:** ${jobRequest.userProfile.preferences.workEnvironment}
- **Experience Level:** ${jobRequest.userProfile.experience}

**Top Skills:**
${jobRequest.userProfile.skillsResults
  .sort((a, b) => b.score - a.score)
  .slice(0, 5)
  .map(skill => `- ${skill.skill}: ${skill.score}/10`)
  .join('\n')}

**Personality Strengths:**
${jobRequest.userProfile.personalityTraits
  .filter(trait => trait.score >= 70)
  .map(trait => `- ${trait.trait}: ${trait.score}%`)
  .join('\n')}

**Requirements:**
1. Create jobs that match the recommended careers
2. Vary company names, sizes, and industries 
3. Use realistic salary ranges for ${jobRequest.userProfile.preferences.location}
4. Match experience level to "${jobRequest.userProfile.experience}"
5. Include both ${jobRequest.userProfile.preferences.workEnvironment === 'Remote' ? 'remote and hybrid' : 'in-person and hybrid'} opportunities
6. Generate unique, compelling job descriptions
7. Include realistic requirements based on user's skills
8. Add diverse benefits packages
9. Use realistic posting dates (1-14 days ago)
10. Generate realistic applicant counts

Return only valid JSON in the specified format with ${numberOfJobs} unique job listings.`


    // Make request to Claude API
    const response = await fetch(CLAUDE_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': CLAUDE_API_KEY,
        'anthropic-version': '2023-06-01'
      },
      body: JSON.stringify({
        model: modelConfig.name,
        max_tokens: modelConfig.maxTokens,
        temperature: modelConfig.temperature,
        system: systemMessage,
        messages: [{
          role: 'user',
          content: userMessage
        }]
      })
    })

    if (!response.ok) {
      const errorText = await response.text()
      console.error(`❌ ${selectedModel.toUpperCase()} job API error:`, {
        status: response.status,
        statusText: response.statusText,
        error: errorText
      })

      return NextResponse.json(
        {
          error: `${selectedModel.toUpperCase()} job API error: ${response.status} - ${response.statusText}`,
          details: errorText,
          model: selectedModel,
          success: false
        },
        { status: response.status }
      )
    }

    const claudeResponse = await response.json()

    const rawText = claudeResponse.content?.[0]?.text || ''

    if (!rawText) {
      throw new Error(`Empty job response from ${selectedModel.toUpperCase()}`)
    }

    // Enhanced JSON parsing
    let parsedData
    try {
      parsedData = JSON.parse(rawText)
    } catch (e) {
      
      const jsonMatch = rawText.match(/\{[\s\S]*\}/s)
      if (!jsonMatch) {
        console.warn(`❌ No JSON found in ${selectedModel.toUpperCase()} job response:`, rawText)
        throw new Error(`No valid JSON found in ${selectedModel.toUpperCase()} job response`)
      }

      try {
        parsedData = JSON.parse(jsonMatch[0])
      } catch (parseError) {
        console.warn(`❌ Job JSON parsing error from ${selectedModel.toUpperCase()}:`, parseError)
        throw new Error(`Invalid job JSON format from ${selectedModel.toUpperCase()}`)
      }
    }

    // Enhanced response validation
    if (!parsedData.jobs || !Array.isArray(parsedData.jobs)) {
      console.error(`❌ Invalid job response structure from ${selectedModel.toUpperCase()}:`, parsedData)
      throw new Error(`Invalid job response structure from ${selectedModel.toUpperCase()}`)
    }

    // Validate each job object
    const validJobs = parsedData.jobs.filter((job: any) => 
      job.title && 
      job.company &&
      job.description && 
      Array.isArray(job.requirements) &&
      typeof job.matchScore === 'number'
    )

    if (validJobs.length === 0) {
      throw new Error(`No valid job listings in ${selectedModel.toUpperCase()} response`)
    }

    // Enhance jobs with additional metadata
    const enhancedJobs = validJobs.map((job: any) => ({
      ...job,
      id: job.id || `job_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      aiGenerated: true,
      source: 'ai',
      generatedBy: `Claude ${selectedModel.toUpperCase()}`,
      generatedAt: new Date().toISOString(),
      // Ensure required fields have defaults
      benefits: job.benefits || ['Competitive salary', 'Health insurance', 'Professional development'],
      applicants: job.applicants || `${Math.floor(Math.random() * 50) + 10} applicants`,
      posted: job.posted || `${Math.floor(Math.random() * 7) + 1} days ago`,
      companySize: job.companySize || 'Medium company',
      remote: job.remote !== undefined ? job.remote : job.type?.toLowerCase().includes('remote')
    }))

    // Return successful response
    return NextResponse.json({
      success: true,
      data: {
        jobs: enhancedJobs,
        totalJobs: enhancedJobs.length,
        generatedFor: jobRequest.careerTitles,
        userLocation: jobRequest.userProfile.preferences.location,
        experienceLevel: jobRequest.userProfile.experience
      },
      metadata: {
        model: claudeResponse.model,
        modelType: selectedModel,
        modelConfig: modelConfig,
        usage: claudeResponse.usage,
        timestamp: new Date().toISOString(),
        responseLength: rawText.length,
        generatedBy: `Claude ${selectedModel.toUpperCase()}`,
        requestedJobs: numberOfJobs,
        generatedJobs: enhancedJobs.length
      }
    })

  } catch (error) {
    console.error(`❌ Error in ${jobRequest?.model || 'default'} job recommendations API:`, error)
    return NextResponse.json({
      success: false,
      data: { jobs: [] },
      error: error instanceof Error ? error.message : 'Unknown error occurred',
      fallback: true,
      model: jobRequest?.model || 'sonnet',
      timestamp: new Date().toISOString(),
      note: "Job generation failed. Please try again or check your configuration."
    }, { status: 500 })
  }
}

// Enhanced GET method for health check
export async function GET() {
  const isConfigured = !!CLAUDE_API_KEY

  return NextResponse.json({
    message: 'AI-Powered Job Recommendations API',
    status: isConfigured ? 'Ready' : 'Not Configured - Please set CLAUDE_API_KEY environment variable',
    apiKeyConfigured: isConfigured,
    availableModels: Object.keys(MODEL_CONFIGS),
    modelDetails: MODEL_CONFIGS,
    defaultModel: 'sonnet',
    features: [
      'AI-generated job listings',
      'Personalized job matching',
      'Realistic company names and descriptions',
      'Current market salary data',
      'Diverse industry representation'
    ],
    timestamp: new Date().toISOString(),
    version: '1.0.0'
  })
}