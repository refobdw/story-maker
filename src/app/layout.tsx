import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Providers } from "@/components/Providers";
import { Header } from "@/components/Header";
import clsx from "clsx";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "StoryMaker",
  description: "AI-powered story and character generator",
};

export const viewport: Viewport = {
  themeColor: "#020617",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={clsx(inter.className, "bg-slate-950 text-slate-100 min-h-screen flex flex-col")}>
        <Providers>
          <Header />
          <main className="flex-1 container mx-auto p-6 md:p-12">
            {children}
          </main>
        </Providers>
      </body>
    </html>
  );
}
