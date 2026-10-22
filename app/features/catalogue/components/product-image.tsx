import { cn } from "~/lib/utils";

import type { CategorySlug } from "../categories";

/**
 * TEMPORARY: line-art placeholder standing in for product photography.
 * Decorative (aria-hidden); the surrounding card carries the accessible name.
 */
const motifs: Record<CategorySlug, React.ReactNode> = {
  rings: (
    <>
      <circle cx="50" cy="62" r="20" />
      <path d="M42 42 50 30 58 42 50 48Z" />
    </>
  ),
  necklaces: (
    <>
      <path d="M22 28c4 34 52 34 56 0" />
      <path d="M50 58 44 68 50 80 56 68Z" />
    </>
  ),
  earrings: (
    <>
      <path d="M36 24v14M64 24v14" />
      <circle cx="36" cy="50" r="10" />
      <circle cx="64" cy="50" r="10" />
    </>
  ),
  bracelets: (
    <>
      <ellipse cx="50" cy="52" rx="26" ry="16" />
      <ellipse cx="50" cy="52" rx="20" ry="11" />
    </>
  ),
};

export function ProductImage({
  category,
  className,
}: {
  category: CategorySlug;
  className?: string;
}) {
  return (
    <div
      aria-hidden="true"
      className={cn(
        "grid aspect-[4/5] place-items-center bg-gradient-to-b from-sand/60 to-sand",
        className,
      )}
    >
      <svg
        viewBox="0 0 100 100"
        className="size-1/2 text-champagne transition-transform duration-700 ease-luxe group-hover:scale-105 motion-reduce:transition-none"
        fill="none"
        stroke="currentColor"
        strokeWidth="1"
        strokeLinejoin="round"
        strokeLinecap="round"
      >
        {motifs[category]}
      </svg>
    </div>
  );
}
