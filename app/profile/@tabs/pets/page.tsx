"use client";

import { useState } from "react";
import { PawPrint, Plus, Trash2, Loader2, X } from "lucide-react";
import { usePets } from "@/features/pet/queries";
import { useCreatePet, useDeletePet } from "@/features/pet/mutations";

export default function PetsTab() {
  const { data: pets = [], isLoading } = usePets();
  const createPet = useCreatePet();
  const deletePet = useDeletePet();

  const [showForm, setShowForm] = useState(false);
  const [name, setName] = useState("");
  const [confirmId, setConfirmId] = useState<string | null>(null);

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = name.trim();
    if (!trimmed) return;
    try {
      await createPet.mutateAsync({ name: trimmed });
      setName("");
      setShowForm(false);
    } catch {
      // The error toast is handled inside the mutation; user can retry
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await deletePet.mutateAsync(id);
    } finally {
      setConfirmId(null);
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
      {pets.length === 0 && !showForm && (
        <p className="text-sm text-muted-foreground text-center py-4">
          هنوز پتی ثبت نکرده‌اید.
        </p>
      )}

      {pets.map((pet) => (
        <div
          key={pet.id}
          className="flex items-center justify-between gap-2 bg-card p-4 rounded-2xl shadow-sm border border-border"
        >
          <span className="flex items-center gap-3 text-sm text-foreground min-w-0">
            <span className="w-10 h-10 rounded-xl bg-primary/15 border border-border flex items-center justify-center flex-shrink-0">
              <PawPrint className="w-5 h-5 text-secondary" />
            </span>
            <span className="font-medium truncate">{pet.name}</span>
          </span>

          {confirmId === pet.id ? (
            <div className="flex items-center gap-2 flex-shrink-0">
              <button
                type="button"
                onClick={() => handleDelete(pet.id)}
                disabled={deletePet.isPending}
                className="flex items-center gap-1 px-3 py-1.5 rounded-xl bg-red-500 text-white text-xs font-medium hover:bg-red-600 transition-colors disabled:opacity-60"
              >
                {deletePet.isPending && (
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                )}
                حذف شود
              </button>
              <button
                type="button"
                onClick={() => setConfirmId(null)}
                disabled={deletePet.isPending}
                className="px-3 py-1.5 rounded-xl border border-border text-muted-foreground text-xs hover:bg-muted transition-colors"
              >
                انصراف
              </button>
            </div>
          ) : (
            <button
              type="button"
              title="حذف پت"
              onClick={() => setConfirmId(pet.id)}
              className="p-2 rounded-xl text-muted-foreground hover:text-red-500 hover:bg-red-500/10 transition-colors flex-shrink-0"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          )}
        </div>
      ))}

      {showForm ? (
        <form
          onSubmit={handleAdd}
          className="bg-card p-4 rounded-2xl shadow-sm border border-border space-y-3"
        >
          <div className="flex items-center justify-between">
            <p className="font-medium text-foreground text-sm">پت جدید</p>
            <button
              type="button"
              onClick={() => {
                setShowForm(false);
                setName("");
              }}
              className="p-1.5 rounded-lg text-muted-foreground hover:text-muted-foreground hover:bg-muted transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
          <div>
            <label className="block text-xs text-muted-foreground mb-1">
              نام پت <span className="text-secondary">*</span>
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              autoFocus
              placeholder="مثال: پوپک"
              className="w-full sm:max-w-sm border border-border px-3 py-2 text-sm focus:outline-none focus:border-secondary bg-card text-foreground placeholder:text-muted-foreground rounded-xl"
            />
          </div>
          <button
            type="submit"
            disabled={createPet.isPending || !name.trim()}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 py-2.5 px-8 rounded-2xl bg-secondary text-secondary-foreground text-sm font-medium hover:bg-secondary/90 transition-colors disabled:opacity-60"
          >
            {createPet.isPending && <Loader2 className="w-4 h-4 animate-spin" />}
            ذخیره‌ی پت
          </button>
        </form>
      ) : (
        <button
          type="button"
          onClick={() => setShowForm(true)}
          className="w-full flex items-center justify-center gap-2 p-4 rounded-2xl border border-dashed border-border/60 text-secondary text-sm font-medium hover:bg-primary/10 transition-colors"
        >
          <Plus className="w-4 h-4" />
          افزودن پت جدید
        </button>
      )}
    </div>
  );
}
