import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "FamilyTrip — We'll make the call.",
  description:
    "The travel planner for families who overthink everything. Tell us about your family — we'll give you a confident recommendation, explain every tradeoff, and build the full plan.",
  openGraph: {
    title: "FamilyTrip — We'll make the call.",
    description: "Opinionated travel planning for real families.",
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
