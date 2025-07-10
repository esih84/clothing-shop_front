import { getDiscountedProducts } from "@/lib/actions"
import { OfferCard } from "@/components/offer-card"

export default async function OffersSection() {
  const discountedProducts = await getDiscountedProducts()

  return (
    <div className="px-4 py-6">
      <h2 className="text-xl md:text-2xl font-bold mb-4 md:mb-6">Special Offers</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {discountedProducts.slice(0, 6).map((product) => (
          <OfferCard
            key={product.id}
            id={product.id}
            title={product.title}
            price={product.price}
            originalPrice={product.originalPrice || product.price}
            discount={product.discount || 0}
            imageUrl={product.images[0]}
            rating={product.rating}
          />
        ))}
      </div>
    </div>
  )
}
