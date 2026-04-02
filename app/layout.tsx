import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Managerial Economics Exam Trainer",
  description: "Nederlandstalige exam trainer voor Managerial Economics met oefenvragen, mini-toetsen en formuleoverzicht.",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="nl">
      <body>{children}</body>
    </html>
  );
}
