import { getStore, getStoreProducts } from "@/lib/actions"
import { Star, MapPin, Calendar, Package, Users } from "lucide-react"
import Image from "next/image"
import { ProductCard } from "@/components/product-card"
import { notFound } from "next/navigation"

export default async function StorePage({ params }: { params: { id: string } }) {
  const store = await getStore(params.id)

  if (!store) {
    notFound()
  }

  const products = await getStoreProducts(params.id)

  return (
    <div className="pb-20  mx-auto">
      {/* Store Cover Image */}
      <div className="relative h-40 sm:h-48 md:h-56 w-full">
        <Image src={store.coverImage || "/placeholder.svg"} alt={store.name} fill className="object-cover" />
      </div>

      {/* Store Profile */}
      <div className="bg-white -mt-10 mx-4 rounded-xl shadow-md relative z-10">
        <div className="p-4 sm:p-6">
          <div className="flex items-start">
            <Image
              src={store.logo || "/placeholder.svg"}
              alt={store.name}
              width={80}
              height={80}
              className="rounded-xl -mt-12 border-4 border-white"
            />
            <div className="ml-4 mt-2 flex-1">
              <h1 className="text-xl sm:text-2xl font-bold">{store.name}</h1>
              <div className="flex items-center text-sm text-gray-500 mt-1">
                <Star className="w-4 h-4 fill-yellow-400 text-yellow-400 mr-1" />
                <span>{store.rating}</span>
                <span className="mx-1">•</span>
                <Users className="w-4 h-4 mr-1" />
                <span>{store.followers.toLocaleString()} followers</span>
              </div>
            </div>
            <button className="bg-main px-4 py-2 rounded-full text-sm font-medium">Follow</button>
          </div>

          <p className="text-gray-600 mt-4">{store.description}</p>

          <div className="flex flex-wrap gap-2 mt-4">
            {store.categories.map((category) => (
              <span key={category} className="bg-gray-100 px-3 py-1 rounded-full text-xs">
                {category}
              </span>
            ))}
          </div>

          <div className="grid grid-cols-3 gap-4 mt-6 text-sm">
            <div className="flex flex-col items-center p-3 bg-gray-50 rounded-lg">
              <Package className="w-5 h-5 text-gray-500 mb-1" />
              <span className="font-bold">{store.products}</span>
              <span className="text-gray-500 text-xs">Products</span>
            </div>
            <div className="flex flex-col items-center p-3 bg-gray-50 rounded-lg">
              <MapPin className="w-5 h-5 text-gray-500 mb-1" />
              <span className="font-bold truncate w-full text-center">Location</span>
              <span className="text-gray-500 text-xs truncate w-full text-center">{store.address}</span>
            </div>
            <div className="flex flex-col items-center p-3 bg-gray-50 rounded-lg">
              <Calendar className="w-5 h-5 text-gray-500 mb-1" />
              <span className="font-bold">Since</span>
              <span className="text-gray-500 text-xs">{store.established}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Store Products */}
      <div className="mt-6 px-4">
        <h2 className="text-lg sm:text-xl font-bold mb-4">Products</h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 sm:gap-4">
          {products.map((product) => (
            <ProductCard
              key={product.id}
              id={product.id}
              title={product.title}
              price={product.price}
              imageUrl={product.images[0]}
            />
          ))}
        </div>
      </div>
    </div>
  )
}
