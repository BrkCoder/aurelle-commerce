import { Link } from "react-router";

import { cn } from "~/lib/utils";

export function BrandLogo({ className }: { className?: string }) {
  return (
    <Link
      to="/"
      aria-label="Aurelle, home"
      className={cn(
        "font-serif text-2xl tracking-[0.32em] uppercase md:text-3xl",
        className,
      )}
    >
      Aurelle
    </Link>
  );
}
