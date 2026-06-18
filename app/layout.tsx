import type { Metadata } from "next";
import { Barlow, Bebas_Neue, Oswald } from "next/font/google";
import "./globals.css";
import { LanguageProvider } from "@/lib/i18n/LanguageProvider";

const bebas = Bebas_Neue({
  subsets: ["latin"],
  variable: "--font-bebas",
  weight: "400",
  display: "swap",
});

const oswald = Oswald({
  subsets: ["latin"],
  variable: "--font-oswald",
  weight: ["400", "600", "700"],
  display: "swap",
});

const barlow = Barlow({
  subsets: ["latin"],
  variable: "--font-barlow",
  weight: ["400", "500", "600", "700"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "ROBERT'S INK — Tattoo Artist",
  description:
    "Custom tattoo artist specializing in bold, authentic ink. Motorcycles, rock music, and raw designs. Book your session at ROBERT'S INK.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${bebas.variable} ${oswald.variable} ${barlow.variable}`}>
      <body className="bg-[#0A0A0A] text-[#F0F0F0] font-sans antialiased">
        <LanguageProvider>
          {children}
        </LanguageProvider>
      </body>
    </html>
  );
}
