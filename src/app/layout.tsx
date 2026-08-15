import type { Metadata, Viewport } from "next";
import type { ReactNode } from "react";

import {
  PWA_APP_DESCRIPTION,
  PWA_APP_NAME,
  PWA_APP_SHORT_NAME,
  PWA_BACKGROUND_COLOR,
  PWA_THEME_COLOR,
} from "@/lib/pwa/app-metadata";

import "./globals.css";

import AppSerwistProvider from "./serwist-provider";
import Providers from "./providers";

const APP_TITLE_TEMPLATE = `%s | ${PWA_APP_SHORT_NAME}`;

export const metadata: Metadata = {
  applicationName: PWA_APP_NAME,
  title: {
    default: PWA_APP_NAME,
    template: APP_TITLE_TEMPLATE,
  },
  description: PWA_APP_DESCRIPTION,
  manifest: "/manifest.webmanifest",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: PWA_APP_SHORT_NAME,
  },
  formatDetection: {
    telephone: false,
  },
  icons: {
    icon: [
      { url: "/favicon.png", sizes: "32x32", type: "image/png" },
      { url: "/icons/icon-192x192.png", sizes: "192x192", type: "image/png" },
      { url: "/icons/icon-512x512.png", sizes: "512x512", type: "image/png" },
    ],
    apple: [{ url: "/icons/apple-touch-icon.png", sizes: "180x180", type: "image/png" }],
    shortcut: [{ url: "/favicon.png", type: "image/png" }],
  },
};

export const viewport: Viewport = {
  themeColor: PWA_THEME_COLOR,
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
};

type Props = {
  children: ReactNode;
};

export default function RootLayout({ children }: Props) {
  return (
    <html lang="en">
      <body>
        <AppSerwistProvider>
          <Providers>{children}</Providers>
        </AppSerwistProvider>
      </body>
    </html>
  );
}
