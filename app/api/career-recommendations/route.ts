// app/api/career-recommendations/route.ts
import { NextRequest, NextResponse } from 'next/server'

const CLAUDE_API_KEY = process.env.CLAUDE_API_KEY
const CLAUDE_API_URL = 'https://api.anthropic.com/v1/messages'

// Model configurations with working model names
const MODEL_CONFIGS = {
  'opus': {
    name: 'claude-3-opus-20240229',
    maxTokens: 3000,
    temperature: 0.2,
    description: 'Highest quality analysis with deep insights'
  },
  'sonnet': {
    name: 'claude-3-5-sonnet-20241022', 
    maxTokens: 4000,
    temperature: 0.3,
    description: 'Balanced performance and cost-effectiveness'
  },
  'haiku': {
    name: 'claude-3-5-haiku-20241022',
    maxTokens: 2000, 
    temperature: 0.4,
    description: 'Fastest responses with good accuracy'
  }
}

interface CareerRequest {
  personalityTraits: Array<{ trait: string; score: number }>
  skillsResults: Array<{ skill: string; score: number; category?: string }>
  preferences: {
    workEnvironment: string
    industry: string
    location: string
  }
  experience: string
  careerGoals: string
  model?: 'opus' | 'sonnet' | 'haiku' // Optional model selection
}

export async function POST(request: NextRequest) {
  debugger
  // Declare userProfile outside try block to make it accessible in catch
  let userProfile: CareerRequest | null = null
  
  try {
    // Enhanced API key validation
    if (!CLAUDE_API_KEY) {
      console.error('❌ CLAUDE_API_KEY not configured in environment variables')
      return NextResponse.json(
        { 
          error: 'AI service not configured. Please set CLAUDE_API_KEY environment variable.',
          success: false,
          fallback: true
        },
        { status: 500 }
      )
    }

    // Parse and validate request body
    userProfile = await request.json()
    
    // Model selection with default fallback
    const selectedModel = userProfile?.model || 'sonnet'
    const modelConfig = MODEL_CONFIGS[selectedModel]

    if (!userProfile?.personalityTraits || !userProfile.skillsResults) {
      return NextResponse.json(
        { error: 'Missing required profile data: personalityTraits and skillsResults are required' },
        { status: 400 }
      )
    }

    // Enhanced system message with model-specific adjustments
    const getSystemMessage = (model: string) => {
      let baseMessage = `You are an expert career counselor with deep knowledge of various industries, job markets, and career paths. Analyze the user's personality traits, skills, and preferences to provide personalized career recommendations.

CRITICAL: You must return your response as a valid JSON object with exactly this structure:
{
  "careers": [
    {
      "title": "Career Title",
      "match": 85,
      "description": "Detailed description of the career and why it matches the user's profile",
      "skills": ["skill1", "skill2", "skill3"],
      "salary": "$70,000 - $120,000",
      "outlook": "Growing",
      "reasoning": "Explanation of why this career matches their personality and skills"
    }
  ]
}

Be specific about salary ranges and use current market data. Include detailed reasoning for each recommendation.`

      // Model-specific enhancements
      if (model === 'opus') {
        return baseMessage + `

As Claude Opus, provide 4-5 highly sophisticated career recommendations with deep psychological insights and nuanced personality-career fit analysis. Consider complex interactions between personality traits and provide rich, detailed reasoning.`
      } else if (model === 'haiku') {
        return baseMessage + `

As Claude Haiku, provide 3 clear, concise, and well-matched career recommendations. Focus on straightforward reasoning and practical insights while maintaining accuracy.`
      } else {
        return baseMessage + `

Provide 3-4 well-balanced career recommendations ranked by match percentage (highest first). Focus on practical insights and clear reasoning.`
      }
    }

    const systemMessage = getSystemMessage(selectedModel)

    const userMessage = `Please analyze my profile and recommend suitable careers:

**Personality Traits:**
${userProfile?.personalityTraits.map(trait => `- ${trait.trait}: ${trait.score}%`).join('\n')}

**Skills Assessment:**
${userProfile?.skillsResults.map(skill => `- ${skill.skill}: ${skill.score}/10${skill.category ? ` (${skill.category})` : ''}`).join('\n')}

**Preferences:**
- Work Environment: ${userProfile?.preferences.workEnvironment}
- Industry Interest: ${userProfile?.preferences.industry}
- Location: ${userProfile?.preferences.location}
- Experience Level: ${userProfile?.experience}
- Career Goals: ${userProfile?.careerGoals}

Please provide personalized career recommendations based on this comprehensive profile. Focus on careers that align with both my personality traits and skill strengths. Return only valid JSON in the specified format.`


    // Make request to Claude API with proper configuration
    const response = await fetch(CLAUDE_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': CLAUDE_API_KEY,
        'anthropic-version': '2023-06-01'
      },
      body: JSON.stringify({
        model: modelConfig.name, // Use correct model name
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
      console.error(`❌ ${selectedModel.toUpperCase()} API error:`, {
        status: response.status,
        statusText: response.statusText,
        error: errorText
      })

      return NextResponse.json(
        {
          error: `${selectedModel.toUpperCase()} API error: ${response.status} - ${response.statusText}`,
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
      throw new Error(`Empty response from ${selectedModel.toUpperCase()}`)
    }

    // Enhanced JSON parsing with better error handling
    let parsedData
    try {
      // First, try to parse the entire response as JSON
      parsedData = JSON.parse(rawText)
    } catch (e) {
      
      // If direct parsing fails, try to extract JSON from the response
      const jsonMatch = rawText.match(/\{[\s\S]*\}/s)
      if (!jsonMatch) {
        console.warn(`❌ No JSON found in ${selectedModel.toUpperCase()} response:`, rawText)
        throw new Error(`No valid JSON found in ${selectedModel.toUpperCase()} response`)
      }

      try {
        parsedData = JSON.parse(jsonMatch[0])
      } catch (parseError) {
        console.warn(`❌ JSON parsing error from ${selectedModel.toUpperCase()}:`, parseError)
        console.warn('❌ Raw JSON string:', jsonMatch[0])
        throw new Error(`Invalid JSON format from ${selectedModel.toUpperCase()}`)
      }
    }

    // Enhanced response validation
    if (!parsedData.careers || !Array.isArray(parsedData.careers)) {
      console.error(`❌ Invalid response structure from ${selectedModel.toUpperCase()}:`, parsedData)
      throw new Error(`Invalid response structure from ${selectedModel.toUpperCase()}`)
    }

    // Validate each career object
    const validCareers = parsedData.careers.filter((career:any) => 
      career.title && 
      typeof career.match === 'number' && 
      career.description && 
      Array.isArray(career.skills)
    )

    if (validCareers.length === 0) {
      throw new Error(`No valid career recommendations in ${selectedModel.toUpperCase()} response`)
    }

    // Return successful response with enhanced metadata
    return NextResponse.json({
      success: true,
      data: {
        careers: validCareers,
        totalRecommendations: validCareers.length
      },
      metadata: {
        model: claudeResponse.model,
        modelType: selectedModel,
        modelConfig: modelConfig,
        usage: claudeResponse.usage,
        timestamp: new Date().toISOString(),
        responseLength: rawText.length,
        generatedBy: `Claude ${selectedModel.toUpperCase()}`
      }
    })

  } catch (error) {
    console.error(`❌ Error in ${userProfile?.model || 'default'} career recommendations API:`, error)
    return NextResponse.json({
      success: false,
      data: {},
      error: error instanceof Error ? error.message : 'Unknown error occurred',
      fallback: true,
      model: userProfile?.model || 'sonnet',
      timestamp: new Date().toISOString(),
      note: "Using fallback recommendations due to API error. These are still valuable career suggestions based on proven matching principles."
    }, { status: 500 })
  }
}

// Enhanced GET method for health check with model information
export async function GET() {
  const isConfigured = !!CLAUDE_API_KEY

  return NextResponse.json({
    message: 'Multi-Model Career Recommendations API',
    status: isConfigured ? 'Ready' : 'Not Configured - Please set CLAUDE_API_KEY environment variable',
    apiKeyConfigured: isConfigured,
    availableModels: Object.keys(MODEL_CONFIGS),
    modelDetails: MODEL_CONFIGS,
    defaultModel: 'sonnet',
    timestamp: new Date().toISOString(),
    version: '2.0.0'
  })
}