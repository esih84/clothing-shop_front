import Link from "next/link"
import { ChevronRight } from "lucide-react"

interface StoreCardProps {
  id: string
  name: string
  role: string
  address: string
  color: string
}

export function StoreCard({ id, name, role, address, color }: StoreCardProps) {
  return (
    <Link href={`/shop/${id}`} className="block">
      <div className="flex items-center justify-between bg-white p-3 rounded-lg">
        <div className="flex items-center">
          <div
            className="w-8 h-8 sm:w-10 sm:h-10 rounded-full mr-2 sm:mr-3 flex items-center justify-center"
            style={{ backgroundColor: color }}
          >
            <span className="text-white font-bold text-xs sm:text-sm">{name.charAt(0)}</span>
          </div>
          <div>
            <p className="font-medium text-sm sm:text-base">{name}</p>
            <div className="flex items-center">
              <span className="text-xs bg-gray-100 px-1.5 sm:px-2 py-0.5 rounded-full">{role}</span>
              <span className="text-xs text-gray-500 ml-2 truncate max-w-[120px] sm:max-w-[200px]">{address}</span>
            </div>
          </div>
        </div>
        <ChevronRight className="w-4 h-4 sm:w-5 sm:h-5 text-gray-400" />
      </div>
    </Link>
  )
}
