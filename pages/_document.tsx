import { createGetInitialProps } from '@mantine/next';
import Document, { Head, Html, Main, NextScript } from 'next/document';

const getInitialProps = createGetInitialProps();

export default class _Document extends Document {
  static getInitialProps = getInitialProps;

  render() {
    return (
      <Html>
        <Head>
          <meta charSet="UTF-8" />
          <link rel="shortcut icon" href="/favicon.svg" />
          
          <title>Geoffrey Migliacci ‒ Portfolio</title>

          <meta
            name="description"
            content="Geoffrey Migliacci est un développeur avec 4 ans d'expérience dans le développement de solutions informatiques, du front-end, au back-end en passant par l'architecture afin de fournir une solution rapide, fiable et durable."
          />
          <meta name="keywords" content="HTML, CSS, JavaScript, NextJs, Portfolio, Reims, Fullstack, Developpeur, Typescript, NestJs, PHP, Angular, VueJs, .Net Core, SQL, MSSQL, Jest, REST" />
          <meta name="author" content="Geoffrey Migliacci" />
          <meta
            name="viewport"
            content="minimum-scale=1, initial-scale=1, width=device-width"
          />

          <meta itemProp="name" content="Geoffrey Migliacci ‒ Portfolio"/>
          <meta itemProp="description" content="Geoffrey Migliacci est un développeur avec 4 ans d'expérience dans le développement de solutions informatiques, du front-end, au back-end en passant par l'architecture afin de fournir une solution rapide, fiable et durable."/>
          <meta itemProp="image" content="https://migliacci.fr/og.jpg"/>

          <meta property="og:url" content="https://migliacci.fr"/>
          <meta property="og:type" content="website"/>
          <meta property="og:title" content="Geoffrey Migliacci ‒ Portfolio"/>
          <meta property="og:description" content="Geoffrey Migliacci est un développeur avec 4 ans d'expérience dans le développement de solutions informatiques, du front-end, au back-end en passant par l'architecture afin de fournir une solution rapide, fiable et durable."/>
          <meta property="og:image" content="https://migliacci.fr/og.jpg"/>

          <meta name="twitter:card" content="summary_large_image"/>
          <meta name="twitter:title" content="Geoffrey Migliacci ‒ Portfolio"/>
          <meta name="twitter:description" content="Geoffrey Migliacci est un développeur avec 4 ans d'expérience dans le développement de solutions informatiques, du front-end, au back-end en passant par l'architecture afin de fournir une solution rapide, fiable et durable."/>
          <meta name="twitter:image" content="https://migliacci.fr/og.jpg"/>
        </Head>
        <body>
          <Main />
          <NextScript />
        </body>
      </Html>
    );
  }
}
