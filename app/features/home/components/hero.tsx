import { motion } from "motion/react";
import { Link } from "react-router";

import { Button } from "~/components/ui/button";
import { Container } from "~/components/container";

const reveal = (delay: number) => ({
  initial: { opacity: 0, y: 16 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.8, delay, ease: [0.22, 1, 0.36, 1] as const },
});

export function Hero() {
  return (
    <section
      aria-labelledby="hero-heading"
      className="bg-gradient-to-b from-sand/50 to-ivory"
    >
      <Container className="grid min-h-[calc(100svh-4rem)] items-center gap-12 py-16 md:min-h-[44rem] lg:grid-cols-[1.1fr_0.9fr]">
        <div className="max-w-xl">
          <motion.p
            {...reveal(0)}
            className="mb-6 text-xs tracking-[0.32em] text-champagne-deep uppercase"
          >
            The Autumn Collection
          </motion.p>
          <motion.h1
            id="hero-heading"
            {...reveal(0.1)}
            className="text-6xl leading-[0.98] md:text-8xl"
          >
            Discover Luxury.{" "}
            <em className="font-normal text-mocha italic">
              Experience Elegance.
            </em>
          </motion.h1>
          <motion.p
            {...reveal(0.25)}
            className="mt-8 max-w-md text-lg leading-relaxed text-muted-foreground"
          >
            Fine jewellery in gold, pearl and diamond. Made slowly, designed to
            be worn for a lifetime.
          </motion.p>
          <motion.div {...reveal(0.4)} className="mt-10 flex flex-wrap gap-4">
            <Button asChild>
              <Link to="/catalogue">Shop the collection</Link>
            </Button>
            <Button asChild variant="outline">
              <Link to="/catalogue?category=rings">Explore rings</Link>
            </Button>
          </motion.div>
        </div>
        <motion.div
          {...reveal(0.2)}
          aria-hidden="true"
          className="relative mx-auto aspect-[4/5] w-full max-w-md lg:max-w-none"
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
        </motion.div>
      </Container>
    </section>
  );
}
