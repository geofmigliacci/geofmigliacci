import { AppHeader } from '@/components/AppHeader';
import {
  AppShell,
  ColorScheme,
  ColorSchemeProvider,
  MantineProvider,
  useMantineTheme,
} from '@mantine/core';
import { useColorScheme } from '@mantine/hooks';
import {
  Hydrate,
  QueryClient,
  QueryClientProvider,
} from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { appWithTranslation } from 'next-i18next';
import { AppProps } from 'next/app';
import Head from 'next/head';
import { useState } from 'react';

function App({ Component, pageProps, router }: AppProps) {
  const theme = useMantineTheme();

  const preferredColorScheme = useColorScheme();

  const [colorScheme, setColorScheme] =
    useState<ColorScheme>(preferredColorScheme);
  const toggleColorScheme = (value?: ColorScheme) =>
    setColorScheme(value || (colorScheme === `dark` ? `light` : `dark`));

  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: 1000 * 60 * 60 * 24,
      },
    },
  });

  return (
    <>
      <Head>
        <title>Geoffrey Migliacci ‒ Portfolio</title>
        <meta
          name="viewport"
          content="minimum-scale=1, initial-scale=1, width=device-width"
        />
        <link rel="shortcut icon" href="/favicon.svg" />
        <meta
          name="description"
          content="Geoffrey Migliacci est un développeur de premier plan avec 2 ans d'expérience en développement d'applications se basant sur les dernières technologies. Ces applications sont rapides, faciles à utiliser et construites en utilisant les meilleures pratiques de développement (SOLID, YAGNI, KISS)..."
        />
      </Head>

      <QueryClientProvider client={queryClient}>
        <Hydrate state={pageProps.dehydratedState}>
          <ColorSchemeProvider
            colorScheme={colorScheme}
            toggleColorScheme={toggleColorScheme}
          >
            <MantineProvider
              withGlobalStyles
              withNormalizeCSS
              theme={{
                colors: {
                  arancia: [
                    `#FFECD3`,
                    `#FFD49D`,
                    `#FFBF6C`,
                    `#FFAB3F`,
                    `#FF9917`,
                    `#FF8A00`,
                    `#F57F17`,
                    `#FF6E00`,
                    `#FF6200`,
                    `#F45800`,
                  ],
                },
                primaryColor: `arancia`,
                colorScheme,
              }}
            >
              <AppShell
                fixed
                styles={{
                  main: {
                    background:
                      colorScheme === `dark`
                        ? theme.colors.dark[8]
                        : theme.colors.gray[0],
                  },
                }}
                header={<AppHeader />}
              >
                <Component {...pageProps} key={router.pathname} />
              </AppShell>
            </MantineProvider>
          </ColorSchemeProvider>
          <ReactQueryDevtools initialIsOpen={false} />
        </Hydrate>
      </QueryClientProvider>
    </>
  );
}

export default appWithTranslation(App);
