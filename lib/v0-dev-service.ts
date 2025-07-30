// lib/v0-dev-service.ts
const V0_API_KEY = "v1:0zMRnWhG4hZNXtaIQXJ1LOfQ:N1JtAdAN0vXsyWebe70Fq70F"; // Replace with your actual v0.dev API key

interface UserProfile {
  personalityTraits: Array<{ trait: string; score: number }>;
  skillsResults: Array<{ skill: string; score: number }>;
  preferences?: {
    location?: string;
    workEnvironment?: string;
    industry?: string;
  };
  experience?: string;
  careerGoals?: string;
}

interface Career {
  title: string;
  match: number;
  description: string;
  skills: string[];
  salary: string;
  outlook: string;
}

interface ComponentSpec {
  id: string;
  title: string;
  description: string;
  code: string;
  preview_url?: string;
  created_at: string;
}

interface V0DevResponse {
  components?: ComponentSpec[];
  careers?: Career[];
  dashboard_url?: string;
}

export class CareerGuideV0Dev {
  private static lastRequestTime = 0;
  private static readonly MIN_REQUEST_INTERVAL = 2000; // 2 seconds between requests
  
  // Rate limiting function
  private static async waitForRateLimit(): Promise<void> {
    const now = Date.now();
    const timeSinceLastRequest = now - this.lastRequestTime;
    
    if (timeSinceLastRequest < this.MIN_REQUEST_INTERVAL) {
      const waitTime = this.MIN_REQUEST_INTERVAL - timeSinceLastRequest;
      console.log(`⏳ V0.dev Rate limiting: waiting ${waitTime}ms before next request`);
      await new Promise(resolve => setTimeout(resolve, waitTime));
    }
    
    this.lastRequestTime = Date.now();
  }

  // Generate career dashboard UI component
  static async generateCareerDashboard(userProfile: UserProfile, careers: Career[]): Promise<V0DevResponse> {
    await this.waitForRateLimit();
    
    const prompt = `Create a modern, responsive career dashboard component for a user with the following profile:
    
User Profile: ${JSON.stringify(userProfile, null, 2)}
Recommended Careers: ${JSON.stringify(careers, null, 2)}

Requirements:
- Modern React component with TypeScript
- Responsive design using Tailwind CSS
- Display user's personality traits as progress bars
- Show career recommendations with match percentages
- Include skill assessment results
- Add interactive elements like career comparison
- Use modern UI patterns (cards, gradients, animations)
- Include a career roadmap section
- Make it visually appealing and professional

Component name: CareerDashboard`;

    return await this.makeV0APICall(prompt, 'dashboard');
  }

  // Generate job application tracker component
  static async generateJobTracker(careers: Career[]): Promise<V0DevResponse> {
    await this.waitForRateLimit();
    
    const prompt = `Create a job application tracker component for these career paths:
    
Careers: ${JSON.stringify(careers, null, 2)}

Requirements:
- React component with TypeScript and Tailwind CSS
- Job application status tracking (Applied, Interview, Offer, Rejected)
- Drag and drop functionality for status updates
- Application deadline reminders
- Company research notes section
- Interview preparation checklist
- Statistics dashboard showing application success rates
- Export functionality for application data
- Modern, professional design

Component name: JobApplicationTracker`;

    return await this.makeV0APICall(prompt, 'job-tracker');
  }

  // Generate skill development roadmap component
  static async generateSkillRoadmap(userProfile: UserProfile, targetCareer: Career): Promise<V0DevResponse> {
    await this.waitForRateLimit();
    
    const prompt = `Create a skill development roadmap component based on:
    
Current Skills: ${JSON.stringify(userProfile.skillsResults, null, 2)}
Target Career: ${JSON.stringify(targetCareer, null, 2)}

Requirements:
- Interactive roadmap showing skill progression
- Current skill level vs required skill level comparison
- Learning resources recommendations (courses, books, projects)
- Timeline with milestones
- Progress tracking with completion percentages
- Achievement badges system
- Learning path visualization
- Resource links and cost estimates
- Modern design with progress indicators

Component name: SkillDevelopmentRoadmap`;

    return await this.makeV0APICall(prompt, 'skill-roadmap');
  }

  // Generate career comparison component
  static async generateCareerComparison(careers: Career[]): Promise<V0DevResponse> {
    await this.waitForRateLimit();
    
    const prompt = `Create a career comparison component for these careers:
    
Careers: ${JSON.stringify(careers, null, 2)}

Requirements:
- Side-by-side comparison table/cards
- Compare salary ranges, job outlook, required skills
- Match score visualization
- Pros and cons for each career
- Industry growth trends
- Work-life balance indicators
- Educational requirements
- Career advancement opportunities
- Interactive filtering and sorting
- Export comparison as PDF

Component name: CareerComparison`;

    return await this.makeV0APICall(prompt, 'career-comparison');
  }

  // Generate networking component
  static async generateNetworkingHub(targetIndustry: string): Promise<V0DevResponse> {
    await this.waitForRateLimit();
    
    const prompt = `Create a professional networking hub component for the ${targetIndustry} industry:

Requirements:
- Industry professional directory with filters
- Event calendar for networking events
- Mentorship matching system
- Discussion forums by topic
- Career advice from industry experts
- LinkedIn-style connection requests
- Message system for professional communication
- Industry news and updates feed
- Job referral system
- Professional development workshops

Component name: NetworkingHub`;

    return await this.makeV0APICall(prompt, 'networking-hub');
  }

  // Enhanced API call function with v0.dev specific handling
  static async makeV0APICall(prompt: string, componentType: string, maxRetries: number = 3): Promise<V0DevResponse> {
    const apiRequestBody = {
      prompt: prompt,
      model: "v0-latest", // or whatever model v0.dev uses
      framework: "react",
      styling: "tailwind",
      typescript: true,
      responsive: true
    };

    for (let attempt = 1; attempt <= maxRetries; attempt++) {
      try {
        console.log(`🎨 V0.dev API attempt ${attempt}/${maxRetries} for ${componentType}`);
        
        const response = await fetch("https://api.v0.dev/v1/generate", {
          method: "POST",
          headers: {
            "Authorization": `Bearer ${V0_API_KEY}`,
            "Content-Type": "application/json",
            "Accept": "application/json"
          },
          body: JSON.stringify(apiRequestBody)
        });

        console.log(`📡 V0.dev API Response Status: ${response.status}`);

        // Handle rate limiting
        if (response.status === 429) {
          const retryAfter = response.headers.get('retry-after');
          const waitTime = retryAfter ? parseInt(retryAfter) * 1000 : Math.pow(2, attempt) * 2000;
          
          console.log(`⏳ V0.dev rate limit hit (429). Waiting ${waitTime}ms before retry ${attempt}/${maxRetries}`);
          
          if (attempt < maxRetries) {
            await new Promise(resolve => setTimeout(resolve, waitTime));
            continue;
          } else {
            console.log('⚠️ Max retries reached for rate limiting. Using fallback component.');
            return this.getFallbackComponent(componentType);
          }
        }

        // Handle authentication errors
        if (response.status === 401) {
          console.error('🔑 V0.dev authentication failed - API key may be invalid');
          throw new Error('Invalid V0.dev API key - please check your v0.dev API key');
        }

        // Handle billing issues
        if (response.status === 402) {
          console.error('💳 V0.dev billing issue detected');
          throw new Error('Billing issue - please check your v0.dev account billing');
        }

        if (!response.ok) {
          const errorText = await response.text();
          console.error('❌ V0.dev API Error Response:', errorText);
          
          if (attempt < maxRetries) {
            console.log(`🔄 Retrying after error... (${attempt}/${maxRetries})`);
            await new Promise(resolve => setTimeout(resolve, 2000));
            continue;
          } else {
            throw new Error(`V0.dev API request failed: ${response.status} - ${response.statusText}`);
          }
        }

        const data = await response.json();
        console.log('✅ V0.dev API Response received successfully');
        
        if (data.components && data.components.length > 0) {
          console.log('🎯 Successfully received V0.dev components:', data.components.length);
          return {
            components: data.components,
            dashboard_url: data.dashboard_url
          };
        }
        
        throw new Error('No components returned from V0.dev');
        
      } catch (error) {
        console.error(`❌ V0.dev attempt ${attempt} failed:`, error);
        
        if (attempt === maxRetries) {
          console.log('🔄 All V0.dev attempts failed, using fallback component');
          return this.getFallbackComponent(componentType);
        }
        
        // Wait before retry (exponential backoff)
        const waitTime = Math.pow(2, attempt) * 1000;
        console.log(`⏳ Waiting ${waitTime}ms before retry...`);
        await new Promise(resolve => setTimeout(resolve, waitTime));
      }
    }

    // This should never be reached, but just in case
    return this.getFallbackComponent(componentType);
  }

  // Fallback components for when API fails
  static getFallbackComponent(componentType: string): V0DevResponse {
    console.log(`📋 Using fallback component for ${componentType}`);
    
    const fallbackComponents: Record<string, ComponentSpec> = {
      'dashboard': {
        id: 'career-dashboard-fallback',
        title: 'Career Dashboard',
        description: 'A comprehensive career guidance dashboard',
        code: `import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';

export default function CareerDashboard() {
  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      <h1 className="text-3xl font-bold text-gray-900">Career Dashboard</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Personality Traits</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <div className="flex justify-between mb-2">
                <span>Analytical</span>
                <span>85%</span>
              </div>
              <Progress value={85} />
            </div>
            <div>
              <div className="flex justify-between mb-2">
                <span>Creative</span>
                <span>72%</span>
              </div>
              <Progress value={72} />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Career Matches</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span>Software Developer</span>
                <span className="bg-green-100 text-green-800 px-2 py-1 rounded text-sm">88%</span>
              </div>
              <div className="flex justify-between items-center">
                <span>Data Analyst</span>
                <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-sm">82%</span>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Next Steps</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2 text-sm">
              <li className="flex items-center">
                <span className="w-2 h-2 bg-blue-500 rounded-full mr-2"></span>
                Complete skill assessment
              </li>
              <li className="flex items-center">
                <span className="w-2 h-2 bg-green-500 rounded-full mr-2"></span>
                Update resume
              </li>
              <li className="flex items-center">
                <span className="w-2 h-2 bg-yellow-500 rounded-full mr-2"></span>
                Apply to 3 jobs
              </li>
            </ul>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}`,
        created_at: new Date().toISOString()
      },
      
      'job-tracker': {
        id: 'job-tracker-fallback',
        title: 'Job Application Tracker',
        description: 'Track your job applications and interview progress',
        code: `import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

export default function JobApplicationTracker() {
  const [applications] = useState([
    { id: 1, company: 'TechCorp', position: 'Software Developer', status: 'Applied', date: '2024-01-15' },
    { id: 2, company: 'DataFlow', position: 'Data Analyst', status: 'Interview', date: '2024-01-10' },
    { id: 3, company: 'DesignHub', position: 'UX Designer', status: 'Offer', date: '2024-01-05' }
  ]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Applied': return 'bg-blue-100 text-blue-800';
      case 'Interview': return 'bg-yellow-100 text-yellow-800';
      case 'Offer': return 'bg-green-100 text-green-800';
      case 'Rejected': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">Job Application Tracker</h1>
      
      <div className="grid gap-4">
        {applications.map((app) => (
          <Card key={app.id}>
            <CardContent className="p-4">
              <div className="flex justify-between items-center">
                <div>
                  <h3 className="font-semibold text-lg">{app.position}</h3>
                  <p className="text-gray-600">{app.company}</p>
                  <p className="text-sm text-gray-500">Applied: {app.date}</p>
                </div>
                <Badge className={getStatusColor(app.status)}>
                  {app.status}
                </Badge>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}`,
        created_at: new Date().toISOString()
      }
    };

    const component = fallbackComponents[componentType] || fallbackComponents['dashboard'];
    
    return {
      components: [component]
    };
  }

  // Utility method to combine ChatGPT and V0.dev services
  static async generateCompleteCareerSuite(userProfile: UserProfile, careers: Career[]): Promise<{
    dashboard: V0DevResponse;
    jobTracker: V0DevResponse;
    skillRoadmap: V0DevResponse;
    comparison: V0DevResponse;
  }> {
    console.log('🚀 Generating complete career guidance suite...');
    
    try {
      const [dashboard, jobTracker, skillRoadmap, comparison] = await Promise.all([
        this.generateCareerDashboard(userProfile, careers),
        this.generateJobTracker(careers),
        this.generateSkillRoadmap(userProfile, careers[0]), // Use top career match
        this.generateCareerComparison(careers)
      ]);

      return { dashboard, jobTracker, skillRoadmap, comparison };
    } catch (error) {
      console.error('❌ Error generating career suite:', error);
      throw error;
    }
  }
}