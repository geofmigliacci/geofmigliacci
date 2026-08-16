import {
  type RenderOptions,
  render as rtlRender,
} from "@testing-library/react";
import { NextIntlClientProvider } from "next-intl";
import type { ReactElement, ReactNode } from "react";
import messages from "@/messages/fr.json";

function Providers({ children }: { children: ReactNode }) {
  return (
    <NextIntlClientProvider locale="fr" messages={messages}>
      {children}
    </NextIntlClientProvider>
  );
}

export * from "@testing-library/react";

/** next-intl's `Link` and `usePathname` both read the provider, so every render needs it. */
export function render(
  ui: ReactElement,
  options?: Omit<RenderOptions, "wrapper">,
) {
  return rtlRender(ui, { wrapper: Providers, ...options });
}
