"use client";

import "./globals.css";
import Header from "../components/Header";
import Footer from "../components/Footer";
import { Providers } from "./providers";

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ko">
      <head>
        <title>YDJ</title>
      </head>
      <body className="flex flex-col min-h-screen">
        <Providers>
          <Header />
          <main className="flex-1 bg-gray-100 overflow-x-hidden py-16">
            <div className="max-w-4xl mx-auto px-4">
              {children}
            </div>
          </main>
          <Footer />
        </Providers>
      </body>
    </html>
  );
}
