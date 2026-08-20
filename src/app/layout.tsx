import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import Script from "next/script";
import "./globals.css";
import { Toaster } from "react-hot-toast";
import GlobalProvider from "@/Providers/GlobalProvider";
import CartNotifier from "@/utils/cartUtils/CartNotifier";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
  display: "swap",
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Pervesh Rasayan Pvt. Ltd. ",
  description: "Premium chemical products and solutions",
  icons: {
    icon: "/favicon.ico"
  }
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
        suppressHydrationWarning={true}
      >
          <GlobalProvider>
            <Toaster position="top-right" />
            <CartNotifier />
            {children}
          </GlobalProvider>
          <Script
            src="https://cdn.botpress.cloud/webchat/v3.7/inject.js"
            strategy="afterInteractive"
          />
          <Script
            src="https://files.bpcontent.cloud/2026/08/20/17/20260820172635-2I83AB7Z.js"
            strategy="afterInteractive"
          />
      </body>
    </html>
  );
}
