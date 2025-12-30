import type { Metadata } from "next";
import { Outfit } from "next/font/google";
import "./globals.css";

const outfit = Outfit({
  subsets: ["latin"],
  display: 'swap',
  variable: '--font-outfit',
  weight: ['300', '400', '500', '700', '900'], // Including 900 for that ultra-bold look
});

export const metadata: Metadata = {
  title: "Popwise | Akıllı Pop-up ve Sepet Terk Önleme Yazılımı",
  description: "Popwise ile ziyaretçilerinizi müşteriye dönüştürün. Akıllı çıkış niyeti (exit-intent) teknolojisi, sepet kurtarma pop-up'ları ve e-posta toplama araçları. Kodlama gerekmez.",
  keywords: [
    "Popwise",
    "Popwise app",
    "pop-up oluşturucu",
    "sepet terk önleme",
    "e-ticaret dönüşüm",
    "exit intent popup",
    "akıllı popup",
    "satış artırma",
    "lead generation",
    "Shopify popup",
    "WordPress popup"
  ],
  authors: [{ name: "Popwise Team" }],
  creator: "Popwise",
  publisher: "Popwise",
  metadataBase: new URL('https://popwise-app.netlify.app'),
  openGraph: {
    title: "Popwise - %27 Daha Fazla Satış Yapın",
    description: "Sitenizden alışveriş yapmadan gidenleri durdurun. 3 dakikada kurulum.",
    url: 'https://popwise-app.netlify.app',
    siteName: 'Popwise',
    locale: 'tr_TR',
    type: 'website',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  verification: {
    google: "L0bnzqihLybAnnY85VERKwFhL_RAnJpAhGookpGsWLk"
  }
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${outfit.variable} font-sans antialiased bg-cream-50 text-coffee-900 overflow-x-hidden`}>
        {children}
      </body>
    </html>
  );
}
