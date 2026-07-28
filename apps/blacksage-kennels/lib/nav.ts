export const NAV_ITEMS = [
  { href: "/", label: "Home" },
  { href: "/dogs", label: "Dogs" },
  { href: "/health", label: "Health/Education" },
  { href: "/about", label: "About" },
  { href: "/inquire", label: "Inquire" },
] as const;

export type NavItem = (typeof NAV_ITEMS)[number];
