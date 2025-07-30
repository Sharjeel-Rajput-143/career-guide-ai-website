// app/api/v0-dev/route.ts
import { NextRequest, NextResponse } from 'next/server';

const V0_API_KEY = "v1:0zMRnWhG4hZNXtaIQXJ1LOfQ:N1JtAdAN0vXsyWebe70Fq70F";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const response = await fetch("https://api.v0.dev/v1/generate", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${V0_API_KEY}`,
        "Content-Type": "application/json",
        "Accept": "application/json"
      },
      body: JSON.stringify(body)
    });
    
    // Log response headers for debugging
    const responseHeaders = Object.fromEntries(response.headers.entries());
    console.log('📡 V0.dev Response Headers:', responseHeaders);

    if (!response.ok) {
      const errorText = await response.text();
      console.error('❌ V0.dev API Error:', errorText);
      return NextResponse.json(
        { error: `V0.dev API error: ${response.status} - ${errorText}` },
        { status: response.status }
      );
    }

    const data = await response.json();
    console.log('✅ V0.dev API Response received successfully');
    console.log('📊 Response data keys:', Object.keys(data));
    
    // Log the full response structure for debugging
    console.log('📄 Full V0.dev response:', JSON.stringify(data, null, 2));
    
    // Check what the response structure looks like
    if (data.components) {
      console.log('🎯 Components found:', data.components.length);
      data.components.forEach((comp: any, index: number) => {
        console.log(`Component ${index + 1}:`, {
          id: comp.id,
          title: comp.title,
          hasCode: !!comp.code,
          codeLength: comp.code?.length || 0
        });
      });
    } else {
      console.log('⚠️ No components array in response. Response structure:', Object.keys(data));
    }
    
    return NextResponse.json(data);

  } catch (error) {
    console.error('❌ V0.dev proxy error:', error);
    return NextResponse.json(
      { 
        error: 'Failed to proxy v0.dev request',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}

// Optional: Add GET method for health check
export async function GET() {
  return NextResponse.json({ 
    status: 'V0.dev API proxy is running',
    timestamp: new Date().toISOString()
  });
}