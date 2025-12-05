import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Locs by Nya - Book Your Appointment",
  description: "Professional loctician services - Book your appointment today",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}



