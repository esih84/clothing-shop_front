"use client";

import { ChevronRight } from "lucide-react";
import Link from "next/link";
import { Dialog, DialogContent } from "@/components/ui/dialog";

interface Account {
  id: string;
  name: string;
  type: string;
  status: "active" | "inactive";
  color: string;
}

interface Store {
  id: string;
  name: string;
  role: string;
  color: string;
}

// Mock store data
const stores: Store[] = [
  {
    id: "store1",
    name: "Fashion Boutique",
    role: "Manager",
    color: "#d8f5b4",
  },
  {
    id: "store2",
    name: "Urban Styles",
    role: "Employee",
    color: "#66a3ff",
  },
  {
    id: "store3",
    name: "Trendy Threads",
    role: "Owner",
    color: "#ff6666",
  },
];

export function ProfileModal({
  isOpen,
  onClose,
}: {
  isOpen: boolean;
  onClose: () => void;
}) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md rounded-3xl p-4 sm:p-6 max-h-[80vh] overflow-y-auto">
        {/* My Stores Section */}
        <div className="mb-4">
          <h3 className="text-base sm:text-lg font-bold mb-2">My Stores</h3>
          <div className="space-y-2">
            {stores.map((store) => (
              <Link key={store.id} href={`/shop/${store.id}`} className="block">
                <div className="flex items-center justify-between rounded-xl p-3 bg-gray-100">
                  <div className="flex items-center gap-2 sm:gap-3">
                    <div
                      className="flex h-8 w-8 sm:h-10 sm:w-10 items-center justify-center rounded-full"
                      style={{ backgroundColor: store.color }}
                    >
                      <span className="text-white font-bold text-xs sm:text-sm">
                        {store.name.charAt(0)}
                      </span>
                    </div>

                    <div>
                      <h3 className="text-sm sm:text-base font-bold">
                        {store.name}
                      </h3>
                      <p className="text-xs text-gray-600">{store.role}</p>
                    </div>
                  </div>

                  <ChevronRight className="h-4 w-4 sm:h-5 sm:w-5 text-gray-400" />
                </div>
              </Link>
            ))}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
