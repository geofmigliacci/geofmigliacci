import { defaultExclude, defineConfig } from "vitest/config";

export default defineConfig({
  resolve: {
    tsconfigPaths: true,
  },
  test: {
    environment: "node",
    setupFiles: ["./vitest.setup.ts"],
    // `e2e/**` because Vitest's default `include` claims `*.spec.ts` too.
    exclude: [...defaultExclude, ".claude/**", ".next/**", "e2e/**"],
    coverage: {
      provider: "v8",
      reporter: ["text", "lcov"],
      include: ["src/**"],
      exclude: [
        "src/components/ui/**",
        "src/app/**/opengraph-image.tsx",
        "src/lib/og-image.tsx",
        "src/app/**/page.tsx",
        "src/app/layout.tsx",
        "src/app/**/loading.tsx",
        "src/app/not-found.tsx",
        "src/app/error.tsx",
        "src/app/global-error.tsx",
        "src/components/decorative/**",
        "src/components/mdx/**",
        "src/components/diagram/scenes/**",
      ],
    },
  },
});
