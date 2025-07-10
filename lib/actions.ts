"use server"

// Product types
export interface Product {
  id: string
  title: string
  price: number
  originalPrice?: number // Original price before discount
  discount?: number // Optional discount percentage
  images: string[]
  category: string
  brand: string
  rating: number
  reviews: number
  inStock: boolean
  description: string
}

export interface CartItem {
  id: string
  name: string
  size: string
  price: number
  quantity: number
  imageUrl: string
}

export interface WishlistItem {
  id: string
  name: string
  price: number
  imageUrl: string
  brand: string
  location: string
}

// Mock data store
const products: Product[] = [
  {
    id: "1",
    title: "Pull & Bear Men's Fall Urban Collection",
    price: 26.15,
    originalPrice: 34.99,
    discount: 25,
    rating: 4.8,
    description: "Kandinsky license jacket with adjustable drawstring, ribbed sleeves and hem and contrast graphics.",
    brand: "P&B",
    category: "Jacket",
    images: [
      "/placeholder.svg?height=500&width=400",
      "/placeholder.svg?height=500&width=400&text=Image+2",
      "/placeholder.svg?height=500&width=400&text=Image+3",
      "/placeholder.svg?height=500&width=400&text=Image+4",
    ],
    reviews: 1500,
    inStock: true,
  },
  {
    id: "2",
    title: "ZARA United Arab jacket",
    price: 24.34,
    originalPrice: 32.99,
    discount: 30,
    rating: 4.5,
    description: "Premium quality jacket with modern design, perfect for casual outings.",
    brand: "ZARA",
    category: "Jacket",
    images: [
      "/placeholder.svg?height=500&width=400&text=ZARA",
      "/placeholder.svg?height=500&width=400&text=Image+2",
      "/placeholder.svg?height=500&width=400&text=Image+3",
    ],
    reviews: 1000,
    inStock: true,
  },
  {
    id: "3",
    title: "H&M Winter Collection",
    price: 32.99,
    rating: 4.3,
    description: "Warm and stylish winter jacket with premium insulation and water-resistant exterior.",
    brand: "H&M",
    category: "Jacket",
    images: [
      "/placeholder.svg?height=500&width=400&text=H%26M",
      "/placeholder.svg?height=500&width=400&text=Image+2",
      "/placeholder.svg?height=500&width=400&text=Image+3",
    ],
    reviews: 1300,
    inStock: true,
  },
  {
    id: "4",
    title: "Uniqlo Basic Tee",
    price: 19.9,
    originalPrice: 24.99,
    discount: 20,
    rating: 4.6,
    description: "Premium cotton t-shirt with minimalist design, perfect for everyday wear.",
    brand: "Uniqlo",
    category: "T-Shirt",
    images: ["/placeholder.svg?height=500&width=400&text=Uniqlo", "/placeholder.svg?height=500&width=400&text=Image+2"],
    reviews: 900,
    inStock: true,
  },
  {
    id: "5",
    title: "Nike Air Max Sneakers",
    price: 89.99,
    originalPrice: 129.99,
    discount: 30,
    rating: 4.9,
    description: "Iconic Air Max sneakers with superior cushioning and stylish design.",
    brand: "Nike",
    category: "Sneakers",
    images: ["/placeholder.svg?height=500&width=400&text=Nike", "/placeholder.svg?height=500&width=400&text=Image+2"],
    reviews: 2500,
    inStock: true,
  },
  {
    id: "6",
    title: "Levi's 501 Original Jeans",
    price: 59.99,
    originalPrice: 79.99,
    discount: 25,
    rating: 4.7,
    description: "Classic straight-fit jeans with timeless design and durable construction.",
    brand: "Levi's",
    category: "Jeans",
    images: ["/placeholder.svg?height=500&width=400&text=Levis", "/placeholder.svg?height=500&width=400&text=Image+2"],
    reviews: 1800,
    inStock: true,
  },
]

// Mock data for products
const mockProducts = [
  {
    id: "1",
    title: "Premium Headphones",
    price: 299.99,
    originalPrice: 399.99,
    discount: 25,
    images: ["/placeholder.svg?height=300&width=300"],
    category: "Electronics",
    brand: "AudioTech",
    rating: 4.5,
    reviews: 1250,
    inStock: true,
    description: "High-quality wireless headphones with noise cancellation",
  },
  {
    id: "2",
    title: "Smart Watch",
    price: 199.99,
    originalPrice: 249.99,
    discount: 20,
    images: ["/placeholder.svg?height=300&width=300"],
    category: "Electronics",
    brand: "TechWear",
    rating: 4.3,
    reviews: 890,
    inStock: true,
    description: "Feature-rich smartwatch with health monitoring",
  },
  {
    id: "3",
    title: "Wireless Speaker",
    price: 79.99,
    originalPrice: 99.99,
    discount: 20,
    images: ["/placeholder.svg?height=300&width=300"],
    category: "Electronics",
    brand: "SoundMax",
    rating: 4.7,
    reviews: 2100,
    inStock: true,
    description: "Portable Bluetooth speaker with excellent sound quality",
  },
  {
    id: "4",
    title: "Gaming Mouse",
    price: 49.99,
    originalPrice: 69.99,
    discount: 29,
    images: ["/placeholder.svg?height=300&width=300"],
    category: "Electronics",
    brand: "GamePro",
    rating: 4.6,
    reviews: 750,
    inStock: true,
    description: "High-precision gaming mouse with RGB lighting",
  },
]

// Banner data
export interface Banner {
  id: string
  title: string
  subtitle: string
  imageUrl: string
}

const banners: Banner[] = [
  {
    id: "1",
    title: "Men's Fashion Collection",
    subtitle: "Discount up to 60%",
    imageUrl: "/placeholder.svg?height=150&width=400",
  },
  {
    id: "2",
    title: "Summer Essentials",
    subtitle: "New arrivals with free shipping",
    imageUrl: "/placeholder.svg?height=150&width=400&text=Summer+Collection",
  },
  {
    id: "3",
    title: "Exclusive Accessories",
    subtitle: "Limited time offers",
    imageUrl: "/placeholder.svg?height=150&width=400&text=Accessories",
  },
]

// Category data
export interface Category {
  id: string
  name: string
}

const categories: Category[] = [
  { id: "jackets", name: "Jacket" },
  { id: "jumpers", name: "Jumpers" },
  { id: "shoes", name: "Shoes" },
  { id: "jeans", name: "Jeans" },
  { id: "shirts", name: "Shirts" },
  { id: "accessories", name: "Accessories" },
  { id: "hats", name: "Hats" },
  { id: "electronics", name: "Electronics" },
]

// Store data
export interface Store {
  id: string
  name: string
  description: string
  logo: string
  coverImage: string
  rating: number
  followers: number
  products: number
  address: string
  established: string
  categories: string[]
}

const stores: Store[] = [
  {
    id: "store1",
    name: "Fashion Boutique",
    description: "Premium fashion store offering the latest trends and styles for all seasons.",
    logo: "/placeholder.svg?height=100&width=100&text=FB",
    coverImage: "/placeholder.svg?height=300&width=800&text=Fashion+Boutique",
    rating: 4.9,
    followers: 12500,
    products: 342,
    address: "123 Fashion St, Style City",
    established: "2015",
    categories: ["Men's Wear", "Women's Wear", "Accessories"],
  },
  {
    id: "store2",
    name: "Urban Styles",
    description: "Contemporary urban fashion for the modern lifestyle.",
    logo: "/placeholder.svg?height=100&width=100&text=US",
    coverImage: "/placeholder.svg?height=300&width=800&text=Urban+Styles",
    rating: 4.7,
    followers: 9800,
    products: 215,
    address: "456 Urban Ave, Metro City",
    established: "2018",
    categories: ["Street Wear", "Casual", "Footwear"],
  },
  {
    id: "store3",
    name: "Trendy Threads",
    description: "Cutting-edge fashion for those who want to stand out.",
    logo: "/placeholder.svg?height=100&width=100&text=TT",
    coverImage: "/placeholder.svg?height=300&width=800&text=Trendy+Threads",
    rating: 4.6,
    followers: 11200,
    products: 278,
    address: "789 Trend Blvd, Fashion Valley",
    established: "2016",
    categories: ["Designer", "Premium", "Seasonal"],
  },
]

// Server actions
export async function getProduct(id: string): Promise<Product | null> {
  // Simulate network delay
  await new Promise((resolve) => setTimeout(resolve, 100))

  const product = [...products, ...mockProducts].find((p) => p.id === id)
  return product || null
}

export async function getProducts(page = 1, limit = 6): Promise<Product[]> {
  // Simulate network delay
  await new Promise((resolve) => setTimeout(resolve, 100))

  const start = (page - 1) * limit
  const end = start + limit

  return [...products, ...mockProducts].slice(start, end)
}

export async function getDiscountedProducts(): Promise<Product[]> {
  // Simulate network delay
  await new Promise((resolve) => setTimeout(resolve, 100))

  // Filter products that have a discount
  return [...products, ...mockProducts].filter((product) => product.discount && product.discount > 0)
}

export async function getBanners(): Promise<Banner[]> {
  // Simulate network delay
  await new Promise((resolve) => setTimeout(resolve, 300))

  return banners
}

export async function getCategories(): Promise<Category[]> {
  // Simulate network delay
  await new Promise((resolve) => setTimeout(resolve, 200))

  return categories
}

export async function getStore(id: string): Promise<Store | null> {
  // Simulate network delay
  await new Promise((resolve) => setTimeout(resolve, 500))

  const store = stores.find((s) => s.id === id)
  return store || null
}

export async function getStores(): Promise<Store[]> {
  // Simulate network delay
  await new Promise((resolve) => setTimeout(resolve, 400))

  return stores
}

export async function getStoreProducts(storeId: string): Promise<Product[]> {
  // Simulate network delay
  await new Promise((resolve) => setTimeout(resolve, 500))

  return products.filter((product) => product.store.id === storeId)
}
