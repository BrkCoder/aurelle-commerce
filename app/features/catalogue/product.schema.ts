import { z } from "zod";

import { categorySlugs } from "./categories";

export const productSchema = z.object({
  id: z.string().min(1),
  slug: z.string().regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/),
  name: z.string().min(1),
  category: z.enum(categorySlugs),
  material: z.string().min(1),
  /** Integer minor units (cents). Formatting happens at the edge. */
  priceCents: z.number().int().positive(),
  description: z.string().min(1),
  featured: z.boolean(),
});

export type Product = z.infer<typeof productSchema>;
