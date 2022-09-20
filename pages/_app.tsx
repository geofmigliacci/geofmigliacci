import { AppShell, ColorScheme, ColorSchemeProvider, MantineProvider, useMantineTheme } from '@mantine/core';
import { useColorScheme } from '@mantine/hooks';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { AppProps } from 'next/app';
import { useState } from 'react';

import { AppHeader } from '../components/AppHeader';

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
      <QueryClientProvider client={queryClient}>
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
      </QueryClientProvider>
    </>
  );
}

export default App;
