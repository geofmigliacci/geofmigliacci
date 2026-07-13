import { defaultExclude, defineConfig } from "vitest/config";

export default defineConfig({
  resolve: {
    tsconfigPaths: true,
  },
  test: {
    environment: "node",
    setupFiles: ["./vitest.setup.ts"],
    exclude: [...defaultExclude, ".claude/**", ".next/**"],
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
        "src/components/decorative/**",
      ],
    },
  },
});
