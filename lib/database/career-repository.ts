// lib/database/career-repository.ts
// Career data repository for Turso database

import { dbClient, DbCareer, jsonHelpers } from './db-client';

export interface CareerData {
  id: string;
  title: string;
  description: string;
  industry: string;
  experienceLevel: string;
  workEnvironment: string;
  averageSalary: string;
  growthOutlook: string;
  requiredSkills: { [skillName: string]: number };
  personalityFit: { [trait: string]: number };
  featuresVector?: number[];
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export class CareerRepository {
  // Get all active careers
  async getAllCareers(): Promise<CareerData[]> {
    try {
      const result = await dbClient.execute(
        'SELECT * FROM careers WHERE is_active = 1 ORDER BY title'
      );

      return result.rows.map((row:any) => this.mapDbToCareer(row as any));
    } catch (error) {
      console.error('Failed to get careers:', error);
      throw new Error('Failed to retrieve careers from database');
    }
  }

  // Get career by ID
  async getCareerById(id: string): Promise<CareerData | null> {
    try {
      const result = await dbClient.execute(
        'SELECT * FROM careers WHERE id = ? AND is_active = 1',
        [id]
      );

      if (result.rows.length === 0) {
        return null;
      }

      return this.mapDbToCareer(result.rows[0] as any);
    } catch (error) {
      console.error('Failed to get career by ID:', error);
      throw new Error('Failed to retrieve career from database');
    }
  }

  // Get careers by industry
  async getCareersByIndustry(industry: string): Promise<CareerData[]> {
    try {
      const result = await dbClient.execute(
        'SELECT * FROM careers WHERE industry = ? AND is_active = 1 ORDER BY title',
        [industry]
      );

      return result.rows.map((row:any) => this.mapDbToCareer(row as any));
    } catch (error) {
      console.error('Failed to get careers by industry:', error);
      throw new Error('Failed to retrieve careers by industry');
    }
  }

  // Get careers by experience level
  async getCareersByExperienceLevel(experienceLevel: string): Promise<CareerData[]> {
    try {
      const result = await dbClient.execute(
        'SELECT * FROM careers WHERE experience_level = ? AND is_active = 1 ORDER BY title',
        [experienceLevel]
      );

      return result.rows.map((row:any) => this.mapDbToCareer(row as any));
    } catch (error) {
      console.error('Failed to get careers by experience level:', error);
      throw new Error('Failed to retrieve careers by experience level');
    }
  }

  // Create or update career
  async upsertCareer(career: Omit<CareerData, 'createdAt' | 'updatedAt'>): Promise<CareerData> {
    try {
      const featuresVectorStr = career.featuresVector ? career.featuresVector.join(',') : null;

      const result = await dbClient.execute(`
        INSERT INTO careers (
          id, title, description, industry, experience_level, work_environment,
          average_salary, growth_outlook, required_skills_json, personality_fit_json,
          features_vector, is_active, updated_at
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, CURRENT_TIMESTAMP)
        ON CONFLICT(id) DO UPDATE SET
          title = excluded.title,
          description = excluded.description,
          industry = excluded.industry,
          experience_level = excluded.experience_level,
          work_environment = excluded.work_environment,
          average_salary = excluded.average_salary,
          growth_outlook = excluded.growth_outlook,
          required_skills_json = excluded.required_skills_json,
          personality_fit_json = excluded.personality_fit_json,
          features_vector = excluded.features_vector,
          is_active = excluded.is_active,
          updated_at = CURRENT_TIMESTAMP
      `, [
        career.id,
        career.title,
        career.description,
        career.industry,
        career.experienceLevel,
        career.workEnvironment,
        career.averageSalary,
        career.growthOutlook,
        jsonHelpers.stringify(career.requiredSkills),
        jsonHelpers.stringify(career.personalityFit),
        featuresVectorStr,
        career.isActive ? 1 : 0
      ]);

      // Return the updated career
      const updatedCareer = await this.getCareerById(career.id);
      if (!updatedCareer) {
        throw new Error('Failed to retrieve updated career');
      }

      return updatedCareer;
    } catch (error) {
      console.error('Failed to upsert career:', error);
      throw new Error('Failed to save career to database');
    }
  }

  // Update features vector for KNN
  async updateFeaturesVector(careerId: string, featuresVector: number[]): Promise<void> {
    try {
      await dbClient.execute(
        'UPDATE careers SET features_vector = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?',
        [featuresVector.join(','), careerId]
      );
    } catch (error) {
      console.error('Failed to update features vector:', error);
      throw new Error('Failed to update career features vector');
    }
  }

  // Bulk update features vectors
  async bulkUpdateFeaturesVectors(updates: Array<{ id: string; features: number[] }>): Promise<void> {
    try {
      const queries = updates.map(update => ({
        sql: 'UPDATE careers SET features_vector = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?',
        args: [update.features.join(','), update.id]
      }));

      await dbClient.transaction(queries);
    } catch (error) {
      console.error('Failed to bulk update features vectors:', error);
      throw new Error('Failed to bulk update career features vectors');
    }
  }

  // Delete career (soft delete)
  async deleteCareer(careerId: string): Promise<void> {
    try {
      await dbClient.execute(
        'UPDATE careers SET is_active = 0, updated_at = CURRENT_TIMESTAMP WHERE id = ?',
        [careerId]
      );
    } catch (error) {
      console.error('Failed to delete career:', error);
      throw new Error('Failed to delete career');
    }
  }

  // Get career statistics
  async getCareerStats(): Promise<{
    totalCareers: number;
    activeCareers: number;
    careersByIndustry: { [industry: string]: number };
    careersByExperienceLevel: { [level: string]: number };
  }> {
    try {
      const [totalResult, activeResult, industryResult, experienceResult] = await Promise.all([
        dbClient.execute('SELECT COUNT(*) as count FROM careers'),
        dbClient.execute('SELECT COUNT(*) as count FROM careers WHERE is_active = 1'),
        dbClient.execute('SELECT industry, COUNT(*) as count FROM careers WHERE is_active = 1 GROUP BY industry'),
        dbClient.execute('SELECT experience_level, COUNT(*) as count FROM careers WHERE is_active = 1 GROUP BY experience_level')
      ]);

      const careersByIndustry: { [industry: string]: number } = {};
      const careersByExperienceLevel: { [level: string]: number } = {};

      industryResult.rows.forEach((row: any) => {
        careersByIndustry[row.industry] = row.count;
      });

      experienceResult.rows.forEach((row: any) => {
        careersByExperienceLevel[row.experience_level] = row.count;
      });

      return {
        totalCareers: totalResult.rows[0]?.count || 0,
        activeCareers: activeResult.rows[0]?.count || 0,
        careersByIndustry,
        careersByExperienceLevel
      };
    } catch (error) {
      console.error('Failed to get career stats:', error);
      throw new Error('Failed to retrieve career statistics');
    }
  }

  // Search careers by skills
  async searchCareersBySkills(skills: string[], minSkillMatch: number = 2): Promise<CareerData[]> {
    try {
      // Create a query that finds careers with matching skills
      const skillConditions = skills.map(() => 'required_skills_json LIKE ?').join(' OR ');
      const skillParams = skills.map(skill => `%"${skill}"%`);

      const result = await dbClient.execute(`
        SELECT *, 
               (${skills.map(() => `CASE WHEN required_skills_json LIKE ? THEN 1 ELSE 0 END`).join(' + ')}) as skill_matches
        FROM careers 
        WHERE is_active = 1 AND (${skillConditions})
        HAVING skill_matches >= ?
        ORDER BY skill_matches DESC, title
      `, [...skillParams, ...skillParams, minSkillMatch]);

      return result.rows.map((row:any) => this.mapDbToCareer(row as any));
    } catch (error) {
      console.error('Failed to search careers by skills:', error);
      throw new Error('Failed to search careers by skills');
    }
  }

  // Get careers for KNN computation (with features vectors)
  async getCareersForKNN(): Promise<CareerData[]> {
    try {
      const result = await dbClient.execute(
        'SELECT * FROM careers WHERE is_active = 1 AND features_vector IS NOT NULL ORDER BY title'
      );

      return result.rows.map((row:any) => this.mapDbToCareer(row as any));
    } catch (error) {
      console.error('Failed to get careers for KNN:', error);
      throw new Error('Failed to retrieve careers for KNN computation');
    }
  }

  // Helper method to map database row to CareerData
  private mapDbToCareer(row: DbCareer): CareerData {
    const requiredSkills = jsonHelpers.parse(row.required_skills_json, {});
    const personalityFit = jsonHelpers.parse(row.personality_fit_json, {});
    
    let featuresVector: number[] | undefined;
    if (row.features_vector) {
      featuresVector = row.features_vector.split(',').map(Number);
    }

    return {
      id: row.id,
      title: row.title,
      description: row.description,
      industry: row.industry,
      experienceLevel: row.experience_level,
      workEnvironment: row.work_environment,
      averageSalary: row.average_salary,
      growthOutlook: row.growth_outlook,
      requiredSkills,
      personalityFit,
      featuresVector,
      isActive: Boolean(row.is_active),
      createdAt: row.created_at,
      updatedAt: row.updated_at
    };
  }

  // Add new career with auto-generated ID
  async addCareer(careerData: Omit<CareerData, 'id' | 'createdAt' | 'updatedAt' | 'isActive'>): Promise<CareerData> {
    const careerId = careerData.title.toLowerCase().replace(/[^a-z0-9]/g, '-').replace(/-+/g, '-');
    
    const career: Omit<CareerData, 'createdAt' | 'updatedAt'> = {
      ...careerData,
      id: careerId,
      isActive: true
    };

    return await this.upsertCareer(career);
  }

  // Get unique industries
  async getUniqueIndustries(): Promise<string[]> {
    try {
      const result = await dbClient.execute(
        'SELECT DISTINCT industry FROM careers WHERE is_active = 1 ORDER BY industry'
      );

      return result.rows.map((row: any) => row.industry);
    } catch (error) {
      console.error('Failed to get unique industries:', error);
      throw new Error('Failed to retrieve industries');
    }
  }

  // Get unique experience levels
  async getUniqueExperienceLevels(): Promise<string[]> {
    try {
      const result = await dbClient.execute(
        'SELECT DISTINCT experience_level FROM careers WHERE is_active = 1 ORDER BY experience_level'
      );

      return result.rows.map((row: any) => row.experience_level);
    } catch (error) {
      console.error('Failed to get unique experience levels:', error);
      throw new Error('Failed to retrieve experience levels');
    }
  }
}

// Export singleton instance
export const careerRepository = new CareerRepository();