import { Link } from "react-router";

import { Container } from "~/components/container";
import { Button } from "~/components/ui/button";
import { ProductPicture } from "~/features/catalogue";
import { productImage } from "~/features/catalogue/product-images";

/**
 * Entrance animation is plain CSS (`animate-fade-up`, see app.css), so it runs before
 * JavaScript loads and nothing is hidden for visitors without it. The headline is the
 * page's largest contentful paint, so it is deliberately not animated at all.
 */
const delay = (seconds: number) => ({ animationDelay: `${seconds}s` });

export function Hero() {
  return (
    <section
      aria-labelledby="hero-heading"
      className="bg-gradient-to-b from-sand/50 to-ivory"
    >
      <Container className="grid min-h-[calc(100svh-4rem)] items-center gap-12 py-16 md:min-h-[44rem] lg:grid-cols-[1.1fr_0.9fr]">
        <div className="max-w-xl">
          <p
            className="mb-6 animate-fade-up text-xs tracking-[0.32em] text-champagne-deep uppercase"
            style={delay(0)}
          >
            The Autumn Collection
          </p>
          <h1 id="hero-heading" className="text-6xl leading-[0.98] md:text-8xl">
            Discover Luxury.{" "}
            <em className="font-normal text-mocha italic">
              Experience Elegance.
            </em>
          </h1>
          <p
            className="mt-8 max-w-md animate-fade-up text-lg leading-relaxed text-muted-foreground"
            style={delay(0.15)}
          >
            Fine jewellery in gold, pearl and diamond. Made slowly, designed to
            be worn for a lifetime.
          </p>
          <div
            className="mt-10 flex animate-fade-up flex-wrap gap-4"
            style={delay(0.3)}
          >
            <Button asChild>
              <Link to="/catalogue">Shop the collection</Link>
            </Button>
            <Button asChild variant="outline">
              <Link to="/catalogue?category=rings">Explore rings</Link>
            </Button>
          </div>
        </div>
        {/* Not animated: on desktop this photo is the page's largest contentful paint. */}
        <div className="relative mx-auto aspect-[4/5] w-full max-w-md overflow-hidden bg-sand lg:max-w-none">
          <ProductPicture
            image={productImage(
              "lumiere-solitaire-ring",
              3,
              "A diamond solitaire ring in yellow gold on a travertine plinth",
            )}
            sizes="(min-width: 1024px) 42vw, 448px"
            priority
            className="size-full object-cover"
          />
        </div>
      </Container>
    </section>
  );
}
