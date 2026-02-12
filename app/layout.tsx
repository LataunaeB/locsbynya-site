import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Locs by Nya - Professional Loctician Services in Los Angeles",
  description: "Book your appointment for professional loctician services including starter locs, retwists, maintenance, and repairs. Located at RVM Twists and Cuts in Los Angeles.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
