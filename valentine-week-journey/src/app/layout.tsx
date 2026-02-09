import type { Metadata } from "next";
import "./globals.css";
import { JourneyProvider } from "@/context/JourneyContext";
import { Navbar } from "@/components/ui/Navbar";

export const metadata: Metadata = {
  metadataBase: new URL("https://lovesodyssey.vercel.app"),
  title: "Love's Odyssey: A Valentine's Week Adventure",
  description: "Embark on a magical 8-day interactive 3D journey of love. Solve puzzles, unlock romantic messages, and celebrate Valentine's week with a unique digital experience.",
  keywords: ["valentine", "love journey", "3d website", "interactive gift", "virtual valentine", "puzzle game", "digital love letter"],
  authors: [{ name: "Shoaib Mohammed" }],
  openGraph: {
    title: "Love's Odyssey | Valentine's Week Journey",
    description: "An interactive 3D love story and puzzle game for the perfect Valentine's gift.",
    type: "website",
    url: "https://lovesodyssey.vercel.app",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <meta name="theme-color" content="#FFB3C1" />
      </head>
      <body className="antialiased">
        <JourneyProvider>
          <Navbar />
          {children}
        </JourneyProvider>
      </body>
    </html>
  );
}
