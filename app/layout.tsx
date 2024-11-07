import type { Metadata } from "next";
import localFont from "next/font/local";
import ModalProvider from "@/providers/ModalProvider";
import "./globals.css";
import ToastProvider from "@/providers/ToastProvider";
import { ThemeProvider } from "@/providers/ThemeProvider";

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

export const metadata: Metadata = {
  title: "dzmarket",
  description: "E-commerce webiste for algeria",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <ToastProvider />
          <ModalProvider />
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
