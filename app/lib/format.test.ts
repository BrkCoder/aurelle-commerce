import { describe, expect, it } from "vitest";

import { formatPrice } from "./format";

describe("formatPrice", () => {
  it("formats integer cents as whole-dollar currency", () => {
    expect(formatPrice(489000)).toBe("$4,890");
  });

  it("handles zero", () => {
    expect(formatPrice(0)).toBe("$0");
  });

  it("keeps cents when the amount is not whole", () => {
    expect(formatPrice(1250)).toBe("$12.50");
    expect(formatPrice(99)).toBe("$0.99");
  });

  it("formats other currencies", () => {
    expect(formatPrice(250000, "EUR")).toBe("€2,500");
  });

  it("does not suffer floating-point drift on large amounts", () => {
    expect(formatPrice(1_234_567_89)).toBe("$1,234,567.89");
  });
});
