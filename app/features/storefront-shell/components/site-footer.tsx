import { Link } from "react-router";

import { Container } from "~/components/container";

import { primaryNav } from "../nav";
import { BrandLogo } from "./brand-logo";

export function SiteFooter() {
  return (
    <footer className="mt-32 bg-onyx text-ivory">
      <Container className="grid gap-12 py-16 md:grid-cols-[2fr_1fr_1fr]">
        <div className="space-y-4">
          <BrandLogo />
          <p className="max-w-xs text-sm leading-relaxed text-sand/80">
            Discover Luxury. Experience Elegance.
          </p>
        </div>
        <nav aria-label="Footer: shop">
          <h2 className="mb-4 font-sans text-xs tracking-[0.18em] text-champagne uppercase">
            Shop
          </h2>
          <ul className="space-y-3 text-sm">
            {primaryNav.map((item) => (
              <li key={item.to}>
                <Link
                  to={item.to}
                  className="text-sand/80 transition-colors duration-300 hover:text-ivory"
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
        <nav aria-label="Footer: account">
          <h2 className="mb-4 font-sans text-xs tracking-[0.18em] text-champagne uppercase">
            Your Aurelle
          </h2>
          <ul className="space-y-3 text-sm">
            <li>
              <Link
                to="/wishlist"
                className="text-sand/80 transition-colors duration-300 hover:text-ivory"
              >
                Wishlist
              </Link>
            </li>
            <li>
              <Link
                to="/cart"
                className="text-sand/80 transition-colors duration-300 hover:text-ivory"
              >
                Shopping bag
              </Link>
            </li>
          </ul>
        </nav>
      </Container>
      <div className="border-t border-ivory/10">
        <Container className="py-6 text-xs text-sand/60">
          © {new Date().getFullYear()} Aurelle. Fictional brand for
          demonstration.
        </Container>
      </div>
    </footer>
  );
}
