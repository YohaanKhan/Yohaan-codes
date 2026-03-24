import type { Metadata } from "next";
import { JetBrains_Mono } from "next/font/google";
import Sidebar from "@/components/layout/Sidebar";
import "./globals.css";

const mono = JetBrains_Mono({ subsets: ["latin"], variable: "--font-mono" });

export const metadata: Metadata = {
  title: "DSA Notes",
  description: "SM-2 based DSA Note Tracking",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={mono.variable} suppressHydrationWarning>
      <body className="flex h-screen overflow-hidden" suppressHydrationWarning>
        <Sidebar />
        {children}
      </body>
    </html>
  );
}
