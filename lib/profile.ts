// Profile API mock (replace with real API integration)
export interface Profile {
  name: string;
  email: string;
  membership: string;
  stats: { label: string; value: string }[];
}

export interface Order {
  id: string;
  date: string;
  status: string;
  statusColor: string;
}

export interface Address {
  label: string;
  detail: string;
  isDefault: boolean;
}

export async function getProfileData(): Promise<{
  profile: Profile;
  orders: Order[];
  addresses: Address[];
}> {
  // Simulate network delay
  await new Promise((resolve) => setTimeout(resolve, 700));
  return {
    profile: {
      name: "جواد محمدی",
      email: "user@email.com",
      membership: "عضو طلایی",
      stats: [
        { label: "سفارش‌ها", value: "۱۲" },
        { label: "امتیاز", value: "۳۴۰" },
        { label: "آدرس‌ها", value: "۲" },
      ],
    },
    orders: [
      { id: "۱۲۳۴۵", date: "۱۲ اردیبهشت ۱۴۰۴", status: "تحویل شده", statusColor: "bg-[#ffbdc5]/40 text-[#670626]" },
      { id: "۱۲۳۴۶", date: "۹ اردیبهشت ۱۴۰۴", status: "در حال پردازش", statusColor: "bg-amber-100 text-amber-700" },
      { id: "۱۲۳۴۷", date: "۲ اردیبهشت ۱۴۰۴", status: "لغو شده", statusColor: "bg-red-100 text-red-600" },
    ],
    addresses: [
      { label: "خانه", detail: "تهران، خیابان آزادی، پلاک ۱۲۳", isDefault: true },
      { label: "محل کار", detail: "تهران، خیابان ولیعصر، پلاک ۴۵۶", isDefault: false },
    ],
  };
}
