import { ChevronLeft, ChevronRight, Maximize2 } from "lucide-react";
import { useRef, useState } from "react";

import type { CatalogueImage } from "~/features/catalogue";
import { cn } from "~/lib/utils";

import { ImageZoomDialog } from "./image-zoom-dialog";

const arrowButton =
  "bg-ivory/90 hover:bg-ivory absolute top-1/2 grid size-11 -translate-y-1/2 place-items-center transition-colors duration-200";

/**
 * Main image, thumbnails and zoom. The thumbnails are a radio group: one tab stop,
 * arrow keys / Home / End move between images. Remount with `key={productId}` when
 * the product changes so the selection resets.
 */
export function ProductGallery({ images }: { images: CatalogueImage[] }) {
  const [index, setIndex] = useState(0);
  const [zoomOpen, setZoomOpen] = useState(false);
  const thumbs = useRef<(HTMLButtonElement | null)[]>([]);
  const zoomOpener = useRef<HTMLButtonElement>(null);
  const current = images[index];

  if (!current) {
    return (
      <div
        role="img"
        aria-label="No image available"
        className="aspect-[4/5] bg-sand"
      />
    );
  }

  const wrap = (i: number) => (i + images.length) % images.length;

  function onThumbKeyDown(event: React.KeyboardEvent, from: number) {
    const targets: Record<string, number> = {
      ArrowRight: from + 1,
      ArrowDown: from + 1,
      ArrowLeft: from - 1,
      ArrowUp: from - 1,
      Home: 0,
      End: images.length - 1,
    };
    const target = targets[event.key];
    if (target === undefined) return;
    event.preventDefault();
    const next = wrap(target);
    setIndex(next);
    thumbs.current[next]?.focus();
  }

  return (
    <div className="flex flex-col gap-3 lg:flex-row-reverse lg:gap-4">
      <div className="relative aspect-[4/5] flex-1 overflow-hidden bg-sand">
        <button
          ref={zoomOpener}
          type="button"
          onClick={() => setZoomOpen(true)}
          aria-label={`Enlarge image: ${current.alt}`}
          className="group absolute inset-0 cursor-zoom-in"
        >
          <img
            key={current.url}
            src={current.url}
            alt={current.alt}
            width={current.width}
            height={current.height}
            sizes="(min-width: 1024px) 45vw, 100vw"
            // The first image is the page's largest contentful paint.
            loading="eager"
            fetchPriority={index === 0 ? "high" : "auto"}
            decoding="async"
            className="size-full animate-in object-cover duration-500 fade-in motion-reduce:animate-none"
          />
          <span className="absolute right-3 bottom-3 grid size-10 place-items-center bg-ivory/90 opacity-0 transition-opacity duration-200 group-hover:opacity-100 group-focus-visible:opacity-100 motion-reduce:transition-none">
            <Maximize2 aria-hidden="true" className="size-4" />
          </span>
        </button>

        {images.length > 1 ? (
          <>
            <button
              type="button"
              onClick={() => setIndex(wrap(index - 1))}
              className={cn(arrowButton, "left-2")}
            >
              <ChevronLeft aria-hidden="true" className="size-5" />
              <span className="sr-only">Previous image</span>
            </button>
            <button
              type="button"
              onClick={() => setIndex(wrap(index + 1))}
              className={cn(arrowButton, "right-2")}
            >
              <ChevronRight aria-hidden="true" className="size-5" />
              <span className="sr-only">Next image</span>
            </button>
          </>
        ) : null}
        <p role="status" className="sr-only">
          Image {index + 1} of {images.length}
        </p>
      </div>

      {images.length > 1 ? (
        <div
          role="radiogroup"
          aria-label="Product images"
          className="flex gap-3 overflow-x-auto lg:flex-col lg:overflow-visible"
        >
          {images.map((image, i) => {
            const selected = i === index;
            return (
              <button
                key={image.url}
                ref={(el) => {
                  thumbs.current[i] = el;
                }}
                type="button"
                role="radio"
                aria-checked={selected}
                aria-label={image.alt}
                tabIndex={selected ? 0 : -1}
                onClick={() => setIndex(i)}
                onKeyDown={(event) => onThumbKeyDown(event, i)}
                className={cn(
                  "relative aspect-[4/5] w-16 shrink-0 overflow-hidden border bg-sand transition-colors duration-200 lg:w-20",
                  selected
                    ? "border-onyx"
                    : "border-transparent hover:border-mocha/50",
                )}
              >
                <img
                  src={image.url}
                  alt=""
                  width={image.width}
                  height={image.height}
                  sizes="80px"
                  loading="lazy"
                  decoding="async"
                  className="size-full object-cover"
                />
              </button>
            );
          })}
        </div>
      ) : null}

      <ImageZoomDialog
        images={images}
        index={index}
        onIndexChange={setIndex}
        open={zoomOpen}
        onOpenChange={setZoomOpen}
        returnFocusTo={zoomOpener}
      />
    </div>
  );
}
