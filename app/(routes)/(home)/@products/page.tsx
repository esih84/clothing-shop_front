import { ProductCard } from "@/components/product-card"

// Mock product data
const products = [
  {
    id: "1",
    title: "Rode Microphone",
    price: 545.0,
    imageUrl: "/placeholder.svg?height=300&width=300",
    rating: 4.5,
    reviews: 5376,
    sales: 1000,
  },
  {
    id: "2",
    title: "Fujifilm Camera",
    price: 890.0,
    imageUrl: "/placeholder.svg?height=300&width=300",
    rating: 4.6,
    reviews: 7489,
    sales: 2500,
  },
  {
    id: "3",
    title: "Silent Headphones",
    price: 435.0,
    imageUrl: "/placeholder.svg?height=300&width=300",
    rating: 4.3,
    reviews: 3197,
    sales: 1500,
  },
  {
    id: "4",
    title: "Airtight Microphone",
    price: 70.0,
    imageUrl: "/placeholder.svg?height=300&width=300",
    rating: 4.7,
    reviews: 8178,
    sales: 3000,
  },
  {
    id: "5",
    title: "Canon DSLR Camera",
    price: 1200.0,
    imageUrl: "/placeholder.svg?height=300&width=300",
    rating: 4.8,
    reviews: 9245,
    sales: 4200,
  },
  {
    id: "6",
    title: "Wireless Earbuds",
    price: 120.0,
    imageUrl: "/placeholder.svg?height=300&width=300",
    rating: 4.4,
    reviews: 6123,
    sales: 8500,
  },
]

export default async function ProductsSection() {
  // Simulate async data fetching
  await new Promise((resolve) => setTimeout(resolve, 100))

  return (
    <div className="px-4 py-6 mx-auto">
      <h2 className="text-xl md:text-2xl md:font-lg font-bold mb-4 md:mb-6">Featured Products</h2>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {products.map((product) => (
          <ProductCard
            key={product.id}
            id={product.id}
            title={product.title}
            price={product.price}
            imageUrl={product.imageUrl}
            rating={product.rating}
            reviews={product.reviews}
            sales={product.sales}
          />
        ))}
      </div>
    </div>
  )
}
