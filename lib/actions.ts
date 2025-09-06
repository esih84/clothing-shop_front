"use server";

// Product types
export interface Product {
  sales: number;
  id: string;
  title: string;
  price: number;
  originalPrice?: number;
  discount?: number;
  rating: number;
  description: string;
  brand: {
    name: string;
    handle: string;
  };
  store: {
    id: string;
    name: string;
    logo: string;
    rating: number;
    followers: number;
  };
  images: string[];
  sizes: string[];
  colors?: string[];
  category: string;
  reviews: number;
  inStock: boolean;
}

export interface CartItem {
  id: string;
  name: string;
  size: string;
  price: number;
  quantity: number;
  imageUrl: string;
}

export interface WishlistItem {
  id: string;
  name: string;
  price: number;
  imageUrl: string;
  brand: string;
  location: string;
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
    description:
      "Kandinsky license jacket with adjustable drawstring, ribbed sleeves and hem and contrast graphics.",
    brand: {
      name: "P&B",
      handle: "@pull&bearofficial",
    },
    store: {
      id: "store1",
      name: "Fashion Boutique",
      logo: "/placeholder.svg?height=50&width=50&text=FB",
      rating: 4.9,
      followers: 12500,
    },
    images: [
      "/placeholder.svg?height=500&width=400&text=P&B",
      "/placeholder.svg?height=500&width=400&text=Image+2",
      "/placeholder.svg?height=500&width=400&text=Image+3",
      "/placeholder.svg?height=500&width=400&text=Image+4",
    ],
    sizes: ["S", "M", "L", "XL"],
    colors: ["Black", "Blue", "White"],
    category: "Jacket",
    reviews: 1500,
    inStock: true,
    sales: 200,
  },
  {
    id: "2",
    title: "ZARA United Arab jacket",
    price: 24.34,
    originalPrice: 32.99,
    discount: 30,
    rating: 4.5,
    description:
      "Premium quality jacket with modern design, perfect for casual outings.",
    brand: {
      name: "ZARA",
      handle: "@zarauae",
    },
    store: {
      id: "store2",
      name: "Urban Styles",
      logo: "/placeholder.svg?height=50&width=50&text=US",
      rating: 4.7,
      followers: 9800,
    },
    images: [
      "/placeholder.svg?height=500&width=400&text=ZARA",
      "/placeholder.svg?height=500&width=400&text=Image+2",
      "/placeholder.svg?height=500&width=400&text=Image+3",
    ],
    sizes: ["S", "M", "L", "XL", "XXL"],
    colors: ["Navy", "Gray", "Black"],
    category: "Jacket",
    reviews: 1000,
    inStock: true,
    sales: 200,
  },
  {
    id: "3",
    title: "H&M Winter Collection",
    price: 32.99,
    rating: 4.3,
    description:
      "Warm and stylish winter jacket with premium insulation and water-resistant exterior.",
    brand: {
      name: "H&M",
      handle: "@hm",
    },
    store: {
      id: "store3",
      name: "Trendy Threads",
      logo: "/placeholder.svg?height=50&width=50&text=TT",
      rating: 4.6,
      followers: 11200,
    },
    images: [
      "/placeholder.svg?height=500&width=400&text=H%26M",
      "/placeholder.svg?height=500&width=400&text=Image+2",
      "/placeholder.svg?height=500&width=400&text=Image+3",
    ],
    sizes: ["XS", "S", "M", "L"],
    colors: ["Brown", "Green", "Black"],
    category: "Jacket",
    reviews: 1300,
    inStock: true,
    sales: 200,
  },
  {
    id: "4",
    title: "Uniqlo Basic Tee",
    price: 19.9,
    originalPrice: 24.99,
    discount: 20,
    rating: 4.6,
    description:
      "Premium cotton t-shirt with minimalist design, perfect for everyday wear.",
    brand: {
      name: "Uniqlo",
      handle: "@uniqlo",
    },
    store: {
      id: "store1",
      name: "Fashion Boutique",
      logo: "/placeholder.svg?height=50&width=50&text=FB",
      rating: 4.9,
      followers: 12500,
    },
    images: [
      "/placeholder.svg?height=500&width=400&text=Uniqlo",
      "/placeholder.svg?height=500&width=400&text=Image+2",
    ],
    sizes: ["S", "M", "L", "XL"],
    colors: ["White", "Black", "Gray"],
    category: "T-Shirt",
    reviews: 900,
    inStock: true,
    sales: 200,
  },
  {
    id: "5",
    title: "Nike Air Max Sneakers",
    price: 89.99,
    originalPrice: 129.99,
    discount: 30,
    rating: 4.9,
    description:
      "Iconic Air Max sneakers with superior cushioning and stylish design.",
    brand: {
      name: "Nike",
      handle: "@nike",
    },
    store: {
      id: "store2",
      name: "Urban Styles",
      logo: "/placeholder.svg?height=50&width=50&text=US",
      rating: 4.7,
      followers: 9800,
    },
    images: [
      "/placeholder.svg?height=500&width=400&text=Nike",
      "/placeholder.svg?height=500&width=400&text=Image+2",
    ],
    sizes: ["7", "8", "9", "10", "11"],
    colors: ["White", "Black", "Red"],
    category: "Sneakers",
    reviews: 2500,
    inStock: true,
    sales: 200,
  },
  {
    id: "6",
    title: "Levi's 501 Original Jeans",
    price: 59.99,
    originalPrice: 79.99,
    discount: 25,
    rating: 4.7,
    description:
      "Classic straight-fit jeans with timeless design and durable construction.",
    brand: {
      name: "Levi's",
      handle: "@levis",
    },
    store: {
      id: "store3",
      name: "Trendy Threads",
      logo: "/placeholder.svg?height=50&width=50&text=TT",
      rating: 4.6,
      followers: 11200,
    },
    images: [
      "/placeholder.svg?height=500&width=400&text=Levis",
      "/placeholder.svg?height=500&width=400&text=Image+2",
    ],
    sizes: ["28", "30", "32", "34", "36"],
    colors: ["Blue", "Black", "Gray"],
    category: "Jeans",
    reviews: 1800,
    inStock: true,
    sales: 200,
  },
  {
    id: "7",
    title: "Pull & Bear Men's Fall Urban Collection",
    price: 26.15,
    originalPrice: 34.99,
    discount: 25,
    rating: 4.8,
    description:
      "Kandinsky license jacket with adjustable drawstring, ribbed sleeves and hem and contrast graphics.",
    brand: {
      name: "P&B",
      handle: "@pull&bearofficial",
    },
    store: {
      id: "store1",
      name: "Fashion Boutique",
      logo: "/placeholder.svg?height=50&width=50&text=FB",
      rating: 4.9,
      followers: 12500,
    },
    images: [
      "/placeholder.svg?height=500&width=400&text=P&B",
      "/placeholder.svg?height=500&width=400&text=Image+2",
      "/placeholder.svg?height=500&width=400&text=Image+3",
      "/placeholder.svg?height=500&width=400&text=Image+4",
    ],
    sizes: ["S", "M", "L", "XL"],
    colors: ["Black", "Blue", "White"],
    category: "Jacket",
    reviews: 1500,
    inStock: true,
    sales: 200,
  },
  {
    id: "8",
    title: "ZARA United Arab jacket",
    price: 24.34,
    originalPrice: 32.99,
    discount: 30,
    rating: 4.5,
    description:
      "Premium quality jacket with modern design, perfect for casual outings.",
    brand: {
      name: "ZARA",
      handle: "@zarauae",
    },
    store: {
      id: "store2",
      name: "Urban Styles",
      logo: "/placeholder.svg?height=50&width=50&text=US",
      rating: 4.7,
      followers: 9800,
    },
    images: [
      "/placeholder.svg?height=500&width=400&text=ZARA",
      "/placeholder.svg?height=500&width=400&text=Image+2",
      "/placeholder.svg?height=500&width=400&text=Image+3",
    ],
    sizes: ["S", "M", "L", "XL", "XXL"],
    colors: ["Navy", "Gray", "Black"],
    category: "Jacket",
    reviews: 1000,
    inStock: true,
    sales: 200,
  },
  {
    id: "9",
    title: "H&M Winter Collection",
    price: 32.99,
    rating: 4.3,
    description:
      "Warm and stylish winter jacket with premium insulation and water-resistant exterior.",
    brand: {
      name: "H&M",
      handle: "@hm",
    },
    store: {
      id: "store3",
      name: "Trendy Threads",
      logo: "/placeholder.svg?height=50&width=50&text=TT",
      rating: 4.6,
      followers: 11200,
    },
    images: [
      "/placeholder.svg?height=500&width=400&text=H%26M",
      "/placeholder.svg?height=500&width=400&text=Image+2",
      "/placeholder.svg?height=500&width=400&text=Image+3",
    ],
    sizes: ["XS", "S", "M", "L"],
    colors: ["Brown", "Green", "Black"],
    category: "Jacket",
    reviews: 1300,
    inStock: true,
    sales: 200,
  },
  {
    id: "10",
    title: "Uniqlo Basic Tee",
    price: 19.9,
    originalPrice: 24.99,
    discount: 20,
    rating: 4.6,
    description:
      "Premium cotton t-shirt with minimalist design, perfect for everyday wear.",
    brand: {
      name: "Uniqlo",
      handle: "@uniqlo",
    },
    store: {
      id: "store1",
      name: "Fashion Boutique",
      logo: "/placeholder.svg?height=50&width=50&text=FB",
      rating: 4.9,
      followers: 12500,
    },
    images: [
      "/placeholder.svg?height=500&width=400&text=Uniqlo",
      "/placeholder.svg?height=500&width=400&text=Image+2",
    ],
    sizes: ["S", "M", "L", "XL"],
    colors: ["White", "Black", "Gray"],
    category: "T-Shirt",
    reviews: 900,
    inStock: true,
    sales: 200,
  },
  {
    id: "11",
    title: "Nike Air Max Sneakers",
    price: 89.99,
    originalPrice: 129.99,
    discount: 30,
    rating: 4.9,
    description:
      "Iconic Air Max sneakers with superior cushioning and stylish design.",
    brand: {
      name: "Nike",
      handle: "@nike",
    },
    store: {
      id: "store2",
      name: "Urban Styles",
      logo: "/placeholder.svg?height=50&width=50&text=US",
      rating: 4.7,
      followers: 9800,
    },
    images: [
      "/placeholder.svg?height=500&width=400&text=Nike",
      "/placeholder.svg?height=500&width=400&text=Image+2",
    ],
    sizes: ["7", "8", "9", "10", "11"],
    colors: ["White", "Black", "Red"],
    category: "Sneakers",
    reviews: 2500,
    inStock: true,
    sales: 200,
  },
  {
    id: "12",
    title: "Levi's 501 Original Jeans",
    price: 59.99,
    originalPrice: 79.99,
    discount: 25,
    rating: 4.7,
    description:
      "Classic straight-fit jeans with timeless design and durable construction.",
    brand: {
      name: "Levi's",
      handle: "@levis",
    },
    store: {
      id: "store3",
      name: "Trendy Threads",
      logo: "/placeholder.svg?height=50&width=50&text=TT",
      rating: 4.6,
      followers: 11200,
    },
    images: [
      "/placeholder.svg?height=500&width=400&text=Levis",
      "/placeholder.svg?height=500&width=400&text=Image+2",
    ],
    sizes: ["28", "30", "32", "34", "36"],
    colors: ["Blue", "Black", "Gray"],
    category: "Jeans",
    reviews: 1800,
    inStock: true,
    sales: 200,
  },
];

// Banner data
export interface Banner {
  id: string;
  title: string;
  subtitle: string;
  imageUrl: string;
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
];

// Category data
export interface Category {
  id: string;
  name: string;
}

const categories: Category[] = [
  { id: "jackets", name: "Jacket" },
  { id: "jumpers", name: "Jumpers" },
  { id: "shoes", name: "Shoes" },
  { id: "jeans", name: "Jeans" },
  { id: "shirts", name: "Shirts" },
  { id: "accessories", name: "Accessories" },
  { id: "hats", name: "Hats" },
];

// Store data
export interface Store {
  id: string;
  name: string;
  description: string;
  logo: string;
  coverImage: string;
  rating: number;
  followers: number;
  products: number;
  address: string;
  established: string;
  categories: string[];
}

const stores: Store[] = [
  {
    id: "store1",
    name: "Fashion Boutique",
    description:
      "Premium fashion store offering the latest trends and styles for all seasons.",
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
];
export interface Blog {
  id: string;
  title: string;
  excerpt: string;
  date: string;
  comments: number;
  imageUrl: string;
  readTime: string;
  category: string;
}
[];
const blogs: Blog[] = [
  {
    id: "1",
    title: "Summer Fashion Trends 2025",
    excerpt:
      "Discover the hottest fashion trends for the upcoming summer season.",
    date: "Apr 28, 2025",
    comments: 12,
    imageUrl: "/placeholder.svg?height=120&width=120",
    readTime: "2",
    category: "Sustainability",
  },
  {
    id: "2",
    title: "How to Style Minimalist Outfits",
    excerpt:
      "Learn the art of creating stylish minimalist outfits with fewer pieces.",
    date: "Apr 20, 2025",
    comments: 8,
    imageUrl: "/placeholder.svg?height=120&width=120",
    readTime: "4",
    category: "Fashion Trends",
  },
  {
    id: "3",
    title: "Sustainable Fashion: A Guide",
    excerpt:
      "Everything you need to know about sustainable and ethical fashion choices.",
    date: "Apr 15, 2025",
    comments: 15,
    imageUrl: "/placeholder.svg?height=120&width=120",
    readTime: "10",
    category: "Fashion Trends",
  },
];

// Server actions
export async function getProduct(id: string): Promise<Product | null> {
  // Simulate network delay
  await new Promise((resolve) => setTimeout(resolve, 500));

  const product = products.find((p) => p.id === id);
  return product || null;
}

export async function getProducts(): Promise<Product[]> {
  // Simulate network delay
  await new Promise((resolve) => setTimeout(resolve, 500));

  return products;
}

export async function getDiscountedProducts(): Promise<Product[]> {
  // Simulate network delay
  await new Promise((resolve) => setTimeout(resolve, 300));

  // Filter products that have a discount
  return products.filter((product) => product.discount && product.discount > 0);
}

export async function getBanners(): Promise<Banner[]> {
  // Simulate network delay
  await new Promise((resolve) => setTimeout(resolve, 300));

  return banners;
}

export async function getCategories(): Promise<Category[]> {
  // Simulate network delay
  await new Promise((resolve) => setTimeout(resolve, 200));

  return categories;
}

export async function getStore(id: string): Promise<Store | null> {
  // Simulate network delay
  await new Promise((resolve) => setTimeout(resolve, 500));

  const store = stores.find((s) => s.id === id);
  return store || null;
}

export async function getStores(): Promise<Store[]> {
  // Simulate network delay
  await new Promise((resolve) => setTimeout(resolve, 400));

  return stores;
}

export async function getStoreProducts(storeId: string): Promise<Product[]> {
  // Simulate network delay
  await new Promise((resolve) => setTimeout(resolve, 500));

  return products.filter((product) => product.store.id === storeId);
}

export async function getBlogs(): Promise<Blog[]> {
  // Simulate network delay
  await new Promise((resolve) => setTimeout(resolve, 500));

  return blogs;
}
