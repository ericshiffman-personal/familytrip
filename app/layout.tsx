import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Tiny Suitcase: Plan the family trip.",
  description:
    "AI-powered family trip planning built around naps, meals, hotel realities, and the way your family actually travels. Get a realistic itinerary, one opinionated hotel pick, restaurant ideas, and a packing list.",
  openGraph: {
    title: "Tiny Suitcase: Plan the family trip.",
    description: "Plan around naps, snacks, and real life.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full">
      <body className="min-h-full flex flex-col antialiased">{children}</body>
    </html>
  );
}
