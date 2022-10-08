import { ColorScheme, ColorSchemeProvider, MantineProvider, useMantineTheme } from '@mantine/core';
import { useColorScheme, useHotkeys } from '@mantine/hooks';
import { Hydrate, QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { AppProps } from 'next/app';
import Head from 'next/head';
import { useState } from 'react';

import { AppShell } from '../components/_app/AppShell';
import { AppHeader } from '../components/AppHeader';

function App({
  Component,
  pageProps,
  router,
}: AppProps<{
  dehydrate: any;
}>) {
  const theme = useMantineTheme();

  const preferredColorScheme = useColorScheme();

  const [colorScheme, setColorScheme] =
    useState<ColorScheme>(preferredColorScheme);
  const toggleColorScheme = (value?: ColorScheme) =>
    setColorScheme(value || (colorScheme === `dark` ? `light` : `dark`));

  useHotkeys([
    [
      "alt+mod+shift+X",
      () => {
        window.location.href = "https://www.youtube.com/watch?v=dQw4w9WgXcQ";
      },
    ],
  ]);

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
        <meta charSet="UTF-8" />
        <link rel="shortcut icon" href="/favicon.svg" />

        <title>Geoffrey Migliacci ‒ Portfolio</title>

        <meta
          name="description"
          content="Geoffrey Migliacci est un développeur avec 4 ans d'expérience dans le développement de solutions informatiques, du front-end, au back-end en passant par l'architecture afin de fournir une solution rapide, fiable et durable."
        />
        <meta
          name="keywords"
          content="HTML, CSS, JavaScript, NextJs, Portfolio, Reims, Fullstack, Developpeur, Typescript, NestJs, PHP, Angular, VueJs, .Net Core, SQL, MSSQL, Jest, REST"
        />
        <meta name="author" content="Geoffrey Migliacci" />
        <meta
          name="viewport"
          content="minimum-scale=1, initial-scale=1, width=device-width"
        />

        <meta itemProp="name" content="Geoffrey Migliacci ‒ Portfolio" />
        <meta
          itemProp="description"
          content="Geoffrey Migliacci est un développeur avec 4 ans d'expérience dans le développement de solutions informatiques, du front-end, au back-end en passant par l'architecture afin de fournir une solution rapide, fiable et durable."
        />
        <meta itemProp="image" content="https://migliacci.fr/og.jpg" />

        <meta property="og:url" content="https://migliacci.fr" />
        <meta property="og:type" content="website" />
        <meta property="og:title" content="Geoffrey Migliacci ‒ Portfolio" />
        <meta
          property="og:description"
          content="Geoffrey Migliacci est un développeur avec 4 ans d'expérience dans le développement de solutions informatiques, du front-end, au back-end en passant par l'architecture afin de fournir une solution rapide, fiable et durable."
        />
        <meta property="og:image" content="https://migliacci.fr/og.jpg" />

        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Geoffrey Migliacci ‒ Portfolio" />
        <meta
          name="twitter:description"
          content="Geoffrey Migliacci est un développeur avec 4 ans d'expérience dans le développement de solutions informatiques, du front-end, au back-end en passant par l'architecture afin de fournir une solution rapide, fiable et durable."
        />
        <meta name="twitter:image" content="https://migliacci.fr/og.jpg" />
      </Head>

      <QueryClientProvider client={queryClient}>
        <Hydrate state={pageProps.dehydrate}>
          <ColorSchemeProvider
            colorScheme={colorScheme}
            toggleColorScheme={toggleColorScheme}
          >
            <MantineProvider
              withGlobalStyles
              withNormalizeCSS
              theme={{
                globalStyles: (theme) => ({
                  "*::-webkit-scrollbar": {
                    width: "0.5rem",
                  },
                  "*::-webkit-scrollbar-track": {
                    "-webkit-box-shadow": "inset 0 0 6px rgba(0, 0, 0 ,0.00)",
                  },
                  "*::-webkit-scrollbar-thumb": {
                    background: `linear-gradient(-60deg, ${
                      theme.colorScheme === `dark`
                        ? theme.colors[theme.primaryColor][2]
                        : theme.colors[theme.primaryColor][8]
                    } 0%, ${theme.colors[theme.primaryColor][7]} 100%)`,
                  },
                }),
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

export default App;
