export const CURRENCY = "₹"

export const SIDEBAR_CONFIG = {
  defaultOpen: true,
  variant: "sidebar" as const,
  collapsible: "icon" as const,
}

export const LAYOUT_CONFIG = {
  mainClassName: "container mx-auto p-6",
  sidebarClassName: "border-r",
}

export const MOTION_CONFIG = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -20 },
} 