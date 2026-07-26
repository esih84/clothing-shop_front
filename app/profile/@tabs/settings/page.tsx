"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useTheme } from "next-themes";
import { Moon, Loader2, LogOut, UserRound } from "lucide-react";
import { useCurrentUser } from "@/features/auth/queries";
import { useLogout, useUpdateProfile } from "@/features/auth/mutations";
import { JalaliDatePicker } from "@/shared/ui/jalali-date-picker";
import { Skeleton } from "@/shared/ui/skeleton";

function Toggle({
  enabled,
  onToggle,
}: {
  enabled: boolean;
  onToggle: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onToggle}
      aria-checked={enabled}
      role="switch"
      className={`relative inline-flex w-11 h-6 rounded-full transition-colors duration-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-secondary/40 ${
        enabled ? "bg-secondary" : "bg-muted"
      }`}
    >
      <span
        className={`absolute top-1 w-4 h-4 rounded-full bg-white shadow transition-all duration-300 ${
          enabled ? "right-1" : "right-6"
        }`}
      />
    </button>
  );
}

const inputCls =
  "w-full border border-border px-3 py-2 text-sm focus:outline-none focus:border-secondary bg-card text-foreground placeholder:text-muted-foreground rounded-xl";

export default function SettingsTab() {
  const router = useRouter();
  const logout = useLogout();
  const { resolvedTheme, setTheme } = useTheme();
  // Before mount the real theme is unknown; guard to avoid an SSR mismatch
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  const isDark = mounted && resolvedTheme === "dark";

  const { data: user, isLoading } = useCurrentUser();
  const updateProfile = useUpdateProfile();

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [birthDate, setBirthDate] = useState("");

  // Sync the form with the loaded profile
  useEffect(() => {
    if (user) {
      setFirstName(user.firstName ?? "");
      setLastName(user.lastName ?? "");
      setEmail(user.email ?? "");
      setBirthDate(user.birthDate ? user.birthDate.slice(0, 10) : "");
    }
  }, [user]);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await updateProfile.mutateAsync({
        firstName: firstName.trim() || undefined,
        lastName: lastName.trim() || undefined,
        email: email.trim() || undefined,
        birthDate: birthDate || undefined,
      });
    } catch {
      // The error toast is handled inside the mutation; user can retry
    }
  };

  const handleLogout = async () => {
    try {
      await logout.mutateAsync();
    } finally {
      router.push("/");
    }
  };

  return (
    <div
      className="flex flex-col lg:flex-row gap-4 items-start"
      style={{ direction: "rtl" }}
    >
      {/* Main area: profile edit */}
      <form
        onSubmit={handleSave}
        className="flex-1 w-full min-w-0 bg-card rounded-2xl p-4 sm:p-6 shadow-sm border border-border space-y-4"
      >
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-primary/15 border border-border flex items-center justify-center flex-shrink-0">
            <UserRound className="w-5 h-5 text-secondary" />
          </div>
          <div className="text-right">
            <p className="font-medium text-foreground text-sm">ویرایش پروفایل</p>
            <p className="text-xs text-muted-foreground mt-0.5">
              نام و اطلاعات حساب خود را به‌روز کنید
            </p>
          </div>
        </div>

        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {[0, 1, 2, 3].map((i) => (
              <div key={i} className="space-y-1.5">
                <Skeleton className="h-3 w-16" />
                <Skeleton className="h-[38px] w-full rounded-xl" />
              </div>
            ))}
            <div className="sm:col-span-2 space-y-1.5">
              <Skeleton className="h-3 w-20" />
              <Skeleton className="h-[38px] w-full rounded-xl" />
            </div>
            <Skeleton className="h-[42px] w-full sm:w-40 rounded-2xl" />
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs text-muted-foreground mb-1">
                  نام
                </label>
                <input
                  type="text"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  placeholder="مثال: سارا"
                  className={inputCls}
                />
              </div>
              <div>
                <label className="block text-xs text-muted-foreground mb-1">
                  نام خانوادگی
                </label>
                <input
                  type="text"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  placeholder="مثال: احمدی"
                  className={inputCls}
                />
              </div>
              <div>
                <label className="block text-xs text-muted-foreground mb-1">
                  ایمیل
                </label>
                <input
                  type="email"
                  dir="ltr"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  className={`${inputCls} text-right`}
                />
              </div>
              <div>
                <label className="block text-xs text-muted-foreground mb-1">
                  تاریخ تولد
                </label>
                <JalaliDatePicker
                  value={birthDate}
                  onChange={setBirthDate}
                  placeholder="مثال: ۱۳۷۵/۰۵/۱۲"
                />
              </div>
              <div className="sm:col-span-2">
                <label className="block text-xs text-muted-foreground mb-1">
                  شماره تلفن
                </label>
                <input
                  type="text"
                  dir="ltr"
                  value={user?.phone ?? ""}
                  readOnly
                  disabled
                  className={`${inputCls} text-right opacity-60 cursor-not-allowed`}
                />
                <p className="text-[11px] text-muted-foreground mt-1">
                  شماره تلفن قابل تغییر نیست.
                </p>
              </div>
            </div>

            <button
              type="submit"
              disabled={updateProfile.isPending}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 py-2.5 px-8 rounded-2xl bg-secondary text-secondary-foreground text-sm font-medium hover:bg-secondary/90 transition-colors disabled:opacity-60"
            >
              {updateProfile.isPending && (
                <Loader2 className="w-4 h-4 animate-spin" />
              )}
              ذخیره تغییرات
            </button>
          </>
        )}
      </form>

      {/* Left sidebar: theme + logout */}
      <aside className="w-full lg:w-64 space-y-3 flex-shrink-0">
        <div className="flex items-center justify-between bg-card rounded-2xl p-4 shadow-sm border border-border">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-primary/15 border border-border flex items-center justify-center flex-shrink-0">
              <Moon className="w-5 h-5 text-secondary" />
            </div>
            <div className="text-right">
              <p className="font-medium text-foreground text-sm">حالت تیره</p>
              <p className="text-xs text-muted-foreground mt-0.5">
                تغییر ظاهر برنامه
              </p>
            </div>
          </div>
          <Toggle
            enabled={isDark}
            onToggle={() => setTheme(isDark ? "light" : "dark")}
          />
        </div>

        <button
          type="button"
          onClick={handleLogout}
          disabled={logout.isPending}
          className="w-full flex items-center justify-center gap-2 py-3 rounded-2xl bg-card border border-red-500/30 text-red-500 font-medium text-sm shadow-sm hover:bg-red-500/10 transition-colors disabled:opacity-60"
        >
          {logout.isPending ? (
            <Loader2 className="w-5 h-5 animate-spin" />
          ) : (
            <LogOut className="w-5 h-5" />
          )}
          خروج از حساب
        </button>
      </aside>
    </div>
  );
}
