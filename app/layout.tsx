import type { Metadata } from "next";
import { Geist } from "next/font/google";
import "./globals.css";

const geist = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "FamilyTrip — Stop Researching, Start Going",
  description:
    "The travel planner for families who overthink everything. Get confident, personalized recommendations tailored to your kids' ages, nap schedules, and real life.",
  openGraph: {
    title: "FamilyTrip",
    description: "Confident travel planning for real families.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${geist.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
