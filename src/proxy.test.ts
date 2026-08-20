import type { NextRequest } from "next/server";
import { describe, expect, it, vi } from "vitest";
import proxy, { config } from "@/proxy";

const negotiate = vi.hoisted(() => vi.fn());

vi.mock("next-intl/middleware", () => ({ default: () => negotiate }));

const proxied = (pathname: string) => {
  negotiate.mockReturnValue({ headers: new Headers() });

  return proxy({ nextUrl: { pathname } } as unknown as NextRequest);
};

describe("proxy", () => {
  it("varies the negotiated redirect on what decided it", () => {
    expect(proxied("/blog").headers.get("Vary")).toBe(
      "Accept-Language, Cookie",
    );
  });

  it("leaves a prefixed URL to the Vary Next writes itself", () => {
    expect(proxied("/en/blog").headers.get("Vary")).toBeNull();
  });

  it("reads a bare locale as prefixed", () => {
    expect(proxied("/fr").headers.get("Vary")).toBeNull();
  });

  it("does not read a path that merely starts with one as prefixed", () => {
    expect(proxied("/english").headers.get("Vary")).toBe(
      "Accept-Language, Cookie",
    );
  });
});

describe("the matcher", () => {
  const runsOn = (pathname: string) =>
    new RegExp(`^${config.matcher[0]}$`).test(pathname);

  it.each([
    "/",
    "/about",
    "/blog",
    "/en/blog",
    "/fr/blog/ef-core-lazy-loading",
    "/fr/blog/work-in-progress.draft",
    // An extension counts at the end of a path and nowhere else.
    "/fr/blog/le-fichier-sitemap.xml-explique",
  ])("runs on %s", (pathname) => {
    expect(runsOn(pathname)).toBe(true);
  });

  it.each([
    "/_next/static/chunk.js",
    "/_next/image",
    "/sitemap.xml",
    "/robots.txt",
    "/manifest.webmanifest",
    "/favicon.ico",
    "/icon-192.png",
    "/geofmigliacci.jpg",
    "/about/20220714_200312.jpg",
  ])("skips %s", (pathname) => {
    expect(runsOn(pathname)).toBe(false);
  });
});
