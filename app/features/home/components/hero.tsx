import { Link } from "react-router";

import { Container } from "~/components/container";
import { Button } from "~/components/ui/button";

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
        <div
          aria-hidden="true"
          className="relative mx-auto aspect-[4/5] w-full max-w-md animate-fade-up lg:max-w-none"
          style={delay(0.1)}
        >
          {/* TEMPORARY: art-directed placeholder until campaign photography exists. */}
          <div className="absolute inset-0 border border-champagne/40 bg-gradient-to-br from-champagne/40 via-sand to-ivory" />
          <svg
            viewBox="0 0 100 125"
            className="absolute inset-0 size-full p-[18%] text-champagne-deep"
            fill="none"
            stroke="currentColor"
            strokeWidth="0.4"
          >
            <circle cx="50" cy="78" r="26" />
            <circle cx="50" cy="78" r="22" />
            <path d="M38 46 50 28 62 46 50 56Z" />
            <path d="M38 46h24M44 37l6 19 6-19" />
          </svg>
        </div>
      </Container>
    </section>
  );
}
