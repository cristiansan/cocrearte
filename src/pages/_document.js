import { Html, Head, Main, NextScript } from 'next/document';

export default function Document() {
  return (
    <Html lang="es">
      <Head>
        <meta charSet="utf-8" />
        <meta name="description" content="Plataforma web para gestión de psicólogos y terapeutas en Espacio Cocrearte" />
        <meta name="keywords" content="psicología, terapia, gestión, espacio cocrearte" />
        <meta name="author" content="Espacio Cocrearte" />
        
        {/* Favicon */}
        <link rel="icon" href="/favicon.ico" />
        
        {/* Google Fonts */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        
        {/* Open Graph */}
        <meta property="og:title" content="Cocrearte - Gestión de Terapeutas" />
        <meta property="og:description" content="Plataforma web para gestión de psicólogos y terapeutas" />
        <meta property="og:type" content="website" />
        <meta property="og:site_name" content="Cocrearte" />
      </Head>
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  );
} 