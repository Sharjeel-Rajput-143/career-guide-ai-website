"use client"

import { useState } from "react"
import Link from "next/link"
import { ChevronRight } from "lucide-react"

export default function TableOfContents() {
  const [activeSection, setActiveSection] = useState<string | null>(null)

  const sections = [
    { id: "introduction", title: "Introduction", page: 1 },
    { id: "objectives", title: "Objectives", page: 1 },
    { id: "problem-description", title: "Problem Description", page: 1 },
    { id: "methodology", title: "Methodology", page: 1 },
    { id: "project-scope", title: "Project Scope", page: 1 },
    { id: "brief-feasibility-study", title: "Brief Feasibility Study", page: 2 },
    { id: "solution-application-areas", title: "Solution Application Areas", page: 2 },
    { id: "tools-technology", title: "Tools/Technology", page: 2 },
    { id: "milestones", title: "Milestones", page: 2 },
    { id: "references", title: "References", page: 3 },
  ]

  return (
    <div className="max-w-4xl mx-auto my-8 p-6 bg-white rounded-lg shadow-md">
      <h1 className="text-3xl font-bold text-center mb-8 text-gray-800">AI Career Recommendation System</h1>

      <div className="mb-6">
        <h2 className="text-2xl font-semibold mb-4 text-gray-700 border-b pb-2">Table of Contents</h2>

        <div className="space-y-1">
          {sections.map((section, index) => (
            <div key={section.id} className="flex items-center justify-between group">
              <Link
                href={`#${section.id}`}
                className="flex items-center py-2 text-gray-700 hover:text-primary transition-colors duration-200 group-hover:translate-x-1 transform transition-transform"
                onClick={() => setActiveSection(section.id)}
              >
                <span className={`mr-2 ${activeSection === section.id ? "text-primary font-medium" : ""}`}>
                  {index + 1}.
                </span>
                <span className={activeSection === section.id ? "text-primary font-medium" : ""}>{section.title}</span>
                <ChevronRight
                  className={`ml-2 h-4 w-4 opacity-0 group-hover:opacity-100 transition-opacity ${activeSection === section.id ? "text-primary" : "text-gray-400"}`}
                />
              </Link>

              <div className="flex items-center">
                <div className="border-b border-dashed border-gray-300 flex-grow w-16 md:w-32 mx-2"></div>
                <span className="text-gray-500 text-sm">{section.page}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="mt-8 pt-4 border-t border-gray-200">
        <div className="flex justify-between text-sm text-gray-500">
          <span>AI Career Recommendation System</span>
          <span>Project Proposal</span>
        </div>
      </div>
    </div>
  )
}
