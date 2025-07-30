import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { BookOpen, FileText, Video, Users, Download, ExternalLink } from "lucide-react"

export default function ResourcesPage() {
  // Sample resources data
  const courses = [
    {
      title: "Web Development Bootcamp",
      description: "Learn full-stack web development from scratch",
      platform: "Udemy",
      level: "Beginner",
      duration: "12 weeks",
      url: "#",
    },
    {
      title: "Data Science Specialization",
      description: "Master data analysis and machine learning",
      platform: "Coursera",
      level: "Intermediate",
      duration: "6 months",
      url: "#",
    },
    {
      title: "UX/UI Design Professional Certificate",
      description: "Learn user experience and interface design principles",
      platform: "edX",
      level: "Beginner",
      duration: "4 months",
      url: "#",
    },
  ]

  const guides = [
    {
      title: "Resume Building Guide",
      description: "Create a standout resume that gets noticed by employers",
      type: "PDF",
      pages: 25,
      url: "#",
    },
    {
      title: "Interview Preparation Handbook",
      description: "Prepare for technical and behavioral interviews",
      type: "PDF",
      pages: 42,
      url: "#",
    },
    {
      title: "Career Transition Roadmap",
      description: "Step-by-step guide to changing careers successfully",
      type: "PDF",
      pages: 38,
      url: "#",
    },
  ]

  const videos = [
    {
      title: "How to Ace Your Technical Interview",
      description: "Expert tips for technical interview success",
      duration: "45 min",
      presenter: "Sarah Johnson, Tech Recruiter",
      url: "#",
    },
    {
      title: "Building Your Personal Brand",
      description: "Establish your professional presence online",
      duration: "32 min",
      presenter: "Michael Chen, Career Coach",
      url: "#",
    },
    {
      title: "Networking for Career Growth",
      description: "Effective networking strategies for professionals",
      duration: "28 min",
      presenter: "Priya Patel, Career Strategist",
      url: "#",
    },
  ]

  const mentorship = [
    {
      name: "Software Engineering Mentorship",
      description: "Get guidance from experienced software engineers",
      mentors: 24,
      sessions: "Weekly, 1-hour sessions",
      url: "#",
    },
    {
      name: "Data Science Career Path",
      description: "Learn from data scientists at top companies",
      mentors: 18,
      sessions: "Bi-weekly, 1-hour sessions",
      url: "#",
    },
    {
      name: "UX/UI Design Mentorship",
      description: "Portfolio reviews and career guidance from design leaders",
      mentors: 15,
      sessions: "Monthly, 2-hour sessions",
      url: "#",
    },
  ]

  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-indigo-600 to-indigo-800 text-white py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-4xl font-bold mb-4">Career Resources</h1>
            <p className="text-xl opacity-90">
              Access our curated collection of courses, guides, videos, and mentorship opportunities to help you succeed
              in your career journey.
            </p>
          </div>
        </div>
      </section>

      {/* Resources Navigation */}
      <section className="bg-white border-b py-6">
        <div className="container mx-auto px-4">
          <div className="flex flex-wrap justify-center gap-4">
            <Button variant="ghost" className="flex items-center" asChild>
              <a href="#courses">
                <BookOpen className="mr-2 h-5 w-5" />
                Courses
              </a>
            </Button>
            <Button variant="ghost" className="flex items-center" asChild>
              <a href="#guides">
                <FileText className="mr-2 h-5 w-5" />
                Guides
              </a>
            </Button>
            <Button variant="ghost" className="flex items-center" asChild>
              <a href="#videos">
                <Video className="mr-2 h-5 w-5" />
                Videos
              </a>
            </Button>
            <Button variant="ghost" className="flex items-center" asChild>
              <a href="#mentorship">
                <Users className="mr-2 h-5 w-5" />
                Mentorship
              </a>
            </Button>
          </div>
        </div>
      </section>

      {/* Courses Section */}
      <section id="courses" className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Online Courses</h2>
            <p className="text-lg text-gray-600">
              Enhance your skills with these carefully selected courses aligned with in-demand career paths.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {courses.map((course, index) => (
              <Card key={index} className="h-full flex flex-col">
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <CardTitle>{course.title}</CardTitle>
                    <Badge>{course.platform}</Badge>
                  </div>
                  <CardDescription>{course.description}</CardDescription>
                </CardHeader>
                <CardContent className="flex-grow">
                  <div className="grid grid-cols-2 gap-2 text-sm">
                    <div>
                      <p className="font-medium">Level</p>
                      <p className="text-gray-600">{course.level}</p>
                    </div>
                    <div>
                      <p className="font-medium">Duration</p>
                      <p className="text-gray-600">{course.duration}</p>
                    </div>
                  </div>
                </CardContent>
                <CardFooter>
                  <Button asChild className="w-full bg-indigo-600 hover:bg-indigo-700">
                    <Link href={course.url} target="_blank">
                      <BookOpen className="mr-2 h-4 w-4" />
                      View Course
                    </Link>
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>

          {/* <div className="text-center mt-8">
            <Button variant="outline" asChild>
              <Link href="/courses">
                View All Courses
                <ExternalLink className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div> */}
        </div>
      </section>

      {/* Guides Section */}
      <section id="guides" className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Career Guides</h2>
            <p className="text-lg text-gray-600">
              Download our comprehensive guides to help you navigate different aspects of your career journey.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {guides.map((guide, index) => (
              <Card key={index} className="h-full flex flex-col">
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <CardTitle>{guide.title}</CardTitle>
                    <Badge variant="outline">{guide.type}</Badge>
                  </div>
                  <CardDescription>{guide.description}</CardDescription>
                </CardHeader>
                <CardContent className="flex-grow">
                  <p className="text-sm text-gray-600">{guide.pages} pages</p>
                </CardContent>
                <CardFooter>
                  <Button asChild className="w-full bg-indigo-600 hover:bg-indigo-700">
                    <Link href={guide.url}>
                      <Download className="mr-2 h-4 w-4" />
                      Download Guide
                    </Link>
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>

          <div className="text-center mt-8">
            <Button variant="outline" asChild>
              <Link href="/guides">
                View All Guides
                <ExternalLink className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Videos Section */}
      <section id="videos" className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Video Resources</h2>
            <p className="text-lg text-gray-600">
              Watch expert talks and tutorials on various career development topics.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {videos.map((video, index) => (
              <Card key={index} className="h-full flex flex-col">
                <div className="aspect-video bg-gray-100 relative">
                  <img
                    src="/placeholder.svg?height=200&width=400"
                    alt={video.title}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="bg-indigo-600 rounded-full p-3 text-white">
                      <Video className="h-6 w-6" />
                    </div>
                  </div>
                </div>
                <CardHeader>
                  <CardTitle>{video.title}</CardTitle>
                  <CardDescription>{video.description}</CardDescription>
                </CardHeader>
                <CardContent className="flex-grow">
                  <div className="space-y-2 text-sm">
                    <p>
                      <span className="font-medium">Duration:</span> {video.duration}
                    </p>
                    <p>
                      <span className="font-medium">Presenter:</span> {video.presenter}
                    </p>
                  </div>
                </CardContent>
                <CardFooter>
                  <Button asChild className="w-full bg-indigo-600 hover:bg-indigo-700">
                    <Link href={video.url}>Watch Video</Link>
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>

          <div className="text-center mt-8">
            <Button variant="outline" asChild>
              <Link href="/videos">
                View All Videos
                <ExternalLink className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Mentorship Section */}
      <section id="mentorship" className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Mentorship Programs</h2>
            <p className="text-lg text-gray-600">
              Connect with experienced professionals who can guide you on your career journey.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {mentorship.map((program, index) => (
              <Card key={index} className="h-full flex flex-col">
                <CardHeader>
                  <CardTitle>{program.name}</CardTitle>
                  <CardDescription>{program.description}</CardDescription>
                </CardHeader>
                <CardContent className="flex-grow">
                  <div className="space-y-2 text-sm">
                    <p>
                      <span className="font-medium">Available Mentors:</span> {program.mentors}
                    </p>
                    <p>
                      <span className="font-medium">Session Format:</span> {program.sessions}
                    </p>
                  </div>
                </CardContent>
                <CardFooter>
                  <Button asChild className="w-full bg-indigo-600 hover:bg-indigo-700">
                    <Link href={program.url}>
                      <Users className="mr-2 h-4 w-4" />
                      Join Program
                    </Link>
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>

          <div className="text-center mt-8">
            <Button variant="outline" asChild>
              <Link href="/mentorship">
                Explore All Programs
                <ExternalLink className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-indigo-700 text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-6">Need Personalized Recommendations?</h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto">
            Take our assessment to receive tailored resource recommendations based on your career goals and skill gaps.
          </p>
          <Button asChild size="lg" className="bg-white text-indigo-700 hover:bg-gray-100">
            <Link href="/assessment/start">Take Career Assessment</Link>
          </Button>
        </div>
      </section>

      {/* Footer included in layout */}
    </div>
  )
}
