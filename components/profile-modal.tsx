"use client"

import { ChevronRight } from "lucide-react"
import Link from "next/link"
import { Dialog, DialogContent } from "@/components/ui/dialog"

interface Account {
  id: string
  name: string
  type: string
  status: "active" | "inactive"
  color: string
}

interface Store {
  id: string
  name: string
  role: string
  color: string
}

const accounts: Account[] = [
  {
    id: "synergy",
    name: "Synergy",
    type: "Checking Account",
    status: "active",
    color: "#d8f5b4", // Using the project's green color
  },
  {
    id: "catalyst",
    name: "Catalyst",
    type: "Business Account",
    status: "inactive",
    color: "#FF9966",
  },
  {
    id: "apex",
    name: "Apex",
    type: "Money Market Account",
    status: "inactive",
    color: "#5E7EFF",
  },
  {
    id: "pulse",
    name: "Pulse",
    type: "Merchant Account",
    status: "inactive",
    color: "#4ECBFF",
  },
  {
    id: "aurora",
    name: "Aurora",
    type: "Brokerage Account",
    status: "inactive",
    color: "#FF6B6B",
  },
  {
    id: "horizon",
    name: "Horizon",
    type: "Savings Account",
    status: "inactive",
    color: "#9966FF",
  },
  {
    id: "velocity",
    name: "Velocity",
    type: "Credit Account",
    status: "inactive",
    color: "#66CC99",
  },
]

// Mock store data
const stores: Store[] = [
  {
    id: "store1",
    name: "Fashion Boutique",
    role: "Manager",
    color: "#d8f5b4",
  },
  {
    id: "store2",
    name: "Urban Styles",
    role: "Employee",
    color: "#66a3ff",
  },
  {
    id: "store3",
    name: "Trendy Threads",
    role: "Owner",
    color: "#ff6666",
  },
]

export function ProfileModal({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md rounded-3xl p-4 sm:p-6 max-h-[80vh] overflow-y-auto">
        {/* My Stores Section */}
        <div className="mb-4">
          <h3 className="text-base sm:text-lg font-bold mb-2">My Stores</h3>
          <div className="space-y-2">
            {stores.map((store) => (
              <Link key={store.id} href={`/shop/${store.id}`} className="block">
                <div className="flex items-center justify-between rounded-xl p-3 bg-gray-100">
                  <div className="flex items-center gap-2 sm:gap-3">
                    <div
                      className="flex h-8 w-8 sm:h-10 sm:w-10 items-center justify-center rounded-full"
                      style={{ backgroundColor: store.color }}
                    >
                      <span className="text-white font-bold text-xs sm:text-sm">{store.name.charAt(0)}</span>
                    </div>

                    <div>
                      <h3 className="text-sm sm:text-base font-bold">{store.name}</h3>
                      <p className="text-xs text-gray-600">{store.role}</p>
                    </div>
                  </div>

                  <ChevronRight className="h-4 w-4 sm:h-5 sm:w-5 text-gray-400" />
                </div>
              </Link>
            ))}
          </div>
        </div>

        <div className="h-px bg-gray-200 my-4"></div>

        {/* Accounts Section */}
        {accounts.map((account, index) => (
          <div
            key={account.id}
            className={`flex items-center justify-between rounded-xl p-3 sm:p-4 ${
              index % 2 === 0 ? "bg-gray-100" : "bg-white"
            }`}
          >
            <div className="flex items-center gap-3 sm:gap-4">
              <div
                className="flex h-10 w-10 sm:h-12 sm:w-12 items-center justify-center rounded-full"
                style={{ backgroundColor: account.color }}
              >
                <div className="h-5 w-5 sm:h-6 sm:w-6 rounded-full bg-white/30" />
              </div>

              <div>
                <h3 className="text-base sm:text-xl font-bold">{account.name}</h3>
                <p className="text-xs sm:text-sm text-gray-600">{account.type}</p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              {account.id === "catalyst" && (
                <div className="mr-2">
                  <svg
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                    className="sm:w-6 sm:h-6"
                  >
                    <path
                      d="M8 12.5L11 15.5L16 9.5"
                      stroke="black"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                    <path
                      d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z"
                      stroke="black"
                      strokeWidth="1.5"
                    />
                    <path
                      d="M15 8L17 10"
                      stroke="black"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </div>
              )}

              {account.status === "active" ? (
                <span className="rounded-full bg-[#d8f5b4] px-3 sm:px-4 py-1 text-xs sm:text-sm font-medium">
                  Active
                </span>
              ) : (
                <span className="rounded-full bg-gray-200 px-3 sm:px-4 py-1 text-xs sm:text-sm font-medium">
                  Inactive
                </span>
              )}

              {account.id === "synergy" && (
                <div className="ml-2 rounded-full bg-gray-100 p-1.5 sm:p-2">
                  <ChevronRight className="h-4 w-4 sm:h-5 sm:w-5" />
                </div>
              )}
            </div>
          </div>
        ))}
      </DialogContent>
    </Dialog>
  )
}
