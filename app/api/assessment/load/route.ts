import { dbClient, jsonHelpers } from "@/lib/database/db-client";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
    try {
      const { searchParams } = new URL(request.url);
      // Changed from 'id' to 'assessmentId' for consistency with EnhancedKNNService and client-side usage
      const assessmentId = searchParams.get('assessmentId'); 
      
      if (!assessmentId) {
        return NextResponse.json({
          success: false,
          error: 'Assessment ID required'
        }, { status: 400 });
      }
  
      // Load main assessment data from 'assessments' table
      // The 'assessments' table stores preferences_json, analysis_json, etc., as per DbAssessment interface.
      // We return the raw record for the client to reconstruct the full AssessmentData object.
      const assessmentResult = await dbClient.execute(
        'SELECT * FROM assessments WHERE id = ?', // Changed table name from assessment_results to assessments
        [assessmentId]
      );
  
      if (assessmentResult.rows.length === 0) {
        return NextResponse.json({
          success: false,
          error: 'Assessment not found'
        }, { status: 404 });
      }
  
      const rawAssessmentRecord = assessmentResult.rows[0];
  
      // Load KNN insights (AI-generated interpretation) if available from 'knn_insights' table
      let knnInsights = null;
      const insightsResult = await dbClient.execute(
        'SELECT insights_json FROM knn_insights WHERE assessment_id = ? ORDER BY created_at DESC LIMIT 1',
        [assessmentId]
      );
      
      if (insightsResult.rows.length > 0) {
        knnInsights = jsonHelpers.parse(
          insightsResult.rows[0].insights_json as string,
          null
        );
      }
  
      return NextResponse.json({
        success: true,
        data: rawAssessmentRecord, // Returning the raw record from 'assessments' table
        knnInsights // AI-generated KNN insights
      });
  
    } catch (error) {
      console.error('Failed to load assessment:', error);
      return NextResponse.json({
        success: false,
        error: 'Failed to load assessment'
      }, { status: 500 });
    }
}

export async function POST(request: NextRequest) {
  try {
    // This endpoint is primarily for saving AI-generated KNN insights.
    // The main assessment data (user profile, recommendations, etc.) is saved by
    // enhancedKNNService when recommendations are generated.
    const { assessmentData, knnInsights } = await request.json();
    
    if (!assessmentData || !assessmentData.assessmentId || !assessmentData.userId) {
      return NextResponse.json({
        success: false,
        error: 'Missing assessmentData, assessmentId, or userId'
      }, { status: 400 });
    }

    // Save AI-generated KNN insights if provided
    // This assumes a 'knn_insights' table exists for these textual interpretations.
    if (knnInsights) {
      await dbClient.execute(`
        INSERT INTO knn_insights (
          id, assessment_id, user_id, insights_json, 
          model_used, created_at
        ) VALUES (?, ?, ?, ?, ?, CURRENT_TIMESTAMP)
      `, [
        `insights_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`, // Generate unique ID for insight
        assessmentData.assessmentId,
        assessmentData.userId, // Use userId from assessmentData
        jsonHelpers.stringify(knnInsights),
        assessmentData.configuration?.model || 'sonnet' // Store which model generated it
      ]);
    }

    return NextResponse.json({
      success: true,
      assessmentId: assessmentData.assessmentId,
      message: 'KNN insights processed successfully'
    });

  } catch (error) {
    console.error('Failed to process KNN insights:', error);
    return NextResponse.json({
      success: false,
      error: 'Failed to process KNN insights'
    }, { status: 500 });
  }
}
