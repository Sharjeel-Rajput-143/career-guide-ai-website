// // Backend API functions for the AI Career Recommendation System

// import { auth, firestore, mlService, apiService } from "@/lib/firebase"

// // User authentication functions
// export const userAPI = {
//   // Register a new user
//   registerUser: async (email: string, password: string, name: string) => {
//     try {
//       const { user } = await auth.createUserWithEmailAndPassword(email, password)

//       // Create user profile
//       await createUserProfile(user.uid, {
//         email,
//         displayName: name,
//         createdAt: new Date(),
//       })

//       return { success: true, user }
//     } catch (error) {
//       console.error("Error registering user:", error)
//       return { success: false, error: "Failed to register user" }
//     }
//   },

//   // Login user
//   loginUser: async (email: string, password: string) => {
//     try {
//       const { user } = await auth.signInWithEmailAndPassword(email, password)
//       return { success: true, user }
//     } catch (error) {
//       console.error("Error logging in:", error)
//       return { success: false, error: "Invalid email or password" }
//     }
//   },

//   // Logout user
//   logoutUser: async () => {
//     try {
//       await auth.signOut()
//       return { success: true }
//     } catch (error) {
//       console.error("Error logging out:", error)
//       return { success: false, error: "Failed to log out" }
//     }
//   },

//   // Get current user
//   getCurrentUser: () => {
//     return auth.currentUser
//   },
// }

// // Create user profile in database
// const createUserProfile = async (userId: string, userData: any) => {
//   return { userId, ...userData }
// }

// // Assessment functions
// export const assessmentAPI = {
//   // Save personality assessment results
//   savePersonalityResults: async (userId: string, results: Record<string, number>) => {
//     try {
//       const assessmentData = {
//         userId,
//         type: "personality",
//         results,
//         completedAt: new Date(),
//       }

//       // Save to database
//       const assessment = await firestore.saveAssessmentResults(userId, results, {})
//       return { success: true, assessment }
//     } catch (error) {
//       console.error("Error saving personality results:", error)
//       return { success: false, error: "Failed to save assessment results" }
//     }
//   },

//   // Save skills assessment results
//   saveSkillsResults: async (userId: string, results: Record<string, number>) => {
//     try {
//       const assessmentData = {
//         userId,
//         type: "skills",
//         results,
//         completedAt: new Date(),
//       }

//       // Save to database
//       const assessment = await firestore.saveAssessmentResults(userId, {}, results)
//       return { success: true, assessment }
//     } catch (error) {
//       console.error("Error saving skills results:", error)
//       return { success: false, error: "Failed to save assessment results" }
//     }
//   },

//   // Get assessment results
//   getAssessmentResults: async (userId: string) => {
//     try {
//       // In a real app, this would fetch from Firestore
//       // Mock data for demonstration
//       const personalityResults = {
//         extraversion: 65,
//         analyticalThinking: 82,
//         creativity: 70,
//         leadership: 75,
//         adaptability: 68,
//       }

//       const skillsResults = {
//         problemSolving: 8,
//         communication: 7,
//         technicalAptitude: 9,
//         leadership: 7,
//         creativity: 6,
//       }

//       return {
//         success: true,
//         results: {
//           personality: personalityResults,
//           skills: skillsResults,
//           lastUpdated: new Date(),
//         },
//       }
//     } catch (error) {
//       console.error("Error getting assessment results:", error)
//       return { success: false, error: "Failed to retrieve assessment results" }
//     }
//   },

//   // Process assessment data and get career recommendations
//   getCareerRecommendations: async (userId: string) => {
//     try {
//       // Get user's assessment results
//       const { results } = await assessmentAPI.getAssessmentResults(userId)

//       if (!results) {
//         return { success: false, error: "No assessment results found" }
//       }

//       // Process data through ML service
//       const processedData = await mlService.processAssessmentData(results.personality, results.skills)

//       // Get career recommendations
//       const recommendations = await firestore.getCareerRecommendations("mock-assessment-id")

//       return {
//         success: true,
//         personalityTraits: processedData.personalityTraits,
//         topSkills: processedData.topSkills,
//         careerRecommendations: recommendations,
//       }
//     } catch (error) {
//       console.error("Error getting career recommendations:", error)
//       return { success: false, error: "Failed to generate career recommendations" }
//     }
//   },
// }

// // Resource API functions
// export const resourceAPI = {
//   // Get course recommendations
//   getCourseRecommendations: async (userId: string) => {
//     try {
//       // Get user's career recommendations
//       const { careerRecommendations } = await assessmentAPI.getCareerRecommendations(userId)

//       if (!careerRecommendations) {
//         return { success: false, error: "No career recommendations found" }
//       }

//       // Extract career titles and skills
//       const careerTitles = careerRecommendations.map((career) => career.title)
//       const skills = careerRecommendations.flatMap((career) => career.skills)

//       // Get course recommendations
//       const courses = await apiService.getCourseRecommendations(skills, careerTitles)

//       return { success: true, courses }
//     } catch (error) {
//       console.error("Error getting course recommendations:", error)
//       return { success: false, error: "Failed to get course recommendations" }
//     }
//   },

//   // Get job recommendations
//   getJobRecommendations: async (userId: string, location?: string) => {
//     try {
//       // Get user's career recommendations
//       const { careerRecommendations } = await assessmentAPI.getCareerRecommendations(userId)

//       if (!careerRecommendations) {
//         return { success: false, error: "No career recommendations found" }
//       }

//       // Extract career titles
//       const careerTitles = careerRecommendations.map((career) => career.title)

//       // Get job listings
//       const jobs = await apiService.getJobListings(careerTitles, location)

//       return { success: true, jobs }
//     } catch (error) {
//       console.error("Error getting job recommendations:", error)
//       return { success: false, error: "Failed to get job recommendations" }
//     }
//   },
// }

// // Export all APIs
// export default {
//   user: userAPI,
//   assessment: assessmentAPI,
//   resource: resourceAPI,
// }
