// lib/services/enhanced-knn-service.ts
// Enhanced KNN Career Service with proper libsql client (no crypto dependency)

import { careerRepository, CareerData } from '../database/career-repository';
import { dbClient, jsonHelpers } from '../database/db-client';

export interface PersonalityTrait {
  trait: string;
  score: number;
}

export interface SkillResult {
  skill: string;
  score: number;
  category: string;
}

export interface UserProfile {
  userId?: string;
  personalityTraits: PersonalityTrait[];
  skillsResults: SkillResult[];
  preferences: {
    workEnvironment: string;
    industry: string;
    location: string;
  };
  experience: string;
  careerGoals: string;
}

export interface KNNResult {
  career: CareerData;
  similarity: number;
  matchReasons: string[];
  distance: number;
}

export interface EnhancedRecommendation {
  id: string;
  title: string;
  match: number;
  description: string;
  skills: string[];
  salary: string;
  outlook: string;
  reasoning: string;
  knnSimilarity: number;
  source: 'knn' | 'ai' | 'hybrid';
  matchReasons: string[];
  industry: string;
  experienceLevel: string;
  workEnvironment: string;
}

export interface AssessmentResult {
  assessmentId: string;
  userId: string;
  recommendations: EnhancedRecommendation[];
  knnAnalysis: {
    totalCareers: number;
    averageSimilarity: number;
    topSkillMatches: string[];
    topPersonalityMatches: string[];
    processingTime: number;
  };
  debugInfo?: {
    userFeatures: number[];
    knnResults: KNNResult[];
    cacheUsed: boolean;
  };
}

export class EnhancedKNNService {
  private k: number;
  private cacheExpiration: number = 24 * 60 * 60 * 1000; // 24 hours

  constructor(k: number = 5) {
    this.k = k;
  }

  // Simple hash function without crypto dependency
  private simpleHash(str: string): string {
    let hash = 0;
    if (str.length === 0) return hash.toString();
    for (let i = 0; i < str.length; i++) {
      const char = str.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash; // Convert to 32bit integer
    }
    return Math.abs(hash).toString(36);
  }

  // Main method to get career recommendations
  async getCareerRecommendations(
    userProfile: UserProfile,
    options: {
      k?: number;
      useCache?: boolean;
      includeDebug?: boolean;
      saveToDatabase?: boolean;
    } = {}
  ): Promise<AssessmentResult> {
    const startTime = Date.now();
    const actualK = options.k || this.k;
    const useCache = options.useCache !== false;
    const includeDebug = options.includeDebug || false;
    const saveToDatabase = options.saveToDatabase !== false;

    try {

      // Generate user features vector
      const userFeatures = await this.calculateUserFeatures(userProfile);
      const userFeaturesHash = this.hashUserFeatures(userFeatures);

      // Check cache first
      let knnResults: KNNResult[] = [];
      let cacheUsed = false;

      if (useCache) {
        const cachedResults = await this.getCachedResults(userFeaturesHash, actualK);
        if (cachedResults) {
          knnResults = cachedResults;
          cacheUsed = true;
        }
      }

      // Compute KNN if not cached
      if (knnResults.length === 0) {
        knnResults = await this.computeKNN(userProfile, userFeatures, actualK);
        
        // Cache the results
        if (useCache) {
          await this.cacheResults(userFeaturesHash, actualK, knnResults, Date.now() - startTime);
        }
      }

      // Convert to enhanced recommendations
      const recommendations = this.convertToEnhancedRecommendations(knnResults);

      // Generate analysis
      const knnAnalysis = this.generateKNNAnalysis(userProfile, knnResults, Date.now() - startTime);

      // Create assessment ID
      const assessmentId = this.generateAssessmentId();

      // Save to database if requested
      let userId = userProfile.userId || 'anonymous';
      if (saveToDatabase && recommendations.length > 0) {
        userId = await this.saveAssessmentToDatabase(assessmentId, userProfile, recommendations, knnAnalysis);
        
        // Save KNN results summary
        await this.saveKNNResultsSummary(assessmentId, userId, recommendations, knnAnalysis);
      }
      const result: AssessmentResult = {
        assessmentId,
        userId,
        recommendations,
        knnAnalysis,
        ...(includeDebug && {
          debugInfo: {
            userFeatures,
            knnResults,
            cacheUsed
          }
        })
      };
      return result;

    } catch (error) {
      console.error('❌ Enhanced KNN service error:', error);
      throw new Error(`KNN recommendation failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  // Calculate user features vector
  private async calculateUserFeatures(userProfile: UserProfile): Promise<number[]> {
    const features: number[] = [];

    // Add skills (normalized to 0-1)
    const skillNames = [
      'Technical Aptitude', 'Problem Solving', 'Creativity', 'Communication',
      'Data Analysis', 'Project Management', 'Leadership', 'Adaptability'
    ];

    skillNames.forEach(skillName => {
      const userSkill = userProfile.skillsResults.find(s => s.skill === skillName);
      features.push((userSkill?.score || 5) / 10);
    });

    // Add personality traits (normalized to 0-1)
    const personalityTraits = ['Analytical Thinking', 'Creativity', 'Extraversion', 'Leadership', 'Adaptability'];
    personalityTraits.forEach(traitName => {
      const userTrait = userProfile.personalityTraits.find(t => t.trait === traitName);
      features.push((userTrait?.score || 50) / 100);
    });

    // Add categorical features (encoded)
    features.push(userProfile.preferences.industry === 'Technology' ? 1 : 0);
    features.push(userProfile.experience === 'Entry Level' ? 0 : 
                 userProfile.experience === 'Mid Level' ? 0.5 : 1);
    features.push(userProfile.preferences.workEnvironment === 'Team-oriented' ? 1 : 0);

    return features;
  }

  // Calculate career features vector
  private calculateCareerFeatures(career: CareerData): number[] {
    if (career.featuresVector && career.featuresVector.length > 0) {
      return career.featuresVector;
    }

    const features: number[] = [];

    // Add skill requirements (normalized to 0-1)
    const skillNames = [
      'Technical Aptitude', 'Problem Solving', 'Creativity', 'Communication',
      'Data Analysis', 'Project Management', 'Leadership', 'Adaptability'
    ];
    skillNames.forEach(skill => {
      features.push((career.requiredSkills[skill] || 0) / 10);
    });

    // Add personality requirements (normalized to 0-1)
    const personalityTraits = ['Analytical Thinking', 'Creativity', 'Extraversion', 'Leadership', 'Adaptability'];
    personalityTraits.forEach(trait => {
      features.push((career.personalityFit[trait] || 0) / 10);
    });

    // Add categorical features (encoded)
    features.push(career.industry === 'Technology' ? 1 : 0);
    features.push(career.experienceLevel === 'Entry Level' ? 0 : 
                 career.experienceLevel === 'Mid Level' ? 0.5 : 1);
    features.push(career.workEnvironment === 'Team-oriented' ? 1 : 0);

    return features;
  }

  // Compute KNN algorithm
  private async computeKNN(userProfile: UserProfile, userFeatures: number[], k: number): Promise<KNNResult[]> {
    // Get all careers from database
    const careers = await careerRepository.getCareersForKNN();

    if (careers.length === 0) {
      throw new Error('No careers available for KNN computation');
    }

    // Calculate distances to all careers
    const distances = careers.map(career => {
      const careerFeatures = this.calculateCareerFeatures(career);
      const distance = this.calculateEuclideanDistance(userFeatures, careerFeatures);
      
      return {
        career,
        distance,
        features: careerFeatures
      };
    });

    // Sort by distance (ascending)
    distances.sort((a, b) => a.distance - b.distance);

    // Get top K careers
    const topK = distances.slice(0, k);

    // Calculate similarities and generate match reasons
    const maxDistance = Math.max(...distances.map(d => d.distance));
    
    const results: KNNResult[] = topK.map(({ career, distance }) => ({
      career,
      distance,
      similarity: this.calculateSimilarity(distance, maxDistance),
      matchReasons: this.generateMatchReasons(userProfile, career)
    }));

    // Update features vectors in database if they were computed
    const updatePromises = distances
      .filter(d => !d.career.featuresVector || d.career.featuresVector.length === 0)
      .map(d => careerRepository.updateFeaturesVector(d.career.id, d.features));
    
    if (updatePromises.length > 0) {
      await Promise.all(updatePromises);
    }

    return results;
  }

  // Calculate Euclidean distance
  private calculateEuclideanDistance(features1: number[], features2: number[]): number {
    if (features1.length !== features2.length) {
      throw new Error('Feature vectors must have the same length');
    }

    let sum = 0;
    for (let i = 0; i < features1.length; i++) {
      sum += Math.pow(features1[i] - features2[i], 2);
    }
    return Math.sqrt(sum);
  }

  // Calculate similarity score
  private calculateSimilarity(distance: number, maxDistance: number): number {
    if (maxDistance === 0) return 100;
    return Math.max(0, (1 - distance / maxDistance) * 100);
  }

  // Generate match reasons
  private generateMatchReasons(userProfile: UserProfile, career: CareerData): string[] {
    const reasons: string[] = [];

    // Check skill matches
    const strongSkills = userProfile.skillsResults
      .filter(skill => skill.score >= 7 && (career.requiredSkills[skill.skill] || 0) >= 7)
      .slice(0, 3);

    if (strongSkills.length > 0) {
      reasons.push(`Strong match in ${strongSkills.map(s => s.skill.toLowerCase()).join(', ')}`);
    }

    // Check personality matches
    const personalityMatches = userProfile.personalityTraits
      .filter(trait => trait.score >= 70 && (career.personalityFit[trait.trait] || 0) >= 7)
      .slice(0, 2);

    if (personalityMatches.length > 0) {
      reasons.push(`Personality aligns with ${personalityMatches.map(p => p.trait.toLowerCase()).join(', ')}`);
    }

    // Check preference matches
    if (userProfile.preferences.industry === career.industry) {
      reasons.push(`Matches your preferred ${career.industry.toLowerCase()} industry`);
    }

    if (userProfile.preferences.workEnvironment === career.workEnvironment) {
      reasons.push(`Fits your ${career.workEnvironment.toLowerCase()} work style`);
    }

    if (userProfile.experience === career.experienceLevel) {
      reasons.push(`Appropriate for your ${career.experienceLevel.toLowerCase()} experience`);
    }

    return reasons.length > 0 ? reasons : ['Good overall profile match'];
  }

  // Convert KNN results to enhanced recommendations
  private convertToEnhancedRecommendations(knnResults: KNNResult[]): EnhancedRecommendation[] {
    return knnResults.map(result => ({
      id: result.career.id,
      title: result.career.title,
      match: Math.round(result.similarity),
      description: result.career.description,
      skills: Object.keys(result.career.requiredSkills).filter(skill => 
        result.career.requiredSkills[skill] >= 7
      ),
      salary: result.career.averageSalary,
      outlook: result.career.growthOutlook,
      reasoning: result.matchReasons.join('. '),
      knnSimilarity: result.similarity,
      source: 'knn' as const,
      matchReasons: result.matchReasons,
      industry: result.career.industry,
      experienceLevel: result.career.experienceLevel,
      workEnvironment: result.career.workEnvironment
    }));
  }

  // Generate KNN analysis
  private generateKNNAnalysis(userProfile: UserProfile, knnResults: KNNResult[], processingTime: number) {
    const averageSimilarity = knnResults.reduce((sum, r) => sum + r.similarity, 0) / knnResults.length;

    // Find top skill matches
    const skillScores = new Map<string, number>();
    userProfile.skillsResults.forEach(skill => {
      if (skill.score >= 7) {
        skillScores.set(skill.skill, skill.score);
      }
    });
    const topSkillMatches = Array.from(skillScores.entries())
      .sort(([,a], [,b]) => b - a)
      .slice(0, 3)
      .map(([skill]) => skill);

    // Find top personality matches
    const personalityScores = new Map<string, number>();
    userProfile.personalityTraits.forEach(trait => {
      if (trait.score >= 70) {
        personalityScores.set(trait.trait, trait.score);
      }
    });
    const topPersonalityMatches = Array.from(personalityScores.entries())
      .sort(([,a], [,b]) => b - a)
      .slice(0, 3)
      .map(([trait]) => trait);

    return {
      totalCareers: knnResults.length,
      averageSimilarity: Math.round(averageSimilarity),
      topSkillMatches,
      topPersonalityMatches,
      processingTime
    };
  }

  // Hash user features for caching (without crypto)
  private hashUserFeatures(features: number[]): string {
    const featuresStr = features.map(f => f.toFixed(3)).join(',');
    return this.simpleHash(featuresStr);
  }

  // Get cached results
  private async getCachedResults(hash: string, k: number): Promise<KNNResult[] | null> {
    try {
      const result = await dbClient.execute(
        'SELECT career_recommendations_json FROM knn_cache WHERE user_features_hash = ? AND k_value = ? AND expires_at > CURRENT_TIMESTAMP',
        [hash, k]
      );

      if (result.rows.length > 0) {
        const cachedData = jsonHelpers.parse(result.rows[0].career_recommendations_json as string, []);
        return cachedData;
      }

      return null;
    } catch (error) {
      console.warn('Cache lookup failed:', error);
      return null;
    }
  }

  // Cache results
  private async cacheResults(hash: string, k: number, results: KNNResult[], computationTime: number): Promise<void> {
    try {
      const expiresAt = new Date(Date.now() + this.cacheExpiration).toISOString();
      
      await dbClient.execute(`
        INSERT INTO knn_cache (user_features_hash, k_value, career_recommendations_json, computation_time_ms, expires_at)
        VALUES (?, ?, ?, ?, ?)
        ON CONFLICT(user_features_hash, k_value) DO UPDATE SET
          career_recommendations_json = excluded.career_recommendations_json,
          computation_time_ms = excluded.computation_time_ms,
          expires_at = excluded.expires_at,
          created_at = CURRENT_TIMESTAMP
      `, [hash, k, jsonHelpers.stringify(results), computationTime, expiresAt]);

    } catch (error) {
      console.warn('Failed to cache results:', error);
    }
  }
  async saveKNNResultsSummary(assessmentId: string, userId: string, recommendations: EnhancedRecommendation[], analysis: any): Promise<void> {
    try {
      const knnCareers = recommendations.filter((rec:any) => rec.source === 'knn' || rec.knnEnhanced);
      
      const summaryData = {
        id: `knn_summary_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        assessment_id: assessmentId,
        user_id: userId,
        knn_generated: knnCareers.length,
        avg_match_score: knnCareers.length > 0 ? 
          Math.round(knnCareers.reduce((sum, rec) => sum + (rec.match || 0), 0) / knnCareers.length) : 0,
        industries_count: new Set(knnCareers.map(rec => rec.industry).filter(Boolean)).size,
        processing_time: analysis?.processingTime || 0,
        total_profiles_analyzed: analysis?.totalCareers || 0,
        confidence_score: Math.min(95, (analysis?.averageSimilarity || 85) + 10),
        algorithm_type: 'Weighted KNN',
        k_value: this.k,
        cache_used: false
      };
  
      await dbClient.execute(`
        INSERT INTO knn_results_summary (
          id, assessment_id, user_id, knn_generated, avg_match_score, 
          industries_count, processing_time, total_profiles_analyzed, 
          confidence_score, algorithm_type, k_value, cache_used
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `, [
        summaryData.id, summaryData.assessment_id, summaryData.user_id,
        summaryData.knn_generated, summaryData.avg_match_score, summaryData.industries_count,
        summaryData.processing_time, summaryData.total_profiles_analyzed,
        summaryData.confidence_score, summaryData.algorithm_type, summaryData.k_value,
        summaryData.cache_used
      ]);
    } catch (error) {
      console.error('❌ Failed to save KNN results summary:', error);
    }
  }

  // Save assessment to database
  private async saveAssessmentToDatabase(
    assessmentId: string,
    userProfile: UserProfile,
    recommendations: EnhancedRecommendation[],
    analysis: any
  ): Promise<string> {
    try {
      let userId = userProfile.userId;

      // Create user if not exists
      if (!userId) {
        userId = this.generateUserId();
        await dbClient.execute(
          'INSERT OR IGNORE INTO users (id, preferences_json) VALUES (?, ?)',
          [userId, jsonHelpers.stringify(userProfile.preferences)]
        );
      }

      // Create assessment record
      await dbClient.execute(`
        INSERT INTO assessments (
          id, user_id, assessment_type, status, experience_level, 
          career_goals, preferences_json, analysis_json, completed_at
        ) VALUES (?, ?, 'complete', 'completed', ?, ?, ?, ?, CURRENT_TIMESTAMP)
      `, [
        assessmentId,
        userId,
        userProfile.experience,
        userProfile.careerGoals,
        jsonHelpers.stringify(userProfile.preferences),
        jsonHelpers.stringify(analysis)
      ]);

      // Save personality traits
      const personalityQueries = userProfile.personalityTraits.map(trait => ({
        sql: 'INSERT OR REPLACE INTO personality_traits (user_id, trait_name, score, assessment_id) VALUES (?, ?, ?, ?)',
        args: [userId, trait.trait, trait.score, assessmentId]
      }));

      // Save skill results  
      const skillQueries = userProfile.skillsResults.map(skill => ({
        sql: 'INSERT OR REPLACE INTO skill_results (user_id, skill_name, score, category, assessment_id) VALUES (?, ?, ?, ?, ?)',
        args: [userId, skill.skill, skill.score, skill.category, assessmentId]
      }));

      // Save recommendations
      const recommendationQueries = recommendations.map(rec => ({
        sql: `INSERT INTO career_recommendations (
          assessment_id, user_id, career_id, match_score, similarity_score,
          recommendation_source, match_reasons_json, knn_distance, k_value
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        args: [
          assessmentId, userId, rec.id, rec.match, rec.knnSimilarity,
          rec.source, jsonHelpers.stringify(rec.matchReasons), 0, this.k
        ]
      }));

      // Execute all queries in transaction
      await dbClient.transaction([
        ...personalityQueries,
        ...skillQueries,
        ...recommendationQueries
      ]);
      return userId;

    } catch (error) {
      console.error('Failed to save assessment:', error);
      throw new Error('Failed to save assessment to database');
    }
  }

  // Generate unique IDs
  private generateAssessmentId(): string {
    return `assessment_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  private generateUserId(): string {
    return `user_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  // Update K value
  setK(newK: number): void {
    this.k = Math.max(1, newK);
  }

  // Get system metrics
  async getSystemMetrics(): Promise<{
    totalAssessments: number;
    avgProcessingTime: number;
    cacheHitRate: number;
    topCareers: Array<{ career: string; recommendations: number }>;
  }> {
    try {
      const [assessmentCount, avgTime, cacheStats, topCareers] = await Promise.all([
        dbClient.execute('SELECT COUNT(*) as count FROM assessments'),
        dbClient.execute('SELECT AVG(computation_time_ms) as avg_time FROM knn_cache'),
        dbClient.execute('SELECT COUNT(*) as cache_entries FROM knn_cache WHERE expires_at > CURRENT_TIMESTAMP'),
        dbClient.execute(`
          SELECT c.title, COUNT(*) as recommendations
          FROM career_recommendations cr
          JOIN careers c ON cr.career_id = c.id
          GROUP BY c.title
          ORDER BY recommendations DESC
          LIMIT 5
        `)
      ]);

      return {
        totalAssessments: assessmentCount.rows[0]?.count || 0,
        avgProcessingTime: Math.round(avgTime.rows[0]?.avg_time || 0),
        cacheHitRate: 0, // Would need more complex query to calculate
        topCareers: topCareers.rows.map((row: any) => ({
          career: row.title,
          recommendations: row.recommendations
        }))
      };
    } catch (error) {
      console.error('Failed to get system metrics:', error);
      return {
        totalAssessments: 0,
        avgProcessingTime: 0,
        cacheHitRate: 0,
        topCareers: []
      };
    }
  }

  // Get similar users using KNN (for collaborative filtering)
  async getSimilarUsers(userProfile: UserProfile, allUserProfiles: UserProfile[], k?: number): Promise<UserProfile[]> {
    const actualK = k || this.k;
    const userFeatures = await this.calculateUserFeatures(userProfile);

    const distances = await Promise.all(
      allUserProfiles.map(async (profile) => {
        const profileFeatures = await this.calculateUserFeatures(profile);
        const distance = this.calculateEuclideanDistance(userFeatures, profileFeatures);
        return { profile, distance };
      })
    );

    distances.sort((a, b) => a.distance - b.distance);
    return distances.slice(0, actualK).map(d => d.profile);
  }

  // Analyze user profile for insights
  analyzeUserProfile(userProfile: UserProfile): {
    strongestSkills: SkillResult[];
    weakestSkills: SkillResult[];
    dominantPersonalityTraits: PersonalityTrait[];
    recommendedImprovements: string[];
  } {
    const sortedSkills = [...userProfile.skillsResults].sort((a, b) => b.score - a.score);
    const sortedTraits = [...userProfile.personalityTraits].sort((a, b) => b.score - a.score);

    const strongestSkills = sortedSkills.slice(0, 3);
    const weakestSkills = sortedSkills.slice(-3).reverse();
    const dominantPersonalityTraits = sortedTraits.slice(0, 3);

    const recommendedImprovements: string[] = [];
    
    // Suggest improvements for weak skills
    weakestSkills.forEach(skill => {
      if (skill.score < 5) {
        recommendedImprovements.push(
          `Consider improving ${skill.skill} through online courses or practice`
        );
      }
    });

    // Add personality-based recommendations
    const lowExtraversion = userProfile.personalityTraits.find(t => t.trait === 'Extraversion' && t.score < 40);
    if (lowExtraversion) {
      recommendedImprovements.push('Consider developing networking and communication skills');
    }

    const lowLeadership = userProfile.personalityTraits.find(t => t.trait === 'Leadership' && t.score < 40);
    if (lowLeadership) {
      recommendedImprovements.push('Leadership development could open up management opportunities');
    }

    return {
      strongestSkills,
      weakestSkills,
      dominantPersonalityTraits,
      recommendedImprovements
    };
  }

  // Clear cache (for maintenance)
  async clearCache(): Promise<void> {
    try {
      await dbClient.execute('DELETE FROM knn_cache WHERE expires_at < CURRENT_TIMESTAMP');
    } catch (error) {
      console.error('Failed to clear cache:', error);
    }
  }

  // Get cache statistics
  async getCacheStats(): Promise<{
    totalEntries: number;
    activeEntries: number;
    expiredEntries: number;
    avgComputationTime: number;
  }> {
    try {
      const [total, active, expired, avgTime] = await Promise.all([
        dbClient.execute('SELECT COUNT(*) as count FROM knn_cache'),
        dbClient.execute('SELECT COUNT(*) as count FROM knn_cache WHERE expires_at > CURRENT_TIMESTAMP'),
        dbClient.execute('SELECT COUNT(*) as count FROM knn_cache WHERE expires_at <= CURRENT_TIMESTAMP'),
        dbClient.execute('SELECT AVG(computation_time_ms) as avg_time FROM knn_cache')
      ]);

      return {
        totalEntries: total.rows[0]?.count || 0,
        activeEntries: active.rows[0]?.count || 0,
        expiredEntries: expired.rows[0]?.count || 0,
        avgComputationTime: Math.round(avgTime.rows[0]?.avg_time || 0)
      };
    } catch (error) {
      console.error('Failed to get cache stats:', error);
      return {
        totalEntries: 0,
        activeEntries: 0,
        expiredEntries: 0,
        avgComputationTime: 0
      };
    }
  }
}

// Export singleton instance
export const enhancedKNNService = new EnhancedKNNService();
