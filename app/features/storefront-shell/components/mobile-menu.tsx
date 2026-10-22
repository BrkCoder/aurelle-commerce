import { Menu, X } from "lucide-react";
import { useState } from "react";
import { Link } from "react-router";

import { Button } from "~/components/ui/button";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetTitle,
  SheetTrigger,
} from "~/components/ui/sheet";

import { primaryNav } from "../nav";
import { BrandLogo } from "./brand-logo";

/** Radix Dialog gives focus trapping, Escape to close, and focus return for free. */
export function MobileMenu() {
  const [open, setOpen] = useState(false);

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon" className="lg:hidden">
          <Menu aria-hidden="true" />
          <span className="sr-only">Open menu</span>
        </Button>
      </SheetTrigger>
      <SheetContent>
        <div className="flex items-center justify-between">
          <SheetTitle className="sr-only">Menu</SheetTitle>
          <SheetDescription className="sr-only">
            Browse Aurelle jewellery collections.
          </SheetDescription>
          <SheetClose asChild>
            <BrandLogo />
          </SheetClose>
          <SheetClose asChild>
            <Button variant="ghost" size="icon">
              <X aria-hidden="true" />
              <span className="sr-only">Close menu</span>
            </Button>
          </SheetClose>
        </div>
        <nav aria-label="Mobile" className="mt-12">
          <ul className="space-y-1">
            {primaryNav.map((item) => (
              <li key={item.to}>
                <SheetClose asChild>
                  <Link
                    to={item.to}
                    className="block border-b border-border py-4 font-serif text-3xl"
                  >
                    {item.label}
                  </Link>
                </SheetClose>
              </li>
            ))}
          </ul>
        </nav>
        <p className="mt-auto text-xs tracking-[0.18em] text-champagne-deep uppercase">
          Discover Luxury. Experience Elegance.
        </p>
      </SheetContent>
    </Sheet>
  );
}
