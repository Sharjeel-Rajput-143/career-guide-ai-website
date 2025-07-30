// app/api/knn-insights/route.ts
import { NextRequest, NextResponse } from 'next/server';

interface KNNInsightsRequest {
  knnStats: any;
  userProfile: any;
  similarProfiles?: any[];
  knnAnalysis?: any;
  recommendations?: any[];
  model?: 'opus' | 'sonnet' | 'haiku';
}

// Updated MODEL_CONFIGS to include maxTokens and temperature
const MODEL_CONFIGS = {
  opus: {
    name: 'claude-3-opus-20240229',
    maxTokens: 3000,
    temperature: 0.2,
  },
  sonnet: {
    name: 'claude-3-5-sonnet-20241022',
    maxTokens: 4000,
    temperature: 0.3,
  },
  haiku: {
    name: 'claude-3-5-haiku-20241022',
    maxTokens: 2000,
    temperature: 0.4,
  }
};

export async function POST(request: NextRequest) {
  try {
    const body: KNNInsightsRequest = await request.json();
    const { knnStats, userProfile, similarProfiles = [], knnAnalysis, recommendations = [], model = 'sonnet' } = body;

    if (!knnStats || !userProfile) {
      return NextResponse.json({
        success: false,
        error: 'Missing required data'
      }, { status: 400 });
    }

    const anthropicApiKey = process.env.CLAUDE_API_KEY;
    const anthropicApiKeyUrl = 'https://api.anthropic.com/v1/messages'
    if (!anthropicApiKey) {
      return NextResponse.json({
        success: false,
        error: 'API key not configured'
      }, { status: 500 });
    }

    // Get the selected model's configuration
    const modelConfig = MODEL_CONFIGS[model];
    if (!modelConfig) {
      return NextResponse.json({
        success: false,
        error: `Invalid model selected: ${model}`
      }, { status: 400 });
    }

    // Prepare data for Claude
    const topSkills = userProfile.skillsResults
      ?.filter((s: any) => s.score >= 7)
      ?.sort((a: any, b: any) => b.score - a.score)
      ?.slice(0, 5)
      ?.map((s: any) => `${s.skill} (${s.score}/10)`)
      ?.join(', ') || 'None identified';

    const topTraits = userProfile.personalityTraits
      ?.filter((t: any) => t.score >= 70)
      ?.sort((a: any, b: any) => b.score - a.score)
      ?.slice(0, 3)
      ?.map((t: any) => `${t.trait} (${t.score}%)`)
      ?.join(', ') || 'None identified';

    const similarProfilesSummary = similarProfiles
      .slice(0, 3)
      .map((p: any) => `${p.career} (${Math.round(p.similarity)}% match)`)
      .join(', ');

    const knnCareers = recommendations
      .filter((r: any) => r.source === 'knn' || r.knnEnhanced)
      .slice(0, 5)
      ?.map((r: any) => r.title)
      ?.join(', ') || 'None'; // Ensure it defaults to 'None' if no careers

    const prompt = `You are an expert career counselor analyzing KNN (K-Nearest Neighbors) algorithm results for career matching.

User Profile Summary:
- Top Skills: ${topSkills}
- Dominant Personality Traits: ${topTraits}
- Experience Level: ${userProfile.experience || 'Not specified'}
- Preferred Industry: ${userProfile.preferences?.industry || 'Not specified'}
- Work Environment: ${userProfile.preferences?.workEnvironment || 'Not specified'}

KNN Algorithm Results:
- Total Profiles Analyzed: ${knnAnalysis?.totalCareers || knnStats?.totalProfiles || 0}
- Average Similarity Score: ${knnAnalysis?.averageSimilarity || 0}%
- K Value Used: ${knnStats?.kValue || 5}
- Similar Career Profiles Found: ${similarProfilesSummary || 'None'}
- Top KNN-Matched Careers: ${knnCareers || 'None'}

Based on this KNN analysis, provide the following insights in JSON format:

{
  "interpretation": "A 2-3 sentence interpretation explaining what these KNN results reveal about the user's career fit and why certain careers matched well",
  "patterns": [
    "Pattern 1: Specific pattern found in similar successful profiles",
    "Pattern 2: Another key pattern",
    "Pattern 3: Third pattern",
    "Pattern 4: Fourth pattern (if applicable)"
  ],
  "careerPath": [
    {
      "role": "Entry-level role title",
      "timeframe": "0-2 years",
      "skills": "Key skills to focus on",
      "reasoning": "Why this is a good starting point based on KNN matches"
    },
    {
      "role": "Mid-level role title",
      "timeframe": "2-5 years",
      "skills": "Skills to develop",
      "reasoning": "Natural progression based on similar profiles"
    },
    {
      "role": "Senior role title",
      "timeframe": "5+ years",
      "skills": "Advanced skills needed",
      "reasoning": "Long-term career goal based on successful patterns"
    }
  ],
  "skillGaps": [
    {
      "name": "Skill name",
      "priority": "High",
      "reason": "Why this skill is important based on KNN analysis"
    },
    {
      "name": "Another skill",
      "priority": "Medium",
      "reason": "Importance for career progression"
    }
  ],
  "industryInsights": [
    {
      "name": "Industry name",
      "matchPercentage": 85,
      "reason": "Why this industry suits the user based on similar profiles",
      "growthPotential": "High/Medium/Low"
    },
    {
      "name": "Another industry",
      "matchPercentage": 75,
      "reason": "Alternative industry match reasoning",
      "growthPotential": "High/Medium/Low"
    }
  ],
  "networkingTips": [
    "Specific networking strategy based on where similar profiles found success",
    "Another actionable networking tip",
    "Third networking suggestion"
  ],
  "uniqueInsights": "Something unique or unexpected found in the KNN analysis that sets this user apart",
  "successPredictors": [
    "Key factor 1 that predicts success based on similar profiles",
    "Key factor 2",
    "Key factor 3"
  ]
}

Ensure your response is practical, actionable, and directly tied to the KNN analysis results. Focus on data-driven insights rather than generic career advice.`;

    // Call Claude API using dynamic model configuration
    const response = await fetch(anthropicApiKeyUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': anthropicApiKey,
        'anthropic-version': '2023-06-01'
      },
      body: JSON.stringify({
        model: modelConfig.name, // Use model name from config
        max_tokens: modelConfig.maxTokens, // Use maxTokens from config
        temperature: modelConfig.temperature, // Use temperature from config
        messages: [
          {
            role: 'user',
            content: prompt
          }
        ]
      })
    });

    if (!response.ok) {
      const error = await response.text();
      console.error('Claude API error:', error);
      throw new Error(`Claude API failed: ${response.status}`);
    }

    const result = await response.json();
    const content = result.content[0].text;

    // Parse the JSON response
    let insights;
    try {
      // Extract JSON from the response
      const jsonMatch = content.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        insights = JSON.parse(jsonMatch[0]);
      } else {
        throw new Error('No JSON found in response');
      }
    } catch (parseError) {
      console.error('Failed to parse Claude response:', parseError);
      // Fallback response
      insights = {
        interpretation: "Your KNN analysis shows strong alignment with technical and analytical roles.",
        patterns: ["Strong technical aptitude", "Leadership potential", "Team collaboration skills"],
        careerPath: [
          {
            role: "Junior Analyst",
            timeframe: "0-2 years",
            skills: "Data analysis, problem-solving",
            reasoning: "Matches your analytical strengths"
          }
        ],
        skillGaps: [
          {
            name: "Advanced Data Analysis",
            priority: "High",
            reason: "Critical for career progression"
          }
        ],
        industryInsights: [
          {
            name: "Technology",
            matchPercentage: 85,
            reason: "Strong alignment with your technical skills",
            growthPotential: "High"
          }
        ],
        networkingTips: ["Join tech meetups", "Connect with data professionals"],
        uniqueInsights: "Your profile shows a unique combination of technical and leadership abilities.",
        successPredictors: ["Technical proficiency", "Adaptability", "Communication skills"]
      };
    }

    return NextResponse.json({
      success: true,
      data: insights,
      metadata: {
        model: model,
        timestamp: new Date().toISOString(),
        knnProfilesAnalyzed: knnAnalysis?.totalCareers || 0
      }
    });

  } catch (error) {
    console.error('KNN insights generation failed:', error);
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Failed to generate insights'
    }, { status: 500 });
  }
}

// GET endpoint for testing
export async function GET() {
  return NextResponse.json({
    status: 'Ready',
    endpoint: '/api/knn-insights',
    method: 'POST',
    description: 'Generate AI-powered insights from KNN analysis results',
    requiredFields: ['knnStats', 'userProfile'],
    optionalFields: ['similarProfiles', 'knnAnalysis', 'recommendations', 'model']
  });
}
