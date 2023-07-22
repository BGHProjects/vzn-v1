"use client";

import { CacheProvider } from "@chakra-ui/next-js";
import { ChakraProvider, extendTheme } from "@chakra-ui/react";
import "../index.css";

export function Providers({ children }: { children: React.ReactNode }) {
  const theme = extendTheme({
    fonts: {
      Tektur: `Tektur, sans-serif`,
    },
  });

  return (
    <CacheProvider>
      <ChakraProvider theme={theme}>{children}</ChakraProvider>
    </CacheProvider>
  );
}
