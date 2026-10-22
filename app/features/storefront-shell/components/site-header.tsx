import { Heart, ShoppingBag } from "lucide-react";
import { Link } from "react-router";

import { Container } from "~/components/container";

import { primaryNav } from "../nav";
import { BrandLogo } from "./brand-logo";
import { MobileMenu } from "./mobile-menu";

const iconLink =
  "hover:bg-sand/70 grid size-11 place-items-center transition-colors duration-300";

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-40 border-b border-border bg-ivory/90 backdrop-blur">
      <Container className="grid h-16 grid-cols-[1fr_auto_1fr] items-center md:h-20">
        <div className="flex items-center">
          <MobileMenu />
          <nav aria-label="Primary" className="hidden lg:block">
            <ul className="flex gap-8">
              {primaryNav.map((item) => (
                <li key={item.to}>
                  <Link
                    to={item.to}
                    className="text-xs tracking-[0.18em] uppercase transition-colors duration-300 hover:text-champagne-deep"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        </div>
        <BrandLogo />
        <div className="flex items-center justify-end">
          <Link to="/wishlist" className={iconLink}>
            <Heart aria-hidden="true" className="size-5" strokeWidth={1.5} />
            <span className="sr-only">Wishlist</span>
          </Link>
          <Link to="/cart" className={iconLink}>
            <ShoppingBag
              aria-hidden="true"
              className="size-5"
              strokeWidth={1.5}
            />
            <span className="sr-only">Shopping bag</span>
          </Link>
        </div>
      </Container>
    </header>
  );
}
