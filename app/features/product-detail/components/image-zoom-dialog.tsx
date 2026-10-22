import { ChevronLeft, ChevronRight, X, ZoomIn, ZoomOut } from "lucide-react";
import { useState } from "react";

import { Button } from "~/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogTitle,
} from "~/components/ui/dialog";
import type { CatalogueImage } from "~/features/catalogue";
import { cn } from "~/lib/utils";

/**
 * Modal zoom. The image scrolls inside a focusable region, so keyboard users can pan
 * it with the arrow keys; the zoom toggle reports its state to assistive tech.
 */
export function ImageZoomDialog({
  images,
  index,
  onIndexChange,
  open,
  onOpenChange,
  returnFocusTo,
}: {
  images: CatalogueImage[];
  index: number;
  onIndexChange: (index: number) => void;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  /** The control that opened the dialog; Radix only restores focus to its own Trigger. */
  returnFocusTo: React.RefObject<HTMLElement | null>;
}) {
  const [zoomed, setZoomed] = useState(false);
  const image = images[index];
  if (!image) return null;

  const step = (delta: number) =>
    onIndexChange((index + delta + images.length) % images.length);

  return (
    <Dialog
      open={open}
      onOpenChange={(next) => {
        if (!next) setZoomed(false);
        onOpenChange(next);
      }}
    >
      <DialogContent
        onCloseAutoFocus={(event) => {
          event.preventDefault();
          returnFocusTo.current?.focus();
        }}
      >
        <DialogTitle className="sr-only">Enlarged product image</DialogTitle>
        <DialogDescription className="sr-only">
          {image.alt}. Image {index + 1} of {images.length}. Use the zoom button
          to magnify, and the arrow keys to move around the image.
        </DialogDescription>

        <div
          role="region"
          aria-label={`${image.alt}, scrollable`}
          // Keyboard users need focus here to scroll the magnified image with the arrow keys.
          // eslint-disable-next-line jsx-a11y/no-noninteractive-tabindex
          tabIndex={0}
          className="max-h-[75svh] overflow-auto bg-sand"
        >
          <img
            key={image.url}
            src={image.url}
            alt={image.alt}
            width={image.width}
            height={image.height}
            className={cn(
              "mx-auto h-auto transition-[width] duration-300 motion-reduce:transition-none",
              zoomed
                ? "w-[200%] max-w-none"
                : "max-h-[75svh] w-auto max-w-full",
            )}
          />
        </div>

        <div className="mt-4 flex items-center justify-between gap-3">
          <p className="text-sm text-muted-foreground" aria-hidden="true">
            {index + 1} / {images.length}
          </p>
          <div className="flex items-center gap-1">
            {images.length > 1 ? (
              <>
                <Button variant="ghost" size="icon" onClick={() => step(-1)}>
                  <ChevronLeft aria-hidden="true" />
                  <span className="sr-only">Previous image</span>
                </Button>
                <Button variant="ghost" size="icon" onClick={() => step(1)}>
                  <ChevronRight aria-hidden="true" />
                  <span className="sr-only">Next image</span>
                </Button>
              </>
            ) : null}
            <Button
              variant="outline"
              size="sm"
              aria-pressed={zoomed}
              onClick={() => setZoomed((z) => !z)}
            >
              {zoomed ? (
                <ZoomOut aria-hidden="true" />
              ) : (
                <ZoomIn aria-hidden="true" />
              )}
              {zoomed ? "Zoom out" : "Zoom in"}
            </Button>
            <DialogClose asChild>
              <Button variant="ghost" size="icon">
                <X aria-hidden="true" />
                <span className="sr-only">Close</span>
              </Button>
            </DialogClose>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
