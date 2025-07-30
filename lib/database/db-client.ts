// lib/database/db-client.ts
// Working Turso Database Client using @libsql/client

import { createClient, Client } from '@libsql/client';

// Database configuration
const TURSO_DATABASE_URL = process.env.TURSO_DATABASE_URL || 'libsql://career-guide-sharjeel-143.aws-us-east-1.turso.io';
const TURSO_AUTH_TOKEN = process.env.TURSO_AUTH_TOKEN || 'eyJhbGciOiJFZERTQSIsInR5cCI6IkpXVCJ9.eyJhIjoicnciLCJpYXQiOjE3NTM3MjgwMzEsImlkIjoiZGYzNjA3OGItYmMwYS00MTkwLTljOTMtNjliZDZhNGFhZDE0IiwicmlkIjoiZTU1Nzc4NTgtYTFmMy00NmQxLTgyZGUtYzRmZWU3NDRiNzEwIn0.AUP5WEFQDSWMkca1L8s-FV92q_ayDR_4Jh2NsU7TJHSRQm0qqLTvXavDh1QQWs7vRd7DnDvJqFMe_j4XH2InAw';

// Create the database client
const client: Client = createClient({
  url: TURSO_DATABASE_URL,
  authToken: TURSO_AUTH_TOKEN,
});

// Database utility class
export class DatabaseClient {
  private client: Client;

  constructor() {
    this.client = client;
  }

  // Test database connection
  async testConnection(): Promise<boolean> {
    try {
      const result = await this.client.execute('SELECT 1 as test');
      return result.rows.length > 0;
    } catch (error) {
      console.error('Database connection test failed:', error);
      return false;
    }
  }

  // Execute a query with parameters
  async execute(query: string, params: any[] = []) {
    try {
      const result = await this.client.execute({
        sql: query,
        args: params
      });

      // Convert rows to objects with proper typing
      const rows = result.rows.map(row => {
        const obj: any = {};
        result.columns.forEach((column, index) => {
          obj[column] = row[index];
        });
        return obj;
      });

      return {
        rows,
        rowsAffected: result.rowsAffected,
        lastInsertRowid: result.lastInsertRowid?.toString()
      };
    } catch (error) {
      console.error('Database query failed:', error);
      console.error('Query:', query);
      console.error('Params:', params);
      throw error;
    }
  }

  // Execute multiple queries in a transaction
  async transaction(queries: Array<{ sql: string; args?: any[] }>) {
    try {
      const statements = queries.map(q => ({
        sql: q.sql,
        args: q.args || []
      }));

      const results = await this.client.batch(statements);

      // Convert all results to consistent format
      return results.map(result => {
        const rows = result.rows.map(row => {
          const obj: any = {};
          result.columns.forEach((column, index) => {
            obj[column] = row[index];
          });
          return obj;
        });

        return {
          rows,
          rowsAffected: result.rowsAffected,
          lastInsertRowid: result.lastInsertRowid?.toString()
        };
      });

    } catch (error) {
      console.error('Database transaction failed:', error);
      throw error;
    }
  }

  // Get database statistics
  async getStats() {
    try {
      const [
        userCount,
        assessmentCount,
        careerCount,
        recommendationCount
      ] = await Promise.all([
        this.execute('SELECT COUNT(*) as count FROM users'),
        this.execute('SELECT COUNT(*) as count FROM assessments'),
        this.execute('SELECT COUNT(*) as count FROM careers'),
        this.execute('SELECT COUNT(*) as count FROM career_recommendations')
      ]);

      return {
        users: userCount.rows[0]?.count || 0,
        assessments: assessmentCount.rows[0]?.count || 0,
        careers: careerCount.rows[0]?.count || 0,
        recommendations: recommendationCount.rows[0]?.count || 0
      };
    } catch (error) {
      console.error('Failed to get database stats:', error);
      return { users: 0, assessments: 0, careers: 0, recommendations: 0 };
    }
  }

  // Close the connection
  async close() {
    try {
      await this.client.close();
    } catch (error) {
      console.warn('Error closing database connection:', error);
    }
  }

  // Get raw client for advanced operations
  getRawClient(): Client {
    return this.client;
  }
}

// Export singleton instance
export const dbClient = new DatabaseClient();

// Export the raw client for direct access if needed
export const db = client;

// Type definitions for database entities
export interface DbUser {
  id: string;
  email?: string;
  name?: string;
  created_at: string;
  updated_at: string;
  preferences_json: string;
  metadata_json: string;
}

export interface DbPersonalityTrait {
  id: number;
  user_id: string;
  trait_name: string;
  score: number;
  assessment_id?: string;
  created_at: string;
}

export interface DbSkillResult {
  id: number;
  user_id: string;
  skill_name: string;
  score: number;
  category: string;
  assessment_id?: string;
  created_at: string;
}

export interface DbCareer {
  id: string;
  title: string;
  description: string;
  industry: string;
  experience_level: string;
  work_environment: string;
  average_salary: string;
  growth_outlook: string;
  required_skills_json: string;
  personality_fit_json: string;
  features_vector?: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface DbAssessment {
  id: string;
  user_id: string;
  assessment_type: string;
  status: string;
  experience_level?: string;
  career_goals?: string;
  preferences_json: string;
  analysis_json: string;
  completed_at?: string;
  created_at: string;
}

export interface DbCareerRecommendation {
  id: number;
  assessment_id: string;
  user_id: string;
  career_id: string;
  match_score: number;
  similarity_score?: number;
  recommendation_source: string;
  match_reasons_json: string;
  ai_reasoning?: string;
  knn_distance?: number;
  model_used?: string;
  k_value?: number;
  created_at: string;
}

export interface DbRecommendationFeedback {
  id: number;
  recommendation_id: number;
  user_id: string;
  feedback_type: string;
  rating?: number;
  comments?: string;
  created_at: string;
}

export interface DbKnnCache {
  id: string;
  user_features_hash: string;
  k_value: number;
  career_recommendations_json: string;
  computation_time_ms?: number;
  expires_at?: string;
  created_at: string;
}

export interface DbInteractionLog {
  id: number;
  user_id?: string;
  session_id?: string;
  action_type: string;
  action_data_json: string;
  timestamp: string;
}

// Utility functions for JSON handling
export const jsonHelpers = {
  parse: <T>(jsonString: string, defaultValue: T): T => {
    try {
      return JSON.parse(jsonString);
    } catch {
      return defaultValue;
    }
  },

  stringify: (obj: any): string => {
    try {
      return JSON.stringify(obj);
    } catch {
      return '{}';
    }
  }
};

// Database health check function
export async function checkDatabaseHealth(): Promise<{
  connected: boolean;
  stats: any;
  latency: number;
}> {
  const startTime = Date.now();
  
  try {
    const connected = await dbClient.testConnection();
    const stats = await dbClient.getStats();
    const latency = Date.now() - startTime;

    return {
      connected,
      stats,
      latency
    };
  } catch (error) {
    console.error('Database health check failed:', error);
    return {
      connected: false,
      stats: null,
      latency: Date.now() - startTime
    };
  }
}

// Initialize database connection test (optional)
export async function initializeDatabase(): Promise<boolean> {
  try {
    const isConnected = await dbClient.testConnection();
    
    if (isConnected) {
      const stats = await dbClient.getStats();
      return true;
    } else {
      console.warn('❌ Database connection failed');
      return false;
    }
  } catch (error) {
    console.error('❌ Database initialization error:', error);
    return false;
  }
}