import type { Metadata, Viewport } from "next";
import { Bricolage_Grotesque, Geist, Merriweather } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-sans",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

const geistMono = Bricolage_Grotesque({
  variable: "--font-mono",
  subsets: ["latin"],
});

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  themeColor: "#8b5cf6",
};

export const metadata: Metadata = {
  title: "Sellora - Bisnis Lebih Cerdas",
  description: "Platform manajemen bisnis untuk pengusaha Muslim di Indonesia",
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "Sellora",
  },
  icons: {
    icon: "/favicon.ico",
    apple: "/apple-touch-icon.svg",
  },
  keywords: ["business", " POS", "inventory", "invoice", "Indonesia"],
  authors: [{ name: "Sellora" }],
  openGraph: {
    type: "website",
    title: "Sellora - Bisnis Lebih Cerdas",
    description:
      "Platform manajemen bisnis untuk pengusaha Muslim di Indonesia",
    siteName: "Sellora",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id" data-scroll-behavior="smooth">
      <head>
        <link rel="apple-touch-icon" href="/apple-touch-icon.svg" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="apple-mobile-web-app-title" content="Sellora" />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="format-detection" content="telephone=no" />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} text-normal antialiased bg-gray-100 text-sm font-medium`}
      >
        {children}
        <script
          dangerouslySetInnerHTML={{
            __html: `
              if ('serviceWorker' in navigator) {
                window.addEventListener('load', () => {
                  navigator.serviceWorker.register('/sw.js')
                    .then((registration) => {
                      console.log('SW registered:', registration);
                    })
                    .catch((error) => {
                      console.log('SW registration failed:', error);
                    });
                });
              }
            `,
          }}
        />
      </body>
    </html>
  );
}
