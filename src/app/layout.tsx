import type { Metadata } from "next";
import { Inter, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import { Sidebar } from "@/components/sidebar";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "ShoppDropp - System Blueprint",
  description: "Autonomous eCommerce Operating System - Technical Blueprint Interface",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body
        className={`${inter.variable} ${jetbrainsMono.variable} antialiased font-sans`}
      >
        <div className="flex min-h-screen bg-[#0a0a0f]">
          <Sidebar />
          <main className="flex-1 lg:ml-[280px] pt-[72px] lg:pt-0 overflow-auto">
            {children}
          </main>
        </div>
      </body>
    </html>
  );
}
