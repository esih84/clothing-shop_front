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
    title: "کلکسیون شهری پاییزه مردانه پول اند بیر",
    price: 26.15,
    originalPrice: 34.99,
    discount: 25,
    rating: 4.8,
    description:
      "ژاکت با طراحی کاندینسکی با بند قابل تنظیم، آستین و لبه دنده‌دار و گرافیک‌های کنتراست.",
    brand: {
      name: "P&B",
      handle: "@pull&bearofficial",
    },
    store: {
      id: "store1",
      name: "بوتیک مد",
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
    title: "کت اماراتی زارا",
    price: 24.34,
    originalPrice: 32.99,
    discount: 30,
    rating: 4.5,
    description:
      "کت با کیفیت برتر با طراحی مدرن، مناسب برای استفاده روزمره.",
    brand: {
      name: "ZARA",
      handle: "@zarauae",
    },
    store: {
      id: "store2",
      name: "استایل شهری",
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
    title: "کلکسیون زمستانه اچ اند ام",
    price: 32.99,
    rating: 4.3,
    description:
      "کت گرم و شیک با عایق برتر و رویه ضد آب.",
    brand: {
      name: "H&M",
      handle: "@hm",
    },
    store: {
      id: "store3",
      name: "پارچه‌های روز مد",
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
    title: "تی‌شرت ساده یونیکلو",
    price: 19.9,
    originalPrice: 24.99,
    discount: 20,
    rating: 4.6,
    description:
      "تی‌شرت نخ پنبه با طراحی مینیمالیست، مناسب برای استفاده روزانه.",
    brand: {
      name: "Uniqlo",
      handle: "@uniqlo",
    },
    store: {
      id: "store1",
      name: "بوتیک مد",
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
    title: "کتانی نایکی ایر مکس",
    price: 89.99,
    originalPrice: 129.99,
    discount: 30,
    rating: 4.9,
    description:
      "کتانی ایر مکس آیکونیک با کوشن برتر و طراحی شیک.",
    brand: {
      name: "Nike",
      handle: "@nike",
    },
    store: {
      id: "store2",
      name: "استایل شهری",
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
    title: "شلوار جین اریجینال لیوایز ۵۰۱",
    price: 59.99,
    originalPrice: 79.99,
    discount: 25,
    rating: 4.7,
    description:
      "شلوار جین ست مستقیم با طراحی کلاسیک و ساخت بادوام.",
    brand: {
      name: "Levi's",
      handle: "@levis",
    },
    store: {
      id: "store3",
      name: "پارچه‌های روز مد",
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
    title: "کلکسیون شهری پاییزه مردانه پول اند بیر",
    price: 26.15,
    originalPrice: 34.99,
    discount: 25,
    rating: 4.8,
    description:
      "ژاکت با طراحی کاندینسکی با بند قابل تنظیم، آستین و لبه دنده‌دار و گرافیک‌های کنتراست.",
    brand: {
      name: "P&B",
      handle: "@pull&bearofficial",
    },
    store: {
      id: "store1",
      name: "بوتیک مد",
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
    colors: ["مشکی", "آبی", "سفید"],
    category: "کت",
    reviews: 1500,
    inStock: true,
    sales: 200,
  },
  {
    id: "8",
    title: "کت اماراتی زارا",
    price: 24.34,
    originalPrice: 32.99,
    discount: 30,
    rating: 4.5,
    description:
      "کت با کیفیت برتر با طراحی مدرن، مناسب برای استفاده روزمره.",
    brand: {
      name: "ZARA",
      handle: "@zarauae",
    },
    store: {
      id: "store2",
      name: "استایل شهری",
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
    colors: ["سرمه‌ای", "خاکستری", "مشکی"],
    category: "کت",
    reviews: 1000,
    inStock: true,
    sales: 200,
  },
  {
    id: "9",
    title: "کلکسیون زمستانه اچ اند ام",
    price: 32.99,
    rating: 4.3,
    description:
      "کت گرم و شیک با عایق برتر و رویه ضد آب.",
    brand: {
      name: "H&M",
      handle: "@hm",
    },
    store: {
      id: "store3",
      name: "پارچه‌های روز مد",
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
    colors: ["قهوه‌ای", "سبز", "مشکی"],
    category: "کت",
    reviews: 1300,
    inStock: true,
    sales: 200,
  },
  {
    id: "10",
    title: "تی‌شرت ساده یونیکلو",
    price: 19.9,
    originalPrice: 24.99,
    discount: 20,
    rating: 4.6,
    description:
      "تی‌شرت نخ پنبه با طراحی مینیمالیست، مناسب برای استفاده روزانه.",
    brand: {
      name: "Uniqlo",
      handle: "@uniqlo",
    },
    store: {
      id: "store1",
      name: "بوتیک مد",
      logo: "/placeholder.svg?height=50&width=50&text=FB",
      rating: 4.9,
      followers: 12500,
    },
    images: [
      "/placeholder.svg?height=500&width=400&text=Uniqlo",
      "/placeholder.svg?height=500&width=400&text=Image+2",
    ],
    sizes: ["S", "M", "L", "XL"],
    colors: ["سفید", "مشکی", "خاکستری"],
    category: "تی‌شرت",
    reviews: 900,
    inStock: true,
    sales: 200,
  },
  {
    id: "11",
    title: "کتانی نایکی ایر مکس",
    price: 89.99,
    originalPrice: 129.99,
    discount: 30,
    rating: 4.9,
    description:
      "کتانی ایر مکس آیکونیک با کوشن برتر و طراحی شیک.",
    brand: {
      name: "Nike",
      handle: "@nike",
    },
    store: {
      id: "store2",
      name: "استایل شهری",
      logo: "/placeholder.svg?height=50&width=50&text=US",
      rating: 4.7,
      followers: 9800,
    },
    images: [
      "/placeholder.svg?height=500&width=400&text=Nike",
      "/placeholder.svg?height=500&width=400&text=Image+2",
    ],
    sizes: ["7", "8", "9", "10", "11"],
    colors: ["سفید", "مشکی", "قرمز"],
    category: "کفش",
    reviews: 2500,
    inStock: true,
    sales: 200,
  },
  {
    id: "12",
    title: "شلوار جین اریجینال لیوایز ۵۰۱",
    price: 59.99,
    originalPrice: 79.99,
    discount: 25,
    rating: 4.7,
    description:
      "شلوار جین ست مستقیم با طراحی کلاسیک و ساخت بادوام.",
    brand: {
      name: "Levi's",
      handle: "@levis",
    },
    store: {
      id: "store3",
      name: "پارچه‌های روز مد",
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
    title: "کلکسیون مد مردانه",
    subtitle: "تا ۶۰٪ تخفیف",
    imageUrl: "/placeholder.svg?height=150&width=400",
  },
  {
    id: "2",
    title: "اساسیات تابستانه",
    subtitle: "محصولات جدید با ارسال رایگان",
    imageUrl: "/placeholder.svg?height=150&width=400&text=Summer+Collection",
  },
  {
    id: "3",
    title: "اکسسوری اختصاصی",
    subtitle: "پیشنهادات محدود",
    imageUrl: "/placeholder.svg?height=150&width=400&text=Accessories",
  },
];

// Category data
export interface Category {
  id: string;
  name: string;
}

const categories: Category[] = [
  { id: "jackets", name: "کت" },
  { id: "jumpers", name: "پلیور" },
  { id: "shoes", name: "کفش" },
  { id: "jeans", name: "شلوار جین" },
  { id: "shirts", name: "پیراهن" },
  { id: "accessories", name: "اکسسوری" },
  { id: "hats", name: "کلاه" },
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
    name: "بوتیک مد",
    description:
      "فروشگاه مد برتر که آخرین ترندها و استایل‌ها را برای همه فصل‌ها ارائه می‌دهد.",
    logo: "/placeholder.svg?height=100&width=100&text=FB",
    coverImage: "/placeholder.svg?height=300&width=800&text=Fashion+Boutique",
    rating: 4.9,
    followers: 12500,
    products: 342,
    address: "خیابان مد ۱۲۳، شهر استایل",
    established: "2015",
    categories: ["پوشاک مردانه", "پوشاک زنانه", "اکسسوری"],
  },
  {
    id: "store2",
    name: "استایل شهری",
    description: "مد شهری معاصر برای سبک زندگی مدرن.",
    logo: "/placeholder.svg?height=100&width=100&text=US",
    coverImage: "/placeholder.svg?height=300&width=800&text=Urban+Styles",
    rating: 4.7,
    followers: 9800,
    products: 215,
    address: "خیابان شهری ۴۵۶، متروپلیس",
    established: "2018",
    categories: ["استریت‌ور", "کژوال", "کفش"],
  },
  {
    id: "store3",
    name: "پارچه‌های روز مد",
    description: "مد پیشرو برای کسانی که می‌خواهند متفاوت باشند.",
    logo: "/placeholder.svg?height=100&width=100&text=TT",
    coverImage: "/placeholder.svg?height=300&width=800&text=Trendy+Threads",
    rating: 4.6,
    followers: 11200,
    products: 278,
    address: "بلوار ترند ۷۸۹، دره مد",
    established: "2016",
    categories: ["دیزاینر", "برتر", "فصلی"],
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
export interface BlogComment {
  id: string;
  author: string;
  content: string;
  date: string;
}

export interface Blog {
  id: string;
  title: string;
  excerpt: string;
  date: string;
  comments: number;
  imageUrl: string;
  readTime: string;
  category: string;
  commentsList?: BlogComment[];
}

const blogs: Blog[] = [
  {
    id: "1",
    title: "ترندهای مد تابستان ۲۰۲۵",
    excerpt:
      "آخرین ترندهای مد فصل تابستان پیش رو را کشف کنید.",
    date: "Apr 28, 2025",
    comments: 12,
    imageUrl: "/placeholder.svg?height=120&width=120",
    readTime: "2",
    category: "پایداری",
    commentsList: [
      {
        id: "c1",
        author: "سارا",
        content: "مطلب خیلی مفیدی بود، ممنون!",
        date: "2025-04-29",
      },
      {
        id: "c2",
        author: "علی",
        content: "منتظر ترندهای بیشتری هستیم.",
        date: "2025-04-30",
      },
    ],
  },
  {
    id: "2",
    title: "چطور لباس مینیمالیستی بپوشیم",
    excerpt:
      "هنر ساختن لباس مینیمالیستی با قطعات کمتر را بیاموزید.",
    date: "Apr 20, 2025",
    comments: 8,
    imageUrl: "/placeholder.svg?height=120&width=120",
    readTime: "4",
    category: "ترندهای مد",
    commentsList: [
      {
        id: "c3",
        author: "مریم",
        content: "خیلی کاربردی بود!",
        date: "2025-04-21",
      },
    ],
  },
  {
    id: "3",
    title: "مد پایدار: راهنمای جامع",
    excerpt:
      "هر آنچه باید درباره انتخاب‌های مد پایدار و اخلاقی بدانید.",
    date: "Apr 15, 2025",
    comments: 15,
    imageUrl: "/placeholder.svg?height=120&width=120",
    readTime: "10",
    category: "ترندهای مد",
    commentsList: [
      {
        id: "c4",
        author: "رضا",
        content: "مد پایدار واقعا مهمه، عالی بود!",
        date: "2025-04-16",
      },
    ],
  },
];

// Server actions
export async function getProduct(id: string): Promise<Product | null> {
  // Simulate network delay
  await new Promise((resolve) => setTimeout(resolve, 500));

  const product = products.find((p) => p.id === id);
  return product || null;
}

// lib/actions.ts
export async function getProducts(page = 1, limit = 4): Promise<{ products: Product[]; hasMore: boolean }> {
  const start = (page - 1) * limit
  const slice = products.slice(start, start + limit)
  return { products: slice, hasMore: start + limit < products.length }
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
  await new Promise((resolve) => setTimeout(resolve, 500));

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
