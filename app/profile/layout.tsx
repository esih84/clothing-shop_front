


export default function ProfileLayout({
  tabs,
  admin
}: {
  children: React.ReactNode
  tabs: React.ReactNode
  admin: React.ReactNode
}) {
  const role: string = "user"
  return (
    <div className="pt-16 pb-24 px-4 mx-auto max-w-6xl" dir="rtl">
      {role === "user" && tabs}
      {role === "admin" && admin}
    </div>
  )
}
