import OpenAI from 'openai';
import { NextRequest, NextResponse } from 'next/server';

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY, // Use environment variable
});

interface UserProfile {
  personalityTraits: Array<{ trait: string; score: number }>;
  skillsResults: Array<{ skill: string; score: number }>;
  preferences?: {
    location?: string;
    workEnvironment?: string;
    industry?: string;
  };
  experience?: string;
  careerGoals?: string;
}

interface ChatGPTInteraction {
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
    openaiResponse?: any; // Full OpenAI response object
  };
  metadata: {
    model: string;
    temperature: number;
    maxTokens?: number;
    requestDuration: number;
    tokenUsage?: {
      inputTokens: number;
      outputTokens: number;
      totalTokens: number;
      cachedTokens?: number;
      reasoningTokens?: number;
    };
    responseId?: string;
    status?: string;
  };
}

export async function POST(request: NextRequest) {
  const startTime = Date.now();
  
  try {
    const { userProfile, type, careerTitles, location, includeDebugInfo = false } = await request.json();

    let systemMessage = '';
    let userMessage = '';
    let requestType: 'careers' | 'jobs' = 'careers';

    if (type === 'careers') {
      requestType = 'careers';
      systemMessage = "You are a career counselor with 15+ years of experience. Analyze user data and provide exactly 3 career recommendations in JSON format only. Be specific and practical.";
      
      userMessage = `Based on this user profile: ${JSON.stringify(userProfile)}

Respond with ONLY this JSON format (no additional text):
{
  "careers": [
    {
      "title": "Specific Job Title",
      "match": 85,
      "description": "2-3 sentence description of the role and why it fits",
      "skills": ["skill1", "skill2", "skill3"],
      "salary": "$50,000 - $80,000",
      "outlook": "Growing"
    }
  ]
}`;

    } else if (type === 'jobs') {
      requestType = 'jobs';
      systemMessage = "You are a job market expert. Generate exactly 4 realistic dummy job listings that could exist at real companies. Make them diverse and realistic.";
      
      userMessage = `Generate 4 realistic job listings for these careers: ${careerTitles.join(', ')}
Location preference: ${location || 'Remote'}

Respond with ONLY this JSON format (no additional text):
{
  "jobs": [
    {
      "title": "Specific Job Title",
      "company": "Realistic Company Name", 
      "location": "City, State or Remote",
      "salary": "$50,000 - $70,000",
      "description": "Realistic job description that sounds professional",
      "requirements": ["requirement1", "requirement2", "requirement3"],
      "matchScore": 85,
      "postedDate": "3 days ago",
      "applicants": "25 applicants"
    }
  ]
}`;
    } else {
      return NextResponse.json({ error: 'Invalid request type' }, { status: 400 });
    }

    const fullPrompt = `${systemMessage}\n\n${userMessage}`;

    // Initialize interaction object for tracking
    const interaction: ChatGPTInteraction = {
      timestamp: new Date().toISOString(),
      type: requestType,
      prompt: {
        systemMessage,
        userMessage,
        fullPrompt
      },
      response: {
        raw: '',
        parsed: {},
        success: false
      },
      metadata: {
        model: 'gpt-4.1',
        temperature: 0.7,
        requestDuration: 0
      }
    };

    // Use the new Responses API format
    const response = await fetch('https://api.openai.com/v1/responses', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`
      },
      body: JSON.stringify({
        model: "gpt-4.1",
        input: fullPrompt,
        temperature: 0.7,
        max_output_tokens: 1000,
        store: true,
        text: {
          format: {
            type: "text"
          }
        }
      })
    });

    const endTime = Date.now();
    interaction.metadata.requestDuration = endTime - startTime;

    if (!response.ok) {
      const errorText = await response.text();
      console.error(`❌ OpenAI API Error: ${response.status} - ${errorText}`);
      
      // Return error instead of fallback
      interaction.response.success = false;
      interaction.response.error = `API Error: ${response.status} - ${errorText}`;
      
      const errorResponse:any = {
        error: 'OpenAI API Error',
        status: response.status,
        message: errorText,
        timestamp: interaction.timestamp
      };

      if (includeDebugInfo) {
        errorResponse._debug = interaction;
      }

      return NextResponse.json(errorResponse, { status: response.status });
    }

    const responseData = await response.json();

    // Extract content from the new response format
    let content = '';
    if (responseData.output && responseData.output[0] && responseData.output[0].content) {
      const contentArray = responseData.output[0].content;
      const textContent = contentArray.find((item: any) => item.type === 'output_text');
      if (textContent) {
        content = textContent.text;
      }
    }

    if (!content) {
      console.error('❌ No content received from OpenAI Responses API');
      
      interaction.response.success = false;
      interaction.response.error = 'No content received from OpenAI';
      interaction.response.openaiResponse = responseData;
      
      const errorResponse:any = {
        error: 'No content received',
        message: 'OpenAI returned empty content',
        timestamp: interaction.timestamp,
        openaiResponse: responseData
      };

      if (includeDebugInfo) {
        errorResponse._debug = interaction;
      }

      return NextResponse.json(errorResponse, { status: 500 });
    }

    // Store raw response and full OpenAI response
    interaction.response.raw = content;
    interaction.response.openaiResponse = responseData;
    
    try {
      // Try to parse the response as JSON
      const parsedContent = JSON.parse(content);
      interaction.response.parsed = parsedContent;
      interaction.response.success = true;

      // Store enhanced metadata from new API
      interaction.metadata.responseId = responseData.id;
      interaction.metadata.status = responseData.status;

      // Store enhanced token usage if available
      if (responseData.usage) {
        interaction.metadata.tokenUsage = {
          inputTokens: responseData.usage.input_tokens,
          outputTokens: responseData.usage.output_tokens,
          totalTokens: responseData.usage.total_tokens,
          cachedTokens: responseData.usage.input_tokens_details?.cached_tokens,
          reasoningTokens: responseData.usage.output_tokens_details?.reasoning_tokens
        };
      }

      // Return the actual parsed response from ChatGPT
      const responsePayload = includeDebugInfo 
        ? { ...parsedContent, _debug: interaction }
        : parsedContent;

      return NextResponse.json(responsePayload);

    } catch (parseError:any) {
      // If JSON parsing fails, return the raw response
      console.warn('❌ Failed to parse ChatGPT response as JSON:', parseError);
      
      interaction.response.success = false;
      interaction.response.error = `JSON Parse Error: ${parseError.message}`;
      
      // Return the raw text response instead of failing
      const rawResponse:any = {
        rawResponse: content,
        error: 'Response was not valid JSON',
        parseError: parseError.message,
        timestamp: interaction.timestamp
      };

      if (includeDebugInfo) {
        rawResponse._debug = interaction;
      }

      return NextResponse.json(rawResponse);
    }

  } catch (error: any) {
    console.error('❌ Request processing error:', error);
    
    const errorResponse = {
      error: 'Internal server error',
      message: error.message,
      timestamp: new Date().toISOString()
    };

    return NextResponse.json(errorResponse, { status: 500 });
  }
}