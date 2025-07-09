"use client"

import { useState } from "react"
import { useParams, useRouter } from "next/navigation"
import { Search, Filter, Plus, MoreVertical } from "lucide-react"
import Image from "next/image"
import { createColumnHelper } from "@tanstack/react-table"
import { DataTable } from "@/components/ui/data-table"

interface StaffMember {
  id: string
  name: string
  email: string
  avatar?: string
  role: string
  status: "active" | "inactive"
  joinDate: string
}

export default function StaffManagementPage() {
  const params = useParams()
  const router = useRouter()
  const shopId = params.shopId as string
  const [searchQuery, setSearchQuery] = useState("")
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null)

  // Mock staff data
  const staffMembers: StaffMember[] = [
    {
      id: "1",
      name: "Florence Shaw",
      email: "florence@untitledui.com",
      avatar: "/placeholder.svg?height=40&width=40&text=FS",
      role: "Manager",
      status: "active",
      joinDate: "Jan 2023",
    },
    {
      id: "2",
      name: "Amelie Laurent",
      email: "amelie@untitledui.com",
      avatar: "/placeholder.svg?height=40&width=40&text=AL",
      role: "Sales Associate",
      status: "active",
      joinDate: "Mar 2023",
    },
    {
      id: "3",
      name: "Ammar Foley",
      email: "ammar@untitledui.com",
      avatar: "/placeholder.svg?height=40&width=40&text=AF",
      role: "Inventory Specialist",
      status: "active",
      joinDate: "Jun 2023",
    },
    {
      id: "4",
      name: "Caitlyn King",
      email: "caitlyn@untitledui.com",
      avatar: "/placeholder.svg?height=40&width=40&text=CK",
      role: "Sales Associate",
      status: "inactive",
      joinDate: "Aug 2023",
    },
    {
      id: "5",
      name: "Sienna Hewitt",
      email: "sienna@untitledui.com",
      avatar: "/placeholder.svg?height=40&width=40&text=SH",
      role: "Visual Merchandiser",
      status: "active",
      joinDate: "Oct 2023",
    },
    {
      id: "6",
      name: "Olly Shroeder",
      email: "olly@untitledui.com",
      avatar: "/placeholder.svg?height=40&width=40&text=OS",
      role: "Manager",
      status: "active",
      joinDate: "Nov 2023",
    },
    {
      id: "7",
      name: "Mathilde Lewis",
      email: "mathilde@untitledui.com",
      avatar: "/placeholder.svg?height=40&width=40&text=ML",
      role: "Sales Associate",
      status: "active",
      joinDate: "Dec 2023",
    },
    {
      id: "8",
      name: "Jaya Willis",
      email: "jaya@untitledui.com",
      avatar: "/placeholder.svg?height=40&width=40&text=JW",
      role: "Inventory Specialist",
      status: "inactive",
      joinDate: "Jan 2024",
    },
  ]

  const filteredStaff = staffMembers.filter(
    (staff) =>
      staff.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      staff.email.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  const toggleDropdown = (userId: string) => {
    setActiveDropdown(activeDropdown === userId ? null : userId)
  }

  // Column definition for TanStack Table
  const columnHelper = createColumnHelper<StaffMember>()

  const columns = [
    columnHelper.accessor("name", {
      header: "User name",
      cell: (info) => {
        const staff = info.row.original
        return (
          <div className="flex items-center">
            <div className="w-8 h-8 rounded-full overflow-hidden mr-3">
              {staff.avatar ? (
                <Image
                  src={staff.avatar || "/placeholder.svg"}
                  alt={staff.name}
                  width={32}
                  height={32}
                  className="object-cover"
                />
              ) : (
                <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                  <span className="text-xs font-medium">{staff.name.charAt(0)}</span>
                </div>
              )}
            </div>
            <div>
              <p className="font-medium">{staff.name}</p>
              <p className="text-sm text-gray-500">{staff.email}</p>
            </div>
          </div>
        )
      },
    }),
    columnHelper.display({
      id: "actions",
      cell: (info) => {
        const staff = info.row.original
        return (
          <div className="relative">
            <button onClick={() => toggleDropdown(staff.id)} className="p-1 rounded-full hover:bg-gray-100">
              <MoreVertical className="w-4 h-4 text-gray-500" />
            </button>

            {activeDropdown === staff.id && (
              <div className="absolute right-0 mt-1 w-48 bg-white rounded-lg shadow-lg z-10 py-1 border">
                <button className="w-full text-left px-4 py-2 text-sm hover:bg-gray-100">Edit user</button>
                <button className="w-full text-left px-4 py-2 text-sm hover:bg-gray-100">View profile</button>
                <button className="w-full text-left px-4 py-2 text-sm hover:bg-gray-100">Change permissions</button>
                <div className="border-t my-1"></div>
                <button className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100">
                  Delete user
                </button>
              </div>
            )}
          </div>
        )
      },
    }),
  ]

  return (
    <div className="p-4 space-y-6  mx-auto pb-20">
      <div className="bg-white rounded-xl shadow-sm p-6">
        <div className="mb-6">
          <h1 className="text-xl font-bold">User management</h1>
          <p className="text-sm text-gray-500">Manage your team members and permissions.</p>
        </div>

        <div className="flex justify-between items-center mb-4">
          <div className="flex items-center">
            <h2 className="font-medium">All users</h2>
            <span className="ml-2 text-gray-500">{staffMembers.length}</span>
          </div>

          <div className="flex items-center space-x-2">
            <button className="flex items-center px-3 py-1.5 border rounded-lg text-sm">
              <Filter className="w-4 h-4 mr-1" />
              <span>Filters</span>
            </button>

            <button
              className="flex items-center px-3 py-1.5 bg-indigo-600 text-white rounded-lg text-sm"
              onClick={() => router.push(`/shop/${shopId}/staff/add`)}
            >
              <Plus className="w-4 h-4 mr-1" />
              <span>Add</span>
            </button>
          </div>
        </div>

        <div className="mb-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input
              type="text"
              placeholder="Search"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-300 text-sm"
            />
          </div>
        </div>

        <DataTable columns={columns} data={filteredStaff} searchKey="name" searchValue={searchQuery} pageSize={6} />
      </div>
    </div>
  )
}
