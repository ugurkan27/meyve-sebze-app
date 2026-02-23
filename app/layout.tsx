import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "GKV IB PROJECT (GOKTUG, KAAN, ESLEM)",
  description: "Fruit & Vegetable catalog with admin panel",
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