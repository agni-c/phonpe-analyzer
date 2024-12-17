import { Sidebar } from "@/components/Sidebar"

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="h-full relative">
      
      <main className="md:pl-72">
        <div className="h-full p-8">
          {children}
        </div>
      </main>
    </div>
  )
} 