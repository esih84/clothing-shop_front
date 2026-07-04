import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export default async function ProfileLayout({
  tabs,
}: {
  children: React.ReactNode;
  tabs: React.ReactNode;
}) {
  // کاربر لاگین‌نشده نباید پروفایل خالی ببیند؛ مستقیم به لاگین می‌رود
  const cookieStore = await cookies();
  const hasSession =
    cookieStore.has("access_token") || cookieStore.has("refresh_token");
  if (!hasSession) {
    redirect("/login?redirect=/profile");
  }

  return (
    <div className="pt-16 pb-24 px-4 mx-auto max-w-6xl" dir="rtl">
      {tabs}
    </div>
  );
}
