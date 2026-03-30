import type { Metadata, Viewport } from "next";
import { Bricolage_Grotesque, Geist, Merriweather } from "next/font/google";
import { ToastProvider } from "@/app/components/toast";
import "./globals.css";

const fontSans = Geist({
  variable: "--font-sans",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

const fontMono = Bricolage_Grotesque({
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
  icons: {
    icon: "/favicon.ico",
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
        <meta name="format-detection" content="telephone=no" />
      </head>
      <body
        className={`${fontSans.variable} ${fontMono.variable} text-normal font-sans antialiased bg-gray-100 text-sm font-medium`}
      >
        <ToastProvider>{children}</ToastProvider>
      </body>
    </html>
  );
}
