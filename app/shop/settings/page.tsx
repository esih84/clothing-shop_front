"use client"

import { useState } from "react"
import { useParams, useRouter } from "next/navigation"
import Image from "next/image"

export default function ShopSettingsPage() {
  const params = useParams()
  const router = useRouter()
  
  const [activeTab, setActiveTab] = useState("general")

  // Mock shop data based on shopId
  const shopData = {
    id: "store2",
    name:  "Fashion Boutique" ,
    email: "shop@example.com",
    phone: "+1 (555) 123-4567",
    logo: "/placeholder.svg?height=60&width=60&text=FB",
  }

  const tabs = [
    { id: "general", label: "General" },
    { id: "notifications", label: "Notifications" },
    { id: "security", label: "Security" },
    { id: "billing", label: "Billing" },
    { id: "integrations", label: "Integrations" },
  ]

  return (
    <div className="space-y-6 max-w-6xl mx-auto pb-20">
      <div className="grid grid-cols-1 gap-6">
        {/* Tabs */}
        <div className="bg-white p-4 rounded-xl shadow-sm">
          <div className="flex space-x-1 border-b overflow-x-auto no-scrollbar">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-4 py-2 text-sm font-medium whitespace-nowrap ${
                  activeTab === tab.id
                    ? "border-b-2 border-indigo-600 text-indigo-600"
                    : "text-gray-500 hover:text-gray-700"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Main Content */}
        <div className="bg-white p-6 rounded-xl shadow-sm">
          {activeTab === "general" && (
            <div>
              <h2 className="text-lg font-medium mb-4">General Settings</h2>

              <div className="space-y-6">
                <div>
                  <h3 className="text-sm font-medium mb-2">Shop Information</h3>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm text-gray-500 mb-1">Shop Name</label>
                      <input
                        type="text"
                        value={shopData.name}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                      />
                    </div>
                    <div>
                      <label className="block text-sm text-gray-500 mb-1">Email Address</label>
                      <input
                        type="email"
                        value={shopData.email}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                      />
                    </div>
                    <div>
                      <label className="block text-sm text-gray-500 mb-1">Phone Number</label>
                      <input
                        type="tel"
                        value={shopData.phone}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                      />
                    </div>
                  </div>
                </div>

                <div className="pt-6 border-t">
                  <h3 className="text-sm font-medium mb-2">Shop Logo</h3>
                  <div className="flex items-center">
                    <div className="w-16 h-16 rounded-lg overflow-hidden mr-4">
                      <Image
                        src={shopData.logo || "/placeholder.svg"}
                        alt={shopData.name}
                        width={64}
                        height={64}
                        className="object-cover"
                      />
                    </div>
                    <div>
                      <button className="px-3 py-1.5 bg-indigo-600 text-white rounded-lg text-sm">Change Logo</button>
                      <p className="text-xs text-gray-500 mt-1">Recommended: Square image, at least 512x512px</p>
                    </div>
                  </div>
                </div>

                <div className="pt-6 border-t">
                  <h3 className="text-sm font-medium mb-2">Shop Address</h3>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm text-gray-500 mb-1">Street Address</label>
                      <input
                        type="text"
                        placeholder="123 Fashion St"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm text-gray-500 mb-1">City</label>
                        <input
                          type="text"
                          placeholder="Style City"
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                        />
                      </div>
                      <div>
                        <label className="block text-sm text-gray-500 mb-1">State/Province</label>
                        <input
                          type="text"
                          placeholder="CA"
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                        />
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm text-gray-500 mb-1">Zip/Postal Code</label>
                        <input
                          type="text"
                          placeholder="12345"
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                        />
                      </div>
                      <div>
                        <label className="block text-sm text-gray-500 mb-1">Country</label>
                        <select className="w-full px-3 py-2 border border-gray-300 rounded-lg">
                          <option>United States</option>
                          <option>Canada</option>
                          <option>United Kingdom</option>
                        </select>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-8 flex justify-end">
                <button className="px-4 py-2 bg-indigo-600 text-white rounded-lg">Save Changes</button>
              </div>
            </div>
          )}

          {activeTab === "notifications" && (
            <div>
              <h2 className="text-lg font-medium mb-4">Notification Settings</h2>
              <p className="text-gray-500 mb-6">Manage how you receive notifications and alerts.</p>

              <div className="space-y-6">
                <div>
                  <h3 className="text-sm font-medium mb-3">Email Notifications</h3>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium text-sm">New Orders</p>
                        <p className="text-xs text-gray-500">Get notified when a customer places a new order</p>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input type="checkbox" checked className="sr-only peer" />
                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-600"></div>
                      </label>
                    </div>

                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium text-sm">Product Reviews</p>
                        <p className="text-xs text-gray-500">Get notified when a product receives a new review</p>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input type="checkbox" checked className="sr-only peer" />
                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-600"></div>
                      </label>
                    </div>

                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium text-sm">Inventory Alerts</p>
                        <p className="text-xs text-gray-500">Get notified when product inventory is low</p>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input type="checkbox" className="sr-only peer" />
                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-600"></div>
                      </label>
                    </div>
                  </div>
                </div>

                <div className="pt-6 border-t">
                  <h3 className="text-sm font-medium mb-3">Push Notifications</h3>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium text-sm">New Orders</p>
                        <p className="text-xs text-gray-500">Get push notifications for new orders</p>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input type="checkbox" checked className="sr-only peer" />
                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-600"></div>
                      </label>
                    </div>

                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium text-sm">Customer Messages</p>
                        <p className="text-xs text-gray-500">Get push notifications for new customer messages</p>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input type="checkbox" className="sr-only peer" />
                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-600"></div>
                      </label>
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-8 flex justify-end">
                <button className="px-4 py-2 bg-indigo-600 text-white rounded-lg">Save Changes</button>
              </div>
            </div>
          )}

          {/* Other tabs would go here */}
        </div>
      </div>
    </div>
  )
}
