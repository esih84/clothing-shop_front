"use client";

import { useState } from "react";
import { ChevronDown, Filter, Download, TrendingUp } from "lucide-react";
import { useRouter } from "next/navigation";
import { createColumnHelper } from "@tanstack/react-table";
import { DataTable } from "@/components/ui/data-table";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  RadialBarChart,
  RadialBar,
  PolarRadiusAxis,
  Label,
} from "recharts";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";

interface Transaction {
  id: string;
  product: { name: string; icon: string };
  date: string;
  price: string;
  status: "unpaid" | "pending" | "completed";
}

export default function ShopDashboard({
  params,
}: {
  params: { shopId: string };
}) {
  const [timeframe, setTimeframe] = useState("weekly");
  const [salesTimeframe, setSalesTimeframe] = useState("weekly");
  const [categoryTimeframe, setCategoryTimeframe] = useState("weekly");
  const [salesDialogOpen, setSalesDialogOpen] = useState(false);
  const [categoryDialogOpen, setCategoryDialogOpen] = useState(false);
  const router = useRouter();

  // Mock data for the dashboard
  const stats = [
    {
      id: "offline",
      title: "Offline Store",
      subtitle: "Sell locally with ease",
      value: "$14,590",
      change: "+7.5%",
      trend: "up",
      period: "from last month",
    },
    {
      id: "online",
      title: "Online Store",
      subtitle: "Sell online, customers",
      value: "$6,284",
      change: "+5%",
      trend: "up",
      period: "from last month",
    },
  ];

  // Mock data for chat performance
  const chatPerformance = {
    time: "00:01:30",
    trend: "up",
    change: "+8%",
    period: "from last month",
  };

  // Mock data for sales overview
  const salesData = [
    { day: "Mon", value: 350 },
    { day: "Tue", value: 280 },
    { day: "Wed", value: 450 },
    { day: "Thu", value: 520 },
    { day: "Fri", value: 350 },
    { day: "Sat", value: 480 },
    { day: "Sun", value: 420 },
  ];

  // Mock data for product transactions
  const transactions: Transaction[] = [
    {
      id: "SL5890131-9N",
      product: { name: "Apple iPad (Gen 10)", icon: "📱" },
      date: "13 February, 2025",
      price: "$38",
      status: "unpaid",
    },
    {
      id: "SL5890132-9N",
      product: { name: "Apple iPhone 13", icon: "📱" },
      date: "13 February, 2025",
      price: "$32",
      status: "pending",
    },
    {
      id: "SL5890129-7N",
      product: { name: "Apple MacBook Air M2", icon: "💻" },
      date: "13 February, 2025",
      price: "$34",
      status: "pending",
    },
    {
      id: "SL5890128-9F",
      product: { name: "Apple iMac 2023", icon: "🖥️" },
      date: "13 February, 2025",
      price: "$38",
      status: "completed",
    },
    {
      id: "SL5890127-5F",
      product: { name: "Apple AirPods 4", icon: "🎧" },
      date: "13 February, 2025",
      price: "$46",
      status: "completed",
    },
  ];

  // Mock data for category chart - Radial Stacked Chart format
  const categoryData = [
    {
      name: "Smartphones",
      Q1: 1200,
      Q2: 1000,
      Q3: 900,
      Q4: 749,
      fill: "#4f46e5",
    },
    {
      name: "Laptops & PC",
      Q1: 250,
      Q2: 200,
      Q3: 150,
      Q4: 150,
      fill: "#ef4444",
    },
    {
      name: "Accessories",
      Q1: 500,
      Q2: 400,
      Q3: 350,
      Q4: 399,
      fill: "#10b981",
    },
  ];

  // Prepare data for RadialBarChart
  const radialData = [
    { name: "Q4", value: 749, fill: "#f97316" },
    { name: "Q3", value: 900, fill: "#10b981" },
    { name: "Q2", value: 1000, fill: "#ef4444" },
    { name: "Q1", value: 1200, fill: "#4f46e5" },
  ];

  // Get status badge class
  const getStatusBadgeClass = (status: string) => {
    switch (status) {
      case "completed":
        return "bg-green-100 text-green-600";
      case "pending":
        return "bg-yellow-100 text-yellow-600";
      case "unpaid":
        return "bg-red-100 text-red-600";
      default:
        return "bg-gray-100 text-gray-600";
    }
  };

  // Column definition for TanStack Table
  const columnHelper = createColumnHelper<Transaction>();

  const columns = [
    columnHelper.accessor("id", {
      header: "Order ID",
      cell: (info) => (
        <div className="flex items-center">
          <input type="checkbox" className="mr-2" />
          <span className="text-sm">{info.getValue()}</span>
        </div>
      ),
    }),
    columnHelper.accessor("product", {
      header: "Product Name",
      cell: (info) => (
        <div className="flex items-center">
          <span className="mr-2 text-xl">{info.getValue().icon}</span>
          <span className="text-sm">{info.getValue().name}</span>
        </div>
      ),
    }),
    columnHelper.accessor("date", {
      header: "Order Date",
      cell: (info) => <span className="text-sm">{info.getValue()}</span>,
    }),
    columnHelper.accessor("price", {
      header: "Price",
      cell: (info) => <span className="text-sm">{info.getValue()}</span>,
    }),
    columnHelper.accessor("status", {
      header: "Status",
      cell: (info) => (
        <span
          className={`text-sm px-3 py-1.5 rounded-full ${getStatusBadgeClass(
            info.getValue()
          )}`}
        >
          {info.getValue().charAt(0).toUpperCase() + info.getValue().slice(1)}
        </span>
      ),
    }),
    columnHelper.display({
      id: "actions",
      header: "Action",
      cell: () => (
        <div className="flex space-x-2">
          <button className="p-1 text-blue-500">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
              <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
            </svg>
          </button>
          <Dialog>
            <DialogTrigger asChild>
              <button className="p-1 text-red-500">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M3 6h18" />
                  <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6" />
                  <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" />
                </svg>
              </button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Delete Transaction</DialogTitle>
                <DialogDescription>
                  Are you sure you want to delete this transaction? This action
                  cannot be undone.
                </DialogDescription>
              </DialogHeader>
              <DialogFooter className="mt-4">
                <DialogClose asChild>
                  <button className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 font-medium">
                    Cancel
                  </button>
                </DialogClose>
                <button className="px-4 py-2 bg-red-500 text-white rounded-lg font-medium">
                  Delete
                </button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      ),
    }),
  ];

  // Filter options for the drawer
  const filterOptions = [
    {
      name: "Status",
      options: [
        { label: "All", value: "all" },
        { label: "Completed", value: "completed" },
        { label: "Pending", value: "pending" },
        { label: "Unpaid", value: "unpaid" },
      ],
    },
    {
      name: "Date Range",
      options: [
        { label: "Today", value: "today" },
        { label: "Last 7 days", value: "week" },
        { label: "Last 30 days", value: "month" },
        { label: "Last 90 days", value: "quarter" },
        { label: "Custom", value: "custom" },
      ],
    },
    {
      name: "Price Range",
      options: [
        { label: "All", value: "all" },
        { label: "Under $20", value: "under20" },
        { label: "$20 - $50", value: "20-50" },
        { label: "Over $50", value: "over50" },
      ],
    },
  ];

  // Handle timeframe selection for sales overview
  const handleSalesTimeframeChange = (period: string) => {
    setSalesTimeframe(period.toLowerCase());
    setSalesDialogOpen(false);
  };

  // Handle timeframe selection for category chart
  const handleCategoryTimeframeChange = (period: string) => {
    setCategoryTimeframe(period.toLowerCase());
    setCategoryDialogOpen(false);
  };

  return (
    <div className="space-y-6">
      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {/* Offline Store */}
        <Card className="bg-gradient-to-br from-gray-900 to-gray-800 text-white overflow-hidden border-0 shadow-lg">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg font-serif">
              {stats[0].title}
            </CardTitle>
            <CardDescription className="text-gray-300">
              {stats[0].subtitle}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-light mb-2">{stats[0].value}</p>
            <div className="flex items-center text-sm">
              <span
                className={`px-1.5 py-0.5 rounded-sm mr-1 ${
                  stats[0].trend === "up"
                    ? "bg-green-500/20 text-green-300"
                    : "bg-red-500/20 text-red-300"
                }`}
              >
                {stats[0].change}
              </span>
              <span className="text-gray-300">{stats[0].period}</span>
            </div>
          </CardContent>
        </Card>

        {/* Online Store */}
        <Card className="bg-white border border-gray-100 shadow-md overflow-hidden">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg font-serif">
              {stats[1].title}
            </CardTitle>
            <CardDescription className="text-gray-500">
              {stats[1].subtitle}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-light mb-2">{stats[1].value}</p>
            <div className="flex items-center text-sm">
              <span
                className={`px-1.5 py-0.5 rounded-sm mr-1 ${
                  stats[1].trend === "up"
                    ? "bg-green-100 text-green-600"
                    : "bg-red-100 text-red-600"
                }`}
              >
                {stats[1].change}
              </span>
              <span className="text-gray-500">{stats[1].period}</span>
            </div>
          </CardContent>
        </Card>

        {/* Chat Performance */}
        <Card className="bg-white border border-gray-100 shadow-md overflow-hidden">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg font-serif">
              Chat Performance
            </CardTitle>
            <CardDescription className="text-gray-500">
              Average response time
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-light mb-2">{chatPerformance.time}</p>
            <div className="flex items-center text-sm">
              <span
                className={`px-1.5 py-0.5 rounded-sm mr-1 ${
                  chatPerformance.trend === "up"
                    ? "bg-green-100 text-green-600"
                    : "bg-red-100 text-red-600"
                }`}
              >
                {chatPerformance.change}
              </span>
              <span className="text-gray-500">{chatPerformance.period}</span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Sales Overview and Category Chart */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mt-6">
        {/* Sales Overview */}
        <Card className="lg:col-span-2 border border-gray-100 shadow-md overflow-hidden">
          <CardHeader className="pb-2">
            <div className="flex justify-between items-center">
              <div>
                <CardTitle className="text-lg font-serif">
                  Sales Overview
                </CardTitle>
                <CardDescription>
                  Monitor sales trends and gain insights for growth.
                </CardDescription>
              </div>
              <Dialog open={salesDialogOpen} onOpenChange={setSalesDialogOpen}>
                <DialogTrigger asChild>
                  <button className="flex items-center px-3 py-1.5 border rounded-lg text-sm">
                    <span>
                      {salesTimeframe.charAt(0).toUpperCase() +
                        salesTimeframe.slice(1)}
                    </span>
                    <ChevronDown className="w-4 h-4 ml-1" />
                  </button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Select Timeframe</DialogTitle>
                    <DialogDescription>
                      Choose a timeframe to view your sales data.
                    </DialogDescription>
                  </DialogHeader>
                  <div className="grid grid-cols-1 gap-2 py-4">
                    {["Daily", "Weekly", "Monthly", "Quarterly", "Yearly"].map(
                      (period) => (
                        <button
                          key={period}
                          className={`flex items-center justify-between p-3 rounded-lg border ${
                            period.toLowerCase() === salesTimeframe
                              ? "border-gray-900 bg-gray-50"
                              : "border-gray-200"
                          }`}
                          onClick={() => handleSalesTimeframeChange(period)}
                        >
                          <span>{period}</span>
                          {period.toLowerCase() === salesTimeframe && (
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              width="18"
                              height="18"
                              viewBox="0 0 24 24"
                              fill="none"
                              stroke="currentColor"
                              strokeWidth="2"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              className="text-gray-900"
                            >
                              <path d="M20 6 9 17l-5-5" />
                            </svg>
                          )}
                        </button>
                      )
                    )}
                  </div>
                </DialogContent>
              </Dialog>
            </div>
          </CardHeader>
          <CardContent className="pt-4">
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={salesData}
                  margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" vertical={false} />
                  <XAxis dataKey="day" />
                  <YAxis />
                  <Tooltip
                    formatter={(value) => [`$${value}`, "Sales"]}
                    labelFormatter={() => "Sales"}
                    contentStyle={{ borderRadius: "8px" }}
                  />
                  <Bar dataKey="value" fill="#111111" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Category Chart - Now using Radial Stacked Chart */}
        <Card className="border border-gray-100 shadow-md overflow-hidden">
          <CardHeader className="items-center pb-0">
            <CardTitle className="text-lg font-serif">
              Sales Categories
            </CardTitle>
            <CardDescription>Quarterly Sales Distribution</CardDescription>
          </CardHeader>
          <CardContent className="flex flex-1 items-center pb-0">
            <ChartContainer
              config={{
                Q1: {
                  label: "Q1",
                  color: "hsl(var(--chart-1))",
                },
                Q2: {
                  label: "Q2",
                  color: "hsl(var(--chart-2))",
                },
                Q3: {
                  label: "Q3",
                  color: "hsl(var(--chart-3))",
                },
                Q4: {
                  label: "Q4",
                  color: "hsl(var(--chart-4))",
                },
              }}
              className="mx-auto aspect-square w-full max-w-[250px]"
            >
              <RadialBarChart
                data={[
                  {
                    category: "Smartphones",
                    Q1: 1200,
                    Q2: 1000,
                    Q3: 900,
                    Q4: 749,
                  },
                ]}
                endAngle={180}
                innerRadius={80}
                outerRadius={130}
              >
                <ChartTooltip
                  cursor={false}
                  content={<ChartTooltipContent hideLabel />}
                />
                <PolarRadiusAxis tick={false} tickLine={false} axisLine={false}>
                  <Label
                    content={({ viewBox }) => {
                      if (viewBox && "cx" in viewBox && "cy" in viewBox) {
                        const totalSales = 1200 + 1000 + 900 + 749;
                        return (
                          <text
                            x={viewBox.cx}
                            y={viewBox.cy}
                            textAnchor="middle"
                          >
                            <tspan
                              x={viewBox.cx}
                              y={(viewBox.cy || 0) - 16}
                              className="fill-foreground text-2xl font-bold"
                            >
                              {totalSales.toLocaleString()}
                            </tspan>
                            <tspan
                              x={viewBox.cx}
                              y={(viewBox.cy || 0) + 4}
                              className="fill-muted-foreground"
                            >
                              Units
                            </tspan>
                          </text>
                        );
                      }
                    }}
                  />
                </PolarRadiusAxis>
                <RadialBar
                  dataKey="Q1"
                  stackId="a"
                  cornerRadius={5}
                  fill="var(--color-Q1)"
                  className="stroke-transparent stroke-2"
                />
                <RadialBar
                  dataKey="Q2"
                  fill="var(--color-Q2)"
                  stackId="a"
                  cornerRadius={5}
                  className="stroke-transparent stroke-2"
                />
                <RadialBar
                  dataKey="Q3"
                  fill="var(--color-Q3)"
                  stackId="a"
                  cornerRadius={5}
                  className="stroke-transparent stroke-2"
                />
                <RadialBar
                  dataKey="Q4"
                  fill="var(--color-Q4)"
                  stackId="a"
                  cornerRadius={5}
                  className="stroke-transparent stroke-2"
                />
              </RadialBarChart>
            </ChartContainer>
          </CardContent>
          <CardFooter className="flex-col gap-2 text-sm">
            <div className="flex items-center gap-2 font-medium leading-none">
              Trending up by 7.5% this quarter{" "}
              <TrendingUp className="h-4 w-4" />
            </div>
            <div className="leading-none text-muted-foreground">
              Showing sales distribution across all quarters
            </div>
          </CardFooter>
        </Card>
      </div>

      {/* Product Transactions */}
      <Card className="border border-gray-100 shadow-md overflow-hidden mt-6">
        <CardHeader className="pb-2">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <CardTitle className="text-lg font-serif">
                Product Transactions
              </CardTitle>
              <CardDescription>
                Latest online transactions made in real time.
              </CardDescription>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <Drawer>
                <DrawerTrigger asChild>
                  <button className="flex items-center px-3 py-1.5 border rounded-lg text-sm">
                    <Filter className="w-4 h-4 mr-1" />
                    <span>Filter</span>
                  </button>
                </DrawerTrigger>
                <DrawerContent className="p-4">
                  <DrawerHeader>
                    <DrawerTitle>Filter Transactions</DrawerTitle>
                    <DrawerDescription>
                      Apply filters to narrow down your transaction list.
                    </DrawerDescription>
                  </DrawerHeader>
                  <div className="space-y-4 py-4">
                    {filterOptions.map((filterGroup) => (
                      <div key={filterGroup.name} className="space-y-2">
                        <h3 className="text-sm font-medium">
                          {filterGroup.name}
                        </h3>
                        <div className="grid grid-cols-2 gap-2">
                          {filterGroup.options.map((option) => (
                            <button
                              key={option.value}
                              className={`px-3 py-2 text-sm border rounded-lg ${
                                option.value === "all" ||
                                option.value === "week" ||
                                option.value === "all"
                                  ? "bg-gray-50 border-gray-900 text-gray-900"
                                  : "border-gray-200"
                              }`}
                            >
                              {option.label}
                            </button>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                  <DrawerFooter>
                    <button className="w-full px-4 py-2 bg-black text-white rounded-lg font-medium">
                      Apply Filters
                    </button>
                    <DrawerClose asChild>
                      <button className="w-full px-4 py-2 border border-gray-300 rounded-lg text-gray-700 font-medium">
                        Cancel
                      </button>
                    </DrawerClose>
                  </DrawerFooter>
                </DrawerContent>
              </Drawer>
              <Dialog>
                <DialogTrigger asChild>
                  <button className="flex items-center px-3 py-1.5 border rounded-lg text-sm">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="16"
                      height="16"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="mr-1"
                    >
                      <path d="M21 2v6h-6" />
                      <path d="M3 15a9 9 0 0 1 9-9h9" />
                      <path d="M21 22v-6h-6" />
                      <path d="M3 9a9 9 0 0 0 9 9h9" />
                    </svg>
                    <span>Customize</span>
                  </button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Customize Table</DialogTitle>
                    <DialogDescription>
                      Select which columns to display in your transaction table.
                    </DialogDescription>
                  </DialogHeader>
                  <div className="py-4 space-y-2">
                    {[
                      "Order ID",
                      "Product Name",
                      "Order Date",
                      "Price",
                      "Status",
                      "Actions",
                    ].map((column) => (
                      <div
                        key={column}
                        className="flex items-center justify-between"
                      >
                        <span className="text-sm">{column}</span>
                        <input
                          type="checkbox"
                          checked={column !== "Actions"}
                          className="h-4 w-4 rounded border-gray-300 text-black focus:ring-black"
                        />
                      </div>
                    ))}
                  </div>
                  <DialogFooter>
                    <DialogClose asChild>
                      <button className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 font-medium">
                        Cancel
                      </button>
                    </DialogClose>
                    <button className="px-4 py-2 bg-black text-white rounded-lg font-medium">
                      Apply Changes
                    </button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
              <Dialog>
                <DialogTrigger asChild>
                  <button className="flex items-center px-3 py-1.5 border rounded-lg text-sm">
                    <Download className="w-4 h-4 mr-1" />
                    <span>Export</span>
                  </button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Export Transactions</DialogTitle>
                    <DialogDescription>
                      Choose a format to export your transaction data.
                    </DialogDescription>
                  </DialogHeader>
                  <div className="grid grid-cols-1 gap-2 py-4">
                    {["CSV", "Excel", "PDF", "JSON"].map((format) => (
                      <button
                        key={format}
                        className="flex items-center justify-between p-3 rounded-lg border border-gray-200 hover:border-gray-900 hover:bg-gray-50"
                      >
                        <div className="flex items-center">
                          <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center mr-3">
                            <span className="text-gray-900 font-medium">
                              {format.charAt(0)}
                            </span>
                          </div>
                          <span>{format} File</span>
                        </div>
                        <Download className="w-4 h-4 text-gray-500" />
                      </button>
                    ))}
                  </div>
                  <DialogFooter>
                    <DialogClose asChild>
                      <button className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 font-medium">
                        Cancel
                      </button>
                    </DialogClose>
                    <button className="px-4 py-2 bg-black text-white rounded-lg font-medium">
                      Export
                    </button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </div>
          </div>
        </CardHeader>
        <CardContent className="pt-4 overflow-x-auto">
          <DataTable columns={columns} data={transactions} pageSize={5} />
        </CardContent>
      </Card>
    </div>
  );
}
