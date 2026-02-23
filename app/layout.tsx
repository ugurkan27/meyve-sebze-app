import "./globals.css";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "GKV IB PROJECT (GOKTUG, KAAN, ESLEM)",
  description: "Fruit & Vegetable Catalog - IB Project",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}