import type { Metadata } from "next";
import "./globals.css";
import { JourneyProvider } from "@/context/JourneyContext";

export const metadata: Metadata = {
  title: "Valentine's Week Journey | Our Love Story",
  description: "A special interactive journey celebrating our love throughout Valentine's week. Solve puzzles, unlock messages, and celebrate our story together.",
  keywords: ["valentine", "love", "couples", "interactive", "journey", "puzzle"],
  authors: [{ name: "With Love" }],
  openGraph: {
    title: "Valentine's Week Journey",
    description: "An interactive love story puzzle game for Valentine's week",
    type: "website",
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
        <link rel="icon" href="/favicon.ico" />
        <meta name="theme-color" content="#FFB3C1" />
      </head>
      <body className="antialiased">
        <JourneyProvider>
          {children}
        </JourneyProvider>
      </body>
    </html>
  );
}
