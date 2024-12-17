export const siteConfig = {
  name: "Finance.ai",
  description: "Personal finance management and analytics",
  mainNav: [
    {
      label: 'Dashboard',
      icon: 'LayoutDashboard',
      href: '/dashboard',
      color: "text-sky-500"
    },
    {
      label: 'Transactions',
      icon: 'Receipt',
      href: '/dashboard/transactions',
      color: "text-violet-500",
    },
    {
      label: 'Categories',
      icon: 'PieChart',
      color: "text-pink-700",
      href: '/dashboard/categories',
    },
    {
      label: 'Analytics',
      icon: 'BarChart3',
      color: "text-orange-700",
      href: '/dashboard/analytics',
    },
    {
      label: 'Upload',
      icon: 'Upload',
      color: "text-emerald-500",
      href: '/dashboard/upload',
    },
    {
      label: 'Settings',
      icon: 'Settings',
      href: '/dashboard/settings',
    },
  ],
}

export type SiteConfig = typeof siteConfig 