import TableOfContents from "./table-of-contents"

export default function DocumentView() {
  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto">
        <TableOfContents />

        {/* Document content sections would go here */}
        <div className="mt-12 space-y-12 bg-white rounded-lg shadow-md p-8">
          <section id="introduction" className="scroll-mt-20">
            <h2 className="text-2xl font-bold mb-4 text-gray-800">1. Introduction</h2>
            <p className="text-gray-700">
              Choosing the right career path is a critical decision that impacts an individual's personal satisfaction
              and professional success. However, many students and professionals struggle with identifying a suitable
              direction due to a lack of guidance, awareness of industry trends, or understanding of their own skills
              and interests. Our project aims to develop an AI-powered mobile and web-based application that recommends
              ideal career paths based on personality assessments, skill evaluations, and current market demand.
            </p>
          </section>

          <section id="objectives" className="scroll-mt-20">
            <h2 className="text-2xl font-bold mb-4 text-gray-800">2. Objectives</h2>
            <ul className="list-disc pl-6 space-y-2 text-gray-700">
              <li>To assist users in identifying suitable career paths through AI-driven analysis.</li>
              <li>To conduct personality and skill-based assessments.</li>
              <li>
                To recommend tailored resources such as online courses, mentorship opportunities, and relevant job
                listings.
              </li>
              <li>To ensure career recommendations align with evolving market trends and future industry demands.</li>
            </ul>
          </section>

          {/* Additional sections would be added here */}
        </div>
      </div>
    </div>
  )
}
