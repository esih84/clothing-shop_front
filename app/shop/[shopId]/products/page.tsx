"use client"

import { useState } from "react"
import { useParams, useRouter } from "next/navigation"
import { Plus, Search, Filter, Edit, Trash2 } from "lucide-react"
import Image from "next/image"
import { createColumnHelper } from "@tanstack/react-table"
import { DataTable } from "@/components/ui/data-table"
import { DeleteConfirmationModal } from "@/components/modals/delete-confirmation-modal"
import { Card, CardContent } from "@/components/ui/card"

interface Product {
  id: string
  name: string
  price: number
  stock: number
  category: string
  description: string
  imageUrl: string
}

export default function ProductsPage() {
  const params = useParams()
  const router = useRouter()
  const shopId = params.shopId as string
  const [searchQuery, setSearchQuery] = useState("")
  const [deleteModalData, setDeleteModalData] = useState<{ isOpen: boolean; productId: string; name: string }>({
    isOpen: false,
    productId: "",
    name: "",
  })
  const [isDeleting, setIsDeleting] = useState(false)

  // Mock product data
  const products: Product[] = [
    {
      id: "1",
      name: "Men's Casual Jacket",
      price: 89.99,
      stock: 24,
      category: "Jackets",
      description: "A stylish casual jacket for men, perfect for fall weather.",
      imageUrl: "/placeholder.svg?height=80&width=80",
    },
    {
      id: "2",
      name: "Women's Summer Dress",
      price: 59.99,
      stock: 15,
      category: "Dresses",
      description: "Light and airy summer dress with floral pattern.",
      imageUrl: "/placeholder.svg?height=80&width=80",
    },
    {
      id: "3",
      name: "Unisex Sneakers",
      price: 79.99,
      stock: 32,
      category: "Shoes",
      description: "Comfortable sneakers suitable for all-day wear.",
      imageUrl: "/placeholder.svg?height=80&width=80",
    },
    {
      id: "4",
      name: "Leather Belt",
      price: 29.99,
      stock: 45,
      category: "Accessories",
      description: "Genuine leather belt with classic buckle design.",
      imageUrl: "/placeholder.svg?height=80&width=80",
    },
  ]

  const handleEditClick = (productId: string) => {
    router.push(`/shop/${shopId}/products/edit/${productId}`)
  }

  const handleDeleteClick = (productId: string, name: string) => {
    setDeleteModalData({
      isOpen: true,
      productId,
      name,
    })
  }

  const handleDeleteConfirm = async () => {
    setIsDeleting(true)
    // In a real app, this would call an API to delete the product
    await new Promise((resolve) => setTimeout(resolve, 1000)) // Simulate API call
    setIsDeleting(false)
    setDeleteModalData({ isOpen: false, productId: "", name: "" })
    // Refresh the page or update the state
    window.location.reload()
  }

  // Column definition for TanStack Table
  const columnHelper = createColumnHelper<Product>()

  const columns = [
    columnHelper.accessor("name", {
      header: "Product",
      cell: (info) => {
        const product = info.row.original
        return (
          <div className="flex items-center">
            <Image
              src={product.imageUrl || "/placeholder.svg"}
              alt={product.name}
              width={40}
              height={40}
              className="rounded-lg mr-3"
            />
            <div>
              <p className="font-medium">{product.name}</p>
              <p className="text-xs text-gray-500">{product.category}</p>
            </div>
          </div>
        )
      },
    }),
    columnHelper.accessor("price", {
      header: "Price",
      cell: (info) => <span className="font-medium">${info.getValue().toFixed(2)}</span>,
    }),
    columnHelper.accessor("stock", {
      header: "Stock",
      cell: (info) => <span className="text-gray-500">{info.getValue()}</span>,
    }),
    columnHelper.display({
      id: "actions",
      header: "Actions",
      cell: (info) => {
        const product = info.row.original
        return (
          <div className="flex space-x-2">
            <button
              className="p-1 text-blue-500 hover:bg-blue-50 rounded-full"
              onClick={() => handleEditClick(product.id)}
            >
              <Edit className="w-4 h-4" />
            </button>
            <button
              className="p-1 text-red-500 hover:bg-red-50 rounded-full"
              onClick={() => handleDeleteClick(product.id, product.name)}
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        )
      },
    }),
  ]

  // Mobile product list view
  const MobileProductList = () => (
    <div className="space-y-4 sm:hidden">
      {products
        .filter(
          (product) =>
            product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            product.category.toLowerCase().includes(searchQuery.toLowerCase()),
        )
        .map((product) => (
          <Card key={product.id} className="overflow-hidden animate-fadeIn">
            <div className="flex">
              <div className="w-1/3 bg-gray-50 flex items-center justify-center p-4">
                <Image
                  src={product.imageUrl || "/placeholder.svg"}
                  alt={product.name}
                  width={80}
                  height={80}
                  className="rounded-lg"
                />
              </div>
              <div className="w-2/3 p-4">
                <h3 className="font-medium">{product.name}</h3>
                <p className="text-xs text-gray-500 mb-2">{product.category}</p>
                <div className="flex justify-between items-center">
                  <div>
                    <p className="font-bold">${product.price.toFixed(2)}</p>
                    <p className="text-xs text-gray-500">Stock: {product.stock}</p>
                  </div>
                  <div className="flex space-x-2">
                    <button className="p-1.5 bg-gray-100 rounded-full" onClick={() => handleEditClick(product.id)}>
                      <Edit className="w-4 h-4" />
                    </button>
                    <button
                      className="p-1.5 bg-gray-100 rounded-full"
                      onClick={() => handleDeleteClick(product.id, product.name)}
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </Card>
        ))}
    </div>
  )

  return (
    <div className="space-y-6 animate-fadeIn">
      <h1 className="text-2xl font-serif font-medium tracking-wide text-center sm:text-left mb-4">Products</h1>

      <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
        <div className="relative w-full sm:max-w-xs">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <input
            type="text"
            placeholder="Search products"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 rounded-full bg-white border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent"
          />
        </div>

        <div className="flex gap-2 w-full sm:w-auto justify-end">
          <button className="p-2 rounded-full border border-gray-200 bg-white shadow-sm">
            <Filter className="w-5 h-5 text-gray-500" />
          </button>
          <button
            className="bg-black text-white p-2 rounded-full shadow-sm flex items-center justify-center"
            onClick={() => router.push(`/shop/${shopId}/products/create`)}
          >
            <Plus className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Mobile Product List */}
      <MobileProductList />

      {/* Desktop Data Table */}
      <div className="hidden sm:block">
        <Card className="border border-gray-100 shadow-md overflow-hidden">
          <CardContent className="p-0">
            <DataTable columns={columns} data={products} searchKey="name" searchValue={searchQuery} />
          </CardContent>
        </Card>
      </div>

      {/* Delete Confirmation Modal */}
      <DeleteConfirmationModal
        isOpen={deleteModalData.isOpen}
        onClose={() => setDeleteModalData({ ...deleteModalData, isOpen: false })}
        onConfirm={handleDeleteConfirm}
        title="Delete Product"
        message="Are you sure you want to delete the product"
        itemName={deleteModalData.name}
        isDeleting={isDeleting}
      />
    </div>
  )
}
