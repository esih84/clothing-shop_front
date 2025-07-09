"use client"

import { useState } from "react"
import { useParams, useRouter } from "next/navigation"
import { ChevronLeft, Search, Filter, Plus, Clock } from "lucide-react"
import Image from "next/image"

export default function JobApplicationsPage() {
  const params = useParams()
  const router = useRouter()
  const shopId = params.shopId as string
  const [searchQuery, setSearchQuery] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [activeTab, setActiveTab] = useState("applications")

  // Mock job applications
  const jobApplications = [
    {
      id: "1",
      position: "Sales Associate",
      applicant: "Sarah Williams",
      avatar: "/placeholder.svg?height=60&width=60&text=SW",
      date: "May 2, 2025",
      status: "new",
      email: "sarah.williams@example.com",
      phone: "+1 (555) 123-4567",
      resume: "resume_sarah_williams.pdf",
    },
    {
      id: "2",
      position: "Store Manager",
      applicant: "David Brown",
      avatar: "/placeholder.svg?height=60&width=60&text=DB",
      date: "May 1, 2025",
      status: "interview",
      email: "david.brown@example.com",
      phone: "+1 (555) 234-5678",
      resume: "resume_david_brown.pdf",
    },
    {
      id: "3",
      position: "Visual Merchandiser",
      applicant: "Emily Davis",
      avatar: "/placeholder.svg?height=60&width=60&text=ED",
      date: "Apr 28, 2025",
      status: "new",
      email: "emily.davis@example.com",
      phone: "+1 (555) 345-6789",
      resume: "resume_emily_davis.pdf",
    },
    {
      id: "4",
      position: "Inventory Specialist",
      applicant: "Michael Wilson",
      avatar: "/placeholder.svg?height=60&width=60&text=MW",
      date: "Apr 25, 2025",
      status: "review",
      email: "michael.wilson@example.com",
      phone: "+1 (555) 456-7890",
      resume: "resume_michael_wilson.pdf",
    },
    {
      id: "5",
      position: "Sales Associate",
      applicant: "Jennifer Taylor",
      avatar: "/placeholder.svg?height=60&width=60&text=JT",
      date: "Apr 22, 2025",
      status: "rejected",
      email: "jennifer.taylor@example.com",
      phone: "+1 (555) 567-8901",
      resume: "resume_jennifer_taylor.pdf",
    },
    {
      id: "6",
      position: "Visual Merchandiser",
      applicant: "Robert Martin",
      avatar: "/placeholder.svg?height=60&width=60&text=RM",
      date: "Apr 20, 2025",
      status: "hired",
      email: "robert.martin@example.com",
      phone: "+1 (555) 678-9012",
      resume: "resume_robert_martin.pdf",
    },
  ]

  // Mock open positions
  const openPositions = [
    {
      id: "1",
      title: "Sales Associate",
      type: "Full-time",
      postedDate: "Apr 25, 2025",
      location: "Downtown Store",
      applications: 12,
      status: "active",
    },
    {
      id: "2",
      title: "Visual Merchandiser",
      type: "Part-time",
      postedDate: "Apr 27, 2025",
      location: "Mall Location",
      applications: 8,
      status: "active",
    },
    {
      id: "3",
      title: "Inventory Specialist",
      type: "Full-time",
      postedDate: "Apr 20, 2025",
      location: "Warehouse",
      applications: 5,
      status: "active",
    },
    {
      id: "4",
      title: "Store Manager",
      type: "Full-time",
      postedDate: "Apr 15, 2025",
      location: "Suburban Location",
      applications: 7,
      status: "closed",
      closedReason: "Position filled",
    },
  ]

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "new":
        return <span className="bg-red-100 text-red-600 px-2 py-1 rounded-full text-xs">New</span>
      case "review":
        return <span className="bg-yellow-100 text-yellow-600 px-2 py-1 rounded-full text-xs">Under Review</span>
      case "interview":
        return <span className="bg-blue-100 text-blue-600 px-2 py-1 rounded-full text-xs">Interview</span>
      case "hired":
        return <span className="bg-green-100 text-green-600 px-2 py-1 rounded-full text-xs">Hired</span>
      case "rejected":
        return <span className="bg-gray-100 text-gray-600 px-2 py-1 rounded-full text-xs">Rejected</span>
      default:
        return <span className="bg-gray-100 text-gray-600 px-2 py-1 rounded-full text-xs">Unknown</span>
    }
  }

  const filteredApplications = jobApplications.filter(
    (app) =>
      (app.applicant.toLowerCase().includes(searchQuery.toLowerCase()) ||
        app.position.toLowerCase().includes(searchQuery.toLowerCase())) &&
      (statusFilter === "all" || app.status === statusFilter),
  )

  return (
    <div className="p-4 space-y-6 mx-auto pb-20">
      <div className="flex items-center mb-4">
        <button onClick={() => router.push(`/shop/${shopId}/settings`)} className="mr-3">
          <ChevronLeft className="w-5 h-5" />
        </button>
        <h1 className="text-xl font-bold">Job Applications</h1>
      </div>

      <div className="flex bg-gray-100 rounded-full p-1">
        <button
          className={`flex-1 py-2 text-sm font-medium rounded-full ${
            activeTab === "applications" ? "bg-main" : "bg-transparent"
          }`}
          onClick={() => setActiveTab("applications")}
        >
          Applications
        </button>
        <button
          className={`flex-1 py-2 text-sm font-medium rounded-full ${
            activeTab === "positions" ? "bg-main" : "bg-transparent"
          }`}
          onClick={() => setActiveTab("positions")}
        >
          Open Positions
        </button>
      </div>

      {activeTab === "applications" ? (
        <>
          <div className="flex gap-2">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Search applications"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 rounded-full bg-white border border-gray-200 text-sm"
              />
            </div>
            <button className="bg-white p-2 rounded-full border border-gray-200">
              <Filter className="w-5 h-5 text-gray-500" />
            </button>
          </div>

          <div className="flex space-x-2 overflow-x-auto pb-2 no-scrollbar">
            <button
              className={`px-4 py-2 rounded-full whitespace-nowrap text-sm ${
                statusFilter === "all" ? "bg-main font-medium" : "bg-gray-100"
              }`}
              onClick={() => setStatusFilter("all")}
            >
              All
            </button>
            <button
              className={`px-4 py-2 rounded-full whitespace-nowrap text-sm ${
                statusFilter === "new" ? "bg-main font-medium" : "bg-gray-100"
              }`}
              onClick={() => setStatusFilter("new")}
            >
              New
            </button>
            <button
              className={`px-4 py-2 rounded-full whitespace-nowrap text-sm ${
                statusFilter === "review" ? "bg-main font-medium" : "bg-gray-100"
              }`}
              onClick={() => setStatusFilter("review")}
            >
              Under Review
            </button>
            <button
              className={`px-4 py-2 rounded-full whitespace-nowrap text-sm ${
                statusFilter === "interview" ? "bg-main font-medium" : "bg-gray-100"
              }`}
              onClick={() => setStatusFilter("interview")}
            >
              Interview
            </button>
            <button
              className={`px-4 py-2 rounded-full whitespace-nowrap text-sm ${
                statusFilter === "hired" ? "bg-main font-medium" : "bg-gray-100"
              }`}
              onClick={() => setStatusFilter("hired")}
            >
              Hired
            </button>
            <button
              className={`px-4 py-2 rounded-full whitespace-nowrap text-sm ${
                statusFilter === "rejected" ? "bg-main font-medium" : "bg-gray-100"
              }`}
              onClick={() => setStatusFilter("rejected")}
            >
              Rejected
            </button>
          </div>

          <div className="space-y-4">
            {filteredApplications.map((app) => (
              <div
                key={app.id}
                className="bg-white p-4 rounded-xl shadow-sm"
                onClick={() => router.push(`/shop/${shopId}/jobs/application/${app.id}`)}
              >
                <div className="flex items-start">
                  <Image
                    src={app.avatar || "/placeholder.svg"}
                    alt={app.applicant}
                    width={60}
                    height={60}
                    className="rounded-full mr-4"
                  />
                  <div className="flex-1">
                    <div className="flex justify-between">
                      <h3 className="font-bold">{app.applicant}</h3>
                      {getStatusBadge(app.status)}
                    </div>
                    <p className="text-sm">{app.position}</p>
                    <p className="text-xs text-gray-400 mt-1">Applied on {app.date}</p>
                    <div className="mt-2 text-xs text-gray-500">{app.email}</div>
                    <div className="mt-1 text-xs text-gray-500">{app.phone}</div>
                  </div>
                </div>
                <div className="flex justify-end mt-3 space-x-2">
                  {app.status === "new" && (
                    <button
                      className="text-xs bg-blue-100 text-blue-600 px-3 py-1.5 rounded-full"
                      onClick={(e) => {
                        e.stopPropagation()
                        // Review action
                      }}
                    >
                      Review
                    </button>
                  )}
                  {app.status === "review" && (
                    <button
                      className="text-xs bg-blue-100 text-blue-600 px-3 py-1.5 rounded-full"
                      onClick={(e) => {
                        e.stopPropagation()
                        // Schedule interview action
                      }}
                    >
                      Schedule Interview
                    </button>
                  )}
                  {app.status === "interview" && (
                    <>
                      <button
                        className="text-xs bg-green-100 text-green-600 px-3 py-1.5 rounded-full"
                        onClick={(e) => {
                          e.stopPropagation()
                          // Hire action
                        }}
                      >
                        Hire
                      </button>
                      <button
                        className="text-xs bg-red-100 text-red-600 px-3 py-1.5 rounded-full"
                        onClick={(e) => {
                          e.stopPropagation()
                          // Reject action
                        }}
                      >
                        Reject
                      </button>
                    </>
                  )}
                  <button
                    className="text-xs bg-gray-100 text-gray-600 px-3 py-1.5 rounded-full"
                    onClick={(e) => {
                      e.stopPropagation()
                      // View resume action
                    }}
                  >
                    View Resume
                  </button>
                </div>
              </div>
            ))}
          </div>
        </>
      ) : (
        <>
          <div className="flex justify-between items-center">
            <h2 className="text-lg font-medium">Open Positions</h2>
            <button className="bg-main p-2 rounded-full">
              <Plus className="w-5 h-5" />
            </button>
          </div>

          <div className="space-y-4">
            {openPositions
              .filter((pos) => pos.status === "active")
              .map((position) => (
                <div
                  key={position.id}
                  className="bg-white p-4 rounded-xl shadow-sm"
                  onClick={() => router.push(`/shop/${shopId}/jobs/position/${position.id}`)}
                >
                  <div className="flex justify-between">
                    <h3 className="font-bold">{position.title}</h3>
                    <span className="bg-green-100 text-green-600 px-2 py-1 rounded-full text-xs">Active</span>
                  </div>
                  <div className="flex items-center mt-1 text-sm text-gray-600">
                    <span className="mr-3">{position.type}</span>
                    <span>{position.location}</span>
                  </div>
                  <div className="flex justify-between mt-3">
                    <div className="flex items-center text-xs text-gray-500">
                      <Clock className="w-3 h-3 mr-1" />
                      <span>Posted on {position.postedDate}</span>
                    </div>
                    <span className="text-xs bg-blue-100 text-blue-600 px-2 py-1 rounded-full">
                      {position.applications} applications
                    </span>
                  </div>
                  <div className="flex justify-end mt-3 space-x-2">
                    <button
                      className="text-xs bg-blue-100 text-blue-600 px-3 py-1.5 rounded-full"
                      onClick={(e) => {
                        e.stopPropagation()
                        // Edit position action
                      }}
                    >
                      Edit
                    </button>
                    <button
                      className="text-xs bg-yellow-100 text-yellow-600 px-3 py-1.5 rounded-full"
                      onClick={(e) => {
                        e.stopPropagation()
                        // Close position action
                      }}
                    >
                      Close
                    </button>
                  </div>
                </div>
              ))}

            {openPositions.length > 0 && (
              <div className="mt-4">
                <h3 className="text-base font-medium mb-3">Closed Positions</h3>
                {openPositions
                  .filter((pos) => pos.status === "closed")
                  .map((position) => (
                    <div key={position.id} className="bg-white p-4 rounded-xl shadow-sm mb-4">
                      <div className="flex justify-between">
                        <h3 className="font-bold">{position.title}</h3>
                        <span className="bg-gray-100 text-gray-600 px-2 py-1 rounded-full text-xs">Closed</span>
                      </div>
                      <div className="flex items-center mt-1 text-sm text-gray-600">
                        <span className="mr-3">{position.type}</span>
                        <span>{position.location}</span>
                      </div>
                      <div className="flex justify-between mt-3">
                        <div className="flex items-center text-xs text-gray-500">
                          <Clock className="w-3 h-3 mr-1" />
                          <span>Posted on {position.postedDate}</span>
                        </div>
                        <span className="text-xs text-gray-500">{position.closedReason}</span>
                      </div>
                      <div className="flex justify-end mt-3">
                        <button
                          className="text-xs bg-main px-3 py-1.5 rounded-full"
                          onClick={(e) => {
                            e.stopPropagation()
                            // Reopen position action
                          }}
                        >
                          Reopen
                        </button>
                      </div>
                    </div>
                  ))}
              </div>
            )}

            <button className="w-full py-3 bg-main rounded-xl flex items-center justify-center font-medium">
              <Plus className="w-4 h-4 mr-2" />
              Post New Position
            </button>
          </div>
        </>
      )}
    </div>
  )
}
