import { ChevronDown } from "lucide-react";

import {
  availabilityLabels,
  getAvailability,
  LOW_STOCK_THRESHOLD,
  type ProductDetail,
  type ProductVariant,
} from "~/features/catalogue";
import { formatPrice } from "~/lib/format";
import { cn } from "~/lib/utils";

const stockStyles = {
  "in-stock": "bg-champagne-deep",
  "low-stock": "bg-champagne",
  "sold-out": "bg-muted-foreground",
} as const;

/** Price and stock for the *selected* variant. `role="status"` announces changes politely. */
export function VariantSummary({ variant }: { variant: ProductVariant }) {
  const availability = getAvailability(variant.stockQuantity);
  const message =
    availability === "low-stock" && variant.stockQuantity <= LOW_STOCK_THRESHOLD
      ? `Only ${variant.stockQuantity} left`
      : availabilityLabels[availability];

  return (
    <div role="status" className="space-y-2">
      <p className="text-3xl font-medium">
        {formatPrice(variant.priceCents, variant.currency)}
      </p>
      <p className="flex items-center gap-2 text-sm">
        <span
          aria-hidden="true"
          className={cn("size-2 rounded-full", stockStyles[availability])}
        />
        {message}
        {availability === "sold-out" ? (
          <span className="text-muted-foreground">: try another option</span>
        ) : null}
      </p>
      <p className="text-xs text-muted-foreground">SKU {variant.sku}</p>
    </div>
  );
}

export function Specifications({ product }: { product: ProductDetail }) {
  return (
    <section aria-labelledby="specs-heading">
      <h2 id="specs-heading" className="text-2xl">
        Specifications
      </h2>
      <dl className="mt-4 divide-y divide-border border-y border-border text-sm">
        {product.specifications.map((spec) => (
          <div
            key={spec.label}
            className="grid grid-cols-[8rem_1fr] gap-4 py-3"
          >
            <dt className="text-muted-foreground">{spec.label}</dt>
            <dd>{spec.value}</dd>
          </div>
        ))}
      </dl>
    </section>
  );
}

/** TEMPORARY placeholder policy copy; real delivery and returns terms to be supplied. */
const policies = [
  {
    title: "Delivery",
    body: "Complimentary insured delivery. Orders placed before 2 pm ship the same working day; most arrive within 2-4 working days. Every parcel is signed for.",
  },
  {
    title: "Returns",
    body: "Return any unworn piece within 30 days for a full refund. Resized and engraved pieces are made to order and cannot be returned.",
  },
  {
    title: "Care and warranty",
    body: "Each piece carries a two-year warranty against defects in materials and craftsmanship, and complimentary cleaning at any time.",
  },
];

export function DeliveryAndReturns() {
  return (
    <section
      aria-label="Delivery, returns and care"
      className="divide-y divide-border border-y border-border"
    >
      {policies.map((policy) => (
        <details key={policy.title} className="group py-4">
          <summary className="flex min-h-8 cursor-pointer list-none items-center justify-between text-sm tracking-[0.12em] uppercase">
            {policy.title}
            <ChevronDown
              aria-hidden="true"
              className="size-4 transition-transform duration-200 group-open:rotate-180 motion-reduce:transition-none"
            />
          </summary>
          <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
            {policy.body}
          </p>
        </details>
      ))}
    </section>
  );
}
