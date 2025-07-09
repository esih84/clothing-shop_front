"use client"

import { useState } from "react"
import { Package, MapPin, CreditCard, Settings, LogOut, Store } from "lucide-react"
import { StoreCard } from "@/components/store-card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export default function ProfilePage() {
  const [activeTab, setActiveTab] = useState("orders")

  return (
    <div className="p-4 mx-auto max-w-4xl">
      <div className="bg-white rounded-xl p-4 sm:p-6 text-center mb-6">
        <div className="w-20 h-20 sm:w-24 sm:h-24 bg-[#d8f5b4] rounded-full mx-auto flex items-center justify-center">
          <span className="text-2xl sm:text-3xl font-bold">JD</span>
        </div>
        <h1 className="mt-4 text-xl sm:text-2xl font-bold">John Doe</h1>
        <p className="text-gray-500 text-sm sm:text-base">john.doe@example.com</p>
      </div>

      <Tabs defaultValue="orders" className="w-full" onValueChange={setActiveTab}>
        <TabsList className="grid grid-cols-5 mb-6">
          <TabsTrigger value="orders" className="flex flex-col items-center gap-1 py-3">
            <Package className="h-5 w-5" />
            <span className="text-xs sm:text-sm">Orders</span>
          </TabsTrigger>
          <TabsTrigger value="addresses" className="flex flex-col items-center gap-1 py-3">
            <MapPin className="h-5 w-5" />
            <span className="text-xs sm:text-sm">Addresses</span>
          </TabsTrigger>
          <TabsTrigger value="payment" className="flex flex-col items-center gap-1 py-3">
            <CreditCard className="h-5 w-5" />
            <span className="text-xs sm:text-sm">Payment</span>
          </TabsTrigger>
          <TabsTrigger value="settings" className="flex flex-col items-center gap-1 py-3">
            <Settings className="h-5 w-5" />
            <span className="text-xs sm:text-sm">Settings</span>
          </TabsTrigger>
          <TabsTrigger value="stores" className="flex flex-col items-center gap-1 py-3">
            <Store className="h-5 w-5" />
            <span className="text-xs sm:text-sm">Stores</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="orders" className="space-y-4">
          <div className="space-y-3">
            <div className="flex items-center justify-between bg-white p-4 rounded-lg border">
              <div className="flex items-center">
                <Package className="w-5 h-5 sm:w-6 sm:h-6 mr-3 sm:mr-4 text-[#d8f5b4]" />
                <div>
                  <p className="font-medium text-base sm:text-lg">Order #12345</p>
                  <p className="text-sm sm:text-base text-gray-500">May 1, 2025</p>
                </div>
              </div>
              <span className="text-sm sm:text-base bg-[#d8f5b4] px-3 py-1 rounded-full">Delivered</span>
            </div>

            <div className="flex items-center justify-between bg-white p-4 rounded-lg border">
              <div className="flex items-center">
                <Package className="w-5 h-5 sm:w-6 sm:h-6 mr-3 sm:mr-4 text-[#d8f5b4]" />
                <div>
                  <p className="font-medium text-base sm:text-lg">Order #12346</p>
                  <p className="text-sm sm:text-base text-gray-500">April 28, 2025</p>
                </div>
              </div>
              <span className="text-sm sm:text-base bg-gray-200 px-3 py-1 rounded-full">Processing</span>
            </div>

            <div className="flex items-center justify-between bg-white p-4 rounded-lg border">
              <div className="flex items-center">
                <Package className="w-5 h-5 sm:w-6 sm:h-6 mr-3 sm:mr-4 text-[#d8f5b4]" />
                <div>
                  <p className="font-medium text-base sm:text-lg">Order #12347</p>
                  <p className="text-sm sm:text-base text-gray-500">April 15, 2025</p>
                </div>
              </div>
              <span className="text-sm sm:text-base bg-[#d8f5b4] px-3 py-1 rounded-full">Delivered</span>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="addresses" className="space-y-4">
          <div className="space-y-3">
            <div className="flex items-center justify-between bg-white p-4 rounded-lg border">
              <div className="flex items-center">
                <MapPin className="w-5 h-5 sm:w-6 sm:h-6 mr-3 sm:mr-4 text-[#d8f5b4]" />
                <div>
                  <p className="font-medium text-base sm:text-lg">Home</p>
                  <p className="text-sm sm:text-base text-gray-500">123 Main St, Anytown, USA</p>
                </div>
              </div>
              <span className="text-sm sm:text-base bg-[#d8f5b4] px-3 py-1 rounded-full">Default</span>
            </div>

            <div className="flex items-center justify-between bg-white p-4 rounded-lg border">
              <div className="flex items-center">
                <MapPin className="w-5 h-5 sm:w-6 sm:h-6 mr-3 sm:mr-4 text-[#d8f5b4]" />
                <div>
                  <p className="font-medium text-base sm:text-lg">Work</p>
                  <p className="text-sm sm:text-base text-gray-500">456 Office Blvd, Business City, USA</p>
                </div>
              </div>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="payment" className="space-y-4">
          <div className="space-y-3">
            <div className="flex items-center justify-between bg-white p-4 rounded-lg border">
              <div className="flex items-center">
                <CreditCard className="w-5 h-5 sm:w-6 sm:h-6 mr-3 sm:mr-4 text-[#d8f5b4]" />
                <div>
                  <p className="font-medium text-base sm:text-lg">Visa ending in 4242</p>
                  <p className="text-sm sm:text-base text-gray-500">Expires 05/26</p>
                </div>
              </div>
              <span className="text-sm sm:text-base bg-[#d8f5b4] px-3 py-1 rounded-full">Default</span>
            </div>

            <div className="flex items-center justify-between bg-white p-4 rounded-lg border">
              <div className="flex items-center">
                <CreditCard className="w-5 h-5 sm:w-6 sm:h-6 mr-3 sm:mr-4 text-[#d8f5b4]" />
                <div>
                  <p className="font-medium text-base sm:text-lg">Mastercard ending in 8888</p>
                  <p className="text-sm sm:text-base text-gray-500">Expires 12/25</p>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between bg-white p-4 rounded-lg border">
              <div className="flex items-center">
                <CreditCard className="w-5 h-5 sm:w-6 sm:h-6 mr-3 sm:mr-4 text-[#d8f5b4]" />
                <div>
                  <p className="font-medium text-base sm:text-lg">PayPal</p>
                  <p className="text-sm sm:text-base text-gray-500">john.doe@example.com</p>
                </div>
              </div>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="settings" className="space-y-4">
          <div className="space-y-3">
            <div className="flex items-center justify-between bg-white p-4 rounded-lg border">
              <div className="flex items-center">
                <Settings className="w-5 h-5 sm:w-6 sm:h-6 mr-3 sm:mr-4 text-[#d8f5b4]" />
                <p className="font-medium text-base sm:text-lg">Notifications</p>
              </div>
              <div className="relative inline-block w-10 sm:w-12 h-6 sm:h-7 rounded-full bg-[#d8f5b4]">
                <div className="absolute right-1 top-1 w-4 sm:w-5 h-4 sm:h-5 rounded-full bg-white"></div>
              </div>
            </div>

            <div className="flex items-center justify-between bg-white p-4 rounded-lg border">
              <div className="flex items-center">
                <Settings className="w-5 h-5 sm:w-6 sm:h-6 mr-3 sm:mr-4 text-[#d8f5b4]" />
                <p className="font-medium text-base sm:text-lg">Dark Mode</p>
              </div>
              <div className="relative inline-block w-10 sm:w-12 h-6 sm:h-7 rounded-full bg-gray-300">
                <div className="absolute left-1 top-1 w-4 sm:w-5 h-4 sm:h-5 rounded-full bg-white"></div>
              </div>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="stores" className="space-y-4">
          <div className="space-y-3">
            <StoreCard id="store1" name="Fashion Boutique" role="Manager" address="123 Fashion St" color="#d8f5b4" />
            <StoreCard id="store2" name="Urban Styles" role="Employee" address="456 Urban Ave" color="#66a3ff" />
            <StoreCard id="store3" name="Trendy Threads" role="Owner" address="789 Trend Blvd" color="#ff6666" />
          </div>
        </TabsContent>
      </Tabs>

      <button className="w-full bg-red-100 text-red-600 p-4 rounded-xl font-medium flex items-center justify-center mt-8 text-base sm:text-lg">
        <LogOut className="w-5 h-5 sm:w-6 sm:h-6 mr-2" />
        Log Out
      </button>
    </div>
  )
}
