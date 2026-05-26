


export default function ProfileLayout({
  tabs,
}: {
  children: React.ReactNode
  tabs: React.ReactNode
}) {


  return (
    <div className="pt-16 pb-24 px-4 mx-auto max-w-6xl" dir="rtl">
      {tabs}
    </div>
  )
}
