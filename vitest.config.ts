import { defaultExclude, defineConfig } from "vitest/config";

export default defineConfig({
  resolve: {
    tsconfigPaths: true,
  },
  test: {
    environment: "node",
    setupFiles: ["./vitest.setup.ts"],
    // Inlined so Vite resolves it: next-intl imports `next/navigation`
    // extensionless, which Node cannot resolve from pnpm's nested layout.
    server: { deps: { inline: ["next-intl"] } },
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
        "src/app/**/layout.tsx",
        "src/app/**/loading.tsx",
        // `**` because these sit under `[locale]`: an exact path silently stops
        // matching and drags uncovered code into the denominator.
        "src/app/**/not-found.tsx",
        "src/app/**/error.tsx",
        "src/app/global-error.tsx",
        "src/app/global-not-found.tsx",
        // Test scaffolding, like `test-utils` above it.
        "src/i18n/server.mock.ts",
        "src/components/decorative/**",
        "src/test-utils.tsx",
        "src/components/mdx/**",
        "src/components/diagram/scenes/**",
      ],
    },
  },
});
