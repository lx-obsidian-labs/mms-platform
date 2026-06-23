import type { Metadata } from "next";
import { Bebas_Neue, Montserrat, Inter } from "next/font/google";
import { COMPANY } from "@/lib/constants";
import { ChatWidget } from "@/components/chat/chat-widget";
import "./globals.css";

const bebasNeue = Bebas_Neue({
  weight: "400",
  variable: "--font-bebas-neue",
  subsets: ["latin"],
  display: "swap",
});

const montserrat = Montserrat({
  weight: ["400", "500", "600", "700", "800"],
  variable: "--font-montserrat",
  subsets: ["latin"],
  display: "swap",
});

const inter = Inter({
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_APP_URL || "https://mpumalangaminingsolutions.com"
  ),
  title: {
    template: `%s | ${COMPANY.name}`,
    default: COMPANY.name,
  },
  description: COMPANY.description,
  keywords: [
    "mining training",
    "heavy machinery training",
    "mining certification South Africa",
    "mining courses Mpumalanga",
    "SHE compliance training",
    "underground mining",
    "surface mining",
    "mining safety",
    "MMS",
    "Mpumalanga Mining Solutions",
  ],
  authors: [{ name: COMPANY.name }],
  creator: COMPANY.name,
  publisher: COMPANY.name,
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true },
  },
  openGraph: {
    type: "website",
    locale: "en_ZA",
    url: process.env.NEXT_PUBLIC_APP_URL || "https://mpumalangaminingsolutions.com",
    siteName: COMPANY.name,
    title: COMPANY.name,
    description: COMPANY.description,
  },
  twitter: {
    card: "summary_large_image",
    title: COMPANY.name,
    description: COMPANY.description,
  },
  alternates: {
    canonical:
      process.env.NEXT_PUBLIC_APP_URL || "https://mpumalangaminingsolutions.com",
  },
  category: "Education",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="en"
      className={`${bebasNeue.variable} ${montserrat.variable} ${inter.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-background text-foreground">
        {children}
        <ChatWidget />
      </body>
    </html>
  );
}
