"use client";

import { useState } from "react";
import { MapPin, Plus, Trash2, Star, Loader2, X } from "lucide-react";
import { useAddresses } from "@/features/address/queries";
import {
  useCreateAddress,
  useDeleteAddress,
  useSetDefaultAddress,
} from "@/features/address/mutations";

const inputCls =
  "w-full border border-[#A9CBF5]/50 px-3 py-2 text-sm focus:outline-none focus:border-[#1473E6] bg-white rounded-xl";

export default function AddressesTab() {
  const { data: addresses = [], isLoading } = useAddresses();
  const createAddress = useCreateAddress();
  const deleteAddress = useDeleteAddress();
  const setDefaultAddress = useSetDefaultAddress();

  const [showForm, setShowForm] = useState(false);
  const [label, setLabel] = useState("خانه");
  const [city, setCity] = useState("");
  const [address, setAddress] = useState("");
  const [plaque, setPlaque] = useState("");
  const [postalCode, setPostalCode] = useState("");
  const [error, setError] = useState<string | null>(null);

  const resetForm = () => {
    setLabel("خانه");
    setCity("");
    setAddress("");
    setPlaque("");
    setPostalCode("");
    setError(null);
  };

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    try {
      await createAddress.mutateAsync({
        label: label.trim() || city,
        city,
        address,
        plaque,
        postalCode: postalCode.trim() || undefined,
      });
      resetForm();
      setShowForm(false);
    } catch {
      setError("ذخیره‌ی آدرس با خطا مواجه شد. دوباره تلاش کنید.");
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center py-10">
        <Loader2 className="w-6 h-6 text-[#1473E6] animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-3" style={{ direction: "rtl" }}>
      {addresses.length === 0 && !showForm && (
        <p className="text-sm text-gray-500 text-center py-4">
          هنوز آدرسی ذخیره نکرده‌اید.
        </p>
      )}

      {addresses.map((addr) => (
        <div
          key={addr.id}
          className="flex items-center justify-between bg-white p-4 rounded-2xl shadow-sm border border-[#A9CBF5]/30"
        >
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-10 h-10 rounded-xl bg-[#FDE68A]/20 border border-[#A9CBF5]/30 flex items-center justify-center flex-shrink-0">
              <MapPin className="w-5 h-5 text-[#1473E6]" />
            </div>
            <div className="text-right min-w-0">
              <div className="flex items-center gap-2">
                <p className="font-medium text-gray-800 text-sm">
                  {addr.label}
                </p>
                {addr.isDefault && (
                  <span className="text-xs bg-[#FDE68A]/40 text-[#1473E6] px-2 py-0.5 rounded-full border border-[#A9CBF5]/30">
                    پیش‌فرض
                  </span>
                )}
              </div>
              <p className="text-xs text-gray-500 mt-0.5 truncate">
                {addr.city}، {addr.address}، پلاک {addr.plaque}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-1 flex-shrink-0">
            {!addr.isDefault && (
              <button
                type="button"
                title="تعیین به‌عنوان پیش‌فرض"
                onClick={() => setDefaultAddress.mutate(addr.id)}
                disabled={setDefaultAddress.isPending}
                className="p-2 rounded-xl text-gray-400 hover:text-[#1473E6] hover:bg-[#FDE68A]/20 transition-colors"
              >
                <Star className="w-4 h-4" />
              </button>
            )}
            <button
              type="button"
              title="حذف آدرس"
              onClick={() => deleteAddress.mutate(addr.id)}
              disabled={deleteAddress.isPending}
              className="p-2 rounded-xl text-gray-400 hover:text-red-500 hover:bg-red-50 transition-colors"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        </div>
      ))}

      {showForm ? (
        <form
          onSubmit={handleCreate}
          className="bg-white p-4 rounded-2xl shadow-sm border border-[#A9CBF5]/30 space-y-3"
        >
          <div className="flex items-center justify-between">
            <p className="font-medium text-gray-800 text-sm">آدرس جدید</p>
            <button
              type="button"
              onClick={() => {
                setShowForm(false);
                resetForm();
              }}
              className="p-1.5 rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
          {error && (
            <div className="text-sm text-red-600 bg-red-50 rounded-xl px-3 py-2 text-center">
              {error}
            </div>
          )}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs text-gray-600 mb-1">عنوان</label>
              <input
                type="text"
                value={label}
                onChange={(e) => setLabel(e.target.value)}
                placeholder="مثال: خانه، محل کار"
                className={inputCls}
              />
            </div>
            <div>
              <label className="block text-xs text-gray-600 mb-1">
                شهر <span className="text-[#1473E6]">*</span>
              </label>
              <input
                type="text"
                value={city}
                onChange={(e) => setCity(e.target.value)}
                required
                placeholder="مثال: تهران"
                className={inputCls}
              />
            </div>
            <div>
              <label className="block text-xs text-gray-600 mb-1">
                پلاک <span className="text-[#1473E6]">*</span>
              </label>
              <input
                type="text"
                value={plaque}
                onChange={(e) => setPlaque(e.target.value)}
                required
                placeholder="مثال: ۱۲"
                className={inputCls}
              />
            </div>
            <div>
              <label className="block text-xs text-gray-600 mb-1">
                کد پستی
              </label>
              <input
                type="text"
                value={postalCode}
                onChange={(e) => setPostalCode(e.target.value)}
                placeholder="اختیاری"
                className={inputCls}
              />
            </div>
          </div>
          <div>
            <label className="block text-xs text-gray-600 mb-1">
              آدرس کامل <span className="text-[#1473E6]">*</span>
            </label>
            <textarea
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              required
              rows={2}
              placeholder="خیابان، کوچه، ..."
              className={`${inputCls} resize-none`}
            />
          </div>
          <button
            type="submit"
            disabled={createAddress.isPending}
            className="w-full flex items-center justify-center gap-2 py-2.5 rounded-2xl bg-secondary text-secondary-foreground text-sm font-medium hover:bg-secondary/90 transition-colors disabled:opacity-60"
          >
            {createAddress.isPending && (
              <Loader2 className="w-4 h-4 animate-spin" />
            )}
            ذخیره‌ی آدرس
          </button>
        </form>
      ) : (
        <button
          type="button"
          onClick={() => setShowForm(true)}
          className="w-full flex items-center justify-center gap-2 p-4 rounded-2xl border border-dashed border-[#A9CBF5]/60 text-[#1473E6] text-sm font-medium hover:bg-[#FDE68A]/10 transition-colors"
        >
          <Plus className="w-4 h-4" />
          افزودن آدرس جدید
        </button>
      )}
    </div>
  );
}
