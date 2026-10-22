import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";

const css = readFileSync("app/app.css", "utf8");

function token(name: string): string {
  const match = new RegExp(`--color-${name}:\\s*(#[0-9a-f]{6})`, "i").exec(css);
  if (!match?.[1]) throw new Error(`Token --color-${name} not found`);
  return match[1];
}

function luminance(hex: string): number {
  const [r, g, b] = [1, 3, 5].map((i) => {
    const c = parseInt(hex.slice(i, i + 2), 16) / 255;
    return c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4;
  }) as [number, number, number];
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}

function contrast(a: string, b: string): number {
  const [hi, lo] = [luminance(a), luminance(b)].sort((x, y) => y - x) as [
    number,
    number,
  ];
  return (hi + 0.05) / (lo + 0.05);
}

// WCAG AA for normal text is 4.5:1. These are the text/background pairs we ship.
describe("palette contrast (WCAG AA)", () => {
  it.each([
    ["onyx", "ivory"],
    ["mocha", "ivory"],
    ["mocha", "sand"],
    ["champagne-deep", "ivory"],
    ["ivory", "onyx"],
    ["ivory", "mocha"],
    ["champagne", "onyx"],
    ["onyx", "champagne"],
  ])("%s on %s is at least 4.5:1", (fg, bg) => {
    expect(contrast(token(fg), token(bg))).toBeGreaterThanOrEqual(4.5);
  });

  // AA allows 3:1 for large text (24px+); only used on the story heading.
  it("champagne on mocha is at least 3:1 (large text only)", () => {
    expect(contrast(token("champagne"), token("mocha"))).toBeGreaterThanOrEqual(
      3,
    );
  });

  it("documents why raw champagne is not used for small text on ivory", () => {
    expect(contrast(token("champagne"), token("ivory"))).toBeLessThan(4.5);
  });
});
