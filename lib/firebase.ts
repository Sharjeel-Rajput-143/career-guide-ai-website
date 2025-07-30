// This is a mock implementation of Firebase services
// In a real application, you would use the actual Firebase SDK

export interface User {
  uid: string
  email: string
  displayName: string
}

export interface Assessment {
  id: string
  userId: string
  personalityResults: Record<string, number>
  skillsResults: Record<string, number>
  completedAt: Date
}

export interface CareerRecommendation {
  id: string
  title: string
  match: number
  description: string
  skills: string[]
  outlook: string
  salary: string
}

// Mock authentication functions
export const auth = {
  currentUser: null as User | null,

  createUserWithEmailAndPassword: async (email: string, password: string): Promise<{ user: User }> => {
    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 1000))

    const newUser: User = {
      uid: Math.random().toString(36).substring(2, 15),
      email,
      displayName: email.split("@")[0],
    }

    auth.currentUser = newUser
    return { user: newUser }
  },

  signInWithEmailAndPassword: async (email: string, password: string): Promise<{ user: User }> => {
    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 1000))

    const user: User = {
      uid: Math.random().toString(36).substring(2, 15),
      email,
      displayName: email.split("@")[0],
    }

    auth.currentUser = user
    return { user }
  },

  signOut: async (): Promise<void> => {
    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 500))
    auth.currentUser = null
  },
}

// Mock Firestore functions
export const firestore = {
  // Save assessment results
  saveAssessmentResults: async (
    userId: string,
    personalityResults: Record<string, number>,
    skillsResults: Record<string, number>,
  ): Promise<Assessment> => {
    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 1500))

    const assessment: Assessment = {
      id: Math.random().toString(36).substring(2, 15),
      userId,
      personalityResults,
      skillsResults,
      completedAt: new Date(),
    }

    return assessment
  },

  // Get career recommendations based on assessment
  getCareerRecommendations: async (assessmentId: string): Promise<CareerRecommendation[]> => {
    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 1000))

    // Mock recommendations
    return [
      // {
      //   id: "1",
      //   title: "Software Engineer",
      //   match: 92,
      //   description: "Design, develop, and maintain software systems and applications.",
      //   skills: ["Problem Solving", "Technical Aptitude", "Analytical Thinking"],
      //   outlook: "Growing",
      //   salary: "$70,000 - $120,000",
      // },
      // {
      //   id: "2",
      //   title: "UX/UI Designer",
      //   match: 85,
      //   description: "Create user-friendly interfaces and enhance user experience for digital products.",
      //   skills: ["Creativity", "Communication", "Problem Solving"],
      //   outlook: "Stable",
      //   salary: "$65,000 - $110,000",
      // },
      // {
      //   id: "3",
      //   title: "Data Scientist",
      //   match: 78,
      //   description: "Analyze complex data to help organizations make better decisions.",
      //   skills: ["Analytical Thinking", "Technical Aptitude", "Problem Solving"],
      //   outlook: "Growing",
      //   salary: "$75,000 - $130,000",
      // },
    ]
  },
}

// Mock ML service for processing assessment data
// export const mlService = {
//   processAssessmentData: async (
//     personalityResults: Record<string, number>,
//     skillsResults: Record<string, number>,
//   ): Promise<{
//     personalityTraits: Array<{ trait: string; score: number }>
//     topSkills: Array<{ skill: string; score: number }>
//   }> => {
//     // Simulate ML processing delay
//     await new Promise((resolve) => setTimeout(resolve, 2000))

//     // Mock processed results
//     return {
//       personalityTraits: [
//         { trait: "Extraversion", score: 65 },
//         { trait: "Analytical Thinking", score: 82 },
//         { trait: "Creativity", score: 70 },
//         { trait: "Leadership", score: 75 },
//         { trait: "Adaptability", score: 68 },
//       ],
//       topSkills: [
//         { skill: "Problem Solving", score: 8 },
//         { skill: "Communication", score: 7 },
//         { skill: "Technical Aptitude", score: 9 },
//         { skill: "Leadership", score: 7 },
//         { skill: "Creativity", score: 6 },
//       ],
//     }
//   },
// }

// Mock API service for external resources
export const apiService = {
  // Get course recommendations
  getCourseRecommendations: async (
    skills: string[],
    careers: string[],
  ): Promise<
    Array<{
      title: string
      platform: string
      duration: string
      level: string
      rating: number
      url: string
    }>
  > => {
    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 1000))

    // Mock course recommendations
    return [
      // {
      //   title: "Complete Web Development Bootcamp",
      //   platform: "Udemy",
      //   duration: "12 weeks",
      //   level: "Beginner to Intermediate",
      //   rating: 4.8,
      //   url: "#",
      // },
      // {
      //   title: "Data Science Specialization",
      //   platform: "Coursera",
      //   duration: "6 months",
      //   level: "Intermediate",
      //   rating: 4.7,
      //   url: "#",
      // },
      // {
      //   title: "UI/UX Design Professional Certificate",
      //   platform: "edX",
      //   duration: "4 months",
      //   level: "Beginner",
      //   rating: 4.9,
      //   url: "#",
      // },
    ]
  },

  // Get job listings
  getJobListings: async (
    careers: string[],
    location?: string,
  ): Promise<
    Array<{
      id: string
      title: string
      company: string
      location: string
      salary: string
      postedDate: Date
      url: string
    }>
  > => {
    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 1200))

    // Mock job listings
    return [
      // {
      //   id: "job1",
      //   title: "Frontend Developer",
      //   company: "TechCorp Inc.",
      //   location: location || "Remote",
      //   salary: "$80,000 - $100,000",
      //   postedDate: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000), // 3 days ago
      //   url: "#",
      // },
      // {
      //   id: "job2",
      //   title: "UX Designer",
      //   company: "DesignHub",
      //   location: location || "New York, NY",
      //   salary: "$75,000 - $95,000",
      //   postedDate: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000), // 5 days ago
      //   url: "#",
      // },
      // {
      //   id: "job3",
      //   title: "Data Analyst",
      //   company: "DataDrive Solutions",
      //   location: location || "San Francisco, CA",
      //   salary: "$85,000 - $110,000",
      //   postedDate: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000), // 1 day ago
      //   url: "#",
      // },
    ]
  },
}

export default {
  auth,
  firestore,
  // mlService,
  apiService,
}
