import { NextRequest, NextResponse } from 'next/server';
import { dbClient, jsonHelpers } from '@/lib/database/db-client';

export async function POST(request: NextRequest) {
  try {
    const { assessmentData, knnInsights } = await request.json();
    
    if (!assessmentData) {
      return NextResponse.json({
        success: false,
        error: 'Missing assessment data'
      }, { status: 400 });
    }

    // Save KNN insights if provided
    if (knnInsights && assessmentData.assessmentId) {
      await dbClient.execute(`
        INSERT INTO knn_insights (
          id, assessment_id, user_id, insights_json, 
          model_used, created_at
        ) VALUES (?, ?, ?, ?, ?, CURRENT_TIMESTAMP)
      `, [
        `insights_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        assessmentData.assessmentId,
        assessmentData.userId || 'anonymous',
        jsonHelpers.stringify(knnInsights),
        assessmentData.configuration?.model || 'sonnet'
      ]);
    }

    // Save complete assessment data
    await dbClient.execute(`
      INSERT OR REPLACE INTO assessment_results (
        assessment_id, user_id, data_json, 
        has_knn_insights, created_at
      ) VALUES (?, ?, ?, ?, CURRENT_TIMESTAMP)
    `, [
      assessmentData.assessmentId,
      assessmentData.userId || 'anonymous',
      jsonHelpers.stringify(assessmentData),
      !!knnInsights
    ]);

    return NextResponse.json({
      success: true,
      assessmentId: assessmentData.assessmentId,
      message: 'Assessment saved successfully'
    });

  } catch (error) {
    console.error('Failed to save assessment:', error);
    return NextResponse.json({
      success: false,
      error: 'Failed to save assessment'
    }, { status: 500 });
  }
}
