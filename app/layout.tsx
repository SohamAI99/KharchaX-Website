import type { Metadata } from "next";
import { Inter } from "next/font/google";
import Navbar from "@/components/Navbar";
import AuthProvider from "@/components/AuthProvider";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "KharchaX | Split smart. No drama.",
  description: "AI-powered group expense management and financial planning platform.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${inter.variable} h-full antialiased`}
    >
      <body className="min-h-screen flex flex-col font-sans bg-background text-foreground">
        <AuthProvider>
          <Navbar />
          <main className="pt-20 pb-16 max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8 w-full flex-grow">
            {children}
          </main>
        </AuthProvider>
      </body>
    </html>
  );
}
