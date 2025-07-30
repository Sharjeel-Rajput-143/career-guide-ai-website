// lib/database/http-db-client.ts
// Direct HTTP client for Turso database - No dependencies required

const TURSO_DATABASE_URL = process.env.TURSO_DATABASE_URL || 'libsql://career-guide-sharjeel-143.aws-us-east-1.turso.io';
const TURSO_AUTH_TOKEN = process.env.TURSO_AUTH_TOKEN || 'eyJhbGciOiJFZERTQSIsInR5cCI6IkpXVCJ9.eyJhIjoicnciLCJpYXQiOjE3NTM3MjgwMzEsImlkIjoiZGYzNjA3OGItYmMwYS00MTkwLTljOTMtNjliZDZhNGFhZDE0IiwicmlkIjoiZTU1Nzc4NTgtYTFmMy00NmQxLTgyZGUtYzRmZWU3NDRiNzEwIn0.AUP5WEFQDSWMkca1L8s-FV92q_ayDR_4Jh2NsU7TJHSRQm0qqLTvXavDh1QQWs7vRd7DnDvJqFMe_j4XH2InAw';

// Convert libsql URL to HTTP endpoint
function getHttpUrl(libsqlUrl: string): string {
  return libsqlUrl
    .replace('libsql://', 'https://')
    .replace('.turso.io', '.turso.io');
}

const BASE_URL = getHttpUrl(TURSO_DATABASE_URL);

interface TursoResponse {
  results?: Array<{
    columns: string[];
    rows: any[][];
    affected_row_count?: number;
    last_insert_rowid?: string;
  }>;
  error?: {
    message: string;
    code?: string;
  };
}

export class DatabaseClient {
  private baseUrl = BASE_URL;
  private authToken = TURSO_AUTH_TOKEN;

  // Execute a single SQL query
  async execute(sql: string, args: any[] = []) {
    try {
      const response = await fetch(`${this.baseUrl}/v2/pipeline`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.authToken}`,
        },
        body: JSON.stringify({
          requests: [
            {
              type: 'execute',
              stmt: {
                sql,
                args: args.map(arg => ({ type: 'text', value: String(arg) }))
              }
            }
          ]
        })
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const data: TursoResponse = await response.json();

      if (data.error) {
        throw new Error(`Database error: ${data.error.message}`);
      }

      if (!data.results || data.results.length === 0) {
        return { rows: [], rowsAffected: 0 };
      }

      const result = data.results[0];
      
      // Convert rows to objects with column names
      const rows = result.rows.map(row => {
        const obj: any = {};
        result.columns.forEach((col, index) => {
          obj[col] = row[index];
        });
        return obj;
      });

      return {
        rows,
        rowsAffected: result.affected_row_count || 0,
        lastInsertRowid: result.last_insert_rowid
      };

    } catch (error) {
      console.error('Database query failed:', error);
      throw error;
    }
  }

  // Execute multiple queries in a batch
  async transaction(queries: Array<{ sql: string; args?: any[] }>) {
    try {
      const requests = queries.map(q => ({
        type: 'execute',
        stmt: {
          sql: q.sql,
          args: (q.args || []).map(arg => ({ type: 'text', value: String(arg) }))
        }
      }));

      const response = await fetch(`${this.baseUrl}/v2/pipeline`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.authToken}`,
        },
        body: JSON.stringify({ requests })
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const data: TursoResponse = await response.json();

      if (data.error) {
        throw new Error(`Database transaction error: ${data.error.message}`);
      }

      // Return results for all queries
      return (data.results || []).map(result => {
        const rows = result.rows.map(row => {
          const obj: any = {};
          result.columns.forEach((col, index) => {
            obj[col] = row[index];
          });
          return obj;
        });

        return {
          rows,
          rowsAffected: result.affected_row_count || 0,
          lastInsertRowid: result.last_insert_rowid
        };
      });

    } catch (error) {
      console.error('Database transaction failed:', error);
      throw error;
    }
  }

  // Test connection
  async testConnection(): Promise<boolean> {
    try {
      const result = await this.execute('SELECT 1 as test');
      return result.rows.length > 0;
    } catch (error) {
      console.error('Connection test failed:', error);
      return false;
    }
  }

  // Get database statistics
  async getStats() {
    try {
      const queries = [
        { sql: 'SELECT COUNT(*) as count FROM users', table: 'users' },
        { sql: 'SELECT COUNT(*) as count FROM assessments', table: 'assessments' },
        { sql: 'SELECT COUNT(*) as count FROM careers', table: 'careers' },
        { sql: 'SELECT COUNT(*) as count FROM career_recommendations', table: 'recommendations' }
      ];

      const results = await Promise.all(
        queries.map(async (q) => {
          try {
            const result = await this.execute(q.sql);
            return { [q.table]: result.rows[0]?.count || 0 };
          } catch {
            return { [q.table]: 0 };
          }
        })
      );

      return Object.assign({}, ...results);
    } catch (error) {
      console.error('Failed to get database stats:', error);
      return { users: 0, assessments: 0, careers: 0, recommendations: 0 };
    }
  }
}

// Export singleton instance
export const dbClient = new DatabaseClient();

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

// Database health check
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

    return { connected, stats, latency };
  } catch (error) {
    return {
      connected: false,
      stats: null,
      latency: Date.now() - startTime
    };
  }
}

// Type definitions (same as before)
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