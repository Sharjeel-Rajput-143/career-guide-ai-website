import { NextRequest, NextResponse } from 'next/server';
import { dbClient } from '@/lib/database/db-client';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const assessmentId = searchParams.get('assessmentId');
    const userId = searchParams.get('userId');

    if (!assessmentId && !userId) {
      return NextResponse.json({
        success: false,
        error: 'Assessment ID or User ID required'
      }, { status: 400 });
    }

    let query = '';
    let params: any[] = [];

    if (assessmentId) {
      query = 'SELECT * FROM knn_results_summary WHERE assessment_id = ? ORDER BY created_at DESC LIMIT 1';
      params = [assessmentId];
    } else {
      query = 'SELECT * FROM knn_results_summary WHERE user_id = ? ORDER BY created_at DESC LIMIT 1';
      params = [userId];
    }

    const result = await dbClient.execute(query, params);

    if (result.rows.length === 0) {
      return NextResponse.json({
        success: false,
        error: 'No KNN summary found'
      }, { status: 404 });
    }

    const summary = result.rows[0];

    return NextResponse.json({
      success: true,
      data: {
        knnGenerated: summary.knn_generated,
        avgMatchScore: summary.avg_match_score,
        industriesCount: summary.industries_count,
        processingTime: summary.processing_time,
        totalProfilesAnalyzed: summary.total_profiles_analyzed,
        confidenceScore: summary.confidence_score,
        algorithmType: summary.algorithm_type,
        kValue: summary.k_value,
        cacheUsed: summary.cache_used,
        createdAt: summary.created_at
      }
    });

  } catch (error) {
    console.error('Error fetching KNN summary:', error);
    return NextResponse.json({
      success: false,
      error: 'Failed to fetch KNN summary'
    }, { status: 500 });
  }
}
