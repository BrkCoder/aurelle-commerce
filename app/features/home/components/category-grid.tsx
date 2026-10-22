import { ArrowUpRight } from "lucide-react";
import { Link } from "react-router";

import { Container } from "~/components/container";
import { categories, ProductPicture } from "~/features/catalogue";
import { productImage } from "~/features/catalogue/product-images";

export function CategoryGrid() {
  return (
    <section aria-labelledby="categories-heading" className="mt-24 md:mt-32">
      <Container>
        <h2 id="categories-heading" className="text-4xl md:text-5xl">
          Shop by category
        </h2>
        <ul className="mt-10 grid grid-cols-2 gap-x-4 gap-y-10 lg:grid-cols-4 lg:gap-x-6">
          {categories.map((category) => (
            <li key={category.slug} className="group relative">
              <div className="aspect-[4/5] overflow-hidden bg-sand">
                {/* Decorative: the link below names the category. */}
                <ProductPicture
                  image={productImage(category.cover, 3, "")}
                  alt=""
                  sizes="(min-width: 1024px) 22vw, 46vw"
                  className="size-full object-cover transition-transform duration-700 ease-luxe group-hover:scale-[1.03] motion-reduce:transition-none"
                />
              </div>
              <div className="mt-4 flex items-start justify-between gap-2">
                <div>
                  <h3 className="text-2xl">
                    <Link
                      to={`/catalogue?category=${category.slug}`}
                      className="after:absolute after:inset-0"
                    >
                      {category.name}
                    </Link>
                  </h3>
                  <p className="mt-1 hidden text-sm text-muted-foreground sm:block">
                    {category.blurb}
                  </p>
                </div>
                <ArrowUpRight
                  aria-hidden="true"
                  className="mt-1.5 size-5 shrink-0 text-champagne-deep transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 motion-reduce:transition-none"
                />
              </div>
            </li>
          ))}
        </ul>
      </Container>
    </section>
  );
}
