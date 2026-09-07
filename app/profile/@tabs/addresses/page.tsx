"use client";

import { useState } from "react";
import { MapPin, Plus, Trash2, Star, Loader2, X } from "lucide-react";
import { useAddresses } from "@/features/address/queries";
import {
  useCreateAddress,
  useDeleteAddress,
  useSetDefaultAddress,
} from "@/features/address/mutations";
import ProvinceCitySelect from "@/shared/components/global/province-city-select";

const inputCls =
  "w-full border border-border px-3 py-2 text-sm focus:outline-none focus:border-secondary bg-card rounded-xl";

export default function AddressesTab() {
  const { data: addresses = [], isLoading } = useAddresses();
  const createAddress = useCreateAddress();
  const deleteAddress = useDeleteAddress();
  const setDefaultAddress = useSetDefaultAddress();

  const [showForm, setShowForm] = useState(false);
  const [label, setLabel] = useState("خانه");
  const [province, setProvince] = useState("");
  const [city, setCity] = useState("");
  const [address, setAddress] = useState("");
  const [plaque, setPlaque] = useState("");
  const [postalCode, setPostalCode] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [locationError, setLocationError] = useState<string | null>(null);

  const resetForm = () => {
    setLabel("خانه");
    setProvince("");
    setCity("");
    setAddress("");
    setPlaque("");
    setPostalCode("");
    setError(null);
    setLocationError(null);
  };

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLocationError(null);
    // The province/city pickers are not native inputs, so they are checked here
    if (!province || !city) {
      setLocationError("لطفاً استان و شهر را انتخاب کنید.");
      return;
    }
    try {
      await createAddress.mutateAsync({
        label: label.trim() || city,
        province,
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
        <Loader2 className="w-6 h-6 text-secondary animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-3" style={{ direction: "rtl" }}>
      {addresses.length === 0 && !showForm && (
        <p className="text-sm text-muted-foreground text-center py-4">
          هنوز آدرسی ذخیره نکرده‌اید.
        </p>
      )}

      {addresses.map((addr) => (
        <div
          key={addr.id}
          className="flex items-center justify-between bg-card p-4 rounded-2xl shadow-sm border border-border"
        >
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-10 h-10 rounded-xl bg-primary/15 border border-border flex items-center justify-center flex-shrink-0">
              <MapPin className="w-5 h-5 text-secondary" />
            </div>
            <div className="text-right min-w-0">
              <div className="flex items-center gap-2">
                <p className="font-medium text-foreground text-sm">
                  {addr.label}
                </p>
                {addr.isDefault && (
                  <span className="text-xs bg-primary/20 text-secondary px-2 py-0.5 rounded-full border border-border">
                    پیش‌فرض
                  </span>
                )}
              </div>
              <p className="text-xs text-muted-foreground mt-0.5 truncate">
                {addr.province ? `${addr.province}، ` : ""}
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
                className="p-2 rounded-xl text-muted-foreground hover:text-secondary hover:bg-primary/15 transition-colors"
              >
                <Star className="w-4 h-4" />
              </button>
            )}
            <button
              type="button"
              title="حذف آدرس"
              onClick={() => deleteAddress.mutate(addr.id)}
              disabled={deleteAddress.isPending}
              className="p-2 rounded-xl text-muted-foreground hover:text-red-500 hover:bg-red-50 transition-colors"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        </div>
      ))}

      {showForm ? (
        <form
          onSubmit={handleCreate}
          className="bg-card p-4 rounded-2xl shadow-sm border border-border space-y-3"
        >
          <div className="flex items-center justify-between">
            <p className="font-medium text-foreground text-sm">آدرس جدید</p>
            <button
              type="button"
              onClick={() => {
                setShowForm(false);
                resetForm();
              }}
              className="p-1.5 rounded-lg text-muted-foreground hover:text-muted-foreground hover:bg-muted transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
          {error && (
            <div className="text-sm text-red-600 bg-red-50 rounded-xl px-3 py-2 text-center">
              {error}
            </div>
          )}
          <ProvinceCitySelect
            province={province}
            city={city}
            onChange={(next) => {
              setProvince(next.province);
              setCity(next.city);
              setLocationError(null);
            }}
            error={locationError}
            labelClassName="block text-xs text-muted-foreground mb-1"
            triggerClassName="border border-border px-3 py-2 text-sm focus:outline-none focus:border-secondary bg-card rounded-xl"
          />
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs text-muted-foreground mb-1">عنوان</label>
              <input
                type="text"
                value={label}
                onChange={(e) => setLabel(e.target.value)}
                placeholder="مثال: خانه، محل کار"
                className={inputCls}
              />
            </div>
            <div>
              <label className="block text-xs text-muted-foreground mb-1">
                پلاک <span className="text-secondary">*</span>
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
              <label className="block text-xs text-muted-foreground mb-1">
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
            <label className="block text-xs text-muted-foreground mb-1">
              آدرس کامل <span className="text-secondary">*</span>
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
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 py-2.5 px-8 rounded-2xl bg-secondary text-secondary-foreground text-sm font-medium hover:bg-secondary/90 transition-colors disabled:opacity-60"
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
          className="w-full flex items-center justify-center gap-2 p-4 rounded-2xl border border-dashed border-border/60 text-secondary text-sm font-medium hover:bg-primary/10 transition-colors"
        >
          <Plus className="w-4 h-4" />
          افزودن آدرس جدید
        </button>
      )}
    </div>
  );
}
