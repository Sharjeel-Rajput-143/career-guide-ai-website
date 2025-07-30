// // lib/services/ai-only-knn-service.ts
// // Updated AI-only KNN Service with bootstrap logic for empty database

// import { DatabaseService } from '@/lib/database/db-client';
// import { KNNEngine } from '@/lib/knn/knn-engine';

// export interface UserProfile {
//   personalityTraits: Array<{
//     trait: string;
//     score: number;
//   }>;
//   skillsResults: Array<{
//     skill: string;
//     score: number;
//     category?: string;
//   }>;
//   preferences?: {
//     workEnvironment?: string;
//     industry?: string;
//     location?: string;
//   };
//   experience?: string;
//   careerGoals?: string;
// }

// export interface CareerRecommendation {
//   title: string;
//   match: number;
//   description: string;
//   skills: string[];
//   salary: string;
//   outlook: string;
//   reasoning: string;
//   source: 'knn' | 'ai' | 'hybrid';
//   knnEnhanced: boolean;
//   industry?: string;
//   experienceLevel?: string;
//   workEnvironment?: string;
// }

// export class AIOnlyKNNService {
//   private k: number = 8;
//   private dbService: DatabaseService;
//   private knnEngine: KNNEngine;
//   private cache: Map<string, any> = new Map();

//   constructor() {
//     this.dbService = new DatabaseService();
//     this.knnEngine = new KNNEngine();
//   }

//   async getCareerRecommendations(
//     userProfile: UserProfile,
//     options: {
//       k?: number;
//       useCache?: boolean;
//       includeDebug?: boolean;
//       saveToDatabase?: boolean;
//       model?: string;
//     } = {}
//   ) {
//     const startTime = Date.now();
//     const { k = this.k, useCache = true, includeDebug = false, saveToDatabase = true, model = 'sonnet' } = options;

//     try {
//       console.log('🚀 AI-only KNN service starting...');

//       // Check cache
//       const cacheKey = this.generateCacheKey(userProfile);
//       if (useCache && this.cache.has(cacheKey)) {
//         console.log('📦 Returning cached results');
//         return this.cache.get(cacheKey);
//       }

//       // Check database for existing careers
//       const existingCareers = await this.dbService.getCareers();
//       console.log(`📊 Found ${existingCareers.length} careers in database`);

//       let recommendations: CareerRecommendation[] = [];
//       let knnAnalysis: any = null;
//       let source: 'knn' | 'ai' | 'hybrid' = 'ai';

//       // If we have careers in the database, try KNN first
//       if (existingCareers.length >= k) {
//         console.log(`🧠 Running KNN with ${existingCareers.length} careers...`);
        
//         try {
//           const knnResults = await this.knnEngine.findSimilarCareers(userProfile, existingCareers, k);
          
//           if (knnResults && knnResults.recommendations.length > 0) {
//             recommendations = knnResults.recommendations.map((rec:any) => ({
//               ...rec,
//               source: 'knn' as const,
//               knnEnhanced: true
//             }));
//             knnAnalysis = knnResults.analysis;
//             source = 'knn';
//             console.log(`✅ KNN found ${recommendations.length} matches`);
//           }
//         } catch (knnError) {
//           console.warn('⚠️ KNN processing failed:', knnError);
//         }
//       } else {
//         console.log(`⚠️ Not enough careers for KNN (${existingCareers.length} < ${k}). Will use AI generation.`);
//       }

//       // If KNN didn't provide enough recommendations, use AI to generate new ones
//       if (recommendations.length < 5) {
//         console.log(`🤖 Using AI to generate careers (model: ${model})...`);
        
//         try {
//           // Call AI career generation API
//           const aiResponse = await fetch(process.env.NEXT_PUBLIC_APP_URL + '/api/career-recommendations' || 'http://localhost:3000/api/career-recommendations', {
//             method: 'POST',
//             headers: {
//               'Content-Type': 'application/json',
//             },
//             body: JSON.stringify({
//               personalityTraits: userProfile.personalityTraits,
//               skillsResults: userProfile.skillsResults,
//               preferences: userProfile.preferences,
//               experience: userProfile.experience,
//               careerGoals: userProfile.careerGoals,
//               model: model
//             })
//           });

//           const aiResult = await aiResponse.json();
          
//           if (aiResult.success && aiResult.data.careers) {
//             const aiCareers = aiResult.data.careers.map((career: any) => ({
//               ...career,
//               source: 'ai' as const,
//               knnEnhanced: false,
//               aiGenerated: true
//             }));

//             // If we had some KNN results, merge them (hybrid approach)
//             if (recommendations.length > 0) {
//               // Remove duplicates based on title
//               const existingTitles = new Set(recommendations.map(r => r.title.toLowerCase()));
//               const newAiCareers = aiCareers.filter((c: any) => !existingTitles.has(c.title.toLowerCase()));
              
//               recommendations = [...recommendations, ...newAiCareers];
//               source = 'hybrid';
//               console.log(`✅ Hybrid approach: ${recommendations.length} total careers`);
//             } else {
//               recommendations = aiCareers;
//               source = 'ai';
//               console.log(`✅ AI generated ${aiCareers.length} careers`);
//             }

//             // Save AI-generated careers to database for future KNN use
//             if (saveToDatabase && aiCareers.length > 0) {
//               console.log('💾 Saving AI-generated careers to database...');
//               for (const career of aiCareers) {
//                 await this.dbService.saveCareer({
//                   ...career,
//                   userProfile: userProfile,
//                   generatedAt: new Date().toISOString()
//                 });
//               }
//             }
//           } else {
//             throw new Error(`AI career generation failed: ${aiResult.error || 'Unknown error'}`);
//           }
//         } catch (aiError) {
//           console.error('❌ AI generation failed:', aiError);
//           throw new Error(`Career generation failed: ${aiError}`);
//         }
//       }

//       // Sort recommendations by match score
//       recommendations.sort((a, b) => b.match - a.match);

//       // Enhanced KNN analysis
//       if (!knnAnalysis) {
//         knnAnalysis = {
//           totalCareers: existingCareers.length,
//           averageSimilarity: recommendations.length > 0 
//             ? Math.round(recommendations.reduce((sum, r) => sum + r.match, 0) / recommendations.length)
//             : 0,
//           topSkillMatches: this.extractTopSkills(userProfile.skillsResults),
//           topPersonalityMatches: this.extractTopPersonality(userProfile.personalityTraits),
//           processingTime: Date.now() - startTime,
//           source: source,
//           hybridGeneration: source === 'hybrid'
//         };
//       }

//       // Save assessment to database
//       let assessmentId: string | undefined;
//       let userId: string | undefined;
      
//       if (saveToDatabase) {
//         try {
//           const assessmentResult = await this.dbService.saveAssessment({
//             userProfile,
//             recommendations,
//             knnAnalysis,
//             model,
//             source,
//             timestamp: new Date().toISOString()
//           });
//           assessmentId = assessmentResult.assessmentId;
//           userId = assessmentResult.userId;
//           console.log(`💾 Assessment saved: ${assessmentId}`);
//         } catch (dbError) {
//           console.warn('⚠️ Failed to save assessment:', dbError);
//         }
//       }

//       const result = {
//         recommendations,
//         knnAnalysis,
//         assessmentId,
//         userId,
//         debugInfo: includeDebug ? {
//           totalProcessingTime: Date.now() - startTime,
//           cacheUsed: false,
//           databaseCareers: existingCareers.length,
//           source,
//           model,
//           kValue: k,
//           userProfileSummary: {
//             topSkills: this.extractTopSkills(userProfile.skillsResults),
//             topTraits: this.extractTopPersonality(userProfile.personalityTraits)
//           }
//         } : undefined
//       };

//       // Cache the result
//       if (useCache) {
//         this.cache.set(cacheKey, result);
//       }

//       return result;

//     } catch (error) {
//       console.error('❌ AI-only KNN service error:', error);
//       throw error;
//     }
//   }

//   private generateCacheKey(userProfile: UserProfile): string {
//     const traits = userProfile.personalityTraits.map(t => `${t.trait}:${t.score}`).join(',');
//     const skills = userProfile.skillsResults.map(s => `${s.skill}:${s.score}`).join(',');
//     return `${traits}-${skills}`;
//   }

//   private extractTopSkills(skills: Array<{ skill: string; score: number; category?: string }>): string[] {
//     return skills
//       .filter(s => s.score >= 7)
//       .sort((a, b) => b.score - a.score)
//       .slice(0, 3)
//       .map(s => s.skill);
//   }

//   private extractTopPersonality(traits: Array<{ trait: string; score: number }>): string[] {
//     return traits
//       .filter(t => t.score >= 70)
//       .sort((a, b) => b.score - a.score)
//       .slice(0, 3)
//       .map(t => t.trait);
//   }

//   setK(k: number): void {
//     this.k = k;
//   }
// }

// export const aiOnlyKNNService = new AIOnlyKNNService();