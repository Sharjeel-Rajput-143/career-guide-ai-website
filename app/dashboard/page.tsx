// "use client"

// import { useState } from "react"
// import Link from "next/link"
// import { Button } from "@/components/ui/button"
// import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
// import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
// import { Badge } from "@/components/ui/badge"
// import { Progress } from "@/components/ui/progress"
// import {
//   BarChart3,
//   BookOpen,
//   Briefcase,
//   Calendar,
//   ChevronRight,
//   Clock,
//   Download,
//   ExternalLink,
//   FileText,
//   GraduationCap,
//   LineChart,
//   Star,
//   User,
// } from "lucide-react"

// export default function Dashboard() {
//   const [activeTab, setActiveTab] = useState("overview")

//   // Mock user data
//   const userData = {
//     name: "Alex Johnson",
//     email: "alex@example.com",
//     lastAssessment: "2023-05-10",
//     completedAssessments: 2,
//   }

//   // Mock career recommendations
//   const careerRecommendations = [
//     {
//       title: "Software Engineer",
//       match: 92,
//       skills: ["Problem Solving", "Technical Aptitude", "Analytical Thinking"],
//     },
//     {
//       title: "UX/UI Designer",
//       match: 85,
//       skills: ["Creativity", "Communication", "Problem Solving"],
//     },
//     {
//       title: "Data Scientist",
//       match: 78,
//       skills: ["Analytical Thinking", "Technical Aptitude", "Problem Solving"],
//     },
//   ]

//   // Mock course recommendations
//   const courseRecommendations = [
//     {
//       title: "Complete Web Development Bootcamp",
//       platform: "Udemy",
//       progress: 35,
//       nextLesson: "CSS Flexbox and Grid",
//     },
//     {
//       title: "Data Science Specialization",
//       platform: "Coursera",
//       progress: 0,
//       nextLesson: "Introduction to Python",
//     },
//     {
//       title: "UI/UX Design Professional Certificate",
//       platform: "edX",
//       progress: 0,
//       nextLesson: "Design Thinking Fundamentals",
//     },
//   ]

//   // Mock job listings
//   const jobListings = [
//     {
//       title: "Frontend Developer",
//       company: "TechCorp Inc.",
//       location: "Remote",
//       postedDate: "3 days ago",
//       saved: true,
//     },
//     {
//       title: "UX Designer",
//       company: "DesignHub",
//       location: "New York, NY",
//       postedDate: "5 days ago",
//       saved: false,
//     },
//     {
//       title: "Data Analyst",
//       company: "DataDrive Solutions",
//       location: "San Francisco, CA",
//       postedDate: "1 day ago",
//       saved: true,
//     },
//   ]

//   // Mock upcoming events
//   const upcomingEvents = [
//     {
//       title: "Tech Career Fair",
//       date: "May 25, 2023",
//       time: "10:00 AM - 4:00 PM",
//       location: "Virtual",
//     },
//     {
//       title: "Mentorship Session",
//       date: "May 18, 2023",
//       time: "2:00 PM - 3:00 PM",
//       location: "Zoom Meeting",
//     },
//   ]

//   return (
//     <div className="container mx-auto px-4 py-8">
//       <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
//         <div>
//           <h1 className="text-3xl font-bold">Dashboard</h1>
//           <p className="text-gray-600">Welcome back, {userData.name}</p>
//         </div>
//         <div className="mt-4 md:mt-0">
//           <Button asChild>
//             <Link href="/assessment/start">Take New Assessment</Link>
//           </Button>
//         </div>
//       </div>

//       <Tabs defaultValue="overview" value={activeTab} onValueChange={setActiveTab} className="w-full">
//         <TabsList className="grid grid-cols-4 w-full">
//           <TabsTrigger value="overview">Overview</TabsTrigger>
//           <TabsTrigger value="careers">Careers</TabsTrigger>
//           <TabsTrigger value="learning">Learning</TabsTrigger>
//           <TabsTrigger value="jobs">Jobs</TabsTrigger>
//         </TabsList>

//         <TabsContent value="overview" className="mt-6">
//           <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
//             <Card>
//               <CardHeader className="pb-2">
//                 <CardTitle className="text-lg flex items-center">
//                   <User className="mr-2 h-5 w-5 text-indigo-600" />
//                   Profile Completion
//                 </CardTitle>
//               </CardHeader>
//               <CardContent>
//                 <div className="space-y-4">
//                   <div>
//                     <div className="flex justify-between mb-1">
//                       <span className="text-sm font-medium">Overall Progress</span>
//                       <span className="text-sm text-gray-500">75%</span>
//                     </div>
//                     <Progress value={75} className="h-2" />
//                   </div>
//                   <div className="pt-2 space-y-2">
//                     <div className="flex justify-between text-sm">
//                       <span>Personality Assessment</span>
//                       <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
//                         Completed
//                       </Badge>
//                     </div>
//                     <div className="flex justify-between text-sm">
//                       <span>Skills Assessment</span>
//                       <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
//                         Completed
//                       </Badge>
//                     </div>
//                     <div className="flex justify-between text-sm">
//                       <span>Education History</span>
//                       <Badge variant="outline" className="bg-yellow-50 text-yellow-700 border-yellow-200">
//                         Incomplete
//                       </Badge>
//                     </div>
//                     <div className="flex justify-between text-sm">
//                       <span>Work Experience</span>
//                       <Badge variant="outline" className="bg-yellow-50 text-yellow-700 border-yellow-200">
//                         Incomplete
//                       </Badge>
//                     </div>
//                   </div>
//                 </div>
//               </CardContent>
//               <CardFooter>
//                 <Button variant="outline" size="sm" className="w-full" asChild>
//                   <Link href="/profile">
//                     Complete Profile
//                     <ChevronRight className="ml-2 h-4 w-4" />
//                   </Link>
//                 </Button>
//               </CardFooter>
//             </Card>

//             <Card>
//               <CardHeader className="pb-2">
//                 <CardTitle className="text-lg flex items-center">
//                   <Briefcase className="mr-2 h-5 w-5 text-indigo-600" />
//                   Top Career Matches
//                 </CardTitle>
//               </CardHeader>
//               <CardContent>
//                 <div className="space-y-4">
//                   {careerRecommendations.slice(0, 3).map((career, index) => (
//                     <div key={index} className="flex justify-between items-center">
//                       <div>
//                         <p className="font-medium">{career.title}</p>
//                         <p className="text-xs text-gray-500">{career.skills.slice(0, 2).join(", ")}</p>
//                       </div>
//                       <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
//                         {career.match}%
//                       </Badge>
//                     </div>
//                   ))}
//                 </div>
//               </CardContent>
//               <CardFooter>
//                 <Button variant="outline" size="sm" className="w-full" onClick={() => setActiveTab("careers")}>
//                   View All Careers
//                   <ChevronRight className="ml-2 h-4 w-4" />
//                 </Button>
//               </CardFooter>
//             </Card>

//             <Card>
//               <CardHeader className="pb-2">
//                 <CardTitle className="text-lg flex items-center">
//                   <Calendar className="mr-2 h-5 w-5 text-indigo-600" />
//                   Upcoming Events
//                 </CardTitle>
//               </CardHeader>
//               <CardContent>
//                 <div className="space-y-4">
//                   {upcomingEvents.map((event, index) => (
//                     <div key={index} className="space-y-1">
//                       <p className="font-medium">{event.title}</p>
//                       <div className="flex items-center text-xs text-gray-500">
//                         <Calendar className="mr-1 h-3 w-3" />
//                         {event.date}
//                       </div>
//                       <div className="flex items-center text-xs text-gray-500">
//                         <Clock className="mr-1 h-3 w-3" />
//                         {event.time}
//                       </div>
//                     </div>
//                   ))}
//                 </div>
//               </CardContent>
//               <CardFooter>
//                 <Button variant="outline" size="sm" className="w-full" asChild>
//                   <Link href="/events">
//                     View All Events
//                     <ChevronRight className="ml-2 h-4 w-4" />
//                   </Link>
//                 </Button>
//               </CardFooter>
//             </Card>
//           </div>

//           <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//             <Card>
//               <CardHeader>
//                 <CardTitle className="flex items-center">
//                   <BookOpen className="mr-2 h-5 w-5 text-indigo-600" />
//                   Recommended Courses
//                 </CardTitle>
//                 <CardDescription>Courses tailored to your career goals</CardDescription>
//               </CardHeader>
//               <CardContent>
//                 <div className="space-y-4">
//                   {courseRecommendations.slice(0, 2).map((course, index) => (
//                     <div key={index} className="space-y-2">
//                       <div className="flex justify-between">
//                         <div>
//                           <p className="font-medium">{course.title}</p>
//                           <p className="text-sm text-gray-500">{course.platform}</p>
//                         </div>
//                         {course.progress > 0 ? (
//                           <Badge variant="outline" className="bg-indigo-50 text-indigo-700 border-indigo-200">
//                             In Progress
//                           </Badge>
//                         ) : (
//                           <Badge variant="outline" className="bg-gray-50 text-gray-700 border-gray-200">
//                             Not Started
//                           </Badge>
//                         )}
//                       </div>
//                       {course.progress > 0 && (
//                         <div>
//                           <div className="flex justify-between mb-1">
//                             <span className="text-xs text-gray-500">Progress</span>
//                             <span className="text-xs text-gray-500">{course.progress}%</span>
//                           </div>
//                           <Progress value={course.progress} className="h-1" />
//                         </div>
//                       )}
//                     </div>
//                   ))}
//                 </div>
//               </CardContent>
//               <CardFooter>
//                 <Button variant="outline" size="sm" className="w-full" onClick={() => setActiveTab("learning")}>
//                   View All Courses
//                   <ChevronRight className="ml-2 h-4 w-4" />
//                 </Button>
//               </CardFooter>
//             </Card>

//             <Card>
//               <CardHeader>
//                 <CardTitle className="flex items-center">
//                   <Briefcase className="mr-2 h-5 w-5 text-indigo-600" />
//                   Job Opportunities
//                 </CardTitle>
//                 <CardDescription>Matching your skills and interests</CardDescription>
//               </CardHeader>
//               <CardContent>
//                 <div className="space-y-4">
//                   {jobListings.slice(0, 2).map((job, index) => (
//                     <div key={index} className="space-y-1">
//                       <div className="flex justify-between">
//                         <p className="font-medium">{job.title}</p>
//                         <Badge variant={job.saved ? "secondary" : "outline"} className="text-xs">
//                           {job.saved ? "Saved" : job.postedDate}
//                         </Badge>
//                       </div>
//                       <p className="text-sm text-gray-500">{job.company}</p>
//                       <p className="text-xs text-gray-500">{job.location}</p>
//                     </div>
//                   ))}
//                 </div>
//               </CardContent>
//               <CardFooter>
//                 <Button variant="outline" size="sm" className="w-full" onClick={() => setActiveTab("jobs")}>
//                   View All Jobs
//                   <ChevronRight className="ml-2 h-4 w-4" />
//                 </Button>
//               </CardFooter>
//             </Card>
//           </div>
//         </TabsContent>

//         <TabsContent value="careers" className="mt-6">
//           <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
//             <Card className="md:col-span-2">
//               <CardHeader>
//                 <CardTitle>Career Recommendations</CardTitle>
//                 <CardDescription>Based on your personality and skills assessment</CardDescription>
//               </CardHeader>
//               <CardContent>
//                 <div className="space-y-6">
//                   {careerRecommendations.map((career, index) => (
//                     <div key={index} className="flex justify-between items-start pb-4 border-b last:border-0 last:pb-0">
//                       <div>
//                         <h3 className="font-semibold text-lg">{career.title}</h3>
//                         <div className="flex flex-wrap gap-2 mt-2">
//                           {career.skills.map((skill) => (
//                             <Badge key={skill} variant="secondary" className="text-xs">
//                               {skill}
//                             </Badge>
//                           ))}
//                         </div>
//                       </div>
//                       <div className="text-right">
//                         <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200 mb-2">
//                           {career.match}% Match
//                         </Badge>
//                         <div className="flex gap-2 mt-2">
//                           <Button size="sm" variant="outline" asChild>
//                             <Link href={`/careers/${career.title.toLowerCase().replace(/\s+/g, "-")}`}>Details</Link>
//                           </Button>
//                           <Button size="sm" asChild>
//                             <Link href={`/jobs?career=${career.title.toLowerCase().replace(/\s+/g, "+")}`}>
//                               Find Jobs
//                             </Link>
//                           </Button>
//                         </div>
//                       </div>
//                     </div>
//                   ))}
//                 </div>
//               </CardContent>
//               <CardFooter>
//                 <Button asChild className="w-full">
//                   <Link href="/assessment/start">Retake Assessment for More Recommendations</Link>
//                 </Button>
//               </CardFooter>
//             </Card>

//             <div className="space-y-6">
//               <Card>
//                 <CardHeader>
//                   <CardTitle className="text-lg">Career Insights</CardTitle>
//                 </CardHeader>
//                 <CardContent>
//                   <div className="space-y-4">
//                     <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
//                       <BarChart3 className="h-8 w-8 text-indigo-600" />
//                       <div>
//                         <h4 className="font-medium">Salary Comparison</h4>
//                         <p className="text-sm text-gray-600">Compare salaries across recommended careers</p>
//                       </div>
//                     </div>
//                     <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
//                       <LineChart className="h-8 w-8 text-indigo-600" />
//                       <div>
//                         <h4 className="font-medium">Growth Trends</h4>
//                         <p className="text-sm text-gray-600">See which fields are growing fastest</p>
//                       </div>
//                     </div>
//                     <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
//                       <GraduationCap className="h-8 w-8 text-indigo-600" />
//                       <div>
//                         <h4 className="font-medium">Education Requirements</h4>
//                         <p className="text-sm text-gray-600">View education needed for each path</p>
//                       </div>
//                     </div>
//                   </div>
//                 </CardContent>
//               </Card>

//               <Card>
//                 <CardHeader>
//                   <CardTitle className="text-lg">Assessment Report</CardTitle>
//                 </CardHeader>
//                 <CardContent>
//                   <div className="space-y-4">
//                     <div className="flex justify-between items-center">
//                       <div>
//                         <p className="font-medium">Last Assessment</p>
//                         <p className="text-sm text-gray-500">{userData.lastAssessment}</p>
//                       </div>
//                       <Button size="sm" variant="outline" className="flex items-center">
//                         <Download className="mr-2 h-4 w-4" />
//                         PDF
//                       </Button>
//                     </div>
//                     <div className="pt-2">
//                       <Button variant="outline" className="w-full" asChild>
//                         <Link href="/assessment/results">
//                           View Detailed Results
//                           <ExternalLink className="ml-2 h-4 w-4" />
//                         </Link>
//                       </Button>
//                     </div>
//                   </div>
//                 </CardContent>
//               </Card>
//             </div>
//           </div>
//         </TabsContent>

//         <TabsContent value="learning" className="mt-6">
//           <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
//             <div className="md:col-span-2 space-y-6">
//               <Card>
//                 <CardHeader>
//                   <CardTitle>Recommended Courses</CardTitle>
//                   <CardDescription>Based on your career interests and skill gaps</CardDescription>
//                 </CardHeader>
//                 <CardContent>
//                   <div className="space-y-6">
//                     {courseRecommendations.map((course, index) => (
//                       <div key={index} className="pb-4 border-b last:border-0 last:pb-0">
//                         <div className="flex justify-between items-start mb-2">
//                           <div>
//                             <h3 className="font-semibold text-lg">{course.title}</h3>
//                             <p className="text-sm text-gray-500">{course.platform}</p>
//                           </div>
//                           {course.progress > 0 ? (
//                             <Badge variant="outline" className="bg-indigo-50 text-indigo-700 border-indigo-200">
//                               In Progress
//                             </Badge>
//                           ) : (
//                             <Badge variant="outline" className="bg-gray-50 text-gray-700 border-gray-200">
//                               Not Started
//                             </Badge>
//                           )}
//                         </div>

//                         {course.progress > 0 ? (
//                           <div className="space-y-2">
//                             <div>
//                               <div className="flex justify-between mb-1">
//                                 <span className="text-sm text-gray-500">Progress</span>
//                                 <span className="text-sm text-gray-500">{course.progress}%</span>
//                               </div>
//                               <Progress value={course.progress} className="h-2" />
//                             </div>
//                             <div className="pt-1">
//                               <p className="text-sm font-medium">Next Lesson:</p>
//                               <p className="text-sm text-gray-600">{course.nextLesson}</p>
//                             </div>
//                             <div className="flex gap-2 mt-3">
//                               <Button size="sm" asChild>
//                                 <Link href="#">Continue Learning</Link>
//                               </Button>
//                               <Button size="sm" variant="outline" asChild>
//                                 <Link href="#">View Details</Link>
//                               </Button>
//                             </div>
//                           </div>
//                         ) : (
//                           <div className="flex gap-2 mt-3">
//                             <Button size="sm" asChild>
//                               <Link href="#">Start Course</Link>
//                             </Button>
//                             <Button size="sm" variant="outline" asChild>
//                               <Link href="#">View Details</Link>
//                             </Button>
//                           </div>
//                         )}
//                       </div>
//                     ))}
//                   </div>
//                 </CardContent>
//               </Card>

//               <Card>
//                 <CardHeader>
//                   <CardTitle>Learning Paths</CardTitle>
//                   <CardDescription>Structured learning journeys for specific careers</CardDescription>
//                 </CardHeader>
//                 <CardContent>
//                   <div className="space-y-4">
//                     <div className="p-4 border rounded-lg">
//                       <div className="flex justify-between items-start mb-2">
//                         <div>
//                           <h3 className="font-semibold">Web Development Path</h3>
//                           <p className="text-sm text-gray-500">From beginner to professional web developer</p>
//                         </div>
//                         <Badge>12 Courses</Badge>
//                       </div>
//                       <div className="flex items-center gap-2 mt-3">
//                         <div className="flex -space-x-2">
//                           <div className="w-6 h-6 rounded-full bg-indigo-100 flex items-center justify-center text-xs text-indigo-700">
//                             JS
//                           </div>
//                           <div className="w-6 h-6 rounded-full bg-indigo-100 flex items-center justify-center text-xs text-indigo-700">
//                             R
//                           </div>
//                           <div className="w-6 h-6 rounded-full bg-indigo-100 flex items-center justify-center text-xs text-indigo-700">
//                             N
//                           </div>
//                         </div>
//                         <span className="text-xs text-gray-500">React, Node.js, JavaScript & more</span>
//                       </div>
//                       <Button size="sm" className="mt-3" asChild>
//                         <Link href="#">View Path</Link>
//                       </Button>
//                     </div>

//                     <div className="p-4 border rounded-lg">
//                       <div className="flex justify-between items-start mb-2">
//                         <div>
//                           <h3 className="font-semibold">Data Science Path</h3>
//                           <p className="text-sm text-gray-500">Master data analysis and machine learning</p>
//                         </div>
//                         <Badge>10 Courses</Badge>
//                       </div>
//                       <div className="flex items-center gap-2 mt-3">
//                         <div className="flex -space-x-2">
//                           <div className="w-6 h-6 rounded-full bg-indigo-100 flex items-center justify-center text-xs text-indigo-700">
//                             PY
//                           </div>
//                           <div className="w-6 h-6 rounded-full bg-indigo-100 flex items-center justify-center text-xs text-indigo-700">
//                             ML
//                           </div>
//                           <div className="w-6 h-6 rounded-full bg-indigo-100 flex items-center justify-center text-xs text-indigo-700">
//                             ST
//                           </div>
//                         </div>
//                         <span className="text-xs text-gray-500">Python, ML, Statistics & more</span>
//                       </div>
//                       <Button size="sm" className="mt-3" asChild>
//                         <Link href="#">View Path</Link>
//                       </Button>
//                     </div>
//                   </div>
//                 </CardContent>
//               </Card>
//             </div>

//             <div className="space-y-6">
//               <Card>
//                 <CardHeader>
//                   <CardTitle className="text-lg">Learning Stats</CardTitle>
//                 </CardHeader>
//                 <CardContent>
//                   <div className="space-y-4">
//                     <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
//                       <div className="flex items-center">
//                         <BookOpen className="h-5 w-5 text-indigo-600 mr-2" />
//                         <span className="font-medium">Courses Enrolled</span>
//                       </div>
//                       <span className="font-semibold">3</span>
//                     </div>
//                     <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
//                       <div className="flex items-center">
//                         <FileText className="h-5 w-5 text-indigo-600 mr-2" />
//                         <span className="font-medium">Lessons Completed</span>
//                       </div>
//                       <span className="font-semibold">12</span>
//                     </div>
//                     <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
//                       <div className="flex items-center">
//                         <Clock className="h-5 w-5 text-indigo-600 mr-2" />
//                         <span className="font-medium">Learning Hours</span>
//                       </div>
//                       <span className="font-semibold">8.5</span>
//                     </div>
//                     <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
//                       <div className="flex items-center">
//                         <Star className="h-5 w-5 text-indigo-600 mr-2" />
//                         <span className="font-medium">Certificates</span>
//                       </div>
//                       <span className="font-semibold">1</span>
//                     </div>
//                   </div>
//                 </CardContent>
//               </Card>

//               <Card>
//                 <CardHeader>
//                   <CardTitle className="text-lg">Skill Development</CardTitle>
//                 </CardHeader>
//                 <CardContent>
//                   <div className="space-y-4">
//                     <div>
//                       <div className="flex justify-between mb-1">
//                         <span className="text-sm font-medium">Web Development</span>
//                         <span className="text-sm text-gray-500">65%</span>
//                       </div>
//                       <Progress value={65} className="h-2" />
//                     </div>
//                     <div>
//                       <div className="flex justify-between mb-1">
//                         <span className="text-sm font-medium">Data Analysis</span>
//                         <span className="text-sm text-gray-500">40%</span>
//                       </div>
//                       <Progress value={40} className="h-2" />
//                     </div>
//                     <div>
//                       <div className="flex justify-between mb-1">
//                         <span className="text-sm font-medium">UI/UX Design</span>
//                         <span className="text-sm text-gray-500">25%</span>
//                       </div>
//                       <Progress value={25} className="h-2" />
//                     </div>
//                     <div className="pt-2">
//                       <Button variant="outline" size="sm" className="w-full" asChild>
//                         <Link href="/skills">View All Skills</Link>
//                       </Button>
//                     </div>
//                   </div>
//                 </CardContent>
//               </Card>
//             </div>
//           </div>
//         </TabsContent>

//         <TabsContent value="jobs" className="mt-6">
//           <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
//             <div className="md:col-span-2">
//               <Card>
//                 <CardHeader>
//                   <CardTitle>Recommended Job Opportunities</CardTitle>
//                   <CardDescription>Matching your skills and career interests</CardDescription>
//                 </CardHeader>
//                 <CardContent>
//                   <div className="space-y-6">
//                     {jobListings.map((job, index) => (
//                       <div key={index} className="pb-4 border-b last:border-0 last:pb-0">
//                         <div className="flex justify-between items-start mb-2">
//                           <div>
//                             <h3 className="font-semibold text-lg">{job.title}</h3>
//                             <p className="text-sm text-gray-500">{job.company}</p>
//                             <p className="text-sm text-gray-500">{job.location}</p>
//                           </div>
//                           <Badge variant={job.saved ? "secondary" : "outline"} className="text-xs">
//                             {job.saved ? "Saved" : job.postedDate}
//                           </Badge>
//                         </div>
//                         <div className="flex gap-2 mt-3">
//                           <Button size="sm" asChild>
//                             <Link href="#">View Details</Link>
//                           </Button>
//                           <Button size="sm" variant={job.saved ? "outline" : "secondary"}>
//                             {job.saved ? "Saved" : "Save Job"}
//                           </Button>
//                         </div>
//                       </div>
//                     ))}
//                   </div>
//                 </CardContent>
//                 <CardFooter>
//                   <Button variant="outline" className="w-full" asChild>
//                     <Link href="/jobs">
//                       View All Job Listings
//                       <ChevronRight className="ml-2 h-4 w-4" />
//                     </Link>
//                   </Button>
//                 </CardFooter>
//               </Card>
//             </div>

//             <div className="space-y-6">
//               <Card>
//                 <CardHeader>
//                   <CardTitle className="text-lg">Job Search Filters</CardTitle>
//                 </CardHeader>
//                 <CardContent>
//                   <div className="space-y-4">
//                     <div>
//                       <h4 className="text-sm font-medium mb-2">Career Categories</h4>
//                       <div className="flex flex-wrap gap-2">
//                         <Badge variant="outline" className="cursor-pointer hover:bg-indigo-50">
//                           Software Development
//                         </Badge>
//                         <Badge variant="outline" className="cursor-pointer hover:bg-indigo-50">
//                           Data Science
//                         </Badge>
//                         <Badge variant="outline" className="cursor-pointer hover:bg-indigo-50">
//                           UX/UI Design
//                         </Badge>
//                         <Badge variant="outline" className="cursor-pointer hover:bg-indigo-50">
//                           Product Management
//                         </Badge>
//                       </div>
//                     </div>
//                     <div>
//                       <h4 className="text-sm font-medium mb-2">Location</h4>
//                       <div className="flex flex-wrap gap-2">
//                         <Badge variant="secondary" className="cursor-pointer">
//                           Remote
//                         </Badge>
//                         <Badge variant="outline" className="cursor-pointer hover:bg-indigo-50">
//                           New York
//                         </Badge>
//                         <Badge variant="outline" className="cursor-pointer hover:bg-indigo-50">
//                           San Francisco
//                         </Badge>
//                         <Badge variant="outline" className="cursor-pointer hover:bg-indigo-50">
//                           + Add Location
//                         </Badge>
//                       </div>
//                     </div>
//                     <div>
//                       <h4 className="text-sm font-medium mb-2">Experience Level</h4>
//                       <div className="flex flex-wrap gap-2">
//                         <Badge variant="secondary" className="cursor-pointer">
//                           Entry Level
//                         </Badge>
//                         <Badge variant="outline" className="cursor-pointer hover:bg-indigo-50">
//                           Mid Level
//                         </Badge>
//                         <Badge variant="outline" className="cursor-pointer hover:bg-indigo-50">
//                           Senior
//                         </Badge>
//                       </div>
//                     </div>
//                     <div className="pt-2">
//                       <Button className="w-full" asChild>
//                         <Link href="/jobs">Apply Filters</Link>
//                       </Button>
//                     </div>
//                   </div>
//                 </CardContent>
//               </Card>

//               <Card>
//                 <CardHeader>
//                   <CardTitle className="text-lg">Job Application Status</CardTitle>
//                 </CardHeader>
//                 <CardContent>
//                   <div className="space-y-4">
//                     <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
//                       <span className="font-medium">Saved Jobs</span>
//                       <span className="font-semibold">5</span>
//                     </div>
//                     <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
//                       <span className="font-medium">Applied</span>
//                       <span className="font-semibold">2</span>
//                     </div>
//                     <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
//                       <span className="font-medium">Interviews</span>
//                       <span className="font-semibold">1</span>
//                     </div>
//                     <div className="pt-2">
//                       <Button variant="outline" size="sm" className="w-full" asChild>
//                         <Link href="/applications">View Applications</Link>
//                       </Button>
//                     </div>
//                   </div>
//                 </CardContent>
//               </Card>
//             </div>
//           </div>
//         </TabsContent>
//       </Tabs>
//     </div>
//   )
// }
