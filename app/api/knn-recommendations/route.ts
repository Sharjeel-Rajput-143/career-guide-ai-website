// app/api/knn-recommendations/route.ts
// API route for KNN-powered career recommendations

import { NextRequest, NextResponse } from 'next/server';
import { enhancedKNNService, UserProfile } from '@/lib/services/enhanced-knn-service';
import { checkDatabaseHealth } from '@/lib/database/db-client';

interface RequestBody {
  userProfile: UserProfile;
  options?: {
    k?: number;
    useCache?: boolean;
    includeDebug?: boolean;
    saveToDatabase?: boolean;
  };
}

// GET - Health check and system status
export async function GET() {
  try {
    
    const dbHealth = await checkDatabaseHealth();
    const systemMetrics = await enhancedKNNService.getSystemMetrics();

    return NextResponse.json({
      status: 'Ready',
      timestamp: new Date().toISOString(),
      database: {
        connected: dbHealth.connected,
        latency: dbHealth.latency,
        stats: dbHealth.stats
      },
      knn: {
        enabled: true,
        defaultK: 5,
        cacheEnabled: true
      },
      metrics: systemMetrics,
      apiVersion: '1.0.0'
    });

  } catch (error) {
    console.error('❌ KNN API health check failed:', error);
    
    return NextResponse.json({
      status: 'Error',
      error: error instanceof Error ? error.message : 'Unknown error',
      timestamp: new Date().toISOString(),
      database: { connected: false },
      knn: { enabled: false }
    }, { status: 500 });
  }
}

// POST - Get KNN career recommendations
export async function POST(request: NextRequest) {
  const startTime = Date.now();
  
  try {
    
    // Parse request body
    const body: RequestBody = await request.json();
    const { userProfile, options = {} } = body;

    // Validate required fields
    if (!userProfile) {
      return NextResponse.json({
        success: false,
        error: 'Missing userProfile in request body',
        timestamp: new Date().toISOString()
      }, { status: 400 });
    }

    if (!userProfile.personalityTraits || !userProfile.skillsResults) {
      return NextResponse.json({
        success: false,
        error: 'Missing personalityTraits or skillsResults in userProfile',
        timestamp: new Date().toISOString()
      }, { status: 400 });
    }

    // Set default options
    const requestOptions = {
      k: 5,
      useCache: true,
      includeDebug: false,
      saveToDatabase: true,
      ...options
    };

    // Get KNN recommendations
    const result = await enhancedKNNService.getCareerRecommendations(userProfile, requestOptions);

    const processingTime = Date.now() - startTime;

    // Format response to match your existing structure
    const response = {
      success: true,
      data: {
        careers: result.recommendations.map(rec => ({
          title: rec.title,
          match: rec.match,
          description: rec.description,
          skills: rec.skills,
          salary: rec.salary,
          outlook: rec.outlook,
          reasoning: rec.reasoning,
          knnEnhanced: true,
          source: rec.source,
          industry: rec.industry,
          experienceLevel: rec.experienceLevel,
          workEnvironment: rec.workEnvironment
        })),
        analysis: result.knnAnalysis,
        assessmentId: result.assessmentId,
        userId: result.userId
      },
      metadata: {
        processingTime,
        requestOptions,
        knnVersion: '1.0.0',
        databaseUsed: true,
        cacheUsed: result.debugInfo?.cacheUsed || false,
        timestamp: new Date().toISOString()
      },
      ...(requestOptions.includeDebug && {
        debug: result.debugInfo
      })
    };

    return NextResponse.json(response);

  } catch (error) {
    const processingTime = Date.now() - startTime;
    console.error('❌ KNN recommendations failed:', error);

    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error occurred',
      metadata: {
        processingTime,
        timestamp: new Date().toISOString(),
        knnVersion: '1.0.0'
      }
    }, { status: 500 });
  }
}

// PUT - Update KNN configuration
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { k, cacheExpiration } = body;

    if (k && typeof k === 'number' && k > 0) {
      enhancedKNNService.setK(k);
    }

    return NextResponse.json({
      success: true,
      message: 'KNN configuration updated',
      config: {
        k: k || 5,
        cacheExpiration: cacheExpiration || '24h'
      },
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('Failed to update KNN configuration:', error);
    
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Configuration update failed',
      timestamp: new Date().toISOString()
    }, { status: 500 });
  }
}