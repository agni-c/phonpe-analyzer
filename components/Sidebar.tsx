import Link from "next/link"
import { cn } from "@/lib/utils"
import {
  LayoutDashboard,
  Receipt,
  PieChart,
  BarChart3,
  Upload,
  Settings
} from "lucide-react"

const routes = [
  {
    label: 'Dashboard',
    icon: LayoutDashboard,
    href: '/dashboard',
    color: "text-sky-500"
  },
  {
    label: 'Transactions',
    icon: Receipt,
    href: '/dashboard/transactions',
    color: "text-violet-500",
  },
  {
    label: 'Categories',
    icon: PieChart,
    color: "text-pink-700",
    href: '/dashboard/categories',
  },
  {
    label: 'Analytics',
    icon: BarChart3,
    color: "text-orange-700",
    href: '/dashboard/analytics',
  },
  {
    label: 'Upload',
    icon: Upload,
    color: "text-emerald-500",
    href: '/dashboard/upload',
  },
  {
    label: 'Settings',
    icon: Settings,
    href: '/dashboard/settings',
  },
]

export function Sidebar() {
  return (
    <div className="space-y-4 py-4 flex flex-col h-full bg-sidebar-background text-sidebar-foreground">
      <div className="px-3 py-2 flex-1">
        <Link href="/dashboard" className="flex items-center pl-3 mb-14">
          <h1 className="text-2xl font-bold">
            Finance.ai
          </h1>
        </Link>
        <div className="space-y-1">
          {routes.map((route) => (
            <Link
              key={route.href}
              href={route.href}
              className={cn(
                "text-sm group flex p-3 w-full justify-start font-medium cursor-pointer hover:bg-sidebar-accent rounded-lg transition",
                route.color
              )}
            >
              <div className="flex items-center flex-1">
                <route.icon className={cn("h-5 w-5 mr-3")} />
                {route.label}
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  )
} 