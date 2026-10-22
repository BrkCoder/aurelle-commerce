import { describe, expect, it } from "vitest";

import { formatPrice } from "./format";

describe("formatPrice", () => {
  it("formats integer cents as whole-dollar currency", () => {
    expect(formatPrice(489000)).toBe("$4,890");
  });

  it("handles zero", () => {
    expect(formatPrice(0)).toBe("$0");
  });
});
