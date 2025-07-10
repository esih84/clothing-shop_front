"use client";

import { useState } from "react";
import { Search, Filter } from "lucide-react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { createColumnHelper } from "@tanstack/react-table";
import { DataTable } from "@/components/ui/data-table";
import { Card, CardContent } from "@/components/ui/card";

interface Order {
  id: string;
  customer: string;
  date: string;
  amount: number;
  status: "completed" | "processing" | "cancelled";
  items: number;
}

export default function OrdersPage() {
  const params = useParams();
  const shopId = params.shopId as string;
  const [searchQuery, setSearchQuery] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");

  // Mock order data
  const orders: Order[] = [
    {
      id: "ORD-001",
      customer: "John Smith",
      date: "May 1, 2025",
      amount: 125.0,
      status: "completed",
      items: 3,
    },
    {
      id: "ORD-002",
      customer: "Sarah Johnson",
      date: "Apr 30, 2025",
      amount: 89.5,
      status: "processing",
      items: 2,
    },
    {
      id: "ORD-003",
      customer: "Michael Brown",
      date: "Apr 29, 2025",
      amount: 210.75,
      status: "completed",
      items: 5,
    },
    {
      id: "ORD-004",
      customer: "Emily Davis",
      date: "Apr 28, 2025",
      amount: 45.99,
      status: "cancelled",
      items: 1,
    },
    {
      id: "ORD-005",
      customer: "David Wilson",
      date: "Apr 27, 2025",
      amount: 178.5,
      status: "processing",
      items: 4,
    },
  ];

  const filteredOrders = orders.filter(
    (order) =>
      (order.customer.toLowerCase().includes(searchQuery.toLowerCase()) ||
        order.id.toLowerCase().includes(searchQuery.toLowerCase())) &&
      (filterStatus === "all" || order.status === filterStatus)
  );

  const getStatusBadgeClass = (status: string) => {
    switch (status) {
      case "completed":
        return "bg-green-100 text-green-800";
      case "processing":
        return "bg-blue-100 text-blue-800";
      case "cancelled":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100";
    }
  };

  // Column definition for TanStack Table
  const columnHelper = createColumnHelper<Order>();

  const columns = [
    columnHelper.accessor("id", {
      header: "Order ID",
      cell: (info) => <span className="font-medium">{info.getValue()}</span>,
    }),
    columnHelper.accessor("customer", {
      header: "Customer",
      cell: (info) => <span>{info.getValue()}</span>,
    }),
    columnHelper.accessor("date", {
      header: "Date",
      cell: (info) => <span className="text-gray-500">{info.getValue()}</span>,
    }),
    columnHelper.accessor("amount", {
      header: "Amount",
      cell: (info) => (
        <span className="font-medium">${info.getValue().toFixed(2)}</span>
      ),
    }),
    columnHelper.accessor("status", {
      header: "Status",
      cell: (info) => (
        <span
          className={`text-xs px-2 py-1 rounded-full ${getStatusBadgeClass(
            info.getValue()
          )}`}
        >
          {info.getValue().charAt(0).toUpperCase() + info.getValue().slice(1)}
        </span>
      ),
    }),
    columnHelper.display({
      id: "actions",
      header: "",
      cell: (info) => (
        <Link
          href={`/shop/${shopId}/orders/${info.row.original.id}`}
          className="text-sm text-blue-600 hover:underline"
        >
          View Details
        </Link>
      ),
    }),
  ];

  // Mobile order list view
  const MobileOrderList = () => (
    <div className="space-y-4 sm:hidden">
      {filteredOrders.map((order) => (
        <Card key={order.id} className="overflow-hidden animate-fadeIn">
          <CardContent className="p-4">
            <div className="flex justify-between items-start mb-3">
              <div>
                <h3 className="font-medium">{order.id}</h3>
                <p className="text-sm">{order.customer}</p>
              </div>
              <span
                className={`text-xs px-2 py-1 rounded-full ${getStatusBadgeClass(
                  order.status
                )}`}
              >
                {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
              </span>
            </div>
            <div className="flex justify-between items-center text-sm">
              <div>
                <p className="text-gray-500">{order.date}</p>
                <p className="text-gray-500">{order.items} items</p>
              </div>
              <div className="text-right">
                <p className="font-bold">${order.amount.toFixed(2)}</p>
                <Link
                  href={`/shop/${shopId}/orders/${order.id}`}
                  className="text-blue-600 text-sm"
                >
                  View Details
                </Link>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );

  return (
    <div className="space-y-6 animate-fadeIn">
      <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
        <div className="relative w-full sm:max-w-xs">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <input
            type="text"
            placeholder="Search orders"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 rounded-full bg-white border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent"
          />
        </div>

        <button className="p-2 rounded-full border border-gray-200 bg-white shadow-sm w-full sm:w-auto flex items-center justify-center sm:justify-start">
          <Filter className="w-5 h-5 text-gray-500 mr-2 md:mr-0" />
          <span className="sm:hidden"> Orders</span>
        </button>
      </div>

      <div className="flex space-x-2 overflow-x-auto scrollbar-hide pb-2">
        <button
          className={`px-4 py-2 rounded-full whitespace-nowrap text-sm transition-colors ${
            filterStatus === "all" ? "bg-black text-white" : "bg-gray-100"
          }`}
          onClick={() => setFilterStatus("all")}
        >
          All Orders
        </button>
        <button
          className={`px-4 py-2 rounded-full whitespace-nowrap text-sm transition-colors ${
            filterStatus === "processing"
              ? "bg-black text-white"
              : "bg-gray-100"
          }`}
          onClick={() => setFilterStatus("processing")}
        >
          Processing
        </button>
        <button
          className={`px-4 py-2 rounded-full whitespace-nowrap text-sm transition-colors ${
            filterStatus === "completed" ? "bg-black text-white" : "bg-gray-100"
          }`}
          onClick={() => setFilterStatus("completed")}
        >
          Completed
        </button>
        <button
          className={`px-4 py-2 rounded-full whitespace-nowrap text-sm transition-colors ${
            filterStatus === "cancelled" ? "bg-black text-white" : "bg-gray-100"
          }`}
          onClick={() => setFilterStatus("cancelled")}
        >
          Cancelled
        </button>
      </div>

      {/* Mobile Order List */}
      <MobileOrderList />

      {/* Desktop Data Table */}
      <div className="hidden sm:block">
        <Card className="border border-gray-100 shadow-md overflow-hidden">
          <CardContent className="p-0">
            <DataTable
              columns={columns}
              data={filteredOrders}
              searchKey="customer"
              searchValue={searchQuery}
            />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
