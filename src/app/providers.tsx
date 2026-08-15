"use client";

import { ReactNode } from "react";

import { AppRouterCacheProvider } from "@mui/material-nextjs/v16-appRouter";
import { CssBaseline, ThemeProvider, createTheme } from "@mui/material";

type Props = {
  children: ReactNode;
};

const theme = createTheme({
  cssVariables: true,

  palette: {
    mode: "light",

    primary: {
      main: "#1976d2",
    },

    secondary: {
      main: "#9c27b0",
    },
  },

  shape: {
    borderRadius: 8,
  },
});

export default function Providers({ children }: Props) {
  return (
    <AppRouterCacheProvider>
      <ThemeProvider theme={theme}>
        <CssBaseline />

        {children}
      </ThemeProvider>
    </AppRouterCacheProvider>
  );
}
