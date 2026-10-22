import { categories } from "~/features/catalogue";

export type NavItem = { label: string; to: string };

/** Single source for header, mobile menu and footer navigation. */
export const primaryNav: NavItem[] = [
  { label: "Shop all", to: "/catalogue" },
  ...categories.map((c) => ({
    label: c.name,
    to: `/catalogue?category=${c.slug}`,
  })),
];
