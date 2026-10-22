import type { Availability } from "./catalogue.types";

/** At or below this many units we tell the customer stock is low. */
export const LOW_STOCK_THRESHOLD = 3;

/** Products added within this many days carry a "New" badge. */
export const NEW_PRODUCT_WINDOW_DAYS = 60;

export function getAvailability(stockQuantity: number): Availability {
  if (stockQuantity <= 0) return "sold-out";
  if (stockQuantity <= LOW_STOCK_THRESHOLD) return "low-stock";
  return "in-stock";
}

export const availabilityLabels: Record<Availability, string> = {
  "in-stock": "In stock",
  "low-stock": "Low stock",
  "sold-out": "Sold out",
};

export function isNewProduct(createdAt: Date, now: Date): boolean {
  const ageDays = (now.getTime() - createdAt.getTime()) / 86_400_000;
  return ageDays <= NEW_PRODUCT_WINDOW_DAYS;
}
