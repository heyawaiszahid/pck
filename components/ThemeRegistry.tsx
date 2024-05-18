"use client";

import CssBaseline from "@mui/material/CssBaseline";
import {
  Experimental_CssVarsProvider as CssVarsProvider,
  experimental_extendTheme as extendTheme,
  getInitColorSchemeScript,
} from "@mui/material/styles";
import { Roboto } from "next/font/google";
import { Poppins } from "next/font/google";

declare module "@mui/material/styles" {
  interface PaletteOptions {
    dashboardMainBg: string;
  }
  interface Palette {
    dashboardMainBg: string;
  }
}

const roboto = Roboto({
  weight: ["300", "400", "500", "700"],
  subsets: ["latin"],
  display: "swap",
});

export default function ThemeRegistry({ children }: { children: React.ReactNode }) {
  const theme = extendTheme({
    colorSchemes: {
      light: {
        palette: {
          dashboardMainBg: "var(--mui-palette-grey-100)",
        },
      },
      dark: {
        palette: {
          dashboardMainBg: "var(--mui-palette-grey-900)",
        },
      },
    },
    typography: {
      fontFamily: roboto.style.fontFamily,
    },
  });

  return (
    <CssVarsProvider theme={theme}>
      <CssBaseline />
      {getInitColorSchemeScript()}
      {children}
    </CssVarsProvider>
  );
}
